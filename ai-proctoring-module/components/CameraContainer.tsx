"use client";

import React, { useEffect, useState } from "react";
import { useWebcam } from "@/hooks/useWebcam";
import { useAIProctoring } from "@/hooks/useAIProctoring";

export default function CameraContainer() {
  const { videoRef, isActive, error, startCamera, stopCamera } = useWebcam();
  
  // Truyền trạng thái video vào hook AI
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const { isFocused, violationReason, modelReady } = useAIProctoring(videoEl, isActive);

  useEffect(() => {
    if (videoRef.current) {
      setVideoEl(videoRef.current);
    }
  }, [videoRef, isActive]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="flex flex-col items-center p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-xl font-bold text-emerald-400 tracking-wide font-mono">
          📷 AI PROCTORING STREAM
        </h2>
        {/* Trạng thái tải Model AI */}
        <span className={`text-xs px-2 py-1 rounded font-mono ${modelReady ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}`}>
          {modelReady ? "● AI READY" : "○ LOADING AI..."}
        </span>
      </div>

      {/* Khung hiển thị Camera */}
      <div className="relative w-full aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-600 flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isActive ? "scale-x-[-1]" : ""}`}
        />

        {/* Overlay Cảnh báo mất tập trung */}
        {isActive && !isFocused && (
          <div className="absolute top-4 left-4 right-4 bg-red-600/90 text-white px-4 py-2 rounded-lg text-center font-bold font-mono text-sm shadow-lg animate-bounce">
            ⚠️ VI PHẠM: {violationReason.toUpperCase()}
          </div>
        )}

        {/* Trạng thái khi chưa bật Cam */}
        {!isActive && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-mono">
            Camera đang tắt. Nhấn nút "Bật Camera" bên dưới.
          </div>
        )}

        {/* Thông báo Lỗi phần cứng nếu có */}
        {error && (
          <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-red-400 font-bold mb-2">⚠️ Lỗi hệ thống</span>
            <p className="text-xs text-red-300 font-mono max-w-xs">{error}</p>
          </div>
        )}
      </div>

      {/* Thông số Real-time bên dưới camera */}
      {isActive && (
        <div className="w-full mt-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700/50 flex justify-between items-center">
          <span className="text-xs font-mono text-slate-400">Trạng thái chú ý:</span>
          <span className={`text-sm font-bold font-mono ${isFocused ? "text-emerald-400" : "text-red-400"}`}>
            {isFocused ? "STABLE (TẬP TRUNG)" : "VIOLATION (CẢNH BÁO)"}
          </span>
        </div>
      )}

      {/* Khu vực nút bấm điều khiển */}
      <div className="flex gap-4 mt-4 w-full">
        {!isActive ? (
          <button
            onClick={startCamera}
            disabled={!modelReady} // Chỉ cho phép bật khi AI đã load xong cấu hình
            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold font-mono rounded-lg transition duration-200 shadow-md active:scale-95"
          >
            {modelReady ? "BẬT CAMERA GIÁM SÁT" : "ĐANG TẢI AI CHỜ CHÚT..."}
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold font-mono rounded-lg transition duration-200 shadow-md active:scale-95"
          >
            TẮT CAMERA
          </button>
        )}
      </div>
    </div>
  );
}