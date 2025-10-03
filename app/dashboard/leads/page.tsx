
'use client';

import { useEffect, useState } from "react";
import { Building2, Phone, Mail, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [reminderData, setReminderData] = useState({ descripcion: "", fechaHora: "" });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/leads");
      const data = await response.json();
      setLeads(data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handleViewDetail = async (leadId: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`);
      const data = await response.json();
      setSelectedLead(data || null);
      setShowDetail(true);
    } catch (error) {
      console.error("Error fetching lead detail:", error);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim() || !selectedLead) return;

    try {
      const response = await fetch(`/api/leads/${selectedLead.id}/notas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenido: noteContent }),
      });

      if (response.ok) {
        toast.success("Nota agregada");
        setNoteContent("");
        handleViewDetail(selectedLead.id);
      } else {
        toast.error("Error al agregar nota");
      }
    } catch (error) {
      toast.error("Error al agregar nota");
    }
  };

  const handleAddReminder = async () => {
    if (!reminderData.descripcion.trim() || !reminderData.fechaHora || !selectedLead) return;

    try {
      const response = await fetch(`/api/leads/${selectedLead.id}/recordatorios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reminderData),
      });

      if (response.ok) {
        toast.success("Recordatorio creado");
        setReminderData({ descripcion: "", fechaHora: "" });
        handleViewDetail(selectedLead.id);
      } else {
        toast.error("Error al crear recordatorio");
      }
    } catch (error) {
      toast.error("Error al crear recordatorio");
    }
  };

  return (
    <>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3E2723]">Leads / Clientes</h1>
          <p className="text-[#6D4C41] mt-2">Gestiona tus contactos y clientes potenciales</p>
        </div>

        {leads?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-md border border-[#D7CCC8]">
            <p className="text-xl text-[#6D4C41]">No tienes leads aún</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-[#D7CCC8] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F5F5DC]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5D4037] uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5D4037] uppercase tracking-wider">
                    Propiedad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5D4037] uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5D4037] uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5D4037] uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5D4037] uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#D7CCC8]">
                {leads?.map((lead) => (
                  <tr key={lead?.id} className="hover:bg-[#F5F5DC]/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-[#3E2723]">{lead?.nombreCliente}</div>
                      <div className="text-sm text-[#6D4C41]">{lead?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-2 text-[#5D4037]" />
                        <span className="text-sm text-[#6D4C41] truncate max-w-[200px]">
                          {lead?.propiedad?.titulo || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-[#6D4C41]">
                        <Phone className="w-4 h-4 mr-2" />
                        {lead?.telefono}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#F5F5DC] text-[#5D4037]">
                        {lead?.estadoPipeline}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6D4C41]">
                      {new Date(lead?.fechaContacto || "").toLocaleDateString("es-MX")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        size="sm"
                        onClick={() => handleViewDetail(lead?.id)}
                        className="bg-[#5D4037] hover:bg-[#3E2723] text-white"
                      >
                        Ver Detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#3E2723]">Detalle del Lead</DialogTitle>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-6">
              {/* Información del Cliente */}
              <div className="bg-[#F5F5DC] p-4 rounded-lg">
                <h3 className="font-bold text-[#3E2723] mb-3">Información del Cliente</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#6D4C41]">Nombre</p>
                    <p className="font-medium text-[#3E2723]">{selectedLead?.nombreCliente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6D4C41]">Email</p>
                    <p className="font-medium text-[#3E2723]">{selectedLead?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6D4C41]">Teléfono</p>
                    <p className="font-medium text-[#3E2723]">{selectedLead?.telefono}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6D4C41]">Estado</p>
                    <p className="font-medium text-[#3E2723]">{selectedLead?.estadoPipeline}</p>
                  </div>
                </div>
                {selectedLead?.mensaje && (
                  <div className="mt-3">
                    <p className="text-sm text-[#6D4C41]">Mensaje</p>
                    <p className="text-[#3E2723]">{selectedLead?.mensaje}</p>
                  </div>
                )}
              </div>

              {/* Notas */}
              <div>
                <h3 className="font-bold text-[#3E2723] mb-3 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Notas
                </h3>
                <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto">
                  {selectedLead?.notas?.length > 0 ? (
                    selectedLead.notas.map((nota: any) => (
                      <div key={nota?.id} className="bg-white p-3 rounded border border-[#D7CCC8]">
                        <p className="text-sm text-[#6D4C41] mb-1">
                          {new Date(nota?.createdAt || "").toLocaleString("es-MX")}
                        </p>
                        <p className="text-[#3E2723]">{nota?.contenido}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#6D4C41]">Sin notas</p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Agregar nota..."
                    rows={2}
                    className="border-[#D7CCC8]"
                  />
                  <Button
                    onClick={handleAddNote}
                    className="bg-[#5D4037] hover:bg-[#3E2723] text-white"
                  >
                    Agregar
                  </Button>
                </div>
              </div>

              {/* Recordatorios */}
              <div>
                <h3 className="font-bold text-[#3E2723] mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Recordatorios
                </h3>
                <div className="space-y-2 mb-4">
                  {selectedLead?.recordatorios?.length > 0 ? (
                    selectedLead.recordatorios.map((recordatorio: any) => (
                      <div key={recordatorio?.id} className="bg-white p-3 rounded border border-[#D7CCC8]">
                        <p className="font-medium text-[#3E2723]">{recordatorio?.descripcion}</p>
                        <p className="text-sm text-[#6D4C41]">
                          {new Date(recordatorio?.fechaHora || "").toLocaleString("es-MX")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#6D4C41]">Sin recordatorios</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[#5D4037]">Descripción</Label>
                    <Input
                      value={reminderData.descripcion}
                      onChange={(e) => setReminderData({ ...reminderData, descripcion: e.target.value })}
                      placeholder="Llamar al cliente"
                      className="border-[#D7CCC8]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#5D4037]">Fecha y Hora</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="datetime-local"
                        value={reminderData.fechaHora}
                        onChange={(e) => setReminderData({ ...reminderData, fechaHora: e.target.value })}
                        className="border-[#D7CCC8]"
                      />
                      <Button
                        onClick={handleAddReminder}
                        className="bg-[#5D4037] hover:bg-[#3E2723] text-white"
                      >
                        Crear
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
