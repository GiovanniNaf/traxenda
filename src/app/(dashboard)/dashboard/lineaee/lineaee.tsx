import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PhoneCall } from 'lucide-react'
import { Protect } from '@clerk/nextjs'

const consejeroEnTurno = {
  nombre: 'Lic. Lourdes Perez',
  especialidad: 'Consejería en adicciones',
  imagen: '/img/psicologo2.jpg',
  telefono: '+5215551234567', // número de ejemplo
}

export default function LlamadaUrgenciaPage() {
  return (
    <Protect plan="premiun" fallback={<p>MODO USUARIO DE PRUEBA</p>}>
      <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-8 bg-indigo-50">
        
        <h1 className="text-3xl font-bold text-red-600 flex items-center gap-2">
          <PhoneCall className="w-6 h-6" />
          Consejero en Línea
        </h1>
        <p className="text-gray-700 max-w-md text-center">
          Llame de inmediato en caso de urgencia. Un consejero está disponible para ayudarle.
        </p>

        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Image
                src={consejeroEnTurno.imagen}
                alt={consejeroEnTurno.nombre}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
              <div>
                <CardTitle className="text-base text-indigo-700">{consejeroEnTurno.nombre}</CardTitle>
                <p className="text-sm text-gray-600">{consejeroEnTurno.especialidad}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              asChild
              className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3 flex items-center justify-center gap-2"
            >
              <a href={`tel:${consejeroEnTurno.telefono}`}>Llamar en Urgencia</a>
            </Button>
          </CardContent>
        </Card>
        
      </div>
    </Protect>
  )
}
