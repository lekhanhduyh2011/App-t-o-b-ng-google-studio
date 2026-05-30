import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, Play, Award, RotateCcw, HelpCircle, 
  Volume2, Plus, CheckCircle2, ChevronRight, GraduationCap, 
  Star, Heart, User, Eye, Sparkles, AlertCircle, ArrowRight, Check,
  Eraser, RefreshCw, Sliders
} from "lucide-react";
import { Radical, LeitnerProgress } from "../types";
import { playRadicalAudio, speakChinese } from "../utils/audio";

interface StudyLessonsProps {
  radicalsList: Radical[];
  leitnerProgress: LeitnerProgress[];
  onAddToLeitner: (radicalId: number) => void;
  charMode: "traditional" | "simplified" | "both";
}

interface Lesson {
  id: number;
  title: string;
  chineseTitle: string;
  category: string;
  description: string;
  icon: string;
  radicalIds: number[];
}

const lessonsData: Lesson[] = [
  {
    id: 1,
    title: "Danh nhân, Sinh mệnh & Con người",
    chineseTitle: "生命 与 人类",
    category: "Sinh mệnh",
    description: "Khám phá nguồn gốc các bộ thủ nguyên sơ nhất định danh con người, gia đình, tôn tộc, thể hiện các vai trò xã hội và gốc sinh mệnh thâm sâu.",
    icon: "human",
    radicalIds: [9, 38, 39, 88, 33, 44, 11, 21, 54, 126] // Nhân 人/亻, Nữ 女, Tử 子, Phụ 父, Sĩ 士, Thần 臣, Nhập 入, Đới, v.v.
  },
  {
    id: 2,
    title: "Cơ thể, Thể trạng & Giác quan",
    chineseTitle: "人体 与 感官",
    category: "Cơ thể người",
    description: "Nhóm những bộ thủ biểu đạt lục phủ ngũ tạng, bộ phận thân thể người, hành vi của mắt tai mũi miệng và giác quan nhận biết thế giới.",
    icon: "body",
    radicalIds: [30, 109, 128, 64, 157, 61, 135, 211, 130, 40] // Khẩu 口, Mục 目, Nhĩ 耳, Thủ 手/扌, Túc 足, Tâm 心, Thiệt 舌, Xỉ 齿/齒, Nhục 肉, Miên 宀
  },
  {
    id: 3,
    title: "Hành động, Bộ hành & Di chuyển",
    chineseTitle: "行动 与 步履",
    category: "Hành động",
    description: "Các trạng thái di chuyển của đôi chân hoặc các chuyển động hành động hành vi cơ bản như đứng, chạy, đi, bám đuổi.",
    icon: "motion",
    radicalIds: [156, 144, 77, 79, 60, 162, 117, 54, 111, 35] // Tẩu 走, Hành 行, Chỉ 止, Thù 殳, Xích 彳, Sước 辶, Lập 立, Sấn 廴, Chi 支, Tuy 夊
  },
  {
    id: 4,
    title: "Khai thiên Lập địa, Tự nhiên & Đất trời",
    chineseTitle: "自然 与 乾坤",
    category: "Tự nhiên",
    description: "Bộ sưu tập các nguyên tố cấu thành vũ trụ vạn vật theo triết lý Đông phương cổ đại: Nhật, Nguyệt, Sơn, Thủy, Hỏa, Thổ.",
    icon: "cosmos",
    radicalIds: [72, 74, 46, 85, 86, 32, 182, 173, 190, 176] // Nhật 日, Nguyệt 月, Sơn 山, Thủy 水/氵, Hỏa 火/灬, Thổ 土, Phong 风, Vũ 雨, Trĩ 鬯, Thanh 青
  },
  {
    id: 5,
    title: "Đời sống, Gia viên & Gia đình",
    chineseTitle: "家园 与 生活",
    category: "Đời sống",
    description: "Không gian sinh hoạt, cư trú ấm cúng dưới mái nhà cổ xưa, các vật dụng phục vụ ăn uống khâu vá, che nắng che mưa.",
    icon: "home",
    radicalIds: [40, 63, 53, 169, 98, 143, 184, 50, 116, 108] // Miên 宀, Hộ 户/戶, Quảng 广, Môn 门/門, Ngõa 瓦, Mãnh 皿, Thực 食/饣, Cân 巾, Huyệt 穴, Mãnh 皿
  },
  {
    id: 6,
    title: "Thảo mộc, Hoa cỏ & Thực vật",
    chineseTitle: "草木 与 农耕",
    category: "Thực vật",
    description: "Nét thư pháp mô tả thế giới thực vật tươi mát, các loài thảo mộc, tre nứa dẻo dai làm vật dụng, cây cối nông thổ nuôi nấng nông nghiệp quý giá.",
    icon: "flora",
    radicalIds: [75, 140, 118, 115, 119, 97, 65, 81, 139, 121] // Mộc 木, Thảo 艹, Trúc 竹/⺮, Hòa 禾, Mễ 米, Qua 瓜, Chi 支, Tỷ 比, Sắc 色, Phữu 缶
  },
  {
    id: 7,
    title: "Thế giới Động vật, Cầm thú & Tiên hải",
    chineseTitle: "禽兽 与 动物",
    category: "Động vật",
    description: "Muông thú xung quanh con người từ những loài ngựa phi đại ngàn, gia súc trung thành đến thủy tộc dười dòng nước mát.",
    icon: "fauna",
    radicalIds: [196, 195, 187, 154, 142, 94, 123, 93, 124, 205] // Điểu 鸟/鳥, Ngư 鱼/魚, Mã 马/馬, Bối 贝/貝, Trùng 虫, Khuyển 犬/犭, Dương 羊, Ngưu 牛, Vũ 羽, Mãnh 黾/黽
  },
  {
    id: 8,
    title: "Công cụ, Vũ khí & Sức lao động",
    chineseTitle: "工具 与 力量",
    category: "Công cụ",
    description: "Vũ khí phòng vệ bờ cõi bờ luỹ và công cụ tăng gia sản xuất cơ khi của người xưa, bộc lộ ý niệm sức mạnh thể chất kiên cường.",
    icon: "military",
    radicalIds: [18, 57, 110, 62, 48, 19, 69, 50, 29, 22] // Đao 刀/刂, Cung 弓, Mâu 矛, Qua 戈, Công 工, Lực 力, Cân 斤, Cân 巾, Hựu 又, Phương 匚
  },
  {
    id: 9,
    title: "Văn minh, Lễ nghi, Tâm linh & Xã hội",
    chineseTitle: "礼仪 与 智慧",
    category: "Văn minh",
    description: "Chứa đựng trí tuệ cổ nhân cao siêu: ngôn ngữ giao tiếp, nghi lễ cúng bái trời đất linh thiêng, tiền tệ giao thương kết cấu xã hôi tinh nhuệ.",
    icon: "spirit",
    radicalIds: [149, 154, 169, 167, 96, 113, 26, 118, 41, 152] // Ngôn 言/讠, Bối 贝/貝, Môn 门/門, Kim 金/钅, Ngọc 玉, Thị 示/礻, Tiết 卩, Trúc 竹, Thốn 寸, Thỉ 豕
  },
  {
    id: 10,
    title: "Màu sắc, Hình thể & Đo lường Trừu tượng",
    chineseTitle: "色彩 与 抽象",
    category: "Trừu tượng",
    description: "Mãn nhãn với các bộ thủ biểu hiện màu sắc kinh điển, ranh giới đất đai bao vây khép kín hay sợi tơ mỏng tượng trưng cho sự gắn kết trừu tượng lâu bền.",
    icon: "abstract",
    radicalIds: [203, 106, 174, 155, 201, 52, 120, 31, 104, 132] // Hắc 黑, Bạch 白, Thanh 青, Xích 赤, Hoàng 黄, Yêu 幺, Mịch 糸/纟, Vi 囗, Nạch 疒, Tự 自
  }
];

export default function StudyLessons({
  radicalsList,
  leitnerProgress,
  onAddToLeitner,
  charMode
}: StudyLessonsProps) {
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [activeSubView, setActiveSubView] = useState<"directory" | "flashcard" | "quiz">("directory");
  
  // Lesson radicals state
  const [lessonRadicals, setLessonRadicals] = useState<Radical[]>([]);
  const [currentRadDetail, setCurrentRadDetail] = useState<Radical | null>(null);

  // Flashcards state
  const [fcIndex, setFcIndex] = useState(0);
  const [fcFlipped, setFcFlipped] = useState(false);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizCurrentIdx, setQuizCurrentIdx] = useState(0);
  const [quizSelectedOpt, setQuizSelectedOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Calligraphy Practice State Hooks
  const [detailTab, setDetailTab] = useState<"info" | "practice">("info");
  const [practiceTarget, setPracticeTarget] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [inkColor, setInkColor] = useState("#1c1917");
  const [brushWidth, setBrushWidth] = useState(6);
  const [showGuideTrace, setShowGuideTrace] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeLesson = lessonsData.find(l => l.id === selectedLessonId) || lessonsData[0];

  // Draw handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (e.cancelable) {
      e.preventDefault();
    }

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = brushWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (e.cancelable) {
      e.preventDefault();
    }

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Target extraction strategy
  const getPracticeOptions = (): string[] => {
    if (!currentRadDetail) return [];
    const opts: string[] = [];
    
    const getRadChar = () => {
      return charMode === "simplified" ? (currentRadDetail.simplifiedCharacter || currentRadDetail.character) : currentRadDetail.character;
    };
    opts.push(getRadChar());
    
    if (currentRadDetail.character && !opts.includes(currentRadDetail.character)) {
      opts.push(currentRadDetail.character);
    }
    if (currentRadDetail.simplifiedCharacter && !opts.includes(currentRadDetail.simplifiedCharacter)) {
      opts.push(currentRadDetail.simplifiedCharacter);
    }
    
    currentRadDetail.commonWords.forEach(cw => {
      const words = [cw.word, cw.simplifiedWord].filter(Boolean);
      words.forEach(w => {
        w.split("").forEach(char => {
          if (/[\u4e00-\u9fa5]/.test(char) && !opts.includes(char)) {
            opts.push(char);
          }
        });
      });
    });
    
    return opts;
  };

  // Auto update target on radical selection
  useEffect(() => {
    if (currentRadDetail) {
      const targetChar = charMode === "simplified" ? (currentRadDetail.simplifiedCharacter || currentRadDetail.character) : currentRadDetail.character;
      setPracticeTarget(targetChar);
      setDetailTab("info"); // Switch to info tab on new selection representation
      clearCanvas();
    }
  }, [currentRadDetail, charMode]);

  // Adjust canvas resolution dynamically based on container DOM bounds
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 280;
    canvas.height = rect.height || 280;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, [detailTab, activeSubView, currentRadDetail, practiceTarget]);

  // Specific Stroke sequences tips
  const getStrokeGuideText = (char: string) => {
    switch(char) {
      case "人": return "1. Nét phẩy (撇): từ trên vuốt nghiêng cong nhẹ xuống bên trái. \n2. Nét mác (捺): phát lực từ đỉnh ngã nhẹ kéo nghiêng thăng hoa sang phải.";
      case "女": return "1. Nét Phẩy gập (𡿨) xiên nhẹ góc trái rồi gấp dẹt ngang phải. \n2. Nét Phẩy nghiêng (撇) lướt chéo qua eo phẩy gập. \n3. Nét Ngang dài sải rộng đè ngang lưng giữ thăng bằng.";
      case "子": return "1. Nét Ngang phẩy dẹt mỏng sang phải gập xiên. \n2. Nét Sổ cong móc sải đứng, thắt hông nhẹ rồi móc nhọn trái. \n3. Nét Ngang ngắn khóa thắt giữa.";
      case "父": return "1. Nét Phẩy trái ngắn. \n2. Nét Chấm xiên nhẹ phải cân xứng. \n3. Nét Phẩy dài chéo xuyên hông xuống trái. \n4. Nét Mác nghiêng sải rộng kéo cân xứng điểm dừng phải.";
      case "士": return "1. Nét Ngang đầu tiên dài thon. \n2. Nét Sổ thẳng đứng thẳng gốc chẻ dọc ngang dọc tâm. \n3. Nét Ngang dưới ngắn khép dẹt.";
      case "口": return "1. Nét Sổ lề đứng trái. \n2. Nét Ngang gập móc khỏe khoắn góc sườn. \n3. Nét Ngang dứt điểm khép chặn sập sập cổng thành đáy.";
      case "目": return "1. Nét Sổ dựng trái dốc đứng. \n2. Nét Ngang gập sườn thon dẹt. \n3. Hai nét Ngang chia rầm đều bên trong lòng. \n4. Nét Ngang dứt dạc khép kín khuôn chữ.";
      case "耳": return "1. Nét Ngang ngang trời. \n2. Nét Sổ lửng đứng sườn trái. \n3. Nét Sổ chân dài gánh vĩ bám lề sườn phải. \n4. Hai nét Ngang nội tạng bên trong. \n5. Nét Ngang đáy sải rộng.";
      case "手": return "1. Nét phẩy ngang vuốt mỏng nghiêng trái qua ngọn. \n2. Nét Ngang ngắn thon. \n3. Nét Ngang dài ngang sườn. \n4. Nét Sổ móc dọc tâm rẽ dọc móc nhọn lên bừng sáng tự trọng.";
      case "足": return "1. Đầu vuông Khẩu (口): Sổ trái -> Ngang gập -> Ngang khép đáy. \n2. Thân bám dẹt: Sổ đứng ngắn chính tâm -> Ngang gập ngang -> Nét Mác nghiêng dài sải chân sỏi đá.";
      case "心": return "1. Nét Chấm rớt trái. \n2. Nét Nằm móc uốn vầng trăng khuyết sải đáy rồi móc ngược. \n3. Hai chấm rải đều giữa trời lãng đãng bình sinh.";
      case "日": return "1. Nét Sổ thon lề trái. \n2. Nét Ngang gập sườn. \n3. Nét Ngang phân nửa ranh giới. \n4. Nét Ngang cuối sập cửa chân.";
      case "月": return "1. Nét Phẩy đứng thon bên trái. \n2. Nét Ngang gập móc thon bên phải. \n3. Hai nét Ngang chia bế đôi lữ thứ.";
      case "山": return "1. Sổ đứng thẳng thớm oai vệ nhất giữa tâm đỉnh. \n2. Sổ đứng trái nối dốc gập góc ngang thành đáy. \n3. Sổ đứng phải khép chốt dải lụa cao sườn bảo sơn.";
      case "水": return "1. Sổ dọc móc chính tâm chẻ rãnh. \n2. Phẩy ngắn góc rải xiên chéo bám vào sườn trái bên trên. \n3. Phẩy trái xiên dưới. \n4. Mác kéo nghiêng sải phẳng chân sườn phải.";
      case "火": return "1. Chấm nghiêng trái. \n2. Phẩy ngắn xiên phải. \n3. Nét Phẩy đứng kéo chéo thoai thoải qua sườn. \n4. Nét Mác xòe lụa bừng cháy góc phải.";
      case "土": return "1. Ngang ngắn trên nền. \n2. Sổ thẳng vuông chẻ xuyên gốc. \n3. Ngang chặn giữ vững chãi dài rộng.";
      default: return "Nguyên lý Bút thuận (筆順) phổ quát học tập: \n- Ngang trước, Sổ sau; Trái trước, Phải sau. \n- Viết trên tràn xuống dưới; Ngoài vây trước, Trong nạp rồi mới đóng đáy.";
    }
  };

  // Load radicals for current lesson
  useEffect(() => {
    const list = radicalsList.filter(r => activeLesson.radicalIds.includes(r.id));
    // Sort based on order in radicalIds
    const ordered = [...list].sort((a, b) => {
      return activeLesson.radicalIds.indexOf(a.id) - activeLesson.radicalIds.indexOf(b.id);
    });
    setLessonRadicals(ordered);
    if (ordered.length > 0) {
      setCurrentRadDetail(ordered[0]);
    }
    // Reset secondary views states
    setFcIndex(0);
    setFcFlipped(false);
    setQuizFinished(false);
    setQuizQuestions([]);
  }, [selectedLessonId, radicalsList]);

  // Generate quiz specifically for this lesson's radicals
  const startQuiz = () => {
    if (lessonRadicals.length < 3) return;
    const questions: any[] = [];
    
    // Choose 5 random questions
    const shuffledRads = [...lessonRadicals].sort(() => Math.random() - 0.5);
    const questionsCount = Math.min(5, shuffledRads.length);

    for (let i = 0; i < questionsCount; i++) {
      const rad = shuffledRads[i];
      const type = ["meaning", "character", "pinyin"][Math.floor(Math.random() * 3)];
      const distractors = radicalsList.filter(r => r.id !== rad.id).sort(() => Math.random() - 0.5);

      let questionText = "";
      let correctOpt = "";
      let optionsList: string[] = [];
      let explanation = "";

      const getSymbolStr = (r: Radical) => {
        return charMode === "traditional" ? r.character :
               charMode === "simplified" ? (r.simplifiedCharacter || r.character) :
               (r.character === r.simplifiedCharacter ? r.character : `${r.character} / ${r.simplifiedCharacter}`);
      };

      const radSymbol = getSymbolStr(rad);

      if (type === "meaning") {
        questionText = `Ý nghĩa nghĩa chính của bộ thủ "${radSymbol}" /${rad.pinyin}/ là gì?`;
        correctOpt = rad.meaning;
        const choices = distractors.slice(0, 3).map(r => r.meaning);
        optionsList = [correctOpt, ...choices].sort(() => Math.random() - 0.5);
        explanation = `Bộ thủ "${radSymbol}" có ý nghĩa cốt lõi trong chữ Hán là "${rad.meaning}".`;
      } else if (type === "pinyin") {
        questionText = `Cách phát âm Pinyin chuẩn của bộ thủ "${radSymbol}" (${rad.hanViet} - ${rad.meaning}) là gì?`;
        correctOpt = `/${rad.pinyin}/`;
        const choices = distractors.slice(0, 3).map(r => `/${r.pinyin}/`);
        optionsList = [correctOpt, ...choices].sort(() => Math.random() - 0.5);
        explanation = `Bộ thủ "${radSymbol}" phát âm Pinyin chính văn là /${rad.pinyin}/.`;
      } else {
        questionText = `Bộ thủ biểu trưng cho danh từ Hán Việt "${rad.hanViet}" (nghĩa là: ${rad.meaning}) là chữ nào?`;
        correctOpt = radSymbol;
        const choices = distractors.slice(0, 3).map(r => getSymbolStr(r));
        optionsList = [correctOpt, ...choices].sort(() => Math.random() - 0.5);
        explanation = `Bộ thủ "${radSymbol}" có tên Hán Việt chuẩn phổ biến là "${rad.hanViet}".`;
      }

      questions.push({
        radical: rad,
        questionText,
        options: optionsList,
        correctIndex: optionsList.indexOf(correctOpt),
        explanation
      });
    }

    setQuizQuestions(questions);
    setQuizCurrentIdx(0);
    setQuizSelectedOpt(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
    setActiveSubView("quiz");
  };

  const handleQuizAnswer = (optIndex: number) => {
    if (quizSubmitted) return;
    setQuizSelectedOpt(optIndex);
  };

  const submitQuizAnswer = () => {
    if (quizSelectedOpt === null || quizSubmitted) return;
    setQuizSubmitted(true);
    if (quizSelectedOpt === quizQuestions[quizCurrentIdx].correctIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    if (quizCurrentIdx + 1 < quizQuestions.length) {
      setQuizCurrentIdx(prev => prev + 1);
      setQuizSelectedOpt(null);
      setQuizSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  // Add all radicals in the set to Leitner practice
  const handleAddAllToLeitner = () => {
    let addedCount = 0;
    lessonRadicals.forEach(rad => {
      const alreadyIn = leitnerProgress.some(p => p.radicalId === rad.id);
      if (!alreadyIn) {
        onAddToLeitner(rad.id);
        addedCount++;
      }
    });
    alert(`Đã thêm thành công ${addedCount} bộ thủ mới trong bài học này vào Hộp nhớ Leitner!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]" id="study-lessons-workspace">
      
      {/* Sidebar - Subject Index (Booklet spine style) */}
      <div className="lg:col-span-4 flex flex-col space-y-3" id="lesson-spine-menu">
        <div className="bg-amber-950 text-amber-50 rounded-2xl p-4 shadow-sm border border-amber-900/20">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-black text-sm tracking-widest uppercase">Góc Học Tập Thư Pháp</h3>
          </div>
          <p className="text-[10px] text-amber-100/70 mt-1 leading-normal">
            Lộ trình 10 bài giảng chuyên đề tinh hoa mổ xẻ 214 Bộ thủ theo nhóm ý nghĩa triết học sâu sắc.
          </p>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {lessonsData.map((lesson) => {
            const isSelected = lesson.id === selectedLessonId;
            // Count studied radicals in this lesson
            const studiedInLesson = lesson.radicalIds.filter(id => 
              leitnerProgress.some(p => p.radicalId === id)
            ).length;
            const masteredInLesson = lesson.radicalIds.filter(id => 
              leitnerProgress.some(p => p.radicalId === id && p.box === 4)
            ).length;

            return (
              <button
                key={lesson.id}
                onClick={() => {
                  setSelectedLessonId(lesson.id);
                  setActiveSubView("directory");
                }}
                className={`w-full text-left rounded-xl p-3 border transition-all relative flex flex-col justify-between cursor-pointer ${
                  isSelected 
                    ? "bg-white border-red-750 shadow-md ring-1 ring-red-750/30" 
                    : "bg-white/80 hover:bg-stone-50 border-amber-900/10 hover:border-amber-900/25"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-900 border border-amber-900/5">
                    Bài {lesson.id}
                  </span>
                  <span className="font-serif text-sm font-bold text-amber-900/30">
                    {lesson.chineseTitle}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-stone-900 text-xs mt-2 group-hover:text-red-750 transition-colors">
                  {lesson.title}
                </h4>

                {/* Progress Mini bar inside card */}
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-dashed border-amber-900/10 pt-2">
                  <div className="flex gap-1.5 items-center">
                    <span className="text-[9px] text-stone-500 font-sans font-medium">
                      Tiến độ học:
                    </span>
                    <span className="text-[10px] font-bold font-mono text-amber-900">
                      {studiedInLesson}/{lesson.radicalIds.length} bộ
                    </span>
                  </div>
                  {masteredInLesson > 0 && (
                    <span className="text-[8px] bg-emerald-100 text-emerald-800 rounded font-serif font-bold px-1 py-0.5">
                      {masteredInLesson} Đã thành thạo
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Study Material Deck */}
      <div className="lg:col-span-8 flex flex-col space-y-4" id="lesson-material-deck">
        
        {/* Lesson Header Banner */}
        <div className="bg-white border border-amber-900/10 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute right-4 top-2 text-stone-100/50 pointer-events-none text-9xl font-serif leading-none select-none">
            {activeLesson.id}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-amber-900/5 pb-3 relative z-10">
            <div>
              <span className="text-[10px] uppercase font-bold text-red-750 tracking-wider">Bài học chuyên đề #{activeLesson.id}</span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-amber-955 mt-0.5">
                {activeLesson.title}
              </h2>
            </div>
            <span className="font-serif text-amber-900/40 text-xs italic bg-stone-50 px-2.5 py-1 rounded-lg border border-amber-950/5">
              Chủ đề: {activeLesson.category}
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed max-w-2xl relative z-10">
            {activeLesson.description}
          </p>

          {/* Sub View Toggle within the lesson */}
          <div className="flex gap-2 pt-2 border-t border-amber-900/5 relative z-10">
            <button
              onClick={() => setActiveSubView("directory")}
              className={`text-xs px-3.5 py-2 rounded-xl transition-all font-sans font-bold flex items-center gap-1.5 cursor-pointer ${
                activeSubView === "directory"
                  ? "bg-amber-950 text-amber-50 shadow-sm"
                  : "bg-amber-50 text-amber-900 hover:bg-amber-100/60"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Mục lục khoa bản ({lessonRadicals.length} bộ)
            </button>
            <button
              onClick={() => {
                setFcIndex(0);
                setFcFlipped(false);
                setActiveSubView("flashcard");
              }}
              className={`text-xs px-3.5 py-2 rounded-xl transition-all font-sans font-bold flex items-center gap-1.5 cursor-pointer ${
                activeSubView === "flashcard"
                  ? "bg-amber-950 text-amber-50 shadow-sm"
                  : "bg-amber-50 text-amber-900 hover:bg-amber-100/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-600 fill-yellow-600/30 animate-pulse" />
              Thẻ thông thái Flashcards
            </button>
            <button
              onClick={startQuiz}
              className={`text-xs px-3.5 py-2 rounded-xl transition-all font-sans font-bold flex items-center gap-1.5 cursor-pointer ${
                activeSubView === "quiz"
                  ? "bg-amber-950 text-amber-50 shadow-sm"
                  : "bg-amber-50 text-amber-900 hover:bg-amber-100/60"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Khoa cử Đố vui
            </button>

            <button
              onClick={handleAddAllToLeitner}
              title="Thêm các bộ này vào flashcard Leitner chính"
              className="ml-auto text-[10px] hidden sm:flex items-center gap-1 bg-red-50 text-red-750 hover:bg-red-100 transition-colors px-3 py-1.5 rounded-xl border border-red-200 font-sans font-extrabold cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Học Leitner
            </button>
          </div>
        </div>

        {/* View 1: Lesson Radicals Directory */}
        {activeSubView === "directory" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5" id="lesson-directory-view">
            
            {/* Radical Grid Area */}
            <div className="md:col-span-6 bg-white border border-amber-900/10 rounded-2xl p-4 shadow-sm space-y-3">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                Lựa chọn Bộ thủ trong bài để xem phân tích:
              </span>
              <div className="grid grid-cols-5 gap-2.5">
                {lessonRadicals.map((rad) => {
                  const isSelected = currentRadDetail?.id === rad.id;
                  const isStudied = leitnerProgress.some(p => p.radicalId === rad.id);
                  const isMastered = leitnerProgress.some(p => p.radicalId === rad.id && p.box === 4);

                  return (
                    <button
                      key={rad.id}
                      onClick={() => setCurrentRadDetail(rad)}
                      className={`relative aspect-square rounded-xl border flex flex-col justify-center items-center transition-all p-1 cursor-pointer group ${
                        isSelected 
                          ? "bg-amber-950 text-white border-amber-950 scale-102 font-bold shadow-md" 
                          : "bg-amber-50/40 border-amber-900/10 hover:bg-amber-50 hover:border-amber-900/25 text-stone-800"
                      }`}
                    >
                      {/* Character representation */}
                      <span className="font-serif text-2xl leading-none">
                        {charMode === "traditional" && rad.character}
                        {charMode === "simplified" && (rad.simplifiedCharacter || rad.character)}
                        {charMode === "both" && (
                          rad.character === rad.simplifiedCharacter ? (
                            rad.character
                          ) : (
                            <span className="flex items-center text-sm gap-0.5 justify-center leading-none">
                              <span className="text-[11px] text-amber-900/45 group-hover:text-amber-900/60">{rad.character}</span>
                              <span className="text-[8px] text-amber-900/20">→</span>
                              <span className="text-base font-black text-red-750">{rad.simplifiedCharacter}</span>
                            </span>
                          )
                        )}
                      </span>

                      {/* Han Việt */}
                      <span className={`text-[8px] mt-1 text-center truncate w-full ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                        {rad.hanViet}
                      </span>

                      {/* Studied / Mastered small dots */}
                      {isMastered ? (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      ) : isStudied ? (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Radical Detail Panel with Multi-tab Calligraphy Practice */}
            <div className="md:col-span-6 bg-stone-50 border border-amber-900/10 rounded-2xl p-4.5 shadow-inner flex flex-col justify-between space-y-4">
              {currentRadDetail ? (
                <>
                  <div className="space-y-3.5">
                    {/* Header Bar */}
                    <div className="flex justify-between items-start border-b border-amber-900/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-950 text-amber-50 text-[9px] font-mono px-2 py-0.5 rounded font-bold">
                          Bộ #{currentRadDetail.id}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {charMode === "simplified" && currentRadDetail.simplifiedStrokes ? currentRadDetail.simplifiedStrokes : currentRadDetail.strokes} nét viết
                        </span>
                      </div>

                      <button
                        onClick={() => playRadicalAudio(
                          charMode === "simplified" ? (currentRadDetail.simplifiedCharacter || currentRadDetail.character) : currentRadDetail.character,
                          currentRadDetail.pinyin,
                          currentRadDetail.hanViet,
                          currentRadDetail.meaning
                        )}
                        className="p-1 hover:bg-amber-100 font-sans border border-amber-900/5 rounded-full text-red-750 flex items-center justify-center cursor-pointer transition-colors"
                        title="Nghe phát thanh âm chuẩn"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Tab Selection Header */}
                    <div className="flex border-b border-amber-900/10">
                      <button
                        onClick={() => setDetailTab("info")}
                        className={`flex-1 pb-2 text-[10px] font-sans font-black uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                          detailTab === "info"
                            ? "border-amber-950 text-amber-955"
                            : "border-transparent text-stone-400 hover:text-stone-600"
                        }`}
                      >
                        Ý nghĩa & Từ mẫu
                      </button>
                      <button
                        onClick={() => setDetailTab("practice")}
                        className={`flex-1 pb-2 text-[10px] font-sans font-black uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          detailTab === "practice"
                            ? "border-red-750 text-red-750"
                            : "border-transparent text-stone-400 hover:text-stone-600"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-red-700" />
                        Tập viết Thư pháp
                      </button>
                    </div>

                    {detailTab === "info" ? (
                      /* TAB 1: RADICAL INFORMATION */
                      <div className="space-y-3.5 fade-in">
                        {/* Character Glyph Focus Row */}
                        <div className="flex items-center gap-4">
                          <div className="bg-white border-2 border-amber-955/10 rounded-2xl shadow-sm w-16 h-16 flex items-center justify-center">
                            <span className="font-serif text-4xl font-extrabold text-amber-955">
                              {charMode === "traditional" && currentRadDetail.character}
                              {charMode === "simplified" && (currentRadDetail.simplifiedCharacter || currentRadDetail.character)}
                              {charMode === "both" && (
                                currentRadDetail.character === currentRadDetail.simplifiedCharacter ? (
                                  currentRadDetail.character
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <span className="text-2xl font-bold">{currentRadDetail.character}</span>
                                    <span className="text-xs text-amber-900/30 font-serif">→</span>
                                    <span className="text-2xl font-extrabold text-red-750">{currentRadDetail.simplifiedCharacter}</span>
                                  </span>
                                )
                              )}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-serif text-lg font-black text-amber-950 flex items-baseline gap-1.5 leading-none">
                              {currentRadDetail.hanViet}
                              <span className="text-xs text-red-750 font-bold ml-1">
                                /{currentRadDetail.pinyin}/
                              </span>
                            </h4>
                            <p className="text-xs text-stone-700 mt-1">
                              Nghĩa Việt cốt lõi: <strong className="text-amber-950 font-bold font-sans text-sm">{currentRadDetail.meaning}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Mnemonic origin text */}
                        <div className="bg-white border border-amber-950/5 p-3 rounded-xl shadow-xs">
                          <span className="text-[9px] uppercase font-bold text-amber-900/60 block mb-1">Cơ chế và Điển tích bộ thủ:</span>
                          <p className="text-xs text-stone-600 leading-normal text-justify">
                            {currentRadDetail.description}
                          </p>
                        </div>

                        {/* Vocabulary Sample list */}
                        <div>
                          <span className="text-[9px] uppercase font-bold text-amber-900/60 block mb-1.5">
                            Chữ ghép mẫu để luyện tập {charMode === "traditional" ? "Phồn thể" : charMode === "simplified" ? "Giản thể" : "Phồn/Giản"}:
                          </span>
                          <div className="space-y-1.5">
                            {currentRadDetail.commonWords.map((cw, i) => (
                              <div key={i} className="bg-white border border-stone-100 rounded-xl p-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-serif text-lg font-bold text-stone-800 leading-none">
                                    {charMode === "traditional" && cw.word}
                                    {charMode === "simplified" && (cw.simplifiedWord || cw.word)}
                                    {charMode === "both" && (
                                      cw.word === cw.simplifiedWord ? (
                                        cw.word
                                      ) : (
                                        <span className="flex items-center gap-1 justify-center">
                                          <span className="text-amber-955 font-bold">{cw.word}</span>
                                          <span className="text-[10px] text-amber-900/30">/</span>
                                          <span className="text-red-750 font-extrabold">{cw.simplifiedWord}</span>
                                        </span>
                                      )
                                    )}
                                  </span>
                                  <span className="text-[10px] text-stone-400 font-mono">({cw.hanViet})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-stone-500 font-sans italic">{cw.meaning}</span>
                                  <button
                                    onClick={() => speakChinese(charMode === "simplified" ? (cw.simplifiedWord || cw.word) : cw.word)}
                                    className="p-0.5 hover:bg-stone-100 text-red-700 rounded transition-colors cursor-pointer"
                                  >
                                    <Volume2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* TAB 2: CALLIGRAPHY INTERACTIVE WRITING PRACTICE CANVAS */
                      <div className="space-y-3 animate-fade-in">
                        {/* Selector of which character in the current set to practice */}
                        <div>
                          <span className="text-[9px] uppercase font-black text-amber-900/60 block mb-1">
                            Chọn chữ mẫu tập thảo bút:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {getPracticeOptions().slice(0, 7).map((charSymbol, idx) => {
                              const isActive = practiceTarget === charSymbol;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setPracticeTarget(charSymbol);
                                    clearCanvas();
                                  }}
                                  className={`px-2.5 py-1 text-xs font-serif font-black rounded-lg transition-all cursor-pointer border ${
                                    isActive
                                      ? "bg-red-750 text-amber-50 border-red-700 shadow-sm scale-102"
                                      : "bg-white text-stone-700 border-amber-900/10 hover:border-amber-900/25"
                                  }`}
                                >
                                  {charSymbol}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Calligraphy rice paper canvas grid card */}
                        <div className="relative w-full aspect-square max-w-[240px] mx-auto bg-[#FAF6EE] border-2 border-amber-800/15 rounded-xl shadow-xs overflow-hidden select-none">
                          {/* Chinese calligraphy grid shape: '米' letter mễ grid */}
                          <div className="absolute inset-0 pointer-events-none">
                            {/* Horizontal grid line */}
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-red-700/10 border-dashed"></div>
                            {/* Vertical grid line */}
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-red-700/10 border-dashed"></div>
                            {/* Diagonals */}
                            <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
                              <line x1="0" y1="0" x2="100%" y2="100%" stroke="#B91C1C" strokeWidth="1" strokeDasharray="3 3" />
                              <line x1="100%" y1="0" x2="0" y2="100%" stroke="#B91C1C" strokeWidth="1" strokeDasharray="3 3" />
                            </svg>
                            {/* Square inner borders helper */}
                            <div className="absolute inset-4 border border-red-700/5 rounded-lg opacity-45"></div>
                          </div>

                          {/* Trace Assist Template layer behind transparent canvas */}
                          {showGuideTrace && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-serif text-[130px] text-stone-300/35 leading-none h-full w-full">
                              {practiceTarget}
                            </div>
                          )}

                          {/* Smooth Canvas brush layer */}
                          <canvas
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="absolute inset-0 w-full h-full cursor-crosshair touch-none bg-transparent"
                          />
                        </div>

                        {/* Interactive Toolbar for drawing controls */}
                        <div className="bg-white border border-amber-950/5 p-2 rounded-xl shadow-xs flex items-center justify-between gap-2 flex-wrap">
                          {/* Color palette */}
                          <div className="flex items-center gap-1">
                            {[
                              { label: "Mực Thư Pháp", color: "#1c1917" },
                              { label: "Mực Son Đỏ", color: "#b91c1c" },
                              { label: "Mực Chàm", color: "#1d4ed8" }
                            ].map((ink, index) => (
                              <button
                                key={index}
                                onClick={() => setInkColor(ink.color)}
                                title={ink.label}
                                className={`w-4 h-4 rounded-full border cursor-pointer transition-transform ${
                                  inkColor === ink.color ? "scale-120 ring-1 ring-amber-955/40 font-bold" : "hover:scale-105"
                                }`}
                                style={{ backgroundColor: ink.color }}
                              ></button>
                            ))}
                          </div>

                          {/* Settings control buttons */}
                          <div className="flex items-center gap-1 text-[10px]">
                            {/* Toggle Guide letter */}
                            <button
                              onClick={() => setShowGuideTrace(!showGuideTrace)}
                              className={`px-2 py-1 rounded transition-colors text-xs font-sans tracking-wide cursor-pointer ${
                                showGuideTrace ? "bg-amber-100 text-amber-900 font-extrabold" : "bg-stone-100 text-stone-500"
                              }`}
                            >
                              {showGuideTrace ? "Tắt hình mẫu" : "Hiện hình mẫu"}
                            </button>

                            {/* Clear canvas button */}
                            <button
                              onClick={clearCanvas}
                              className="p-1 px-1.5 bg-red-50 text-red-750 hover:bg-red-100 transition-colors border border-red-200/40 rounded flex items-center gap-1 font-bold cursor-pointer"
                              title="Xóa tấm phản thư để viết lại"
                            >
                              <Eraser className="w-3 h-3" />
                              Ủi sạch
                            </button>
                          </div>
                        </div>

                        {/* Dynamic Stroke Rules Advice */}
                        <div className="bg-amber-50/15 border border-amber-900/5 p-2.5 rounded-lg">
                          <span className="text-[9px] uppercase font-black text-amber-900/60 block mb-0.5">
                            Quy tắc thuận cho chữ &quot;{practiceTarget}&quot;:
                          </span>
                          <p className="text-[10px] text-stone-600 leading-normal whitespace-pre-line font-sans italic">
                            {getStrokeGuideText(practiceTarget)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Leitner setup action bottom bar */}
                  <div className="border-t border-amber-900/5 pt-2.5">
                    {leitnerProgress.some(p => p.radicalId === currentRadDetail.id) ? (
                      <div className="flex items-center gap-1.5 text-emerald-800 text-[10px] font-bold py-1 bg-emerald-50 rounded-lg justify-center border border-emerald-100">
                        <Check className="w-3.5 h-3.5" />
                        Đã nạp vào Hộp Spaced Repetition cứu cánh của bạn!
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          onAddToLeitner(currentRadDetail.id);
                        }}
                        className="w-full bg-red-750 hover:bg-red-800 text-amber-50 text-xs py-2 rounded-xl transition-all font-sans font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Đưa bộ thủ này vào Leitner Flashcard
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-stone-400 text-xs font-serif">
                  Vui lòng bấm chọn một bộ thủ trong mảng phía trái
                </div>
              )}
            </div>
          </div>
        )}

        {/* View 2: Lesson Flashcards Mode */}
        {activeSubView === "flashcard" && (
          <div className="bg-white border border-amber-900/10 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center space-y-6 min-h-[400px]" id="lesson-flashcards-mode">
            <div className="w-full flex justify-between items-center border-b border-stone-100 pb-2">
              <span className="text-xs font-mono font-bold text-stone-500">
                Thẻ học thứ {fcIndex + 1} / {lessonRadicals.length}
              </span>
              <div className="h-1 bg-stone-100 rounded-full w-24">
                <div 
                  className="h-1 bg-red-750 rounded-full transition-all duration-300" 
                  style={{ width: `${((fcIndex + 1) / lessonRadicals.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Beautiful Rotatable Virtual Flashcard Container */}
            <div 
              onClick={() => setFcFlipped(!fcFlipped)}
              className="w-full max-w-sm aspect-[4/3] rounded-2xl border-2 border-amber-955/15 bg-stone-50/50 hover:bg-stone-50 shadow-md flex flex-col justify-center items-center py-6 px-4 cursor-pointer transition-all hover:scale-[1.01] select-none text-center relative overflow-hidden"
              id="study-flashcard-interactive"
            >
              {/* Seal Background Decoration */}
              <div className="absolute inset-4 border border-red-700/5 pointer-events-none rounded-xl"></div>
              
              {!fcFlipped ? (
                // Side A: Symbol Focus
                <div className="flex-1 flex flex-col justify-center items-center relative z-10">
                  <span className="font-serif text-7xl font-extrabold text-amber-950">
                    {charMode === "traditional" && lessonRadicals[fcIndex]?.character}
                    {charMode === "simplified" && (lessonRadicals[fcIndex]?.simplifiedCharacter || lessonRadicals[fcIndex]?.character)}
                    {charMode === "both" && (
                      lessonRadicals[fcIndex]?.character === lessonRadicals[fcIndex]?.simplifiedCharacter ? (
                        lessonRadicals[fcIndex]?.character
                      ) : (
                        <span className="flex items-center gap-1 justify-center">
                          <span className="text-amber-955 text-6xl font-bold">{lessonRadicals[fcIndex]?.character}</span>
                          <span className="text-xs text-stone-400">→</span>
                          <span className="text-6xl font-black text-red-750">{lessonRadicals[fcIndex]?.simplifiedCharacter}</span>
                        </span>
                      )
                    )}
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const rad = lessonRadicals[fcIndex];
                      playRadicalAudio(
                        charMode === "simplified" ? (rad.simplifiedCharacter || rad.character) : rad.character,
                        rad.pinyin,
                        rad.hanViet,
                        rad.meaning
                      );
                    }}
                    className="mt-4 p-1 shadow-xs bg-white hover:bg-red-50 border border-amber-900/10 rounded-full transition-all text-red-750 flex items-center justify-center gap-1 text-[10px] cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  <p className="mt-4 text-[9px] text-stone-400 font-sans tracking-wide">
                    (Bấm vào bất cứ đâu để Lật sang Mặt Sau xem ý nghĩa chi tiết)
                  </p>
                </div>
              ) : (
                // Side B: Explanation Focus
                <div className="flex-1 flex flex-col justify-center items-center py-4 px-2 space-y-2 relative z-10">
                  <h4 className="font-serif text-2xl font-black text-amber-950 flex items-baseline gap-1 mt-1 leading-none">
                    {lessonRadicals[fcIndex]?.hanViet}
                    <span className="text-xs text-red-750">/{lessonRadicals[fcIndex]?.pinyin}/</span>
                  </h4>

                  <span className="bg-amber-100 text-amber-900 text-xs px-3 py-1 rounded-full font-sans font-bold">
                    Nghĩa cốt lõi: {lessonRadicals[fcIndex]?.meaning}
                  </span>

                  <p className="text-[11px] text-stone-600 leading-relaxed text-center px-4 max-w-xs block mt-2">
                    {lessonRadicals[fcIndex]?.description}
                  </p>

                  <div className="mt-3 flex gap-1 justify-center flex-wrap pt-2 border-t border-dashed border-amber-900/10 w-full">
                    {lessonRadicals[fcIndex]?.commonWords.slice(0, 2).map((cw, idx) => (
                      <span key={idx} className="text-[9px] bg-white border border-stone-100 rounded px-1.5 py-0.5">
                        {charMode === "simplified" ? (cw.simplifiedWord || cw.word) : cw.word} ({cw.hanViet})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Flashcard Controller Buttons */}
            <div className="flex gap-4 items-center">
              <button
                disabled={fcIndex === 0}
                onClick={() => {
                  setFcIndex(prev => prev - 1);
                  setFcFlipped(false);
                }}
                className="px-4 py-2 text-xs rounded-xl border border-stone-200 hover:bg-stone-50 disabled:opacity-50 transition-all font-sans font-bold cursor-pointer"
              >
                Trở lại
              </button>

              <button
                onClick={() => {
                  setFcFlipped(!fcFlipped);
                }}
                className="px-5 py-2 text-xs bg-amber-50 text-amber-950 rounded-xl hover:bg-amber-100 transition-all font-sans font-bold border border-amber-955/15 cursor-pointer shadow-xs"
              >
                XEM ĐÁP ÁN (LẬT)
              </button>

              {fcIndex + 1 < lessonRadicals.length ? (
                <button
                  onClick={() => {
                    setFcIndex(prev => prev + 1);
                    setFcFlipped(false);
                  }}
                  className="px-4 py-2 text-xs bg-amber-950 text-amber-50 rounded-xl hover:bg-amber-900 transition-all font-sans font-bold cursor-pointer"
                >
                  Kế tiếp
                </button>
              ) : (
                <button
                  onClick={() => {
                    setFcIndex(0);
                    setFcFlipped(false);
                  }}
                  className="px-4 py-2 text-xs bg-emerald-800 text-amber-50 rounded-xl hover:bg-emerald-900 transition-all font-sans font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Ôn lại từ đầu
                </button>
              )}
            </div>
          </div>
        )}

        {/* View 3: Lesson Personalized Quick Quiz */}
        {activeSubView === "quiz" && (
          <div className="bg-white border border-amber-900/10 rounded-2xl p-5 shadow-sm space-y-4 min-h-[400px]" id="lesson-quiz-view">
            
            {!quizFinished ? (
              quizQuestions.length > 0 ? (
                <div className="space-y-4">
                  
                  {/* Progress Header */}
                  <div className="flex justify-between items-center border-b border-amber-900/5 pb-2.5">
                    <span className="text-xs text-stone-500 font-mono font-bold">
                      Hỏi khoa cử: Câu {quizCurrentIdx + 1} / {quizQuestions.length}
                    </span>
                    <span className="text-xs bg-red-50 text-red-750 px-2 py-0.5 rounded font-bold font-sans">
                      Điểm tích luỹ: {quizScore} / {quizQuestions.length}
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <div className="bg-stone-50 border border-amber-955/5 rounded-xl p-4 shadow-inner">
                    <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 leading-relaxed">
                      {quizQuestions[quizCurrentIdx].questionText}
                    </h3>
                  </div>

                  {/* Character Illustration if applicable */}
                  {quizQuestions[quizCurrentIdx].radical && (
                    <div className="flex justify-center py-2 bg-stone-50/20 border border-stone-100 rounded-xl max-w-[124px] mx-auto shadow-xs">
                      <span className="font-serif text-4xl font-extrabold text-amber-955">
                        {charMode === "traditional" && quizQuestions[quizCurrentIdx].radical.character}
                        {charMode === "simplified" && (quizQuestions[quizCurrentIdx].radical.simplifiedCharacter || quizQuestions[quizCurrentIdx].radical.character)}
                        {charMode === "both" && (
                          quizQuestions[quizCurrentIdx].radical.character === quizQuestions[quizCurrentIdx].radical.simplifiedCharacter ? (
                            quizQuestions[quizCurrentIdx].radical.character
                          ) : (
                            <span className="flex items-center gap-1 justify-center leading-none">
                              <span className="text-2xl font-bold">{quizQuestions[quizCurrentIdx].radical.character}</span>
                              <span className="text-stone-300 text-xs">→</span>
                              <span className="text-2xl font-black text-red-750">{quizQuestions[quizCurrentIdx].radical.simplifiedCharacter}</span>
                            </span>
                          )
                        )}
                      </span>
                    </div>
                  )}

                  {/* Options Stack */}
                  <div className="grid grid-cols-1 gap-2">
                    {quizQuestions[quizCurrentIdx].options.map((opt: string, idx: number) => {
                      const isSelected = quizSelectedOpt === idx;
                      const isCorrect = idx === quizQuestions[quizCurrentIdx].correctIndex;

                      let btnStyle = "bg-white border-amber-900/10 hover:bg-stone-50 text-stone-800";
                      
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                        } else if (isSelected) {
                          btnStyle = "bg-red-50 border-red-500 text-red-900";
                        } else {
                          btnStyle = "bg-white/50 border-stone-100 text-stone-400 opacity-60";
                        }
                      } else if (isSelected) {
                        btnStyle = "bg-amber-950 text-amber-50 border-amber-950 shadow-md ring-1 ring-amber-900/10";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(idx)}
                          disabled={quizSubmitted}
                          className={`w-full text-left rounded-xl p-3 border transition-all text-xs font-sans flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                          {quizSubmitted && isSelected && !isCorrect && <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submition & Next Controllers */}
                  <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
                    <div>
                      {quizSubmitted && (
                        <p className="text-[10px] text-stone-500 italic max-w-sm leading-normal">
                          {quizQuestions[quizCurrentIdx].explanation}
                        </p>
                      )}
                    </div>
                    <div>
                      {!quizSubmitted ? (
                        <button
                          onClick={submitQuizAnswer}
                          disabled={quizSelectedOpt === null}
                          className="px-5 py-2.5 bg-red-750 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-800 text-amber-50 rounded-xl transition-all font-sans font-bold text-xs cursor-pointer shadow-sm"
                        >
                          Xác nhận Đáp án
                        </button>
                      ) : (
                        <button
                          onClick={nextQuizQuestion}
                          className="px-5 py-2.5 bg-amber-950 hover:bg-amber-900 text-amber-50 rounded-xl transition-all font-sans font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm"
                        >
                          {quizCurrentIdx + 1 < quizQuestions.length ? "Câu hỏi tiếp theo" : "Hoàn thành kiểm tra"}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-12 text-stone-400 text-xs">
                  Không nạp được bộ câu hỏi, hãy bấm nút "Khoa cử Đố vui" phía trên.
                </div>
              )
            ) : (
              // Quiz Finished Screen
              <div className="text-center py-12 space-y-4 max-w-md mx-auto" id="lesson-quiz-finished">
                <div className="w-16 h-16 bg-red-50 text-red-750 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-amber-955">Khoa thi hoàn thành!</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Bạn vừa mổ xẻ kiểm tra trí tưởng tượng trên chuyên mục <strong>"{activeLesson.title}"</strong>.
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 max-w-xs mx-auto">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">KẾT QUẢ ĐẠT ĐƯỢC:</span>
                  <span className="font-serif text-3xl font-black text-red-750 mt-1 block">
                    {quizScore} / {quizQuestions.length} <span className="text-xs font-sans text-stone-500 font-normal">điểm</span>
                  </span>
                  <p className="text-[10px] text-stone-400 mt-2 leading-relaxed">
                    {quizScore === quizQuestions.length ? "Danh bất hư truyền! Bạn có trực giác mổ xẻ lý tưởng." : "Kiên trì rèn luyện, chắc chắn khoa thi sau tích phân bạn sẽ đắc đạo!"}
                  </p>
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={startQuiz}
                    className="px-4 py-2 text-xs bg-red-750 hover:bg-red-800 text-amber-50 rounded-xl transition-all font-sans font-bold cursor-pointer"
                  >
                    Thi lại
                  </button>
                  <button
                    onClick={() => setActiveSubView("directory")}
                    className="px-4 py-2 text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-all font-sans font-bold cursor-pointer"
                  >
                    Về Bài lý thuyết
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
