"use client";

import { useState } from "react";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  const [rol, setRol] = useState("psicologo");

  const roles = [
    { id: "psicologo", label: "Psicólogo" },
    { id: "consejero", label: "Consejero" },
    { id: "doctor", label: "Doctor"},
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-900 px-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Columna izquierda - Roles */}
        <div className="p-6 flex flex-col justify-center bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Selecciona tu cargo
          </h2>
          <div className="space-y-3">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setRol(r.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border font-medium transition ${
                  rol === r.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50"
                }`}
              >
             
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Columna derecha - Registro */}
        <div className="p-6 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
              Registro en Traxenda
            </h2>
            <SignUp afterSignUpUrl={`/asignar-rol?rol=${rol}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
