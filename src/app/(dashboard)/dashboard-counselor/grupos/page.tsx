'use client'

import { useState } from 'react'

const GruposPage = () => {
  const [nombre, setNombre] = useState('')
  const [meetLink, setMeetLink] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !meetLink) {
      setMensaje('Por favor completa todos los campos')
      return
    }

    setCargando(true)
    setMensaje('')

    const formData = new FormData()
    formData.append('nombre', nombre)
    formData.append('meetLink', meetLink)
    if (imagen) formData.append('imagen', imagen)

    try {
      const res = await fetch('/api/grupos', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setMensaje('Grupo creado correctamente ✅')
        setNombre('')
        setMeetLink('')
        setImagen(null)
      } else {
        setMensaje('Error al crear el grupo ❌')
      }
    } catch (error) {
      console.error(error)
      setMensaje('Error al crear el grupo ❌')
    }

    setCargando(false)
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Crear Nuevo Grupo</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto flex flex-col gap-4">
        <label className="flex flex-col">
          Nombre del grupo
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </label>

        <label className="flex flex-col">
          Link de Meet
          <input
            type="url"
            value={meetLink}
            onChange={(e) => setMeetLink(e.target.value)}
            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </label>

        <label className="flex flex-col">
          Imagen del grupo
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files ? e.target.files[0] : null)}
            className="mt-1"
          />
        </label>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          disabled={cargando}
        >
          {cargando ? 'Creando...' : 'Crear Grupo'}
        </button>

        {mensaje && <p className="text-center text-gray-700 mt-2">{mensaje}</p>}
      </form>
    </div>
  )
}

export default GruposPage
