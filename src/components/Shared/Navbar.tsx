import { BellRing, LogIn, Search } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-4 border-b bg-white h-16">
      
      {/* Sidebar solo visible en sm y mayores */}
      <SidebarTrigger className="hidden sm:inline-flex" />

      {/* Contenido del lado derecho */}
      <div className="flex items-center gap-2 w-full justify-end">
        {/* Buscador */}
        <div className="hidden sm:flex items-center border border-gray-300 rounded-lg px-3 py-1 w-full max-w-xs">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full border-none outline-none focus:ring-0 p-0 text-sm"
          />
        </div>

        {/* Botón campana */}
        <Button variant="outline" size="icon">
          <BellRing className="w-5 h-5" />
        </Button>

        {/* Autenticación */}
        <SignedOut>
          <SignInButton>
            <Button size="sm" className="text-sm gap-1">
              <LogIn className="w-4 h-4" />
              Iniciar sesión
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
