
'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0">
        <Image
          src="https://cdn.abacus.ai/images/e39b9c68-c796-4c7a-96e2-738ab1ba9669.png"
          alt="Luxury Real Estate"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3E2723]/80 to-[#5D4037]/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white max-w-2xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Encuentra la <span className="text-[#BCAAA4]">propiedad</span> perfecta
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-[#F5F5DC]">
            Conectamos asesores inmobiliarios profesionales con clientes en búsqueda de su hogar ideal
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/propiedades">
              <Button size="lg" className="bg-[#BCAAA4] hover:bg-[#D7CCC8] text-[#3E2723] font-semibold text-lg px-8">
                <Search className="w-5 h-5 mr-2" />
                Ver Propiedades
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#3E2723] font-semibold text-lg px-8"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Soy Asesor
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
