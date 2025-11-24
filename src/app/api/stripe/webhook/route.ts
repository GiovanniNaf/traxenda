import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
 

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    
    return new NextResponse('Firma faltante', { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('❌ Error verificando la firma del webhook:', err);
    return new NextResponse('Firma inválida', { status: 400 });
  }

 

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const perfil_id = session.metadata?.perfil_id;
    const tipo_paquete = session.metadata?.tipo_paquete;

    // 👇 Aquí obtenemos el ID de la suscripción
    const stripe_subscription_id = session.subscription
      ? session.subscription.toString()
      : null;

    const { error } = await supabase.from('pagos').insert({
      perfil_id: parseInt(perfil_id!),
      tipo_paquete,
      monto: session.amount_total ? session.amount_total / 100 : 300,
      stripe_session_id: session.id,
      stripe_subscription_id, // 👈 Guardamos la suscripción
      estado: 'activo',
    });

    if (error) {
      console.error('❌ Error guardando en Supabase:', error);
      return new NextResponse('Error al guardar', { status: 500 });
    }

   
  }

  return new NextResponse('OK', { status: 200 });
}
