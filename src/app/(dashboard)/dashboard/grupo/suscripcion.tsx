/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Grupo {
  id: number
  nombre: string
  meetlink: string
  hora_inicio: string | null
  hora_fin: string | null
  recurrente: boolean
  dia_semana: number | null
  fecha: string | null
  imagen?: string | null
  instructor_nombre?: string | null
  instructor_titulo?: string | null
  instructor_experiencia?: string | null
  es_gratis: boolean
}

export default function SuscripcionPage({ perfil_id }: { perfil_id: number }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [gruposGratuitos, setGruposGratuitos] = useState<Grupo[]>([]);

  const paquetes = [
    {
      nombre: "Iniciando el camino",
      descripcion: "Acceso básico para comenzar tu proceso.",
      precio: "$240 MXN / mes",
      features: ["Acceso a Salas los 7 días de la semana"],
    },
  ];

  // Obtener grupos gratuitos
  useEffect(() => {
    const fetchGruposGratuitos = async () => {
      const { data, error } = await supabase
        .from('grupos')
        .select('*')
        .eq('es_gratis', true)
        .order('fecha', { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setGruposGratuitos(data as Grupo[]);
      }
    };

    fetchGruposGratuitos();
  }, []);

  const manejarSuscripcion = async (tipo_paquete: string) => {
    setLoading(tipo_paquete);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_paquete,
          perfil_id,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error iniciando checkout:", error);
    }

    setLoading(null);
  };

  // Función para verificar si un grupo está disponible ahora
  const estaDisponible = (grupo: Grupo): boolean => {
    const ahora = new Date();
    const horaActual = ahora.getHours() * 60 + ahora.getMinutes();

    if (grupo.recurrente) {
      const diaActual = ahora.getDay();
      if (grupo.dia_semana !== diaActual) return false;
      if (!grupo.hora_inicio || !grupo.hora_fin) return false;
      const [hI, mI] = grupo.hora_inicio.split(':').map(Number);
      const [hF, mF] = grupo.hora_fin.split(':').map(Number);
      const inicio = hI * 60 + mI;
      const fin = hF * 60 + mF;
      return horaActual >= inicio && horaActual <= fin;
    }

    if (grupo.fecha) {
      const [anio, mes, dia] = grupo.fecha.split('-').map(Number);
      const fechaGrupo = new Date(anio, mes - 1, dia);
      const mismoDia =
        fechaGrupo.getDate() === ahora.getDate() &&
        fechaGrupo.getMonth() === ahora.getMonth() &&
        fechaGrupo.getFullYear() === ahora.getFullYear();
      if (!mismoDia) return false;
      if (!grupo.hora_inicio || !grupo.hora_fin) return false;
      const [hI, mI] = grupo.hora_inicio.split(':').map(Number);
      const [hF, mF] = grupo.hora_fin.split(':').map(Number);
      const inicio = hI * 60 + mI;
      const fin = hF * 60 + mF;
      return horaActual >= inicio && horaActual <= fin;
    }
    return false;
  };

  // Función para formatear hora
  const formatearHora = (hora?: string | null) => {
    if (!hora) return '';
    const [h, m] = hora.split(':').map(Number);
    const fecha = new Date();
    fecha.setHours(h);
    fecha.setMinutes(m);
    return fecha.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' });
  };

    const formatearFecha = (fecha?: string | null) => {
    if (!fecha) return ''
    const [anio, mes, dia] = fecha.split('-').map(Number)
    const fechaGrupo = new Date(anio, mes - 1, dia)
    return fechaGrupo.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })
  }

  return (
    <div className="flex flex-col gap-8 items-center p-6">
      <h1 className="text-3xl font-semibold text-indigo-600 mb-4">
        Elige tu plan
      </h1>

      {/* SECCIÓN DE GRUPOS GRATUITOS */}
      {gruposGratuitos.length > 0 && (
        <div className="w-full max-w-4xl mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-emerald-800">
                Grupos Gratuitos
              </h2>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full">
                Acceso libre
              </span>
            </div>
            <p className="text-gray-700 mb-6">
              Disfruta de estas sesiones sin costo. Para acceder a <span className="font-semibold text-indigo-600">todas las salas disponibles</span>, suscríbete a nuestro plan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gruposGratuitos.map((grupo) => (
                <div
                  key={grupo.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* IMAGEN DEL GRUPO */}
                  {grupo.imagen && (
                    <img
                      src={grupo.imagen}
                      alt={grupo.nombre}
                      className="w-full h-40 object-cover"
                    />
                  )}

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{grupo.nombre}</h3>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        Gratis
                      </span>
                    </div>

                    {grupo.instructor_nombre && (
                      <p className="text-sm text-gray-600 mb-1">
                        {grupo.instructor_nombre}
                      </p>
                    )}

                    <p className="text-sm text-gray-500 mb-2">
                      {grupo.recurrente
                        ? `Todos los ${['Domingos', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][grupo.dia_semana || 0]}`
                        : `Fecha: ${formatearFecha(grupo.fecha)}`}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-700">
                        {grupo.hora_inicio && grupo.hora_fin
                          ? `${formatearHora(grupo.hora_inicio)} - ${formatearHora(grupo.hora_fin)}`
                          : 'Horario por definir'}
                      </p>
                      <a
                        href={estaDisponible(grupo) ? grupo.meetlink : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (!estaDisponible(grupo)) e.preventDefault();
                        }}
                        className={`text-sm px-3 py-1 rounded-full transition ${
                          estaDisponible(grupo)
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {estaDisponible(grupo) ? 'Unirse' : 'No disponible'}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PLANS DE SUSCRIPCIÓN */}
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Acceso Completo
          </h2>
          <p className="text-gray-600">
            Suscríbete para disfrutar de todos los grupos y contenido exclusivo
          </p>
        </div>

        {paquetes.map((plan) => (
          <LiquidGlassCard
            key={plan.nombre}
            title={plan.nombre}
            description={plan.descripcion}
            price={plan.precio}
            features={plan.features}
            loading={loading === plan.nombre}
            onClick={() => manejarSuscripcion(plan.nombre)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   🎨 Componente con diseño Glass + Morado Pastel
--------------------------------------------------- */
function LiquidGlassCard({
  title,
  description,
  price,
  features,
  loading,
  onClick,
}: any) {
  return (
    <div
      className="
      group relative p-[2px] rounded-3xl
      bg-gradient-to-br from-white/60 via-white/30 to-purple-200/40
      backdrop-blur-xl
      shadow-[0_0_25px_rgba(180,120,255_/_0.35)]
      hover:shadow-[0_0_45px_rgba(160,80,255_/_0.45)]
      transition-all duration-500
      overflow-hidden
    "
    >
      {/* Reflejo animado */}
      <div
        className="
        absolute inset-0 bg-gradient-to-br from-white/70 to-purple-200/30
        opacity-0 group-hover:opacity-40 transition-opacity duration-700
        pointer-events-none
        mix-blend-screen
      "
      />

      {/* Glow morado suave */}
      <div
        className="
        absolute -top-16 right-10 w-40 h-40
        bg-purple-300/40 blur-3xl rounded-full
        animate-float-slow
      "
      />

      {/* Contenido */}
      <div className="relative bg-white/60 rounded-3xl p-8 backdrop-blur-2xl border border-white/40">
        <h3 className="text-xl font-bold text-indigo-700">{title}</h3>
        <p className="text-gray-700 mt-1">{description}</p>

        <p className="text-4xl font-extrabold text-indigo-800 mt-4">{price}</p>

        <ul className="mt-5 space-y-2">
          {features?.map((f: string, idx: number) => (
            <li key={idx} className="text-indigo-700 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              {f}
            </li>
          ))}
        </ul>

        <button
          onClick={onClick}
          disabled={loading}
          className="
            mt-6 w-full py-3 rounded-2xl font-semibold 
            text-white bg-indigo-500/80
            hover:bg-purple-600
            backdrop-blur-md transition-all
            hover:scale-[1.04] active:scale-[0.97]
            disabled:bg-purple-300
          "
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Suscribirme"}
        </button>
      </div>
    </div>
  );
}