import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Increase request size limit to handle base64 canvas drawings
app.use(express.json({ limit: "15mb" }));

// Initialize Gemini Client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Endpoint 1: Analyze any Han character/word and break down by Radicals to guess meaning
app.post("/api/explain-word", async (req, res) => {
  try {
    const { word } = req.body;
    if (!word || typeof word !== "string") {
      return res.status(400).json({ error: "Tham số 'word' là bắt buộc và phải là một chuỗi." });
    }

    const systemInstruction = `Bạn là một học giả Hán học thông thái và là một giảng viên dạy Thư pháp/Chữ Hán Phồn thể và Giản thể tài ba. 
Nhiệm vụ của bạn là phân tích sâu sắc các chữ Hán phồn thể hoặc giản thể được yêu cầu, mổ xẻ chúng thành các Bộ thủ cấu thành.
Hãy giải thích đầy cảm hứng, liên kết trực quan giữa "Bộ thủ" và "Ý nghĩa" của chữ để hướng dẫn người học cách nhìn chữ đoán nghĩa (ví dụ: Chữ 媽 hay 妈 gồm bộ Nữ 女 ghép với chữ Mã 馬 hay 马, bộ Nữ chỉ phái đẹp/người mẹ, Mã trợ âm; Chữ 休 gồm Nhân 亻 đứng cạnh cây 木 đại diện ngồi tựa hóng mát nghỉ ngơi).
Hãy chia sẻ mẹo ghi nhớ thú vị, khoa học để lưu giữ ký ức lâu dài.
Hãy viết bằng Tiếng Việt tinh tế, nho nhã, tôn nghiêm thư pháp nồng hậu nhưng dễ hiểu. Hãy sử dụng Markdown đẹp đẽ, phân tách rõ ràng từng chữ trong từ để người dùng dễ tiếp thu.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Hãy mổ xẻ bộ thủ và hướng dẫn đoán nghĩa một cách chi tiết cho từ chữ Hán phồn thể hoặc giản thể sau đây: "${word}"`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Lỗi trong giải mã chữ Hán:", error);
    res.status(500).json({ error: error.message || "Không thể phân tích chữ Hán lúc này." });
  }
});

// Endpoint 2: Recognize handwritten drawing of a radical / character
app.post("/api/recognize-radical", async (req, res) => {
  try {
    const { imageBase64 } = req.body; // base64 string starting with data:image/png;base64,...
    if (!imageBase64) {
      return res.status(400).json({ error: "Bản vẽ trống. Cần có dữ liệu hình ảnh dạng base64." });
    }

    // Strip header if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const imagePart = {
      inlineData: {
        mimeType: "image/png",
        data: base64Data,
      },
    };

    const promptText = `Bức ảnh đính kèm là nét vẽ tay phác thảo của một bộ thủ hoặc chữ Hán phồn thể/giản thể trên bảng vẽ canvas.
    Hãy phân tích nét vẽ hoặc cấu trúc biểu tượng này, đối chiếu trực quan xem nó khớp nhất với bộ thủ nào trong số 214 Bộ Thủ Chữ Hán kinh điển (hỗ trợ cả nét phồn thể và giản thể).
    Hãy trả về tối đa 4 bộ thủ tiềm năng nhất tương tự nét vẽ này.
    Kết quả trả về PHẢI là định dạng JSON thuần túy, không có định dạng markdown xung quanh (không có dấu lồng \`\`\`json).
    Cấu trúc JSON bắt buộc phải tuân theo cấu trúc sau:
    {
      "matches": [
        {
          "radicalId": 75,
          "character": "木",
          "pinyin": "mù",
          "hanViet": "MỘC",
          "confidence": 95,
          "explanation": "Nét phác họa có hình trục đứng xòe hai nhánh giống cấu trúc thân cây gỗ rất đặc trưng của bộ Mộc."
        }
      ]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: {
        parts: [imagePart, { text: promptText }],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  radicalId: { type: Type.INTEGER, description: "ID của bộ thủ từ 1 đến 214" },
                  character: { type: Type.STRING, description: "Ký tự bộ thủ truyền thống" },
                  pinyin: { type: Type.STRING, description: "Phát âm Pinyin" },
                  hanViet: { type: Type.STRING, description: "Tên Hán Việt viết hoa" },
                  confidence: { type: Type.INTEGER, description: "Độ tự tin ước tính từ 1 đến 100" },
                  explanation: { type: Type.STRING, description: "Lý giải ngắn gọn tại sao khớp" },
                },
                required: ["radicalId", "character", "pinyin", "hanViet", "confidence", "explanation"],
              },
            },
          },
          required: ["matches"],
        },
      },
    });

    const cleanText = response.text || "{}";
    const parsed = JSON.parse(cleanText.trim());
    res.json(parsed);
  } catch (error: any) {
    console.error("Lỗi nhận diện nét vẽ:", error);
    res.status(500).json({ error: error.message || "Hệ thống AI không thể nhận diện lúc này." });
  }
});

// Endpoint 3: Generate customized study advice/daily smart reminders
app.post("/api/daily-tips", async (req, res) => {
  try {
    const { targetLevel } = req.body; // e.g. "Tiểu học", "Phẩm cấp", v.v.

    const prompt = `Hãy soạn một thông điệp nhắc nhở học tập hàng ngày ngắn gọn, súc tích và khơi dậy đam mê chinh phục 214 Bộ thủ chữ Hán phồn thể.
Chọn ngẫu nhiên một bộ thủ bất kỳ làm "Ngôi sao hôm nay" (ví dụ: Bộ Thủy 氵, Bộ Tâm 忄, hay bộ Phong 风, bộ Y 衤) kể câu chuyện cực kỳ sống động 1 bản ghép nghĩa từ thú vị của nó.
Hướng dẫn người học cách nhìn bộ thủ đó đoán nghĩa của từ ghép một cách đơn giản, đầy văn thơ thư pháp.
Chiều dài khoảng 4-5 câu văn thanh nhã. Ngôn ngữ: Tiếng Việt.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      },
    });

    res.json({ tip: response.text });
  } catch (error: any) {
    console.error("Lỗi sinh thông điệp thông minh:", error);
    // Return friendly local fallback to keep user experience smooth even without keys
    res.json({
      tip: "🌿 **Bộ thủ Hôm Nay: Bộ Hưu (Hưu ─ Nghỉ ngơi)**\n\nHãy quan sát chữ **休 (Hưu)**: Bên trái là bộ Nhân đứng (亻 ── nghĩa là con người), bên phải là bộ Mộc (木 ── nghĩa là cây xanh). Cổ nhân quan niệm, con người tựa vào bóng mát của cây chính là thời khắc thanh thản, an yên nhất để nghỉ dưỡng sức dồi dào. Ghi nhớ sâu sắc gốc rễ này sẽ giúp bạn dễ dàng đoán nghĩa hàng ngàn chữ ghép độc đáo khác!"
    });
  }
});

// Setup dev server vs production build asset rendering
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
