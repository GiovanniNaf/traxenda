"use client";

import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Mic, BookOpenCheck, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardPaciente() {
  const { user, isLoaded } = useUser();
  const [perfilId, setPerfilId] = useState(null);
  const [perfilCompleto, setPerfilCompleto] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    sexo: "",
    direccion: "",
    telefono: "",
    historial_clinico: ""
  });

  // 1️⃣ Obtener perfil_id y estado de perfil_completo
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from("perfiles")
        .select("id, rol")
        .eq("clerk_id", user.id)
        .single();

      if (error || !data) {
        console.error("Error obteniendo perfil:", error);
        return;
      }

      setPerfilId(data.id);

      // Verificar si el paciente tiene perfil_completo
      const { data: paciente, error: pacienteError } = await supabase
        .from("pacientes")
        .select("perfil_completo")
        .eq("perfil_id", data.id)
        .single();

      if (pacienteError || !paciente) {
        setPerfilCompleto(false);
      } else {
        setPerfilCompleto(paciente.perfil_completo);
      }
    };

    fetchPerfil();
  }, [isLoaded, user]);

  // 2️⃣ Manejo del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3️⃣ Guardar datos en Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!perfilId) return;

    const { error } = await supabase.from("pacientes").upsert([
      {
        perfil_id: perfilId,
        nombre: formData.nombre,
        apellido: formData.apellido,
        edad: formData.edad ? parseInt(formData.edad) : null,
        sexo: formData.sexo,
        direccion: formData.direccion,
        telefono: formData.telefono,
        perfil_completo: true
      }
    ]);

    if (error) {
      console.error("Error guardando paciente:", error);
    } else {
      setPerfilCompleto(true);
    }
  };

  if (!isLoaded) return <p>Cargando...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Botón para completar perfil */}
      {!perfilCompleto && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 text-white">
              Completar perfil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Completar perfil de paciente</DialogTitle>
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
                <Label>Dirección</Label>
                <Input name="direccion" value={formData.direccion} onChange={handleChange} />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input name="telefono" value={formData.telefono} onChange={handleChange} />
              </div>
              <Button type="submit" className="bg-indigo-600 text-white w-full">
                Guardar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Bienvenida */}
      <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
        <Sparkles className="w-6 h-6" /> Bienvenido a Traxenda
      </h1>

      {/* Podcast destacado */}
      <Card className="bg-gradient-to-r from-indigo-100 to-indigo-200 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <Mic className="w-5 h-5" /> Podcast de la semana
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <h2 className="font-semibold">Respira y suelta - Episodio 42</h2>
          <p className="text-sm text-gray-600">
            Aprende técnicas simples para reducir el estrés en solo 10 minutos.
          </p>
          <Button className="mt-2" variant="outline">
            Escuchar ahora
          </Button>
        </CardContent>
      </Card>

      {/* Psicólogos recomendados */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <User className="w-5 h-5" /> Psicólogos mejor calificados
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {["Dra. Ana López", "Dr. Mario Torres", "Lic. Laura Pérez"].map((nombre, i) => (
            <div key={i} className="p-4 bg-indigo-50 rounded-lg shadow">
              <h3 className="font-medium">{nombre}</h3>
              <p className="text-sm text-gray-600">⭐️⭐️⭐️⭐️⭐️</p>
              <Button variant="link" className="p-0 text-indigo-600 mt-2">
                Ver perfil
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cursos recomendados */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <BookOpenCheck className="w-5 h-5" /> Cursos más recomendados
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { titulo: "Mindfulness para principiantes", autor: "Laura Gómez" },
            { titulo: "Sanando tu niño interior", autor: "David Herrera" },
            { titulo: "Técnicas de relajación profunda", autor: "Claudia Ruiz" }
          ].map((curso, i) => (
            <div key={i} className="p-4 bg-indigo-50 rounded-lg shadow">
              <h3 className="font-medium">{curso.titulo}</h3>
              <p className="text-sm text-gray-600">por {curso.autor}</p>
              <Button variant="link" className="p-0 text-indigo-600 mt-2">
                Ver curso
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
