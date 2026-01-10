// app/api/requests/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function POST(req: Request) {
  console.log("🟢 [/api/requests] POST called");

  try {
    /* ================= BODY ================= */
    const body = await req.json();
    console.log("📦 Request body:", body);

    const { userId } = body;

    if (!userId) {
      console.warn("⚠️ Missing userId");
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    /* ================= ENV ================= */
    console.log(
      "🔐 Supabase URL:",
      process.env.NEXT_PUBLIC_SUPABASE_URL ? "OK" : "MISSING"
    );
    console.log(
      "🔐 Supabase KEY:",
      process.env.NEXT_PUBLIC_SUPABASE_KEY ? "OK" : "MISSING"
    );

    /* ================= QUERY ================= */
    console.log("📡 Fetching requests for user:", userId);

    const { data: requests, error: reqError } = await supabase
      .from("requests")
      .select(`
        id_request,
        status,
        timestamp,
        endpoint: endpoints(name)
      `)
      .eq("id_user", userId)
      .order("timestamp", { ascending: false });

    console.log("📊 Raw requests data:", requests);
    console.log("❌ Requests query error:", reqError);

    if (reqError) {
      console.error("🔥 Error fetching requests:", reqError);
      return NextResponse.json(
        { error: "Database fetch failed", details: reqError },
        { status: 500 }
      );
    }

    console.log("✅ Requests count:", requests?.length ?? 0);

    /* ================= DISTRIBUTION ================= */
    console.log("📈 Calculating distribution per endpoint");

    const distributionMap: Record<string, number> = {};

    requests?.forEach((r: any) => {
      const endpointName = r.endpoint?.name || "Unknown";
      distributionMap[endpointName] =
        (distributionMap[endpointName] || 0) + 1;
    });

    const distribution = Object.entries(distributionMap).map(
      ([name, value]) => ({ name, value })
    );

    console.log("📊 Endpoint distribution:", distribution);

    /* ================= STATUS COUNTS ================= */
    console.log("📊 Calculating status distribution");

    const successCount =
      requests?.filter((r: any) => r.status === "completed").length ?? 0;
    const failedCount =
      requests?.filter((r: any) => r.status === "failed").length ?? 0;
    const pendingCount =
      requests?.filter((r: any) => r.status === "pending").length ?? 0;

    console.log("🟢 Completed:", successCount);
    console.log("🔴 Failed:", failedCount);
    console.log("🟡 Pending:", pendingCount);

    const successDistribution = [
      { name: "Completadas", value: successCount },
      { name: "Fallidas", value: failedCount },
      { name: "Pendientes", value: pendingCount },
    ];

    /* ================= RESPONSE ================= */
    console.log("✅ Returning response");

    return NextResponse.json(
      {
        requests: requests ?? [],
        distribution,
        successDistribution,
        debug: {
          totalRequests: requests?.length ?? 0,
          userId,
        },
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("💥 Unhandled error in /api/requests:", err);

    return NextResponse.json(
      {
        error: "Internal server error",
        debug: err instanceof Error ? err.message : err,
      },
      { status: 500 }
    );
  }
}
