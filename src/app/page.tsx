'use client'

import { motion } from "framer-motion"

export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-gray-800 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        <h1 className="text-5xl font-extrabold text-indigo-600 mb-4">🚧 Sitio en Mantenimiento 🚧</h1>
        <p className="text-lg text-gray-700 mb-6">
          Estamos realizando mejoras en Traxenda.  
          <br />¡Volveremos lo más pronto posible!
        </p>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
        >
          Gracias por tu paciencia
        </motion.div>
      </motion.div>
    </main>
  )
}
