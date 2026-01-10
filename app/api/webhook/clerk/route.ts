import { NextRequest } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";

// 🔹 Variables de entorno del backend
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const CLERK_WEBHOOK_SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET as string;

// Validación de variables
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
}

if (!CLERK_WEBHOOK_SIGNING_SECRET) {
  throw new Error(
    "Missing Clerk webhook signing secret. Please set CLERK_WEBHOOK_SIGNING_SECRET"
  );
}

// Inicializar Supabase en backend
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Obtener payload
    const payload = await req.text();

    // 2️⃣ Obtener headers de Svix
    const svix_id = req.headers.get("svix-id");
    const svix_timestamp = req.headers.get("svix-timestamp");
    const svix_signature = req.headers.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    // 3️⃣ Verificar webhook
    const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);
    let evt: any;
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Invalid signature", { status: 400 });
    }

    // 4️⃣ Manejar eventos de usuario
    const eventType = evt.type;
    if (eventType === "user.created" || eventType === "user.updated") {
      const user = evt.data?.user ?? evt.data;
      if (!user || !user.id) {
        return new Response("User data missing", { status: 400 });
      }

      const email = user.email_addresses?.[0]?.email_address ?? user.email ?? null;

      // 5️⃣ Upsert en Supabase
      const { data, error } = await supabase
        .from("users")
        .upsert(
          { id_user: user.id},
          { onConflict: "id_user" }
        );

      if (error) {
        console.error("Supabase error:", error);
        return new Response("Database error", { status: 500 });
      }

      return new Response("OK", { status: 200 });
    }

    // Ignorar otros eventos
    return new Response("Ignored", { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response("Server error", { status: 500 });
  }
}
