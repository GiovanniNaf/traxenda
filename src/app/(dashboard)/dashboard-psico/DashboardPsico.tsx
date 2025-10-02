
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, Lightbulb, Mic } from 'lucide-react'

const DashboardPsico = () => {
  const citasHoy = [
    { paciente: 'Juan Pérez', hora: '10:00 AM' },
    { paciente: 'María López', hora: '11:30 AM' },
    { paciente: 'Carlos Gómez', hora: '2:00 PM' },
  ]

  const sugerencias = [
    'Pide retroalimentación después de cada sesión.',
    'Mantén actualizado tu horario de disponibilidad.',
    'Comparte recursos útiles con tus pacientes.',
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700">Panel de Psicólogo</h1>

      {/* Citas del día */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-600">
            <CalendarDays className="w-5 h-5" /> Citas programadas para hoy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {citasHoy.length > 0 ? (
            citasHoy.map((cita, i) => (
              <div key={i} className="flex justify-between border-b py-2">
                <span className="font-medium">{cita.paciente}</span>
                <span className="text-sm text-gray-500">{cita.hora}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No hay citas para hoy.</p>
          )}
        </CardContent>
      </Card>

      {/* Sugerencias para mejorar puntuación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-600">
            <Lightbulb className="w-5 h-5" /> Sugerencias para mejorar tu puntuación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-disc list-inside text-sm text-gray-700">
            {sugerencias.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Podcast del día */}
      <Card className="bg-gradient-to-r from-indigo-100 to-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <Mic className="w-5 h-5" /> Podcast del día
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold">Escuchar activamente en sesiones difíciles</h3>
          <p className="text-sm text-gray-600 mb-2">
            Descubre herramientas prácticas para conectar mejor con tus pacientes.
          </p>
          <Button variant="outline" className="text-indigo-700 border-indigo-500 hover:bg-indigo-100">
            Escuchar ahora
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPsico
