import { useState, useMemo } from "react";
import { Search, Filter, BookOpen, Layers, Star, Plus, Check, Volume2 } from "lucide-react";
import { Radical, LeitnerProgress } from "../types";
import { categories } from "../data/radicals";
import { speakChinese, playRadicalAudio } from "../utils/audio";

interface RadicalDirectoryProps {
  radicalsList: Radical[];
  leitnerProgress: LeitnerProgress[];
  onAddToLeitner: (radicalId: number) => void;
  selectedRadical: Radical | null;
  setSelectedRadical: (radical: Radical | null) => void;
  charMode: "traditional" | "simplified" | "both";
  setCharMode: (mode: "traditional" | "simplified" | "both") => void;
}

export default function RadicalDirectory({
  radicalsList,
  leitnerProgress,
  onAddToLeitner,
  selectedRadical,
  setSelectedRadical,
  charMode,
  setCharMode,
}: RadicalDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [selectedFrequency, setSelectedFrequency] = useState<string>("Tất cả");
  const [selectedStrokes, setSelectedStrokes] = useState<number | "Tất cả">("Tất cả");
  const [sortBy, setSortBy] = useState<"id" | "strokes" | "frequency">("id");

  // Determine if a radical is already in the study queue
  const isStudying = (id: number) => {
    return leitnerProgress.some((p) => p.radicalId === id);
  };

  const getLeitnerBox = (id: number) => {
    const progress = leitnerProgress.find((p) => p.radicalId === id);
    return progress ? progress.box : null;
  };

  // Filtered and sorted radicals
  const filteredRadicals = useMemo(() => {
    let list = [...radicalsList];

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.character.includes(q) ||
          (r.simplifiedCharacter && r.simplifiedCharacter.includes(q)) ||
          r.variant?.includes(q) ||
          (r.simplifiedVariant && r.simplifiedVariant.includes(q)) ||
          r.pinyin.toLowerCase().includes(q) ||
          r.hanViet.toLowerCase().includes(q) ||
          r.meaning.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "Tất cả") {
      list = list.filter((r) => r.category === selectedCategory);
    }

    // Frequency filter
    if (selectedFrequency !== "Tất cả") {
      const freqMap: Record<string, string> = {
        "Phổ biến": "high",
        "Trung bình": "medium",
        "Hiếm gặp": "low",
      };
      list = list.filter((r) => r.frequency === freqMap[selectedFrequency]);
    }

    // Strokes filter
    if (selectedStrokes !== "Tất cả") {
      list = list.filter((r) => r.strokes === selectedStrokes);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "strokes") {
        return a.strokes - b.strokes || a.id - b.id;
      }
      if (sortBy === "frequency") {
        const freqWeight = { high: 3, medium: 2, low: 1 };
        return freqWeight[b.frequency] - freqWeight[a.frequency] || a.id - b.id;
      }
      return a.id - b.id; // default by natural ID sequence
    });

    return list;
  }, [radicalsList, searchQuery, selectedCategory, selectedFrequency, selectedStrokes, sortBy]);

  // Stroke counts available
  const strokeOptions = useMemo(() => {
    return Array.from(new Set(radicalsList.map((r) => r.strokes))).sort((a, b) => a - b);
  }, [radicalsList]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="radical-directory">
      {/* Directory & Filters */}
      <div className="xl:col-span-8 flex flex-col space-y-4">
        {/* Search & Standard Filter Settings */}
        <div className="bg-white border border-amber-900/10 rounded-2xl p-4 shadow-sm space-y-3.5">
          {/* Character Mode Segmented Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-900/10 pb-3 gap-2.5">
            <div>
              <span className="text-xs font-bold text-amber-955 flex items-center gap-1.5 leading-none">
                <BookOpen className="w-4 h-4 text-red-750" />
                Chế độ học tập chữ Hán:
              </span>
              <p className="text-[10px] text-amber-900/60 mt-1">Lọc & Hiển thị chữ cốt lõi theo Giản thể / Phồn thể</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-1 border border-amber-900/10 flex gap-1 self-start sm:self-center">
              <button
                onClick={() => setCharMode("both")}
                className={`text-[10px] sm:text-xs px-2.5 py-1.5 rounded-lg transition-all font-sans font-bold cursor-pointer ${
                  charMode === "both"
                    ? "bg-amber-950 text-amber-50 shadow-sm"
                    : "text-amber-900/70 hover:bg-amber-100/50"
                }`}
              >
                Song Thể (Phồn/Giản)
              </button>
              <button
                onClick={() => setCharMode("simplified")}
                className={`text-[10px] sm:text-xs px-2.5 py-1.5 rounded-lg transition-all font-sans font-bold cursor-pointer ${
                  charMode === "simplified"
                    ? "bg-amber-950 text-amber-50 shadow-sm"
                    : "text-amber-900/70 hover:bg-amber-100/50"
                }`}
              >
                Giản Thể (Simplified)
              </button>
              <button
                onClick={() => setCharMode("traditional")}
                className={`text-[10px] sm:text-xs px-2.5 py-1.5 rounded-lg transition-all font-sans font-bold cursor-pointer ${
                  charMode === "traditional"
                    ? "bg-amber-950 text-amber-50 shadow-sm"
                    : "text-amber-900/70 hover:bg-amber-100/50"
                }`}
              >
                Phồn Thể (Traditional)
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-800/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bộ thủ... (ví dụ: 木, mù, mộc, cây, ...)"
                className="w-full pl-10 pr-4 py-2.5 bg-amber-50/30 border border-amber-900/10 rounded-xl font-sans text-sm outline-none focus:border-red-700/50 focus:ring-1 focus:ring-red-700/30 transition-all text-amber-950"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-900 whitespace-nowrap">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-amber-900/10 rounded-xl px-3 py-2 text-xs font-sans font-medium text-amber-950 outline-none focus:border-red-700/50 cursor-pointer"
              >
                <option value="id">Theo Số thứ tự (1-214)</option>
                <option value="strokes">Số lượng nét viết</option>
                <option value="frequency">Độ phổ biến học tập</option>
              </select>
            </div>
          </div>

          {/* Quick Category Filtering Pills */}
          <div className="border-t border-amber-900/5 pt-3">
            <span className="text-xs font-semibold text-amber-900 block mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-red-700" />
              Mục đích ý nghĩa liên quan:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["Tất cả", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all border cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-red-700 text-white border-red-700 font-medium"
                      : "bg-amber-50/40 text-amber-900 hover:bg-amber-100/50 border-amber-900/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filters: Strokes and Freq */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Strokes count */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-900 whitespace-nowrap">Số nét vẽ:</span>
              <select
                value={selectedStrokes}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedStrokes(val === "Tất cả" ? "Tất cả" : parseInt(val, 10));
                }}
                className="w-full bg-amber-50/10 border border-amber-900/10 rounded-xl px-3 py-2 text-xs font-sans text-amber-950 outline-none focus:border-red-700/50 cursor-pointer"
              >
                <option value="Tất cả">Mọi độ nét (1 - 17)</option>
                {strokeOptions.map((st) => (
                  <option key={st} value={st}>
                    {st} nét viết
                  </option>
                ))}
              </select>
            </div>

            {/* Popularity/Frequency */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-900 whitespace-nowrap">Xuất hiện:</span>
              <select
                value={selectedFrequency}
                onChange={(e) => setSelectedFrequency(e.target.value)}
                className="w-full bg-amber-50/10 border border-amber-900/10 rounded-xl px-3 py-2 text-xs font-sans text-amber-950 outline-none focus:border-red-700/50 cursor-pointer"
              >
                <option value="Tất cả">Tất cả tần suất</option>
                <option value="Phổ biến">Phổ biến thường gặp (High)</option>
                <option value="Trung bình">Trung bình (Medium)</option>
                <option value="Hiếm gặp">Hiếm gặp / Phức tạp (Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="bg-amber-100/20 border border-amber-900/10 rounded-2xl p-4 shadow-inner min-h-[400px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold text-amber-900/60">
                Tìm thấy <span className="font-mono font-bold text-red-800">{filteredRadicals.length}</span> bộ thủ thỏa mãn
              </span>
              <span className="text-xs text-amber-900/40 italic">Nhấp vào một ô bộ thủ để xem chi tiết mổ xẻ nghĩa</span>
            </div>

            {filteredRadicals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <BookOpen className="w-12 h-12 text-amber-800/20 mb-2" />
                <p className="text-sm text-amber-900/50 font-medium">Không tìm thấy bộ thủ nào phù hợp</p>
                <p className="text-xs text-amber-900/40">Thử làm sạch bộ lọc hoặc thay đổi cụm từ tìm kiếm</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredRadicals.map((rad) => {
                  const studying = isStudying(rad.id);
                  const box = getLeitnerBox(rad.id);
                  const isFocused = selectedRadical?.id === rad.id;

                  return (
                    <div
                      key={rad.id}
                      onClick={() => setSelectedRadical(rad)}
                      className={`relative border p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all select-none hover:translate-y-[-2px] ${
                        isFocused
                          ? "bg-amber-100 border-red-700 shadow-md ring-1 ring-red-700/30"
                          : "bg-white hover:bg-amber-50/50 border-amber-900/10 hover:shadow-sm"
                      }`}
                    >
                      {/* Badge indicatives */}
                      {studying && (
                        <span
                          className={`absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shadow-sm ${
                            box === 4
                              ? "bg-emerald-500 text-white"
                              : box === 3
                              ? "bg-indigo-500 text-white"
                              : box === 2
                              ? "bg-amber-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                          title={`Bộ thủ đang học ở hộp Leitner ${box}`}
                        >
                          {box}
                        </span>
                      )}

                      {/* Stroke count hint */}
                      <span className="absolute bottom-1 right-1 text-[8px] font-mono text-amber-900/40">
                        {charMode === "simplified" && rad.simplifiedStrokes ? rad.simplifiedStrokes : rad.strokes} nét
                      </span>

                      {/* Traditional / Simplified Symbol Display */}
                      <span className="font-serif text-3xl font-bold text-amber-950 mb-1 flex items-baseline gap-1 justify-center leading-none">
                        {charMode === "traditional" && rad.character}
                        {charMode === "simplified" && (rad.simplifiedCharacter || rad.character)}
                        {charMode === "both" && (
                          rad.character === rad.simplifiedCharacter ? (
                            rad.character
                          ) : (
                            <span className="flex items-center gap-0.5">
                              <span className="text-amber-955 text-2xl font-black">{rad.character}</span>
                              <span className="text-[10px] text-amber-900/30 px-0.5 font-normal">→</span>
                              <span className="text-2xl font-black text-red-750">{rad.simplifiedCharacter}</span>
                            </span>
                          )
                        )}
                      </span>

                      {/* Sino-Vietnamese names */}
                      <span className="text-[10px] font-bold text-amber-900 uppercase tracking-tight text-center truncate w-full">
                        {rad.hanViet}
                      </span>

                      {/* Vietnamese meanings */}
                      <span className="text-[10px] text-amber-800/80 text-center truncate w-full">
                        {rad.meaning}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Radical details side cards */}
      <div className="xl:col-span-4">
        {selectedRadical ? (
          <div className="bg-white border-2 border-amber-950/20 rounded-2xl p-5 shadow-sm space-y-4 sticky top-6">
            <div className="border-b border-amber-900/10 pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] bg-red-50 text-red-800 px-2.5 py-0.5 rounded-full font-sans font-semibold border border-red-200">
                    Thứ tự bộ: #{selectedRadical.id}
                  </span>
                  <div className="flex items-center gap-3 mt-2">
                    <h3 className="font-serif text-4xl font-black text-amber-950 flex items-baseline gap-1.5 leading-none">
                      {charMode === "traditional" && selectedRadical.character}
                      {charMode === "simplified" && (selectedRadical.simplifiedCharacter || selectedRadical.character)}
                      {charMode === "both" && (
                        selectedRadical.character === selectedRadical.simplifiedCharacter ? (
                          selectedRadical.character
                        ) : (
                          <span className="flex items-center gap-2">
                            <span>{selectedRadical.character}</span>
                            <span className="text-xl text-amber-900/40 font-serif font-normal">({selectedRadical.simplifiedCharacter})</span>
                          </span>
                        )
                      )}
                      
                      {/* Variant Forms */}
                      {(selectedRadical.variant || selectedRadical.simplifiedVariant) && (
                        <span className="text-xs font-normal text-amber-900/60 font-serif whitespace-nowrap">
                          ({charMode === "traditional" ? `biến thể: ${selectedRadical.variant}` : 
                            charMode === "simplified" ? `biến thể: ${selectedRadical.simplifiedVariant || selectedRadical.variant}` :
                            `biến thể: ${selectedRadical.variant || ""}${selectedRadical.simplifiedVariant && selectedRadical.simplifiedVariant !== selectedRadical.variant ? ` / ${selectedRadical.simplifiedVariant}` : ""}`})
                        </span>
                      )}
                    </h3>
                    <button
                      onClick={() =>
                        playRadicalAudio(
                          charMode === "simplified" ? (selectedRadical.simplifiedCharacter || selectedRadical.character) : selectedRadical.character,
                          selectedRadical.pinyin,
                          selectedRadical.hanViet,
                          selectedRadical.meaning
                        )
                      }
                      title="Phát âm thanh Trung - Việt"
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-750 border border-red-200/50 rounded-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center shadow-sm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="font-serif text-sm font-semibold text-amber-900">
                      Bộ: {selectedRadical.hanViet}
                    </span>
                    <span className="text-xs text-amber-700 font-mono">/{selectedRadical.pinyin}/</span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="text-xs font-mono font-medium text-amber-900 bg-amber-50 px-2 py-1 rounded-lg border border-amber-900/10">
                    {charMode === "simplified" && selectedRadical.simplifiedStrokes ? selectedRadical.simplifiedStrokes : selectedRadical.strokes} nét viết
                  </span>
                  <span
                    className={`mt-1.5 text-[9px] px-2 py-0.5 rounded-full font-sans uppercase font-bold tracking-wider ${
                      selectedRadical.frequency === "high"
                        ? "bg-red-100 text-red-800"
                        : selectedRadical.frequency === "medium"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedRadical.frequency === "high"
                      ? "Phổ biến"
                      : selectedRadical.frequency === "medium"
                      ? "Trung bình"
                      : "Hiếm gặp"}
                  </span>
                </div>
              </div>
            </div>

            {/* Core definitions */}
            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-900/60 block mb-1">
                  Ý nghĩa chính:
                </span>
                <p className="text-sm font-sans font-semibold text-amber-950 capitalize">
                  {selectedRadical.meaning}
                </p>
                <span className="text-[10px] text-amber-700/80 bg-amber-50/50 border border-amber-900/5 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                  Nhóm gốc: {selectedRadical.category}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-amber-900/60 block mb-1">
                  Bản nghĩa học & Thú vị tự viện:
                </span>
                <p className="text-xs text-amber-900/80 leading-relaxed font-sans bg-amber-50/30 p-3 rounded-xl border border-amber-950/5 italic">
                  {selectedRadical.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-amber-900/60 block mb-1.5">
                  Từ ghép điển hình chứa bộ này:
                </span>
                <div className="space-y-2">
                  {selectedRadical.commonWords.map((cw, i) => (
                    <div
                      key={i}
                      className="bg-amber-50/50 border border-amber-900/10 rounded-xl p-2.5 flex items-center gap-3"
                    >
                      <div className="flex flex-col items-center gap-1 border-r border-amber-900/10 pr-2.5 min-w-[50px]">
                        <span className="font-serif text-2xl font-bold text-amber-950 leading-none">
                          {charMode === "traditional" && cw.word}
                          {charMode === "simplified" && (cw.simplifiedWord || cw.word)}
                          {charMode === "both" && (
                            cw.word === cw.simplifiedWord ? (
                              cw.word
                            ) : (
                              <span className="flex flex-col items-center gap-0.5 justify-center">
                                <span className="text-amber-950 font-bold">{cw.word}</span>
                                <span className="text-[10px] text-red-700 font-bold leading-none mt-0.5">({cw.simplifiedWord})</span>
                              </span>
                            )
                          )}
                        </span>
                        <button
                          onClick={() => speakChinese(charMode === "simplified" ? (cw.simplifiedWord || cw.word) : cw.word)}
                          title="Đọc từ mẫu"
                          className="p-0.5 hover:bg-amber-100 text-red-750/70 hover:text-red-750 rounded transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-amber-900 block">{cw.hanViet}</span>
                          <span className="text-[10px] text-amber-700 font-mono">/{cw.pinyin}/</span>
                        </div>
                        <p className="text-[10px] text-amber-900/70">{cw.meaning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-amber-900/10">
              <button
                onClick={() => onAddToLeitner(selectedRadical.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isStudying(selectedRadical.id)
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                    : "bg-red-700 hover:bg-red-800 text-white shadow-md shadow-red-700/10 active:scale-95"
                }`}
              >
                {isStudying(selectedRadical.id) ? (
                  <>
                    <Check className="w-4 h-4" />
                    Đang học (Hộp {getLeitnerBox(selectedRadical.id)})
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Thêm vào Hộp Leitner ôn tập
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-amber-900/10 rounded-2xl p-8 py-16 text-center text-amber-800/50 flex flex-col items-center justify-center h-full min-h-[300px]">
            <Star className="w-10 h-10 text-amber-400/30 mb-2 animate-pulse" />
            <p className="text-sm font-sans font-medium">Bản đồ chi tiết Bộ thủ</p>
            <p className="text-xs">
              Hãy chọn một bộ thủ trong thư viện danh bạ bên sườn trái để khởi tạo hành trình giải mã ý nghĩa chi tiết.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
