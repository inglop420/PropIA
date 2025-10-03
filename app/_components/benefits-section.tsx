
'use client';

import { Shield, Search, Headphones, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const benefits = [
  {
    icon: Search,
    title: "Búsqueda Inteligente",
    description: "Encuentra propiedades con filtros avanzados y búsqueda personalizada según tus necesidades"
  },
  {
    icon: Shield,
    title: "Asesores Verificados",
    description: "Trabaja con asesores inmobiliarios profesionales y verificados en toda la república"
  },
  {
    icon: Headphones,
    title: "Atención Personalizada",
    description: "Recibe asesoría directa y personalizada desde el primer contacto hasta el cierre"
  },
  {
    icon: TrendingUp,
    title: "Herramientas CRM",
    description: "Para asesores: gestiona tus leads y propiedades con nuestro sistema Kanban integrado"
  }
];

export function BenefitsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#3E2723] mb-4">
            ¿Por qué elegir PropIA?
          </h2>
          <p className="text-xl text-[#6D4C41]">
            La plataforma completa para el mercado inmobiliario moderno
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#F5F5DC] p-6 rounded-lg shadow-md hover:shadow-xl transition-all group"
            >
              <div className="bg-[#5D4037] w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <benefit.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">{benefit.title}</h3>
              <p className="text-[#6D4C41]">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
