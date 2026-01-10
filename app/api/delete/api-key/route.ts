import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

interface Database {
  api_keys: {
    key_hash: string;
    name: string;
    pre: string;
    created_at: string;
    id_user: string;
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { keyName} = body;

    if (!keyName) {
      return NextResponse.json(
        { error: "Missing keyName" },
        { status: 400 }
      );
    }

    // Eliminar la key
    const { error: deleteError } = await supabase
      .from("api_keys")
      .delete()
      .eq("id_key", keyName);

    if (deleteError) {
      console.error("Error deleting key:", deleteError);
      return NextResponse.json(
        { error: "Database delete failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting API key:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
