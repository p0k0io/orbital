// app/api/requests/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function POST(req: Request) {
  try {
    /* ================= BODY ================= */
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    /* ================= QUERY ================= */
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

    if (reqError) {
      return NextResponse.json(
        { error: "Database fetch failed", details: reqError },
        { status: 500 }
      );
    }

    /* ================= DISTRIBUTION ================= */
    const distributionMap: Record<string, number> = {};

    requests?.forEach((r: any) => {
      const endpointName = r.endpoint?.name || "Unknown";
      distributionMap[endpointName] =
        (distributionMap[endpointName] || 0) + 1;
    });

    const distribution = Object.entries(distributionMap).map(
      ([name, value]) => ({ name, value })
    );

    /* ================= STATUS COUNTS ================= */
    const successCount =
      requests?.filter((r: any) => r.status === "completed").length ?? 0;
    const failedCount =
      requests?.filter((r: any) => r.status === "failed").length ?? 0;
    const pendingCount =
      requests?.filter((r: any) => r.status === "pending").length ?? 0;

    const successDistribution = [
      { name: "Completadas", value: successCount },
      { name: "Fallidas", value: failedCount },
      { name: "Pendientes", value: pendingCount },
    ];

    /* ================= RESPONSE ================= */
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
    return NextResponse.json(
      {
        error: "Internal server error",
        debug: err instanceof Error ? err.message : err,
      },
      { status: 500 }
    );
  }
}