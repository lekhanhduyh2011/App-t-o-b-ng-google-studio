import React, { useState } from "react";
import { 
  PenTool, 
  HelpCircle, 
  BookOpen, 
  Compass, 
  ChevronRight, 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Info,
  Calendar,
  Layers,
  GraduationCap
} from "lucide-react";
import { speakVietnamese, speakChinese } from "../utils/audio";

// Static data for 8 basic stroke types
const basicStrokes = [
  {
    symbol: "丶",
    name: "Nét Chấm",
    hanViet: "Điểm (点)",
    direction: "Đặt bút xuống rồi nhấc nhẹ lên tạo hình giọt nước sa sầm xuống.",
    importance: "Nền tảng của các bộ thủ chỉ định vị hoặc chi tiết nhỏ.",
    variation: "Chấm dài, chấm ngửa, chấm trái, chấm phải."
  },
  {
    symbol: "一",
    name: "Nét Ngang",
    hanViet: "Hoành (横)",
    direction: "Viết từ trái sang phải, kéo thẳng ngang, hơi nghiêng lên một chút ở cuối nét.",
    importance: "Xuất hiện trong hơn 90% chữ Hán, biểu trưng cho mặt đất hoặc sinh khí.",
    variation: "Ngang dài (Trường hoành), ngang ngắn (Đoản hoành)."
  },
  {
    symbol: "丨",
    name: "Nét Sổ",
    hanViet: "Thụ (竖)",
    direction: "Kéo thẳng một đường vững chãi xuyên suốt từ trên xuống dưới.",
    importance: "Biểu trưng cho cột trụ, dòng nước chảy thẳng đứng.",
    variation: "Sổ kim (Kim thấu đáy), Sổ giọt sương (Lộ thủy thụ)."
  },
  {
    symbol: "丿",
    name: "Nét Phẩy",
    hanViet: "Phẩy (撇)",
    direction: "Đưa từ trên cao bên phải rồi vuốt lướt dài cong xuống phía trái.",
    importance: "Biểu hiện cho sự mềm mại, cỏ cây xòe lá rủ tơ.",
    variation: "Phẩy đứng (Thụ phẩy), phẩy nằm (Bình phẩy), phẩy dài."
  },
  {
    symbol: "乀",
    name: "Nét Mác",
    hanViet: "Mác (捺)",
    direction: "Viết từ trên trái kéo xéo xệ xuống dưới bên phải, cuối nét nhấn mạnh rồi nhấc ruy.",
    importance: "Giúp chống giữ thăng bằng cân xứng cho cả tự hình.",
    variation: "Mác thẳng, mác bằng (Bình nại - bước đi), mác ngắn."
  },
  {
    symbol: "提",
    symbolChar: "㇀",
    name: "Nét Hất",
    hanViet: "Đề (提)",
    direction: "Đặt bút rồi hất mạnh nhọn xéo thốc từ dưới thấp bên trái lên góc trên bên phải.",
    importance: "Thường dùng làm tay bế đỡ, dùng nhiều ở các biến thể bộ thủ bên trái (như Táp chữ, Thổ chữ).",
    variation: "Hất dài, hất ngắn dứt khoát."
  },
  {
    symbol: "乛",
    name: "Nét Gập",
    hanViet: "Chiết (折)",
    direction: "Đang viết một nét ngang hoặc sổ thì dừng gập khúc bẻ ngoặt hướng góc vuông.",
    importance: "Cấu tạo khung xương thành vách xung quanh.",
    variation: "Ngang gập (Hoành chiết), Sổ gập (Thụ chiết), Gập hai lần (Song chiết)."
  },
  {
    symbol: "亅",
    name: "Nét Móc",
    hanViet: "Quyết (钩)",
    direction: "Ở cuối nét sổ, nét ngang, hoặc nét phẩy, đột ngột móc xoay góc nhọn tót ngược lên.",
    importance: "Tạo độ dứt điểm sắc nhọn sắc bén cho chữ.",
    variation: "Sổ móc (Thụ quyết), Ngang móc (Hoành quyết), Nghiêng móc (Tà quyết)."
  }
];

// Stroke order rules
const strokeRules = [
  {
    rule: "1. Trên trước, Dưới sau",
    desc: "Các nét nằm ở phía tầng cao hơn luôn được ưu tiên vẽ trước các nét nền chân phía dưới.",
    example: "Chữ TAM (三)",
    step: "Vẽ nét ngang trên cùng -> Ngang giữa -> Ngang đáy dài nhất.",
    character: "三"
  },
  {
    rule: "2. Trái trước, Phải sau",
    desc: "Các tổ hợp nằm biên trái được ưu tiên triển khai toàn vẹn trước khi rẽ bút sang mạn sườn phải.",
    example: "Chữ XUYÊN (川)",
    step: "Vẽ sổ cong trái -> Sổ thẳng ngắn giữa -> Sổ dài nhất mạn phải.",
    character: "川"
  },
  {
    rule: "3. Ngang trước, Sổ sau",
    desc: "Khi nét ngang và nét sổ giao nhau cắt kéo vuông góc, nét hoành nằm ngang luôn đi trước.",
    example: "Chữ THẬP (十)",
    step: "Kéo ngang từ trái qua phải -> Sau đó bổ thẳng một nét sổ từ trên thẳng đứng xuống dưới xuyên qua trung tâm.",
    character: "十"
  },
  {
    rule: "4. Phẩy trước, Mác sau",
    desc: "Hai nét hướng xéo che tai nhau thì nét vuốt nghiêng trái (phẩy) đặt trước nét kéo nghiêng phải (mác).",
    example: "Chữ NHÂN (人)",
    step: "Vẽ nét phẩy lướt cong trái -> Sau đó bắt nét mác xéo nghiêng cân đối từ thắt lưng của nét phẩy hạ xuống chân phải.",
    character: "人"
  },
  {
    rule: "5. Giữa trước, Hai bên sau",
    desc: "Đối với các từ cân bằng bento đối xứng hai biên bên hông, trụ chính giữa được cố định vững chãi trước.",
    example: "Chữ TIỂU (小)",
    step: "Sổ móc ở chính tâm giữa -> Viết chấm trái -> Viết chấm phải đối xứng.",
    character: "小"
  },
  {
    rule: "6. Ngoài trước, Trong sau",
    desc: "Vẽ bao vây vòng khung bán nguyệt bên ngoài trước, kiến thiết sắp đặt nội hạt ruột rà bên trong sau.",
    example: "Chữ PHONG (风/風)",
    step: "Vẽ vây quây ngoài (ngang gập mọc) trước -> Rồi mới đặt nét phẩy và chấm lồng trong.",
    character: "风"
  },
  {
    rule: "7. Vào trước, Đóng sau",
    desc: "Chữ bao vây toàn phần khép kín. Bạn dọn đường bao khung, cho người bên trong vào rồi mới đóng chặt sập sập cổng thành đáy.",
    example: "Chữ QUỐC (国/國)",
    step: "Bút vẽ sổ đứng bên trái -> khung ngang gập móc -> Đặt bộ Ngọc 玉 bên trong (ở chữ giản thể Quốc 国) hoặc bộ Hoặc 或 bên trong (ở chữ phồn thể Quốc 國) -> Rồi đóng đáy bằng nét ngang khóa thành lũy.",
    character: "国"
  }
];

export default function BeginnerGuide() {
  const [activeStep, setActiveStep] = useState(0);

  const playDemoWord = (char: string, info: string) => {
    speakChinese(char);
    setTimeout(() => {
      speakVietnamese(info);
    }, 1200);
  };

  return (
    <div className="space-y-8" id="beginner-handbook-panel">
      {/* Introduction banner */}
      <div className="bg-white border border-amber-900/10 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 text-red-700/10 font-serif text-5xl font-extrabold rotate-12 select-none">
          入門
        </div>
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="p-2 bg-red-50 text-red-800 rounded-xl border border-red-200/50">
            <GraduationCap className="w-5 h-5 text-red-750" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-lg text-amber-950">Hành Trang Học Bộ Thủ Thần Tốc</h3>
            <p className="text-xs text-amber-800/70">Cẩm nang vỡ lòng về các nét bút bản nguyên và quy tắc kiến tập tối ưu dành cho người mới rèn chữ Hán.</p>
          </div>
        </div>
        
        <p className="text-xs text-amber-900/85 leading-relaxed font-sans text-justify bg-amber-50/20 p-3.5 rounded-xl border border-amber-955/5 italic">
          <strong>Bộ thủ (部首)</strong> là tập hợp phân mảnh cấu trúc định hình tư duy của mọi chữ Hán phồn thể và giản thể. Thay vì nhớ máy móc hàng ngàn ký tự phức tạp, người học thông thái chỉ cần nằm lòng <strong>214 Bộ thủ</strong> để đọc vị bất kỳ chữ Hán nào (áp dụng nhất quán cho cả dạng phồn thể và giản thể). Để vẽ đúng bộ thủ, ta phải bắt đầu từ các nét đơn sơ nhất.
        </p>
      </div>

      {/* Grid: 8 Basic Strokes with Interactive visuals */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 border-b border-amber-900/10 pb-2">
          <PenTool className="w-4 h-4 text-red-750" />
          <h4 className="font-serif text-base font-bold text-amber-950">Vĩnh Tự Bát Pháp: 8 Nét Cơ Bản & Phái Sinh</h4>
        </div>
        <p className="text-xs text-amber-900/70">
          Chữ VĨNH (永) chứa trọn vẹn toàn bộ 8 nét bút thiêng của thư pháp Trung Hoa. Click vào biểu tượng của nét để lắng nghe hướng dẫn phát âm hoặc thị phạm.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {basicStrokes.map((stroke, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-amber-900/15 rounded-2xl p-4 hover:border-red-750/30 transition-all hover:translate-y-[-2px] flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3.5">
                {/* Big character presentation circle */}
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-amber-50/60 border border-amber-900/10 rounded-xl flex items-center justify-center relative">
                    <span className="font-serif text-3xl font-bold text-red-800 drop-shadow-sm">
                      {stroke.symbolChar || stroke.symbol}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-sans font-bold text-amber-950 text-xs block">{stroke.name}</span>
                    <span className="text-[10px] text-amber-900/50 uppercase font-bold tracking-tight block mt-0.5">{stroke.hanViet}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <span className="text-[9px] uppercase font-bold text-amber-900/40 tracking-wider block">Cách di bút:</span>
                  <p className="text-[11px] leading-relaxed text-amber-900/80 font-sans">{stroke.direction}</p>
                </div>
              </div>

              <div className="border-t border-amber-900/5 pt-2.5 mt-3 space-y-1 text-left">
                <p className="text-[10px] text-amber-900/60 font-sans">
                  <strong className="text-amber-950">Tầm quan trọng:</strong> {stroke.importance}
                </p>
                <p className="text-[10px] text-red-800/80 font-sans italic bg-red-50/30 px-1.5 py-0.5 rounded border border-red-900/5 block mt-1">
                  💡 <strong className="text-red-900">Biến thể phái sinh:</strong> {stroke.variation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Basic Stroke order rules with samples */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Rules column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-amber-900/10 pb-2">
            <Compass className="w-4 h-4 text-red-750" />
            <h4 className="font-serif text-base font-bold text-amber-950">7 Quy Tắc Thuận Nét (Bút Thuận)</h4>
          </div>
          <p className="text-xs text-amber-900/70">
            Để viết chữ Hán thanh tao và cân đối, người tập cần tuân tủ tuyệt đối trật tự hạ bút từ ngàn xưa. Nhấp vào mỗi quy luật bên dưới để thị phạm âm thanh.
          </p>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {strokeRules.map((rule, idx) => (
              <div 
                key={idx}
                onClick={() => playDemoWord(rule.character, `Ví dụ chữ ${rule.example.split(" ")[1]}. Quy tắc ${rule.rule}.`)}
                className={`p-3.5 rounded-xl border transition-all text-left cursor-pointer flex justify-between items-center ${
                  activeStep === idx 
                    ? "bg-amber-50 border-red-700/40 shadow-sm" 
                    : "bg-white border-amber-900/10 hover:bg-amber-50/30"
                }`}
              >
                <div className="space-y-1 pr-4">
                  <h5 className="font-sans font-bold text-xs text-amber-950 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-750"></span>
                    {rule.rule}
                  </h5>
                  <p className="text-[11px] leading-relaxed text-amber-900/80 font-sans">{rule.desc}</p>
                  <p className="text-[10px] text-amber-900/50 font-sans">
                    💡 <span className="font-semibold">{rule.example}</span>: {rule.step}
                  </p>
                </div>

                <div className="text-center flex-shrink-0 flex flex-col items-center justify-center p-2.5 bg-amber-50/40 border border-amber-900/10 rounded-xl min-w-[70px] hover:border-red-750 transition-colors">
                  <span className="font-serif text-3xl font-extrabold text-amber-950 mb-0.5">{rule.character}</span>
                  <span className="text-[9px] text-red-800 font-mono font-bold uppercase tracking-wide">Nghe âm</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Pillars methodology and roadmap advice */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-amber-900/10 pb-2">
            <Sparkles className="w-4 h-4 text-red-750" />
            <h4 className="font-serif text-base font-bold text-amber-950">Lộ Trình Học Hán Tự Cho Người Mới</h4>
          </div>

          <div className="bg-white border border-amber-900/10 rounded-2xl p-5 space-y-5 text-left shadow-sm">
            
            {/* Step 1 */}
            <div className="flex gap-3">
              <span className="w-7 h-7 rounded-lg bg-red-50 border border-red-200/50 text-red-750 flex items-center justify-center text-xs font-bold flex-shrink-0 font-mono">
                01
              </span>
              <div>
                <h5 className="font-sans font-bold text-xs text-amber-950">Nhận diện & Ghi hớ Bộ Thủ tiêu biểu</h5>
                <p className="text-[11px] text-amber-900/75 leading-relaxed font-sans mt-0.5">
                  Không ép bản thân nhớ hết 214 bộ cùng lúc. Hãy ưu tiên lọc các bộ thủ có tần suất xuất hiện cao nhất (High Frequency) như bộ <strong>Nhân (亻)</strong>, bộ <strong>Mộc (木)</strong>, bộ <strong>Thủy (氵)</strong>. Sử dụng tính năng lọc 'Độ phổ biến học tập' trong ứng dụng để bắt đầu câu chuyện.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <span className="w-7 h-7 rounded-lg bg-red-50 border border-red-200/50 text-red-750 flex items-center justify-center text-xs font-bold flex-shrink-0 font-mono">
                02
              </span>
              <div>
                <h5 className="font-sans font-bold text-xs text-amber-950">Liên kết tư duy Mnemonic & Biểu tượng tự viện</h5>
                <p className="text-[11px] text-amber-900/75 leading-relaxed font-sans mt-0.5">
                  Dành thời gian đọc mục <strong>'Bản nghĩa học & Thú vị tự viện'</strong> của từng bộ. Vẽ ra mối liên hệ trong đầu: Ví dụ bộ Sơn 山 (núi) trông ba đỉnh núi trập trùng chắn gió, bộ Phụ 父 (cha) là hình ảnh bàn tay cầm roi giáo huấn răn dạy gia quy.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <span className="w-7 h-7 rounded-lg bg-red-50 border border-red-200/50 text-red-750 flex items-center justify-center text-xs font-bold flex-shrink-0 font-mono">
                03
              </span>
              <div>
                <h5 className="font-sans font-bold text-xs text-amber-950">Luyện viết tay thực tế trên Bảng vẽ tay</h5>
                <p className="text-[11px] text-amber-900/75 leading-relaxed font-sans mt-0.5">
                  Sử dụng bảng quét nhận dạng vẽ tay tự động AI phía trên. Hãy hạ tay miết dọc các nét cơ bản dứt khoát theo đúng quy chuẩn thuận nét để tự cảm nhận độ cân bằng tỷ lệ hình họa.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3">
              <span className="w-7 h-7 rounded-lg bg-red-50 border border-red-200/50 text-red-750 flex items-center justify-center text-xs font-bold flex-shrink-0 font-mono">
                04
              </span>
              <div>
                <h5 className="font-sans font-bold text-xs text-amber-950">Học ngắt nhịp Spaced-Repetition với Leitner</h5>
                <p className="text-[11px] text-amber-900/75 leading-relaxed font-sans mt-0.5">
                  Bấm <strong>'Thêm vào Hộp Leitner'</strong> để lưu bộ thủ vào danh sách cá nhân. Mỗi buổi sáng dùng 5 phút lướt Flashcard rà soát kết quả. Trí tuệ AI của thẻ nhớ sẽ tự thăng trầm hộp nhớ một cách tối giản khoa học.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
