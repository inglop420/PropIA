
'use client';

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Car, Maximize, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface PropertyCardProps {
  id: string;
  titulo: string;
  precio: number;
  ciudad: string;
  estado: string;
  tipo: string;
  habitaciones: number;
  banos: number;
  estacionamiento: number;
  superficie: number;
  imagenes: any[];
  index?: number;
}

export function PropertyCard({
  id,
  titulo,
  precio,
  ciudad,
  estado,
  tipo,
  habitaciones,
  banos,
  estacionamiento,
  superficie,
  imagenes,
  index = 0,
}: PropertyCardProps) {
  const primeraImagen = Array.isArray(imagenes) && imagenes?.length > 0 ? imagenes[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/propiedades/${id}`}>
        <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[#D7CCC8]">
          {/* Imagen */}
          <div className="relative aspect-video bg-[#D7CCC8]">
            {primeraImagen && (
              <Image
                src={primeraImagen}
                alt={titulo || "Propiedad"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            <div className="absolute top-3 left-3 bg-[#5D4037] text-white px-3 py-1 rounded-full text-sm font-medium">
              {tipo}
            </div>
            <div className="absolute top-3 right-3 bg-white/90 text-[#3E2723] px-3 py-1 rounded-full text-sm font-bold">
              ${precio?.toLocaleString() || "0"}
            </div>
          </div>

          {/* Contenido */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-[#3E2723] mb-2 line-clamp-2 group-hover:text-[#6D4C41] transition-colors">
              {titulo || "Sin título"}
            </h3>

            <div className="flex items-center text-[#6D4C41] mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{ciudad}, {estado}</span>
            </div>

            <div className="grid grid-cols-4 gap-3 pt-3 border-t border-[#D7CCC8]">
              <div className="flex items-center text-[#5D4037]">
                <Bed className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{habitaciones}</span>
              </div>
              <div className="flex items-center text-[#5D4037]">
                <Bath className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{banos}</span>
              </div>
              <div className="flex items-center text-[#5D4037]">
                <Car className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{estacionamiento}</span>
              </div>
              <div className="flex items-center text-[#5D4037]">
                <Maximize className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{superficie}m²</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
