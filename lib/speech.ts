// Browser-native TTS — free, no backend, matches the app's "no AI, no cost"
// drills badge. `"speechSynthesis" in window` alone doesn't guarantee a
// Japanese voice is installed, so callers should gate on hasJapaneseVoice()
// and hide the control entirely rather than show one that silently does
// nothing.
export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function hasJapaneseVoice(): boolean {
  if (!speechSupported()) return false;
  return window.speechSynthesis.getVoices().some((voice) => voice.lang.startsWith("ja"));
}

export function speakJapanese(text: string): void {
  if (!speechSupported()) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
