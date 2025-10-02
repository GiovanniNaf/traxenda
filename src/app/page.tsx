'use client'

import Link from "next/link"
import { PricingTable } from "@clerk/nextjs"
import { motion } from "framer-motion"


export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-6 py-4 sticky top-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-indigo-600 tracking-tight">Traxenda</h1>
        <div className="flex gap-3">
   
          <Link href="/sign-in">
            <button className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition">
              Iniciar Sesión
            </button>
          </Link>
          <Link href="/sign-up">
            <button className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-500 transition">
              Regístrate
            </button>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-center items-center px-6 py-20 text-center bg-gray-50"
      >
        <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4 text-gray-900">
          Recupera tu bienestar con <span className="text-indigo-600">Traxenda</span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-8">
         Comunidad <strong>terapeutica online</strong> y <strong>educación emocional</strong> para superar adicciones y fortalecer tu salud mental. Acceso seguro, confidencial y profesional.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-up">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition">
              Empieza ahora
            </button>
          </Link>
          <Link href="/sign-in">
            <button className="border border-indigo-600 px-6 py-3 rounded-lg text-indigo-600 hover:bg-indigo-50 transition">
              Ya tengo cuenta
            </button>
          </Link>
        </div>
      </motion.section>

      {/* VIDEO INTRO */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }} 
        viewport={{ once: true }}
        className="px-6 py-20 bg-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Conoce cómo funciona Traxenda</h3>
          <p className="text-gray-600 mb-8">
            Mira este breve video para descubrir cómo te ayudamos en tu proceso de sanación.
          </p>
          <div className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-md aspect-video">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Video de introducción"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </motion.section>

      {/* FEATURES */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }}  
        transition={{ duration: 0.6 }} 
        viewport={{ once: true }}
        className="px-6 py-20 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-indigo-600 mb-2">Terapia Personalizada</h3>
            <p className="text-gray-600 text-sm">
              Accede a sesiones personalizadas con psicólogos certificados desde la comodidad de tu hogar.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-indigo-600 mb-2">Cursos de Desarrollo Emocional</h3>
            <p className="text-gray-600 text-sm">
              Aprende a gestionar emociones, estrés y ansiedad con nuestros cursos estructurados.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-indigo-600 mb-2">Citas Flexibles</h3>
            <p className="text-gray-600 text-sm">
              Elige horarios que se adapten a tu rutina, incluso los fines de semana.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-indigo-600 mb-2">Seguimiento Continuo</h3>
            <p className="text-gray-600 text-sm">
              Tu progreso es nuestra prioridad. Seguimiento profesional en cada etapa.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-indigo-600 mb-2">Privacidad Garantizada</h3>
            <p className="text-gray-600 text-sm">
              Todas tus sesiones son seguras y confidenciales, con cifrado de extremo a extremo.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-indigo-600 mb-2">Equipo Multidisciplinario</h3>
            <p className="text-gray-600 text-sm">
              Contamos con psicólogos, terapeutas y orientadores expertos para brindarte una atención integral.
            </p>
          </div>
        </div>
      </motion.section>

      {/* PRICING */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }} 
        viewport={{ once: true }}
        className="px-6 py-24 bg-white"
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold text-indigo-600 mb-12 text-center">
          Planes y precios
        </h2>
        <div className="max-w-6xl mx-auto overflow-x-auto bg-gray-50 border border-gray-200 rounded-xl p-8 shadow-md">
          <PricingTable />
        </div>
      </motion.section>

      {/* TESTIMONIOS */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }} 
        viewport={{ once: true }}
        className="px-6 py-20 bg-gray-50"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Lo que dicen nuestros usuarios</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <blockquote className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <p className="text-gray-600 italic">“Traxenda me ayudó a reconectar conmigo mismo. La terapia en línea fue una bendición.”</p>
              <footer className="mt-4 text-sm font-semibold text-indigo-600">Carlos M.</footer>
            </blockquote>
            <blockquote className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <p className="text-gray-600 italic">“Muy profesional, accesible y privado. Me siento acompañado en todo momento.”</p>
              <footer className="mt-4 text-sm font-semibold text-indigo-600">Laura P.</footer>
            </blockquote>
            <blockquote className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <p className="text-gray-600 italic">“Los cursos complementan perfecto mi terapia, los recomiendo totalmente.”</p>
              <footer className="mt-4 text-sm font-semibold text-indigo-600">Andrés G.</footer>
            </blockquote>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-200">
        © 2025 <strong>Traxenda</strong>. Todos los derechos reservados.
      </footer>
    </main>
  )
}
