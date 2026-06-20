import CameraContainer from "@/components/CameraContainer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FDF6E2] text-[#1A1A1A] p-6 relative overflow-hidden select-none">
      {/* Các hình khối trang trí trừu tượng phía sau (Abstract Shapes giống ảnh mẫu) */}
      <div className="absolute top-10 left-10 w-12 h-12 bg-[#3DBC93] border-4 border-black rounded-lg rotate-12 hidden md:block"></div>
      <div className="absolute bottom-20 right-10 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-[#FF6B6B] rotate-[45deg] hidden md:block"></div>
      <div className="absolute top-1/4 right-20 w-16 h-4 bg-black border border-black rotate-[-30deg] hidden md:block"></div>

      <div className="max-w-xl w-full text-center mb-8 z-10">
        {/* Khối tiêu đề đổ bóng cứng */}
        <div className="inline-block bg-[#FFDE4D] border-4 border-black px-6 py-3 rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4">
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-black uppercase font-mono">
            💤 ANTI-SLEEP LAB
          </h1>
        </div>
        <p className="text-black text-sm font-black uppercase font-mono tracking-wider mt-2">
          Hệ Thống Trợ Lý Cảnh Báo Ngủ Gật Real-time
        </p>
      </div>

      {/* Vùng hiển thị Camera */}
      <div className="w-full z-10">
        <CameraContainer />
      </div>
    </main>
  );
}