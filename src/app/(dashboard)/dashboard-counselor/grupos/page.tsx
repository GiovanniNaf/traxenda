'use client'

import { useState, useEffect, ChangeEvent } from 'react'
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
  imagen?: string | null
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
  const [imagen, setImagen] = useState<File | null>(null)

  // Obtener perfil y grupos
  useEffect(() => {
    if (!isLoaded || !user) return

    const fetchPerfil = async () => {
      const { data, error } = await supabase.from('perfiles').select('id').eq('clerk_id', user.id).single()
      if (error || !data) return console.error(error)
      setPerfilId(data.id)
      fetchGrupos(data.id)
    }

    const fetchGrupos = async (perfilId: number) => {
      const { data, error } = await supabase.from('grupos').select('*').eq('perfil_id', perfilId).order('created_at', { ascending: false })
      if (error) return console.error(error)
      setGrupos(data as Grupo[])
    }

    fetchPerfil()
  }, [isLoaded, user])

  // Subir imagen al bucket
const subirImagen = async (): Promise<string | null> => {
  if (!imagen) return editando?.imagen || null

  const nombreArchivo = `grupos/${Date.now()}_${imagen.name}`

  // Subir el archivo
  const { error: uploadError } = await supabase.storage
    .from('img')
    .upload(nombreArchivo, imagen, { upsert: true })

  if (uploadError) {
    toast.error('Error al subir imagen ❌')
    console.error(uploadError)
    return null
  }

  // Obtener URL pública
  const { data } = supabase.storage.from('img').getPublicUrl(nombreArchivo)

  return data.publicUrl
}



  // Crear o editar grupo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !meetlink || (!recurrente && !fecha)) {
      toast.error('Completa los campos requeridos')
      return
    }
    if (!perfilId) return toast.error('No se pudo obtener tu perfil')

    setCargando(true)

    const urlImagen = await subirImagen()

    const data = {
      nombre,
      meetlink,
      perfil_id: perfilId,
      hora_inicio: horaInicio || null,
      hora_fin: horaFin || null,
      fecha: recurrente ? null : fecha,
      recurrente,
      dia_semana: recurrente ? diaSemana : null,
      imagen: urlImagen
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
    limpiarFormulario()

    if (error) {
      console.error(error)
      toast.error('Error al guardar el grupo ❌')
    } else {
      toast.success(editando ? 'Grupo actualizado ✅' : 'Grupo creado ✅')
      if (perfilId) {
        const { data } = await supabase.from('grupos').select('*').eq('perfil_id', perfilId).order('created_at', { ascending: false })
        setGrupos(data as Grupo[])
      }
    }
  }

  const eliminarGrupo = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este grupo?')) return
    const { error } = await supabase.from('grupos').delete().eq('id', id)
    if (error) toast.error('Error al eliminar grupo ❌')
    else {
      setGrupos((prev) => prev.filter((g) => g.id !== id))
      toast.success('Grupo eliminado ✅')
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
    setImagen(null)
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

  const manejarArchivo = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImagen(e.target.files[0])
  }

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
      const mismoDia = fechaGrupo.getDate() === ahora.getDate() && fechaGrupo.getMonth() === ahora.getMonth() && fechaGrupo.getFullYear() === ahora.getFullYear()
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
                  <select value={diaSemana} onChange={(e) => setDiaSemana(parseInt(e.target.value))} className="p-2 border rounded-md">
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

              <label className="flex flex-col">
                Portada
                <Input type="file" accept="image/*" onChange={manejarArchivo} />
              </label>

              <Button type="submit" disabled={cargando} className="bg-indigo-600 text-white">
                {cargando ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Crear Grupo'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {grupos.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">Aún no tienes grupos creados</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {grupos.map((grupo) => (
            <div key={grupo.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
              {grupo.imagen && <img src={grupo.imagen} alt={grupo.nombre} className="w-full h-40 object-cover" />}
              <div className="p-6 flex flex-col justify-between">
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
                    <a href={grupo.meetlink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                      Unirse
                    </a>
                  ) : (
                    <button disabled className="flex-1 text-center bg-gray-400 text-gray-200 py-2 rounded-md cursor-not-allowed">
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
