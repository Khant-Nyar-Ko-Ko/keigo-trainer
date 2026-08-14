# Keigo Companion — App Plan

A hosted Japanese 敬語 (keigo) study app for any learner, not just its author. Multi-user with accounts, built to stay free to run at meaningful scale.

## Guiding principles

- **The differentiator is judgment, not conjugation.** Every keigo tool drills verb morphology (お読みになる, いただく, etc.) — that part is mechanical and well-served already. What's actually hard, and what almost nothing teaches, is knowing *which register applies to whom* (uchi/soto, hierarchy, setting). That's the product's edge, and it's built as hand-authored static content, not a live LLM generating scenarios per request.
- **Free content is the backbone; LLM calls are a thin, capped enhancement layer.** Drills, the scenario bank, the reasoning framework, reference tables, and gamification all run on zero marginal cost. The one place an LLM call fires (explain-on-miss) is tiered: a free rule-based diagnoser handles most cases, an LLM call (Haiku 4.5, capped per learner per day) only fires as a fallback for mistakes the rule-based layer can't classify.
- **Deterministic grading wherever the answer is rule-based.** Verb conjugation has a fixed answer key — grade it in code. Scenario/judgment answers, where correctness is contextual, are graded against hand-authored expected answers, not live LLM judgment (keeps cost at zero and answers consistent).
- **Ship the differentiator before the infrastructure.** Accounts and a backend are generic plumbing that don't need to block content. Build out the free, unique parts of the product first (still usable single-browser via localStorage), then add accounts/sync once there's a real product worth syncing.

## Locked decisions

| Decision | Answer |
|---|---|
| Distribution | Hosted product with accounts, for any learner (not just single-user/local) |
| Backend | Supabase (Postgres + Auth) — free tier covers this at hobby/early scale |
| Hosting | Vercel (free Hobby tier — this is already a Next.js app) |
| LLM cost model | I cover it. Claude Haiku 4.5 (not Opus 5 — ~5x cheaper, plenty capable for short explanations), fired only as a fallback, with a per-learner daily cap |
| Core differentiator | Hand-authored scenario/judgment bank + decision-tree reasoning framework — zero marginal cost, teaches what other tools don't |

## Current state (Phase 0 + Phase 1 — done)

**Phase 0 — verb drills:**
- Deterministic verb bank (29 verbs: 15 irregular + 14 regular-pattern) — [`lib/verbs.ts`](lib/verbs.ts)
- Conjugator applying irregular lookups or the お/ご+stem pattern — same file
- Grading with normalization/variant tolerance — [`lib/grade.ts`](lib/grade.ts)
- Leitner-style weighted question picker (missed verbs surface more) via localStorage — [`lib/progress.ts`](lib/progress.ts)
- Quiz UI — [`components/Quiz.tsx`](components/Quiz.tsx), route `/`
- LLM explanation on wrong answers, currently *always* LLM-based (Claude Opus 5) — [`app/api/explain/route.ts`](app/api/explain/route.ts) — **superseded by Phase 2 below**

**Phase 1 — the differentiator:**
- Hand-authored scenario bank — [`lib/scenarios.ts`](lib/scenarios.ts), 17 scenarios across all 5 categories (pilot scope; scaling to 150–300 remains open work), each verified against the conjugator via `npm run verify:scenarios`
- Free rule-based mistake diagnosis for scenarios (wrong-register detection, no LLM) — [`lib/scenario-grade.ts`](lib/scenario-grade.ts)
- Scenario practice UI — [`components/ScenarioPractice.tsx`](components/ScenarioPractice.tsx), route `/scenarios`
- Decision-tree diagnostic mode (actor → addressee → in-group reasoning, derives the register and shows a live conjugated example) — [`lib/decision-tree.ts`](lib/decision-tree.ts), [`components/DecisionTree.tsx`](components/DecisionTree.tsx), route `/diagnostic`
- "Textbook vs. real Japanese" reference notes (5 entries, honestly hedged between settled and debated points) — [`lib/textbook-notes.ts`](lib/textbook-notes.ts), route `/notes`
- Visual identity: white background, red/green accent system, the register-scale motif (a vertical marker showing 尊敬語/謙譲語 position) reused across all four screens — [`app/globals.css`](app/globals.css), [`components/RegisterScale.tsx`](components/RegisterScale.tsx), [`components/AppNav.tsx`](components/AppNav.tsx)

Verified end-to-end in the browser, light and dark mode, including the flip-case reasoning path (wp-01/wp-02, ph-01/ph-02) in both Scenario Practice and the decision tree.

**Remaining Phase 1 work:** scaling the scenario bank from 17 pilot entries toward the 150–300 target.

## Phase 2 — Tiered explain-on-miss

Replace the current always-LLM explain route with a tiered diagnoser. Cuts LLM calls dramatically while improving precision on the cases it does cover.

- **Tier 1 (free, instant, code-only):** rule-based diagnoser using the existing deterministic conjugator —
  - answer matches the *other* honorific category's correct form → "that's kenjougo, this question asked for sonkeigo"
  - answer matches what the regular お+stem+になる/する pattern would produce, but the verb is irregular → "this verb has an irregular form; the regular pattern doesn't apply here"
  - blank/no attempt → distinct message, no diagnosis needed
- **Tier 2 (LLM fallback, capped):** only fires when Tier 1 can't classify the mistake. Claude Haiku 4.5, per-learner daily cap enforced (soft cap via localStorage pre-accounts, hard cap via the DB once Phase 3 lands)

## Phase 3 — Accounts + backend

Add Supabase (Postgres + Auth). Migrate progress from localStorage to per-user DB rows so it syncs across devices. This is also where the Tier-2 LLM daily cap becomes a real enforced limit instead of a soft client-side one.

- Auth: email/magic-link or OAuth via Supabase Auth
- Migrate `keigo-trainer-progress` (Leitner weights) and scenario-bank progress to Postgres, keyed by user
- One-time "claim your local progress" import for anyone who used the app pre-accounts

## Phase 4 — Free feature layer

All zero marginal cost, all reinforce retention without touching the LLM budget.

- More drill types: multiple-choice recognition, reverse drill (see the keigo form, name the plain form + meaning), matching/pairing game, timed speed-round
- Replace the simple Leitner weighting with a proper spaced-repetition schedule (SM-2 or similar)
- Browser-native pronunciation practice via the Web Speech API (playback + speech-recognition production practice) — runs entirely client-side, no API cost
- Browsable/searchable keigo reference table (all verbs + forms, not a quiz — a cheat sheet)
- Keigo nouns / 美化語 (bikago): お茶, ご飯, お名前 — distinct from verb honorifics
- Common set phrases for business contexts (よろしくお願いいたします, お世話になっております)

## Phase 5 — Gamification & polish

- Streaks, daily goals, levels/badges (opt-in leaderboards/friend comparisons — not everyone wants competitive pressure)
- Progress dashboard: per-verb and per-scenario-category accuracy, weakest areas, deep-linkable into focused drill sessions
- Mobile responsive pass
- Light/dark theme toggle (dark mode already works via Tailwind's `dark:` variants; no explicit toggle yet)
- Export/reset progress from Settings

## Data model notes

- **Verb bank / scenario bank**: static TS/JSON data, no reason to move into a database — this is authored content, not per-user state
- **Progress**: localStorage through Phase 2, migrates to Supabase Postgres in Phase 3 (per-user rows, keyed by auth user ID)
- **LLM usage tracking** (for the Tier-2 daily cap): soft-tracked in localStorage pre-accounts, hard-tracked in Postgres post-Phase 3

## Not planned (explicitly out of scope unless you ask)

- Mobile native app (this is a web app; RN/Expo not warranted here)
- Payment/monetization
- Live LLM-generated scenarios (the scenario bank is deliberately hand-authored and static — keeps it free and lets quality be curated rather than gambled on generation quality)
