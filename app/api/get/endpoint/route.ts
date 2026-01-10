import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("endpoints")
      .select("id, id_user, name, info, secret_webhook, created_at")
      .eq("id_user", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching endpoints:", error);
      return NextResponse.json(
        { error: "Database fetch failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ endpoints: data });
  } catch (err) {
    console.error("Error getting endpoints:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
