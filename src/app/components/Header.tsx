import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 border-b border-gray-200">
      {/* Logo / Título */}
      <div className="flex items-center space-x-2">
        <Link href="/dashboard">
          <span className="text-xl font-bold text-blue-900 tracking-wide hover:opacity-80 transition cursor-pointer">
            Traxenda
          </span>
        </Link>
      </div>

      {/* Botón de usuario */}
      <div className="flex items-center gap-4">
        <UserButton/>
      </div>
    </header>
  )
}
