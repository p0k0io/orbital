// app/api/webhook/suscription/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ✅ Usar service role key en server-side, nunca la pública
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const creditsByPlan: Record<string, number> = {
  free: 150000,
  starter: 2000000,
  premium: 10000000,
  enterprise: 50000000,
};

// ✅ Verificación de firma del webhook (ajusta según tu proveedor)
function verifyWebhookSignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return true; // Si no hay secret configurado, omitir (no recomendado en prod)

  const signature = req.headers.get('x-webhook-signature') ?? 
                    req.headers.get('x-signature') ?? '';
  
  // Adapta esto a la firma real de tu proveedor de pagos
  const crypto = require('crypto');
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  return signature === expected || signature === `sha256=${expected}`;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // ✅ Verificar firma antes de procesar
    if (!verifyWebhookSignature(req, rawBody)) {
      console.warn('Firma de webhook inválida');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    console.log('Webhook recibido:', JSON.stringify(event, null, 2));

    const subscription = event.data;

    if (!subscription) {
      console.log('No hay datos de suscripción en el evento');
      return NextResponse.json({ received: false }, { status: 400 });
    }

    const id_user = subscription.payer?.user_id;
    if (!id_user) {
      console.log('No se encontró user_id en el evento');
      return NextResponse.json({ received: false }, { status: 400 });
    }

    const activeItem = subscription.items?.find((item: any) => item.status === 'active');
    // ✅ Fallback correcto: "free" en vez de "free_user"
    const newPlan = activeItem?.plan?.slug ?? 'free';
    const newPlanCredits = creditsByPlan[newPlan] ?? creditsByPlan['free'];

    switch (event.type) {
      case 'subscription.created': {
        // Al crear, simplemente asignar el plan y sus créditos
        const { error } = await supabase
          .from('users')
          .update({ plan: newPlan, credits: newPlanCredits })
          .eq('id_user', id_user);

        if (error) {
          console.error('Error creando suscripción:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log(`Suscripción creada: plan "${newPlan}" con ${newPlanCredits} créditos para usuario ${id_user}`);
        break;
      }

      case 'subscription.updated': {
        // ✅ Preservar créditos restantes al cambiar de plan
        const { data: currentUser, error: fetchError } = await supabase
          .from('users')
          .select('credits, plan')
          .eq('id_user', id_user)
          .single();

        if (fetchError || !currentUser) {
          console.error('Usuario no encontrado:', fetchError);
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const currentPlanCredits = creditsByPlan[currentUser.plan] ?? creditsByPlan['free'];
        const remainingCredits = Math.max(0, currentUser.credits);

        // Proporción de créditos usados sobre el plan anterior
        const usedRatio = Math.max(0, 1 - remainingCredits / currentPlanCredits);

        // Créditos del nuevo plan descontando lo ya consumido proporcionalmente
        const adjustedCredits = Math.floor(newPlanCredits * (1 - usedRatio));

        // ✅ Al hacer upgrade siempre se gana créditos; al downgrade se respeta el ratio
        const creditsToAssign = newPlanCredits > currentPlanCredits
          ? Math.max(adjustedCredits, remainingCredits) // upgrade: al menos los que tenía
          : adjustedCredits;                            // downgrade: proporcional

        const { error: updateError } = await supabase
          .from('users')
          .update({ plan: newPlan, credits: creditsToAssign })
          .eq('id_user', id_user);

        if (updateError) {
          console.error('Error actualizando suscripción:', updateError);
          return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        console.log(
          `Plan actualizado de "${currentUser.plan}" → "${newPlan}". ` +
          `Créditos: ${remainingCredits} restantes → ${creditsToAssign} (nuevo plan: ${newPlanCredits})`
        );
        break;
      }

      case 'subscription.renewed': {
        // ✅ Al renovar: sumar créditos del nuevo ciclo a los que ya quedan
        const { data: currentUser, error: fetchError } = await supabase
          .from('users')
          .select('credits, plan')
          .eq('id_user', id_user)
          .single();

        if (fetchError || !currentUser) {
          console.error('Usuario no encontrado:', fetchError);
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const renewalPlan = currentUser.plan;
        const renewalCredits = creditsByPlan[renewalPlan] ?? creditsByPlan['free'];
        // ✅ Sumar, no reemplazar — con tope máximo del plan para no acumular infinito
        const updatedCredits = Math.min(
          currentUser.credits + renewalCredits,
          renewalCredits * 2 // tope: máximo 2 ciclos acumulados
        );

        const { error: updateError } = await supabase
          .from('users')
          .update({ credits: updatedCredits })
          .eq('id_user', id_user);

        if (updateError) {
          console.error('Error renovando créditos:', updateError);
          return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        console.log(
          `Suscripción renovada para usuario ${id_user}. ` +
          `Créditos: ${currentUser.credits} + ${renewalCredits} = ${updatedCredits}`
        );
        break;
      }

      case 'subscription.canceled': {
        // ✅ Key correcta: "free" no "free_user"
        const freeCredits = creditsByPlan['free'];

        const { error } = await supabase
          .from('users')
          .update({ plan: 'free', credits: freeCredits })
          .eq('id_user', id_user);

        if (error) {
          console.error('Error cancelando suscripción:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log(`Suscripción cancelada para usuario ${id_user}. Plan → "free", créditos → ${freeCredits}`);
        break;
      }

      default:
        console.log('Evento ignorado:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}