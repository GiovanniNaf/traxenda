'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export default function NotFoundPage() {
  const { user } = useUser()
  const supabase = createClientComponentClient()
  const [dashboardPath, setDashboardPath] = useState('/')

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('clerk_id', user.id)
        .single()

      if (error) {
        console.error('Error al obtener rol:', error)
        return
      }

      if (data?.rol) {
        switch (data.rol) {
          case 'usuario':
            setDashboardPath('/dashboard')
            break
          case 'psicologo':
            setDashboardPath('/dashboard-psico')
            break
          case 'medico':
            setDashboardPath('/dashboard-medic')
            break
          case 'consejero':
            setDashboardPath('/dashboard-counselor')
            break
          default:
            setDashboardPath('/')
            break
        }
      }
    }

    fetchPerfil()
  }, [user, supabase])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] text-[#111827] px-4">
      <div className="text-7xl mb-4">😕</div>

      <h1 className="text-3xl font-bold mb-2">Página no encontrada</h1>
      <p className="text-[#6B7280] mb-6">Error 404</p>

      {/* Botón volver dinámico */}
      <Link
        href={dashboardPath}
        className="px-5 py-2 bg-[#6C4CFF] text-white rounded-lg shadow hover:bg-[#5033CC] transition"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
