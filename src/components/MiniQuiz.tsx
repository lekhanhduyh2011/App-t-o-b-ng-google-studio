import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, RefreshCw, Trophy, HelpCircle, ArrowRight, BookOpen } from "lucide-react";
import { Radical, QuizQuestion } from "../types";

interface MiniQuizProps {
  radicalsList: Radical[];
  charMode: "traditional" | "simplified" | "both";
}

export default function MiniQuiz({ radicalsList, charMode }: MiniQuizProps) {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  // Helper inside quiz to generate random options easily
  const shuffleArray = <T,>(arr: T[]): T[] => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const generateQuiz = () => {
    // Generate a fresh set of 5 multiple choice questions
    const selectedRadicals = [...radicalsList].sort(() => Math.random() - 0.5).slice(0, 5);
    const questions: QuizQuestion[] = selectedRadicals.map((rad, index) => {
      const qTypes: ("meaning" | "character" | "pinyin" | "guess_context")[] = [
        "meaning",
        "character",
        "pinyin",
        "guess_context",
      ];
      // Randomize query mode
      const type = qTypes[Math.floor(Math.random() * qTypes.length)];
      
      let questionText = "";
      let correctOpt = "";
      let optionsList: string[] = [];
      let explanation = "";

      // Distractors pool
      const distractors = radicalsList.filter((r) => r.id !== rad.id);

      // Symbol string helper for questions depending on mode
      const getSymbolStr = (r: Radical) => {
        return charMode === "traditional" ? r.character :
               charMode === "simplified" ? (r.simplifiedCharacter || r.character) :
               (r.character === r.simplifiedCharacter ? r.character : `${r.character} / ${r.simplifiedCharacter}`);
      };

      const radSymbol = getSymbolStr(rad);

      if (type === "meaning") {
        questionText = `Ý nghĩa nghĩa chính của bộ thủ "${radSymbol}" /${rad.pinyin}/ (${rad.hanViet}) là gì?`;
        correctOpt = rad.meaning;
        const otherOptions = distractors
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((r) => r.meaning);
        optionsList = shuffleArray([correctOpt, ...otherOptions]);
        explanation = `Bộ thủ "${radSymbol}" trong chữ Hán có nghĩa là "${rad.meaning}". Nhóm gốc chủ sở của nó thuộc vào "${rad.category}".`;
      } else if (type === "pinyin") {
        questionText = `Đọc phiên âm Pinyin chuẩn của bộ thủ "${radSymbol}" (${rad.hanViet} - ${rad.meaning}) là gì?`;
        correctOpt = `/${rad.pinyin}/`;
        const otherOptions = distractors
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((r) => `/${r.pinyin}/`);
        optionsList = shuffleArray([correctOpt, ...otherOptions]);
        explanation = `Bộ thủ "${radSymbol}" phát âm chính xác Pinyin là /${rad.pinyin}/.`;
      } else if (type === "guess_context") {
        // Find example
        const sampleWord = rad.commonWords[0];
        const displayWord = charMode === "traditional" ? sampleWord.word :
                            charMode === "simplified" ? (sampleWord.simplifiedWord || sampleWord.word) :
                            (sampleWord.word === sampleWord.simplifiedWord ? sampleWord.word : `${sampleWord.word} (${sampleWord.simplifiedWord})`);

        questionText = `Trong từ cơ bản thâm túy "${displayWord}" (${sampleWord.meaning}), bộ thủ "${radSymbol}" đóng vai trò gì?`;
        correctOpt = `Bộ chỉ gốc nghĩa: ${rad.meaning}`;
        optionsList = [
          correctOpt,
          "Chỉ màu sắc thẩm mỹ cảnh sắc",
          "Chỉ trợ âm không có ngữ nghĩa",
          "Bộ đại diện cho số lượng đếm",
        ];
        explanation = `Từ "${displayWord}" chứa bộ thủ "${radSymbol}" (${rad.hanViet}) - bộ này đóng vai trò chỉ nghĩa gốc, đó là "${rad.meaning}".`;
      } else {
        // type === character
        questionText = `Bộ thủ nào dưới đây có tên Hán Việt viết bằng danh tự "${rad.hanViet}" (nghĩa là: ${rad.meaning})?`;
        correctOpt = radSymbol;
        const otherOptions = distractors
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((r) => getSymbolStr(r));
        optionsList = shuffleArray([correctOpt, ...otherOptions]);
        explanation = `Bộ thủ "${radSymbol}" có tên Hán Việt chính văn là "${rad.hanViet}", mang ý nghĩa là "${rad.meaning}".`;
      }

      const correctIndex = optionsList.indexOf(correctOpt);

      return {
        id: `q-${index}`,
        type,
        question: questionText,
        options: optionsList,
        correctIndex,
        explanation,
        radical: rad,
      };
    });

    setQuizQuestions(questions);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizStarted(true);
  };

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedOpt(optIdx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOpt === quizQuestions[currentIdx].correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setIsSubmitted(false);
    setCurrentIdx((prev) => prev + 1);
  };

  const activeQuestion = quizQuestions[currentIdx];
  const isFinished = quizStarted && currentIdx >= quizQuestions.length;

  return (
    <div className="bg-white border border-amber-900/10 rounded-2xl p-5 shadow-sm space-y-5" id="interactive-quiz-block">
      <div className="border-b border-amber-900/5 pb-3 flex justify-between items-center">
        <div>
          <h3 className="font-sans font-semibold text-lg text-amber-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-red-700" />
            Luyện đố nhanh - Thuộc sâu 214 Bộ Thủ
          </h3>
          <p className="text-xs text-amber-800/80 mt-0.5">
            Trắc nghiệm nhanh ngẫu nhiên giúp bạn dập tắt nhầm lẫn mặt chữ, gặt hái tư duy phản xạ mặt bộ thủ cực nhanh.
          </p>
        </div>
        {quizStarted && !isFinished && (
          <span className="text-[10px] font-mono bg-amber-50 text-amber-900 px-2 py-1 rounded bg-amber-950/5 font-semibold">
            Điểm: {score}/{currentIdx}
          </span>
        )}
      </div>

      {!quizStarted && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <BookOpen className="w-16 h-16 text-amber-900/10" />
          <h4 className="font-serif text-lg font-bold text-amber-950">Đấu trường trí tuệ Bộ thủ</h4>
          <p className="text-xs text-amber-800/70 max-w-sm">
            Hệ thống sẽ lọc ngẫu nhiên các bộ thủ từ thư viện 214 nét vẽ để thiết lập chuỗi 5 câu đố cực kỳ lôi cuốn (Phù hợp cả Phồn Thể, Giản Thể bám vai sát chế độ bạn chọn).
          </p>
          <button
            onClick={generateQuiz}
            className="py-2.5 px-6 rounded-xl bg-red-700 hover:bg-red-800 text-white font-sans font-medium text-sm transition-all shadow-md shadow-red-700/10 cursor-pointer"
          >
            Bắt đầu Thách đấu Ngay
          </button>
        </div>
      )}

      {quizStarted && !isFinished && activeQuestion && (
        <div className="space-y-4 text-left">
          {/* Question indexing bar */}
          <div className="flex justify-between items-center text-xs text-amber-900/50">
            <span>Tiến trình câu đố: {currentIdx + 1} / 5</span>
            <span className="bg-amber-100/30 border border-amber-900/10 rounded-full px-2 py-0.5 text-[9px]">
              Dạng đố: {activeQuestion.type === "meaning" ? "Dịch nghĩa" : activeQuestion.type === "pinyin" ? "Học âm" : "Đoán chữ"}
            </span>
          </div>

          {/* Question text */}
          <h4 className="font-sans font-semibold text-sm text-amber-950 leading-relaxed">
            {activeQuestion.question}
          </h4>

          {/* Graphical Radical Large Highlight (if applicable) */}
          {activeQuestion.radical && (
            <div className="flex justify-center py-3 bg-amber-50/20 border border-amber-950/5 rounded-xl">
              <span className="font-serif text-5xl font-black text-amber-950 flex items-baseline gap-1.5 justify-center leading-none">
                {charMode === "traditional" && activeQuestion.radical.character}
                {charMode === "simplified" && (activeQuestion.radical.simplifiedCharacter || activeQuestion.radical.character)}
                {charMode === "both" && (
                  activeQuestion.radical.character === activeQuestion.radical.simplifiedCharacter ? (
                    activeQuestion.radical.character
                  ) : (
                    <span className="flex items-center gap-1 mx-auto justify-center">
                      <span className="text-amber-955 text-4xl font-extrabold">{activeQuestion.radical.character}</span>
                      <span className="text-xs text-amber-900/30 font-normal">→</span>
                      <span className="text-4xl font-black text-red-750">{activeQuestion.radical.simplifiedCharacter}</span>
                    </span>
                  )
                )}
              </span>
            </div>
          )}

          {/* Options list */}
          <div className="grid grid-cols-1 gap-2.5">
            {activeQuestion.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrectOpt = idx === activeQuestion.correctIndex;

              let btnStyle = "bg-amber-50/20 hover:bg-amber-100/50 border-amber-900/10 text-amber-950";
              if (isSelected) {
                btnStyle = "bg-red-50 border-red-700 text-red-950 font-medium ring-1 ring-red-700/20";
              }

              if (isSubmitted) {
                if (isCorrectOpt) {
                  btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500/20";
                } else if (isSelected) {
                  btnStyle = "bg-red-50 border-red-500 text-red-950 line-through";
                } else {
                  btnStyle = "bg-gray-50 border-gray-200 text-gray-400 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-sans transition-all flex justify-between items-center ${
                    !isSubmitted ? "cursor-pointer hover:translate-x-0.5" : ""
                  } ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isSubmitted && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-1" />}
                  {isSubmitted && isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-red-650 flex-shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>

          {/* Action trigger */}
          <div className="pt-2">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOpt === null}
                className={`w-full py-2.5 px-4 rounded-xl font-sans font-semibold text-xs text-white transition-all ${
                  selectedOpt === null
                    ? "bg-amber-200 text-amber-800 cursor-not-allowed"
                    : "bg-amber-950 hover:bg-amber-900 shadow-md cursor-pointer"
                }`}
              >
                Gửi Đáp án Thống kê
              </button>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {/* Explain box */}
                <div className="bg-amber-50/50 border border-amber-950/10 p-3.5 rounded-xl">
                  <p className="text-[10px] font-bold text-amber-950 uppercase mb-1">Kiến thức sâu:</p>
                  <p className="text-xs text-amber-900/80 leading-relaxed font-sans italic">
                    {activeQuestion.explanation}
                  </p>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white rounded-xl font-sans font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-700/10"
                >
                  {currentIdx === 4 ? "Xem kết quả chung cuộc" : "Chuyển câu tiếp theo"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isFinished && (
        <div className="py-10 flex flex-col items-center justify-center text-center space-y-5 animate-fade-in">
          <div className="relative">
            <Trophy className="w-16 h-16 text-yellow-500 animate-bounce" />
            <div className="absolute inset-0 bg-yellow-400/10 rounded-full blur-xl scale-125"></div>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-serif text-lg font-black text-amber-950">Chúc mừng bạn hoàn thành chuỗi thử thách!</h4>
            <div className="text-center font-semibold text-sm">
              Thành tích: <span className="text-2xl font-black font-mono text-red-700">{score} / 5</span> câu trả lời đúng
            </div>
            <p className="text-xs text-amber-800/70 max-w-sm mt-1 mx-auto">
              {score === 5
                ? "Thiên tài Thư văn! Bộ thủ quả thật không có gì làm khó được bạn. Giữ vững phong độ hàng ngày nhé!"
                : score >= 3
                ? "Thành tích tuyệt vời! Bạn đã bắt đầu ghi nhớ sâu sắc các tổ hợp gốc chữ. Ôn tập thêm Leitner để hoàn chỉnh nhé."
                : "Rất đáng khen khi đã dũng cảm mổ xẻ chữ! Hãy ôn lại các thẻ nhớ từ vựng bị quên hôm nay."}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generateQuiz}
              className="py-2 px-5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-50 font-sans font-medium text-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Làm chuỗi câu đố mới
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
