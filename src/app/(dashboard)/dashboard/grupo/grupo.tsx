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
  es_gratis: boolean
}

export default function PanelUsuarioGrupos() {
  const [grupos, setGrupos] = useState<Grupo[]>([])

  const PASSWORD_GRATIS = 'CERTRAX26'

  const [passwordInput, setPasswordInput] = useState<{ [key:number]: string }>({})
  const [accesoPermitido, setAccesoPermitido] = useState<{ [key:number]: boolean }>({})

  useEffect(() => {
    const fetchGrupos = async () => {
      const { data, error } = await supabase.from('grupos').select('*')
      if (error) return console.error(error)

      // ordenar por la fecha más próxima (recurrente o fija)
      const gruposOrdenados = (data as Grupo[]).sort((a, b) => {
        const fechaA = obtenerProximaFecha(a)
        const fechaB = obtenerProximaFecha(b)
        return fechaA.getTime() - fechaB.getTime()
      })

      setGrupos(gruposOrdenados)
    }

    fetchGrupos()
  }, [])

  const obtenerHoraMexico = () => {
    const ahora = new Date()

    const partes = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Mexico_City',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      weekday: 'short'
    }).formatToParts(ahora)

    const hora = Number(partes.find(p => p.type === 'hour')?.value)
    const minuto = Number(partes.find(p => p.type === 'minute')?.value)

    return hora * 60 + minuto
  }

  const obtenerProximaFecha = (grupo: Grupo): Date => {
    const hoy = new Date()
    if (grupo.recurrente && grupo.dia_semana !== null) {
      const proxima = new Date(hoy)
      const diff = (grupo.dia_semana + 7 - hoy.getDay()) % 7
      proxima.setDate(hoy.getDate() + diff)
      return proxima
    }
    if (grupo.fecha) {
      const [anio, mes, dia] = grupo.fecha.split('-').map(Number)
      return new Date(anio, mes - 1, dia)
    }
    return new Date(9999, 0, 1)
  }

  const estaDisponible = (grupo: Grupo): boolean => {
    const horaActual = obtenerHoraMexico()
    const ahora = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' })
    )

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

  const esHoy = (grupo: Grupo): boolean => {
    const hoy = new Date()

    if (grupo.recurrente && grupo.dia_semana === hoy.getDay()) return true

    if (grupo.fecha) {
      const [anio, mes, dia] = grupo.fecha.split('-').map(Number)
      const fechaGrupo = new Date(anio, mes - 1, dia)

      return (
        fechaGrupo.getDate() === hoy.getDate() &&
        fechaGrupo.getMonth() === hoy.getMonth() &&
        fechaGrupo.getFullYear() === hoy.getFullYear()
      )
    }

    return false
  }

  const formatearFecha = (fecha?: string | null) => {
    if (!fecha) return ''

    const [anio, mes, dia] = fecha.split('-').map(Number)
    const fechaGrupo = new Date(anio, mes - 1, dia)

    return fechaGrupo.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long'
    })
  }

  const formatearHora = (hora?: string | null) => {
    if (!hora) return ''

    const [h, m] = hora.split(':').map(Number)

    const fecha = new Date()
    fecha.setHours(h)
    fecha.setMinutes(m)

    return fecha.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const validarContrasena = (grupoId: number) => {
    if (passwordInput[grupoId] === PASSWORD_GRATIS) {
      setAccesoPermitido(prev => ({
        ...prev,
        [grupoId]: true
      }))
    } else {
      alert('Contraseña incorrecta')
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Salas disponibles
      </h1>

      {grupos.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">
          No hay salas disponibles por el momento
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {grupos.map((grupo) => {
            const hoy = esHoy(grupo)

            return (
              <div
                key={grupo.id}
                className="rounded-xl shadow-sm border overflow-hidden transition bg-white text-gray-800 border-gray-200 hover:shadow-md"
              >
                {grupo.imagen && (
                  <img
                    src={grupo.imagen}
                    alt={grupo.nombre}
                    className="w-full h-40 object-cover"
                  />
                )}

                <div
                  className={`p-6 flex flex-col justify-between transition ${
                    hoy
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="font-semibold text-lg">
                        {grupo.nombre}
                      </h2>

                      {hoy && (
                        <span className="text-xs font-bold text-indigo-600 bg-white px-2 py-1 rounded-full">
                          Hoy
                        </span>
                      )}
                    </div>

                    {grupo.instructor_nombre && (
                      <p className="text-sm mb-1">
                        <span className="font-bold">
                          Facilitador:
                        </span>{' '}
                        {grupo.instructor_nombre}
                      </p>
                    )}

                    {grupo.instructor_titulo && (
                      <p className="text-sm mb-1">
                        <span className="font-bold">
                          Título:
                        </span>{' '}
                        {grupo.instructor_titulo}
                      </p>
                    )}

                    {grupo.instructor_experiencia && (
                      <p className="text-sm mb-2">
                        <span className="font-bold">
                          Experiencia:
                        </span>{' '}
                        {grupo.instructor_experiencia}
                      </p>
                    )}

                    <p className="text-sm mb-1">
                      {grupo.recurrente
                        ? `Todos los ${
                            [
                              'Domingo',
                              'Lunes',
                              'Martes',
                              'Miércoles',
                              'Jueves',
                              'Viernes',
                              'Sábado'
                            ][grupo.dia_semana || 0]
                          }`
                        : `Fecha: ${formatearFecha(grupo.fecha)}`}
                    </p>

                    <p className="text-sm mb-3">
                      {grupo.hora_inicio && grupo.hora_fin
                        ? `Horario: ${formatearHora(
                            grupo.hora_inicio
                          )} a ${formatearHora(
                            grupo.hora_fin
                          )} (Horario de México)`
                        : 'Horario no definido'}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50">
                  {grupo.es_gratis && !accesoPermitido[grupo.id] ? (
                    <div className="space-y-2">
                      <input
                        type="password"
                        placeholder="Contraseña"
                        value={passwordInput[grupo.id] || ''}
                        onChange={(e) =>
                          setPasswordInput(prev => ({
                            ...prev,
                            [grupo.id]: e.target.value
                          }))
                        }
                        className="w-full border rounded-md px-3 py-2 text-sm"
                      />

                      <button
                        onClick={() =>
                          validarContrasena(grupo.id)
                        }
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                      >
                        Acceder
                      </button>
                    </div>
                  ) : (
                    <a
                      href={
                        estaDisponible(grupo)
                          ? grupo.meetlink
                          : '#'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!estaDisponible(grupo))
                          e.preventDefault()
                      }}
                      className={`block text-center py-2 rounded-md transition ${
                        estaDisponible(grupo)
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed pointer-events-none'
                      }`}
                    >
                      Unirse
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}