
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user) {
      // Stats para asesor autenticado
      const asesorId = (session.user as any).id;

      const totalPropiedades = await prisma.propiedad.count({
        where: { asesorId }
      });

      const propiedadesActivas = await prisma.propiedad.count({
        where: { asesorId, estadoPropiedad: "activa" }
      });

      const propiedadesVendidas = await prisma.propiedad.count({
        where: { asesorId, estadoPropiedad: "vendida" }
      });

      const totalLeads = await prisma.lead.count({
        where: { asesorId }
      });

      const leadsNuevos = await prisma.lead.count({
        where: { asesorId, estadoPipeline: "nuevo" }
      });

      // Leads por mes (últimos 6 meses)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const leadsPorMes = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "fechaContacto") as mes,
          COUNT(*)::int as total
        FROM leads
        WHERE "asesorId" = ${asesorId}
          AND "fechaContacto" >= ${sixMonthsAgo}
        GROUP BY mes
        ORDER BY mes ASC
      `;

      // Propiedades más vistas
      const propiedadesMasVistas = await prisma.propiedad.findMany({
        where: { asesorId },
        orderBy: { vistas: "desc" },
        take: 10,
        select: {
          id: true,
          titulo: true,
          vistas: true,
        }
      });

      // Distribución de leads por estado
      const leadsPorEstado = await prisma.lead.groupBy({
        by: ["estadoPipeline"],
        where: { asesorId },
        _count: true,
      });

      return NextResponse.json({
        totalPropiedades,
        propiedadesActivas,
        propiedadesVendidas,
        totalLeads,
        leadsNuevos,
        leadsPorMes,
        propiedadesMasVistas,
        leadsPorEstado,
      });
    } else {
      // Stats públicas
      const propiedadesActivas = await prisma.propiedad.count({
        where: { estadoPropiedad: "activa" }
      });

      const asesoresRegistrados = await prisma.user.count();

      const propiedadesVendidas = await prisma.propiedad.count({
        where: { estadoPropiedad: "vendida" }
      });

      return NextResponse.json({
        propiedadesActivas,
        asesoresRegistrados,
        propiedadesVendidas,
      });
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
