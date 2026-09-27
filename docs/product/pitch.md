# dAIningRIT: pitch

Source: https://devpost.com/software/dainingrit (paraphrased)

**Event:** BrickHack X, RIT, February 24–25, 2024
**Team:** Vuong Ho, Duc Vu, Hoang Le

## Why

Students get tired of the same few options at the dining hall. The team wanted
to use AI to make college dining more interesting and, as a side effect, reduce
waste by getting more out of what's already being served.

## What it does

The app takes the day's menu from RIT's largest dining hall. A student picks a
cuisine and any ingredients they'd like, and the app generates a new recipe
from what's available: which station to visit for each ingredient, and
step-by-step assembly. Recipes are shared and can be liked, so the most popular
ideas surface. That could also tell dining staff what students want.

## How it was built (hackathon version)

GPT-4 for recipes and DALL-E 3 for photos. Python Cloud Functions on Google
Cloud, Firestore for data, and a React frontend on Firebase Hosting. The 2026
migration swapped the models for Gemini (see `docs/adr/0002-gemini-instead-of-openai.md`).

## What's next (from the original writeup)

Expand beyond RIT to other universities, and use personalized picks to cut food waste.
