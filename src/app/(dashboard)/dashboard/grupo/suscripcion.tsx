/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SuscripcionPage({ perfil_id }: { perfil_id: number }) {
  const [loading, setLoading] = useState<string | null>(null);

  const paquetes = [
    {
      nombre: "Iniciando el camino",
      descripcion: "Acceso básico para comenzar tu proceso.",
      precio: "$240 MXN / mes",
      features: ["Acceso a Salas los 7 días de la semana"],
    },
  ];

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

  return (
    <div className="flex flex-col gap-8 items-center p-6">
      <h1 className="text-3xl font-semibold text-indigo-600 mb-4">
        Elige tu plan
      </h1>

      {/* Centrada y con ancho máximo más grande */}
      <div className="w-full max-w-md">
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
