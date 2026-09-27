# dAIningRIT

**When dining hall meets AI.** Pick a cuisine and a few ingredients, and dAIningRIT
invents a no-cook dish from what RIT's dining hall is serving: which station each
ingredient is at, step-by-step assembly, and a generated photo. Then see and like
what everyone else made today.

Live: https://dainingrit.vietrochack.com · [Devpost](https://devpost.com/software/dainingrit)

Built at BrickHack X (February 2024) by Vuong Ho, Duc Vu and Hoang Le. Now hosted by
[VietRocHack](https://vietrochack.com).

## Stack

- `frontend/`: React + Vite, on Firebase Hosting
- `backend/`: Python Cloud Function (gen2) calling Gemini for the recipe and photo,
  Firestore for recipes and likes, Cloud Storage for photos
- Everything lives in the `vietrochack-lab` GCP project, same origin via a Hosting `/api/**` rewrite

See [CLAUDE.md](CLAUDE.md) for local dev and deploy, and [`docs/`](docs/) for decisions and ops.
