import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabase} from '@/lib/supabase' // tu cliente supabase backend
import DisponibilidadPage from './disponibilidad'

export default async function Page() {
  const { userId } = await auth()

  if (!userId) redirect('/sign-in')

  const { data: perfil, error } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('clerk_id', userId)
    .single()

  if (error || perfil?.rol !== 'psicologo') {
    redirect('/NoFound') // o página de acceso denegado
  }

  return <DisponibilidadPage/>
}
