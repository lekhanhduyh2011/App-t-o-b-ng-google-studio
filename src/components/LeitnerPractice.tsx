import { useState, useMemo } from "react";
import { HelpCircle, RefreshCcw, CheckCircle, AlertTriangle, ArrowRight, BookOpen, Star, Sparkles, Volume2 } from "lucide-react";
import { Radical, LeitnerProgress } from "../types";
import { speakChinese, playRadicalAudio } from "../utils/audio";

interface LeitnerPracticeProps {
  radicalsList: Radical[];
  leitnerProgress: LeitnerProgress[];
  onReviewResult: (radicalId: number, isSuccess: boolean) => void;
  onRemoveFromLeitner: (radicalId: number) => void;
  charMode: "traditional" | "simplified" | "both";
}

export default function LeitnerPractice({
  radicalsList,
  leitnerProgress,
  onReviewResult,
  onRemoveFromLeitner,
  charMode,
}: LeitnerPracticeProps) {
  const [activeBoxFilter, setActiveBoxFilter] = useState<number | "all">("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Group all progress cards mapping with details
  const activeReviewCards = useMemo(() => {
    return leitnerProgress
      .map((progress) => {
        const rad = radicalsList.find((r) => r.id === progress.radicalId);
        return { progress, rad };
      })
      .filter((item) => {
        if (!item.rad) return false;
        if (activeBoxFilter === "all") return true;
        return item.progress.box === activeBoxFilter;
      });
  }, [leitnerProgress, radicalsList, activeBoxFilter]);

  // Handle current card indexing carefully
  const currentCard = useMemo(() => {
    if (activeReviewCards.length === 0) return null;
    if (currentIndex >= activeReviewCards.length) {
      setCurrentIndex(0);
      return activeReviewCards[0] || null;
    }
    return activeReviewCards[currentIndex];
  }, [activeReviewCards, currentIndex]);

  // Statistics
  const stats = useMemo(() => {
    const boxCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    leitnerProgress.forEach((p) => {
      if (p.box >= 1 && p.box <= 4) {
        boxCounts[p.box as 1 | 2 | 3 | 4]++;
      }
    });
    return {
      total: leitnerProgress.length,
      ...boxCounts,
    };
  }, [leitnerProgress]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % activeReviewCards.length);
  };

  const handleAnswer = (isSuccess: boolean) => {
    if (!currentCard) return;
    
    // Call parent handler to update Spaced Repetition queue
    onReviewResult(currentCard.progress.radicalId, isSuccess);
    
    // Flip front-back state back to cover side A
    setIsFlipped(false);

    // If we have cards, move forward
    if (activeReviewCards.length > 1) {
      // Just progress index normally
      setCurrentIndex((prev) => (prev + 1) % activeReviewCards.length);
    }
  };

  const currentBoxLabel = (box: number) => {
    switch (box) {
      case 1:
        return "Bắt đầu/Quên (Mỗi ngày)";
      case 2:
        return "Đang học (Cách 2 ngày)";
      case 3:
        return "Nhớ vừa (Cách 5 ngày)";
      case 4:
        return "Đã thành thạo (Cách 10 ngày)";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6" id="leitner-spaced-repetition-panel">
      {/* Upper Leitner Boxes Panel Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Total stats filter button */}
        <button
          onClick={() => {
            setActiveBoxFilter("all");
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
            activeBoxFilter === "all"
              ? "bg-amber-950 border-amber-950 text-amber-50 shadow-md"
              : "bg-white border-amber-900/10 text-amber-950 hover:bg-amber-50/50"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">Tổng ôn tập</span>
          <span className="text-2xl font-bold font-mono block mt-1">{stats.total}</span>
          <span className="text-[10px] mt-1.5 block italic opacity-60">Toàn bộ thẻ học</span>
        </button>

        {/* Box 1 */}
        <button
          onClick={() => {
            setActiveBoxFilter(1);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
            activeBoxFilter === 1
              ? "bg-red-700 border-red-700 text-white shadow-md animate-pulse-slow"
              : "bg-white border-amber-900/10 text-amber-950 hover:bg-amber-50/50"
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Hộp 1 (Chưa thuộc)</span>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          </div>
          <span className="text-2xl font-bold font-mono block mt-1">{stats[1]}</span>
          <span className="text-[10px] mt-1.5 block opacity-60">Ôn hàng ngày</span>
        </button>

        {/* Box 2 */}
        <button
          onClick={() => {
            setActiveBoxFilter(2);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
            activeBoxFilter === 2
              ? "bg-amber-500 border-amber-500 text-amber-950 shadow-md"
              : "bg-white border-amber-900/10 text-amber-950 hover:bg-amber-50/50"
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Hộp 2 (Đợi nhớ)</span>
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          </div>
          <span className="text-2xl font-bold font-mono block mt-1 text-inherit">{stats[2]}</span>
          <span className="text-[10px] mt-1.5 block opacity-60">Ôn cách 2 ngày</span>
        </button>

        {/* Box 3 */}
        <button
          onClick={() => {
            setActiveBoxFilter(3);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
            activeBoxFilter === 3
              ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
              : "bg-white border-amber-900/10 text-amber-950 hover:bg-amber-50/50"
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Hộp 3 (Nhớ sâu)</span>
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
          </div>
          <span className="text-2xl font-bold font-mono block mt-1">{stats[3]}</span>
          <span className="text-[10px] mt-1.5 block opacity-60">Ôn cách 5 ngày</span>
        </button>

        {/* Box 4 */}
        <button
          onClick={() => {
            setActiveBoxFilter(4);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
            activeBoxFilter === 4
              ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
              : "bg-white border-amber-900/10 text-amber-950 hover:bg-amber-50/50"
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Hộp 4 (Thành thạo)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <span className="text-2xl font-bold font-mono block mt-1">{stats[4]}</span>
          <span className="text-[10px] mt-1.5 block opacity-60">Ôn cách 10 ngày</span>
        </button>
      </div>

      {/* Main Flashcard interface area */}
      <div className="max-w-xl mx-auto">
        {activeReviewCards.length === 0 ? (
          <div className="bg-white border border-amber-900/10 rounded-2xl p-12 text-center text-amber-800/70 shadow-sm space-y-4">
            <BookOpen className="w-16 h-16 text-amber-900/10 mx-auto" />
            <h4 className="font-sans font-semibold text-lg text-amber-950">
              {activeBoxFilter === "all"
                ? "Thư viện Leitner của bạn đang trống"
                : `Hộp số ${activeBoxFilter} hiện không có bộ thủ`}
            </h4>
            <p className="text-xs">
              {activeBoxFilter === "all"
                ? "Vui lòng vào danh mục 'Danh mục Tra cứu 214 Bộ thủ' bên dưới, chọn bộ thủ và bấm 'Thêm vào Hộp Leitner' để kích hoạt danh sách ôn tập cá nhân."
                : "Chúc mừng! Tất cả thẻ học có thể đã thăng cấp lên hộp cao hơn, hãy chuyển sang học các hộp khác."}
            </p>
          </div>
        ) : (
          currentCard &&
          currentCard.rad && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-between text-xs px-2">
                <span className="text-amber-900/50 font-sans font-medium flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  Đang ôn hộp: <strong>Hộp #{currentCard.progress.box}</strong>
                </span>
                <span className="text-amber-900/60 font-mono">
                  Quản lý thẻ: {currentIndex + 1} / {activeReviewCards.length}
                </span>
              </div>

              {/* Double-side Flip Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`w-full min-h-[340px] bg-white border-2 border-amber-950/20 rounded-3xl p-6 shadow-md transition-all duration-300 relative cursor-pointer flex flex-col justify-between hover:border-red-700/50 overflow-hidden ${
                  isFlipped ? "ring-1 ring-red-700/10 shadow-lg" : ""
                }`}
              >
                {/* Vintage paper texture background effect */}
                <div className="absolute inset-0 bg-radial from-amber-50/5 to-amber-100/5 pointer-events-none"></div>

                <span className="absolute top-4 right-4 text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-900/10 px-2 py-0.5 rounded-full z-10">
                  {currentBoxLabel(currentCard.progress.box)}
                </span>

                {/* Content Side A (Front) */}
                {!isFlipped ? (
                  <div className="flex-1 flex flex-col justify-center items-center py-8">
                    <span className="font-serif text-8xl font-bold text-amber-950 drop-shadow-sm select-none leading-none flex items-baseline gap-1 justify-center">
                      {charMode === "traditional" && currentCard.rad.character}
                      {charMode === "simplified" && (currentCard.rad.simplifiedCharacter || currentCard.rad.character)}
                      {charMode === "both" && (
                        currentCard.rad.character === currentCard.rad.simplifiedCharacter ? (
                          currentCard.rad.character
                        ) : (
                          <span className="flex items-center gap-1.5 justify-center">
                            <span className="text-amber-955 text-7xl font-black">{currentCard.rad.character}</span>
                            <span className="text-xl text-amber-900/30 font-normal">→</span>
                            <span className="text-7xl font-black text-red-750">{currentCard.rad.simplifiedCharacter}</span>
                          </span>
                        )
                      )}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playRadicalAudio(
                          charMode === "simplified" ? (currentCard.rad!.simplifiedCharacter || currentCard.rad!.character) : currentCard.rad!.character,
                          currentCard.rad!.pinyin,
                          currentCard.rad!.hanViet,
                          currentCard.rad!.meaning
                        );
                      }}
                      className="mt-4 p-1.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-900/10 rounded-full transition-all text-red-750 flex items-center gap-1 text-xs shadow-sm cursor-pointer"
                      title="Nghe phát âm chuẩn"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="font-sans font-semibold text-[10px]">Đọc âm</span>
                    </button>
                    {(currentCard.rad.variant || currentCard.rad.simplifiedVariant) && (
                      <span className="text-xs text-amber-900/50 font-serif mt-3 text-center">
                        Biến thể khác: {charMode === "traditional" ? currentCard.rad.variant : 
                          charMode === "simplified" ? (currentCard.rad.simplifiedVariant || currentCard.rad.variant) :
                          `${currentCard.rad.variant || ""}${currentCard.rad.simplifiedVariant && currentCard.rad.simplifiedVariant !== currentCard.rad.variant ? ` / ${currentCard.rad.simplifiedVariant}` : ""}`}
                      </span>
                    )}
                    <span className="mt-6 text-xs text-amber-850/60 font-sans flex items-center gap-1 bg-amber-50/55 px-3 py-1.5 rounded-full">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-800" />
                      Chạm để lật thẻ xem nghĩa gốc
                    </span>
                  </div>
                ) : (
                  /* Content Side B (Back) */
                  <div className="flex-1 flex flex-col text-left space-y-4 py-2">
                    <div className="flex items-baseline justify-between border-b border-amber-900/10 pb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-3xl font-bold text-amber-950 inline leading-none">
                          {charMode === "traditional" && currentCard.rad.character}
                          {charMode === "simplified" && (currentCard.rad.simplifiedCharacter || currentCard.rad.character)}
                          {charMode === "both" && (
                            currentCard.rad.character === currentCard.rad.simplifiedCharacter ? (
                              currentCard.rad.character
                            ) : (
                              <span>
                                {currentCard.rad.character} <span className="text-xl font-normal text-amber-900/40 font-serif">({currentCard.rad.simplifiedCharacter})</span>
                              </span>
                            )
                          )}
                        </h4>
                        <span className="text-xl font-bold text-amber-900 uppercase font-serif ml-1 leading-none">
                          {currentCard.rad.hanViet}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playRadicalAudio(
                              charMode === "simplified" ? (currentCard.rad!.simplifiedCharacter || currentCard.rad!.character) : currentCard.rad!.character,
                              currentCard.rad!.pinyin,
                              currentCard.rad!.hanViet,
                              currentCard.rad!.meaning
                            );
                          }}
                          className="p-1 bg-red-105 hover:bg-red-200/60 border border-red-200/50 rounded text-red-750 flex items-center justify-center transition-all cursor-pointer"
                          title="Đọc âm bộ"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-mono text-sm text-amber-700 font-semibold">
                        /{currentCard.rad.pinyin}/
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-amber-900/50 uppercase font-bold tracking-widest block">
                          Nghĩa Việt:
                        </span>
                        <p className="text-sm font-sans font-semibold text-amber-950 capitalize-first">
                          {currentCard.rad.meaning} (Gốc: {currentCard.rad.category})
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-amber-900/50 uppercase font-bold tracking-widest block">
                          Mẹo nhớ tự viện:
                        </span>
                        <p className="text-[11px] leading-relaxed text-amber-900/80 bg-amber-50/50 p-2.5 rounded-xl border border-amber-950/5 font-sans italic">
                          {currentCard.rad.description}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-amber-900/50 uppercase font-bold tracking-widest block mb-1">
                          Từ ghép mẫu tương ứng:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {currentCard.rad.commonWords.map((cw, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-amber-50 text-amber-950 border border-amber-900/10 rounded-lg px-2.5 py-1.5 font-sans font-medium flex items-center gap-1.5 hover:bg-amber-100 transition-colors cursor-pointer shadow-xs"
                              title={cw.meaning}
                              onClick={(e) => {
                                e.stopPropagation();
                                speakChinese(charMode === "simplified" ? (cw.simplifiedWord || cw.word) : cw.word);
                              }}
                            >
                              <strong className="font-serif text-sm font-black text-amber-955">
                                {charMode === "traditional" && cw.word}
                                {charMode === "simplified" && (cw.simplifiedWord || cw.word)}
                                {charMode === "both" && (
                                  cw.word === cw.simplifiedWord ? (
                                    cw.word
                                  ) : (
                                    `${cw.word} (${cw.simplifiedWord})`
                                  )
                                )}
                              </strong> ({cw.hanViet})
                              <Volume2 className="w-3 h-3 text-red-750/70" />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <span className="text-[9px] text-amber-800/40 text-center block italic select-none pt-1">
                      Chạm ở bất cứ vị trí nào để úp lại thẻ mặt trước
                    </span>
                  </div>
                )}

                <div className="border-t border-amber-900/5 pt-3 flex justify-between items-center text-xs text-amber-950/50">
                  <span>Mức độ: {currentCard.rad.strokes} nét</span>
                  <span>
                    Học lực: {currentCard.progress.successCount || 0} lần đạt / {currentCard.progress.attempts || 0} lần thử
                  </span>
                </div>
              </div>

              {/* Feedback controls strictly for Leitner action */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer(false)}
                  className="py-3 px-4 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border border-red-200 hover:translate-y-[-1px] active:scale-95 shadow-sm"
                >
                  <AlertTriangle className="w-4 h-4 text-red-650" />
                  Mất dấu / Chưa thuộc (Về Hộp 1)
                </button>

                <button
                  onClick={() => handleAnswer(true)}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/10 hover:translate-y-[-1px] active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  Nhớ rõ / Đã thuộc (Lên Hộp)
                </button>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => onRemoveFromLeitner(currentCard.progress.radicalId)}
                  className="text-xs text-red-700/60 hover:text-red-700 bg-transparent underline cursor-pointer"
                >
                  Xóa khỏi danh sách ôn tập ngày
                </button>

                {activeReviewCards.length > 1 && (
                  <button
                    onClick={handleNext}
                    className="text-xs text-amber-900 hover:text-red-700 font-sans font-semibold flex items-center gap-1 cursor-pointer focus:outline-none"
                  >
                    Bỏ qua lượt này
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
