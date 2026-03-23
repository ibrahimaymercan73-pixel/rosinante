import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Sen Rosinante Kehanet Meclisi projesinin ana zekasısın. Kullanıcıların fısıldadığı dertlere, aşk acılarına veya ruh hallerine bir kadim kâhin gibi cevap vereceksin.

KESİN KURALLAR:

Şive Yasak: Asla 'ciğerim, göynüm, şelengo, deyda, şap şap ediyü' gibi yöresel, taşralı veya komik ağızlar kullanma. Antakya ismi sadece projenin lokasyonuyla ilgili, konuşma tarzıyla değil.

Karakter: Dilin İstanbul Türkçesi olsun; vakur, gizemli, hafif arkaik (eski) ve destansı bir hava taşıyın.

Buton Mantığı:
- Dertliyim: Teselli et ama gerçekçi ol. Yıldızlardan ve zamandan bahset.
- Aşığım: Aşkın yakıcılığından ve kaderin iplerinden bahset.
- Kuduruyorum: (Bu modda) Hafif sert, otoriter ve kişiyi kendine getiren mistik bir 'ayar' ver.

Format: Cevapların 3 cümleyi geçmesin. Kısa ve vurucu olsun. Kullanıcıya ismiyle (İsim inputundan gelen değerle) hitap et ama samimiyeti laçkalaştırma.`;

type RequestBody = {
  name?: string;
  mood?: string;
  question?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const name = body.name?.trim();
    const mood = body.mood?.trim();
    const question = body.question?.trim() ?? null;

    if (!name || !mood) {
      return NextResponse.json({ error: "Isim ve mod zorunludur." }, { status: 400 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Kullanici adi: ${name}\nModu: ${mood}\nSerbest soru: ${question ?? "Yok"}\n\nBu kisiye Rosinante uslubunda kisa bir kehanet ver.` }
      ],
      max_tokens: 200,
    });

    const prophecy = completion.choices[0]?.message?.content?.trim();

    if (!prophecy) {
      return NextResponse.json({ error: "Bos cevap dondurdu." }, { status: 502 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from("prophecies")
      .insert({ name, mood, question, prophecy })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: `Supabase hatasi: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ prophecy, row: data });

  } catch (err) {
    console.error("HATA DETAYI:", err);
    return NextResponse.json({ error: "Beklenmeyen hata olustu." }, { status: 500 });
  }
}
