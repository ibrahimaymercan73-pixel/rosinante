"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

type ProphecyRow = {
  id: string;
  name: string;
  mood: string;
  question: string | null;
  prophecy: string;
  created_at: string;
};

export default function EkranPage() {
  const [items, setItems] = useState<ProphecyRow[]>([]);
  const supabase = useMemo(() => getSupabaseClient(), []);
  const configError = !supabase
    ? "Supabase ayarlari eksik. NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanimlanmali."
    : null;

  useEffect(() => {
    let mounted = true;
    if (!supabase) return;
    const sb = supabase;

    async function loadInitial() {
      const { data } = await sb
        .from("prophecies")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);

      if (mounted && data) {
        setItems(data as ProphecyRow[]);
      }
    }

    loadInitial();

    const channel = sb
      .channel("prophecies-ekran-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "prophecies" },
        (payload) => {
          const next = payload.new as ProphecyRow;
          setItems((prev) => [next, ...prev].slice(0, 30));
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      void sb.removeChannel(channel);
    };
  }, [supabase]);

  const latest = items[0];
  const older = items.slice(1, 10);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-amber-100 font-serif">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(180,83,9,0.25)_0%,_rgba(0,0,0,0.95)_65%)]" />
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />

      <section className="relative z-10 min-h-screen grid grid-rows-[auto_1fr_auto] p-10 md:p-14">
        <header className="flex items-center justify-between text-amber-400/80">
          <p className="text-lg md:text-2xl tracking-[0.35em] uppercase font-black">Rosinante</p>
          <p className="text-sm md:text-base tracking-[0.25em] uppercase">Canli Kehanet Ekrani</p>
        </header>

        <div className="flex items-center justify-center">
          {latest ? (
            <article className="w-full max-w-6xl rounded-[2.5rem] border-2 border-amber-900/40 bg-zinc-950/65 backdrop-blur-xl p-8 md:p-16 shadow-[0_0_120px_rgba(180,83,9,0.22)] animate-[fadeIn_700ms_ease-out]">
              <p className="text-center text-amber-500 tracking-[0.4em] uppercase text-sm md:text-base">
                Son Kehanet
              </p>
              <h1 className="mt-4 text-center text-3xl md:text-6xl font-black tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-700 uppercase">
                {latest.name} • {latest.mood}
              </h1>
              <p className="mt-8 text-center text-4xl md:text-7xl leading-tight font-black text-amber-100 drop-shadow-[0_0_20px_rgba(251,191,36,0.25)]">
                {latest.prophecy}
              </p>
            </article>
          ) : (
            <article className="w-full max-w-4xl rounded-3xl border border-amber-900/40 bg-zinc-950/50 p-10 text-center">
              <p className="text-3xl md:text-5xl text-amber-200">
                {configError ?? "Yeni kehanet bekleniyor..."}
              </p>
            </article>
          )}
        </div>

        <footer className="grid grid-cols-1 md:grid-cols-3 gap-3 opacity-35">
          {older.map((item) => (
            <article key={item.id} className="rounded-xl border border-amber-900/30 bg-zinc-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
                {item.name} • {item.mood}
              </p>
              <p className="mt-2 text-lg text-amber-100/80 line-clamp-3">{item.prophecy}</p>
            </article>
          ))}
        </footer>
      </section>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  );
}
