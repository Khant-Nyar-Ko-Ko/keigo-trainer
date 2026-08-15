import { NextRequest, NextResponse } from "next/server";
import { ClaudeHaikuDiagnoser } from "@/lib/diagnostics/ClaudeHaikuDiagnoser";
import { RuleBasedDiagnoser } from "@/lib/diagnostics/RuleBasedDiagnoser";
import { UsageCapGuard } from "@/lib/diagnostics/UsageCapGuard";
import { VERB_BANK } from "@/lib/verbs";

const ruleBased = new RuleBasedDiagnoser();
const usageCap = new UsageCapGuard();
const haiku = new ClaudeHaikuDiagnoser();
ruleBased.setNext(usageCap);
usageCap.setNext(haiku);

export async function POST(req: NextRequest) {
  const { verbId, target, userAnswer, correctAnswer, aiFallbackAllowed } = await req.json();

  const verb = VERB_BANK.find((v) => v.id === verbId);
  if (!verb || (target !== "sonkeigo" && target !== "kenjougo")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await ruleBased.handle({
    verb,
    target,
    userAnswer: typeof userAnswer === "string" ? userAnswer : "",
    correctAnswer: typeof correctAnswer === "string" ? correctAnswer : null,
    aiFallbackAllowed: Boolean(aiFallbackAllowed),
  });

  return NextResponse.json(result);
}
