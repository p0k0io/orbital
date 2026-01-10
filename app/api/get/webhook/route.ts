import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function POST(req: Request) {
  try {
    console.log("▶️ /api/get/webhook called");

    const body = await req.json();
    console.log("📦 Request body:", body);

    const { endpoint_id, page = 1, limit = 10 } = body;

    if (!endpoint_id) {
      console.error("❌ Missing endpoint_id");
      return new Response(
        JSON.stringify({ error: "Missing endpoint_id" }),
        { status: 400 }
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    console.log("📊 Pagination:", { page, limit, from, to });
    console.log("🔎 Filtering by endpoint_id:", endpoint_id);

    /* ------------------ PAGINATED LOGS ------------------ */
    const logsQuery = await supabase
      .from("webhooks")
      .select(
        "id_webhook, endpoint_id, status, http_status, retry_count, received_at, processed_at, error",
        { count: "exact" }
      )
      .eq("endpoint_id", endpoint_id)
      .order("received_at", { ascending: false })
      .range(from, to);

    console.log("📥 Logs query result:", logsQuery);

    if (logsQuery.error) {
      console.error("❌ Logs query error:", logsQuery.error);
      throw logsQuery.error;
    }

    /* ------------------ STATS ------------------ */
    const statsQuery = await supabase
      .from("webhooks")
      .select("status")
      .eq("endpoint_id", endpoint_id);

    console.log("📈 Stats query result:", statsQuery);

    if (statsQuery.error) {
      console.error("❌ Stats query error:", statsQuery.error);
      throw statsQuery.error;
    }

    const stats = {
      success: statsQuery.data.filter((w) => w.status === "success").length,
      failed: statsQuery.data.filter((w) => w.status !== "success").length,
    };

    console.log("✅ Computed stats:", stats);

    return new Response(
      JSON.stringify({
        webhooks: logsQuery.data,
        total: logsQuery.count,
        stats,
        debug: {
          endpoint_id,
          page,
          limit,
          from,
          to,
          rowsReturned: logsQuery.data?.length ?? 0,
          totalRows: logsQuery.count,
        },
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("🔥 Fatal webhook fetch error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        debug: String(err),
      }),
      { status: 500 }
    );
  }
}
