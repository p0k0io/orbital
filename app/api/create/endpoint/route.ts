import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId, name, payloadJson } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Missing name" }, { status: 400 });
    }

    if (!payloadJson) {
      return NextResponse.json({ error: "Missing payloadJson" }, { status: 400 });
    }

    // Insertar en BD
    const { data, error } = await supabase
      .from("endpoints")
      .insert([
        {
          id_user: userId,
          name: name.trim(),
          info: payloadJson, // JSON string
          secret_webhook: secretWebhook(),
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Error inserting endpoint:", error);
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }

    // Construir URL pública
    const publicUrl = `http://127.0.0.1/${data.id}`;

    return NextResponse.json({
      id: data.id,
      url: publicUrl,
    });
  } catch (err) {
    console.error("Error creating endpoint:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
function secretWebhook(): string {
  return `orbital-${crypto.randomUUID()}`;
}

