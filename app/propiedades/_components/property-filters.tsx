
'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

const TIPOS_PROPIEDAD = [
  "all",
  "Casa",
  "Departamento",
  "Terreno",
  "Local comercial",
  "Oficina",
  "Bodega",
  "Rancho",
  "Condominio",
  "Penthouse",
  "Loft"
];

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    ciudad: searchParams?.get("ciudad") || "",
    tipo: searchParams?.get("tipo") || "all",
    precioMin: searchParams?.get("precioMin") || "",
    precioMax: searchParams?.get("precioMax") || "",
    habitaciones: searchParams?.get("habitaciones") || "",
    ordenar: searchParams?.get("ordenar") || "recientes",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (filters.ciudad) params.set("ciudad", filters.ciudad);
    if (filters.tipo && filters.tipo !== "all") params.set("tipo", filters.tipo);
    if (filters.precioMin) params.set("precioMin", filters.precioMin);
    if (filters.precioMax) params.set("precioMax", filters.precioMax);
    if (filters.habitaciones) params.set("habitaciones", filters.habitaciones);
    if (filters.ordenar) params.set("ordenar", filters.ordenar);

    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-[#D7CCC8]">
      <div className="flex items-center mb-4">
        <SlidersHorizontal className="w-5 h-5 text-[#5D4037] mr-2" />
        <h2 className="text-xl font-bold text-[#3E2723]">Filtros de Búsqueda</h2>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Input
          placeholder="Ciudad..."
          value={filters.ciudad}
          onChange={(e) => setFilters({ ...filters, ciudad: e.target.value })}
          className="border-[#D7CCC8]"
        />

        <Select value={filters.tipo} onValueChange={(value) => setFilters({ ...filters, tipo: value })}>
          <SelectTrigger className="border-[#D7CCC8]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {TIPOS_PROPIEDAD.filter(t => t !== "all").map((tipo) => (
              <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Precio mín..."
          value={filters.precioMin}
          onChange={(e) => setFilters({ ...filters, precioMin: e.target.value })}
          className="border-[#D7CCC8]"
        />

        <Input
          type="number"
          placeholder="Precio máx..."
          value={filters.precioMax}
          onChange={(e) => setFilters({ ...filters, precioMax: e.target.value })}
          className="border-[#D7CCC8]"
        />

        <Input
          type="number"
          placeholder="Habitaciones..."
          value={filters.habitaciones}
          onChange={(e) => setFilters({ ...filters, habitaciones: e.target.value })}
          className="border-[#D7CCC8]"
        />

        <Select value={filters.ordenar} onValueChange={(value) => setFilters({ ...filters, ordenar: value })}>
          <SelectTrigger className="border-[#D7CCC8]">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recientes">Más recientes</SelectItem>
            <SelectItem value="precio-asc">Precio: menor a mayor</SelectItem>
            <SelectItem value="precio-desc">Precio: mayor a menor</SelectItem>
            <SelectItem value="vistas">Más vistas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleSearch}
          className="bg-[#5D4037] hover:bg-[#3E2723] text-white"
        >
          <Search className="w-4 h-4 mr-2" />
          Buscar
        </Button>
      </div>
    </div>
  );
}
