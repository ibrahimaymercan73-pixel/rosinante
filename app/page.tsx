"use client";
import { useState } from "react";

export default function Home() {
  const [isim, setIsim] = useState("");
  const [mod, setMod] = useState("Dertliyim");
  const [soru, setSoru] = useState("");
  const [cevap, setCevap] = useState("");
  const [loading, setLoading] = useState(false);

  const sor = async () => {
    if (!isim) return alert("Adını bahşet asil şövalye!");
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        body: JSON.stringify({ isim, mod, soru }),
      });
      const data = await res.json();
      setCevap(data.cevap);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] flex flex-col items-center justify-center p-6 font-serif selection:bg-amber-900/50 overflow-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-900/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-900/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* HAREKETLİ AT SİLÜETİ SECTION */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-32 h-32 mb-4 group">
            {/* Atın Arkasındaki Parlama */}
            <div className="absolute inset-0 bg-amber-600/20 rounded-full blur-2xl animate-pulse"></div>

            {/* Hareketli At SVG */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className={`w-full h-full text-amber-500 transition-all duration-1000 ${loading ? "animate-bounce drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]" : "hover:scale-110"}`}
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 18c0-2 2-5 6-5s6 3 6 5m-2-10a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm4-2v4m3-2h-6" className="opacity-0" />
              <path d="M12 4c-2 0-4 1-5 3-1 2-1 4-1 4s-1 1-2 2c1 1 2 1 3 1h1c1 0 2-1 2-2 0-1 1-2 2-2h4c1 0 2-1 2-2s-1-2-2-2h-4Z" className="animate-[float_3s_ease-in-out_infinite]" />
              <path d="M10 14c-1 2-2 4-5 4M14 14c1 2 2 4 5 4" strokeDasharray="2 2" />
              {/* Basit ama etkili at silüeti yolu */}
              <path d="M3 20c1-2 2-8 7-8h2c4 0 5-2 6-5 1-2 3-2 4-1 0 2-1 4-3 5h-3c-1 0-2 1-2 3 0 2-1 5-4 6H3Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.5" className="animate-wiggle" />
            </svg>
          </div>

          <h1 className="text-6xl font-light tracking-[0.2em] uppercase mb-1 text-center bg-clip-text text-transparent bg-gradient-to-b from-amber-100 to-amber-700 font-black">
            ROSINANTE
          </h1>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-600 to-transparent mb-2"></div>
          <p className="text-[10px] tracking-[0.5em] text-amber-600/60 uppercase">Kehanet Meclisi</p>
        </div>

        {/* ANA FORM KARTI */}
        <div className="bg-gradient-to-b from-zinc-900/80 to-black/80 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 shadow-2xl border-t-white/10">
          <div className="space-y-8">
            {/* İsim Girişi */}
            <div className="relative group">
              <input
                type="text"
                className="w-full bg-transparent border-b border-zinc-800 py-4 outline-none focus:border-amber-600 transition-colors text-xl font-light placeholder:text-zinc-700"
                placeholder="İsminiz nedir?"
                onChange={(e) => setIsim(e.target.value)}
              />
              <span className="absolute bottom-0 left-0 h-[1px] bg-amber-600 w-0 group-focus-within:w-full transition-all duration-500"></span>
            </div>

            {/* Mod Seçimi */}
            <div className="flex flex-wrap gap-3 justify-center">
              {["Dertliyim", "Aşığım", "Hesap Ödeyeceğim", "Kuduruyorum"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMod(m)}
                  className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 border ${mod === m ? "bg-amber-600 border-amber-500 text-black font-bold" : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-500"}`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Soru Alanı */}
            <textarea
              className="w-full bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5 outline-none focus:border-amber-600/50 transition-all text-sm h-24 resize-none placeholder:text-zinc-700"
              placeholder="Rosinante'ye bir soru fısılda..."
              onChange={(e) => setSoru(e.target.value)}
            />

            {/* BUTON */}
            <button
              onClick={sor}
              disabled={loading}
              className="w-full group relative py-6 bg-amber-600 rounded-2xl overflow-hidden transition-all active:scale-95 shadow-[0_15px_30px_-10px_rgba(217,119,6,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative text-black font-black tracking-[0.3em] text-xs uppercase">
                {loading ? "Ruhlarla Konuşuluyor..." : "KADERİ ÇAĞIR"}
              </span>
            </button>
          </div>
        </div>

        {/* KEHANET CEVABI */}
        {cevap && (
          <div className="mt-10 animate-[fadeIn_1s_ease-out]">
            <div className="relative p-10 bg-gradient-to-br from-zinc-900 to-black rounded-[40px] border border-amber-600/20 shadow-inner">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] px-6 py-2 border border-amber-600/30 rounded-full">
                <span className="text-[10px] text-amber-600 uppercase tracking-[0.3em] font-bold">Kehanet Buyurdu</span>
              </div>
              <p className="text-2xl italic leading-relaxed text-amber-100/90 text-center font-light leading-snug">
                &quot;{cevap}&quot;
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(-5deg);
          }
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: scaleX(1);
          }
          50% {
            transform: scaleX(1.05);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        body {
          background-color: #0a0a0a;
        }
      `}</style>
    </div>
  );
}
