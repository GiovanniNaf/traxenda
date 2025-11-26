/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardPaciente() {
  const [salaDelDia, setSalaDelDia] = useState<any>(null);
  const { user, isLoaded } = useUser();
  const [perfilId, setPerfilId] = useState<number | null>(null);
  const [perfilCompleto, setPerfilCompleto] = useState(true);
  const [pacienteNombre, setPacienteNombre] = useState<string | null>(null);
  const [perfilGuardado, setPerfilGuardado] = useState(false);



  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    sexo: "",
    direccion: "",
    telefono: "",
  });

  // Obtener la sala del día
  useEffect(() => {
    const fetchSalaDelDia = async () => {
      const { data, error } = await supabase.from('grupos').select('*');
      if (error) return console.error(error);

      const esHoy = (grupo: any): boolean => {
        const hoy = new Date();
        if (grupo.recurrente && grupo.dia_semana === hoy.getDay()) return true;
        if (grupo.fecha) {
          const [anio, mes, dia] = grupo.fecha.split('-').map(Number);
          const fechaGrupo = new Date(anio, mes - 1, dia);
          return (
            fechaGrupo.getDate() === hoy.getDate() &&
            fechaGrupo.getMonth() === hoy.getMonth() &&
            fechaGrupo.getFullYear() === hoy.getFullYear()
          );
        }
        return false;
      };

      const hoyGrupos = data.filter((g) => esHoy(g));
      if (hoyGrupos.length > 0) setSalaDelDia(hoyGrupos[0]);
    };

    fetchSalaDelDia();
  }, []);

  // Obtener perfil y verificar si completó datos
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from("perfiles")
        .select("id")
        .eq("clerk_id", user.id)
        .single();

      if (error || !data) return;

      setPerfilId(data.id);

      const { data: paciente } = await supabase
        .from("pacientes")
        .select("perfil_completo, nombre, apellido")
        .eq("perfil_id", data.id)
        .maybeSingle();

      // Si no hay paciente, marcamos perfil como incompleto
      if (!paciente) {
        setPerfilCompleto(false);
        return;
      }

      // Si existe, actualizamos estados
      setPerfilCompleto(paciente.perfil_completo ?? false);
      setPacienteNombre(`${paciente.nombre}`);
    };

    fetchPerfil();
  }, [isLoaded, user]);

  // Verificar último pago y eliminar si tiene más de 30 días
  useEffect(() => {
    if (!perfilId) return;

    const limpiarPagoAntiguo = async () => {
      const { data: pagos, error } = await supabase
        .from("pagos")
        .select("id, creado_en")
        .eq("perfil_id", perfilId)
        .order("creado_en", { ascending: false })
        .limit(1);

      if (error) return console.error(error);
      if (!pagos || pagos.length === 0) {

        return;
      }

      const ultimoPago = new Date(pagos[0].creado_en);
      const hoy = new Date();
      const diffDias = Math.floor((hoy.getTime() - ultimoPago.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDias > 30) {
        // Eliminar pago viejo
        const { error: errEliminar } = await supabase
          .from("pagos")
          .delete()
          .eq("id", pagos[0].id);
        if (errEliminar) console.error(errEliminar);

      }
    };

    limpiarPagoAntiguo();
  }, [perfilId]);

  // Manejo de cambios en inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  // Guardar datos de paciente
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!perfilId) return;

    try {
      const { error } = await supabase.from("pacientes").upsert([
        {
          perfil_id: perfilId,
          ...formData,
          edad: formData.edad ? parseInt(formData.edad) : null,
          perfil_completo: true,
        },
      ]);

      if (error) throw error;

      setPerfilGuardado(true); // 
      setPerfilCompleto(true);
    } catch (err) {
      console.error("Error guardando paciente:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-10">

      <div className="mx-auto max-w-4xl">
        {/* HERO */}
        <div className="relative rounded-b-3xl overflow-hidden">
          <img
            src="img/curso1.jpg"
            alt="Hero"
            className="w-full h-64 md:h-80 lg:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10">
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
              ¡Bienvenido a tu
              <br />
              app de bienestar!
            </h1>
            <p className="text-white text-sm md:text-base mt-3 max-w-sm drop-shadow-md">
              La primera aplicación de comunidad terapéutica en línea
            </p>
          </div>
        </div>

        {/* NOMBRE O MENSAJE */}
        <div className="mt-8 px-5 md:px-0">
          <div className="w-full bg-indigo-600 text-white text-center py-3 rounded-full font-semibold text-lg md:text-xl shadow-sm">
            {!perfilCompleto || !pacienteNombre
              ? "Bienvenido a Traxenda"
              : `Hola ${pacienteNombre}`
            }
          </div>
        </div>

        {/* BOTÓN COMPLETAR PERFIL */}
        {!perfilCompleto && (
          <div className="mt-6 px-5 md:px-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full py-6 text-xl bg-purple-600 hover:bg-purple-700 rounded-2xl shadow-md">
                  Completar Perfil
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-lg rounded-3xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-purple-700">
                    Completa tu Perfil
                  </DialogTitle>
                  <p className="text-gray-500 text-sm mt-1">
                    Esto nos ayudará a personalizar tu experiencia en Traxenda.
                  </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">

                  {/* Campos dinámicos excepto sexo */}
                  {Object.entries(formData)
                    .filter(([key]) => key !== "sexo")
                    .map(([key, value]) => (
                      <div key={key}>
                        <Label className="capitalize text-sm font-medium">{key}</Label>
                        <Input
                          name={key}
                          value={value}
                          onChange={handleChange}
                          required={["nombre", "apellido"].includes(key)}
                          className="mt-1"
                        />
                      </div>
                    ))}

                  {/* CAMPO SEXO */}
                  <div>
                    <Label className="text-sm font-medium">Sexo</Label>
                    <select
                      name="sexo"
                      value={formData.sexo}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                     
                    </select>
                  </div>

                  {/* BOTÓN GUARDAR */}
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl text-lg font-semibold shadow-md"
                  >
                    Guardar Perfil
                  </Button>
                  {perfilGuardado && (
                    <div className="mt-6 px-5 md:px-0">
                      <div className="bg-purple-600 text-white rounded-2xl shadow-lg p-6 text-center animate-in fade-in zoom-in duration-300">
                        <h3 className="text-2xl font-bold">¡Perfil actualizado! 🎉</h3>

                        <p className="mt-2 text-purple-100 text-sm">
                          Gracias por completar tu información.
                          Ahora tu experiencia será mucho más personalizada.
                        </p>

                        <div className="mt-4">
                          <span className="inline-block bg-white text-purple-700 font-semibold px-4 py-2 rounded-xl shadow">
                            Bienvenido a Traxenda 🚀
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}


        {/* SALA DEL DÍA SOLO SI TIENE PAGO VIGENTE */}
        {salaDelDia && (
          <div className="mt-10 px-5 md:px-0">
            <div className="w-full bg-gray-100 text-center py-3 rounded-full font-semibold text-lg md:text-xl shadow-sm">
              Sala del día
            </div>

            <div className="mt-5 rounded-2xl overflow-hidden shadow-xl relative max-h-64 md:max-h-80">
              <img
                src={salaDelDia.imagen || "img/curso2.jpg"}
                className="w-full h-48 md:h-64 object-cover"
                alt="Sala del día"
              />
              <div className="absolute inset-0 bg-black/40"></div>

              <div className="absolute bottom-0 p-5 text-white">
                <h2 className="text-xl md:text-2xl font-semibold">{salaDelDia.nombre}</h2>
                <p className="text-sm md:text-base mt-1">
                  Sesión de Hoy — Facilitador: {salaDelDia.instructor_nombre}
                </p>
              </div>
            </div>

            <Link href="/dashboard/grupo">
              <Button className="mt-6 w-full py-5 text-xl bg-purple-600 hover:bg-purple-700 rounded-full shadow-md">
                Ir a las Salas
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
