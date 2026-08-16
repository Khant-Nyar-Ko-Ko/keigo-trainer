import { REQUEST_BANK, requestScenarioCorrectAnswer } from "../lib/requests";

let bad = 0;
for (const s of REQUEST_BANK) {
  const answer = requestScenarioCorrectAnswer(s);
  if (!answer) {
    console.log(`MISSING ANSWER: ${s.id} (${s.verbId}, ${s.targetTier}) — verb likely missing teForm`);
    bad++;
  } else {
    console.log(`${s.id}: [${s.targetTier}] ${s.promptCue} -> ${answer}`);
  }
}
console.log(`\n${REQUEST_BANK.length} request scenarios, ${bad} missing answers`);
