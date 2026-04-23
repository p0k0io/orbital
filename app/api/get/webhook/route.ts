import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { endpoint_id, page = 1, limit = 10 } = body;

    if (!endpoint_id) {
      return new Response(
        JSON.stringify({ error: "Missing endpoint_id" }),
        { status: 400 }
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

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

    if (logsQuery.error) {
      throw logsQuery.error;
    }

    /* ------------------ STATS ------------------ */
    const statsQuery = await supabase
      .from("webhooks")
      .select("status")
      .eq("endpoint_id", endpoint_id);

    if (statsQuery.error) {
      throw statsQuery.error;
    }

    const stats = {
      success: statsQuery.data.filter((w) => w.status === "success").length,
      failed: statsQuery.data.filter((w) => w.status !== "success").length,
    };

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
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        debug: String(err),
      }),
      { status: 500 }
    );
  }
}