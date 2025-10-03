
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { descripcion, fechaHora } = body;

    if (!descripcion || !fechaHora) {
      return NextResponse.json(
        { error: "Descripción y fecha son requeridas" },
        { status: 400 }
      );
    }

    const recordatorio = await prisma.recordatorio.create({
      data: {
        leadId: params.id,
        descripcion,
        fechaHora: new Date(fechaHora),
      },
    });

    return NextResponse.json(recordatorio, { status: 201 });
  } catch (error) {
    console.error("Error creating recordatorio:", error);
    return NextResponse.json(
      { error: "Error al crear recordatorio" },
      { status: 500 }
    );
  }
}
