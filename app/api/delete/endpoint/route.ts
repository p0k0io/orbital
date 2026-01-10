import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const { error } = await supabase
      .from("endpoints")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting endpoint:", error);
      return NextResponse.json(
        { error: "Database delete failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error("Error deleting endpoint:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
