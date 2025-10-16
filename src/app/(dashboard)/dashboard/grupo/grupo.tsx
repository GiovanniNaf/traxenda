'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Grupo {
  id: number
  nombre: string
  meetlink: string
  hora_inicio: string | null
  hora_fin: string | null
  recurrente: boolean
  dia_semana: number | null
  fecha: string | null
  imagen?: string | null
  instructor_nombre?: string | null
  instructor_titulo?: string | null
  instructor_experiencia?: string | null
}

export default function PanelUsuarioGrupos() {
  const [grupos, setGrupos] = useState<Grupo[]>([])

  useEffect(() => {
    const fetchGrupos = async () => {
      const { data, error } = await supabase
        .from('grupos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) return console.error(error)
      setGrupos(data as Grupo[])
    }

    fetchGrupos()
  }, [])

  // Función para mostrar disponibilidad
  function estaDisponible(grupo: Grupo): boolean {
    const ahora = new Date()
    const horaActual = ahora.getHours() * 60 + ahora.getMinutes()

    if (grupo.recurrente) {
      const diaActual = ahora.getDay()
      if (grupo.dia_semana !== diaActual) return false
      if (!grupo.hora_inicio || !grupo.hora_fin) return false
      const [hI, mI] = grupo.hora_inicio.split(':').map(Number)
      const [hF, mF] = grupo.hora_fin.split(':').map(Number)
      const inicio = hI * 60 + mI
      const fin = hF * 60 + mF
      return horaActual >= inicio && horaActual <= fin
    }

    if (grupo.fecha) {
      const [anio, mes, dia] = grupo.fecha.split('-').map(Number)
      const fechaGrupo = new Date(anio, mes - 1, dia)
      const mismoDia =
        fechaGrupo.getDate() === ahora.getDate() &&
        fechaGrupo.getMonth() === ahora.getMonth() &&
        fechaGrupo.getFullYear() === ahora.getFullYear()
      if (!mismoDia) return false
      if (!grupo.hora_inicio || !grupo.hora_fin) return false
      const [hI, mI] = grupo.hora_inicio.split(':').map(Number)
      const [hF, mF] = grupo.hora_fin.split(':').map(Number)
      const inicio = hI * 60 + mI
      const fin = hF * 60 + mF
      return horaActual >= inicio && horaActual <= fin
    }

    return false
  }

  // Formatear fecha como "20 de Octubre"
  const formatearFecha = (fecha?: string | null) => {
    if (!fecha) return ''
    const [anio, mes, dia] = fecha.split('-').map(Number)
    const fechaGrupo = new Date(anio, mes - 1, dia)
    return fechaGrupo.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })
  }

  // Formatear hora como "8:00 PM"
  const formatearHora = (hora?: string | null) => {
    if (!hora) return ''
    const [h, m] = hora.split(':').map(Number)
    const fecha = new Date()
    fecha.setHours(h)
    fecha.setMinutes(m)
    return fecha.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Salas disponibles</h1>

      {grupos.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No hay salas disponibles por el momento</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {grupos.map((grupo) => (
            <div
              key={grupo.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              {grupo.imagen && (
                <img
                  src={grupo.imagen}
                  alt={grupo.nombre}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <h2 className="font-semibold text-lg text-gray-800 mb-2">{grupo.nombre}</h2>

                  {grupo.instructor_nombre && (
                    <p className="text-gray-700 text-sm mb-1">
                      <span className="font-bold">Instructor: </span>{grupo.instructor_nombre}
                    </p>
                  )}
                  {grupo.instructor_titulo && (
                    <p className="text-gray-700 text-sm mb-1">
                      <span className="font-bold">Título: </span>{grupo.instructor_titulo}
                    </p>
                  )}
                  {grupo.instructor_experiencia && (
                    <p className="text-gray-700 text-sm mb-2">
                      <span className="font-bold">Experiencia: </span>{grupo.instructor_experiencia}
                    </p>
                  )}

                  <p className="text-gray-500 text-sm mb-1">
                    {grupo.recurrente
                      ? `Todos los ${['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][grupo.dia_semana || 0]}`
                      : `Fecha: ${formatearFecha(grupo.fecha)}`}
                  </p>
                  <p className="text-gray-500 text-sm mb-3">
                    {grupo.hora_inicio && grupo.hora_fin
                      ? `Horario: ${formatearHora(grupo.hora_inicio)} a ${formatearHora(grupo.hora_fin)} (Horario de México)`
                      : 'Horario no definido'}
                  </p>
                </div>

                <a
                  href={estaDisponible(grupo) ? grupo.meetlink : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!estaDisponible(grupo)) {
                      e.preventDefault()
                    }
                  }}
                  className={`flex-1 text-center py-2 rounded-md transition ${estaDisponible(grupo)
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed pointer-events-none'
                    }`}
                >
                  Unirse
                </a>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
