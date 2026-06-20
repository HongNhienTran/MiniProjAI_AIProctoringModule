"use client";

import React, { useEffect, useState } from "react";
import { useWebcam } from "@/hooks/useWebcam";
import { useAIProctoring } from "@/hooks/useAIProctoring";
// Import các icon cá tính từ thư viện Lucide
import { Video, VideoOff, ShieldAlert, Sparkles, Zap, Power, Flame } from "lucide-react";

export default function CameraContainer() {
  const { videoRef, isActive, error, startCamera, stopCamera } = useWebcam();
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  
  const { isFocused, gazeViolationReason, modelReady } = useAIProctoring(videoEl, isActive);

  useEffect(() => {
    if (videoRef.current) setVideoEl(videoRef.current);
  }, [videoRef, isActive]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-xl mx-auto flex flex-col items-center select-none">
      
      {/* Header của Khung Camera */}
      <div className="flex justify-between items-center w-full mb-4 border-b-4 border-black pb-4">
        <div className="flex items-center gap-2">
          {isActive ? (
            <Video className="w-5 h-5 text-[#3DBC93] stroke-[3]" />
          ) : (
            <VideoOff className="w-5 h-5 text-gray-400 stroke-[2.5]" />
          )}
          <span className="text-sm font-black uppercase tracking-wider font-mono text-black">
            {isActive ? "LIVE MONITORING" : "SCANNER OFF"}
          </span>
        </div>
        
        <span className={`flex items-center gap-1.5 text-xs px-3 py-1 border-2 border-black font-black rounded-md ${modelReady ? "bg-[#3DBC93] text-black" : "bg-[#FFDE4D] text-black animate-pulse"}`}>
          <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
          {modelReady ? "AI READY" : "LOADING..."}
        </span>
      </div>

      {/* Khung chứa Video màn hình */}
      <div className="relative w-full aspect-video bg-[#F4EBD0] border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isActive ? "scale-x-[-1]" : ""}`}
        />

        {/* CẢNH BÁO POP-ART KHI NGỦ GẬT */}
        {isActive && !isFocused && (
          <div className="absolute inset-x-4 top-4 bg-[#FF6B6B] text-black border-4 border-black px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-black font-mono text-xs md:text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce z-20">
            <ShieldAlert className="w-5 h-5 stroke-[3] shrink-0" />
            <span>
              WARNING: {gazeViolationReason === "Nhắm mắt hoặc không nhìn vào màn hình" ? "BẠN ĐANG NHẮM MẮT!" : "RỜI VỊ TRÍ / GỤC ĐẦU!"}
            </span>
          </div>
        )}

        {/* Màn hình chờ khi tắt cam - Đậm chất minh họa */}
        {!isActive && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[#FDF6E2]">
            <div className="w-16 h-16 bg-[#FFDE4D] border-4 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-3">
              <Power className="w-8 h-8 text-black stroke-[3]" />
            </div>
            <p className="text-sm font-black uppercase font-mono text-black max-w-xs">
              Hệ thống đang nghỉ ngơi. Kích hoạt camera để bắt đầu quét!
            </p>
          </div>
        )}
      </div>

      {/* Thanh trạng thái dưới Camera dạng thanh sóng năng lượng */}
      {isActive && (
        <div className={`w-full mt-4 p-3 border-4 border-black rounded-xl flex justify-between items-center font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors duration-200 ${isFocused ? "bg-[#3DBC93]" : "bg-[#FF6B6B]"}`}>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-black stroke-[3] animate-pulse" />
            <span className="text-xs font-black text-black uppercase">Trạng thái cơ thể:</span>
          </div>
          <span className="text-sm font-black text-black uppercase tracking-tight">
            {isFocused ? "TỈNH TÁO 100%" : "DẬY BẠN ƠIIIII!"}
          </span>
        </div>
      )}

      {/* Nút bấm điều khiển kiểu 3D Neo-brutalism */}
      <div className="w-full mt-6">
        {!isActive ? (
          <button
            onClick={startCamera}
            disabled={!modelReady}
            className="w-full py-4 bg-[#FFDE4D] hover:bg-[#ffe675] disabled:bg-gray-300 text-black border-4 border-black font-black font-mono rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Flame className="w-5 h-5 text-black stroke-[3]" />
            {modelReady ? "KÍCH HOẠT CHỐNG NGỦ GẬT" : "ĐANG TẢI DỮ LIỆU AI..."}
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="w-full py-4 bg-[#FF6B6B] hover:bg-[#ff8585] text-black border-4 border-black font-black font-mono rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Power className="w-5 h-5 text-black stroke-[3]" />
            DỪNG GIÁM SÁT
          </button>
        )}
      </div>
    </div>
  );
}