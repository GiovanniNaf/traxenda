'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { href: "/dashboard", icon: "🏠", text: "Inicio" },
  { href: "/dashboard/agenda", icon: "📅", text: "Agenda" },
  { href: "/dashboard/clientes", icon: "👥", text: "Clientes" },
  { href: "/dashboard/consultas", icon: "💬", text: "Consultas" },
  { href: "/dashboard/reportes", icon: "📊", text: "Reportes" },
  { href: "/dashboard/config", icon: "⚙️", text: "Configuración" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r h-screen fixed flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold text-indigo-600">ConsultasOnline</h1>
        <p className="text-sm text-muted-foreground">Panel de control</p>
      </div>

      <Separator />

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              text={item.text}
              active={pathname === item.href}
            />
          ))}
        </ul>
      </nav>
    </aside>
  )
}

function NavItem({
  href,
  icon,
  text,
  active,
}: {
  href: string
  icon: string
  text: string
  active?: boolean
}) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center px-4 py-2 rounded-md transition-colors ${
          active
            ? 'bg-indigo-100 text-indigo-700 font-medium'
            : 'text-muted-foreground hover:bg-gray-100'
        }`}
      >
        <span className="mr-3 text-lg">{icon}</span>
        <span>{text}</span>
      </Link>
    </li>
  )
}
