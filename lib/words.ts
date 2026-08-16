import { HonorificTarget } from "./verbs";

export type WordType = "noun" | "adjective";

export interface WordEntry {
  id: string;
  plain: string;
  reading: string;
  meaning: string;
  type: WordType;
  sonkeigo?: string;
  kenjougo?: string;
  alternateSonkeigo?: string[];
  alternateKenjougo?: string[];
}

export const WORD_BANK: WordEntry[] = [
  // Nouns — お/ご + noun pattern, sonkeigo-only (elevates the listener's thing)
  {
    id: "namae",
    plain: "名前",
    reading: "なまえ",
    meaning: "name",
    type: "noun",
    sonkeigo: "お名前",
  },
  {
    id: "juusho",
    plain: "住所",
    reading: "じゅうしょ",
    meaning: "address",
    type: "noun",
    sonkeigo: "ご住所",
  },
  {
    id: "denwabangou",
    plain: "電話番号",
    reading: "でんわばんごう",
    meaning: "phone number",
    type: "noun",
    sonkeigo: "お電話番号",
  },
  {
    id: "iken",
    plain: "意見",
    reading: "いけん",
    meaning: "opinion",
    type: "noun",
    sonkeigo: "ご意見",
  },
  {
    id: "tsugou",
    plain: "都合",
    reading: "つごう",
    meaning: "convenience / schedule",
    type: "noun",
    sonkeigo: "ご都合",
  },
  {
    id: "kazoku",
    plain: "家族",
    reading: "かぞく",
    meaning: "family",
    type: "noun",
    sonkeigo: "ご家族",
  },
  {
    id: "kangae",
    plain: "考え",
    reading: "かんがえ",
    meaning: "thought / idea",
    type: "noun",
    sonkeigo: "お考え",
  },

  // Nouns — distinct-word pairs, not a prefix pattern
  {
    id: "otto",
    plain: "夫",
    reading: "おっと",
    meaning: "husband",
    type: "noun",
    sonkeigo: "ご主人",
  },
  {
    id: "tsuma",
    plain: "妻",
    reading: "つま",
    meaning: "wife",
    type: "noun",
    sonkeigo: "奥様",
  },
  {
    id: "kodomo",
    plain: "子供",
    reading: "こども",
    meaning: "child",
    type: "noun",
    sonkeigo: "お子様",
  },
  {
    id: "ie",
    plain: "家",
    reading: "いえ",
    meaning: "house",
    type: "noun",
    sonkeigo: "お宅",
  },
  {
    id: "hito",
    plain: "人",
    reading: "ひと",
    meaning: "person",
    type: "noun",
    sonkeigo: "方",
  },
  {
    id: "dare",
    plain: "誰",
    reading: "だれ",
    meaning: "who",
    type: "noun",
    sonkeigo: "どなた",
  },

  // The flagship paired example — sonkeigo AND kenjougo are both distinct
  // words, same as verbs.ts's irregular verbs.
  {
    id: "kaisha",
    plain: "会社",
    reading: "かいしゃ",
    meaning: "company",
    type: "noun",
    sonkeigo: "御社",
    alternateSonkeigo: ["貴社"],
    kenjougo: "弊社",
    alternateKenjougo: ["当社"],
  },

  // Adjectives — お/ご + adjective, sonkeigo-only
  {
    id: "isogashii",
    plain: "忙しい",
    reading: "いそがしい",
    meaning: "busy",
    type: "adjective",
    sonkeigo: "お忙しい",
  },
  {
    id: "rippa",
    plain: "立派",
    reading: "りっぱ",
    meaning: "splendid / admirable",
    type: "adjective",
    sonkeigo: "ご立派",
  },
  {
    id: "genki",
    plain: "元気",
    reading: "げんき",
    meaning: "healthy / well",
    type: "adjective",
    sonkeigo: "お元気",
  },
  {
    id: "shinpai",
    plain: "心配",
    reading: "しんぱい",
    meaning: "worry / concern",
    type: "adjective",
    sonkeigo: "ご心配",
  },
];

export function conjugateWord(
  word: WordEntry,
  target: HonorificTarget,
): string | null {
  return (target === "sonkeigo" ? word.sonkeigo : word.kenjougo) ?? null;
}

export function acceptableWordAnswers(
  word: WordEntry,
  target: HonorificTarget,
): string[] {
  const canonical = conjugateWord(word, target);
  if (!canonical) return [];
  const alternates =
    target === "sonkeigo" ? word.alternateSonkeigo : word.alternateKenjougo;
  return [canonical, ...(alternates ?? [])];
}
