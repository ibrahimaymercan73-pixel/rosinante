import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = "Sen Antakya'nın eğlence mekanı Rosinante'nin bilge ve fırlama atısın. Don Kişot'un asil atısın ama yıllardır Antakya'da yaşadığın için yerel kültürü ve şiveyi iyi tanıyorsun. Kısa, vurucu, bazen şövalye bazen Antakyalı dost gibi cevap ver. Yel değirmeni, macera, asillik metaforları kullan. Max 3 cümle.";

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

    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY!,
    });

    const completion = await client.chat.completions.create({
      model: "openrouter/auto",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Kullanici adi: ${name}\nModu: ${mood}\nSerbest soru: ${question ?? "Yok"}\n\nBu kisiye Rosinante uslubunda kisa bir kehanet ver.` }
      ],
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
    const message =
      err instanceof Error ? err.message : "Beklenmeyen hata olustu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
