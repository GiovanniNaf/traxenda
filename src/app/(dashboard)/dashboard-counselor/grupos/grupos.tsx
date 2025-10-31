'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Pencil, Trash2, Plus, Lock } from 'lucide-react'

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
  instructor_nombre?: string | null
  instructor_titulo?: string | null
  instructor_experiencia?: string | null
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

  // Campos del instructor
  const [instructorNombre, setInstructorNombre] = useState('')
  const [instructorTitulo, setInstructorTitulo] = useState('')
  const [instructorExperiencia, setInstructorExperiencia] = useState('')

  // Modal de contraseña
  const [mostrarPasswordModal, setMostrarPasswordModal] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const PASSWORD_CORRECTA = 'admin2025'

  const [accionPendiente, setAccionPendiente] = useState<'crear' | 'editar' | 'eliminar' | null>(null)
  const [grupoAEliminar, setGrupoAEliminar] = useState<number | null>(null)

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
      const { data, error } = await supabase
        .from('grupos')
        .select('*')
        .eq('perfil_id', perfilId)
        .order('fecha', { ascending: true })
      if (error) return console.error(error)
      setGrupos(data as Grupo[])
    }

    fetchPerfil()
  }, [isLoaded, user])

  const subirImagen = async (): Promise<string | null> => {
    if (!imagen) return editando?.imagen || null
    const nombreArchivo = `grupos/${Date.now()}_${imagen.name}`

    const { error: uploadError } = await supabase.storage.from('img').upload(nombreArchivo, imagen, { upsert: true })
    if (uploadError) {
      toast.error('Error al subir imagen ❌')
      console.error(uploadError)
      return null
    }

    const { data } = supabase.storage.from('img').getPublicUrl(nombreArchivo)
    return data.publicUrl
  }

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
      imagen: urlImagen,
      instructor_nombre: instructorNombre,
      instructor_titulo: instructorTitulo,
      instructor_experiencia: instructorExperiencia,
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
        const { data } = await supabase
          .from('grupos')
          .select('*')
          .eq('perfil_id', perfilId)
          .order('fecha', { ascending:true })
        setGrupos(data as Grupo[])
      }
    }
  }

  const eliminarGrupo = async (id: number) => {
    setAccionPendiente('eliminar')
    setGrupoAEliminar(id)
    setMostrarPasswordModal(true)
  }

  const confirmarEliminar = async () => {
    if (!grupoAEliminar) return
    const { error } = await supabase.from('grupos').delete().eq('id', grupoAEliminar)
    if (error) toast.error('Error al eliminar grupo ❌')
    else {
      setGrupos((prev) => prev.filter((g) => g.id !== grupoAEliminar))
      toast.success('Grupo eliminado ✅')
    }
    setGrupoAEliminar(null)
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
    setInstructorNombre('')
    setInstructorTitulo('')
    setInstructorExperiencia('')
  }

  const abrirModalEditar = (grupo: Grupo) => {
    setAccionPendiente('editar')
    setEditando(grupo)
    setNombre(grupo.nombre)
    setMeetLink(grupo.meetlink)
    setHoraInicio(grupo.hora_inicio || '')
    setHoraFin(grupo.hora_fin || '')
    setFecha(grupo.fecha || '')
    setRecurrente(grupo.recurrente)
    setDiaSemana(grupo.dia_semana || 0)
    setInstructorNombre(grupo.instructor_nombre || '')
    setInstructorTitulo(grupo.instructor_titulo || '')
    setInstructorExperiencia(grupo.instructor_experiencia || '')
    setMostrarPasswordModal(true)
  }

  const abrirModalCrear = () => {
    setAccionPendiente('crear')
    setMostrarPasswordModal(true)
  }

  const manejarArchivo = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImagen(e.target.files[0])
  }

  const validarPassword = () => {
    if (passwordInput === PASSWORD_CORRECTA) {
      setMostrarPasswordModal(false)
      setPasswordInput('')
      if (accionPendiente === 'crear') setOpen(true)
      else if (accionPendiente === 'editar') setOpen(true)
      else if (accionPendiente === 'eliminar') confirmarEliminar()
    } else {
      toast.error('Contraseña incorrecta ❌')
    }
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

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mis Grupos</h1>
        <Button onClick={abrirModalCrear} className="bg-indigo-600 text-white flex items-center gap-2">
          <Plus size={18} /> Nuevo Grupo
        </Button>
      </div>

      {/* Modal de contraseña */}
      <Dialog open={mostrarPasswordModal} onOpenChange={setMostrarPasswordModal}>
        <DialogContent className="sm:max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Lock size={20} /> Verificación requerida
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <Input
              type="password"
              placeholder="Introduce la contraseña"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMostrarPasswordModal(false)}>
                Cancelar
              </Button>
              <Button onClick={validarPassword} className="bg-indigo-600 text-white">
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Crear/Editar */}
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto p-4 rounded-lg">
    <DialogHeader>
      <DialogTitle className="text-lg sm:text-xl text-center">
        {editando ? 'Editar Grupo' : 'Crear Nuevo Grupo'}
      </DialogTitle>
    </DialogHeader>

    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <label className="flex flex-col text-sm sm:text-base">
        Nombre del grupo
        <Input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="mt-1 text-sm sm:text-base"
        />
      </label>

      <label className="flex flex-col text-sm sm:text-base">
        Link de Meet
        <Input
          value={meetlink}
          onChange={(e) => setMeetLink(e.target.value)}
          required
          className="mt-1 text-sm sm:text-base"
        />
      </label>

      <label className="flex flex-col text-sm sm:text-base">
        Nombre del instructor
        <Input
          value={instructorNombre}
          onChange={(e) => setInstructorNombre(e.target.value)}
          required
          className="mt-1 text-sm sm:text-base"
        />
      </label>

      <label className="flex flex-col text-sm sm:text-base">
        Título del instructor
        <Input
          value={instructorTitulo}
          onChange={(e) => setInstructorTitulo(e.target.value)}
          required
          className="mt-1 text-sm sm:text-base"
        />
      </label>

      <label className="flex flex-col text-sm sm:text-base">
        Experiencia del instructor
        <Input
          value={instructorExperiencia}
          onChange={(e) => setInstructorExperiencia(e.target.value)}
          required
          className="mt-1 text-sm sm:text-base"
        />
      </label>

      <label className="flex items-center gap-2 text-sm sm:text-base">
        <input
          type="checkbox"
          checked={recurrente}
          onChange={(e) => setRecurrente(e.target.checked)}
          className="w-4 h-4"
        />
        Grupo recurrente
      </label>

      {!recurrente && (
        <label className="flex flex-col text-sm sm:text-base">
          Fecha
          <Input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="mt-1 text-sm sm:text-base"
          />
        </label>
      )}

      <label className="flex flex-col text-sm sm:text-base">
        Hora inicio
        <Input
          type="time"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
          className="mt-1 text-sm sm:text-base"
        />
      </label>

      <label className="flex flex-col text-sm sm:text-base">
        Hora fin
        <Input
          type="time"
          value={horaFin}
          onChange={(e) => setHoraFin(e.target.value)}
          className="mt-1 text-sm sm:text-base"
        />
      </label>

      {recurrente && (
        <label className="flex flex-col text-sm sm:text-base">
          Día de la semana
          <select
            value={diaSemana}
            onChange={(e) => setDiaSemana(parseInt(e.target.value))}
            className="p-2 border rounded-md mt-1 text-sm sm:text-base"
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

      <label className="flex flex-col text-sm sm:text-base">
        Portada
        <Input
          type="file"
          accept="image/*"
          onChange={manejarArchivo}
          className="mt-1 text-sm sm:text-base"
        />
      </label>

      <Button
        type="submit"
        disabled={cargando}
        className="bg-indigo-600 text-white mt-2 py-2 sm:py-3 text-sm sm:text-base"
      >
        {cargando ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Crear Grupo'}
      </Button>
    </form>
  </DialogContent>
</Dialog>


      {/* Lista de grupos */}
      {grupos.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">Aún no tienes grupos creados</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {grupos
            .sort((a, b) => {
              const hoy = new Date()
              const proxDia = (grupo: Grupo) => {
                if (grupo.recurrente && grupo.dia_semana !== null) {
                  const diff = (grupo.dia_semana - hoy.getDay() + 7) % 7
                  return diff === 0 ? 0 : diff
                }
                if (grupo.fecha) {
                  const [anio, mes, dia] = grupo.fecha.split('-').map(Number)
                  const fechaGrupo = new Date(anio, mes - 1, dia)
                  const diff = Math.floor((fechaGrupo.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
                  return diff >= 0 ? diff : 9999
                }
                return 9999
              }
              return proxDia(a) - proxDia(b)
            })
            .map((grupo) => {
              const hoy = (() => {
                const fechaActual = new Date()
                if (grupo.recurrente && grupo.dia_semana === fechaActual.getDay()) return true
                if (grupo.fecha) {
                  const [anio, mes, dia] = grupo.fecha.split('-').map(Number)
                  const fechaGrupo = new Date(anio, mes - 1, dia)
                  return (
                    fechaGrupo.getDate() === fechaActual.getDate() &&
                    fechaGrupo.getMonth() === fechaActual.getMonth() &&
                    fechaGrupo.getFullYear() === fechaActual.getFullYear()
                  )
                }
                return false
              })()

              return (
                <div
                  key={grupo.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition relative"
                >
                  {grupo.imagen && <img src={grupo.imagen} alt={grupo.nombre} className="w-full h-40 object-cover" />}

                  {hoy && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-black px-3 py-1 text-xs font-bold rounded-full shadow-md">
                      Hoy
                    </span>
                  )}

                  <div
                    className={`p-6 flex flex-col justify-between transition ${
                      hoy ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'
                    }`}
                  >
                    <div>
                      <h2 className="font-semibold text-lg mb-2">{grupo.nombre}</h2>
                      <p className="text-sm mb-1">
                        {grupo.recurrente
                          ? `Recurrente cada ${['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][grupo.dia_semana || 0]}`
                          : `Fecha: ${grupo.fecha}`}
                      </p>
                      <p className="text-sm mb-1">
                        {grupo.hora_inicio && grupo.hora_fin
                          ? `Horario: ${grupo.hora_inicio} - ${grupo.hora_fin}`
                          : 'Horario no definido'}
                      </p>
                      {grupo.instructor_nombre && (
                        <div className="text-sm mt-2">
                          <p className="font-medium">{grupo.instructor_nombre}</p>
                          <p>{grupo.instructor_titulo}</p>
                          <p className={hoy ? 'text-indigo-100' : 'text-gray-500'}>{grupo.instructor_experiencia}</p>
                        </div>
                      )}
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
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
