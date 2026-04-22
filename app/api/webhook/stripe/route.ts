import { headers } from "next/headers";
import { stripe } from "../../../../lib/stripe";
import { CREDITS_BY_PRICE } from "../../../../lib/credits";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  console.log("🚀 Webhook received");

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("❌ Missing Stripe signature");
    return new Response("Missing signature", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("✅ Stripe event verified:", event.type);
  } catch (err: any) {
    console.error("❌ Invalid signature:", err.message);
    return new Response("Invalid signature", { status: 400 });
  }

  // 👉 Solo procesamos este evento
  if (event.type !== "checkout.session.completed") {
    console.log("ℹ️ Ignored event:", event.type);
    return new Response("Ignored", { status: 200 });
  }

  const session = event.data.object as any;

  console.log("📦 Session:", JSON.stringify(session, null, 2));

  const userId = session.metadata?.user_id;
  let priceId = session.metadata?.price_id;

  console.log("🧾 Metadata:", session.metadata);

  if (!userId) {
    console.error("❌ Missing user_id in metadata");
    return new Response("Missing user_id", { status: 400 });
  }

  // 🔁 FALLBACK: obtener price_id desde line_items
  if (!priceId) {
    console.warn("⚠️ No price_id in metadata, fetching from line_items...");

    try {
      const items = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 1,
      });

      console.log("🛒 Line items:", JSON.stringify(items.data, null, 2));

      priceId = items.data[0]?.price?.id;
    } catch (err) {
      console.error("❌ Error fetching line items:", err);
      return new Response("Line items error", { status: 500 });
    }
  }

  if (!priceId) {
    console.error("❌ price_id still missing after fallback");
    return new Response("Missing price_id", { status: 400 });
  }

  console.log("💰 Price ID:", priceId);

  const credits = CREDITS_BY_PRICE[priceId];

  if (!credits) {
    console.error("❌ Unknown price ID:", priceId);
    return new Response("Unknown price", { status: 400 });
  }

  console.log("🎯 Credits to add:", credits);

  // 🔎 Leer usuario actual
  const { data, error: readError } = await supabase
    .from("users")
    .select("credits")
    .eq("id_user", userId)
    .single();

  if (readError) {
    console.error("❌ Error reading user:", readError);
    return new Response("DB read error", { status: 500 });
  }

  if (!data) {
    console.error("❌ User not found:", userId);
    return new Response("User not found", { status: 404 });
  }

  console.log("👤 Current credits:", data.credits);

  const newCredits = (data.credits || 0) + credits;

  console.log("➕ New credits:", newCredits);

  // 🔄 Actualizar créditos
  const { error: updateError } = await supabase
    .from("users")
    .update({ credits: newCredits })
    .eq("id_user", userId);

  if (updateError) {
    console.error("❌ Error updating credits:", updateError);
    return new Response("DB update error", { status: 500 });
  }

  console.log(`✅ SUCCESS: Added ${credits} credits to user ${userId}`);

  return new Response("OK", { status: 200 });
}