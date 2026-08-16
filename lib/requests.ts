import { Difficulty } from "./scenarios";
import { VERB_BANK, VerbEntry } from "./verbs";

// Request-politeness is a different axis from sonkeigo/kenjougo: it's not
// about whose action it is, it's about how much you're imposing by asking.
// Same verb, same actor (always the listener, doing the favor for you) —
// the tier just escalates with social distance and the size of the ask.
export type RequestTier = "casual" | "polite" | "formal";

export const REQUEST_TIER_LABEL: Record<RequestTier, string> = {
  casual: "てください",
  polite: "ていただけますか",
  formal: "ていただけますでしょうか",
};

const REQUEST_TIER_SUFFIX: Record<RequestTier, string> = {
  casual: "ください",
  polite: "いただけますか",
  formal: "いただけますでしょうか",
};

export interface RequestScenario {
  id: string;
  setting: string;
  otherParty: string;
  verbId: string;
  promptCue: string;
  targetTier: RequestTier;
  explanation: string;
  difficulty: Difficulty;
}

export function requestScenarioVerb(scenario: RequestScenario): VerbEntry {
  const verb = VERB_BANK.find((v) => v.id === scenario.verbId);
  if (!verb)
    throw new Error(`Unknown verb id in request scenario ${scenario.id}: ${scenario.verbId}`);
  return verb;
}

export function requestForm(verb: VerbEntry, tier: RequestTier): string | null {
  if (!verb.teForm) return null;
  return `${verb.teForm}${REQUEST_TIER_SUFFIX[tier]}`;
}

export function requestScenarioCorrectAnswer(scenario: RequestScenario): string | null {
  return requestForm(requestScenarioVerb(scenario), scenario.targetTier);
}

export const REQUEST_BANK: RequestScenario[] = [
  {
    id: "rq-01",
    setting: "A coworker at your desk needs a moment before you continue.",
    otherParty: "A coworker, same team",
    verbId: "matsu",
    promptCue: "Ask them to wait just a moment.",
    targetTier: "casual",
    explanation:
      "A small ask between peers — plain 〜てください is the normal register here, nothing more is needed.",
    difficulty: "beginner",
  },
  {
    id: "rq-02",
    setting: "You're finishing a report and need a coworker to double-check a figure.",
    otherParty: "A coworker, same team",
    verbId: "kakuninsuru",
    promptCue: "Ask them to confirm the number for you.",
    targetTier: "casual",
    explanation:
      "Still a peer-to-peer, low-stakes ask — 〜てください stays appropriate even though 確認する itself sounds more formal than 待つ.",
    difficulty: "beginner",
  },
  {
    id: "rq-03",
    setting: "You're on the phone with a client who mentioned a document.",
    otherParty: "A client",
    verbId: "okuru",
    promptCue: "Ask them to send it over when they get a chance.",
    targetTier: "polite",
    explanation:
      "You're asking a client to do something for your benefit — that's a favor, not a routine instruction, so it steps up to 〜ていただけますか.",
    difficulty: "intermediate",
  },
  {
    id: "rq-04",
    setting: "A senior colleague explained something quickly and you missed part of it.",
    otherParty: "A senior colleague",
    verbId: "setsumeisuru",
    promptCue: "Ask them to explain it again.",
    targetTier: "polite",
    explanation:
      "Asking a superior to redo something for you is a real (if small) imposition — 〜ていただけますか, not the plain 〜てください you'd use with a peer.",
    difficulty: "intermediate",
  },
  {
    id: "rq-05",
    setting: "You just met someone at a networking event and want to stay in touch.",
    otherParty: "Someone you just met",
    verbId: "oshieru",
    promptCue: "Ask them to give you their contact information.",
    targetTier: "polite",
    explanation:
      "A new acquaintance is soto by default and you're asking them to share something personal — 〜ていただけますか is the safe, polite default.",
    difficulty: "intermediate",
  },
  {
    id: "rq-06",
    setting: "You need to reschedule a meeting the client already confirmed.",
    otherParty: "A client",
    verbId: "henkousuru",
    promptCue: "Ask them whether the date could be changed.",
    targetTier: "formal",
    explanation:
      "This is a genuine inconvenience you're causing a client after they'd already agreed — the size of the imposition, not just who you're asking, is what pushes this to the maximally cushioned 〜ていただけますでしょうか.",
    difficulty: "advanced",
  },
  {
    id: "rq-07",
    setting: "You're writing an email asking your department head to review your proposal.",
    otherParty: "Your department head",
    verbId: "kakuninsuru",
    promptCue: "Ask them to check it over before the deadline.",
    targetTier: "formal",
    explanation:
      "Superior, in writing, asking them to spend their time on your behalf — business email register defaults to the fully cushioned form here.",
    difficulty: "advanced",
  },
  {
    id: "rq-08",
    setting: "You're calling a caller back and need a little more time.",
    otherParty: "The caller",
    verbId: "matsu",
    promptCue: "Ask them to wait a little longer.",
    targetTier: "polite",
    explanation:
      "An outside caller, not a peer — even a small ask like waiting steps up from 〜てください to 〜ていただけますか once the listener is soto.",
    difficulty: "beginner",
  },
  {
    id: "rq-09",
    setting: "You're emailing a client to let them know a document is attached.",
    otherParty: "The client",
    verbId: "kakuninsuru",
    promptCue: "Ask them to please confirm the attached details.",
    targetTier: "polite",
    explanation:
      "A routine business-email request to a client — 〜ていただけますか is the standard register, not casual and not maximally cushioned.",
    difficulty: "intermediate",
  },
  {
    id: "rq-10",
    setting: "You need to ask your boss to reconsider a decision they already made.",
    otherParty: "Your boss",
    verbId: "kakuninsuru",
    promptCue: "Ask them to check it again, knowing it's an awkward ask.",
    targetTier: "formal",
    explanation:
      "Superior plus a genuinely uncomfortable request (asking them to revisit a decision) — this is exactly the combination 〜ていただけますでしょうか exists for.",
    difficulty: "advanced",
  },
];
