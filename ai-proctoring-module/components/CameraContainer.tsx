"use client";

import React, { useEffect } from "react";
import { useWebcam } from "@/hooks/useWebcam";

export default function CameraContainer() {
  const { videoRef, isActive, error, startCamera, stopCamera } = useWebcam();

  // Tự động tắt camera khi component này bị unmount khỏi màn hình (tránh ngốn pin/ram)
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="flex flex-col items-center p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl w-full max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-emerald-400 mb-4 tracking-wide font-mono">
        📷 LIVE WEBCAM STREAM
      </h2>

      {/* Khung hiển thị Camera */}
      <div className="relative w-full aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-600 flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isActive ? "scale-x-[-1]" : ""}`} // Lật gương video cho tự nhiên
        />

        {/* Trạng thái khi chưa bật Cam */}
        {!isActive && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-mono">
            Camera đang tắt. Nhấn nút "Bật Camera" bên dưới.
          </div>
        )}

        {/* Thông báo Lỗi nếu có */}
        {error && (
          <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-red-400 font-bold mb-2">⚠️ Lỗi hệ thống</span>
            <p className="text-xs text-red-300 font-mono max-w-xs">{error}</p>
          </div>
        )}
      </div>

      {/* Khu vực nút bấm điều khiển */}
      <div className="flex gap-4 mt-6 w-full">
        {!isActive ? (
          <button
            onClick={startCamera}
            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold font-mono rounded-lg transition duration-200 shadow-md active:scale-95"
          >
            BẬT CAMERA
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