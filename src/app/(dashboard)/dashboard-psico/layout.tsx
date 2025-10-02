// app/dashboard/layout.tsx
import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Shared/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BottomNav } from "@/components/ui/BottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const supabase = createServerComponentClient({ cookies });

  const { data: perfil, error } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("clerk_id", userId)
    .single();

  if (error || !perfil?.rol) {
    redirect("/error");
  }

  const rol = perfil.rol as "usuario" | "psicologo";

  return (
    <SidebarProvider>
     
        <AppSidebar rol={rol} />
        <div className="w-full bg-stone-100 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 pb-20">{children}</main>
        </div>
          <BottomNav rol={rol}/>

    </SidebarProvider>
  );
}
