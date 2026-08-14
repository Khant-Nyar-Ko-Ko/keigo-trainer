export interface TextbookNote {
  id: string;
  title: string;
  textbook: string;
  reality: string;
  confidence: "settled" | "debated";
  note?: string;
}

// Static, hand-authored content — places taught keigo/business Japanese
// diverges from what's actually said. `confidence` is honest about how
// settled each point is: some are close to universally agreed, others are
// genuinely contested among native speakers and shift by generation/workplace.
export const TEXTBOOK_NOTES: TextbookNote[] = [
  {
    id: "ryoukai-kashikomari",
    title: "了解しました vs かしこまりました",
    textbook:
      "Both are commonly taught as polite ways to say \"understood\" — used more or less interchangeably in textbook dialogues.",
    reality:
      "了解しました is grammatically fine, but many businesspeople — especially in traditional workplaces — consider it a notch too casual toward a superior or client, since 了解 doesn't carry the same self-humbling weight as 畏まる (kashikomaru, \"to be humbled/awed\"), which かしこまりました is built from. In service and formal business contexts, かしこまりました is the safer default upward.",
    confidence: "debated",
    note: "This is a real, ongoing generational shift — younger workers increasingly use 了解しました upward without issue. Treat this as \"worth knowing the debate exists,\" not a hard rule.",
  },
  {
    id: "gokurousama-otsukaresama",
    title: "ご苦労様 vs お疲れ様",
    textbook:
      "Both taught as ways to acknowledge someone's effort — roughly \"thanks for your hard work.\"",
    reality:
      "ご苦労様 is traditionally correct only said downward — a superior to a subordinate. Saying it to someone senior to you reads as presumptuous or even rude. お疲れ様 (and お疲れ様です) works in both directions and has become the default almost everywhere in real workplace usage.",
    confidence: "settled",
  },
  {
    id: "sasete-itadakimasu",
    title: "させていただきます overuse",
    textbook:
      "Taught as the humble construction for \"I am humbly permitted to do X\" — used when someone's permission or involvement is genuinely implied.",
    reality:
      "In real business Japanese it's used far more loosely than the textbook definition — often with no actual permission-granter in the picture at all (e.g. announcing your own store's holiday hours). It's common enough that avoiding it can sound stiff, but it's also a frequent target of style-guide criticism for being vague, over-hedged filler.",
    confidence: "debated",
    note: "Genuinely contested even among native speakers — some consider it standard business register, others consider it a verbal tic to trim.",
  },
  {
    id: "moshi-moshi-phone",
    title: "もしもし and business phone conventions",
    textbook: "もしもし is taught early as the standard way to say \"hello\" when answering the phone.",
    reality:
      "It's essentially never used answering a business call. Companies answer by stating the company name directly, often with でございます: 「はい、〇〇株式会社でございます」— no もしもし at all. もしもし stays appropriate for personal calls with friends and family.",
    confidence: "settled",
  },
  {
    id: "desu-gozaimasu",
    title: "です vs でございます",
    textbook: "です is taught as the standard polite copula, sufficient for formal speech.",
    reality:
      "Real service and business contexts often step up from です to でございます for an extra register bump — the copula equivalent of the お/ご+stem pattern for verbs. Most textbooks introduce this late, if at all, leaving learners under-prepared for how formal real service Japanese actually sounds.",
    confidence: "settled",
  },
];
