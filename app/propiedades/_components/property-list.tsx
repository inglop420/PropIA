
'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/property-card";
import { Loader2 } from "lucide-react";

export function PropertyList() {
  const searchParams = useSearchParams();
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropiedades = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        searchParams?.forEach((value, key) => {
          params.set(key, value);
        });

        const response = await fetch(`/api/propiedades?${params.toString()}`);
        const data = await response.json();
        setPropiedades(data || []);
      } catch (error) {
        console.error("Error fetching propiedades:", error);
        setPropiedades([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPropiedades();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#5D4037]" />
      </div>
    );
  }

  if (propiedades?.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-[#6D4C41]">No se encontraron propiedades con los criterios seleccionados</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {propiedades?.map((propiedad, index) => (
        <PropertyCard key={propiedad?.id} {...propiedad} index={index} />
      ))}
    </div>
  );
}
