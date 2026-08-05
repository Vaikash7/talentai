# AI Integration — Future Extension Point

This folder is intentionally reserved as the integration point for a
generative AI provider (e.g., Anthropic's Claude API), should one
become available for this project in the future.

## Current Status
As of this build, TalentAI uses **fully deterministic, rule-based logic**
for skill extraction, match rationale, career path recommendations, and
learning suggestions — implemented in the `services/` layer. This was a
deliberate architectural decision made to keep the application free to
run, with zero dependency on paid third-party APIs.

## Why this folder still exists
The application's layered architecture (Router → Service → Repository)
was designed so that an AI provider could be added later as a plug-in
to the Service layer, without requiring any changes to routers,
repositories, database models, or existing business logic.

## How to activate AI integration in the future
1. Add an API key to `.env` (e.g., `ANTHROPIC_API_KEY=...`)
2. Implement `claude_client.py`, `resume_parser.py`, and
   `career_advisor.py` in this folder
3. Update `services/candidate_service.py` and
   `services/matching_service.py` to call the AI layer, with a
   try/except fallback to the existing rule-based logic (so the app
   degrades gracefully if the AI call fails or credits run out)

No other part of the application needs to change.