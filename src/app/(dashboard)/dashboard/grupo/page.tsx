import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import GrupoPage from './grupo'
import SuscripcionPage from './suscripcion'

export default async function Page() {
  const { userId } = await auth()

  if (!userId) redirect('/sign-in')

  // 1️⃣ Obtener perfil
  const { data: perfil, error } = await supabase
    .from('perfiles')
    .select('id, rol')
    .eq('clerk_id', userId)
    .single()

  if (error || perfil?.rol !== 'usuario') {
    redirect('/NoFound')
  }

  // 2️⃣ Verificar si ya tiene un pago registrado
  const { data: pago } = await supabase
    .from('pagos')
    .select('id')
    .eq('perfil_id', perfil.id)
    .maybeSingle()

  // 3️⃣ Si NO tiene pago → mostrar página de suscripción
  if (!pago) {
    return <SuscripcionPage perfil_id={perfil.id} />
  }

  // 4️⃣ Si ya pagó → mostrar página normal
  return <GrupoPage />
}
