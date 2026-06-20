# 💤 ANTI-SLEEP LAB — REAL-TIME DROWSINESS DETECTOR

> Một ứng dụng trợ lý thông minh giúp phát hiện và cảnh báo nguy cơ ngủ gật theo thời gian thực (Real-time) ngay trên trình duyệt máy tính hoặc điện thoại. Dự án được tối ưu hóa chạy hoàn toàn ở phía người dùng (Client-side), đảm bảo tính bảo mật tuyệt đối về mặt hình ảnh.

🎨 **Phong cách thiết kế:** Neo-brutalism / Pop-art (Đổ bóng cứng, viền thô cá tính, đồng bộ hóa trải nghiệm đồ họa truyện tranh thay vì giao diện công nghệ khô khan).

🚀 **Trải nghiệm trực tuyến ngay tại đây:** [https://mini-proj-anti-sleep.vercel.app/](https://mini-proj-anti-sleep.vercel.app/)

---

## ⚡ Các Tính Năng Nổi Bật

* **Phát hiện nhắm mắt (Drowsiness Detection):** Phân tích khoảng cách mí mắt dưới hệ tọa độ không gian. Tự động kích hoạt bộ đệm thời gian trễ (Debounce 1.2 giây) để loại bỏ hiện tượng báo động giả khi người dùng chớp mắt tự nhiên.
* **Giám sát vị trí đầu (Head Gaze Tracking):** Tính toán tỷ lệ khoảng cách toán học từ mũi đến hai bên rìa má để nhận biết người dùng có đang gục đầu, quay mặt đi nơi khác hoặc rời khỏi vị trí camera quá 2 giây hay không.
* **Giao diện độc bản (Neo-brutalism UI):** Sử dụng các gam màu pop-art tương phản mạnh, nút bấm hiệu ứng lún 3D thực tế và hệ thống icon nét dầy (`stroke-[3]`) đồng bộ hóa từ thư viện `lucide-react`.
* **Tối ưu hiệu năng:** Chạy mượt mà ở tốc độ 30-60 FPS nhờ tận dụng tối đa sức mạnh phần cứng GPU của thiết bị người dùng thông qua cơ chế WebAssembly (WASM).

---

## 🛠️ Công Nghệ Sử Dụng

Dự án là sự kết hợp của các công cụ phát triển Front-end hiện đại và lõi thị giác máy tính:

* **Framework:** Next.js 14+ (App Router) & TypeScript.
* **AI Core:** Google MediaPipe Vision Tasks (`@mediapipe/tasks-vision`) - Model: `face_landmarker.task`.
* **Style:** Tailwind CSS (Custom borders & hard-shadows).
* **Icons:** Lucide React.
* **Deployment:** Vercel Edge Network.

---

## 📦 Hướng Dẫn Cài Đặt Dưới Local

Nếu bạn muốn tải mã nguồn này về máy để phát triển thêm, hãy làm theo các bước sau:

1. **Clone project về máy:**
   ```bash
   git clone https://github.com/HongNhienTran/MiniProjAI_AIProctoringModule.git
   cd ai-proctoring-module
