import datetime
import functools
import hashlib
import json
import os
import re
import time
from pathlib import Path
from zoneinfo import ZoneInfo

import functions_framework
from google import genai
from google.cloud import firestore, storage
from google.genai import types
from pydantic import BaseModel

DATABASE = os.environ.get("FIRESTORE_DATABASE", "dainingrit")
IMAGE_BUCKET = os.environ.get("IMAGE_BUCKET", "vietrochack-lab-dainingrit")
TEXT_MODEL = os.environ.get("GEMINI_TEXT_MODEL", "gemini-flash-latest")
IMAGE_MODEL = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3.1-flash-image")
PER_IP_HOURLY_LIMIT = int(os.environ.get("PER_IP_HOURLY_LIMIT", "5"))
GLOBAL_DAILY_LIMIT = int(os.environ.get("GLOBAL_DAILY_LIMIT", "150"))
MAX_INGREDIENTS = 15
MAX_TEXT_LEN = 60

# RIT's dining halls run on Eastern time, and Cloud Functions run in UTC.
CAMPUS_TZ = ZoneInfo("America/New_York")
MENU = json.loads((Path(__file__).parent / "menu.json").read_text(encoding="utf-8"))["menu"]


class Ingredient(BaseModel):
    name: str
    station: str


class Recipe(BaseModel):
    foodName: str
    ingrs: list[Ingredient]
    recipe: list[str]


@functools.cache
def db():
    return firestore.Client(database=DATABASE)


@functools.cache
def bucket():
    return storage.Client().bucket(IMAGE_BUCKET)


@functools.cache
def gemini():
    return genai.Client(api_key=os.environ["GEMINI_API_KEY"])


@functions_framework.http
def api(request):
    path = request.path.rstrip("/")
    method = request.method

    if path == "/api/recipes" and method == "POST":
        return create_recipe(request)
    if path == "/api/ranking" and method == "GET":
        return ({"response": todays_ranking()}, 200)

    match = re.fullmatch(r"/api/recipes/([A-Za-z0-9]{1,64})(/like)?", path)
    if match:
        recipe_id, like = match.groups()
        if not like and method == "GET":
            return get_recipe(recipe_id)
        if like and method == "POST":
            return like_recipe(recipe_id, request)

    return ({"error": "Not found"}, 404)


def create_recipe(request):
    body = request.get_json(silent=True) or {}
    cuisine = str(body.get("cuisine", "")).strip()[:MAX_TEXT_LEN]
    ingrs = [str(i).strip()[:MAX_TEXT_LEN] for i in body.get("ingrs", []) if str(i).strip()]
    if not cuisine:
        return ({"error": "Pick a cuisine first."}, 400)
    if len(ingrs) > MAX_INGREDIENTS:
        return ({"error": f"At most {MAX_INGREDIENTS} ingredients, please."}, 400)

    limited = rate_limited(client_ip(request))
    if limited:
        return ({"error": limited}, 429)

    recipe = generate_recipe(cuisine, ingrs)
    if recipe is None:
        return ({"error": "Couldn't come up with a recipe for that. Try other ingredients."}, 422)

    recipe_ref = db().collection("recipes").document()
    data = recipe.model_dump()
    data["timestamp"] = int(time.time())
    data["voteCount"] = 0
    data["imageUrl"] = generate_image(recipe, recipe_ref.id)
    recipe_ref.set(data)

    db().collection("recipe_requests").add(
        {"cuisine": cuisine, "ingrs": ingrs, "timestamp": data["timestamp"], "recipeId": recipe_ref.id}
    )
    return ({"response": {**data, "id": recipe_ref.id}}, 200)


def generate_recipe(cuisine, ingrs):
    system_prompt = f"""
Given below is a list of food and ingredients at a dining hall, where each station's name is
listed in capitals, followed by the ingredients available at that station. Given a type of
cuisine from the user, generate a way to use the ingredients currently at the dining hall to
make a new dish inspired by that cuisine. The user does NOT have ANY cooking utensils, so they
cannot cook their food. The user also has a list of preferred ingredients; take them into
account as best you can.

For each ingredient, give the station it comes from. Do not include station names in the
recipe steps. If nothing sensible can be made, set foodName to "none".

The user's preferred ingredients: {ingrs}
Here are the ingredients at the dining hall: {MENU}
"""
    response = gemini().models.generate_content(
        model=TEXT_MODEL,
        contents=f"I would like to eat {cuisine}-inspired food today. What can I use from my dining hall?",
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            response_mime_type="application/json",
            response_schema=Recipe,
        ),
    )
    recipe = response.parsed
    if recipe is None or recipe.foodName.strip().lower() == "none" or not recipe.ingrs:
        return None
    return recipe


def generate_image(recipe, recipe_id):
    """Returns a public image URL, or None so the frontend falls back to a placeholder."""
    prompt = (
        "Generate a presentable photo of a dish to be put on a menu, based on this recipe: "
        f"{recipe.model_dump_json()}. Show only the dish, without any text or flair."
    )
    try:
        response = gemini().models.generate_content(
            model=IMAGE_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(response_modalities=["IMAGE"]),
        )
        image = next(
            p.inline_data for p in response.candidates[0].content.parts if p.inline_data
        )
        blob = bucket().blob(f"images/{recipe_id}")
        blob.upload_from_string(image.data, content_type=image.mime_type or "image/png")
        return f"https://storage.googleapis.com/{IMAGE_BUCKET}/images/{recipe_id}"
    except Exception as e:  # a missing image shouldn't cost the user their recipe
        print(f"Image generation failed for {recipe_id}: {e!r}")
        return None


def get_recipe(recipe_id):
    doc = db().collection("recipes").document(recipe_id).get()
    if not doc.exists:
        return ({"error": "Recipe not found"}, 404)
    return ({"response": {**doc.to_dict(), "id": doc.id}}, 200)


def like_recipe(recipe_id, request):
    body = request.get_json(silent=True) or {}
    ref = db().collection("recipes").document(recipe_id)
    if not ref.get().exists:
        return ({"error": "Recipe not found"}, 404)
    ref.update({"voteCount": firestore.Increment(1 if body.get("liked", True) else -1)})
    return ({"response": {"voteCount": ref.get().get("voteCount")}}, 200)


def todays_ranking():
    now = datetime.datetime.now(CAMPUS_TZ)
    start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end = start + datetime.timedelta(days=1)
    docs = (
        db()
        .collection("recipes")
        .where(filter=firestore.FieldFilter("timestamp", ">=", int(start.timestamp())))
        .where(filter=firestore.FieldFilter("timestamp", "<", int(end.timestamp())))
        .stream()
    )
    recipes = [{"voteCount": 0, **d.to_dict(), "id": d.id} for d in docs]
    return sorted(recipes, key=lambda r: -r["voteCount"])


def client_ip(request):
    forwarded = request.headers.get("X-Forwarded-For", "")
    return forwarded.split(",")[0].strip() or request.remote_addr or "unknown"


def rate_limited(ip):
    """Returns an error message if this request is over a limit, else None."""
    now = datetime.datetime.now(datetime.timezone.utc)
    ip_hash = hashlib.sha256(ip.encode()).hexdigest()[:32]
    checks = [
        (f"ip-{ip_hash}-{now:%Y%m%d%H}", PER_IP_HOURLY_LIMIT, datetime.timedelta(hours=1),
         "You've made a lot of recipes this hour. Try again later."),
        (f"global-{now:%Y%m%d}", GLOBAL_DAILY_LIMIT, datetime.timedelta(days=1),
         "dAIningRIT has hit its daily recipe limit. Come back tomorrow!"),
    ]
    for key, limit, ttl, message in checks:
        if not _take(key, limit, now + ttl):
            return message
    return None


def _take(key, limit, expires_at):
    ref = db().collection("rate_limits").document(key)

    @firestore.transactional
    def txn(transaction):
        snap = ref.get(transaction=transaction)
        count = snap.get("count") if snap.exists else 0
        if count >= limit:
            return False
        transaction.set(ref, {"count": count + 1, "expiresAt": expires_at})
        return True

    return txn(db().transaction())
