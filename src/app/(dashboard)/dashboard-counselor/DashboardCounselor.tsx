"use client";

import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Users2, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function DashboardCounselor() {
  const { user, isLoaded } = useUser();
  const [perfilId, setPerfilId] = useState<number | null>(null);
  const [perfilCompleto, setPerfilCompleto] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    sexo: "",
    cursos: "",
    diplomados: ""
  });

  // 🧩 Obtener perfil_id y estado de perfil_completo
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchData = async () => {
      const { data: perfil, error: perfilError } = await supabase
        .from("perfiles")
        .select("id, rol")
        .eq("clerk_id", user.id)
        .single();

      if (perfilError || !perfil) {
        console.error("Error obteniendo perfil:", perfilError);
        return;
      }

      setPerfilId(perfil.id);

      const { data: consejero, error: consejeroError } = await supabase
        .from("consejeros")
        .select("perfil_completo")
        .eq("perfil_id", perfil.id)
        .single();

      if (consejeroError || !consejero) {
        // Si no existe el registro o hay error, mostrar botón
        setPerfilCompleto(false);
      } else {
        setPerfilCompleto(consejero.perfil_completo);
      }
    };

    fetchData();
  }, [isLoaded, user]);

  // 🧩 Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🧩 Guardar o actualizar consejero
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfilId) return;

    const { error } = await supabase.from("consejeros").upsert([
      {
        perfil_id: perfilId,
        nombre: formData.nombre,
        apellido: formData.apellido,
        edad: formData.edad ? parseInt(formData.edad) : null,
        sexo: formData.sexo,
        cursos: formData.cursos,
        diplomados: formData.diplomados,
        perfil_completo: true
      }
    ]);

    if (error) {
      console.error("Error guardando consejero:", error);
    } else {
      setPerfilCompleto(true);
    }
  };

  if (!isLoaded) return <p className="p-6">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* ⚠️ Aviso para completar perfil */}
      {!perfilCompleto && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 flex items-center justify-between">
          <p className="text-yellow-800 font-medium">
            Tu perfil no está completo. Completa tus datos para continuar.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                Completar perfil
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Completar perfil del consejero</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Nombre</Label>
                  <Input name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div>
                  <Label>Apellido</Label>
                  <Input name="apellido" value={formData.apellido} onChange={handleChange} required />
                </div>
                <div>
                  <Label>Edad</Label>
                  <Input type="number" name="edad" value={formData.edad} onChange={handleChange} />
                </div>
                <div>
                  <Label>Sexo</Label>
                  <Input name="sexo" value={formData.sexo} onChange={handleChange} />
                </div>
                <div>
                  <Label>Cursos</Label>
                  <Input
                    name="cursos"
                    value={formData.cursos}
                    onChange={handleChange}
                    placeholder="Ejemplo: Consejería Cristiana, Psicología Pastoral..."
                  />
                </div>
                <div>
                  <Label>Diplomados</Label>
                  <Input
                    name="diplomados"
                    value={formData.diplomados}
                    onChange={handleChange}
                    placeholder="Ejemplo: Diplomado en Acompañamiento Espiritual..."
                  />
                </div>
                <Button type="submit" className="bg-indigo-600 text-white w-full">
                  Guardar perfil
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Panel del Consejero</h1>
        <p className="text-gray-600 mt-1">Bienvenido, administra tus grupos y seguimiento de pacientes</p>
      </header>

      {/* Cards principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Grupos */}
        <Link
          href="/dashboard-counselor/grupos"
          className="flex flex-col justify-between p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="flex items-center gap-3 text-indigo-600">
            <Users2 className="w-6 h-6" />
            <span className="text-lg font-semibold">Mis Grupos</span>
          </div>
          <p className="text-gray-500 mt-2 text-sm">Ver y administrar los grupos de consejería asignados</p>
        </Link>

        {/* Seguimiento */}
        <Link
          href="/dashboard-counselor/seguimiento"
          className="flex flex-col justify-between p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="flex items-center gap-3 text-green-600">
            <FileText className="w-6 h-6" />
            <span className="text-lg font-semibold">Seguimiento</span>
          </div>
          <p className="text-gray-500 mt-2 text-sm">Registrar y revisar el progreso de los pacientes</p>
        </Link>

        {/* Agregar nuevo grupo */}
        <Link
          href="/dashboard-counselor/grupos/nuevo"
          className="flex flex-col justify-between p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="flex items-center gap-3 text-purple-600">
            <Plus className="w-6 h-6" />
            <span className="text-lg font-semibold">Nuevo Grupo</span>
          </div>
          <p className="text-gray-500 mt-2 text-sm">Crear un nuevo grupo de consejería</p>
        </Link>
      </div>

      {/* Próximos eventos */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Próximos eventos</h2>
        <div className="bg-white rounded-xl shadow p-6 text-gray-600">
          <p>Aquí se mostrarán las próximas sesiones o reuniones programadas.</p>
        </div>
      </section>
    </div>
  );
}
