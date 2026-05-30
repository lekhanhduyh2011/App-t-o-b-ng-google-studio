/**
 * Audio Speech Synthesis Utility for Calligraphy Radicals
 * Uses HTML5 SpeechSynthesis API to play authentic Chinese and Vietnamese pronunciations.
 */

export function speakChinese(text: string) {
  if (!("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis not supported by this browser.");
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending utterances
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";

    // Attempt to select an explicit Chinese voice
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find((v) => v.lang.startsWith("zh"));
    if (zhVoice) {
      utterance.voice = zhVoice;
    }

    utterance.rate = 0.8; // Slightly slower for language learners
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    console.error("Error speaking Chinese:", error);
    return false;
  }
}

export function speakVietnamese(text: string) {
  if (!("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis not supported by this browser.");
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.startsWith("vi"));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    console.error("Error speaking Vietnamese:", error);
    return false;
  }
}

/**
 * Reads out study guide info for a radical
 */
export function playRadicalAudio(character: string, pinyin: string, hanViet: string, meaning: string) {
  // First play the Chinese word pronunciation, followed by the Hán Việt name and meaning
  speakChinese(character);
  
  // Optional delay to read Vietnamese explanation afterwards
  setTimeout(() => {
    speakVietnamese(`Bộ ${hanViet}, Nghĩa là: ${meaning}`);
  }, 1000);
}
