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
      return new Response(
        JSON.stringify({ error: "Missing userId" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .select("plan")
      .eq("id_user", userId)
      .single();

    if (error) {
      console.error("Error fetching user plan:", error);
      return new Response(
        JSON.stringify({ error: "Database fetch failed" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ plan: data?.plan || null }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Error getting user plan:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
