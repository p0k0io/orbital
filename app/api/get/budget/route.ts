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
      .from("users")
      .select("credits")
      .eq("id_user", userId)
      .single();

    if (error) {
      console.error("Error fetching budget (credit):", error);
      return NextResponse.json(
        { error: "Database fetch failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { credits: data?.credits ?? null },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error in budget endpoint:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
