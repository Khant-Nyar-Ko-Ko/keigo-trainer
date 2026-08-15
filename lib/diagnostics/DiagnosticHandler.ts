import { DiagnosticInput, DiagnosticResult } from "./types";

// Chain of Responsibility: each handler either resolves the mistake itself
// (returning a result) or defers to the next link. The free, instant tier
// runs first — only what it can't classify reaches the paid tier.
export abstract class DiagnosticHandler {
  private next: DiagnosticHandler | null = null;

  setNext(handler: DiagnosticHandler): DiagnosticHandler {
    this.next = handler;
    return handler;
  }

  async handle(input: DiagnosticInput): Promise<DiagnosticResult> {
    const result = await this.diagnose(input);
    if (result) return result;
    if (this.next) return this.next.handle(input);
    return {
      explanation: "Couldn't generate an explanation for this one — try again?",
      tier: "rule-based",
    };
  }

  protected abstract diagnose(input: DiagnosticInput): Promise<DiagnosticResult | null>;
}
