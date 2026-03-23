 "use client";
import { useState } from "react";

export default function Home() {
  const [isim, setIsim] = useState("");
  const [mod, setMod] = useState("Dertliyim");
  const [soru, setSoru] = useState("");
  const [cevap, setCevap] = useState("");
  const [loading, setLoading] = useState(false);
  const [hata, setHata] = useState("");

  const sor = async () => {
    setLoading(true);
    setHata("");
    setCevap("");

    try {
      const res = await fetch("/api/prophecy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: isim, mood: mod, question: soru }),
      });
      const data = (await res.json()) as { prophecy?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Beklenmeyen hata olustu.");
      }

      setCevap(data.prophecy ?? "");
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Beklenmeyen hata olustu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black text-amber-100 flex items-center justify-center p-4 font-serif">
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />

      <div className="relative w-full max-w-lg bg-zinc-900/80 backdrop-blur-xl border-2 border-amber-900/50 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(180,83,9,0.2)] overflow-hidden">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-full bg-amber-950/30 border border-amber-500/30 mb-4 animate-pulse">
            <span className="text-4xl">🐴</span>
          </div>
          <h1 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-700 uppercase">
            Rosinante Kehaneti
          </h1>
          <p className="text-amber-500/60 text-sm mt-2 italic">
            Don Kişot&apos;un kadim atı senin için kişniyor...
          </p>
        </div>

        <div className="space-y-6">
          <div className="group">
            <label className="block text-xs uppercase tracking-widest text-amber-600 mb-2 ml-1">
              Asil İsminiz
            </label>
            <input
              className="w-full bg-black/50 border border-amber-900/50 rounded-xl p-4 focus:outline-none focus:border-amber-500 transition-all text-amber-200 placeholder:text-zinc-700"
              placeholder="Örn: Şövalye İbrahim"
              onChange={(e) => setIsim(e.target.value)}
              value={isim}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-amber-600 mb-2 ml-1">
              Ruh Haliniz
            </label>
            <select
              className="w-full bg-black/50 border border-amber-900/50 rounded-xl p-4 focus:outline-none focus:border-amber-500 text-amber-200"
              onChange={(e) => setMod(e.target.value)}
              value={mod}
            >
              <option>Dertliyim</option>
              <option>Aşığım</option>
              <option>Hesap Ödeyeceğim</option>
              <option>Kuduruyorum</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-amber-600 mb-2 ml-1">
              Aklındaki Soru (Opsiyonel)
            </label>
            <textarea
              className="w-full bg-black/50 border border-amber-900/50 rounded-xl p-4 focus:outline-none focus:border-amber-500 text-amber-200 h-24 resize-none"
              placeholder="Kaderinde neyi merak edersin?"
              onChange={(e) => setSoru(e.target.value)}
              value={soru}
            />
          </div>

          <button
            onClick={sor}
            disabled={loading || !isim.trim()}
            className="w-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-black font-black py-5 rounded-xl uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(0,0,0,0.4)] disabled:opacity-50"
          >
            {loading ? "Rosinante Düşünüyor..." : "Kehaneti Al"}
          </button>

          <a
            href="/ekran"
            className="block text-center text-xs text-amber-700 underline uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity"
          >
            TV Ekranı (/ekran)
          </a>
        </div>

        {hata && <p className="mt-6 text-sm text-red-300 text-center">{hata}</p>}

        {cevap && (
          <div className="mt-10 animate-[fadeIn_1s_ease-in-out]">
            <div className="relative p-6 bg-amber-950/20 border border-amber-500/30 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-600" />
              <h3 className="text-amber-500 font-bold text-xs uppercase tracking-tighter mb-2">
                Rosinante Diyor Ki:
              </h3>
              <p className="text-lg italic text-amber-100/90 leading-relaxed shadow-sm">&quot;{cevap}&quot;</p>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
