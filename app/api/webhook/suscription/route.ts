// app/api/webhook/suscription/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializa Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

// Definir créditos según plan
const creditsByPlan: Record<string, number> = {
  free_user: 1000,
  pro: 5000,
  premium: 10000,
};

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    // Debug: imprimir todo el payload la primera vez
    console.log('Webhook recibido:', JSON.stringify(event, null, 2));

    const subscription = event.data;

    if (!subscription) {
      console.log('No hay datos de suscripción en el evento');
      return NextResponse.json({ received: false }, { status: 400 });
    }

    // Extraer user_id desde payer
    const id_user = subscription.payer?.user_id;
    if (!id_user) {
      console.log("No se encontró user_id en el evento");
      return NextResponse.json({ received: false }, { status: 400 });
    }

    // Buscar item activo
    const activeItem = subscription.items?.find((item: any) => item.status === "active");
    const newPlan = activeItem?.plan?.slug || "free";
    const newCredits = creditsByPlan[newPlan] ?? 10000;

    switch (event.type) {
      case "subscription.created":
      case "subscription.updated": {
        const { error } = await supabase
          .from("users")
          .update({ plan: newPlan, credits: newCredits })
          .eq("id_user", id_user);

        if (error) {
          console.error("Error actualizando plan y créditos:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log(`Plan actualizado a "${newPlan}" con ${newCredits} créditos para usuario ${id_user}`);
        break;
      }

      case "subscription.canceled": {
        const { error } = await supabase
          .from("users")
          .update({ plan: "free", credits: creditsByPlan["free"] })
          .eq("id_user", id_user);

        if (error) {
          console.error("Error actualizando plan a free:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log(`Suscripción cancelada, plan vuelto a "free" y créditos a ${creditsByPlan["free_user"]} para usuario ${id_user}`);
        break;
      }

      default:
        console.log("Evento ignorado:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
