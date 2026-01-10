import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function POST(req: Request) {
  try {

    const { userId, name } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Missing name for API key" }, { status: 400 });
    }

    const apiKey = crypto.randomUUID();

    const prefix = apiKey.slice(0, 8); 

    // Hash (SHA-256)
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(apiKey)
    );

    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const { error } = await supabase.from("api_keys").insert([
      {
        key_hash: hashHex,
        id_user: userId,
        name: name,
        pre: prefix, 
      },
    ]);

    if (error) {
      console.error("Error inserting API key:", error);
      return NextResponse.json({ error: "Database insert failed" }, { status: 500 });
    }

    // Respuesta final
    return NextResponse.json({ apiKey, prefix });
  } catch (err: any) {
    console.error("Error creating API key:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
