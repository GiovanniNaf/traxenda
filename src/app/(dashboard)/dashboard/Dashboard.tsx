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

      const { data: paciente, error: pacienteError } = await supabase
        .from("pacientes")
        .select("perfil_completo")
        .eq("perfil_id", data.id)
        .single();

      if (pacienteError || !paciente) setPerfilCompleto(false);
      else setPerfilCompleto(paciente.perfil_completo);
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

      alert("Perfil completado correctamente ✅");
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
          <div className="w-full bg-gray-100 text-center py-3 rounded-full font-semibold text-lg md:text-xl shadow-sm">
            {!perfilCompleto
              ? "Bienvenido a Traxenda"
              : `Hola ${user?.firstName} ${user?.lastName}`}
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

              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Completa tu Perfil</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key}>
                      <Label className="capitalize">{key}</Label>
                      <Input
                        name={key}
                        value={value}
                        onChange={handleChange}
                        required={["nombre", "apellido"].includes(key)}
                      />
                    </div>
                  ))}

                  <Button type="submit" className="w-full bg-purple-600">
                    Guardar Perfil
                  </Button>
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
