import { useState, useEffect } from "react";
import { BookOpen, HelpCircle, Trophy, PenTool, Flame, Sparkles, Star, GraduationCap } from "lucide-react";
import { radicals } from "./data/radicals";
import { Radical, LeitnerProgress } from "./types";

// Sub-components
import DrawingBoard from "./components/DrawingBoard";
import RadicalDirectory from "./components/RadicalDirectory";
import LeitnerPractice from "./components/LeitnerPractice";
import WordExplainer from "./components/WordExplainer";
import MiniQuiz from "./components/MiniQuiz";
import DailyAdvisor from "./components/DailyAdvisor";
import BeginnerGuide from "./components/BeginnerGuide";
import StudyLessons from "./components/StudyLessons";

export default function App() {
  const [activeTab, setActiveTab] = useState<"directory" | "practice" | "explainer" | "quiz" | "guide" | "lessons">("lessons");
  const [selectedRadical, setSelectedRadical] = useState<Radical | null>(null);
  const [leitnerProgress, setLeitnerProgress] = useState<LeitnerProgress[]>([]);

  // Local state for letter style mode: Traditional ("traditional"), Simplified ("simplified"), side-by-side ("both")
  const [charMode, setCharMode] = useState<"traditional" | "simplified" | "both">(() => {
    const saved = localStorage.getItem("calligraphy_char_mode");
    return (saved as any) || "both";
  });

  const saveCharMode = (mode: "traditional" | "simplified" | "both") => {
    setCharMode(mode);
    localStorage.setItem("calligraphy_char_mode", mode);
  };

  // Load Leitner state from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("calligraphy_leitner_progress_v1");
    if (saved) {
      try {
        setLeitnerProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Lỗi phục hồi dữ liệu học vấn:", e);
      }
    } else {
      // Bootstrap with a few common high-frequency radicals so that user gets prompt items right away
      const defaultIds = [9, 15, 18, 30, 32, 38, 61, 64, 72, 75, 85, 86, 120, 140, 149]; // standard high freq
      const initialProgress: LeitnerProgress[] = defaultIds.map((id) => ({
        radicalId: id,
        box: 1,
        nextReviewDate: new Date().toISOString(),
        attempts: 0,
        successCount: 0,
      }));
      setLeitnerProgress(initialProgress);
      localStorage.setItem("calligraphy_leitner_progress_v1", JSON.stringify(initialProgress));
    }

    // Set first default focused radical if empty
    if (radicals.length > 0) {
      setSelectedRadical(radicals[8]); // Default is ID 9 - Bộ Nhân 人
    }
  }, []);

  // Save Leitner state on change
  const saveLeitner = (newProg: LeitnerProgress[]) => {
    setLeitnerProgress(newProg);
    localStorage.setItem("calligraphy_leitner_progress_v1", JSON.stringify(newProg));
  };

  // Add radical to study queue
  const handleAddToLeitner = (radicalId: number) => {
    const exists = leitnerProgress.some((p) => p.radicalId === radicalId);
    if (exists) return; // already in queue

    const newObj: LeitnerProgress = {
      radicalId,
      box: 1, // box 1
      nextReviewDate: new Date().toISOString(),
      attempts: 0,
      successCount: 0,
    };
    saveLeitner([newObj, ...leitnerProgress]);
  };

  // Remove radical from study queue
  const handleRemoveFromLeitner = (radicalId: number) => {
    const filtered = leitnerProgress.filter((p) => p.radicalId !== radicalId);
    saveLeitner(filtered);
  };

  // Update spaced repetition parameters based on recalling answers
  const handleReviewResult = (radicalId: number, isSuccess: boolean) => {
    const updated = leitnerProgress.map((item) => {
      if (item.radicalId !== radicalId) return item;

      const attempts = item.attempts + 1;
      let successCount = item.successCount;
      let box = item.box;

      if (isSuccess) {
        successCount += 1;
        // Advance to next box if not already at Box 4 (Mastered)
        box = Math.min(4, box + 1);
      } else {
        // Drop back to Box 1 on any recall failure
        box = 1;
      }

      // Calculate next review intervals: Box 1 (+0 days/now), Box 2 (+1 day), Box 3 (+3 days), Box 4 (+7 days)
      const now = new Date();
      if (box === 2) now.setDate(now.getDate() + 1);
      else if (box === 3) now.setDate(now.getDate() + 3);
      else if (box === 4) now.setDate(now.getDate() + 7);

      return {
        ...item,
        attempts,
        successCount,
        box,
        nextReviewDate: now.toISOString(),
      };
    });

    saveLeitner(updated);
  };

  // Quick stats computed
  const masteredCount = leitnerProgress.filter((p) => p.box === 4).length;
  const streakCount = Math.max(1, Math.floor(leitnerProgress.length / 3));

  return (
    <div className="bg-stone-100 min-h-screen text-stone-900 font-sans relative flex flex-col justify-between selection:bg-red-200">
      {/* Decorative Traditional Asian Red Borders and Calligraphy Elements */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-red-750"></div>
      
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        
        {/* Calligraphy styled Header Banner */}
        <header className="bg-white border-2 border-amber-950/15 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden" id="ink-banner-header">
          {/* Faint watermark container of dragon symbol / traditional background seal */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-amber-900/5 select-none font-serif text-[180px] pointer-events-none hidden md:block leading-none">
            𡨴
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
            <div>
              <div className="flex items-center gap-2 mb-1.5 font-sans">
                <span className="bg-red-750 text-amber-50 text-[10px] uppercase font-serif tracking-widest font-black px-2.5 py-1 rounded inline-flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  Đại Thư Hán Tự (Phồn/Giản)
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-900/10 font-bold">
                  214 Bộ Thủ Song Thể
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-955 tracking-tight flex items-baseline gap-2">
                Bộ Thủ Thư Pháp
                <span className="text-sm font-serif text-red-750 font-semibold tracking-normal hidden sm:inline-block">
                  漢字部首 ─ Trí Tuệ Khai Sáng Chữ Nhân
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-amber-900/80 mt-1 max-w-2xl leading-relaxed">
                Nơi khai phóng toàn diện nghệ thuật học 214 bộ thủ chữ Hán phồn thể và giản thể. Tra cứu bằng nét vẽ tay AI đột phá, giải mã ý nghĩa cấu tạo, luyện Leitner phản xạ nhớ lâu và nhận thông báo nhắc nhở thông minh mỗi ngày.
              </p>
            </div>

            {/* Micro stats counts */}
            <div className="flex items-center gap-4 bg-amber-50/50 border border-amber-900/10 rounded-2xl p-4 shadow-inner self-stretch md:self-auto justify-around">
              <div className="text-center px-2">
                <span className="text-[10px] text-amber-900/50 uppercase font-bold tracking-wider block">Đang học tập</span>
                <span className="text-xl font-bold text-amber-950 font-mono block mt-0.5">
                  {leitnerProgress.length} <span className="text-xs text-amber-900/40">bộ</span>
                </span>
              </div>
              <div className="h-8 w-px bg-amber-900/10"></div>
              <div className="text-center px-2">
                <span className="text-[10px] text-amber-900/50 uppercase font-bold tracking-wider block">Thành thạo</span>
                <span className="text-xl font-bold text-emerald-800 font-mono block mt-0.5 flex items-center justify-center gap-1">
                  {masteredCount}
                  {masteredCount > 0 && <span className="text-[9px] bg-emerald-100 text-emerald-800 rounded px-1">L4</span>}
                </span>
              </div>
              <div className="h-8 w-px bg-amber-900/10"></div>
              <div className="text-center px-2">
                <span className="text-[10px] text-amber-900/50 uppercase font-bold tracking-wider block">Học mạch (Streak)</span>
                <span className="text-xl font-bold text-amber-955 block mt-0.5 flex items-center justify-center gap-1 font-mono">
                  <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-pulse" />
                  {streakCount} ngày
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Tabs menu selection */}
        <div className="flex flex-col sm:flex-row gap-2 border-b border-amber-900/15 pb-0.5 justify-center sm:justify-start">
          <button
            onClick={() => setActiveTab("lessons")}
            className={`px-4 py-3 text-xs sm:text-sm font-sans font-bold flex items-center justify-center gap-2 rounded-xl transition-all relative cursor-pointer ${
              activeTab === "lessons"
                ? "bg-amber-950 text-amber-50 shadow-sm"
                : "text-amber-950/60 hover:text-amber-950 hover:bg-white/50"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            Góc học tập
          </button>

          <button
            onClick={() => setActiveTab("guide")}
            className={`px-4 py-3 text-xs sm:text-sm font-sans font-bold flex items-center justify-center gap-2 rounded-xl transition-all relative cursor-pointer ${
              activeTab === "guide"
                ? "bg-amber-950 text-amber-50 shadow-sm"
                : "text-amber-950/60 hover:text-amber-950 hover:bg-white/50"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Nhập Môn Nét Bút
          </button>

          <button
            onClick={() => setActiveTab("directory")}
            className={`px-4 py-3 text-xs sm:text-sm font-sans font-bold flex items-center justify-center gap-2 rounded-xl transition-all relative cursor-pointer ${
              activeTab === "directory"
                ? "bg-amber-950 text-amber-50 shadow-sm"
                : "text-amber-950/60 hover:text-amber-950 hover:bg-white/50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Tra cứu 214 Bộ Thủ
          </button>

          <button
            onClick={() => setActiveTab("practice")}
            className={`px-4 py-3 text-xs sm:text-sm font-sans font-bold flex items-center justify-center gap-2 rounded-xl transition-all relative cursor-pointer ${
              activeTab === "practice"
                ? "bg-amber-950 text-amber-50 shadow-sm"
                : "text-amber-950/60 hover:text-amber-950 hover:bg-white/50"
            }`}
          >
            <Flame className="w-4 h-4" />
            Học Thẻ nhớ Leitner
            {leitnerProgress.length > 0 && (
              <span className="bg-red-750 text-amber-50 text-[9px] font-mono font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {leitnerProgress.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("explainer")}
            className={`px-4 py-3 text-xs sm:text-sm font-sans font-bold flex items-center justify-center gap-2 rounded-xl transition-all relative cursor-pointer ${
              activeTab === "explainer"
                ? "bg-amber-950 text-amber-50 shadow-sm"
                : "text-amber-950/60 hover:text-amber-950 hover:bg-white/50"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Đoán Nghĩa Chữ Hán
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-4 py-3 text-xs sm:text-sm font-sans font-bold flex items-center justify-center gap-2 rounded-xl transition-all relative cursor-pointer ${
              activeTab === "quiz"
                ? "bg-amber-950 text-amber-50 shadow-sm"
                : "text-amber-950/60 hover:text-amber-950 hover:bg-white/50"
            }`}
          >
            <Trophy className="w-4 h-4" />
            Thách đấu Đố vui
          </button>
        </div>

        {/* Dynamic Study Reminders & AI Mnemonic Advisor Panel (Universal on focus boards) */}
        <section className="animate-fade-in">
          <DailyAdvisor leitnerProgress={leitnerProgress} />
        </section>

        {/* Interactive Handwriting search canvas - embedded in directory look-up for fast tracking */}
        {activeTab === "directory" && (
          <section className="animate-fade-in">
            <DrawingBoard
              onRadicalSelect={(rad) => {
                setSelectedRadical(rad);
                // Scroll smoothly to details panel
                const doc = document.getElementById("radical-directory");
                if (doc) doc.scrollIntoView({ behavior: "smooth" });
              }}
              radicalsList={radicals}
            />
          </section>
        )}

        {/* Active main workspace panels */}
        <section className="bg-stone-50/50 border border-amber-900/5 rounded-3xl p-2 sm:p-5">
          {activeTab === "lessons" && (
            <StudyLessons
              radicalsList={radicals}
              leitnerProgress={leitnerProgress}
              onAddToLeitner={handleAddToLeitner}
              charMode={charMode}
            />
          )}

          {activeTab === "guide" && (
            <BeginnerGuide />
          )}

          {activeTab === "directory" && (
            <RadicalDirectory
              radicalsList={radicals}
              leitnerProgress={leitnerProgress}
              onAddToLeitner={handleAddToLeitner}
              selectedRadical={selectedRadical}
              setSelectedRadical={setSelectedRadical}
              charMode={charMode}
              setCharMode={saveCharMode}
            />
          )}

          {activeTab === "practice" && (
            <LeitnerPractice
              radicalsList={radicals}
              leitnerProgress={leitnerProgress}
              onReviewResult={handleReviewResult}
              onRemoveFromLeitner={handleRemoveFromLeitner}
              charMode={charMode}
            />
          )}

          {activeTab === "explainer" && (
            <WordExplainer charMode={charMode} />
          )}

          {activeTab === "quiz" && (
            <MiniQuiz radicalsList={radicals} charMode={charMode} />
          )}
        </section>

      </main>

      {/* Nho nhã Calligraphy Footer page signet */}
      <footer className="border-t border-amber-900/10 py-8 bg-white/70 text-center text-xs text-amber-900/60 space-y-2 mt-12">
        <div className="flex items-center justify-center gap-1.5 font-serif text-sm font-black text-amber-950">
          <span>印</span>
          <span>BỘ THỦ THƯ PHÁP ─ 學無止境</span>
        </div>
        <p className="max-w-md mx-auto px-5 leading-normal">
          Hệ thống mổ xẻ cấu trúc chữ Hán chính thống vận hành trên nền tảng trí tuệ nhân tạo Gemini 3.5 Flash. Tôn vinh vẻ đẹp văn hiến vạn thuở của chữ Hán phồn thể và giản thể.
        </p>
        <p className="font-mono text-[10px] text-amber-800/40">
          © 2026 Bộ Thủ Thư Pháp Tập Kỳ. Sách học vỡ lòng Thư pháp Chữ Hán phồn thể.
        </p>
      </footer>
    </div>
  );
}
