// app/sign-in/page.tsx

import { SignIn } from '@clerk/nextjs'



export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-900 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 opacity-20 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-300 opacity-20 rounded-tr-full" />

        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-blue-900 tracking-wide">Bienvenido a</h1>
          <h2 className="text-5xl font-extrabold text-indigo-700">Traxenda</h2>
          <p className="mt-2 text-sm text-gray-500">Inicia sesión para continuar</p>
        </div>

       <SignIn afterSignInUrl="/redirigir-segun-rol" />
      </div>
    </div>
  )
}
