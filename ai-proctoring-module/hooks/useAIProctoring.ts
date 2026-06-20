"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";

export const useAIProctoring = (videoElement: HTMLVideoElement | null, isActive: boolean) => {
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [violationReason, setViolationReason] = useState<string>("");
  
  const requestRef = useRef<number | null>(null);
  const drowsinessStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    async function initExtension() {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
        );
        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: "/models/face_landmarker.task",
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

  const predictLoop = useCallback(() => {
    if (!videoElement || !faceLandmarker || !isActive) return;

    if (videoElement.readyState >= 2) {
      const nowInMs = Date.now();
      const result = faceLandmarker.detectForVideo(videoElement, nowInMs);

      let isFrameViolation = false;
      let currentReason = "";
      let requiredDelay = 1500; 

      if (result.faceLandmarks && result.faceLandmarks.length > 0) {
        const landmarks = result.faceLandmarks[0];

        // Mốc chuẩn: Mũi (4), Tai trái (234), Tai phải (454)
        const nose = landmarks[4];
        const leftCheek = landmarks[234];
        const rightCheek = landmarks[454];

        const distToLeft = Math.abs(nose.x - leftCheek.x);
        const distToRight = Math.abs(nose.x - rightCheek.x);
        const ratio = distToLeft / distToRight;

        // Điểm mốc mí mắt trên và dưới
        const topEye = landmarks[159];
        const bottomEye = landmarks[145];
        const eyeOpenDistance = Math.abs(topEye.y - bottomEye.y);

        // --- ĐIỀU CHỈNH ĐỘ NHẠY TOÁN HỌC ---
        // 1. Nới rộng tỉ lệ quay đầu từ (0.6 - 1.7) sang (0.5 - 2.0) để bớt nhạy khi dịch chuyển đầu nhẹ
        if (ratio > 2.0 || ratio < 0.5) {
          isFrameViolation = true;
          currentReason = "Quay mặt ra ngoài màn hình";
          requiredDelay = 2000; // Cho phép quay đi tối đa 2 giây (để nhìn gương, nhìn taplo...)
        } 
        // 2. Hạ thấp khoảng cách mở mắt xuống 0.012 (Nhắm mắt hẳn hoặc gục sâu đầu mới dính)
        else if (eyeOpenDistance < 0.012) {
          isFrameViolation = true;
          currentReason = "Nhắm mắt hoặc không nhìn vào màn hình";
          requiredDelay = 1200; // Nhắm mắt quá 1.2 giây liên tục mới coi là ngủ gật (bỏ qua chớp mắt)
        }
      } else {
        // Không tìm thấy khuôn mặt nào trong khung hình (Có thể đã gục hẳn ra ngoài cam)
        isFrameViolation = true;
        currentReason = "Không tìm thấy khuôn mặt trong camera";
        requiredDelay = 2000; // Rời cam hoặc gục hẳn quá 2 giây mới báo động
      }

      // --- LOGIC BỘ ĐỆM THỜI GIAN (CHỐNG BÁO GIẢ) ---
      if (isFrameViolation) {
        // Nếu mới bắt đầu bị lỗi ở khung hình này, bấm giờ
        if (drowsinessStartTimeRef.current === null) {
          drowsinessStartTimeRef.current = Date.now();
        }

        const elapsed = Date.now() - drowsinessStartTimeRef.current;

        // Chỉ khi thời gian vi phạm liên tục vượt quá giới hạn an toàn thì mới đổi State phát báo động
        if (elapsed > requiredDelay) {
          setIsFocused(false);
          setViolationReason(currentReason);
        }
      } else {
        // Nếu khung hình này tỉnh táo bình thường, xóa bộ đếm ngay lập tức
        drowsinessStartTimeRef.current = null;
        setIsFocused(true);
        setViolationReason("");
      }
    }

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

  return { isFocused, gazeViolationReason: violationReason, modelReady: !!faceLandmarker };
};