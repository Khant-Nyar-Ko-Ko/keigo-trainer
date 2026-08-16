import { WORD_BANK, conjugateWord } from "../lib/words";

let bad = 0;
for (const w of WORD_BANK) {
  const sonkeigo = conjugateWord(w, "sonkeigo");
  const kenjougo = conjugateWord(w, "kenjougo");
  if (!sonkeigo && !kenjougo) {
    console.log(`MISSING BOTH FORMS: ${w.id} (${w.plain})`);
    bad++;
  } else {
    console.log(`${w.id}: ${w.plain} -> sonkeigo=${sonkeigo ?? "—"} kenjougo=${kenjougo ?? "—"}`);
  }
}
console.log(`\n${WORD_BANK.length} words, ${bad} missing both forms`);
