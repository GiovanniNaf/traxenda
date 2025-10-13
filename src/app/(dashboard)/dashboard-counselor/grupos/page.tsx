'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Pencil, Trash2, Plus } from 'lucide-react'

interface Grupo {
  id: number
  nombre: string
  meetlink: string
  perfil_id: number
  created_at: string
  hora_inicio: string | null
  hora_fin: string | null
  recurrente: boolean
  dia_semana: number | null
  fecha: string | null
}



export default function GruposPage() {
  const { user, isLoaded } = useUser()
  const [perfilId, setPerfilId] = useState<number | null>(null)
  const [grupos, setGrupos] = useState<Grupo[]>([])

  // Formulario
  const [nombre, setNombre] = useState('')
  const [meetlink, setMeetLink] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFin, setHoraFin] = useState('')
  const [fecha, setFecha] = useState('')
  const [recurrente, setRecurrente] = useState(false)
  const [diaSemana, setDiaSemana] = useState(0)
  const [editando, setEditando] = useState<Grupo | null>(null)
  const [cargando, setCargando] = useState(false)
  const [open, setOpen] = useState(false)

  // Obtener perfil del consejero y sus grupos
  useEffect(() => {
    if (!isLoaded || !user) return

    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from('perfiles')
        .select('id')
        .eq('clerk_id', user.id)
        .single()

      if (error || !data) return console.error('Error obteniendo perfil:', error)

      setPerfilId(data.id)
      fetchGrupos(data.id)
    }

    const fetchGrupos = async (perfilId: number) => {
      const { data, error } = await supabase
        .from('grupos')
        .select('*')
        .eq('perfil_id', perfilId)
        .order('created_at', { ascending: false })

      if (error) return console.error('Error obteniendo grupos:', error)
      setGrupos(data as Grupo[])
    }

    fetchPerfil()
  }, [isLoaded, user])

  // Crear o editar grupo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !meetlink || (!recurrente && !fecha)) {
      toast.error('Completa los campos requeridos')
      return
    }
    if (!perfilId) return toast.error('No se pudo obtener tu perfil')

    setCargando(true)

    const data = {
      nombre,
      meetlink,
      perfil_id: perfilId,
      hora_inicio: horaInicio || null,
      hora_fin: horaFin || null,
      fecha: recurrente ? null : fecha,
      recurrente,
      dia_semana: recurrente ? diaSemana : null
    }

    let error
    if (editando) {
      const res = await supabase.from('grupos').update(data).eq('id', editando.id)
      error = res.error
    } else {
      const res = await supabase.from('grupos').insert([data])
      error = res.error
    }

    setCargando(false)
    setOpen(false)

    if (error) {
      console.error(error)
      toast.error('Error al guardar el grupo ❌')
    } else {
      toast.success(editando ? 'Grupo actualizado ✅' : 'Grupo creado ✅')
      limpiarFormulario()
      if (perfilId) {
        const { data } = await supabase
          .from('grupos')
          .select('*')
          .eq('perfil_id', perfilId)
          .order('created_at', { ascending: false })
        setGrupos(data as Grupo[])
      }
    }
  }

  // Eliminar grupo
  const eliminarGrupo = async (id: number) => {
    const confirmar = confirm('¿Estás seguro de eliminar este grupo?')
    if (!confirmar) return

    const { error } = await supabase.from('grupos').delete().eq('id', id)

    if (error) {
      toast.error('Error al eliminar grupo ❌')
    } else {
      setGrupos((prev) => prev.filter((g) => g.id !== id))
      toast.success('Grupo eliminado correctamente ✅')
    }
  }

  const limpiarFormulario = () => {
    setNombre('')
    setMeetLink('')
    setHoraInicio('')
    setHoraFin('')
    setFecha('')
    setRecurrente(false)
    setDiaSemana(0)
    setEditando(null)
  }

  const abrirModalEditar = (grupo: Grupo) => {
    setEditando(grupo)
    setNombre(grupo.nombre)
    setMeetLink(grupo.meetlink)
    setHoraInicio(grupo.hora_inicio || '')
    setHoraFin(grupo.hora_fin || '')
    setFecha(grupo.fecha || '')
    setRecurrente(grupo.recurrente)
    setDiaSemana(grupo.dia_semana || 0)
    setOpen(true)
  }

  function estaDisponible(grupo: Grupo): boolean {
    const ahora = new Date()
    const horaActual = ahora.getHours() * 60 + ahora.getMinutes()

    // Si el grupo es recurrente
    if (grupo.recurrente) {
      const diaActual = ahora.getDay() // Domingo = 0, Lunes = 1, ...
      if (grupo.dia_semana !== diaActual) return false

      if (!grupo.hora_inicio || !grupo.hora_fin) return false

      const [horaInicio, minutoInicio] = grupo.hora_inicio.split(':').map(Number)
      const [horaFin, minutoFin] = grupo.hora_fin.split(':').map(Number)
      const inicio = horaInicio * 60 + minutoInicio
      const fin = horaFin * 60 + minutoFin

      return horaActual >= inicio && horaActual <= fin
    }

    // Si el grupo tiene fecha específica
    if (grupo.fecha) {
      // 🔹 Evita error de zona horaria al construir la fecha manualmente
      const [anio, mes, dia] = grupo.fecha.split('-').map(Number)
      const fechaGrupo = new Date(anio, mes - 1, dia)

      const mismoDia =
        fechaGrupo.getDate() === ahora.getDate() &&
        fechaGrupo.getMonth() === ahora.getMonth() &&
        fechaGrupo.getFullYear() === ahora.getFullYear()

      if (!mismoDia) return false
      if (!grupo.hora_inicio || !grupo.hora_fin) return false

      const [horaInicio, minutoInicio] = grupo.hora_inicio.split(':').map(Number)
      const [horaFin, minutoFin] = grupo.hora_fin.split(':').map(Number)
      const inicio = horaInicio * 60 + minutoInicio
      const fin = horaFin * 60 + minutoFin

      return horaActual >= inicio && horaActual <= fin
    }

    return false
  }



  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mis Grupos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 text-white flex items-center gap-2">
              <Plus size={18} /> Nuevo Grupo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editando ? 'Editar Grupo' : 'Crear Nuevo Grupo'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <label className="flex flex-col">
                Nombre del grupo
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </label>

              <label className="flex flex-col">
                Link de Meet
                <Input value={meetlink} onChange={(e) => setMeetLink(e.target.value)} required />
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={recurrente} onChange={(e) => setRecurrente(e.target.checked)} />
                Grupo recurrente
              </label>

              {!recurrente && (
                <label className="flex flex-col">
                  Fecha
                  <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </label>
              )}

              <label className="flex flex-col">
                Hora inicio
                <Input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
              </label>

              <label className="flex flex-col">
                Hora fin
                <Input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
              </label>

              {recurrente && (
                <label className="flex flex-col">
                  Día de la semana
                  <select
                    value={diaSemana}
                    onChange={(e) => setDiaSemana(parseInt(e.target.value))}
                    className="p-2 border rounded-md"
                  >
                    <option value={0}>Domingo</option>
                    <option value={1}>Lunes</option>
                    <option value={2}>Martes</option>
                    <option value={3}>Miércoles</option>
                    <option value={4}>Jueves</option>
                    <option value={5}>Viernes</option>
                    <option value={6}>Sábado</option>
                  </select>
                </label>
              )}

              <Button type="submit" disabled={cargando} className="bg-indigo-600 text-white">
                {cargando ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Crear Grupo'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Listado de grupos */}
      {grupos.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">Aún no tienes grupos creados</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {grupos.map((grupo) => (
            <div
              key={grupo.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <h2 className="font-semibold text-lg text-gray-800 mb-2">{grupo.nombre}</h2>
                <p className="text-gray-500 text-sm mb-1">
                  {grupo.recurrente
                    ? `Recurrente cada ${['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][grupo.dia_semana || 0]}`
                    : `Fecha: ${grupo.fecha}`}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  {grupo.hora_inicio && grupo.hora_fin
                    ? `Horario: ${grupo.hora_inicio} - ${grupo.hora_fin}`
                    : 'Horario no definido'}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 mt-3">
                {estaDisponible(grupo) ? (
                  <a
                    href={grupo.meetlink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                  >
                    Unirse
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex-1 text-center bg-gray-400 text-gray-200 py-2 rounded-md cursor-not-allowed"
                  >
                    Unirse
                  </button>
                )}
                <div className="flex gap-2 ml-2">
                  <Button variant="outline" size="icon" onClick={() => abrirModalEditar(grupo)}>
                    <Pencil size={16} />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => eliminarGrupo(grupo.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
