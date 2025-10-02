'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Calendar,
  Inbox,
  VectorSquare,
  Users2,
  PhoneCall,
  FileText,
  UserCheck
} from "lucide-react"
import clsx from "clsx"

type Rol = 'psicologo' | 'usuario' | 'doctor' | 'consejero' | 'admin'

interface AppSidebarProps {
  rol: Rol
}

export function BottomNav({ rol }: AppSidebarProps) {
  // Ítems comunes para todos
  const commonItems = [
    { title: 'Inicio', url: '/dashboard', icon: Home },
  ]

  // Menú por rol
  const psicologoItems = [
    { title: 'Inicio', url: '/dashboard-psico', icon: Home },
    { title: 'Citas', url: '/dashboard-psico/citas', icon: Inbox },
    { title: 'Disponibilidad', url: '/dashboard-psico/disponibilidad', icon: Calendar },
    { title: 'Notas', url: '/dashboard-psico/notas', icon: FileText },
  ]

  const doctorItems = [
    { title: 'Inicio', url: '/dashboard-medic', icon: Home },
    { title: 'Pacientes', url: '/dashboard-medic/pacientes', icon: Users2 },
    { title: 'Interconsultas', url: '/dashboard-medic/interconsultas', icon: Inbox },
    { title: 'Recetas', url: '/dashboard-medic/recetas', icon: FileText },
  ]

  const consejeroItems = [
    { title: 'Inicio', url: '/dashboard-counselor', icon: Home },
    { title: 'Grupos', url: '/dashboard-counselor/grupos', icon: VectorSquare },
    { title: 'Seguimiento', url: '/dashboard-counselor/seguimiento', icon: UserCheck },
  ]

  const usuarioItems = [
    { title: 'Cursos', url: '/dashboard/grupo', icon: VectorSquare },
    { title: 'Terapia Individual', url: '/dashboard/individual', icon: Users2 },
  ]

  const configItems = [
    { title: 'Línea EE', url: '/dashboard/lineaee', icon: PhoneCall },
  ]

  // Construimos el menú final según el rol
  let items: typeof commonItems = []

  switch (rol) {
    case 'psicologo':
      items = [...psicologoItems, ...configItems]
      break
    case 'doctor':
      items = [...doctorItems, ...configItems]
      break
    case 'consejero':
      items = [...consejeroItems, ...configItems]
      break
    case 'usuario':
      items = [...commonItems, ...usuarioItems, ...configItems]
      break
    case 'admin':
      items = [...commonItems, ...configItems] // Puedes agregar más ítems para admin
      break
    default:
      items = [...commonItems, ...configItems]
  }

  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-md border-t sm:hidden">
      <div className="flex justify-around items-center px-2 py-1">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.url)
          return (
            <Link key={item.url} href={item.url} className="flex flex-col items-center px-3 py-2 text-xs">
              <div
                className={clsx(
                  "rounded-full p-2",
                  isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-500"
                )}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <span
                className={clsx(
                  "mt-1 font-medium",
                  isActive ? "text-indigo-600" : "text-gray-500"
                )}
              >
                {item.title}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
