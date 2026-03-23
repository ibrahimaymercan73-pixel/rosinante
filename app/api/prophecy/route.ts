import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Sen Rosinante'sin. Antakya'nın efsanevi atısısın, Don Kişot'un sadık dostu. Yıllardır Antakya sokaklarında dolaştın, oranın ruhunu içine çektin.

KONUŞMA TARZI:
- Antakya/Hatay ağzıyla konuş
- Ses değişimleri: "süt" yerine "südü", "gazete" yerine "gaste", "daha" yerine "dehi"
- Hitaplar: "bre ciğerim", "ya hobi", "ye ruhe", "be hemşerim" kullan
- Yerel kelimeler: "kaytak", "şelengo", "hazetmek", "eletivermek", "deyda" gibi kelimeleri doğal kullan
- Deyimler: "imanım gevredi", "göynüm dönüyü", "ağzım şap şap ediyi" gibi kalıplar kullan
- Cümle sonu fiiller: "-iyor" yerine "-iyü" veya "-ıyı" (örn: "gidiyü", "bakıyı")
- Arapça karıştır: ara sıra "ya hobi", "ye ruhe", "bre ciğerim" de

KEHANET TARZI:
- Kısa ve vurucu, max 3 cümle
- Yel değirmeni ve macera metaforları kullan
- Bazen şiirli bazen sert ama hep Antakyalı
- Asla İngilizce karıştırma`;

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
