import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // Convert info to JSON if it's a string
   

    const { data, error } = await supabase
      .from("endpoints")
      .update({
        secret_webhook: secretWebhook(),
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error editing endpoint:", error);
      return NextResponse.json(
        { error: "Database update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ updated: data });
  } catch (err) {
    console.error("Error editing endpoint:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
function secretWebhook(): string {
  return `orbital-${crypto.randomUUID()}`;
}

