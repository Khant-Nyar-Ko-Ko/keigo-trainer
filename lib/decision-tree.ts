import { HonorificTarget } from "./verbs";

// The three-question model that actually determines register in Japanese:
// whose action it is, and — when it's someone else's — whether that person
// is part of your own group relative to whoever you're talking to right now.
// That second distinction is what produces the classic uchi/soto flip (see
// scenarios wp-01/wp-02): the same referent gets sonkeigo or kenjougo
// depending on who's listening, not on their actual rank.

export type ActorAnswer = "self" | "other";
export type AddresseeAnswer = "direct" | "third-party";
export type GroupAnswer = "own-group" | "outsider";

export interface DecisionPath {
  actor?: ActorAnswer;
  addressee?: AddresseeAnswer;
  group?: GroupAnswer;
}

export type DecisionStep = "actor" | "addressee" | "group" | "result";

export function currentStep(path: DecisionPath): DecisionStep {
  if (!path.actor) return "actor";
  if (path.actor === "self") return "result";
  if (!path.addressee) return "addressee";
  if (path.addressee === "direct") return "result";
  if (!path.group) return "group";
  return "result";
}

export function deriveRegister(path: DecisionPath): HonorificTarget | null {
  if (path.actor === "self") return "kenjougo";
  if (path.actor === "other") {
    if (path.addressee === "direct") return "sonkeigo";
    if (path.addressee === "third-party") {
      if (path.group === "own-group") return "kenjougo";
      if (path.group === "outsider") return "sonkeigo";
    }
  }
  return null;
}

export function explainPath(path: DecisionPath): string {
  if (path.actor === "self") {
    return "It's your own action, directed toward someone you're showing respect to. You humble your own action rather than elevate theirs — kenjougo.";
  }
  if (path.addressee === "direct") {
    return "It's their own action, and you're addressing them directly with respect — sonkeigo.";
  }
  if (path.group === "own-group") {
    return "They outrank you internally, but you're describing their action to someone outside your group. When speaking to an outsider, you humble your own group's actions regardless of internal rank — kenjougo. This is the classic uchi/soto flip.";
  }
  if (path.group === "outsider") {
    return "They're outside your group relative to whoever you're talking to — their action gets sonkeigo, same as if you were speaking to them directly.";
  }
  return "";
}
