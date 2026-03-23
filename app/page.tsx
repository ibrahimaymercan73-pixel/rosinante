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
      const res = await fetch("/api/prophecy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: isim, mood: mod, question: soru }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Beklenmeyen hata olustu.");
      }
      setCevap(data.prophecy ?? "");
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Beklenmeyen hata olustu.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-[#e5e5e5] flex flex-col items-center justify-center p-6 font-serif selection:bg-amber-900/50 overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#1d2334_0%,#0c0f18_35%,#070809_70%,#050505_100%)]">
      {/* Atmospheric layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_30%_25%,rgba(74,95,142,0.22),transparent_50%),radial-gradient(circle_at_70%_65%,rgba(37,43,67,0.25),transparent_55%)]"></div>
        <div className="absolute -top-24 -left-20 w-[44rem] h-[44rem] rounded-full border border-amber-900/20 animate-[spin_160s_linear_infinite]"></div>
        <div className="absolute -bottom-40 -right-16 w-[40rem] h-[40rem] rounded-full border border-indigo-800/20 animate-[spinReverse_190s_linear_infinite]"></div>
        <div className="absolute left-[8%] top-[18%] w-[14rem] h-[14rem] opacity-15 animate-[spin_75s_linear_infinite] text-amber-600/60 text-8xl">✶</div>
        <div className="absolute right-[12%] bottom-[16%] w-[16rem] h-[16rem] opacity-10 animate-[spinReverse_90s_linear_infinite] text-indigo-300/40 text-9xl">☽</div>
        <div className="absolute -left-24 top-1/3 w-[34rem] h-[18rem] rounded-full bg-zinc-300/8 blur-[140px] animate-[drift_24s_ease-in-out_infinite]"></div>
        <div className="absolute right-[-8rem] bottom-1/4 w-[30rem] h-[16rem] rounded-full bg-indigo-200/8 blur-[130px] animate-[drift_30s_ease-in-out_infinite_reverse]"></div>
      </div>

      <div className="relative z-10 w-[90%] max-w-[400px] md:w-full md:max-w-xl">
        {/* HAREKETLİ AT SİLÜETİ SECTION */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4 group">
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

          <h1 className="text-4xl md:text-6xl font-light tracking-[0.14em] md:tracking-[0.2em] uppercase mb-1 text-center bg-clip-text text-transparent bg-gradient-to-b from-[#f7e8b2] via-[#d5a84a] to-[#6a4715] font-black drop-shadow-[0_3px_0_#3c280c] [text-shadow:0_2px_2px_rgba(0,0,0,0.65),0_0_30px_rgba(212,175,55,0.35)]">
            ROSINANTE
          </h1>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-600 to-transparent mb-2"></div>
          <p className="text-[10px] tracking-[0.5em] text-amber-600/60 uppercase">Kehanet Meclisi</p>
        </div>

        {/* ANA FORM KARTI */}
        <div className="relative bg-[linear-gradient(180deg,rgba(41,33,24,0.86),rgba(15,12,10,0.94))] backdrop-blur-2xl border border-[#5f4a2a] rounded-[40px] p-10 shadow-[0_25px_80px_rgba(0,0,0,0.65)]">
          <div className="pointer-events-none absolute inset-[1px] rounded-[39px] border border-amber-200/10"></div>
          <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_20%_15%,rgba(212,175,55,0.08),transparent_45%),radial-gradient(circle_at_80%_85%,rgba(112,84,35,0.12),transparent_48%)]"></div>
          <div className="pointer-events-none absolute inset-0 rounded-[40px] opacity-[0.08] bg-[url('https://www.transparenttextures.com/patterns/old-wall.png')]"></div>
          <div className="space-y-8">
            {/* İsim Girişi */}
            <div className="relative group">
              <input
                type="text"
                className="w-full bg-transparent border-b border-zinc-800 py-4 outline-none focus:border-amber-600 transition-colors text-[16px] md:text-xl font-light placeholder:text-zinc-700"
                placeholder="İsminiz nedir?"
                onChange={(e) => setIsim(e.target.value)}
              />
              <span className="absolute bottom-0 left-0 h-[1px] bg-amber-600 w-0 group-focus-within:w-full transition-all duration-500"></span>
            </div>

            {/* Mod Seçimi */}
            <div className="grid grid-cols-2 gap-3">
              {["Dertliyim", "Aşığım", "Hesap Ödeyeceğim", "Kuduruyorum"].map((m, index, arr) => (
                <button
                  key={m}
                  onClick={() => setMod(m)}
                  className={`px-5 py-2 rounded-[999px_999px_850px_850px] text-[10px] uppercase tracking-widest transition-all duration-500 border shadow-inner ${
                    mod === m
                      ? "bg-[linear-gradient(180deg,#8f6b31,#5c4017)] border-amber-400/70 text-amber-100 font-bold shadow-[0_0_22px_rgba(217,119,6,0.45),inset_0_0_18px_rgba(0,0,0,0.45)]"
                      : "bg-[linear-gradient(180deg,#221d19,#12100f)] border-zinc-700 text-zinc-400 hover:border-amber-700/70 hover:text-zinc-200"
                  } ${arr.length % 2 === 1 && index === arr.length - 1 ? "col-span-2" : ""}`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Soru Alanı */}
            <textarea
              className="w-full bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5 outline-none focus:border-amber-600/50 transition-all text-[16px] h-24 resize-none placeholder:text-zinc-700"
              placeholder="Rosinante'ye bir soru fısılda..."
              onChange={(e) => setSoru(e.target.value)}
            />

            {/* BUTON */}
            <button
              onClick={sor}
              disabled={loading}
              className="w-full group relative py-6 rounded-2xl overflow-hidden transition-all active:scale-95 shadow-[0_16px_35px_-12px_rgba(217,119,6,0.62)] bg-[linear-gradient(180deg,#ffd67a_0%,#d0922f_24%,#8b5a1c_65%,#5a3710_100%)] border border-amber-300/40"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_20%_30%,rgba(255,245,200,0.65),transparent_30%),radial-gradient(circle_at_80%_65%,rgba(255,220,140,0.35),transparent_35%)]"></div>
              <div className="pointer-events-none absolute -top-4 left-6 opacity-0 group-hover:opacity-90 transition-all duration-500 text-amber-100/80 text-xs tracking-widest">✶ ✦ ✶</div>
              <div className="pointer-events-none absolute -bottom-4 right-7 opacity-0 group-hover:opacity-90 transition-all duration-500 text-amber-100/70 text-xs tracking-widest">☽ ✶</div>
              <span className="relative text-black font-black tracking-[0.3em] text-xs uppercase [text-shadow:0_1px_0_rgba(255,255,255,0.35)]">
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
        @keyframes spinReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        @keyframes drift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(20px, -12px, 0) scale(1.06);
          }
        }
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
