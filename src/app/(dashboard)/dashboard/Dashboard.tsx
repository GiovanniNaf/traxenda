"use client";

import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  HeartPulse,
  CalendarDays,
  Smile,
  Users,
  MessageSquare,
  Brain,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function DashboardPaciente() {
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

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from("perfiles")
        .select("id, rol")
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!perfilId) return;

    try {
      const { data: psicologos, error: psicError } = await supabase
        .from("perfiles")
        .select("id")
        .eq("rol", "psicologo");

      if (psicError || !psicologos?.length) {
        alert("No hay psicólogos disponibles actualmente.");
        return;
      }

      const randomIndex = Math.floor(Math.random() * psicologos.length);
      const psicologoSeleccionado = psicologos[randomIndex];

      const { error } = await supabase.from("pacientes").upsert([
        {
          perfil_id: perfilId,
          ...formData,
          edad: formData.edad ? parseInt(formData.edad) : null,
          perfil_completo: true,
          psicologo_id: psicologoSeleccionado.id,
        },
      ]);

      if (error) throw error;

      alert("Perfil completado y psicólogo asignado correctamente ✅");
      setPerfilCompleto(true);
    } catch (error) {
      console.error("Error guardando paciente:", error);
    }
  };

  if (!isLoaded) return <p>Cargando...</p>;

  return (
    <div className="p-6 space-y-8 bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-8 bg-white rounded-2xl shadow-md border border-indigo-100">
        <div className="flex justify-center mb-4">
          <HeartPulse className="w-10 h-10 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-semibold text-indigo-700">
          Bienvenido a <span className="font-bold">Traxenda</span>
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Tu bienestar emocional es importante. Aquí encontrarás herramientas, orientación y
          acompañamiento para construir una mejor versión de ti mismo.
        </p>
      </div>

      {/* Botón de completar perfil */}
      {!perfilCompleto && (
        <div className="flex justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 text-white shadow-lg hover:bg-indigo-700">
                Completar mi perfil
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Completa tu perfil</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <Button type="submit" className="bg-indigo-600 w-full">
                  Guardar y asignar psicólogo
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Sección inspiracional */}
      <Card className="bg-indigo-600 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Smile className="w-6 h-6" />
            Tu espacio de bienestar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>“Cada paso que das hacia tu paz interior es un triunfo personal.”</p>
          <p>Explora nuestros recursos y recuerda: cuidar tu mente también es salud.</p>
        </CardContent>
      </Card>

      {/* Nueva sección - Grupos / Salas */}
      <Card className="shadow-md border-t-4 border-indigo-500 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <Users className="w-5 h-5" /> Conéctate con otros en nuestras Salas Grupales
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 space-y-3">
          <p>
            Participa en grupos de apoyo, comparte tus experiencias y crece junto a personas
            que están viviendo procesos similares al tuyo.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 text-sm">
              <MessageSquare className="w-4 h-4" /> Charlas guiadas
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 text-sm">
              <Brain className="w-4 h-4" /> Crecimiento emocional
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 text-sm">
              <Sparkles className="w-4 h-4" /> Comunidad positiva
            </div>
          </div>

          <Link href="/dashboard/grupo">
            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white w-full">
              Explorar Grupos
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Agenda futura */}
      <Card className="bg-gradient-to-r from-indigo-100 to-indigo-50 border border-indigo-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <CalendarDays className="w-5 h-5" /> Próximamente: Agenda tus sesiones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Muy pronto podrás reservar tus sesiones individuales y de grupo desde este panel.  
            Mantente atento a las actualizaciones.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
