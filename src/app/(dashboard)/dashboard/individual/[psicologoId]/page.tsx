'use client'

import { useState } from 'react'

type Props = {
  params: {
    psicologoId: string
  }
}

const psicologos = [
  {
    id: 1,
    nombre: 'Dra. Ana María López',
    especialidad: 'Ansiedad y manejo del estrés',
    horario: '10:00 AM - 4:00 PM',
    estudios: 'Doctorado en Psicología Clínica por la UNAM',
    experiencia: '10 años de experiencia en tratamiento de ansiedad y estrés.',
  },
  {
    id: 2,
    nombre: 'Dr. Jorge Martínez',
    especialidad: 'Depresión y autoestima',
    horario: '2:00 PM - 8:00 PM',
    estudios: 'Maestría en Psicoterapia Humanista en la UAM',
    experiencia: 'Especializado en jóvenes y adultos con baja autoestima.',
  },
  {
    id: 3,
    nombre: 'Lic. Karla Torres',
    especialidad: 'Relaciones de pareja',
    horario: '9:00 AM - 1:00 PM',
    estudios: 'Lic. en Psicología por el ITESO',
    experiencia: 'Amplia experiencia en terapia de pareja y resolución de conflictos.',
  },
]

export default function PsicologoDetailPage({ params }: Props) {
  const id = parseInt(params.psicologoId)
  const psicologo = psicologos.find(p => p.id === id)

  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')

  if (!psicologo) {
    return <div className="p-6 text-red-600">Psicólogo no encontrado.</div>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Sesión agendada con ${psicologo.nombre} el ${fecha} a las ${hora}`)
    // Aquí puedes enviar los datos a Supabase o guardar en otro sistema
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700">
        Agendar sesión con {psicologo.nombre}
      </h1>

      <div className="space-y-2 text-gray-700">
        <p><strong>Especialidad:</strong> {psicologo.especialidad}</p>
        <p><strong>Horario disponible:</strong> {psicologo.horario}</p>
        <p><strong>Estudios:</strong> {psicologo.estudios}</p>
        <p><strong>Experiencia:</strong> {psicologo.experiencia}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-indigo-600">Selecciona fecha y hora</h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Hora</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Confirmar cita
        </button>
      </form>
    </div>
  )
}
