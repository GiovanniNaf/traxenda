"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  Heart,
  Sparkles,
  CalendarDays,

} from "lucide-react";


export default function AgendarCitaPaciente() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden"
        >
          {/* Header decorativo */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4"
            >
              <CalendarDays size={40} className="text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Próximamente</h1>
            <p className="text-indigo-100">Sistema de Agendamiento de Citas</p>
          </div>

          {/* Contenido principal */}
          <div className="p-8">
            {/* Mensaje principal */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-4">
                <Sparkles size={16} />
                <span className="text-sm font-medium">Estamos mejorando para ti</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Pronto podrás agendar tus citas
              </h2>
              <p className="text-gray-600">
                Estamos trabajando en una nueva experiencia de agendamiento para ofrecerte un mejor servicio.
                Muy pronto podrás agendar tus citas de manera rápida y sencilla.
              </p>
            </div>

            {/* Características */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50/50">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Calendar size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Agendamiento en línea</p>
                  <p className="text-sm text-gray-500">Elige fecha y hora disponible</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50/50">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Users size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Elije tu psicólogo</p>
                  <p className="text-sm text-gray-500">Encuentra al especialista ideal</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50/50">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Clock size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Recordatorios automáticos</p>
                  <p className="text-sm text-gray-500">No olvides tus sesiones</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50/50">
                <div className="bg-indigo-100 p-2 rounded-lg">

                </div>
                <div>
                  <p className="font-medium text-gray-800">Sesiones en línea</p>
                  <p className="text-sm text-gray-500">Desde la comodidad de tu hogar</p>
                </div>
              </div>
            </div>


          </div>

          {/* Footer con estado */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-sm text-gray-500">
                Estamos trabajando en el lanzamiento
              </p>
            </div>
          </div>
        </motion.div>

        {/* Elementos decorativos */}
        <div className="absolute top-20 left-10 opacity-20 pointer-events-none">
          <Heart size={80} className="text-indigo-300" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20 pointer-events-none">
          <Sparkles size={60} className="text-purple-300" />
        </div>
      </div>
    </div>
  );
}