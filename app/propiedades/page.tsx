
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PropertyFilters } from "./_components/property-filters";
import { PropertyList } from "./_components/property-list";

export default function PropiedadesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-[#F5F5DC]">
      <Navbar />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#3E2723] mb-8">
            Encuentra tu Propiedad Ideal
          </h1>
          
          <Suspense fallback={<div className="text-center py-4">Cargando filtros...</div>}>
            <PropertyFilters />
            <PropertyList />
          </Suspense>
        </div>
      </div>

      <Footer />
    </main>
  );
}
