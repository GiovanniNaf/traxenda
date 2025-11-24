// /app/api/verificar-pago/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { searchParams } = new URL(req.url);
  const perfil_id = searchParams.get("perfil_id");

  if (!perfil_id) {
    return NextResponse.json({ pagado: false });
  }

  const { data } = await supabase
    .from("pagos")
    .select("*")
    .eq("perfil_id", perfil_id)
    .eq("estado", "pagado")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({ pagado: !!data });
}
