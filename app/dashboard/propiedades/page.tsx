
'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MisPropiedadesPage() {
  const { data: session } = useSession() || {};
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (session?.user) {
      fetchPropiedades();
    }
  }, [session, filter]);

  const fetchPropiedades = async () => {
    try {
      const asesorId = (session?.user as any)?.id;
      const url = `/api/propiedades?asesorId=${asesorId}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      let filtered = data || [];
      if (filter !== "all") {
        filtered = filtered?.filter((p: any) => p?.estadoPropiedad === filter);
      }
      
      setPropiedades(filtered);
    } catch (error) {
      console.error("Error fetching propiedades:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#3E2723]">Mis Propiedades</h1>
          <p className="text-[#6D4C41] mt-2">Gestiona tu inventario de propiedades</p>
        </div>
        <Link href="/dashboard/propiedades/crear">
          <Button className="bg-[#5D4037] hover:bg-[#3E2723] text-white">
            <Plus className="w-5 h-5 mr-2" />
            Nueva Propiedad
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-64 border-[#D7CCC8]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="activa">Activas</SelectItem>
            <SelectItem value="vendida">Vendidas</SelectItem>
            <SelectItem value="archivada">Archivadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#5D4037]" />
        </div>
      ) : propiedades?.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-md border border-[#D7CCC8]">
          <p className="text-xl text-[#6D4C41] mb-4">No tienes propiedades aún</p>
          <Link href="/dashboard/propiedades/crear">
            <Button className="bg-[#5D4037] hover:bg-[#3E2723] text-white">
              <Plus className="w-5 h-5 mr-2" />
              Crear Primera Propiedad
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propiedades?.map((propiedad, index) => (
            <PropertyCard key={propiedad?.id} {...propiedad} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
