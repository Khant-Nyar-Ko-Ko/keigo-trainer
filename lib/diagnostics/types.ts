import { HonorificTarget, VerbEntry } from "../verbs";

export interface DiagnosticInput {
  verb: VerbEntry;
  target: HonorificTarget;
  userAnswer: string;
  correctAnswer: string | null;
  // Soft, client-reported daily cap on Tier 2 (paid) calls — see
  // lib/diagnostics/explain-usage.ts. Tier 1 always runs regardless.
  aiFallbackAllowed: boolean;
}

export interface DiagnosticResult {
  explanation: string;
  tier: "rule-based" | "capped" | "ai";
}
