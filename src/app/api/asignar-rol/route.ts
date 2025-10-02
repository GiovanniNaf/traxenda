import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { userId, sessionClaims } = await auth()

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { rol } = await req.json()
  if (!rol) return NextResponse.json({ error: 'Falta rol' }, { status: 400 })

  const nombre = `${sessionClaims?.first_name ?? ''} ${sessionClaims?.last_name ?? ''}`.trim()

  const { data: existente } = await supabase
    .from('perfiles')
    .select('id')
    .eq('clerk_id', userId)
    .maybeSingle()

  if (!existente) {
    const { error } = await supabase.from('perfiles').insert([
      {
        clerk_id: userId,
        rol,
        nombre,
      },
    ])

    if (error) {
      console.error('❌ Error al insertar perfil:', error.message)
      return NextResponse.json({ error: 'Error al insertar' }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
