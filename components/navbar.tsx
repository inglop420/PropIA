
'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, LogOut, LayoutDashboard, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session, status } = useSession() || {};

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#D7CCC8] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Building2 className="w-8 h-8 text-[#5D4037] group-hover:text-[#6D4C41] transition-colors" />
            <span className="text-2xl font-bold text-[#3E2723] group-hover:text-[#6D4C41] transition-colors">
              PropIA
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="text-[#5D4037] hover:text-[#3E2723] hover:bg-[#F5F5DC]/50">
                <Home className="w-4 h-4 mr-2" />
                Inicio
              </Button>
            </Link>

            <Link href="/propiedades">
              <Button variant="ghost" className="text-[#5D4037] hover:text-[#3E2723] hover:bg-[#F5F5DC]/50">
                <Building2 className="w-4 h-4 mr-2" />
                Propiedades
              </Button>
            </Link>

            {status === "authenticated" ? (
              <>
                <Link href="/dashboard">
                  <Button className="bg-[#5D4037] hover:bg-[#3E2723] text-white">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  variant="ghost"
                  className="text-[#5D4037] hover:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </>
            ) : status === "loading" ? (
              <div className="text-[#6D4C41]">Cargando...</div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" className="border-[#5D4037] text-[#5D4037] hover:bg-[#F5F5DC]/50">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-[#5D4037] hover:bg-[#3E2723] text-white">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
