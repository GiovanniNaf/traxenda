'use client'

import Link from "next/link"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Calendar, Home, Inbox, Settings, Users2, VectorSquare, FileText, UserCheck } from "lucide-react"

type Rol = 'psicologo' | 'usuario' | 'doctor' | 'consejero' | 'admin'

interface AppSidebarProps {
  rol: Rol
}

export function AppSidebar({ rol }: AppSidebarProps) {
  const { state } = useSidebar()

  // Ítems comunes para todos
  const commonItems = [
    { title: 'Inicio', url: '/dashboard', icon: Home },
  ]

  // Menú por rol
  const psicologoItems = [
    { title: 'Inicio', url: '/dashboard-psico', icon: Home },
    { title: 'Citas', url: '/dashboard-psico/citas', icon: Inbox },
    { title: 'Disponibilidad', url: '/dashboard-psico/disponibilidad', icon: Calendar },
    { title: 'Notas de evolución', url: '/dashboard-psico/notas', icon: FileText },
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
    { title: 'Consejería', url: '/dashboard/grupo', icon: VectorSquare },
    { title: 'Terapia individual', url: '/dashboard/individual', icon: Users2 },
  ]

  const adminItems = [
    { title: 'Panel Admin', url: '/dashboard-admin', icon: Home },
    { title: 'Usuarios', url: '/dashboard-admin/usuarios', icon: Users2 },
    { title: 'Reportes', url: '/dashboard-admin/reportes', icon: FileText },
    { title: 'Configuración', url: '/dashboard-admin/configuracion', icon: Settings },
  ]

  const configItems = [
    { title: 'Ajustes', url: '/dashboard/ajustes', icon: Settings },
  ]

  // Construimos el menú final según rol
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
      items = [...adminItems]
      break
    default:
      items = [...commonItems, ...configItems]
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-white">
        <SidebarHeader>
          <Link href="/" className="flex flex-row items-center gap-2">
            <Image
              src="/LOGO_TRAX.png"
              alt="Logo Traxenda"
              width={35}
              height={35}
              priority
            />
            {state === 'expanded' && (
              <span className="font-bold text-2xl text-indigo-600">Traxenda</span>
            )}
          </Link>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel className="font-bold">Panel de opciones</SidebarGroupLabel>
          <SidebarMenu className="font-semibold text-indigo-700">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url} className="flex items-center gap-3">
                    <div className="p-1 rounded-lg text-white bg-indigo-400">
                      <item.icon className="w-4 h-4" />
                    </div>
                    {state === 'expanded' && <span>{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
