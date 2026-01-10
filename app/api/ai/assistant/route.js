import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/chat
 * Body: { messages: [{ role: "user" | "assistant", content: string }] }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Formato de mensajes inválido" },
        { status: 400 }
      );
    }

    // 🔒 System prompt SOLO en backend
    const systemMessage = {
      role: "system",
      content: `
Eres un asistente IA experto en desarrollo web y JavaScript.
Respondes SIEMPRE en español.
Sé claro, conciso y directo.
Si el usuario pregunta algo técnico, da ejemplos cuando sea útil.
No inventes información.
Si el usuario pide ayuda para crear un JSON Schema, proporciónalo en formato JSON válido. y sin comentarios adiccionales solo el esqueama
      `.trim(),
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [systemMessage, ...messages],
    });

    const aiMessage = completion.choices?.[0]?.message?.content;

    return NextResponse.json({
      message: aiMessage ?? "No se pudo generar una respuesta",
    });
  } catch (error) {
    console.error("OpenAI error:", error);

    return NextResponse.json(
      { error: "Error al comunicarse con OpenAI" },
      { status: 500 }
    );
  }
}
