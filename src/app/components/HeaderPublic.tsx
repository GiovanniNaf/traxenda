"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@clerk/nextjs"

export default function HeaderPublic() {
    const [open, setOpen] = useState(false)
    const { isSignedIn } = useUser()

    return (
        <header className="w-full fixed top-0 left-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm font-[Montserrat]">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">

                {/* LOGO */}
                <Link href="/" className="font-bold text-2xl tracking-tight text-indigo-700">
                    Traxenda
                </Link>

                {/* MENU DESKTOP */}
                <nav className="hidden md:flex gap-4 text-sm font-semibold items-center">
                    {!isSignedIn && (
                        <>
                            <Link
                                href="/sign-up"
                                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors"
                            >
                                Registrarse
                            </Link>

                            <Link
                                href="/sign-in"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
                            >
                                Iniciar sesión
                            </Link>
                        </>
                    )}

                    {isSignedIn && (
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition"
                        >
                            <User size={20} />
                            Mi panel
                        </Link>
                    )}
                </nav>

                {/* BOTÓN - Si está logueado → icono, sino → hamburguesa */}
                {!isSignedIn ? (
                    <button
                        onClick={() => setOpen(true)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition"
                    >
                        <Menu size={28} className="text-indigo-700" />
                    </button>
                ) : (
                    <Link
                        href="/dashboard"
                        className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition"
                    >
                        <User size={28} className="text-indigo-700" />
                    </Link>
                )}
            </div>

            {/* MENU MÓVIL */}
            <AnimatePresence>
                {!isSignedIn && open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white md:hidden z-50"
                    >
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 20 }}
                            className="absolute right-0 top-0 w-72 h-full bg-white shadow-2xl p-6 flex flex-col border-l border-gray-200"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-indigo-700">Menú</h2>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-2 rounded-lg hover:bg-gray-200 transition"
                                >
                                    <X size={26} className="text-indigo-700" />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-4 text-lg font-medium">
                                <Link
                                    href="/sign-up"
                                    onClick={() => setOpen(false)}
                                    className="p-3 rounded-lg bg-white border border-indigo-600 text-indigo-600 shadow-sm hover:bg-indigo-50 transition"
                                >
                                    Registrarse
                                </Link>

                                <Link
                                    href="/sign-in"
                                    onClick={() => setOpen(false)}
                                    className="p-3 rounded-lg bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition"
                                >
                                    Iniciar sesión
                                </Link>
                            </nav>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
