import { conjugate, HonorificTarget, regularPatternForm } from "../verbs";
import { DiagnosticHandler } from "./DiagnosticHandler";
import { DiagnosticInput, DiagnosticResult } from "./types";

function normalize(s: string): string {
  return s.trim().replace(/[。.!！?？\s]/g, "");
}

// Tier 1: free, instant, code-only. Catches the two mistakes that have a
// deterministic signature — wrong honorific category, and the regular
// pattern misapplied to a verb that doesn't take it — before anything
// reaches the paid Tier 2 fallback.
export class RuleBasedDiagnoser extends DiagnosticHandler {
  protected async diagnose(input: DiagnosticInput): Promise<DiagnosticResult | null> {
    const { verb, target, userAnswer, correctAnswer } = input;
    const normalizedUser = normalize(userAnswer);

    if (!normalizedUser) {
      return {
        explanation: correctAnswer
          ? `No answer given — the correct form was ${correctAnswer}.`
          : "No answer given.",
        tier: "rule-based",
      };
    }

    const otherTarget: HonorificTarget = target === "sonkeigo" ? "kenjougo" : "sonkeigo";
    const otherAnswer = conjugate(verb, otherTarget);
    if (otherAnswer && normalize(otherAnswer) === normalizedUser) {
      return {
        explanation: `That's ${otherTarget}, not ${target} — same verb, wrong honorific category. ${target === "sonkeigo" ? "尊敬語" : "謙譲語"} was asked for here.`,
        tier: "rule-based",
      };
    }

    if (verb.type === "irregular") {
      const regularGuess = regularPatternForm(verb, target);
      if (regularGuess && normalize(regularGuess) === normalizedUser) {
        return {
          explanation: `${verb.dictionaryForm} has an irregular ${target} form (${correctAnswer}) — the regular お/ご + stem + になる/する pattern doesn't apply to this verb.`,
          tier: "rule-based",
        };
      }
    }

    return null;
  }
}
