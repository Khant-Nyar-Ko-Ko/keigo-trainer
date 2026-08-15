import { DiagnosticHandler } from "./DiagnosticHandler";
import { DiagnosticInput, DiagnosticResult } from "./types";

// Sits between the free and paid tiers. Tier 1 always runs regardless of the
// cap; this only blocks the fall-through to the paid Tier 2 call once the
// learner's soft daily allowance (tracked client-side, see
// lib/diagnostics/explain-usage.ts) is spent.
export class UsageCapGuard extends DiagnosticHandler {
  protected async diagnose(input: DiagnosticInput): Promise<DiagnosticResult | null> {
    if (input.aiFallbackAllowed) return null;
    return {
      explanation:
        "You've reached today's limit on AI-assisted explanations. The free rule-based check didn't find a specific pattern for this mistake — review the register scale, or come back tomorrow for another explanation.",
      tier: "capped",
    };
  }
}
