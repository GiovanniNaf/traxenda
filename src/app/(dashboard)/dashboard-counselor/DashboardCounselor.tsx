// app/dashboard-counselor/page.tsx
import Link from "next/link"
import { Users2, FileText, Plus } from "lucide-react"

const DashboardCounselor = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Panel del Consejero</h1>
        <p className="text-gray-600 mt-1">Bienvenido, administra tus grupos y seguimiento de pacientes</p>
      </header>

      {/* Cards principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Grupos */}
        <Link
          href="/dashboard-counselor/grupos"
          className="flex flex-col justify-between p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="flex items-center gap-3 text-indigo-600">
            <Users2 className="w-6 h-6" />
            <span className="text-lg font-semibold">Mis Grupos</span>
          </div>
          <p className="text-gray-500 mt-2 text-sm">Ver y administrar los grupos de consejería asignados</p>
        </Link>

        {/* Seguimiento */}
        <Link
          href="/dashboard-counselor/seguimiento"
          className="flex flex-col justify-between p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="flex items-center gap-3 text-green-600">
            <FileText className="w-6 h-6" />
            <span className="text-lg font-semibold">Seguimiento</span>
          </div>
          <p className="text-gray-500 mt-2 text-sm">Registrar y revisar el progreso de los pacientes</p>
        </Link>

        {/* Agregar nuevo grupo */}
        <Link
          href="/dashboard-counselor/grupos/nuevo"
          className="flex flex-col justify-between p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="flex items-center gap-3 text-purple-600">
            <Plus className="w-6 h-6" />
            <span className="text-lg font-semibold">Nuevo Grupo</span>
          </div>
          <p className="text-gray-500 mt-2 text-sm">Crear un nuevo grupo de consejería</p>
        </Link>
      </div>

      {/* Próximos eventos */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Próximos eventos</h2>
        <div className="bg-white rounded-xl shadow p-6 text-gray-600">
          <p>Aquí se mostrarán las próximas sesiones o reuniones programadas.</p>
        </div>
      </section>
    </div>
  )
}

export default DashboardCounselor
