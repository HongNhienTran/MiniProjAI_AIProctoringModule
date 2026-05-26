"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";

export const useAIProctoring = (videoElement: HTMLVideoElement | null, isActive: boolean) => {
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [violationReason, setViolationReason] = useState<string>("");
  const requestRef = useRef<number | null>(null);

  // 1. Khởi tạo bộ nhận diện khuôn mặt của MediaPipe
  useEffect(() => {
    async function initExtension() {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
        );
        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: "/models/face_landmarker.task", // Đường dẫn tới file bạn vừa tải về
            delegate: "GPU",
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        });
        setFaceLandmarker(landmarker);
        console.log("MediaPipe Face Landmarker đã sẵn sàng!");
      } catch (error) {
        console.error("Lỗi khởi tạo MediaPipe:", error);
      }
    }
    initExtension();
  }, []);

  // 2. Thuật toán phân tích khung hình (Vòng lặp Real-time)
  const predictLoop = useCallback(() => {
    if (!videoElement || !faceLandmarker || !isActive) return;

    if (videoElement.readyState >= 2) {
      const nowInMs = Date.now();
      const result = faceLandmarker.detectForVideo(videoElement, nowInMs);

      if (result.faceLandmarks && result.faceLandmarks.length > 0) {
        const landmarks = result.faceLandmarks[0];

        // --- THUẬT TOÁN ĐÁNH GIÁ SỰ TẬP TRUNG ---
        // Điểm mốc chuẩn: Mũi (4), Tai trái (234), Tai phải (454)
        const nose = landmarks[4];
        const leftCheek = landmarks[234];
        const rightCheek = landmarks[454];

        // Tính khoảng cách tương đối từ mũi đến 2 bên má để đoán hướng quay đầu
        const distToLeft = Math.abs(nose.x - leftCheek.x);
        const distToRight = Math.abs(nose.x - rightCheek.x);
        const ratio = distToLeft / distToRight;

        // Điểm mốc mắt để đo độ mở/nhắm (Chống gian lận cúi đầu ngủ gật)
        const topEye = landmarks[159];
        const bottomEye = landmarks[145];
        const eyeOpenDistance = Math.abs(topEye.y - bottomEye.y);

        let focused = true;
        let reason = "";

        // Nếu tỷ lệ lệch quá nhiều (> 1.7 hoặc < 0.6) tức là đang quay mặt sang trái/phải quá mức
        if (ratio > 1.7 || ratio < 0.6) {
          focused = false;
          reason = "Quay mặt ra ngoài màn hình";
        } 
        // Nếu khoảng cách mắt quá hẹp (< 0.015) nghĩa là đang nhắm mắt hoặc cúi gầm mặt xuống
        else if (eyeOpenDistance < 0.015) {
          focused = false;
          reason = "Nhắm mắt hoặc không nhìn vào màn hình";
        }

        setIsFocused(focused);
        setViolationReason(focused ? "" : reason);
      } else {
        // Không tìm thấy khuôn mặt nào trong khung hình
        setIsFocused(false);
        setViolationReason("Không tìm thấy khuôn mặt trong camera");
      }
    }

    // Tiếp tục gọi khung hình tiếp theo
    requestRef.current = requestAnimationFrame(predictLoop);
  }, [videoElement, faceLandmarker, isActive]);

  // 3. Quản lý vòng lặp chạy/dừng
  useEffect(() => {
    if (isActive && faceLandmarker && videoElement) {
      requestRef.current = requestAnimationFrame(predictLoop);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isActive, faceLandmarker, videoElement, predictLoop]);

  return { isFocused, violationReason, modelReady: !!faceLandmarker };
};