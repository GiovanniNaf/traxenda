import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { data, error } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("clerk_id", userId)
    .single();

  if (error || !data) {
    console.error("Error al obtener perfil:", error?.message);
    redirect("/dashboard"); // fallback
  }

  const rol = data.rol;

  switch (rol) {
    case "psicologo":
      redirect("/dashboard-psico");
    case "doctor":
      redirect("/dashboard-medic");
    case "consejero":
      redirect("/dashboard-counselor");
    case "admin":
      redirect("/dashboard-admin");
    default:
      redirect("/dashboard"); // fallback por si hay un rol inesperado
  }

}

