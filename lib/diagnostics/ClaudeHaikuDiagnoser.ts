import Anthropic from "@anthropic-ai/sdk";
import { TARGET_LABEL } from "../verbs";
import { DiagnosticHandler } from "./DiagnosticHandler";
import { DiagnosticInput, DiagnosticResult } from "./types";

const client = new Anthropic();

// Tier 2: fallback only. Fires when Tier 1 can't classify the mistake and
// the learner's daily cap hasn't been hit. Haiku 4.5 — cheap enough to run
// as a fallback layer, not a fixed cost per drill.
export class ClaudeHaikuDiagnoser extends DiagnosticHandler {
  protected async diagnose(input: DiagnosticInput): Promise<DiagnosticResult | null> {
    const { verb, target, userAnswer, correctAnswer } = input;
    const targetLabel = `${TARGET_LABEL[target]} (${target})`;

    try {
      const response = await client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 400,
        system:
          "You are a concise Japanese keigo (敬語) tutor. In 2-4 sentences, explain why the user's answer was wrong: name the grammar rule or pattern (irregular form, or the お/ご + stem + になる/する pattern), and if relevant, the uchi/soto (in-group/out-group) reasoning behind the choice. Respond in English with Japanese terms in parentheses. Do not restate the question or greet the user.",
        messages: [
          {
            role: "user",
            content: `Verb: ${verb.dictionaryForm} (${verb.meaning})\nTarget honorific category: ${targetLabel}\nUser answered: ${userAnswer || "(blank)"}\nCorrect answer: ${correctAnswer ?? "(none)"}\n\nExplain the mistake and how the correct form is derived.`,
          },
        ],
      });

      const textBlock = response.content.find((block) => block.type === "text");
      const explanation = textBlock && textBlock.type === "text" ? textBlock.text : "";
      if (!explanation) return null;
      return { explanation, tier: "ai" };
    } catch (err) {
      console.error("ClaudeHaikuDiagnoser failed:", err);
      return null;
    }
  }
}
