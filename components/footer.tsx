
import { Building2, Mail, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#3E2723] text-[#F5F5DC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="w-8 h-8 text-[#BCAAA4]" />
              <span className="text-2xl font-bold">PropIA</span>
            </div>
            <p className="text-[#BCAAA4]">
              Plataforma líder en bienes raíces, conectando asesores con clientes de forma eficiente.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#D7CCC8]">Enlaces Rápidos</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-[#BCAAA4] hover:text-white transition-colors">
                Inicio
              </Link>
              <Link href="/propiedades" className="block text-[#BCAAA4] hover:text-white transition-colors">
                Propiedades
              </Link>
              <Link href="/auth/register" className="block text-[#BCAAA4] hover:text-white transition-colors">
                Registrarse como Asesor
              </Link>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#D7CCC8]">Contacto</h3>
            <div className="space-y-2">
              <div className="flex items-center text-[#BCAAA4]">
                <Mail className="w-4 h-4 mr-2" />
                <span>contacto@propia.com</span>
              </div>
              <div className="flex items-center text-[#BCAAA4]">
                <Phone className="w-4 h-4 mr-2" />
                <span>+52 (33) 1234-5678</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#5D4037] pt-6 text-center text-[#BCAAA4]">
          <p>&copy; {new Date().getFullYear()} PropIA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
