
'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Loader2, Mail, Lock, User, Phone } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("¡Cuenta creada exitosamente!");
        
        // Auto login
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          router.push("/auth/login");
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error(data?.error || "Error al crear la cuenta");
      }
    } catch (error) {
      toast.error("Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3E2723] via-[#5D4037] to-[#6D4C41] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Building2 className="w-16 h-16 text-[#5D4037] mb-4" />
            <h1 className="text-3xl font-bold text-[#3E2723]">PropIA</h1>
            <p className="text-[#6D4C41] mt-2">Registro de Asesor</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-[#5D4037] flex items-center">
                <User className="w-4 h-4 mr-2" />
                Nombre Completo
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-1 border-[#D7CCC8] focus:border-[#5D4037]"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-[#5D4037] flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-1 border-[#D7CCC8] focus:border-[#5D4037]"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-[#5D4037] flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Teléfono
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="mt-1 border-[#D7CCC8] focus:border-[#5D4037]"
                placeholder="3312345678"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[#5D4037] flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="mt-1 border-[#D7CCC8] focus:border-[#5D4037]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-[#5D4037] flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Confirmar Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="mt-1 border-[#D7CCC8] focus:border-[#5D4037]"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5D4037] hover:bg-[#3E2723] text-white py-6 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#6D4C41]">
              ¿Ya tienes cuenta?{" "}
              <Link href="/auth/login" className="text-[#5D4037] font-semibold hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-[#6D4C41] hover:text-[#5D4037]">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
