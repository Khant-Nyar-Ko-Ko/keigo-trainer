import { SCENARIO_BANK, scenarioCorrectAnswer } from "../lib/scenarios";

let bad = 0;
for (const s of SCENARIO_BANK) {
  const answer = scenarioCorrectAnswer(s);
  if (!answer) {
    console.log(`MISSING ANSWER: ${s.id} (${s.verbId}, ${s.targetRegister})`);
    bad++;
  } else {
    console.log(`${s.id}: [${s.category}] ${s.promptCue} -> ${answer}`);
  }
}
console.log(`\n${SCENARIO_BANK.length} scenarios, ${bad} missing answers`);
