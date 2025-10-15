'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Disponibilidad {
  id: number
  perfil_id: number
  dia_semana: number
  hora_inicio: string
  hora_fin: string
}

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function DisponibilidadPsicologo() {
  const { user, isLoaded } = useUser()
  const [perfilId, setPerfilId] = useState<number | null>(null)
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>([])
  const [diaSeleccionado, setDiaSeleccionado] = useState<number>(1)
  const [horaInicio, setHoraInicio] = useState('08:00')
  const [horaFin, setHoraFin] = useState('17:00')
  const [cargando, setCargando] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [editando, setEditando] = useState<Disponibilidad | null>(null)

  // Obtener perfil y disponibilidades
  useEffect(() => {
    if (!isLoaded || !user) return

    const fetchPerfil = async () => {
      const { data, error } = await supabase.from('perfiles').select('id').eq('clerk_id', user.id).single()
      if (error || !data) return console.error(error)
      setPerfilId(data.id)
      fetchDisponibilidades(data.id)
    }

    const fetchDisponibilidades = async (perfilId: number) => {
      const { data, error } = await supabase
        .from('disponibilidades_psicologos')
        .select('*')
        .eq('perfil_id', perfilId)
        .order('dia_semana', { ascending: true })
      if (error) return console.error(error)
      setDisponibilidades(data as Disponibilidad[])
    }

    fetchPerfil()
  }, [isLoaded, user])

  // Guardar nueva disponibilidad o editar existente
  const guardarDisponibilidad = async () => {
    if (!perfilId) return toast.error('Perfil no encontrado')
    if (!horaInicio || !horaFin) return toast.error('Selecciona horas válidas')

    setCargando(true)

    if (editando) {
      // 🔹 Editar horario existente
      const { error } = await supabase
        .from('disponibilidades_psicologos')
        .update({ hora_inicio: horaInicio, hora_fin: horaFin })
        .eq('id', editando.id)

      setCargando(false)

      if (error) toast.error('Error al actualizar')
      else {
        setDisponibilidades(disponibilidades.map(d =>
          d.id === editando.id ? { ...d, hora_inicio: horaInicio, hora_fin: horaFin } : d
        ))
        toast.success('Disponibilidad actualizada ✅')
        setOpenModal(false)
        setEditando(null)
      }
    } else {
      // 🔹 Nueva disponibilidad
      if (disponibilidades.find(d => d.dia_semana === diaSeleccionado)) {
        setCargando(false)
        return toast.error('Ya existe disponibilidad para este día')
      }

      const { data, error } = await supabase
        .from('disponibilidades_psicologos')
        .insert([{ perfil_id: perfilId, dia_semana: diaSeleccionado, hora_inicio: horaInicio, hora_fin: horaFin }])
        .select()
        .single()

      setCargando(false)

      if (error) toast.error('Error al guardar disponibilidad')
      else {
        setDisponibilidades([...disponibilidades, data as Disponibilidad])
        toast.success('Disponibilidad guardada ✅')
        setOpenModal(false)
      }
    }
  }

  // Eliminar disponibilidad
  const eliminarDisponibilidad = async (id: number) => {
    toast.info('Eliminando disponibilidad...')
    const { error } = await supabase.from('disponibilidades_psicologos').delete().eq('id', id)

    if (error) toast.error('Error al eliminar')
    else {
      setDisponibilidades(disponibilidades.filter(d => d.id !== id))
      toast.success('Disponibilidad eliminada ✅')
    }
  }

  // Abrir modal de edición
  const abrirEditar = (d: Disponibilidad) => {
    setEditando(d)
    setHoraInicio(d.hora_inicio)
    setHoraFin(d.hora_fin)
    setOpenModal(true)
  }

  // Abrir modal de nueva disponibilidad
  const abrirNuevo = () => {
    setEditando(null)
    setHoraInicio('08:00')
    setHoraFin('17:00')
    setOpenModal(true)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Disponibilidad de Atención</h1>

      <Button className="bg-indigo-600 text-white mb-6" onClick={abrirNuevo}>
        Agregar Disponibilidad
      </Button>

      {/* Lista de disponibilidades */}
      {disponibilidades.length === 0 ? (
        <p className="text-gray-500">Aún no tienes horarios disponibles</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {disponibilidades.map(d => (
            <div key={d.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{diasSemana[d.dia_semana]}</p>
                <p className="text-gray-500">{d.hora_inicio} - {d.hora_fin}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => abrirEditar(d)}>Editar</Button>
                <Button variant="destructive" size="sm" onClick={() => eliminarDisponibilidad(d.id)}>Eliminar</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para agregar/editar */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar Disponibilidad' : 'Nueva Disponibilidad'}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">
            {/* Día solo aparece al agregar */}
            {!editando && (
              <label className="flex flex-col">
                Día
                <select
                  className="p-2 border rounded-md"
                  value={diaSeleccionado}
                  onChange={e => setDiaSeleccionado(parseInt(e.target.value))}
                >
                  {diasSemana.map((dia, i) => {
                    const existe = disponibilidades.some(d => d.dia_semana === i)
                    return !existe ? <option key={i} value={i}>{dia}</option> : null
                  })}
                </select>
              </label>
            )}

            <label className="flex flex-col">
              Hora inicio
              <Input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
            </label>

            <label className="flex flex-col">
              Hora fin
              <Input type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)} />
            </label>

            <Button
              onClick={guardarDisponibilidad}
              disabled={cargando}
              className="bg-indigo-600 text-white"
            >
              {cargando ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Guardar Disponibilidad'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
