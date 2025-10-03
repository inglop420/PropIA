
'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  propiedadId: string;
  propiedadTitulo: string;
}

export function LeadFormModal({ isOpen, onClose, propiedadId, propiedadTitulo }: LeadFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombreCliente: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          propiedadId,
        }),
      });

      if (response.ok) {
        toast.success("¡Solicitud enviada con éxito! El asesor se pondrá en contacto pronto.");
        setFormData({ nombreCliente: "", email: "", telefono: "", mensaje: "" });
        onClose();
      } else {
        toast.error("Error al enviar la solicitud");
      }
    } catch (error) {
      toast.error("Error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#3E2723]">Solicitar Información</DialogTitle>
          <p className="text-sm text-[#6D4C41]">{propiedadTitulo}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombreCliente" className="text-[#5D4037]">Nombre Completo</Label>
            <Input
              id="nombreCliente"
              value={formData.nombreCliente}
              onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
              required
              className="border-[#D7CCC8] focus:border-[#5D4037]"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-[#5D4037]">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="border-[#D7CCC8] focus:border-[#5D4037]"
            />
          </div>

          <div>
            <Label htmlFor="telefono" className="text-[#5D4037]">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              required
              className="border-[#D7CCC8] focus:border-[#5D4037]"
            />
          </div>

          <div>
            <Label htmlFor="mensaje" className="text-[#5D4037]">Mensaje (opcional)</Label>
            <Textarea
              id="mensaje"
              value={formData.mensaje}
              onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
              rows={4}
              className="border-[#D7CCC8] focus:border-[#5D4037]"
              placeholder="Cuéntanos más sobre tu interés..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#5D4037] hover:bg-[#3E2723] text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Solicitud"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
