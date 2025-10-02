// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DashboardPsico from '../dashboard-psico/DashboardPsico'
import DashboardMedic from '../dashboard-medic/DashboardMedic'
import DashboardCounselor from '../dashboard-counselor/DashboardCounselor'
import DashboardAdmin from '../dashboard-admin/DashboardAdmin'
import DashboardUsuario from '../dashboard/Dashboard'

export default async function DashboardPage() {
  // 1️⃣ Obtener el usuario
  const { userId } = await auth()

  if (!userId) redirect('/sign-in')

  // 2️⃣ Traer el perfil del usuario
  const { data: perfil, error } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('clerk_id', userId)
    .single()

  if (error || !perfil?.rol) {
    console.error('❌ Error obteniendo perfil:', error?.message)
    redirect('/dashboard') // fallback
  }

  // 3️⃣ Redirigir según rol
  switch (perfil.rol) {
    case 'psicologo':
      return <DashboardPsico />
    case 'doctor':
      return <DashboardMedic />
    case 'consejero':
      return <DashboardCounselor />
    case 'admin':
      return <DashboardAdmin />
    case 'usuario':
      return <DashboardUsuario />
    default:
      redirect('/dashboard') // fallback
  }
}
