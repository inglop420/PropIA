
'use client';

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Building2, Phone, Mail, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const PIPELINE_STAGES = [
  { id: "nuevo", title: "Nuevo Lead", color: "bg-blue-100 border-blue-300" },
  { id: "contacto", title: "En Contacto", color: "bg-yellow-100 border-yellow-300" },
  { id: "negociacion", title: "En Negociación", color: "bg-orange-100 border-orange-300" },
  { id: "cerrado", title: "Cerrado", color: "bg-green-100 border-green-300" },
];

export default function KanbanPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result?.destination) return;

    const { draggableId, destination } = result;
    const newStage = destination?.droppableId;

    try {
      const response = await fetch(`/api/leads/${draggableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estadoPipeline: newStage }),
      });

      if (response.ok) {
        // Update local state
        setLeads((prevLeads) =>
          prevLeads?.map((lead) =>
            lead?.id === draggableId ? { ...lead, estadoPipeline: newStage } : lead
          )
        );
        toast.success("Lead actualizado");
      } else {
        toast.error("Error al actualizar lead");
      }
    } catch (error) {
      toast.error("Error al actualizar lead");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-[#6D4C41]">Cargando pipeline...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3E2723]">CRM Kanban</h1>
        <p className="text-[#6D4C41] mt-2">Gestiona tu pipeline de ventas</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = leads?.filter((lead) => lead?.estadoPipeline === stage.id) || [];

            return (
              <div key={stage.id} className="flex flex-col">
                <div className={`${stage.color} border-2 rounded-lg p-3 mb-2`}>
                  <h2 className="font-bold text-[#3E2723]">{stage.title}</h2>
                  <p className="text-sm text-[#6D4C41]">{stageLeads?.length} leads</p>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 space-y-2 min-h-[400px]"
                    >
                      {stageLeads?.map((lead, index) => (
                        <Draggable key={lead?.id} draggableId={lead?.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white rounded-lg shadow-md p-4 border border-[#D7CCC8] hover:shadow-lg transition-shadow cursor-move"
                            >
                              <h3 className="font-bold text-[#3E2723] mb-2">
                                {lead?.nombreCliente}
                              </h3>
                              
                              <div className="flex items-center text-sm text-[#6D4C41] mb-1">
                                <Building2 className="w-3 h-3 mr-2" />
                                <span className="truncate">{lead?.propiedad?.titulo || "Sin propiedad"}</span>
                              </div>

                              <div className="flex items-center text-sm text-[#6D4C41] mb-1">
                                <Phone className="w-3 h-3 mr-2" />
                                <span>{lead?.telefono}</span>
                              </div>

                              <div className="flex items-center text-sm text-[#6D4C41]">
                                <Calendar className="w-3 h-3 mr-2" />
                                <span>
                                  {new Date(lead?.fechaContacto || "").toLocaleDateString("es-MX")}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
