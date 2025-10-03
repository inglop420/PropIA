
'use client';

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/stats-card";
import { Building2, Users, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function StatsSection() {
  const [stats, setStats] = useState({
    propiedadesActivas: 0,
    asesoresRegistrados: 0,
    propiedadesVendidas: 0,
  });

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      fetch("/api/stats")
        .then(res => res.json())
        .then(data => {
          setStats({
            propiedadesActivas: data?.propiedadesActivas || 0,
            asesoresRegistrados: data?.asesoresRegistrados || 0,
            propiedadesVendidas: data?.propiedadesVendidas || 0,
          });
        })
        .catch(() => {
          // Silent fail, keep zeros
        });
    }
  }, [inView]);

  return (
    <section ref={ref} className="py-20 bg-[#F5F5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#3E2723] mb-4">
            Nuestros Números Hablan
          </h2>
          <p className="text-xl text-[#6D4C41]">
            Estadísticas en tiempo real de nuestra plataforma
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <StatsCard
              title="Propiedades Activas"
              value={stats.propiedadesActivas}
              icon={Building2}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StatsCard
              title="Asesores Registrados"
              value={stats.asesoresRegistrados}
              icon={Users}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <StatsCard
              title="Propiedades Vendidas"
              value={stats.propiedadesVendidas}
              icon={CheckCircle2}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
