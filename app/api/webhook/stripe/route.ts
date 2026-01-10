import { headers } from "next/headers";
import { stripe } from "../../../../lib/stripe";
import { CREDITS_BY_PRICE } from "../../../../lib/credits";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Invalid signature:", err.message);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return new Response("Ignored", { status: 200 });
  }

  const session = event.data.object as any;

  const userId = session.metadata?.user_id;
  let priceId = session.metadata?.price_id;

  if (!userId) {
    console.error("❌ Missing user_id in metadata", session.metadata);
    return new Response("Missing user", { status: 400 });
  }

  // 🔁 FALLBACK: obtener price_id desde line_items
  if (!priceId) {
    try {
      const items = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 1,
      });
      priceId = items.data[0]?.price?.id;
    } catch (err) {
      console.error("❌ Cannot fetch line items", err);
      return new Response("Line items error", { status: 500 });
    }
  }

  if (!priceId) {
    console.error("❌ Missing price_id after fallback");
    return new Response("Missing price", { status: 400 });
  }

  const credits = CREDITS_BY_PRICE[priceId];

  if (!credits) {
    console.error("❌ Unknown price ID:", priceId);
    return new Response("Unknown price", { status: 400 });
  }

const { data, error: readError } = await supabase
  .from("users")
  .select("credits")
  .eq("id_user", userId)
  .single();

if (readError || !data) {
  return new Response("User not found", { status: 500 });
}

const { error: updateError } = await supabase
  .from("users")
  .update({ credits: data.credits + credits })
  .eq("id_user", userId);

if (updateError) {
  return new Response("DB error", { status: 500 });
}


  console.log(`✅ ${credits} credits added to user ${userId}`);

  return new Response("OK", { status: 200 });
}
