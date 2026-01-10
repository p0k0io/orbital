import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function POST(req: Request) {
  try {
    const { request_id } = await req.json();

    if (!request_id) {
      return NextResponse.json(
        { error: "Missing request_id" },
        { status: 400 }
      );
    }

    // Consultar la tabla por request_id
    const { data, error } = await supabase
      .from("request_logs") // reemplaza con el nombre real de la tabla
      .select("payload_out, error, created_at")
      .eq("id_request", request_id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found en Supabase
      console.error("Error consultando DB:", error);
      return NextResponse.json(
        { error: "Database query failed" },
        { status: 500 }
      );
    }

    if (!data || (!data.payload_out && !data.error)) {
      // No hay respuesta aún
      return NextResponse.json({ pending: true });
    }

    // Retornar resultado
    return NextResponse.json({
      pending: false,
      payload_out: data.payload_out,
      error: data.error,
      created_at: data.created_at,
    });
  } catch (err) {
    console.error("Error polling response:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
