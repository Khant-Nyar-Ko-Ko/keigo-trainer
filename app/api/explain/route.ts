import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { dictionaryForm, meaning, target, userAnswer, correctAnswer } =
    await req.json();

  const targetLabel =
    target === "sonkeigo" ? "尊敬語 (sonkeigo)" : "謙譲語 (kenjougo)";

  try {
    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 800,
      output_config: { effort: "low" },
      system:
        "You are a concise Japanese keigo (敬語) tutor. In 2-4 sentences, explain why the user's answer was wrong: name the grammar rule or pattern (irregular form, or the お/ご + stem + になる/する pattern), and if relevant, the uchi/soto (in-group/out-group) reasoning behind the choice. Respond in English with Japanese terms in parentheses. Do not restate the question or greet the user.",
      messages: [
        {
          role: "user",
          content: `Verb: ${dictionaryForm} (${meaning})\nTarget honorific category: ${targetLabel}\nUser answered: ${userAnswer || "(blank)"}\nCorrect answer: ${correctAnswer}\n\nExplain the mistake and how the correct form is derived.`,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const explanation = textBlock && textBlock.type === "text" ? textBlock.text : "";
    if (!explanation) {
      return NextResponse.json({ error: "No explanation generated" }, { status: 502 });
    }
    return NextResponse.json({ explanation });
  } catch {
    return NextResponse.json({ error: "Explanation service unavailable" }, { status: 502 });
  }
}
