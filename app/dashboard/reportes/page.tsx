
'use client';

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Building2, Eye, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS = ["#60B5FF", "#FF9149", "#FF90BB", "#80D8C3"];

export default function ReportesPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data || null);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  if (!stats) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-[#6D4C41]">Cargando reportes...</p>
      </div>
    );
  }

  const leadsPorEstadoData = stats?.leadsPorEstado?.map((item: any) => ({
    name: item?.estadoPipeline || "sin estado",
    value: item?._count || 0,
  })) || [];

  const propiedadesMasVistasData = stats?.propiedadesMasVistas?.slice(0, 10).map((item: any) => ({
    nombre: item?.titulo?.substring(0, 20) + "..." || "Sin título",
    vistas: item?.vistas || 0,
  })) || [];

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#3E2723]">Reportes</h1>
          <p className="text-[#6D4C41] mt-2">Analiza el rendimiento de tu negocio</p>
        </div>
        <Button onClick={handleExportPDF} className="bg-[#5D4037] hover:bg-[#3E2723] text-white">
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-[#D7CCC8]">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-8 h-8 text-[#5D4037]" />
            <span className="text-2xl font-bold text-[#3E2723]">
              {stats?.totalPropiedades || 0}
            </span>
          </div>
          <p className="text-sm text-[#6D4C41]">Total Propiedades</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-[#D7CCC8]">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 text-[#5D4037]" />
            <span className="text-2xl font-bold text-[#3E2723]">
              {stats?.propiedadesActivas || 0}
            </span>
          </div>
          <p className="text-sm text-[#6D4C41]">Propiedades Activas</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-[#D7CCC8]">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-[#5D4037]" />
            <span className="text-2xl font-bold text-[#3E2723]">
              {stats?.totalLeads || 0}
            </span>
          </div>
          <p className="text-sm text-[#6D4C41]">Total Leads</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-[#D7CCC8]">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-[#3E2723]">
              {stats?.propiedadesVendidas || 0}
            </span>
          </div>
          <p className="text-sm text-[#6D4C41]">Propiedades Vendidas</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Propiedades Más Vistas */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-[#D7CCC8]">
          <h2 className="text-xl font-bold text-[#3E2723] mb-4">Propiedades Más Vistas (Top 10)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={propiedadesMasVistasData} layout="horizontal">
              <XAxis
                type="number"
                tickLine={false}
                tick={{ fontSize: 10 }}
                label={{ value: "Vistas", position: "insideBottom", offset: -15, style: { textAnchor: "middle", fontSize: 11 } }}
              />
              <YAxis
                type="category"
                dataKey="nombre"
                tickLine={false}
                tick={{ fontSize: 9 }}
                width={150}
              />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="vistas" fill="#60B5FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de Leads */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-[#D7CCC8]">
          <h2 className="text-xl font-bold text-[#3E2723] mb-4">Distribución de Leads por Estado</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={leadsPorEstadoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry?.name}: ${entry?.value}`}
                outerRadius={100}
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

      {/* Leads por Propiedad Table */}
      <div className="mt-6 bg-white rounded-lg shadow-md border border-[#D7CCC8] overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#3E2723] mb-4">Leads por Propiedad</h2>
        </div>
        <table className="w-full">
          <thead className="bg-[#F5F5DC]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#5D4037] uppercase">
                Propiedad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#5D4037] uppercase">
                Vistas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#5D4037] uppercase">
                Leads Generados
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#D7CCC8]">
            {stats?.propiedadesMasVistas?.map((propiedad: any) => (
              <tr key={propiedad?.id} className="hover:bg-[#F5F5DC]/30">
                <td className="px-6 py-4">
                  <p className="font-medium text-[#3E2723]">{propiedad?.titulo}</p>
                </td>
                <td className="px-6 py-4 text-[#6D4C41]">
                  {propiedad?.vistas || 0}
                </td>
                <td className="px-6 py-4 text-[#6D4C41]">
                  {/* This would need additional API data */}
                  -
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
