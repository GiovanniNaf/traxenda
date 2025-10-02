import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { UserCircle } from 'lucide-react'
import Link from 'next/link'
import { Protect } from '@clerk/nextjs'

const psicologos = [
  {
    id: 1,
    nombre: 'Dra. Ana María López',
    especialidad: 'Ansiedad y manejo del estrés',
    disponible: '10:00 AM - 4:00 PM',
    imagen: '/img/psicologo2.jpg',
    enlace: '/agendar/ana-lopez',
  },
  {
    id: 2,
    nombre: 'Dr. Jorge Martínez',
    especialidad: 'Depresión y autoestima',
    disponible: '2:00 PM - 8:00 PM',
    imagen: '/img/psicologo2.jpg',
    enlace: '/agendar/jorge-martinez',
  },
  {
    id: 3,
    nombre: 'Lic. Karla Torres',
    especialidad: 'Relaciones de pareja',
    disponible: '9:00 AM - 1:00 PM',
    imagen: '/img/psicologo2.jpg',
    enlace: '/agendar/karla-torres',
  },
]

const IndiviualPage = () => {
  return (
    <Protect
          plan="premiun"
      fallback={<p>MODO USARIO DE PRUEBA</p>}>
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
        <UserCircle className="w-6 h-6" />
        Psicólogos disponibles 
      </h1>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {psicologos.map((psico) => (
          <Card key={psico.id} className="shadow-md">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Image
                  src={psico.imagen}
                  alt={psico.nombre}
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
                <div>
                  <CardTitle className="text-base text-indigo-700">{psico.nombre}</CardTitle>
                  <p className="text-sm text-gray-600">{psico.especialidad}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
                
              <p className="text-sm text-gray-700">
                <strong>Disponible de Lunes a Viernes :</strong> {psico.disponible}
               
              </p>
              <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
             <Link href={`individual/${psico.id}`}>Agendar sesión</Link>

              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </Protect>
  )
}

export default IndiviualPage
