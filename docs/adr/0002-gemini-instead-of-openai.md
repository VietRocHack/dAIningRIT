# 0002: Gemini (native `google-genai` SDK) instead of GPT-4 + DALL-E 3

**Status:** Accepted (2026-09-27)

## Context

The original backend used `gpt-4-turbo-preview` (JSON mode) for the recipe and
`dall-e-3` for the photo, with a personal OpenAI key. The team has no OpenAI
budget. SwipeAndFly solved this by pointing the OpenAI SDK at Gemini's
OpenAI-compatible endpoint (its ADR 0003), but that path only covers chat. This
app also needs image generation.

## Decision

- Use the native `google-genai` SDK with a server-only key from Secret Manager
  (`dainingrit-gemini-api-key`, restricted to the Generative Language API).
- Recipe: `gemini-flash-latest` with `response_schema` set to a pydantic `Recipe`
  model. That's stricter than prompt-described JSON and removes the parse-failure path.
  The `-latest` alias is used so a model retirement doesn't take the site down.
- Photo: `gemini-3.1-flash-image`. The bytes are uploaded straight to the
  `vietrochack-lab-dainingrit` bucket; there's no temporary URL to re-download
  like with DALL-E. If image generation fails, the recipe is still saved with
  `imageUrl: null` and the UI shows the tiger mascot instead.
- Both models are overridable with `GEMINI_TEXT_MODEL` / `GEMINI_IMAGE_MODEL`.

## Consequences

- The prompt was carried over nearly verbatim, so recipe style should be close to the original.
- Image generation is the main cost driver. See ADR 0003 for the limits.
