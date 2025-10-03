
'use client';

import { PropertyForm } from "../_components/property-form";

export default function CrearPropiedadPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3E2723]">Nueva Propiedad</h1>
        <p className="text-[#6D4C41] mt-2">Crea una nueva propiedad en tu inventario</p>
      </div>

      <PropertyForm />
    </div>
  );
}
