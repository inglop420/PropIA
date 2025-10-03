
'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LeadFormModal } from "@/components/lead-form-modal";
import {
  Bed,
  Bath,
  Car,
  Maximize,
  MapPin,
  Phone,
  Mail,
  Eye,
  Home,
  CheckCircle2
} from "lucide-react";
import { Loader2 } from "lucide-react";

interface PropertyDetailProps {
  propiedadId: string;
}

export function PropertyDetail({ propiedadId }: PropertyDetailProps) {
  const [propiedad, setPropiedad] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPropiedad = async () => {
      try {
        const response = await fetch(`/api/propiedades/${propiedadId}`);
        const data = await response.json();
        setPropiedad(data || null);
      } catch (error) {
        console.error("Error fetching propiedad:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropiedad();
  }, [propiedadId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#5D4037]" />
      </div>
    );
  }

  if (!propiedad) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-[#6D4C41]">Propiedad no encontrada</p>
      </div>
    );
  }

  const imagenes = Array.isArray(propiedad?.imagenes) ? propiedad.imagenes : [];
  const amenidades = Array.isArray(propiedad?.amenidades) ? propiedad.amenidades : [];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Galería de Imágenes */}
        <div className="mb-8">
          <div className="relative aspect-video bg-[#D7CCC8] rounded-lg overflow-hidden mb-4">
            {imagenes?.length > 0 ? (
              <Image
                src={imagenes[currentImageIndex] || ""}
                alt={propiedad?.titulo || "Propiedad"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Home className="w-20 h-20 text-[#5D4037] opacity-50" />
              </div>
            )}
          </div>

          {imagenes?.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {imagenes?.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-video bg-[#D7CCC8] rounded overflow-hidden ${
                    index === currentImageIndex ? "ring-2 ring-[#5D4037]" : ""
                  }`}
                >
                  <Image src={img || ""} alt={`Imagen ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Información Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 border border-[#D7CCC8] mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block bg-[#F5F5DC] text-[#5D4037] px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {propiedad?.tipo}
                  </span>
                  <h1 className="text-3xl font-bold text-[#3E2723]">{propiedad?.titulo}</h1>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#5D4037]">
                    ${propiedad?.precio?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-[#6D4C41] mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{propiedad?.colonia}, {propiedad?.ciudad}, {propiedad?.estado}</span>
              </div>

              <div className="flex items-center text-[#6D4C41] mb-6">
                <Eye className="w-4 h-4 mr-2" />
                <span className="text-sm">{propiedad?.vistas} vistas</span>
              </div>

              <div className="grid grid-cols-4 gap-4 pb-6 border-b border-[#D7CCC8]">
                <div className="flex items-center text-[#5D4037]">
                  <Bed className="w-5 h-5 mr-2" />
                  <div>
                    <p className="text-sm text-[#6D4C41]">Habitaciones</p>
                    <p className="font-bold">{propiedad?.habitaciones}</p>
                  </div>
                </div>
                <div className="flex items-center text-[#5D4037]">
                  <Bath className="w-5 h-5 mr-2" />
                  <div>
                    <p className="text-sm text-[#6D4C41]">Baños</p>
                    <p className="font-bold">{propiedad?.banos}</p>
                  </div>
                </div>
                <div className="flex items-center text-[#5D4037]">
                  <Car className="w-5 h-5 mr-2" />
                  <div>
                    <p className="text-sm text-[#6D4C41]">Estacionamiento</p>
                    <p className="font-bold">{propiedad?.estacionamiento}</p>
                  </div>
                </div>
                <div className="flex items-center text-[#5D4037]">
                  <Maximize className="w-5 h-5 mr-2" />
                  <div>
                    <p className="text-sm text-[#6D4C41]">Superficie</p>
                    <p className="font-bold">{propiedad?.superficie}m²</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <h2 className="text-xl font-bold text-[#3E2723] mb-3">Descripción</h2>
                <p className="text-[#6D4C41] leading-relaxed whitespace-pre-line">
                  {propiedad?.descripcion}
                </p>
              </div>

              {amenidades?.length > 0 && (
                <div className="pt-6 border-t border-[#D7CCC8] mt-6">
                  <h2 className="text-xl font-bold text-[#3E2723] mb-3">Amenidades</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenidades?.map((amenidad: string, index: number) => (
                      <div key={index} className="flex items-center text-[#5D4037]">
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        <span>{amenidad}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información del Asesor */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-[#D7CCC8] sticky top-20">
              <h2 className="text-xl font-bold text-[#3E2723] mb-4">Información del Asesor</h2>
              
              <div className="mb-4">
                <p className="text-sm text-[#6D4C41] mb-1">Nombre</p>
                <p className="font-bold text-[#5D4037]">{propiedad?.asesor?.name}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-[#6D4C41] mb-1">Teléfono</p>
                <div className="flex items-center text-[#5D4037]">
                  <Phone className="w-4 h-4 mr-2" />
                  <p className="font-bold">{propiedad?.asesor?.phone || "No disponible"}</p>
                </div>
              </div>

              <Button
                onClick={() => setShowLeadForm(true)}
                className="w-full bg-[#5D4037] hover:bg-[#3E2723] text-white font-semibold py-6 text-lg"
              >
                Solicitar Información
              </Button>

              <p className="text-xs text-[#6D4C41] text-center mt-4">
                Tu información será enviada directamente al asesor
              </p>
            </div>
          </div>
        </div>
      </div>

      <LeadFormModal
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        propiedadId={propiedadId}
        propiedadTitulo={propiedad?.titulo || ""}
      />
    </>
  );
}
