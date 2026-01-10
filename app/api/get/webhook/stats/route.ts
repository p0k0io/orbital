import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function POST(req: Request) {
  const debug: any = {
    step: "init",
    counts: {},
    samples: {},
    errors: [],
  };

  try {
    const { endpoint_id } = await req.json();
    debug.endpoint_id = endpoint_id;

    // =========================
    // 1. REQUESTS
    // =========================
    debug.step = "fetch_requests";

    const { data: requests, error: reqErr } = await supabase
      .from("requests")
      .select("id_request, timestamp")
      .eq("endpoint_id", endpoint_id);

    if (reqErr) throw reqErr;

    debug.counts.requests = requests?.length ?? 0;
    debug.samples.requests = requests?.slice(0, 3);

    if (!requests || requests.length === 0) {
      return Response.json({
        avg_credit_use: 0,
        avg_response_time_ms: 0,
        debug,
      });
    }

    const requestIds = requests.map(r => r.id_request);
    const startMap = new Map(
      requests.map(r => [r.id_request, new Date(r.timestamp).getTime()])
    );

    // =========================
    // 2. REQUEST LOGS
    // =========================
    debug.step = "fetch_request_logs";

    const { data: logs, error: logErr } = await supabase
      .from("request_logs")
      .select("id_request, credit_use, created_at")
      .in("id_request", requestIds);

    if (logErr) throw logErr;

    debug.counts.logs = logs?.length ?? 0;
    debug.samples.logs = logs?.slice(0, 3);

    if (!logs || logs.length === 0) {
      return Response.json({
        avg_credit_use: 0,
        avg_response_time_ms: 0,
        debug,
      });
    }

    // =========================
    // 3. CALCULOS
    // =========================
    let creditSum = 0;
    let creditCount = 0;
    let timeSum = 0;
    let timeCount = 0;

    for (const log of logs) {
      if (typeof log.credit_use === "number") {
        creditSum += log.credit_use;
        creditCount++;
      }

      const start = startMap.get(log.id_request);
      if (start && log.created_at) {
        const diff = new Date(log.created_at).getTime() - start;
        if (diff > 0) {
          timeSum += diff;
          timeCount++;
        }
      }
    }

    debug.counts.credit_samples = creditCount;
    debug.counts.time_samples = timeCount;

    return Response.json({
      avg_credit_use: creditCount ? Number((creditSum / creditCount).toFixed(2)) : 0,
      avg_response_time_ms: timeCount ? Math.round(timeSum / timeCount) : 0,
      debug,
    });

  } catch (err: any) {
    debug.step = "fatal";
    debug.errors.push(err?.message ?? err);
    return Response.json({ debug }, { status: 500 });
  }
}
