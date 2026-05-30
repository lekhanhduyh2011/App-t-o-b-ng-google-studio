import React, { useRef, useState, useEffect } from "react";
import { Sparkles, Trash2, Search, Info } from "lucide-react";
import { Radical } from "../types";

interface DrawingBoardProps {
  onRadicalSelect: (radical: Radical) => void;
  radicalsList: Radical[];
}

interface AIResult {
  radicalId: number;
  character: string;
  pinyin: string;
  hanViet: string;
  confidence: number;
  explanation: string;
}

export default function DrawingBoard({ onRadicalSelect, radicalsList }: DrawingBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AIResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize canvas size based on its container
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        const canvas = canvasRef.current;
        const rect = containerRef.current.getBoundingClientRect();
        
        // Save current canvas content
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) tempCtx.drawImage(canvas, 0, 0);

        // Resize
        canvas.width = rect.width;
        canvas.height = Math.min(300, rect.width * 0.75); // constraints for mobile

        // Restore content
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = 4;
          ctx.strokeStyle = "#4A3E3D"; // Deep ink charcoal line
          ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Support scale ratio if coordinates deviate
    const x = ((e.clientX - rect.left) / rect.width) * canvasRef.current.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvasRef.current.height;
    return { x, y };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setError(null);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
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
    setResults([]);
    setError(null);
  };

  const handleRecognize = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if the canvas is empty by examining pixels
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const buffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let somePixels = false;
    for (let i = 3; i < buffer.data.length; i += 4) {
      if (buffer.data[i] > 0) {
        somePixels = true;
        break;
      }
    }

    if (!somePixels) {
      setError("Vui lòng vẽ một nét bất kỳ trước khi nhận diện.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Background of black ink stone is simulated, let's export as JPEG/PNG
      const imageBase64 = canvas.toDataURL("image/png");

      const response = await fetch("/api/recognize-radical", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64 }),
      });

      if (!response.ok) {
        throw new Error("Lỗi mạng khi kết nối máy chủ nhận diện.");
      }

      const data = await response.json();
      if (data.matches && Array.isArray(data.matches)) {
        setResults(data.matches);
        if (data.matches.length === 0) {
          setError("AI chưa nhận diện được nét vẽ của bạn. Thử viết to, rõ ràng hơn nhé!");
        }
      } else {
        setError("Định dạng dữ liệu trả về từ máy chủ không hợp lệ.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Không thể nhận diện hình ảnh của bạn lúc này. Vui lòng kiểm tra lại kết nối.");
    } finally {
      setIsLoading(false);
    }
  };

  const locateAndSelectRadical = (res: AIResult) => {
    const matched = radicalsList.find((r) => r.id === res.radicalId || r.character === res.character);
    if (matched) {
      onRadicalSelect(matched);
    } else {
      setError(`Không tìm thấy bộ thủ ID ${res.radicalId} trong danh bạ.`);
    }
  };

  return (
    <div className="bg-amber-50/50 border border-amber-900/10 rounded-2xl p-5 shadow-sm" id="drawing-pad-section">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-sans font-semibold text-lg text-amber-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block animate-pulse"></span>
            Tìm kiếm bằng Nét vẽ tay (AI)
          </h3>
          <p className="text-xs text-amber-800/80 mt-0.5">
            Vẽ nháp kí tự bộ thủ phồn thể bên dưới và bấm nút nhận diện dưới sự hỗ trợ của trí tuệ nhân tạo Gemini
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="p-2 text-amber-800 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-amber-900/10 cursor-pointer bg-white"
            title="Xóa bảng"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Draw Area */}
        <div className="lg:col-span-7 flex flex-col">
          <div
            ref={containerRef}
            className="w-full relative border-2 border-dashed border-amber-900/20 bg-white rounded-xl overflow-hidden cursor-crosshair flex items-center justify-center min-h-[220px]"
          >
            {/* Draw guideline shadow */}
            <div className="absolute pointer-events-none text-amber-900/5 select-none font-serif text-8xl">
              壽
            </div>
            
            <canvas
              ref={canvasRef}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
              className="absolute top-0 left-0 w-full h-full touch-none"
              style={{ background: "transparent" }}
              id="ink-handwriting-canvas"
            />
          </div>

          <button
            onClick={handleRecognize}
            disabled={isLoading}
            className={`mt-3 w-full py-2.5 px-4 rounded-xl font-sans font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
              isLoading
                ? "bg-amber-200 text-amber-700 cursor-not-allowed"
                : "bg-amber-950 text-amber-50 hover:bg-amber-900 active:scale-95 shadow-md shadow-amber-950/10"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-700 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-amber-700 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-amber-700 animate-bounce delay-200"></span>
                Đang nhận diện...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Dịch chuyển & Nhập tự
              </>
            )}
          </button>
        </div>

        {/* AI Results */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-amber-950/5 rounded-xl p-4 border border-amber-950/10 flex-1 flex flex-col min-h-[200px]">
            <span className="text-xs font-semibold text-amber-950 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-red-700" />
              Gợi ý từ Thần toán AI
            </span>

            {error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-3">
                <Info className="w-6 h-6 text-red-700 mb-1" />
                <p className="text-xs text-red-800">{error}</p>
              </div>
            )}

            {!error && results.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-amber-800/60 p-4">
                <p className="text-xs italic">
                  Hãy viết một bộ thủ (ví dụ: 木, 水, 口, 門) và bấm nút bên để hệ thống AI phân tích tức thì.
                </p>
              </div>
            )}

            {!error && results.length > 0 && (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {results.map((res, idx) => (
                  <div
                    key={idx}
                    onClick={() => locateAndSelectRadical(res)}
                    className="flex justify-between items-start p-2.5 bg-white hover:bg-amber-100/50 rounded-lg border border-amber-900/10 cursor-pointer transition-all hover:translate-x-1"
                  >
                    <div className="flex gap-2.5 items-center">
                      <span className="font-serif text-2xl font-bold px-2 py-1 bg-amber-50 rounded-md border border-amber-950/10 text-amber-950">
                        {res.character}
                      </span>
                      <div className="text-left">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-semibold text-amber-950">{res.hanViet}</p>
                          <span className="text-xs text-amber-700/80 font-mono">/{res.pinyin}/</span>
                        </div>
                        <p className="text-xs text-amber-900/70 line-clamp-1">{res.explanation}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded-full font-mono border border-emerald-200">
                        {res.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
