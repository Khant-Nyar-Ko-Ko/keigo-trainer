export type HonorificTarget = "sonkeigo" | "kenjougo";

export const TARGET_LABEL: Record<HonorificTarget, string> = {
  sonkeigo: "尊敬語",
  kenjougo: "謙譲語",
};

export interface VerbEntry {
  id: string;
  dictionaryForm: string;
  reading: string;
  meaning: string;
  type: "irregular" | "regular";
  // regular verbs: masu-stem (or suru-compound noun) + prefix, pattern-conjugated
  stem?: string;
  prefix?: "お" | "ご";
  // irregular verbs: hardcoded forms (undefined = no natural form in that category)
  irregularSonkeigo?: string;
  irregularKenjougo?: string;
  alternateSonkeigo?: string[];
  alternateKenjougo?: string[];
}

export const VERB_BANK: VerbEntry[] = [
  // Irregular verbs
  {
    id: "iku",
    dictionaryForm: "行く",
    reading: "いく",
    meaning: "to go",
    type: "irregular",
    irregularSonkeigo: "いらっしゃる",
    irregularKenjougo: "参る",
  },
  {
    id: "kuru",
    dictionaryForm: "来る",
    reading: "くる",
    meaning: "to come",
    type: "irregular",
    irregularSonkeigo: "いらっしゃる",
    alternateSonkeigo: ["お越しになる"],
    irregularKenjougo: "参る",
  },
  {
    id: "iru",
    dictionaryForm: "いる",
    reading: "いる",
    meaning: "to be (animate)",
    type: "irregular",
    irregularSonkeigo: "いらっしゃる",
    irregularKenjougo: "おる",
  },
  {
    id: "suru",
    dictionaryForm: "する",
    reading: "する",
    meaning: "to do",
    type: "irregular",
    irregularSonkeigo: "なさる",
    irregularKenjougo: "いたす",
  },
  {
    id: "iu",
    dictionaryForm: "言う",
    reading: "いう",
    meaning: "to say",
    type: "irregular",
    irregularSonkeigo: "おっしゃる",
    irregularKenjougo: "申す",
    alternateKenjougo: ["申し上げる"],
  },
  {
    id: "miru",
    dictionaryForm: "見る",
    reading: "みる",
    meaning: "to see / watch",
    type: "irregular",
    irregularSonkeigo: "ご覧になる",
    irregularKenjougo: "拝見する",
  },
  {
    id: "taberu",
    dictionaryForm: "食べる",
    reading: "たべる",
    meaning: "to eat",
    type: "irregular",
    irregularSonkeigo: "召し上がる",
    irregularKenjougo: "いただく",
  },
  {
    id: "nomu",
    dictionaryForm: "飲む",
    reading: "のむ",
    meaning: "to drink",
    type: "irregular",
    irregularSonkeigo: "召し上がる",
    irregularKenjougo: "いただく",
  },
  {
    id: "shiru",
    dictionaryForm: "知る",
    reading: "しる",
    meaning: "to know",
    type: "irregular",
    irregularSonkeigo: "ご存知だ",
    irregularKenjougo: "存じる",
    alternateKenjougo: ["存じ上げる"],
  },
  {
    id: "kureru",
    dictionaryForm: "くれる",
    reading: "くれる",
    meaning: "to give (to me)",
    type: "irregular",
    irregularSonkeigo: "くださる",
  },
  {
    id: "ageru",
    dictionaryForm: "あげる",
    reading: "あげる",
    meaning: "to give",
    type: "irregular",
    irregularKenjougo: "さしあげる",
  },
  {
    id: "morau",
    dictionaryForm: "もらう",
    reading: "もらう",
    meaning: "to receive",
    type: "irregular",
    irregularKenjougo: "いただく",
  },
  {
    id: "shinu",
    dictionaryForm: "死ぬ",
    reading: "しぬ",
    meaning: "to die",
    type: "irregular",
    irregularSonkeigo: "お亡くなりになる",
  },
  {
    id: "kiru",
    dictionaryForm: "着る",
    reading: "きる",
    meaning: "to wear",
    type: "irregular",
    irregularSonkeigo: "お召しになる",
  },
  {
    id: "neru",
    dictionaryForm: "寝る",
    reading: "ねる",
    meaning: "to sleep",
    type: "irregular",
    irregularSonkeigo: "お休みになる",
  },

  // Regular verbs — pattern-conjugated via お/ご + stem + になる/する
  {
    id: "yomu",
    dictionaryForm: "読む",
    reading: "よむ",
    meaning: "to read",
    type: "regular",
    stem: "読み",
    prefix: "お",
  },
  {
    id: "kaku",
    dictionaryForm: "書く",
    reading: "かく",
    meaning: "to write",
    type: "regular",
    stem: "書き",
    prefix: "お",
  },
  {
    id: "matsu",
    dictionaryForm: "待つ",
    reading: "まつ",
    meaning: "to wait",
    type: "regular",
    stem: "待ち",
    prefix: "お",
  },
  {
    id: "hanasu",
    dictionaryForm: "話す",
    reading: "はなす",
    meaning: "to speak",
    type: "regular",
    stem: "話し",
    prefix: "お",
  },
  {
    id: "tsukau",
    dictionaryForm: "使う",
    reading: "つかう",
    meaning: "to use",
    type: "regular",
    stem: "使い",
    prefix: "お",
  },
  {
    id: "motsu",
    dictionaryForm: "持つ",
    reading: "もつ",
    meaning: "to hold / have",
    type: "regular",
    stem: "持ち",
    prefix: "お",
  },
  {
    id: "okuru",
    dictionaryForm: "送る",
    reading: "おくる",
    meaning: "to send",
    type: "regular",
    stem: "送り",
    prefix: "お",
  },
  {
    id: "yobu",
    dictionaryForm: "呼ぶ",
    reading: "よぶ",
    meaning: "to call",
    type: "regular",
    stem: "呼び",
    prefix: "お",
  },
  {
    id: "kiku",
    dictionaryForm: "聞く",
    reading: "きく",
    meaning: "to hear / ask",
    type: "regular",
    stem: "聞き",
    prefix: "お",
  },
  {
    id: "denwasuru",
    dictionaryForm: "電話する",
    reading: "でんわする",
    meaning: "to phone",
    type: "regular",
    stem: "電話",
    prefix: "お",
  },
  {
    id: "setsumeisuru",
    dictionaryForm: "説明する",
    reading: "せつめいする",
    meaning: "to explain",
    type: "regular",
    stem: "説明",
    prefix: "ご",
  },
  {
    id: "annaisuru",
    dictionaryForm: "案内する",
    reading: "あんないする",
    meaning: "to guide / show around",
    type: "regular",
    stem: "案内",
    prefix: "ご",
  },
  {
    id: "renrakusuru",
    dictionaryForm: "連絡する",
    reading: "れんらくする",
    meaning: "to contact",
    type: "regular",
    stem: "連絡",
    prefix: "ご",
  },
  {
    id: "yoyakusuru",
    dictionaryForm: "予約する",
    reading: "よやくする",
    meaning: "to reserve",
    type: "regular",
    stem: "予約",
    prefix: "ご",
  },
];

export function conjugate(
  verb: VerbEntry,
  target: HonorificTarget,
): string | null {
  if (verb.type === "irregular") {
    return (
      (target === "sonkeigo"
        ? verb.irregularSonkeigo
        : verb.irregularKenjougo) ?? null
    );
  }
  if (!verb.stem || !verb.prefix) return null;
  return target === "sonkeigo"
    ? `${verb.prefix}${verb.stem}になる`
    : `${verb.prefix}${verb.stem}する`;
}

export function acceptableAnswers(
  verb: VerbEntry,
  target: HonorificTarget,
): string[] {
  const canonical = conjugate(verb, target);
  if (!canonical) return [];
  const alternates =
    target === "sonkeigo" ? verb.alternateSonkeigo : verb.alternateKenjougo;
  return [canonical, ...(alternates ?? [])];
}
