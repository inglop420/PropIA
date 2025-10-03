
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const estadoPipeline = searchParams.get("estadoPipeline");

    const where: any = {
      asesorId: (session.user as any).id,
    };

    if (estadoPipeline && estadoPipeline !== "all") {
      where.estadoPipeline = estadoPipeline;
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        propiedad: {
          select: {
            id: true,
            titulo: true,
            precio: true,
            imagenes: true,
          }
        },
        notas: {
          orderBy: { createdAt: "desc" }
        },
        recordatorios: {
          orderBy: { fechaHora: "asc" },
          where: {
            completado: false
          }
        }
      },
      orderBy: { fechaContacto: "desc" }
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Error al obtener leads" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      propiedadId,
      nombreCliente,
      email,
      telefono,
      mensaje,
    } = body;

    if (!propiedadId || !nombreCliente || !email || !telefono) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const propiedad = await prisma.propiedad.findUnique({
      where: { id: propiedadId },
      select: { asesorId: true }
    });

    if (!propiedad) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        propiedadId,
        asesorId: propiedad.asesorId,
        nombreCliente,
        email,
        telefono,
        mensaje: mensaje || null,
        estadoPipeline: "nuevo",
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Error al crear lead" },
      { status: 500 }
    );
  }
}
