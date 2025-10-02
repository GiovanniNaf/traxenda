'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react' // icono de spinner

export default function AsignarRol() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const asignarRol = async () => {
      const rol = searchParams.get('rol')
      if (!rol) {
        router.push('/')
        return
      }

      const res = await fetch('/api/asignar-rol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol }),
      })

      if (res.ok) {
        switch (rol) {
          case 'psicologo':
            router.push('/dashboard-psico')
            break
          case 'doctor':
            router.push('/dashboard-medic')
            break
          case 'consejero':
            router.push('/dashboard-counselor')
            break
          case 'admin':
            router.push('/dashboard-admin')
            break
          default:
            router.push('/dashboard')
        }
      } else {
        router.push('/error')
      }
    }

    asignarRol()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 text-white px-4">
      {/* Spinner */}
      <Loader2 className="animate-spin w-12 h-12 mb-6" />

      {/* Texto */}
      <h1 className="text-3xl font-bold mb-2">Asignando rol...</h1>
      <p className="text-lg text-indigo-100">Cargando tu panel personalizado, por favor espera</p>
    </div>
  )
}
