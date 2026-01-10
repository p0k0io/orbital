import { NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";

export async function POST(req: Request) {
  try {
    const { priceId, userId } = await req.json();

    if (!priceId || !userId) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        user_id: userId, // CLERK USER ID
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
