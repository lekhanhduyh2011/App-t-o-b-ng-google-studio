export interface Radical {
  id: number;           // 1 to 214
  character: string;    // Traditional radical symbol (e.g. 貝)
  simplifiedCharacter?: string; // Simplified radical symbol (e.g. 贝)
  variant?: string;     // Variant forms, if any (e.g. 氵 for 水, 亻 for 人)
  simplifiedVariant?: string; // Simplified variant, if any (e.g. 讠)
  strokes: number;      // Traditional stroke count
  simplifiedStrokes?: number; // Simplified stroke count if different
  pinyin: string;       // Pinyin (e.g. rén)
  hanViet: string;      // Sino-Vietnamese name (e.g. NHÂN)
  meaning: string;      // Vietnamese core meaning (e.g. người)
  category: string;     // Categorized by related meaning (e.g. Con người, Tự nhiên, Vật dụng, v.v.)
  frequency: "high" | "medium" | "low"; // Frequency representation
  description: string;  // Short mnemonic origin context
  commonWords: {        // Traditional words containing this radical
    word: string;       // e.g. 媽
    simplifiedWord?: string; // e.g. 妈
    pinyin: string;     // e.g. mā
    hanViet: string;    // e.g. MÃ
    meaning: string;    // e.g. Mẹ (có bộ NỮ 女 chỉ nữ giới)
  }[];
}

export interface LeitnerProgress {
  radicalId: number;
  box: number;          // 1 (New/Failed), 2 (Learning), 3 (Reviewing), 4 (Mastered)
  nextReviewDate: string; // ISO String format
  attempts: number;
  successCount: number;
}

export interface DailyReminder {
  id: string;
  time: string;         // HH:mm
  enabled: boolean;
  frequency: "daily" | "weekly";
}

export interface QuizQuestion {
  id: string;
  type: "meaning" | "character" | "guess_context" | "pinyin";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  radical?: Radical;
}
