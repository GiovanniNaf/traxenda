import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// 🔹 Inicializar Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 🔹 Inicializar Supabase con Service Role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🔹 IDs de los precios en Stripe
const PRICE_IDS: Record<string, string> = {
  'Iniciando el camino': 'price_1SX3Fh03AkkK3Ans4LeSK7cv', // Reemplaza con tu ID real
  'Recuperación plena': 'price_1SX3C903AkkK3Ans6s8qKdCL', // Reemplaza con tu ID real
};

export async function POST(req: Request) {
  try {
    // Autenticación del usuario con Clerk
    const { userId } = await auth();
    if (!userId) return new NextResponse('No autenticado', { status: 401 });

    // Leer datos del body
    const { tipo_paquete } = await req.json();

    if (!tipo_paquete || !(tipo_paquete in PRICE_IDS)) {
      return new NextResponse('Tipo de paquete inválido', { status: 400 });
    }

    // Buscar el perfil del usuario actual
    const { data: perfil, error: perfilError } = await supabase
      .from('perfiles')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (perfilError || !perfil) {
      console.error('❌ Error obteniendo perfil:', perfilError);
      return new NextResponse('Perfil no encontrado', { status: 404 });
    }

    // Crear sesión de pago de Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // 👈 porque usas precios recurrentes
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_IDS[tipo_paquete],
          quantity: 1,
        },
      ],
      metadata: {
        perfil_id: perfil.id.toString(),
        tipo_paquete,
      },
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/grupo`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/grupo`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('❌ Error en checkout:', error);
    return new NextResponse('Error interno en checkout', { status: 500 });
  }
}
