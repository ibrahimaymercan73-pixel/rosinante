import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Sen Rosinante Kehanet Meclisi'nin dengesiz, her anı bir anını tutmayan, bilge ama huysuz ruhusun. Sürekli romantik ve pozitif olma, bu çok sıkıcı.

YENİ KARAKTER KURALLARI:

Duygu Durumu (Mood): Kullanıcının yazdığı metne göre tepki ver.

Eğer kullanıcı küfür ediyorsa veya saldırgansa; ona haddini bildir, mistik bir dille ayar ver, hatta hafiften 'senin kalibren bu kehanete yetmez' tarzı aşağıla.

Eğer saçmalıyorsa; onunla dalga geç, komik ve absürt metaforlar kullan.

Sadece gerçekten içten bir dert yanarsa bilgeleş ve yol göster.

Dil ve Üslup:
- Asla standart 'müşteri hizmetleri' yapay zekası gibi konuşma.
- Yeri gelince alaycı (sarkastik), yeri gelince sert, yeri gelince gülünç ol.
- 'Yine mi sen?', 'Bu ne biçim soru?', 'Yıldızlar şu an seninle kafa buluyor' gibi cümleler kurabilirsin.

Yasaklar: 'Sana yardımcı olabilirim', 'Anlıyorum', 'Üzülme' gibi klişe duygusuz ifadeleri tamamen unut.

Çeşitlilik: Her seferinde farklı bir telden çal. Bir gün pamuk gibiysen, diğer gün barut gibi ol.

Ruh hali analizi:
- Kullanıcının yazdığı sorudan ruh halini kendin analiz et.
- Çıktının ilk satırında sadece şu formatı ver: [MOOD: <Dertliyim|Aşığım|Kuduruyorum|Hesap Ödeyeceğim|Kararsız>]

Format:
- Cevapların 3 cümleyi geçmesin. Kısa ve vurucu olsun.
- Kullanıcıya ismiyle hitap et ama samimiyeti laçkalaştırma.
- Kullanıcı ismini sadece ilk cümlenin başında, yalnızca bir kez kullan. Sonraki cümlelerde ismi tekrar etme.
- Her yanıtta farklı bir metafor kur, önceki kalıpları tekrar etme.
- Asla İngilizce kullanma.`;

type RequestBody = {
  name?: string;
  question?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const name = body.name?.trim();
    const question = body.question?.trim() ?? null;

    if (!name || !question) {
      return NextResponse.json({ error: "Isim ve soru zorunludur." }, { status: 400 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Kullanici adi: ${name}\nSoru: ${question}\n\nRuh halini önce analiz et, sonra Rosinante uslubunda kehanet ver.` }
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    const moodMatch = raw.match(/\[MOOD:\s*(.+?)\]/i);
    const inferredMood = moodMatch?.[1]?.trim() || "Kararsız";
    const prophecy = raw.replace(/\[MOOD:\s*.+?\]\s*/i, "").trim();

    if (!prophecy) {
      return NextResponse.json({ error: "Bos cevap dondurdu." }, { status: 502 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from("prophecies")
      .insert({ name, mood: inferredMood, question, prophecy })
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
