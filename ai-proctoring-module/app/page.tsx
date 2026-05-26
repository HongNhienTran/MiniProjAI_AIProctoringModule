import CameraContainer from "@/components/CameraContainer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-6">
      <div className="max-w-2xl w-full text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
          AI PROCTORING LAB
        </h1>
        <p className="text-slate-400 text-sm font-mono">
          Giai đoạn 1: Cấu hình hệ thống & Kết nối Camera thành công
        </p>
      </div>

      <CameraContainer />
    </main>
  );
}