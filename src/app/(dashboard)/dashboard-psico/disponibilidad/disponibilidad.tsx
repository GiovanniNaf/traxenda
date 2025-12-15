'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Calendar, Clock, Plus, Edit2, Trash2, Save, User, Briefcase, GraduationCap } from 'lucide-react'

interface Disponibilidad {
  id: number
  perfil_id: number
  dia_semana: number
  hora_inicio: string
  hora_fin: string
}

interface FechaEspecial {
  id: number
  perfil_id: number
  fecha: string
  tipo: 'disponible' | 'bloqueado'
  hora_inicio?: string
  hora_fin?: string
  motivo?: string
}

interface PsicologoPerfil {
  id?: number
  perfil_id: number
  nombre: string
  apellido: string
  edad: number | null
  sexo: string | null
  nivel_estudios: string | null
  especialidad: string | null
  anios_experiencia: number | null
  perfil_completo: boolean
}

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function DisponibilidadPsicologo() {
  const { user, isLoaded } = useUser()
  const [vistaActual, setVistaActual] = useState<'semanal' | 'especial'>('semanal')
  const [perfilId, setPerfilId] = useState<number | null>(null)
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>([])
  const [fechasEspeciales, setFechasEspeciales] = useState<FechaEspecial[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Disponibilidad | null>(null)
  const [cargando, setCargando] = useState(false)
  
  // Estados para horario semanal
  const [diaSeleccionado, setDiaSeleccionado] = useState<number>(1)
  const [horaInicio, setHoraInicio] = useState('08:00')
  const [horaFin, setHoraFin] = useState('17:00')
  
  // Estados para fechas especiales
  const [fechaEspecial, setFechaEspecial] = useState('')
  const [tipoFecha, setTipoFecha] = useState<'disponible' | 'bloqueado'>('disponible')
  const [motivoBloqueo, setMotivoBloqueo] = useState('')

  // Estados para completar perfil
  const [perfilPsicologo, setPerfilPsicologo] = useState<PsicologoPerfil | null>(null)
  const [modalPerfilAbierto, setModalPerfilAbierto] = useState(false)
  const [guardandoPerfil, setGuardandoPerfil] = useState(false)
  
  // Estados del formulario de perfil
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    sexo: '',
    nivel_estudios: '',
    especialidad: '',
    anios_experiencia: ''
  })

  // Obtener perfil y disponibilidades
  useEffect(() => {
    if (!isLoaded || !user) return
    cargarDatos()
  }, [isLoaded, user])

  const cargarDatos = async () => {
    try {
      const { data: perfil, error: errorPerfil } = await supabase
        .from('perfiles')
        .select('id')
        .eq('clerk_id', user!.id)
        .single()

      if (errorPerfil || !perfil) {
        console.error('Error al obtener perfil:', errorPerfil)
        return
      }

      setPerfilId(perfil.id)
      
      // Cargar perfil del psicólogo
      await cargarPerfilPsicologo(perfil.id)
      
      // Si el perfil está completo, cargar disponibilidades
      if (perfilPsicologo?.perfil_completo) {
        await cargarDisponibilidades(perfil.id)
        await cargarFechasEspeciales(perfil.id)
      }
    } catch (error) {
      console.error('Error al cargar datos:', error)
    }
  }

  const cargarPerfilPsicologo = async (perfilId: number) => {
    try {
      const { data, error } = await supabase
        .from('psicologos')
        .select('*')
        .eq('perfil_id', perfilId)
        .maybeSingle()

      if (error) {
        console.error('Error al cargar perfil psicólogo:', error)
        return
      }

      if (data) {
        setPerfilPsicologo(data as PsicologoPerfil)
        // Si el perfil existe, cargar datos en el formulario
        setFormData({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          edad: data.edad?.toString() || '',
          sexo: data.sexo || '',
          nivel_estudios: data.nivel_estudios || '',
          especialidad: data.especialidad || '',
          anios_experiencia: data.anios_experiencia?.toString() || ''
        })
      } else {
        // Si no existe, crear objeto vacío
        setPerfilPsicologo({
          perfil_id: perfilId,
          nombre: '',
          apellido: '',
          edad: null,
          sexo: null,
          nivel_estudios: null,
          especialidad: null,
          anios_experiencia: null,
          perfil_completo: false
        })
      }
    } catch (error) {
      console.error('Error cargarPerfilPsicologo:', error)
    }
  }

  const cargarDisponibilidades = async (perfilId: number) => {
    const { data, error } = await supabase
      .from('disponibilidades_psicologos')
      .select('*')
      .eq('perfil_id', perfilId)
      .order('dia_semana', { ascending: true })

    if (error) {
      console.error('Error al cargar disponibilidades:', error)
      return
    }

    setDisponibilidades(data as Disponibilidad[])
  }

  const cargarFechasEspeciales = async (perfilId: number) => {
    const { data, error } = await supabase
      .from('fechas_especiales_psicologos')
      .select('*')
      .eq('perfil_id', perfilId)
      .order('fecha', { ascending: true })

    if (error) {
      console.error('Error al cargar fechas especiales:', error)
      return
    }

    setFechasEspeciales(data as FechaEspecial[])
  }

  // Función para guardar/actualizar perfil del psicólogo
  const guardarPerfil = async () => {
    if (!perfilId) {
      toast.error('Perfil no encontrado')
      return
    }

    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      toast.error('Nombre y apellido son obligatorios')
      return
    }

    if (!formData.edad || parseInt(formData.edad) < 18 || parseInt(formData.edad) > 100) {
      toast.error('Edad debe ser entre 18 y 100 años')
      return
    }

    if (!formData.sexo) {
      toast.error('Selecciona tu sexo')
      return
    }

    if (!formData.nivel_estudios.trim()) {
      toast.error('Nivel de estudios es obligatorio')
      return
    }

    if (!formData.especialidad.trim()) {
      toast.error('Especialidad es obligatoria')
      return
    }

    if (!formData.anios_experiencia || parseInt(formData.anios_experiencia) < 0) {
      toast.error('Años de experiencia debe ser un número positivo')
      return
    }

    setGuardandoPerfil(true)

    try {
      const perfilData = {
        perfil_id: perfilId,
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        edad: parseInt(formData.edad),
        sexo: formData.sexo,
        nivel_estudios: formData.nivel_estudios.trim(),
        especialidad: formData.especialidad.trim(),
        anios_experiencia: parseInt(formData.anios_experiencia),
        perfil_completo: true
      }

      let error
      
      if (perfilPsicologo?.id) {
        // Actualizar perfil existente
        const { error: updateError } = await supabase
          .from('psicologos')
          .update(perfilData)
          .eq('id', perfilPsicologo.id)

        error = updateError
      } else {
        // Crear nuevo perfil
        const { error: insertError } = await supabase
          .from('psicologos')
          .insert([perfilData])

        error = insertError
      }

      if (error) throw error

      toast.success('¡Perfil completado exitosamente! ✅')
      setModalPerfilAbierto(false)
      
      // Recargar datos
      await cargarPerfilPsicologo(perfilId)
      
      // Cargar disponibilidades después de completar perfil
      await cargarDisponibilidades(perfilId)
      await cargarFechasEspeciales(perfilId)

    } catch (error) {
      console.error('Error al guardar perfil:', error)
      toast.error('Error al guardar el perfil')
    } finally {
      setGuardandoPerfil(false)
    }
  }

  const guardarHorarioSemanal = async () => {
    if (!perfilId) {
      toast.error('Perfil no encontrado')
      return
    }

    if (!horaInicio || !horaFin) {
      toast.error('Selecciona horas válidas')
      return
    }

    if (horaInicio >= horaFin) {
      toast.error('La hora de inicio debe ser menor que la hora de fin')
      return
    }

    setCargando(true)

    try {
      if (editando) {
        // Actualizar horario existente
        const { error } = await supabase
          .from('disponibilidades_psicologos')
          .update({
            hora_inicio: horaInicio,
            hora_fin: horaFin
          })
          .eq('id', editando.id)

        if (error) throw error

        setDisponibilidades(disponibilidades.map(d =>
          d.id === editando.id
            ? { ...d, hora_inicio: horaInicio, hora_fin: horaFin }
            : d
        ))
        toast.success('Disponibilidad actualizada ✅')
      } else {
        // Verificar si ya existe disponibilidad para ese día
        const existe = disponibilidades.find(d => d.dia_semana === diaSeleccionado)
        if (existe) {
          toast.error('Ya existe disponibilidad para este día')
          setCargando(false)
          return
        }

        // Crear nueva disponibilidad
        const { data, error } = await supabase
          .from('disponibilidades_psicologos')
          .insert([{
            perfil_id: perfilId,
            dia_semana: diaSeleccionado,
            hora_inicio: horaInicio,
            hora_fin: horaFin
          }])
          .select()
          .single()

        if (error) throw error

        setDisponibilidades([...disponibilidades, data as Disponibilidad])
        toast.success('Disponibilidad guardada ✅')
      }

      cerrarModal()
    } catch (error) {
      console.error('Error al guardar:', error)
      toast.error('Error al guardar la disponibilidad')
    } finally {
      setCargando(false)
    }
  }

  const guardarFechaEspecial = async () => {
    if (!perfilId) {
      toast.error('Perfil no encontrado')
      return
    }

    if (!fechaEspecial) {
      toast.error('Selecciona una fecha')
      return
    }

    if (tipoFecha === 'bloqueado' && !motivoBloqueo.trim()) {
      toast.error('Indica el motivo del bloqueo')
      return
    }

    if (tipoFecha === 'disponible' && (!horaInicio || !horaFin)) {
      toast.error('Selecciona las horas para el día disponible')
      return
    }

    if (tipoFecha === 'disponible' && horaInicio >= horaFin) {
      toast.error('La hora de inicio debe ser menor que la hora de fin')
      return
    }

    setCargando(true)

    try {
      const nuevaFecha = {
        perfil_id: perfilId,
        fecha: fechaEspecial,
        tipo: tipoFecha,
        hora_inicio: tipoFecha === 'disponible' ? horaInicio : null,
        hora_fin: tipoFecha === 'disponible' ? horaFin : null,
        motivo: tipoFecha === 'bloqueado' ? motivoBloqueo : null
      }

      const { data, error } = await supabase
        .from('fechas_especiales_psicologos')
        .insert([nuevaFecha])
        .select()
        .single()

      if (error) throw error

      setFechasEspeciales([...fechasEspeciales, data as FechaEspecial].sort((a, b) =>
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      ))
      toast.success('Fecha especial guardada ✅')
      cerrarModal()
    } catch (error) {
      console.error('Error al guardar fecha especial:', error)
      toast.error('Error al guardar la fecha especial')
    } finally {
      setCargando(false)
    }
  }

  const eliminarDisponibilidad = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta disponibilidad?')) return

    try {
      const { error } = await supabase
        .from('disponibilidades_psicologos')
        .delete()
        .eq('id', id)

      if (error) throw error

      setDisponibilidades(disponibilidades.filter(d => d.id !== id))
      toast.success('Disponibilidad eliminada ✅')
    } catch (error) {
      console.error('Error al eliminar:', error)
      toast.error('Error al eliminar la disponibilidad')
    }
  }

  const eliminarFechaEspecial = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta fecha especial?')) return

    try {
      const { error } = await supabase
        .from('fechas_especiales_psicologos')
        .delete()
        .eq('id', id)

      if (error) throw error

      setFechasEspeciales(fechasEspeciales.filter(f => f.id !== id))
      toast.success('Fecha especial eliminada ✅')
    } catch (error) {
      console.error('Error al eliminar:', error)
      toast.error('Error al eliminar la fecha especial')
    }
  }

  const abrirEditar = (item: Disponibilidad) => {
    setEditando(item)
    setDiaSeleccionado(item.dia_semana)
    setHoraInicio(item.hora_inicio)
    setHoraFin(item.hora_fin)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setEditando(null)
    setDiaSeleccionado(1)
    setHoraInicio('08:00')
    setHoraFin('17:00')
    setFechaEspecial('')
    setTipoFecha('disponible')
    setMotivoBloqueo('')
  }

  const abrirNuevo = () => {
    cerrarModal()
    setModalAbierto(true)
  }

  const abrirModalPerfil = () => {
    setModalPerfilAbierto(true)
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const diasDisponibles = diasSemana.filter((_, i) =>
    !disponibilidades.some(d => d.dia_semana === i) || editando?.dia_semana === i
  )

  if (!isLoaded || !perfilId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Clock className="animate-spin mx-auto text-indigo-600 mb-4" size={48} />
          <p className="text-gray-600">Cargando disponibilidad...</p>
        </div>
      </div>
    )
  }

  // Si el perfil no está completo, mostrar el botón para completarlo
  if (!perfilPsicologo?.perfil_completo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Calendar className="text-indigo-600" size={32} />
              Gestión de Disponibilidad
            </h1>
            <p className="text-gray-600 mt-2">Configura tus horarios de atención y fechas especiales</p>
          </div>

          {/* Card para completar perfil */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-6">
              <User className="text-yellow-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ¡Primero completa tu perfil de psicólogo!
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Para poder configurar tu disponibilidad y empezar a recibir citas, 
              necesitamos que completes tu información profesional.
            </p>
            <Button
              onClick={abrirModalPerfil}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 text-lg"
            >
              <User className="mr-2" size={24} />
              Completar Perfil
            </Button>
            <p className="text-gray-500 text-sm mt-4">
              Esta información nos ayudará a asignarte pacientes adecuados
            </p>
          </div>

          {/* Modal para completar perfil */}
          <Dialog open={modalPerfilAbierto} onOpenChange={setModalPerfilAbierto}>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-3">
                  <User className="text-indigo-600" size={24} />
                  Completa tu perfil profesional
                </DialogTitle>
                <DialogDescription>
                  Esta información será visible para tus pacientes y nos ayudará a hacer mejores asignaciones.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Información Personal */}
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <User size={18} className="text-indigo-600" />
                    Información Personal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <Input
                        type="text"
                        value={formData.nombre}
                        onChange={e => handleFormChange('nombre', e.target.value)}
                        placeholder="Tu nombre"
                        disabled={guardandoPerfil}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Apellido *
                      </label>
                      <Input
                        type="text"
                        value={formData.apellido}
                        onChange={e => handleFormChange('apellido', e.target.value)}
                        placeholder="Tu apellido"
                        disabled={guardandoPerfil}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Edad *
                      </label>
                      <Input
                        type="number"
                        value={formData.edad}
                        onChange={e => handleFormChange('edad', e.target.value)}
                        min="18"
                        max="100"
                        placeholder="Ej: 30"
                        disabled={guardandoPerfil}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sexo *
                      </label>
                      <select
                        value={formData.sexo}
                        onChange={e => handleFormChange('sexo', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={guardandoPerfil}
                      >
                        <option value="">Seleccionar</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Información Profesional */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <GraduationCap size={18} className="text-purple-600" />
                    Información Profesional
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nivel de Estudios *
                      </label>
                      <Input
                        type="text"
                        value={formData.nivel_estudios}
                        onChange={e => handleFormChange('nivel_estudios', e.target.value)}
                        placeholder="Ej: Maestría en Psicología Clínica"
                        disabled={guardandoPerfil}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Especialidad *
                      </label>
                      <Input
                        type="text"
                        value={formData.especialidad}
                        onChange={e => handleFormChange('especialidad', e.target.value)}
                        placeholder="Ej: Terapia Cognitivo-Conductual"
                        disabled={guardandoPerfil}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Años de Experiencia *
                    </label>
                    <Input
                      type="number"
                      value={formData.anios_experiencia}
                      onChange={e => handleFormChange('anios_experiencia', e.target.value)}
                      min="0"
                      max="50"
                      placeholder="Ej: 5"
                      disabled={guardandoPerfil}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Briefcase size={18} className="text-blue-600" />
                    Tu disponibilidad
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Una vez que completes tu perfil, podrás configurar tus horarios de atención 
                    semanales y fechas especiales donde estarás disponible o no.
                  </p>
                </div>

                <Button
                  onClick={guardarPerfil}
                  disabled={guardandoPerfil}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 text-lg"
                >
                  {guardandoPerfil ? (
                    <>
                      <Clock className="animate-spin mr-2" size={20} />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={20} className="mr-2" />
                      Completar Perfil y Continuar
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  // Si el perfil está completo, mostrar la gestión de disponibilidad
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Calendar className="text-indigo-600" size={32} />
                Gestión de Disponibilidad
              </h1>
              <p className="text-gray-600 mt-2">Configura tus horarios de atención y fechas especiales</p>
              
              {/* Mostrar información del psicólogo */}
              <div className="mt-4 bg-indigo-50 rounded-xl p-3 inline-flex items-center gap-3">
                <User className="text-indigo-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Psicólogo:</p>
                  <p className="font-bold text-gray-800">
                    {perfilPsicologo?.nombre} {perfilPsicologo?.apellido}
                    {perfilPsicologo?.especialidad && (
                      <span className="text-indigo-600 ml-2">• {perfilPsicologo.especialidad}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={abrirModalPerfil}
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            >
              <Edit2 size={18} className="mr-2" />
              Editar Perfil
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 flex gap-2">
          <button
            onClick={() => setVistaActual('semanal')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              vistaActual === 'semanal'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock size={20} />
            Horario Semanal
          </button>
          <button
            onClick={() => setVistaActual('especial')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              vistaActual === 'especial'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar size={20} />
            Fechas Especiales
          </button>
        </div>

        {/* Botón Agregar */}
        <Button
          onClick={abrirNuevo}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white mb-6 h-14"
        >
          <Plus size={24} className="mr-2" />
          {vistaActual === 'semanal' ? 'Agregar Día Disponible' : 'Agregar Fecha Especial'}
        </Button>

        {/* Vista Semanal */}
        {vistaActual === 'semanal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disponibilidades.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl shadow p-8 text-center">
                <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No hay horarios configurados</p>
                <p className="text-gray-400 mt-2">Agrega tus días y horarios de atención</p>
              </div>
            ) : (
              disponibilidades.sort((a, b) => a.dia_semana - b.dia_semana).map(d => (
                <div key={d.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-5 border-l-4 border-indigo-500">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{diasSemana[d.dia_semana]}</h3>
                      <p className="text-gray-500 text-sm mt-1">Horario recurrente</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => abrirEditar(d)}
                        className="p-2 h-auto"
                      >
                        <Edit2 size={16} className="text-indigo-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarDisponibilidad(d.id)}
                        className="p-2 h-auto"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 bg-indigo-50 rounded-lg p-3">
                    <Clock size={18} className="text-indigo-600" />
                    <span className="font-semibold">{d.hora_inicio} - {d.hora_fin}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Vista Fechas Especiales */}
        {vistaActual === 'especial' && (
          <div className="space-y-4">
            {fechasEspeciales.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No hay fechas especiales</p>
                <p className="text-gray-400 mt-2">Agrega fechas bloqueadas o con horarios especiales</p>
              </div>
            ) : (
              fechasEspeciales.map(f => (
                <div
                  key={f.id}
                  className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-5 border-l-4 ${
                    f.tipo === 'bloqueado' ? 'border-red-500' : 'border-green-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          f.tipo === 'bloqueado'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {f.tipo === 'bloqueado' ? '🚫 Bloqueado' : '✅ Disponible'}
                        </span>
                        <span className="text-gray-700 font-semibold">
                          {new Date(f.fecha + 'T00:00:00').toLocaleDateString('es-MX', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      {f.tipo === 'disponible' && f.hora_inicio && f.hora_fin && (
                        <div className="flex items-center gap-2 text-gray-700 bg-green-50 rounded-lg p-3 mt-2">
                          <Clock size={18} className="text-green-600" />
                          <span className="font-semibold">{f.hora_inicio} - {f.hora_fin}</span>
                        </div>
                      )}
                      {f.tipo === 'bloqueado' && f.motivo && (
                        <p className="text-gray-600 mt-2 bg-red-50 p-3 rounded-lg">
                          <span className="font-semibold">Motivo:</span> {f.motivo}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarFechaEspecial(f.id)}
                      className="p-2 h-auto ml-4"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal para disponibilidad */}
        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editando ? 'Editar' : 'Agregar'} {vistaActual === 'semanal' ? 'Horario' : 'Fecha Especial'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {vistaActual === 'semanal' ? (
                <>
                  {!editando && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Día de la semana
                      </label>
                      <select
                        value={diaSeleccionado}
                        onChange={e => setDiaSeleccionado(parseInt(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={cargando}
                      >
                        {diasSemana.map((dia, i) =>
                          diasDisponibles.includes(dia) ? (
                            <option key={i} value={i}>{dia}</option>
                          ) : null
                        )}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hora de inicio
                    </label>
                    <Input
                      type="time"
                      value={horaInicio}
                      onChange={e => setHoraInicio(e.target.value)}
                      disabled={cargando}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hora de fin
                    </label>
                    <Input
                      type="time"
                      value={horaFin}
                      onChange={e => setHoraFin(e.target.value)}
                      disabled={cargando}
                    />
                  </div>
                  <Button
                    onClick={guardarHorarioSemanal}
                    disabled={cargando}
                    className="w-full bg-indigo-600"
                  >
                    {cargando ? (
                      <>
                        <Clock className="animate-spin mr-2" size={20} />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save size={20} className="mr-2" />
                        Guardar Horario
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha
                    </label>
                    <Input
                      type="date"
                      value={fechaEspecial}
                      onChange={e => setFechaEspecial(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      disabled={cargando}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo
                    </label>
                    <select
                      value={tipoFecha}
                      onChange={e => setTipoFecha(e.target.value as 'disponible' | 'bloqueado')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={cargando}
                    >
                      <option value="disponible">Día disponible (horario especial)</option>
                      <option value="bloqueado">Día bloqueado</option>
                    </select>
                  </div>
                  {tipoFecha === 'disponible' ? (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Hora de inicio
                        </label>
                        <Input
                          type="time"
                          value={horaInicio}
                          onChange={e => setHoraInicio(e.target.value)}
                          disabled={cargando}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Hora de fin
                        </label>
                        <Input
                          type="time"
                          value={horaFin}
                          onChange={e => setHoraFin(e.target.value)}
                          disabled={cargando}
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Motivo del bloqueo
                      </label>
                      <Input
                        type="text"
                        value={motivoBloqueo}
                        onChange={e => setMotivoBloqueo(e.target.value)}
                        placeholder="Ej: Vacaciones, Conferencia, etc."
                        disabled={cargando}
                      />
                    </div>
                  )}
                  <Button
                    onClick={guardarFechaEspecial}
                    disabled={cargando}
                    className="w-full bg-indigo-600"
                  >
                    {cargando ? (
                      <>
                        <Clock className="animate-spin mr-2" size={20} />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save size={20} className="mr-2" />
                        Guardar Fecha
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}