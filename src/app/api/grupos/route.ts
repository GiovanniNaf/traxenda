import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const nombre = formData.get("nombre") as string;
    const meetLink = formData.get("meetLink") as string;
    const imagen = formData.get("imagen") as File | null;
    const consejeroId = formData.get("consejero_id") as string;

    if (!nombre || !meetLink || !consejeroId) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    let imagenUrl = null;

    // 📸 Subir imagen al bucket
    if (imagen) {
      const ext = imagen.name.split(".").pop();
      const fileName = `${randomUUID()}.${ext}`;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error: uploadError } = await supabase.storage
        .from("grupos")
        .upload(fileName, imagen, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from("grupos").getPublicUrl(fileName);
      imagenUrl = publicUrl.publicUrl;
    }

    // 🧾 Insertar grupo en la base
    const { error: insertError } = await supabase.from("grupos").insert([
      {
        nombre,
        meet_link: meetLink,
        imagen_url: imagenUrl,
        consejero_id: consejeroId,
      },
    ]);

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creando grupo" }, { status: 500 });
  }
}
