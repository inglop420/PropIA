
'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { StatsCard } from "@/components/stats-card";
import { Building2, Users, TrendingUp, Eye } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#60B5FF", "#FF9149", "#FF90BB", "#80D8C3"];

export default function DashboardPage() {
  const { data: session } = useSession() || {};
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        const data = await response.json();
        setStats(data || null);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (session?.user) {
      fetchStats();
    }
  }, [session]);

  if (!stats) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-[#6D4C41]">Cargando estadísticas...</p>
      </div>
    );
  }

  const leadsPorEstadoData = stats?.leadsPorEstado?.map((item: any) => ({
    name: item?.estadoPipeline || "sin estado",
    value: item?._count || 0,
  })) || [];

  const leadsPorMesData = stats?.leadsPorMes?.map((item: any) => ({
    mes: new Date(item?.mes || "").toLocaleDateString("es-MX", { month: "short" }),
    total: item?.total || 0,
  })) || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3E2723]">Dashboard</h1>
        <p className="text-[#6D4C41] mt-2">
          Bienvenido, {session?.user?.name || "Usuario"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Propiedades"
          value={stats?.totalPropiedades || 0}
          icon={Building2}
        />
        <StatsCard
          title="Propiedades Activas"
          value={stats?.propiedadesActivas || 0}
          icon={Eye}
        />
        <StatsCard
          title="Total Leads"
          value={stats?.totalLeads || 0}
          icon={Users}
        />
        <StatsCard
          title="Leads Nuevos"
          value={stats?.leadsNuevos || 0}
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Leads por Mes */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-[#D7CCC8]">
          <h2 className="text-xl font-bold text-[#3E2723] mb-4">Leads por Mes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={leadsPorMesData}>
              <XAxis
                dataKey="mes"
                tickLine={false}
                tick={{ fontSize: 10 }}
                label={{ value: "Mes", position: "insideBottom", offset: -15, style: { textAnchor: "middle", fontSize: 11 } }}
              />
              <YAxis
                tickLine={false}
                tick={{ fontSize: 10 }}
                label={{ value: "Leads", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fontSize: 11 } }}
              />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="total" stroke="#60B5FF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Leads por Estado */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-[#D7CCC8]">
          <h2 className="text-xl font-bold text-[#3E2723] mb-4">Distribución de Leads</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadsPorEstadoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry?.name}: ${entry?.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {leadsPorEstadoData?.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
