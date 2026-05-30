import { useState, useEffect } from "react";
import { Bell, Sparkles, AlertCircle, Check, Play, Info, Settings, Calendar } from "lucide-react";
import { LeitnerProgress } from "../types";

interface DailyAdvisorProps {
  leitnerProgress: LeitnerProgress[];
}

export default function DailyAdvisor({ leitnerProgress }: DailyAdvisorProps) {
  const [reminderHour, setReminderHour] = useState("08:00");
  const [isReminderEnabled, setIsReminderEnabled] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState<string>("default");
  const [activeTab, setActiveTab] = useState<"advice" | "reminder">("advice");
  
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);
  const [errorTip, setErrorTip] = useState<string | null>(null);

  // Status banner mock triggers
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for configs
    const savedHour = localStorage.getItem("radical_reminder_hour");
    if (savedHour) setReminderHour(savedHour);

    const savedEnabled = localStorage.getItem("radical_reminder_enabled");
    if (savedEnabled !== null) setIsReminderEnabled(savedEnabled === "true");

    // Fetch browser notification permission
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    // Auto-fetch daily AI tip on start to welcome the user
    fetchDailyAITip();
  }, []);

  const handleToggleReminder = (enabled: boolean) => {
    setIsReminderEnabled(enabled);
    localStorage.setItem("radical_reminder_enabled", enabled ? "true" : "false");
    triggerStatusBanner(enabled ? "Đã bật nhắc nhở hàng ngày!" : "Đã hủy chu kỳ nhận nhắc nhở.");
  };

  const handleHourChange = (hour: string) => {
    setReminderHour(hour);
    localStorage.setItem("radical_reminder_hour", hour);
    triggerStatusBanner(`Đã cập nhật khung giờ nhắc nhở ôn tập thành công: ${hour}`);
  };

  const triggerStatusBanner = (msg: string) => {
    setBannerMessage(msg);
    setTimeout(() => setBannerMessage(null), 4000);
  };

  // Trigger immediate trial notification
  const handleTestNotification = () => {
    // Attempt standard browser notification if supported and granted
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Bộ Thủ Thư Pháp 📚", {
          body: `Đã đến giờ ôn tập 214 Bộ thủ chữ Hán. Hãy nhấp vào đây để phân tách chữ Hán thâm sâu hôm nay!`,
          icon: "/favicon.ico",
        });
        triggerStatusBanner("Đã bắn tín hiệu thông báo hệ thống qua trình duyệt!");
        return;
      } else if (Notification.permission === "default") {
        requestNotificationPermission();
        return;
      }
    }

    // Fallback beautiful slide-down visual banner overlay if browser blocks it
    triggerStatusBanner("🔔 [Thông báo Thử nghiệm] Giờ vàng học tập! Bộ thủ hôm nay đang vẫy gọi bạn rèn luyện.");
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
        if (permission === "granted") {
          triggerStatusBanner("Tuyệt vời! Bạn đã cấp quyền nhận thông báo học tập thành công.");
          // Send instant sample
          new Notification("Bộ Thủ Thư Pháp 📚", {
            body: "Chào mừng bạn đến với kênh học 214 bộ thủ chữ Hán phồn thể song phương!",
          });
        } else {
          triggerStatusBanner("Quyền bị từ chối. Nhắc nhở tiếp tục chạy dưới dạng cảnh báo trong ứng dụng.");
        }
      });
    } else {
      triggerStatusBanner("Trình duyệt hiện tại không hỗ trợ Web Notifications.");
    }
  };

  const fetchDailyAITip = async () => {
    setLoadingTip(true);
    setErrorTip(null);
    try {
      const response = await fetch("/api/daily-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetLevel: "Phổ thông" }),
      });

      if (!response.ok) throw new Error("Mất kết kết với dịch vụ cố vấn nhắc nhở.");

      const data = await response.json();
      if (data.tip) {
        setAiTip(data.tip);
      } else {
        throw new Error("Dữ liệu gợi ý rỗng.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorTip("Cố vấn AI đang thưởng trà. Hãy nhấp nút tải lại.");
    } finally {
      setLoadingTip(false);
    }
  };

  return (
    <div className="bg-amber-50/40 border border-amber-900/10 rounded-2xl p-5 shadow-sm space-y-4" id="daily-notification-panel">
      {/* Dynamic Slide Banner warning popup */}
      {bannerMessage && (
        <div className="bg-amber-950 text-amber-50 text-xs px-4 py-3 rounded-xl flex items-center justify-between shadow-lg border border-amber-800/25 animate-fade-in z-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-300 animate-bounce" />
            <span className="font-sans font-medium">{bannerMessage}</span>
          </div>
          <button onClick={() => setBannerMessage(null)} className="text-[10px] uppercase font-bold text-amber-300 ml-4 hover:underline cursor-pointer">
            Đóng
          </button>
        </div>
      )}

      {/* Sub-header navigation tabs */}
      <div className="flex border-b border-amber-900/10 pb-0.5 justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("advice")}
            className={`pb-2.5 px-3 text-xs font-sans font-bold flex items-center gap-1.5 transition-all relative cursor-pointer ${
              activeTab === "advice" ? "text-red-700" : "text-amber-900/50 hover:text-amber-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Cố vấn Mnemonic Hôm nay (AI)
            {activeTab === "advice" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-700"></span>}
          </button>

          <button
            onClick={() => setActiveTab("reminder")}
            className={`pb-2.5 px-3 text-xs font-sans font-bold flex items-center gap-1.5 transition-all relative cursor-pointer ${
              activeTab === "reminder" ? "text-red-700" : "text-amber-900/50 hover:text-amber-900"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Cài đặt Lịch báo Ôn tập
            {activeTab === "reminder" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-700"></span>}
          </button>
        </div>

        <span className="text-[10px] text-amber-800/60 font-mono hidden sm:inline-block">
          Sẵn sàng kết nối thông báo
        </span>
      </div>

      {/* Advice study tab contents */}
      {activeTab === "advice" && (
        <div className="space-y-3.5">
          {loadingTip ? (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-6 h-6 border-2 border-red-750 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-serif italic text-amber-900/70">Cố vấn AI đang viết lời khuyên thư pháp...</p>
            </div>
          ) : errorTip ? (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-2 bg-white/20 rounded-xl p-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-xs text-red-800 font-medium">{errorTip}</p>
              <button
                onClick={fetchDailyAITip}
                className="text-[10px] bg-red-700 hover:bg-red-800 text-white rounded-lg px-3 py-1 cursor-pointer transition-all"
              >
                Tải lại Lời khuyên
              </button>
            </div>
          ) : (
            aiTip && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-white border border-amber-950/10 p-4 rounded-xl relative overflow-hidden text-left shadow-sm">
                  <div className="absolute -right-3 -bottom-3 text-amber-900/5 select-none font-serif text-8xl">
                    印
                  </div>
                  <h4 className="text-xs font-bold text-red-800 flex items-center gap-1 mb-2 font-sans uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" />
                    Bí thuật chữ viết ngày {new Date().toLocaleDateString("vi-VN")}
                  </h4>
                  {/* Styled message rendering */}
                  <div className="text-xs leading-relaxed text-amber-950 px-0.5 space-y-2 font-sans">
                    {aiTip.split("\n").map((line, idx) => (
                      <p key={idx} className={line.startsWith("#") ? "font-bold text-red-900 font-serif text-sm mt-2 mb-1.5" : "text-justify"}>
                        {line.startsWith("**") ? <strong>{line.replace(/\*\*/g, "")}</strong> : line}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pr-1">
                  <button
                    onClick={fetchDailyAITip}
                    className="text-[10px] text-red-800 hover:text-red-700 flex items-center gap-1 bg-white hover:bg-amber-100/30 px-2.5 py-1.5 rounded-lg border border-amber-900/10 transition-colors shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-red-700 animate-spin-slow" />
                    Nhận câu chuyện bộ thủ khác từ AI
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Reminder settings tab contents */}
      {activeTab === "reminder" && (
        <div className="space-y-4 text-left animate-fade-in">
          <div className="bg-white border border-amber-900/10 p-4 rounded-xl shadow-sm space-y-4">
            {/* Hour and switch */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-xs font-semibold text-amber-950 block">Trạng thái nhắc học hàng ngày</span>
                <span className="text-[10px] text-amber-850/60 font-sans block mt-0.5">
                  Tận dụng phản xạ Leitner để báo thức học tập liên tiếp
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleReminder(!isReminderEnabled)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                    isReminderEnabled
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
                >
                  {isReminderEnabled ? "Đang bật" : "Đã Tắt"}
                </button>
              </div>
            </div>

            {/* Selecting hour config */}
            <div className="flex justify-between items-center pt-3 border-t border-amber-900/5">
              <div>
                <span className="text-xs font-semibold text-amber-950 block">Khung giờ ôn tập hiệu quả nhất</span>
                <span className="text-[10px] text-amber-850/60 font-sans block mt-0.5">
                  Phù hợp dập tắt quên lãng ngay khi thức dậy hoặc trước khi ngủ
                </span>
              </div>
              <input
                type="time"
                value={reminderHour}
                onChange={(e) => handleHourChange(e.target.value)}
                disabled={!isReminderEnabled}
                className="border border-amber-900/15 rounded-lg p-1.5 text-xs text-amber-950 bg-amber-50/20 shadow-inner block cursor-pointer disabled:opacity-50"
              />
            </div>

            {/* HTML5 Web Notification Status indicators */}
            <div className="bg-amber-100/20 border border-amber-900/5 p-3 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-amber-900/70 uppercase block mb-1">
                Quyền thông báo Trình duyệt:
              </span>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-amber-950 font-sans flex items-center gap-1">
                  {notificationPermission === "granted" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 block" />
                      Đã đồng ý thông báo đẩy hệ thống
                    </>
                  ) : notificationPermission === "denied" ? (
                    <>
                      <Info className="w-3.5 h-3.5 text-red-700 block" />
                      Bị từ chối. Web notifications đang chặn.
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 block" />
                      Chưa kích hoạt quyền đẩy đẩy
                    </>
                  )}
                </span>

                {notificationPermission !== "granted" && (
                  <button
                    onClick={requestNotificationPermission}
                    className="text-[10px] bg-amber-950 hover:bg-amber-900 text-amber-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Cấp quyền đẩy thông tin
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end p-1">
            <button
              onClick={handleTestNotification}
              className="py-2 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-sans font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-red-700/10 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              Chạy Thử tính năng Nhắc nhở
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
