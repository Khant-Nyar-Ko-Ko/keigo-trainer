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

## Current state (Phase 0–3 — done; Phase 5 partial)

**Phase 0 — verb drills:**
- Deterministic verb bank (30 verbs: 16 irregular + 14 regular-pattern) — [`lib/verbs.ts`](lib/verbs.ts)
- Conjugator applying irregular lookups or the お/ご+stem pattern — same file
- Grading with normalization/variant tolerance — [`lib/grade.ts`](lib/grade.ts)
- Leitner-style weighted question picker (missed verbs surface more) via localStorage — [`lib/progress.ts`](lib/progress.ts)
- Quiz UI — [`components/Quiz.tsx`](components/Quiz.tsx), route `/drills`
- LLM explanation on wrong answers — **superseded by Phase 2 below**

**Phase 1 — the differentiator:**
- Hand-authored scenario bank — [`lib/scenarios.ts`](lib/scenarios.ts), 17 scenarios across all 5 categories (pilot scope; scaling to 150–300 remains open work), each verified against the conjugator via `npm run verify:scenarios`
- Free rule-based mistake diagnosis for scenarios (wrong-register detection, no LLM) — [`lib/scenario-grade.ts`](lib/scenario-grade.ts)
- Scenario practice UI — [`components/ScenarioPractice.tsx`](components/ScenarioPractice.tsx), route `/scenarios`
- Decision-tree diagnostic mode (actor → addressee → in-group reasoning, derives the register and shows a live conjugated example) — [`lib/decision-tree.ts`](lib/decision-tree.ts), [`components/DecisionTree.tsx`](components/DecisionTree.tsx), route `/diagnostic`
- "Textbook vs. real Japanese" reference notes (5 entries, honestly hedged between settled and debated points) — [`lib/textbook-notes.ts`](lib/textbook-notes.ts), route `/notes`
- Visual identity: white background, red/green accent system, the register-scale motif (a vertical marker showing 尊敬語/謙譲語 position) reused across all four screens — [`app/globals.css`](app/globals.css), [`components/RegisterScale.tsx`](components/RegisterScale.tsx), [`components/AppNav.tsx`](components/AppNav.tsx)

Verified end-to-end in the browser, light and dark mode, including the flip-case reasoning path (wp-01/wp-02, ph-01/ph-02) in both Scenario Practice and the decision tree.

**Remaining Phase 1 work:** scaling the scenario bank from 17 pilot entries toward the 150–300 target.

**Phase 2 — tiered explain-on-miss:**
- Chain-of-Responsibility diagnoser: free rule-based tier runs first, catching wrong-honorific-category answers and the regular pattern misapplied to an irregular verb, before anything reaches the paid tier — [`lib/diagnostics/DiagnosticHandler.ts`](lib/diagnostics/DiagnosticHandler.ts), [`lib/diagnostics/RuleBasedDiagnoser.ts`](lib/diagnostics/RuleBasedDiagnoser.ts)
- Claude Haiku 4.5 fires only as the fallback when Tier 1 can't classify the mistake — [`lib/diagnostics/ClaudeHaikuDiagnoser.ts`](lib/diagnostics/ClaudeHaikuDiagnoser.ts), chained together in [`app/api/explain/route.ts`](app/api/explain/route.ts)
- Per-learner daily cap (5/day) gates the fallback — [`lib/diagnostics/UsageCapGuard.ts`](lib/diagnostics/UsageCapGuard.ts), [`lib/diagnostics/explain-usage.ts`](lib/diagnostics/explain-usage.ts). **Still soft/localStorage-only** — the DB-backed hard cap planned below never shipped; a signed-in user can reset it by clearing site data, so it's open work if abuse becomes a real cost concern.
- Storage abstracted behind a port (`StorageRepository` interface + `LocalStorageRepo` implementation) instead of calling `window.localStorage` directly — [`lib/storage/`](lib/storage/)

**Phase 3 — accounts + backend:**
- Supabase email/magic-link auth, entirely optional — the app is fully usable signed-out — [`components/LoginForm.tsx`](components/LoginForm.tsx), [`app/login/page.tsx`](app/login/page.tsx), [`app/auth/confirm/route.ts`](app/auth/confirm/route.ts), [`components/AuthProvider.tsx`](components/AuthProvider.tsx)
- Progress did **not** end up migrating off localStorage as originally planned — localStorage stays the source of truth the UI reads from, and Supabase is a sync layer on top: on sign-in, this device's local counts merge into the account once, then the account's counts pull down into local storage (repeats on every sign-in) — [`lib/sync.ts`](lib/sync.ts)
- One `user_progress` row per user (progress/scenario-progress/stats as JSONB), RLS-scoped to `auth.uid()`, updated via atomic increment RPCs — [`supabase/migrations/0001_user_progress.sql`](supabase/migrations/0001_user_progress.sql)
- This is the "claim your local progress" import mentioned below — it happens automatically on first sign-in per device, not as a separate flow

**Phase 5 (partial) — polish:**
- Light/dark theme toggle — [`components/ThemeToggle.tsx`](components/ThemeToggle.tsx)
- Export/reset progress from Settings — [`components/SettingsPanel.tsx`](components/SettingsPanel.tsx)
- Mobile responsive pass: stationery-inspired design system, fixed top nav plus a bottom tab bar on mobile — [`components/AppNav.tsx`](components/AppNav.tsx), [`app/globals.css`](app/globals.css)
- Basic progress dashboard: per-mode accuracy, weakest verbs/scenarios lists — [`components/ProgressOverview.tsx`](components/ProgressOverview.tsx), route `/progress`. Not yet deep-linkable into a focused drill session on a weak item — that piece is still open, see Phase 5 below.

**Marketing/UX restructuring:**
- `/` is now a dedicated landing page (Hero → feature cards linking to all 5 modes → FAQ) instead of doubling as the verb-drills page; drills moved to their own route — [`app/page.tsx`](app/page.tsx), [`app/drills/page.tsx`](app/drills/page.tsx), [`components/HomeFeatures.tsx`](components/HomeFeatures.tsx), [`components/HomeFaq.tsx`](components/HomeFaq.tsx)
- `/progress` shows a non-blocking "sign in to sync across devices" banner when signed out, rather than gating the page behind auth — the local-first design means progress is fully viewable as a guest — [`components/ProgressOverview.tsx`](components/ProgressOverview.tsx)

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
- Make the weakest-verbs/weakest-scenarios lists on `/progress` deep-linkable into a focused drill session on just those items, instead of a static list

## Data model notes

- **Verb bank / scenario bank**: static TS/JSON data, no reason to move into a database — this is authored content, not per-user state
- **Progress**: localStorage is the durable source of truth the UI reads from. Supabase Postgres (`user_progress`, one row per user) is an optional sync layer that activates on sign-in — merge-then-pull, not a migration off localStorage. See [`lib/sync.ts`](lib/sync.ts).
- **LLM usage tracking** (for the Tier-2 daily cap): still soft-tracked in localStorage only ([`lib/diagnostics/explain-usage.ts`](lib/diagnostics/explain-usage.ts)) — a DB-backed per-account hard cap was planned but hasn't shipped; open work if abuse becomes a real cost concern

## Not planned (explicitly out of scope unless you ask)

- Mobile native app (this is a web app; RN/Expo not warranted here)
- Payment/monetization
- Live LLM-generated scenarios (the scenario bank is deliberately hand-authored and static — keeps it free and lets quality be curated rather than gambled on generation quality)
