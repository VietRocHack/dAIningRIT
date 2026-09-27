# Backlog

Known, non-blocking issues.

- **Menu is a frozen Feb 2024 snapshot** (`backend/menu.json`). The pitch says
  "today's menu", but the hackathon version also used a static file. A scheduled
  scrape of RIT Dining's menu into Firestore would make this real.
- **Per-IP rate limit is spoofable.** It keys on the first `X-Forwarded-For`
  entry. Check which header Hosting → Cloud Functions actually guarantees
  and switch to it. The 150/day global cap still bounds cost.
- **Likes are unauthenticated.** The cookie only stops the same browser from
  double-liking in the UI. Anyone can POST likes.
- **"Today's" ranking only.** Days with no recipes show an empty page. An
  "all-time top" view might be nicer.
- **Card image is ~0.9 MB JPEG** straight from the model. Resize or convert to
  WebP on upload if bandwidth matters.
- **Fonts:** `App.css` / `HomePage.css` stack ~24 `font-family` declarations (only the
  last one wins). Harmless, but worth cleaning up while keeping the same look.
- **npm `allow-scripts` warning** on `npm ci` (npm 11+). The build works regardless.
