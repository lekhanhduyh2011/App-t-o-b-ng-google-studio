import React, { useState } from "react";
import { HelpCircle, Sparkles, AlertCircle, BookOpen, Search } from "lucide-react";

const classicalExamples = [
  { word: "休", wordSim: "休", name: "HƯU (Nghỉ ngơi)", desc: "Nhân đứng 亻 (người) ghép với Mộc 木 (cây). Con người tựa vào cây che nắng để nghỉ dưỡng sức." },
  { word: "閣", wordSim: "阁", name: "CÁC (Gác lửng)", desc: "Môn 門 (Cửa) lồng bên trong là Các 各 (Mỗi). Gác lửng nơi mỗi dòng người đều vào một cánh cửa chính." },
  { word: "聞", wordSim: "闻", name: "VĂN (Nghe thấy)", desc: "Môn 門 (Cửa cổng) lồng bên trong bộ Nhĩ 耳 (Cái tai). Ghé sát tai thính vào khe cửa để lắng nghe âm vang bên ngoài." },
  { word: "體", wordSim: "体", name: "THỂ (Thân thể)", desc: "Cốt 骨 (Bộ xương) kết hợp bộ Bản 豊 (Phẩm chất lễ hội). Thân cốt vững chãi dâng hiến tế lễ là thân thể khỏe mạnh." },
  { word: "塵", wordSim: "尘", name: "TRẦN (Bụi bặm)", desc: "Lộc 鹿 (Con hươu dã dã) kết hợp đáy Thổ 土 (Đất cát). Đàn hươu chạy tung vó dẫm đạp làm tung đất cát bụi bặm mù mịt." },
  { word: "櫻", wordSim: "樱", name: "ANH (Hoa anh đào)", desc: "Bộ Mộc 木 (Thực vật) ghép với Anh 嬰 (Chuỗi ngọc trai đeo cổ phái nữ). Hoa anh đào hé nở đỏ đẹp như chuỗi ngọc trai." },
  { word: "好", wordSim: "好", name: "HẢO (Tốt đẹp)", desc: "Phụ nữ 女 (Nữ giới) kết hợp Tử 子 (Con trai). Người nam người nữ kết hạnh phúc sinh con đẻ cái chính là điều tuyệt vời, tốt lành nhất." }
];

interface WordExplainerProps {
  charMode: "traditional" | "simplified" | "both";
}

export default function WordExplainer({ charMode }: WordExplainerProps) {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExplain = async (targetWord: string) => {
    const queryWord = targetWord.trim();
    if (!queryWord) {
      setError("Vui lòng nhập ít nhất một chữ Hán phồn thể.");
      return;
    }

    setWord(queryWord);
    setLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const response = await fetch("/api/explain-word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word: queryWord }),
      });

      if (!response.ok) {
        throw new Error("Lỗi kết nối máy chủ phân tích thuật từ.");
      }

      const data = await response.json();
      if (data.result) {
        setExplanation(data.result);
      } else {
        setError("Không nhận được kết quả giải thích phù hợp từ AI.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Kênh mổ xẻ chữ Hán tạm thời bận. Hãy thử lại sau vài giây.");
    } finally {
      setLoading(false);
    }
  };

  // Safe custom Markdown formatter helper function as peer-safe parser for React 19
  const formatMarkdown = (mdText: string): React.ReactNode => {
    const lines = mdText.split("\n");
    return lines.map((line, index) => {
      let trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith("### ")) {
        return (
          <h4 key={index} className="font-serif text-base font-bold text-amber-950 mt-4 mb-2 border-l-2 border-red-700 pl-2">
            {trimmed.replace("### ", "")}
          </h4>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3 key={index} className="font-serif text-lg font-black text-amber-955 mt-5 mb-2 border-b border-amber-900/10 pb-1">
            {trimmed.replace("## ", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("# ")) {
        return (
          <h2 key={index} className="font-serif text-xl font-black text-red-850 mt-6 mb-3 text-center">
            {trimmed.replace("# ", "")}
          </h2>
        );
      }

      // Bullet items
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const itemContent = trimmed.replace(/^[-*]\s+/, "");
        return (
          <li key={index} className="text-xs text-amber-900/90 ml-4 list-disc pl-1 mb-1.5 leading-relaxed font-sans">
            {parseBoldItalic(itemContent)}
          </li>
        );
      }

      // Blockquotes
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote key={index} className="border-l-4 border-amber-400/50 bg-amber-50/40 p-3 italic text-xs rounded-r-xl my-2 text-amber-900/80 font-serif">
            {parseBoldItalic(trimmed.replace("> ", ""))}
          </blockquote>
        );
      }

      // Standard paragraphs
      if (trimmed === "") {
        return <div key={index} className="h-2" />;
      }

      return (
        <p key={index} className="text-xs leading-relaxed text-amber-900/90 font-sans mb-2 text-justify">
          {parseBoldItalic(trimmed)}
        </p>
      );
    });
  };

  // Parse bold **text** -> strong format
  const parseBoldItalic = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-red-800 font-sans text-amber-955">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-white border border-amber-900/10 rounded-2xl p-5 shadow-sm space-y-5" id="word-decomposition-card">
      <div className="border-b border-amber-900/5 pb-3">
        <h3 className="font-sans font-semibold text-lg text-amber-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-red-750" />
          Giải mã chữ Hán - Nhìn Bộ đoán Nghĩa (Phồn / Giản)
        </h3>
        <p className="text-xs text-amber-800/80 mt-0.5">
          Gõ bất kỳ từ vựng hoặc chữ Hán phồn thể hay giản thể nào để AI hỗ trợ mổ xẻ triệt để bộ thủ cấu tạo, rút ra bài học nhận diện ý niệm cốt lõi.
        </p>
      </div>

      {/* Input workspace */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-800/50" />
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Nhập chữ Hán phồn thể hoặc giản thể (ví dụ: 媽媽/妈妈, 聽/听, 體/体) ..."
              className="w-full pl-10 pr-4 py-2.5 bg-amber-50/20 border border-amber-900/10 rounded-xl font-sans text-sm outline-none focus:border-red-700/50 focus:ring-1 focus:ring-red-700/30 transition-all text-amber-950"
            />
          </div>
          <button
            onClick={() => handleExplain(word)}
            disabled={loading}
            className={`py-2.5 px-5 rounded-xl font-sans font-medium text-sm text-white flex items-center gap-1.5 transition-all cursor-pointer ${
              loading
                ? "bg-amber-300 text-amber-700 cursor-not-allowed"
                : "bg-red-700 hover:bg-red-800 active:scale-95 shadow-md shadow-red-700/10"
            }`}
          >
            <Sparkles className="w-4 h-4 text-red-200" />
            Phân tích AI
          </button>
        </div>

        {/* Suggestion tags */}
        <div className="space-y-2">
          <span className="text-[10px] font-semibold text-amber-900/70 block uppercase tracking-wider">
            Chữ Hán mẫu tiêu biểu chứa bộ thủ (Click để mổ xẻ):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {classicalExamples.map((item, idx) => {
              const displayWord = charMode === "traditional" ? item.word :
                                  charMode === "simplified" ? item.wordSim :
                                  (item.word === item.wordSim ? item.word : `${item.word} (${item.wordSim})`);
              return (
                <button
                  key={idx}
                  onClick={() => handleExplain(charMode === "simplified" ? item.wordSim : item.word)}
                  className="text-xs bg-amber-50 hover:bg-amber-100/50 border border-amber-900/15 rounded-xl px-2.5 py-1.5 font-sans flex items-center gap-1 text-amber-950 transition-colors cursor-pointer"
                  title={item.desc}
                >
                  <strong className="font-serif text-lg text-amber-950 font-bold">{displayWord}</strong>
                  <span className="text-[9px] text-amber-800/60 font-medium">({item.name.split(" ")[0]})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Explanation response region */}
      <div className="border-t border-amber-900/5 pt-4">
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3.5">
            <div className="relative">
              <div className="w-10 h-10 border-4 border-red-700/20 border-t-red-700 rounded-full animate-spin"></div>
              <Sparkles className="w-4 h-4 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-serif font-bold text-amber-950 animate-pulse">
                Thầy đồ AI đang nghiên cứu tự tự điển...
              </p>
              <p className="text-[10px] text-amber-850/60">
                Mổ xẻ tượng hình, xâu chuỗi bộ thủ, dệt nên sợi dây nghĩa nguyên bản.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-4 text-xs flex gap-2 items-center">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {explanation && (
          <div className="relative bg-amber-50/30 border border-amber-950/10 rounded-2xl p-5 shadow-inner overflow-hidden max-h-[460px] overflow-y-auto">
            {/* Scroll decorative stamp */}
            <div className="absolute top-4 right-4 pointer-events-none w-10 h-10 border-2 border-red-700/20 text-red-700/20 flex items-center justify-center font-serif text-[10px] uppercase font-bold rotate-12 select-none rounded">
              Thư Hán
            </div>

            <div className="prose max-w-none text-left space-y-1">
              {formatMarkdown(explanation)}
            </div>
          </div>
        )}

        {!loading && !explanation && !error && (
          <div className="border border-dashed border-amber-900/15 rounded-2xl py-12 text-center text-amber-800/50 flex flex-col items-center justify-center p-5 bg-amber-50/5">
            <BookOpen className="w-10 h-10 text-amber-400/30 mb-2" />
            <p className="text-xs font-sans font-medium">Sẵn sàng phân tích tự điển thuật tượng hình</p>
            <p className="text-[10px]">
              Nhập một từ phồn thể bất kỳ phía trên hoặc bấm vào các gợi ý chữ mẫu để xem giảng giải mổ xẻ nghĩa học kì diệu từ Bộ thủ.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
