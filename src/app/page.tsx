'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import {
  BookOpen,
  Brain,
  CalendarCheck,
  Users,
  HeartPulse,
  Video,
  ShieldCheck,
  Smartphone,
  Handshake
} from "lucide-react"

export default function Home() {
  const { isSignedIn } = useUser()

  const tools = [
    { icon: BookOpen, title: "Ebooks y recursos gratuitos", text: "Accede a materiales de apoyo y crecimiento personal diseñados por expertos." },
    { icon: Brain, title: "Psicología en línea", text: "Conéctate con profesionales certificados desde cualquier lugar." },
    { icon: CalendarCheck, title: "Planes de tratamiento", text: "Recibe un plan de recuperación adaptado a tus necesidades personales." },
    { icon: Users, title: "Salas terapéuticas", text: "Únete a grupos de apoyo y comparte tu proceso en comunidad." },
    { icon: HeartPulse, title: "Atención médica", text: "Accede a orientación médica complementaria para tu bienestar integral." },
    { icon: Video, title: "Charlas y talleres", text: "Participa en sesiones educativas y conferencias en vivo." },
    { icon: ShieldCheck, title: "Privacidad y seguridad", text: "Tus datos y sesiones están protegidos con tecnología de nivel clínico." },
    { icon: Smartphone, title: "Acceso multiplataforma", text: "Utiliza la plataforma desde tu computadora, tablet o teléfono móvil." },
    { icon: Handshake, title: "Comunidad de apoyo", text: "Acompañamiento constante con terapeutas y otros usuarios en tu proceso." }
  ]

  return (
    <main className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-6 py-4 sticky top-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-indigo-600 tracking-tight">Traxenda</h1>
        <div className="flex gap-3">
          {isSignedIn ? (
            <Link href="/dashboard">
              <button className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-500 transition">
                Ir al panel
              </button>
            </Link>
          ) : (
            <>
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
            </>
          )}
        </div>
      </header>

      {/* HERO */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-center items-center px-6 py-20 text-center bg-gradient-to-br from-indigo-50 to-indigo-100"
      >
        <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4 text-gray-900">
          Recupera tu bienestar con <span className="text-indigo-600">Traxenda</span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mb-8">
          Comunidad <strong>terapéutica online</strong> y <strong>educación emocional</strong> para superar adicciones y fortalecer tu salud mental.
        </p>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 0.8 }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-500 transition"
        >
          ¡Accede completamente <span className="underline font-bold">GRATIS</span> durante tu primer mes!
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          {isSignedIn ? (
            <Link href="/dashboard">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition">
                Ir a mi panel
              </button>
            </Link>
          ) : (
            <>
              <Link href="/sign-up">
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition">
                  Empieza gratis
                </button>
              </Link>
              <Link href="/sign-in">
                <button className="border border-indigo-600 px-6 py-3 rounded-lg text-indigo-600 hover:bg-indigo-50 transition">
                  Ya tengo cuenta
                </button>
              </Link>
            </>
          )}
        </div>
      </motion.section>

      {/* BENEFICIOS */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }}  
        transition={{ duration: 0.6 }} 
        viewport={{ once: true }}
        className="px-6 py-20 bg-white"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-indigo-50 p-6 rounded-xl shadow-sm border border-indigo-100">
            <h3 className="text-xl font-bold text-indigo-600 mb-2">Terapia Personalizada</h3>
            <p className="text-gray-600 text-sm">
              Accede a sesiones con psicólogos certificados desde la comodidad de tu hogar.
            </p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-xl shadow-sm border border-indigo-100">
            <h3 className="text-xl font-bold text-indigo-600 mb-2">Cursos Emocionales</h3>
            <p className="text-gray-600 text-sm">
              Aprende a gestionar emociones, estrés y ansiedad con guías prácticas.
            </p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-xl shadow-sm border border-indigo-100">
            <h3 className="text-xl font-bold text-indigo-600 mb-2">Atención Integral</h3>
            <p className="text-gray-600 text-sm">
              Psicólogos, terapeutas y consejeros trabajando por tu bienestar.
            </p>
          </div>
        </div>
      </motion.section>

      {/* SECCIÓN DE EXPECTATIVA */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }}  
        transition={{ duration: 0.8 }} 
        viewport={{ once: true }}
        className="px-6 py-24 bg-indigo-600 text-white text-center"
      >
        <h2 className="text-4xl font-bold mb-4">Lanzamiento Especial</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Durante este mes de lanzamiento, obtén acceso a sesiones de <strong>Traxenda</strong> completamente <u>gratis</u>.  
          <br />Después del primer mes, podrás elegir continuar con planes accesibles y flexibles.
        </p>
        {!isSignedIn && (
          <Link href="/sign-up">
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-100 transition">
              Comienza tu prueba gratuita
            </button>
          </Link>
        )}
      </motion.section>

      {/* HERRAMIENTAS Y SERVICIOS */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="px-6 py-24 bg-gray-50 text-center"
      >
        <h2 className="text-4xl font-bold text-indigo-600 mb-6">Todas las herramientas que tendrás en Traxenda</h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          Diseñado para acompañarte en cada paso de tu recuperación emocional y mental.  
          Accede a recursos exclusivos y atención profesional desde un solo lugar.
        </p>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
          {tools.map(({ icon: Icon, title, text }, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col gap-3"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
              <p className="text-gray-600 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-200">
        © 2025 <strong>Traxenda</strong>. Todos los derechos reservados.
      </footer>
    </main>
  )
}
