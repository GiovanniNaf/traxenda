"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Star,
  Video,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Shield,
  Brain,
  Stethoscope,
  Users,
  Sparkles,
  Crown,
  Zap,
  Wallet,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

/* ---------- Tipos ---------- */
type TipoPlan = "consulta-suelta" | "mensual" | "trimestral" | "semestral";
type Categoria = "psicologia" | "consejeria" | "medico";
type Paso = "especialistas" | "fecha" | "resumen" | "confirmada";

interface Plan {
  id: TipoPlan;
  nombre: string;
  descripcion: string;
  precio: number;
  precioPorSesion?: number;
  ahorro: string;
  icono: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  duracion: string;
  numeroSesiones: number;
}

interface Especialista {
  id: number;
  nombre: string;
  especialidad: string;
  rating: number;
  precioBase: number;
  etiquetas: string[];
  disponible: boolean;
  modalidad: string;
  experiencia: number;
  estudios: string;
  imagen: string;
  disponibleHoy: boolean;
}

interface DiaCalendario {
  dia: number;
  fecha: Date;
  esOtroMes: boolean;
  disponible: boolean;
  esHoy?: boolean;
}

/* ---------- Planes por categoría ---------- */
const planesPorCategoria: Record<Categoria, Record<TipoPlan, Plan>> = {
  psicologia: {
    "consulta-suelta": {
      id: "consulta-suelta",
      nombre: "Consulta Individual",
      descripcion: "Paga solo por la sesión que necesitas",
      precio: 350,
      ahorro: "0%",
      icono: Zap,
      color: "from-blue-500 to-cyan-500",
      duracion: "1 sesión",
      numeroSesiones: 1,
    },
    mensual: {
      id: "mensual",
      nombre: "Plan Mensual",
      descripcion: "4 sesiones al mes",
      precio: 1400,
      precioPorSesion: 350,
      ahorro: "Ahorras $0",
      icono: Wallet,
      color: "from-green-500 to-emerald-500",
      duracion: "1 mes",
      numeroSesiones: 4,
    },
    trimestral: {
      id: "trimestral",
      nombre: "Plan Trimestral",
      descripcion: "12 sesiones en 3 meses",
      precio: 3600,
      precioPorSesion: 300,
      ahorro: "Ahorras $600",
      icono: TrendingUp,
      color: "from-purple-500 to-pink-500",
      duracion: "3 meses",
      numeroSesiones: 12,
    },
    semestral: {
      id: "semestral",
      nombre: "Plan Semestral",
      descripcion: "24 sesiones en 6 meses",
      precio: 6000,
      precioPorSesion: 250,
      ahorro: "Ahorras $2,400",
      icono: Crown,
      color: "from-amber-500 to-orange-500",
      duracion: "6 meses",
      numeroSesiones: 24,
    },
  },
  consejeria: {
    "consulta-suelta": {
      id: "consulta-suelta",
      nombre: "Consulta Individual",
      descripcion: "Paga solo por la sesión que necesitas",
      precio: 300,
      ahorro: "0%",
      icono: Zap,
      color: "from-blue-500 to-cyan-500",
      duracion: "1 sesión",
      numeroSesiones: 1,
    },
    mensual: {
      id: "mensual",
      nombre: "Plan Mensual",
      descripcion: "4 sesiones al mes",
      precio: 1200,
      precioPorSesion: 300,
      ahorro: "Ahorras $0",
      icono: Wallet,
      color: "from-green-500 to-emerald-500",
      duracion: "1 mes",
      numeroSesiones: 4,
    },
    trimestral: {
      id: "trimestral",
      nombre: "Plan Trimestral",
      descripcion: "12 sesiones en 3 meses",
      precio: 3000,
      precioPorSesion: 250,
      ahorro: "Ahorras $600",
      icono: TrendingUp,
      color: "from-purple-500 to-pink-500",
      duracion: "3 meses",
      numeroSesiones: 12,
    },
    semestral: {
      id: "semestral",
      nombre: "Plan Semestral",
      descripcion: "24 sesiones en 6 meses",
      precio: 4800,
      precioPorSesion: 200,
      ahorro: "Ahorras $2,400",
      icono: Crown,
      color: "from-amber-500 to-orange-500",
      duracion: "6 meses",
      numeroSesiones: 24,
    },
  },
  medico: {
    "consulta-suelta": {
      id: "consulta-suelta",
      nombre: "Consulta Individual",
      descripcion: "Paga solo por la sesión que necesitas",
      precio: 250,
      ahorro: "0%",
      icono: Zap,
      color: "from-blue-500 to-cyan-500",
      duracion: "1 sesión",
      numeroSesiones: 1,
    },
    mensual: {
      id: "mensual",
      nombre: "Plan Mensual",
      descripcion: "4 sesiones al mes",
      precio: 1000,
      precioPorSesion: 250,
      ahorro: "Ahorras $0",
      icono: Wallet,
      color: "from-green-500 to-emerald-500",
      duracion: "1 mes",
      numeroSesiones: 4,
    },
    trimestral: {
      id: "trimestral",
      nombre: "Plan Trimestral",
      descripcion: "12 sesiones en 3 meses",
      precio: 2700,
      precioPorSesion: 225,
      ahorro: "Ahorras $300",
      icono: TrendingUp,
      color: "from-purple-500 to-pink-500",
      duracion: "3 meses",
      numeroSesiones: 12,
    },
    semestral: {
      id: "semestral",
      nombre: "Plan Semestral",
      descripcion: "24 sesiones en 6 meses",
      precio: 4800,
      precioPorSesion: 200,
      ahorro: "Ahorras $1,200",
      icono: Crown,
      color: "from-amber-500 to-orange-500",
      duracion: "6 meses",
      numeroSesiones: 24,
    },
  },
};

/* ---------- Datos de especialistas ---------- */
const especialistasSimulados: Record<Categoria, Especialista[]> = {
  psicologia: [
    {
      id: 1,
      nombre: "Dra. Elena Martínez",
      especialidad: "Psicología Clínica",
      rating: 4.8,
      precioBase: 350,
      etiquetas: ["Ansiedad", "Terapia Familiar", "Mindfulness"],
      disponible: true,
      modalidad: "online",
      experiencia: 12,
      estudios: "Doctorado en Psicología Clínica",
      imagen: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop",
      disponibleHoy: true,
    },
    {
      id: 2,
      nombre: "Dr. Carlos Ruiz",
      especialidad: "Psicología Infantil",
      rating: 4.9,
      precioBase: 350,
      etiquetas: ["Terapia Infantil", "TDAH", "Ansiedad"],
      disponible: true,
      modalidad: "online",
      experiencia: 8,
      estudios: "Máster en Psicología Infantil",
      imagen: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
      disponibleHoy: false,
    },
    {
      id: 3,
      nombre: "Dra. Laura Fernández",
      especialidad: "Psicología Cognitivo-Conductual",
      rating: 4.9,
      precioBase: 350,
      etiquetas: ["TCC", "Estrés", "Autoestima"],
      disponible: true,
      modalidad: "online",
      experiencia: 10,
      estudios: "Doctorado en Psicología",
      imagen: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop",
      disponibleHoy: true,
    },
  ],
  consejeria: [
    {
      id: 4,
      nombre: "Sra. Lucía Bosch",
      especialidad: "Executive Coach",
      rating: 4.7,
      precioBase: 300,
      etiquetas: ["Liderazgo", "Gestión del Tiempo", "Coaching"],
      disponible: true,
      modalidad: "online",
      experiencia: 15,
      estudios: "Coach Certificada ICF",
      imagen: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
      disponibleHoy: true,
    },
    {
      id: 5,
      nombre: "Dr. Javier Méndez",
      especialidad: "Consejero Familiar",
      rating: 4.8,
      precioBase: 300,
      etiquetas: ["Terapia Familiar", "Parejas", "Comunicación"],
      disponible: true,
      modalidad: "online",
      experiencia: 9,
      estudios: "Máster en Terapia Familiar",
      imagen: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop",
      disponibleHoy: false,
    },
    {
      id: 6,
      nombre: "Dra. Ana Moreno",
      especialidad: "Consejera Vocacional",
      rating: 4.9,
      precioBase: 300,
      etiquetas: ["Orientación", "Carrera Profesional", "Cambio Laboral"],
      disponible: true,
      modalidad: "online",
      experiencia: 7,
      estudios: "Orientadora Profesional",
      imagen: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
      disponibleHoy: true,
    },
  ],
  medico: [
    {
      id: 7,
      nombre: "Dr. Marcos Sola",
      especialidad: "Medicina General",
      rating: 4.9,
      precioBase: 250,
      etiquetas: ["Nutrición", "Medicina Preventiva", "Salud Integral"],
      disponible: true,
      modalidad: "online",
      experiencia: 20,
      estudios: "Médico Cirujano",
      imagen: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop",
      disponibleHoy: true,
    },
    {
      id: 8,
      nombre: "Dra. Patricia Gómez",
      especialidad: "Medicina Familiar",
      rating: 4.9,
      precioBase: 250,
      etiquetas: ["Atención Primaria", "Prevención", "Salud Integral"],
      disponible: true,
      modalidad: "online",
      experiencia: 14,
      estudios: "Especialista en Medicina Familiar",
      imagen: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop",
      disponibleHoy: false,
    },
    {
      id: 9,
      nombre: "Dr. Roberto Díaz",
      especialidad: "Medicina General",
      rating: 4.8,
      precioBase: 250,
      etiquetas: ["Atención Primaria", "Prevención", "Salud Integral"],
      disponible: true,
      modalidad: "online",
      experiencia: 18,
      estudios: "Especialista en Medicina Familiar",
      imagen: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
      disponibleHoy: true,
    },
  ],
};

/* ---------- Función para generar calendario dinámico ---------- */
const generarCalendarioDinamico = (fechaActual: Date): DiaCalendario[] => {
  const year = fechaActual.getFullYear();
  const month = fechaActual.getMonth();
  
  const primerDiaMes = new Date(year, month, 1);
  const ultimoDiaMes = new Date(year, month + 1, 0);
  
  const diaInicioSemana = primerDiaMes.getDay();
  const totalDiasMes = ultimoDiaMes.getDate();
  
  const diasCalendario: DiaCalendario[] = [];
  
  // Días del mes anterior
  const diasMesAnterior = new Date(year, month, 0).getDate();
  for (let i = diaInicioSemana - 1; i >= 0; i--) {
    diasCalendario.push({
      dia: diasMesAnterior - i,
      fecha: new Date(year, month - 1, diasMesAnterior - i),
      esOtroMes: true,
      disponible: false,
    });
  }
  
  // Días del mes actual
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  for (let i = 1; i <= totalDiasMes; i++) {
    const fecha = new Date(year, month, i);
    const esHoy = fecha.getTime() === hoy.getTime();
    const diaSemana = fecha.getDay();
    const disponible = diaSemana !== 0 && diaSemana !== 6 && !(i === 15 || i === 22);
    diasCalendario.push({
      dia: i,
      fecha,
      esOtroMes: false,
      disponible,
      esHoy,
    });
  }
  
  // Completar hasta 42 días
  const diasRestantes = 42 - diasCalendario.length;
  for (let i = 1; i <= diasRestantes; i++) {
    diasCalendario.push({
      dia: i,
      fecha: new Date(year, month + 1, i),
      esOtroMes: true,
      disponible: false,
    });
  }
  
  return diasCalendario;
};

/* ---------- Horarios disponibles ---------- */
const horariosDisponiblesSimulados = {
  manana: ["08:00", "09:30", "11:00"],
  tarde: ["14:00", "15:30", "17:00", "18:30"],
  noche: ["20:00", "21:30"],
};

/* ---------- Días de la semana ---------- */
const diasSemana = ["LU", "MA", "MI", "JU", "VI", "SA", "DO"];

/* ---------- Componentes ---------- */

interface TarjetaEspecialistaProps {
  especialista: Especialista;
  categoria: Categoria;
  onSeleccionar: (especialista: Especialista, plan: Plan) => void;
}

function TarjetaEspecialista({ especialista, categoria, onSeleccionar }: TarjetaEspecialistaProps) {
  const [mostrarPlanes, setMostrarPlanes] = useState(false);
  const planes = planesPorCategoria[categoria];

  const handleSeleccionarPlan = (plan: Plan) => {
    onSeleccionar(especialista, plan);
    setMostrarPlanes(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <div className="p-4 sm:p-5">
          <div className="flex gap-3 sm:gap-4">
            {/* Imagen del especialista */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
                <img
                  src={especialista.imagen}
                  alt={especialista.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(especialista.nombre) + "&background=6366f1&color=fff";
                  }}
                />
              </div>
            </div>

            {/* Información principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">{especialista.nombre}</h3>
                {especialista.disponibleHoy && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                    Disponible hoy
                  </span>
                )}
              </div>
              <p className="text-indigo-600 font-medium text-xs sm:text-sm mb-1 truncate">{especialista.especialidad}</p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm mt-1">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-700">{especialista.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Briefcase size={12} />
                  <span className="text-xs">{especialista.experiencia} años</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <Video size={12} />
                  <span className="text-xs font-medium">EN LÍNEA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Etiquetas */}
          <div className="flex flex-wrap gap-2 mt-3">
            {especialista.etiquetas.slice(0, 3).map((etiqueta) => (
              <span
                key={etiqueta}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
              >
                {etiqueta}
              </span>
            ))}
          </div>

          {/* Precio y botón */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-indigo-600">${especialista.precioBase} MXN</p>
              <p className="text-xs text-gray-500">/ sesión 50 min</p>
            </div>
            <button
              onClick={() => setMostrarPlanes(true)}
              className="bg-indigo-600 text-white px-4 sm:px-5 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all hover:scale-105"
            >
              Ver Planes
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal de Planes */}
      <AnimatePresence>
        {mostrarPlanes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setMostrarPlanes(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                      <img
                        src={especialista.imagen}
                        alt={especialista.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">{especialista.nombre}</h3>
                      <p className="text-indigo-600 text-sm">{especialista.especialidad}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMostrarPlanes(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>

                <h4 className="text-lg font-semibold text-gray-800 mb-4">Elige tu plan</h4>
                
                <div className="grid gap-4">
                  {Object.values(planes).map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => handleSeleccionarPlan(plan)}
                      className={`bg-gradient-to-r ${plan.color} p-4 rounded-xl text-left transition-all hover:scale-[1.02]`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="bg-white/20 p-2 rounded-lg">
                            <plan.icono size={24} className="text-white" />
                          </div>
                          <div>
                            <h5 className="text-white font-bold text-lg">{plan.nombre}</h5>
                            <p className="text-white/80 text-sm">{plan.descripcion}</p>
                            {plan.precioPorSesion && (
                              <p className="text-white/70 text-xs mt-1">
                                ${plan.precioPorSesion} MXN por sesión
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-white font-bold text-2xl">${plan.precio} MXN</p>
                          <p className="text-white/70 text-xs">{plan.duracion}</p>
                          {plan.ahorro !== "0%" && plan.ahorro !== "Ahorras $0" && (
                            <p className="text-green-200 text-xs font-medium mt-1">
                              {plan.ahorro}
                            </p>
                          )}
                        </div>
                      </div>
                      {plan.numeroSesiones > 1 && (
                        <div className="mt-3 flex items-center gap-2 text-white/80 text-xs">
                          <CheckCircle size={14} />
                          <span>{plan.numeroSesiones} sesiones incluidas</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface SeleccionEspecialistaProps {
  onSeleccionar: (especialista: Especialista, plan: Plan) => void;
}

function SeleccionEspecialista({ onSeleccionar }: SeleccionEspecialistaProps) {
  const [categoria, setCategoria] = useState<Categoria>("psicologia");
  const [buscando, setBuscando] = useState(false);

  const especialistasActuales = especialistasSimulados[categoria];
  
  const getIconoCategoria = () => {
    switch(categoria) {
      case "psicologia":
        return <Brain size={20} />;
      case "consejeria":
        return <Users size={20} />;
      case "medico":
        return <Stethoscope size={20} />;
    }
  };

  const getTituloCategoria = () => {
    switch(categoria) {
      case "psicologia":
        return "Psicología";
      case "consejeria":
        return "Consejería";
      case "medico":
        return "Médico General";
    }
  };

  const getDescripcionCategoria = () => {
    switch(categoria) {
      case "psicologia":
        return "Encuentra al psicólogo ideal para tu bienestar emocional";
      case "consejeria":
        return "Asesoramiento profesional para tus desafíos personales";
      case "medico":
        return "Atención médica integral y especializada";
    }
  };

  const handleBuscarMas = () => {
    setBuscando(true);
    setTimeout(() => setBuscando(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-0"
    >
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Encuentra tu Especialista</h1>
        <p className="text-indigo-100 text-sm sm:text-base">Conecta con profesionales de la salud mental y bienestar en línea</p>
      </div>

      {/* Tabs de categorías */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6 sm:mb-8 bg-white p-2 rounded-xl shadow-md">
        <button
          onClick={() => setCategoria("psicologia")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
            categoria === "psicologia"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Brain size={18} />
          <span>Psicología</span>
        </button>
        <button
          onClick={() => setCategoria("consejeria")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
            categoria === "consejeria"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Users size={18} />
          <span>Consejería</span>
        </button>
        <button
          onClick={() => setCategoria("medico")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
            categoria === "medico"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Stethoscope size={18} />
          <span>Médico General</span>
        </button>
      </div>

      {/* Información de la categoría */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {getIconoCategoria()}
            {getTituloCategoria()}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{getDescripcionCategoria()}</p>
        </div>
        <div className="text-sm text-gray-500">
          {especialistasActuales.length} profesionales disponibles
        </div>
      </div>

      {/* Grid de especialistas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {especialistasActuales.map((especialista) => (
          <TarjetaEspecialista
            key={especialista.id}
            especialista={especialista}
            categoria={categoria}
            onSeleccionar={onSeleccionar}
          />
        ))}
      </div>

      {/* Buscar más especialistas */}
      <div className="mt-8 text-center">
        <button
          onClick={handleBuscarMas}
          disabled={buscando}
          className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors py-3 px-6 rounded-lg hover:bg-indigo-50"
        >
          {buscando ? (
            <span className="flex items-center gap-2">
              <Clock className="animate-spin" size={18} />
              Buscando más especialistas...
            </span>
          ) : (
            "Buscar más especialistas..."
          )}
        </button>
      </div>
    </motion.div>
  );
}

interface SeleccionFechaHoraProps {
  especialista: Especialista;
  plan: Plan;
  onVolver: () => void;
  onConfirmarFechaHora: (fecha: Date, hora: string) => void;
}

function SeleccionFechaHora({
  especialista,
  plan,
  onVolver,
  onConfirmarFechaHora,
}: SeleccionFechaHoraProps) {
  const [mesActual, setMesActual] = useState<Date>(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [categoriaHora, setCategoriaHora] = useState<"mañana" | "tarde" | "noche">("mañana");

  const diasCalendario = useMemo(() => generarCalendarioDinamico(mesActual), [mesActual]);

  const horariosPorCategoria = {
    mañana: horariosDisponiblesSimulados.manana,
    tarde: horariosDisponiblesSimulados.tarde,
    noche: horariosDisponiblesSimulados.noche,
  };

  const cambiarMes = (direccion: number) => {
    setMesActual(prev => {
      const nuevo = new Date(prev);
      nuevo.setMonth(prev.getMonth() + direccion);
      return nuevo;
    });
  };

  const handleConfirmar = () => {
    if (fechaSeleccionada && horaSeleccionada) {
      onConfirmarFechaHora(fechaSeleccionada, horaSeleccionada);
    }
  };

  const nombreMes = mesActual.toLocaleDateString("es-MX", { month: "long", year: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 sm:px-0"
    >
      <button
        onClick={onVolver}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 bg-white px-4 py-2 rounded-lg shadow-sm"
      >
        <ChevronLeft size={20} />
        Volver a especialistas
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
            <img
              src={especialista.imagen}
              alt={especialista.nombre}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{especialista.nombre}</h2>
                <p className="text-indigo-600 font-medium text-sm">{especialista.especialidad}</p>
              </div>
              <div className={`bg-gradient-to-r ${plan.color} text-white px-4 py-2 rounded-lg inline-block sm:inline-block`}>
                <p className="text-xs font-medium">{plan.nombre}</p>
                <p className="text-lg font-bold">${plan.precio} MXN</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-gray-500 mt-2">
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span>{especialista.rating}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Briefcase size={12} />
                <span>{especialista.experiencia} años exp.</span>
              </div>
              <span>•</span>
              <span className="text-blue-600">En línea</span>
              {plan.numeroSesiones > 1 && (
                <>
                  <span>•</span>
                  <span className="text-green-600">{plan.numeroSesiones} sesiones incluidas</span>
                </>
              )}
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center sm:text-left">Elige Fecha y Hora</h3>
        <p className="text-gray-600 mb-6 text-center sm:text-left">Selecciona el momento que mejor se adapte a tu ritmo.</p>

        {/* Calendario */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-700 capitalize">{nombreMes}</h4>
            <div className="flex gap-2">
              <button 
                onClick={() => cambiarMes(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => cambiarMes(1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3">
            {diasSemana.map((dia) => (
              <div key={dia} className="text-center font-semibold text-gray-500 text-xs sm:text-sm py-2">
                {dia}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {diasCalendario.map((dia, idx) => (
              <button
                key={idx}
                onClick={() => dia.disponible && !dia.esOtroMes && setFechaSeleccionada(dia.fecha)}
                disabled={!dia.disponible || dia.esOtroMes}
                className={`aspect-square rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base ${
                  fechaSeleccionada && dia.fecha.getTime() === fechaSeleccionada.getTime()
                    ? "bg-indigo-600 text-white shadow-lg scale-105"
                    : dia.disponible && !dia.esOtroMes
                    ? "bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                } ${dia.esOtroMes ? "opacity-50" : ""} ${dia.esHoy && !fechaSeleccionada ? "ring-2 ring-indigo-400" : ""}`}
              >
                {dia.dia}
              </button>
            ))}
          </div>
        </div>

        {/* Horarios disponibles */}
        {fechaSeleccionada && (
          <div className="border-t border-gray-100 pt-6">
            <h4 className="font-semibold text-gray-700 mb-4 text-lg text-center sm:text-left">Horarios Disponibles</h4>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-5">
              <button
                onClick={() => setCategoriaHora("mañana")}
                className={`px-4 sm:px-5 py-2 rounded-lg font-medium transition-all ${
                  categoriaHora === "mañana"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                MAÑANA
              </button>
              <button
                onClick={() => setCategoriaHora("tarde")}
                className={`px-4 sm:px-5 py-2 rounded-lg font-medium transition-all ${
                  categoriaHora === "tarde"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                TARDE
              </button>
              <button
                onClick={() => setCategoriaHora("noche")}
                className={`px-4 sm:px-5 py-2 rounded-lg font-medium transition-all ${
                  categoriaHora === "noche"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                NOCHE
              </button>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              {horariosPorCategoria[categoriaHora].map((hora) => (
                <button
                  key={hora}
                  onClick={() => setHoraSeleccionada(hora)}
                  className={`px-5 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all ${
                    horaSeleccionada === hora
                      ? "bg-indigo-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Clock size={14} className="inline mr-1 sm:mr-2" />
                  {hora}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center sm:justify-end">
          <button
            onClick={handleConfirmar}
            disabled={!fechaSeleccionada || !horaSeleccionada}
            className="bg-indigo-600 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Continuar al Resumen
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface ResumenCitaProps {
  especialista: Especialista;
  plan: Plan;
  fecha: Date;
  hora: string;
  onVolver: () => void;
  onConfirmar: () => void;
}

function ResumenCita({
  especialista,
  plan,
  fecha,
  hora,
  onVolver,
  onConfirmar,
}: ResumenCitaProps) {
  const fechaFormateada = fecha.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const horaFormateada = new Date(`${fecha.toDateString()} ${hora}`).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const horaFin = new Date(`${fecha.toDateString()} ${hora}`);
  horaFin.setHours(horaFin.getHours() + 1);
  const horaFinFormateada = horaFin.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 sm:px-0"
    >
      <button
        onClick={onVolver}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 bg-white px-4 py-2 rounded-lg shadow-sm"
      >
        <ChevronLeft size={20} />
        Volver a horarios
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <Check className="text-indigo-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Resumen de tu Cita</h2>
            <p className="text-gray-500 text-xs sm:text-sm">Confirma los detalles antes de finalizar el pago</p>
          </div>
        </div>

        {/* Información del especialista */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-5 mb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
              <img
                src={especialista.imagen}
                alt={especialista.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">{especialista.nombre}</h3>
                  <p className="text-indigo-600 font-medium text-sm mt-1">{especialista.especialidad}</p>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full self-center sm:self-start">
                  <Shield size={14} />
                  <span className="text-xs font-medium">Verificado</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span>{especialista.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase size={12} />
                  <span>{especialista.experiencia} años exp.</span>
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap size={12} />
                  <span className="truncate max-w-[150px]">{especialista.estudios}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <Video size={12} />
                  <span>En línea</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plan seleccionado */}
        <div className={`bg-gradient-to-r ${plan.color} rounded-xl p-4 mb-4 text-white`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <plan.icono size={24} />
              <div>
                <h4 className="font-bold">{plan.nombre}</h4>
                <p className="text-white/80 text-xs sm:text-sm">{plan.descripcion}</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-2xl font-bold">${plan.precio} MXN</p>
              {plan.numeroSesiones > 1 && (
                <p className="text-xs text-white/70">{plan.numeroSesiones} sesiones</p>
              )}
            </div>
          </div>
        </div>

        {/* Servicio */}
        <div className="border-b border-gray-100 py-4">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-600" />
            Servicio
          </h4>
          <p className="text-gray-800 font-medium">Sesión de {especialista.especialidad}</p>
          <p className="text-gray-500 text-sm">Duración: 50 min</p>
        </div>

        {/* Fecha y Hora */}
        <div className="border-b border-gray-100 py-4">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar size={16} className="text-indigo-600" />
            Fecha y Hora
          </h4>
          <p className="text-gray-800 font-medium capitalize">{fechaFormateada}</p>
          <p className="text-gray-800">{horaFormateada} — {horaFinFormateada}</p>
        </div>

        {/* Modalidad */}
        <div className="border-b border-gray-100 py-4">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Video size={16} className="text-indigo-600" />
            Modalidad
          </h4>
          <div className="flex items-center gap-2">
            <Video size={18} className="text-indigo-600" />
            <p className="text-gray-800">Consulta en Línea</p>
          </div>
          <p className="text-gray-500 text-sm ml-6">Google Meet</p>
        </div>

        {/* Nota importante */}
        <div className="bg-amber-50 rounded-xl p-4 mt-4 border border-amber-100">
          <div className="flex items-start gap-3">
            <MessageSquare size={18} className="text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-700 text-sm">Nota importante</p>
              <p className="text-gray-600 text-sm">
                Te enviaremos un recordatorio 30 minutos antes de tu sesión para asegurar que estés listo para conectar.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onVolver}
            className="flex-1 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors order-2 sm:order-1"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:scale-105 order-1 sm:order-2"
          >
            Proceder al Pago →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface CitaConfirmadaProps {
  especialista: Especialista;
  plan: Plan;
  fecha: Date;
  hora: string;
  onNuevaCita: () => void;
}

function CitaConfirmada({
  especialista,
  plan,
  fecha,
  hora,
  onNuevaCita,
}: CitaConfirmadaProps) {
  const fechaFormateada = fecha.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const horaFormateada = new Date(`${fecha.toDateString()} ${hora}`).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto px-4 sm:px-0"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-5 sm:p-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4">
          <Check className="text-green-600" size={28} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">¡Cita Agendada con Éxito!</h2>
        <p className="text-gray-600 text-sm sm:text-base mb-6">Tu cita ha sido registrada correctamente</p>

        <div className="space-y-4 mb-6 text-left">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={especialista.imagen}
                  alt={especialista.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-sm">Especialista:</p>
                <p className="text-gray-800 font-bold text-sm sm:text-base">{especialista.nombre}</p>
              </div>
            </div>
            <p className="text-indigo-600 font-medium text-xs sm:text-sm mt-1 ml-12">{especialista.especialidad}</p>
          </div>

          <div className={`bg-gradient-to-r ${plan.color} rounded-xl p-4 text-white`}>
            <p className="font-semibold text-white/90 text-xs">Plan seleccionado</p>
            <p className="font-bold text-sm sm:text-base">{plan.nombre}</p>
            <p className="text-xl sm:text-2xl font-bold mt-1">${plan.precio} MXN</p>
            {plan.numeroSesiones > 1 && (
              <p className="text-white/80 text-xs mt-1">{plan.numeroSesiones} sesiones incluidas</p>
            )}
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-green-600" size={18} />
              <span className="font-semibold text-gray-700 text-sm">Fecha y Hora:</span>
            </div>
            <p className="text-gray-800 font-bold text-sm capitalize">{fechaFormateada}</p>
            <p className="text-gray-800 font-bold flex items-center gap-2 mt-1 text-sm">
              <Clock size={14} />
              {horaFormateada}
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Video className="text-blue-600" size={18} />
              <span className="font-semibold text-gray-700 text-sm">Enlace de Google Meet:</span>
            </div>
            <p className="text-gray-800 break-all text-xs sm:text-sm font-mono">
              meet.google.com/{Math.random().toString(36).substring(2, 10)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              El enlace estará disponible 2 horas antes de tu cita
            </p>
          </div>
        </div>

        <button
          onClick={onNuevaCita}
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-sm sm:text-base"
        >
          Volver al Inicio
        </button>
      </div>
    </motion.div>
  );
}

/* ---------- Componente Principal ---------- */
export default function SimulacionAgendarCita() {
  const [paso, setPaso] = useState<Paso>("especialistas");
  const [especialistaSeleccionado, setEspecialistaSeleccionado] = useState<Especialista | null>(null);
  const [planSeleccionado, setPlanSeleccionado] = useState<Plan | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>("");

  const handleSeleccionarEspecialista = (especialista: Especialista, plan: Plan) => {
    setEspecialistaSeleccionado(especialista);
    setPlanSeleccionado(plan);
    setPaso("fecha");
  };

  const handleConfirmarFechaHora = (fecha: Date, hora: string) => {
    setFechaSeleccionada(fecha);
    setHoraSeleccionada(hora);
    setPaso("resumen");
  };

  const handleConfirmarCita = () => {
    setPaso("confirmada");
  };

  const handleNuevaCita = () => {
    setEspecialistaSeleccionado(null);
    setPlanSeleccionado(null);
    setFechaSeleccionada(null);
    setHoraSeleccionada("");
    setPaso("especialistas");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="container mx-auto py-4 sm:py-8">
        {paso === "especialistas" && (
          <SeleccionEspecialista onSeleccionar={handleSeleccionarEspecialista} />
        )}
        {paso === "fecha" && especialistaSeleccionado && planSeleccionado && (
          <SeleccionFechaHora
            especialista={especialistaSeleccionado}
            plan={planSeleccionado}
            onVolver={() => setPaso("especialistas")}
            onConfirmarFechaHora={handleConfirmarFechaHora}
          />
        )}
        {paso === "resumen" && especialistaSeleccionado && planSeleccionado && fechaSeleccionada && (
          <ResumenCita
            especialista={especialistaSeleccionado}
            plan={planSeleccionado}
            fecha={fechaSeleccionada}
            hora={horaSeleccionada}
            onVolver={() => setPaso("fecha")}
            onConfirmar={handleConfirmarCita}
          />
        )}
        {paso === "confirmada" && especialistaSeleccionado && planSeleccionado && fechaSeleccionada && (
          <CitaConfirmada
            especialista={especialistaSeleccionado}
            plan={planSeleccionado}
            fecha={fechaSeleccionada}
            hora={horaSeleccionada}
            onNuevaCita={handleNuevaCita}
          />
        )}
      </div>
    </div>
  );
}