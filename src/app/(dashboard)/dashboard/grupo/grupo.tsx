import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Protect } from '@clerk/nextjs'

// Página de "Cursos en Adicciones" con el mismo diseño,
// pero usando la imagen como fondo que cubre la altura completa de la card.
// - Mantiene estética con Tailwind + shadcn/ui
// - Fondo con overlay para legibilidad
// - Responsive grid

const cursos = [
  {
    id: 1,
    titulo: 'Prevención de Adicciones',
    descripcion:
      'Identifica factores de riesgo y aplica estrategias preventivas basadas en evidencia.',
    duracion: '4 semanas',
    imagen: '/img/curso1.jpg',
    enlace: '/cursos/prevencion-adicciones',
  },
  {
    id: 2,
    titulo: 'Intervención Breve y Motivacional',
    descripcion:
      'Aprende técnicas de entrevista motivacional y primeros abordajes clínicos.',
    duracion: '6 semanas',
    imagen: '/img/curso2.jpg',
    enlace: '/cursos/intervencion-breve',
  },
  {
    id: 3,
    titulo: 'Rehabilitación y Reinserción Social',
    descripcion:
      'Diseña planes de tratamiento y acompañamiento para sostener la sobriedad.',
    duracion: '8 semanas',
    imagen: '/img/curso1.jpg',
    enlace: '/cursos/rehabilitacion-reinsercion',
  },
]

export default function CursosAdiccionesPage() {
  return (
    <Protect plan="premiun" fallback={<p>MODO USARIO DE PRUEBA</p>}>
      <div className="p-6 space-y-6">
        <header className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-700" />
          <h1 className="text-3xl font-bold text-indigo-700">Cursos y talleres de desarrollo humano</h1>
        </header>
        <p className="text-sm text-gray-600 max-w-2xl">
          Capacitación práctica y basada en evidencia para prevención, intervención y rehabilitación en adicciones.
        </p>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cursos.map((curso) => (
          <Card
  key={curso.id}
  className="relative overflow-hidden rounded-2xl shadow-md group min-h-[260px] border-0 h-64"
>
  {/* Fondo con imagen */}
  <Image
    src={curso.imagen}
    alt={curso.titulo}
    fill
    className="object-cover"
  />
  <div className="absolute inset-0 bg-black/40" />

  {/* Contenido */}
  <div className="relative z-10 flex h-full flex-col justify-between p-5">
    <h3 className="text-white text-lg font-semibold drop-shadow-md">{curso.titulo}</h3>
    <p className="text-white/90 text-sm mt-1">{curso.descripcion}</p>
    <Button asChild className="bg-indigo-600 hover:bg-indigo-700 mt-2">
      <Link href={curso.enlace}>Inscribirse</Link>
    </Button>
  </div>
</Card>
          ))}
        </div>
      </div>
    </Protect>
  )
}
