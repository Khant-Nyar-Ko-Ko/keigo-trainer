import {
  acceptableAnswers,
  conjugate,
  HonorificTarget,
  VERB_BANK,
  VerbEntry,
} from "./verbs";

export type ScenarioCategory =
  | "customer-service"
  | "workplace"
  | "phone"
  | "email"
  | "meeting";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export const CATEGORY_LABEL: Record<ScenarioCategory, string> = {
  "customer-service": "Customer service",
  workplace: "Workplace",
  phone: "Phone",
  email: "Email",
  meeting: "Meeting someone new",
};

export interface Scenario {
  id: string;
  category: ScenarioCategory;
  setting: string;
  otherParty: string;
  // true if the learner's own action is being converted; false if it's the other party's action.
  // This is the first judgment call: whose action is it?
  actorIsSelf: boolean;
  verbId: string;
  targetRegister: HonorificTarget;
  promptCue: string;
  explanation: string;
  difficulty: Difficulty;
  // marks the classic "same actor, different register depending on who's listening" cases
  flipCase?: boolean;
}

export function scenarioVerb(scenario: Scenario): VerbEntry {
  const verb = VERB_BANK.find((v) => v.id === scenario.verbId);
  if (!verb)
    throw new Error(
      `Unknown verb id in scenario ${scenario.id}: ${scenario.verbId}`,
    );
  return verb;
}

export function scenarioCorrectAnswer(scenario: Scenario): string | null {
  return conjugate(scenarioVerb(scenario), scenario.targetRegister);
}

export function scenarioAcceptableAnswers(scenario: Scenario): string[] {
  return acceptableAnswers(scenarioVerb(scenario), scenario.targetRegister);
}

export const SCENARIO_BANK: Scenario[] = [
  // Customer service
  {
    id: "cs-01",
    category: "customer-service",
    setting: "You work at a bookstore.",
    otherParty: "A customer browsing the shelves",
    actorIsSelf: false,
    verbId: "miru",
    targetRegister: "sonkeigo",
    promptCue: "A customer is looking at a book on the shelf.",
    explanation:
      "It's the customer's own action (見る), and a customer is someone you show respect to (soto, and elevated in a service context) — so their action takes sonkeigo: ご覧になる.",
    difficulty: "beginner",
  },
  {
    id: "cs-02",
    category: "customer-service",
    setting: "You work at a bookstore.",
    otherParty: "A customer looking for a specific section",
    actorIsSelf: true,
    verbId: "annaisuru",
    targetRegister: "kenjougo",
    promptCue:
      "You offer to guide the customer to the section they're looking for.",
    explanation:
      "This is your own action (案内する) directed at a customer you should honor — humble your own action with kenjougo: ご案内する.",
    difficulty: "beginner",
  },
  {
    id: "cs-03",
    category: "customer-service",
    setting: "You work at a bookstore. The customer's bag looks heavy.",
    otherParty: "A customer at the register",
    actorIsSelf: true,
    verbId: "motsu",
    targetRegister: "kenjougo",
    promptCue: "You offer to carry the customer's bag for them.",
    explanation:
      'Again your own action (持つ) toward the customer — kenjougo: お持ちする. This is the classic "let me carry that for you" pattern in Japanese service settings.',
    difficulty: "beginner",
  },

  // Workplace — includes the classic uchi/soto flip
  {
    id: "wp-01",
    category: "workplace",
    setting: "You're talking with a coworker from your own company.",
    otherParty:
      "Your boss, discussed with a coworker (same company — both of you are uchi relative to the boss)",
    actorIsSelf: false,
    verbId: "kuru",
    targetRegister: "sonkeigo",
    promptCue: "Tell your coworker: your boss is coming to the office today.",
    explanation:
      "You and your coworker are both inside the company, and your boss outranks you both — normal hierarchy applies, so the boss's action gets sonkeigo: いらっしゃる.",
    difficulty: "beginner",
  },
  {
    id: "wp-02",
    category: "workplace",
    setting: "You're talking with a client from another company.",
    otherParty:
      "Your boss, discussed with an outside client (the client is soto)",
    actorIsSelf: false,
    verbId: "kuru",
    targetRegister: "kenjougo",
    promptCue:
      "Tell the client: your boss will be coming to the meeting today.",
    explanation:
      "Same actor (your boss) and same verb as wp-01, but the register flips: because you're speaking to an outside client, your boss is now part of *your* in-group relative to the listener. You humble your own group's action in front of an outsider, regardless of internal rank — kenjougo: 参る, not いらっしゃる. This is the single most common mistake learners make with keigo.",
    difficulty: "advanced",
    flipCase: true,
  },
  {
    id: "wp-03",
    category: "workplace",
    setting: "Your department head just asked you a question in a meeting.",
    otherParty: "Your department head",
    actorIsSelf: true,
    verbId: "iu",
    targetRegister: "kenjougo",
    promptCue:
      "You're about to answer (say something to) your department head.",
    explanation:
      "Your own action toward a superior — humble it with kenjougo: 申す (or 申し上げる).",
    difficulty: "intermediate",
  },
  {
    id: "wp-04",
    category: "workplace",
    setting: "A senior colleague is about to share some news with you.",
    otherParty: "A senior colleague",
    actorIsSelf: false,
    verbId: "iu",
    targetRegister: "sonkeigo",
    promptCue: "Your senior colleague is about to say something important.",
    explanation: "Their action, and they outrank you — sonkeigo: おっしゃる.",
    difficulty: "beginner",
  },

  // Phone
  {
    id: "ph-01",
    category: "phone",
    setting: "A client calls your office asking for your section chief.",
    otherParty: "Your own section chief, described to an outside caller",
    actorIsSelf: false,
    verbId: "iru",
    targetRegister: "kenjougo",
    promptCue:
      "Tell the caller whether your section chief is in the office right now.",
    explanation:
      "Same uchi/soto logic as wp-02: your section chief is part of your own company, and the caller is outside it. You describe your own group's state humbly to an outsider — kenjougo: おる (e.g. 「ただいまおりません」), not いらっしゃる.",
    difficulty: "advanced",
    flipCase: true,
  },
  {
    id: "ph-02",
    category: "phone",
    setting: "You're calling a client's office.",
    otherParty: "A staff member at the client's company",
    actorIsSelf: false,
    verbId: "iru",
    targetRegister: "sonkeigo",
    promptCue: "Ask whether a specific staff member is in the client's office.",
    explanation:
      "Now the person you're asking about belongs to the *other* company — an outsider relative to you — so their presence gets sonkeigo: いらっしゃる (e.g. 「田中様はいらっしゃいますか」).",
    difficulty: "intermediate",
  },
  {
    id: "ph-03",
    category: "phone",
    setting: "A caller asks you to pass along a message.",
    otherParty: "The caller",
    actorIsSelf: true,
    verbId: "renrakusuru",
    targetRegister: "kenjougo",
    promptCue: "You say you will contact them back with a reply.",
    explanation:
      "Your own action toward the caller — kenjougo pattern: ご連絡する.",
    difficulty: "intermediate",
  },

  // Email
  {
    id: "em-01",
    category: "email",
    setting: "You're writing a business email to a client.",
    otherParty: "The client",
    actorIsSelf: true,
    verbId: "okuru",
    targetRegister: "kenjougo",
    promptCue: "You tell the client you will send the requested documents.",
    explanation:
      "Your own action toward the client — kenjougo pattern: お送りする.",
    difficulty: "beginner",
  },
  {
    id: "em-02",
    category: "email",
    setting: "You're writing a business email to a client.",
    otherParty: "The client",
    actorIsSelf: false,
    verbId: "yomu",
    targetRegister: "sonkeigo",
    promptCue: "You ask the client to read the attached document.",
    explanation:
      "It's the client's (future) action — sonkeigo pattern: お読みになる. In practice a request is usually softened further (お読みください), but the underlying honorific form is the same sonkeigo pattern.",
    difficulty: "intermediate",
  },
  {
    id: "em-03",
    category: "email",
    setting: "You're replying to a client's email about an issue they raised.",
    otherParty: "The client",
    actorIsSelf: true,
    verbId: "shiru",
    targetRegister: "kenjougo",
    promptCue: "You say you are already aware of the issue.",
    explanation:
      "Your own state of knowing, toward a client — kenjougo: 存じております (from 存じる).",
    difficulty: "advanced",
  },

  // Meeting someone new
  {
    id: "mt-01",
    category: "meeting",
    setting: "You've just met someone at a networking event.",
    otherParty: "The person you just met",
    actorIsSelf: false,
    verbId: "kuru",
    targetRegister: "sonkeigo",
    promptCue: "You ask if they'll be attending tomorrow's event too.",
    explanation:
      "Someone you've just met is soto by default — their action gets sonkeigo: いらっしゃる.",
    difficulty: "beginner",
  },
  {
    id: "mt-02",
    category: "meeting",
    setting: "You've just met someone at a networking event.",
    otherParty: "The person you just met",
    actorIsSelf: true,
    verbId: "iku",
    targetRegister: "kenjougo",
    promptCue: "You tell them you'll be going to the event as well.",
    explanation: "Your own action toward a new acquaintance — kenjougo: 参る.",
    difficulty: "beginner",
  },
  {
    id: "mt-03",
    category: "meeting",
    setting: "Someone you just met hands you their business card.",
    otherParty: "The person you just met",
    actorIsSelf: false,
    verbId: "kureru",
    targetRegister: "sonkeigo",
    promptCue: "They are giving you their business card.",
    explanation: "Their action of giving to you — sonkeigo: くださる.",
    difficulty: "intermediate",
  },
  {
    id: "mt-04",
    category: "meeting",
    setting: "Someone you just met offers you a snack.",
    otherParty: "The person you just met",
    actorIsSelf: true,
    verbId: "taberu",
    targetRegister: "kenjougo",
    promptCue: "You accept and say you'll eat it.",
    explanation:
      "Your own action toward someone you're showing respect to — kenjougo: いただく.",
    difficulty: "beginner",
  },
];
