"use client"
import HeaderPublic from "./components/HeaderPublic"
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
    <main className="min-h-screen bg-gradient-to-b from-white to-indigo-50 text-gray-800 flex flex-col">

     <HeaderPublic />

      {/* HERO */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-center items-center px-6 py-20 text-center relative"
      >
        {/* Background floating shapes */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-indigo-200 rounded-full blur-xl opacity-40 animate-float hidden sm:block"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-300 rounded-full blur-xl opacity-40 animate-float-slow hidden sm:block"></div>

        <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 text-gray-900 leading-tight">
          Recupera tu bienestar con{" "}
          <span className="text-indigo-600 animate-pulse-slow">Traxenda</span>
        </h2>

        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mb-10 leading-relaxed">
          Comunidad <strong>terapéutica online</strong> y <strong>educación emocional </strong> 
          para superar adicciones y fortalecer tu salud mental.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          {isSignedIn ? (
            <Link href="/dashboard">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-indigo-500 transition">
                Ir a mi panel
              </button>
            </Link>
          ) : (
            <>
              <Link href="/sign-up">
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-indigo-500 transition">
                  Crear cuenta
                </button>
              </Link>
              <Link href="/sign-in">
                <button className="border border-indigo-600 px-6 py-3 rounded-xl text-indigo-600 shadow-sm hover:bg-indigo-50 transition">
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
          {["Terapia Personalizada", "Cursos Emocionales", "Atención Integral"].map((title, i) => (
            <div key={i} className="bg-indigo-50 p-8 rounded-2xl shadow-sm border border-indigo-100 hover:shadow-md transition transform hover:-translate-y-1">
              <h3 className="text-xl font-bold text-indigo-600 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">
                {i === 0 && "Accede a sesiones con psicólogos certificados desde la comodidad de tu hogar."}
                {i === 1 && "Aprende a gestionar emociones, estrés y ansiedad con guías prácticas."}
                {i === 2 && "Psicólogos, terapeutas y consejeros trabajando por tu bienestar."}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* HERRAMIENTAS */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="px-6 py-24 bg-gray-50 text-center"
      >
        <h2 className="text-4xl font-bold text-indigo-600 mb-4">Herramientas de Traxenda</h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          Acompañamiento profesional, contenido exclusivo y espacios seguros para tu crecimiento emocional.
        </p>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
          {tools.map(({ icon: Icon, title, text }, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition transform hover:-translate-y-1 flex flex-col gap-3"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 animate-float">
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-sm text-gray-500 border-t border-gray-200">
        © 2025 <strong>Traxenda</strong>. Todos los derechos reservados.
      </footer>
    </main>
  )
}
