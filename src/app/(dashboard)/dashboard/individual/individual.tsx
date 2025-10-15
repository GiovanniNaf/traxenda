"use client";

import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, HeartHandshake, Search } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { toast } from "react-hot-toast";

export default function IndividualPage() {
  const { user, isLoaded } = useUser();
  const [perfilId, setPerfilId] = useState<number | null>(null);
  const [perfilCompleto, setPerfilCompleto] = useState(false);
  const [psicologoAsignado, setPsicologoAsignado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    sexo: "",
    direccion: "",
    telefono: "",
  });

  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState<
    { id: number; hora_inicio: string; hora_fin: string }[]
  >([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<string | null>(null);
  const [agendando, setAgendando] = useState(false);
  const [fechasOcupadas, setFechasOcupadas] = useState<Date[]>([]);

  // ✅ Cargar perfil y datos iniciales
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchPerfil = async () => {
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("id")
        .eq("clerk_id", user.id)
        .single();

      if (!perfil) return;
      setPerfilId(perfil.id);

      const { data: paciente } = await supabase
        .from("pacientes")
        .select("perfil_completo, psicologo_id")
        .eq("perfil_id", perfil.id)
        .maybeSingle();

      if (paciente) {
        setPerfilCompleto(paciente.perfil_completo);
        setPsicologoAsignado(!!paciente.psicologo_id);

        if (paciente.psicologo_id) {
          fetchFechasOcupadas(paciente.psicologo_id);
        }
      }
    };

    fetchPerfil();
  }, [isLoaded, user]);

  // ✅ Obtener fechas ocupadas del psicólogo
  const fetchFechasOcupadas = async (psicologoId: number) => {
    const { data: citas } = await supabase
      .from("citas")
      .select("fecha")
      .eq("psicologo_id", psicologoId);

    const fechas = citas?.map((c) => new Date(c.fecha)) || [];
    setFechasOcupadas(fechas);
  };

  // ✅ Manejo del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Guardar perfil
  const handleSubmit = async (e: React.FormEvent) => {
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
        perfil_completo: true,
      },
    ]);

    if (!error) setPerfilCompleto(true);
  };

  // ✅ Asignar psicólogo aleatoriamente
  const asignarPsicologo = async () => {
    if (!perfilId) return;
    setLoading(true);

    const { data: psicologos } = await supabase
      .from("perfiles")
      .select("id")
      .eq("rol", "psicologo");

    if (psicologos && psicologos.length > 0) {
      const random = psicologos[Math.floor(Math.random() * psicologos.length)];

      await supabase
        .from("pacientes")
        .update({ psicologo_id: random.id })
        .eq("perfil_id", perfilId);

      setPsicologoAsignado(true);
      fetchFechasOcupadas(random.id);
      toast.success("Psicólogo asignado correctamente");
    }

    setLoading(false);
  };

  // ✅ Generar bloques de 50 min + 10 de descanso
  const generarBloques50Min = (horaInicio: string, horaFin: string) => {
    const bloques: { hora_inicio: string; hora_fin: string }[] = [];
    // eslint-disable-next-line prefer-const
    let [hora, min] = horaInicio.split(":").map(Number);
    let inicio = new Date();
    inicio.setHours(hora, min, 0, 0);

    const [horaF, minF] = horaFin.split(":").map(Number);
    const fin = new Date();
    fin.setHours(horaF, minF, 0, 0);

    while (inicio.getTime() + 50 * 60000 <= fin.getTime()) {
      const bloqueInicio = inicio.toTimeString().slice(0, 5);
      const bloqueFin = new Date(inicio.getTime() + 50 * 60000)
        .toTimeString()
        .slice(0, 5);
      bloques.push({ hora_inicio: bloqueInicio, hora_fin: bloqueFin });
      inicio = new Date(inicio.getTime() + 60 * 60000); // siguiente bloque (50+10)
    }

    return bloques;
  };

  // ✅ Obtener horarios disponibles del día
  const fetchHorariosDia = async (dia: Date) => {
    if (!perfilId) return;

    const dayOfWeek = dia.getDay();

    const { data: paciente } = await supabase
      .from("pacientes")
      .select("id, psicologo_id")
      .eq("perfil_id", perfilId)
      .single();

    if (!paciente?.psicologo_id) return;

    const { data: horarios } = await supabase
      .from("disponibilidades_psicologos")
      .select("*")
      .eq("perfil_id", paciente.psicologo_id)
      .eq("dia_semana", dayOfWeek)
      .order("hora_inicio");

    const { data: citas } = await supabase
      .from("citas")
      .select("hora")
      .eq("psicologo_id", paciente.psicologo_id)
      .eq("fecha", dia.toISOString().split("T")[0]);

    const ocupados = citas ? citas.map((c) => c.hora) : [];

    const disponibles: { id: number; hora_inicio: string; hora_fin: string }[] = [];

    horarios?.forEach((h) => {
      const bloques = generarBloques50Min(h.hora_inicio, h.hora_fin);
      bloques.forEach((b) => {
        if (!ocupados.includes(b.hora_inicio)) {
          disponibles.push({ ...b, id: Math.random() });
        }
      });
    });

    setHorariosDisponibles(disponibles);
    setHorarioSeleccionado(null);
  };

  // ✅ Agendar cita con validación
  const agendarCita = async () => {
    if (!fechaSeleccionada || !horarioSeleccionado || !perfilId) {
      return toast.error("Selecciona fecha y horario");
    }

    setAgendando(true);

    const { data: pacienteData, error: pacienteError } = await supabase
      .from("pacientes")
      .select("id, psicologo_id")
      .eq("perfil_id", perfilId)
      .single();

    if (pacienteError || !pacienteData?.psicologo_id) {
      toast.error("No hay psicólogo asignado o no se encontró el paciente");
      setAgendando(false);
      return;
    }

    // ✅ Verificar una cita por semana
    const startOfWeek = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      d.setDate(d.getDate() - day);
      return d;
    };
    const endOfWeek = (date: Date) => {
      const d = startOfWeek(date);
      d.setDate(d.getDate() + 6);
      return d;
    };

    const semanaInicio = startOfWeek(fechaSeleccionada);
    const semanaFin = endOfWeek(fechaSeleccionada);

    const { data: citasPaciente } = await supabase
      .from("citas")
      .select("fecha")
      .eq("paciente_id", pacienteData.id)
      .gte("fecha", semanaInicio.toISOString().split("T")[0])
      .lte("fecha", semanaFin.toISOString().split("T")[0]);

    if (citasPaciente && citasPaciente.length > 0) {
      toast.error("Solo puedes agendar una cita por semana");
      setAgendando(false);
      return;
    }

    // ✅ Registrar cita
    const { error } = await supabase.from("citas").insert([
      {
        paciente_id: pacienteData.id,
        psicologo_id: pacienteData.psicologo_id,
        fecha: fechaSeleccionada.toISOString().split("T")[0],
        hora: horarioSeleccionado + ":00",
        estado: "pendiente",
      },
    ]);

    if (error) {
      toast.error("Error al agendar la cita");
      console.error(error);
    } else {
      toast.success("Cita agendada correctamente");
      fetchHorariosDia(fechaSeleccionada);
      fetchFechasOcupadas(pacienteData.psicologo_id);
    }

    setAgendando(false);
  };

  if (!isLoaded) return <p className="p-6 text-center">Cargando...</p>;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-gradient-to-br from-indigo-50 to-white">
      <Card className="max-w-lg w-full shadow-lg border border-indigo-100">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-indigo-700 flex items-center justify-center gap-2">
            <HeartHandshake className="w-6 h-6 text-indigo-600" /> Terapia Individual
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          {!perfilCompleto ? (
            <>
              <p className="text-gray-700">
                Antes de continuar, por favor completa tu perfil de paciente 🩺
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 text-white w-full">
                    Completar perfil
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Completar perfil</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {["nombre", "apellido", "edad", "sexo", "direccion", "telefono"].map((field) => (
                      <div key={field}>
                        <Label className="capitalize">{field}</Label>
                        <Input
                          name={field}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          value={(formData as any)[field]}
                          onChange={handleChange}
                          required={field !== "edad" && field !== "sexo"}
                          type={field === "edad" ? "number" : "text"}
                        />
                      </div>
                    ))}
                    <Button type="submit" className="bg-indigo-600 text-white w-full">
                      Guardar
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          ) : !psicologoAsignado ? (
            <div className="flex flex-col items-center space-y-4">
              <Search className="w-10 h-10 text-indigo-500 animate-pulse" />
              <p className="text-gray-700">
                Estamos buscando el psicólogo adecuado para ti 🧠✨
              </p>
              <Button
                onClick={asignarPsicologo}
                className="bg-indigo-600 text-white w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Asignando...
                  </>
                ) : (
                  "Asignar mi psicólogo"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-medium text-gray-700">
                ✅ Psicólogo asignado. Selecciona fecha y horario para tu cita:
              </p>

              <DayPicker
                mode="single"
                selected={fechaSeleccionada ?? undefined}
                onSelect={(date) => {
                  if (date) {
                    setFechaSeleccionada(date);
                    fetchHorariosDia(date);
                  }
                }}
                modifiersClassNames={{ selected: "bg-blue-200 rounded-lg" }}
                disabled={(date) =>
                  fechasOcupadas.some((f) => f.toDateString() === date.toDateString())
                }
                className="mx-auto"
              />

              {horariosDisponibles.length > 0 && fechaSeleccionada && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {horariosDisponibles.map((h) => (
                    <Button
                      key={h.id}
                      onClick={() => setHorarioSeleccionado(h.hora_inicio)}
                      className={`rounded-lg transition-colors duration-200 ${
                        horarioSeleccionado === h.hora_inicio
                          ? "bg-blue-500 text-white"
                          : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-100"
                      }`}
                    >
                      {h.hora_inicio} - {h.hora_fin}
                    </Button>
                  ))}
                </div>
              )}

              {fechaSeleccionada && horarioSeleccionado && (
                <Button
                  onClick={agendarCita}
                  className="bg-indigo-600 text-white w-full mt-4"
                  disabled={agendando}
                >
                  {agendando ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Agendando...
                    </>
                  ) : (
                    "Agendar cita"
                  )}
                </Button>
              )}

              {horariosDisponibles.length === 0 && fechaSeleccionada && (
                <p className="text-gray-600 mt-2">
                  No hay bloques disponibles en esta fecha.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
