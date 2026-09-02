/**
 * VERONICA — Female Voice Speech Synthesis Engine
 * Calibrated for serene, articulate, and natural executive female speech.
 */

export function speakFemaleVoice(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  }
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/[*#`_~\[\]]/g, "")
    .replace(/http\S+/g, "")
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Calibrated female acoustic settings
  utterance.rate = options?.rate ?? 0.98;
  utterance.pitch = options?.pitch ?? 1.15; // Crisp, clear female pitch

  const setBestFemaleVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return;

    // Search for high quality female voice signatures
    const femaleVoice =
      voices.find((v) =>
        /zira|samantha|victoria|karen|moira|fiona|catherine|jenny|female|google uk english female|google us english female/i.test(
          v.name
        )
      ) ||
      voices.find((v) => v.lang.startsWith("en") && /female/i.test(v.name)) ||
      voices.find((v) => v.lang.startsWith("en-US")) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
  };

  setBestFemaleVoice();

  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = setBestFemaleVoice;
  }

  utterance.onstart = () => {
    options?.onStart?.();
  };

  utterance.onend = () => {
    options?.onEnd?.();
  };

  utterance.onerror = () => {
    options?.onError?.();
    options?.onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
