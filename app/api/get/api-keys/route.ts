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
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("api_keys")
      .select("id_key,name, pre, created_at")
      .eq("id_user", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching API keys:", error);
      return NextResponse.json({ error: "Database fetch failed" }, { status: 500 });
    }

    return NextResponse.json({ keys: data || [] });
  } catch (err) {
    console.error("Error fetching API keys:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
