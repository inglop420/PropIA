
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propiedad = await prisma.propiedad.findUnique({
      where: { id: params.id },
      include: {
        asesor: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          }
        }
      }
    });

    if (!propiedad) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    // Incrementar vistas
    await prisma.propiedad.update({
      where: { id: params.id },
      data: { vistas: { increment: 1 } }
    });

    return NextResponse.json(propiedad);
  } catch (error) {
    console.error("Error fetching propiedad:", error);
    return NextResponse.json(
      { error: "Error al obtener propiedad" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      titulo,
      descripcion,
      precio,
      ciudad,
      estado,
      colonia,
      tipo,
      superficie,
      habitaciones,
      banos,
      estacionamiento,
      amenidades,
      plantas,
      imagenes,
      estadoPropiedad,
    } = body;

    const propiedad = await prisma.propiedad.update({
      where: { id: params.id },
      data: {
        titulo,
        descripcion,
        precio: precio ? parseFloat(precio) : undefined,
        ciudad,
        estado,
        colonia,
        tipo,
        superficie: superficie ? parseFloat(superficie) : undefined,
        habitaciones: habitaciones ? parseInt(habitaciones) : undefined,
        banos: banos ? parseInt(banos) : undefined,
        estacionamiento: estacionamiento ? parseInt(estacionamiento) : undefined,
        amenidades: amenidades || undefined,
        plantas: plantas ? parseInt(plantas) : undefined,
        imagenes: imagenes || undefined,
        estadoPropiedad: estadoPropiedad || undefined,
      },
    });

    return NextResponse.json(propiedad);
  } catch (error) {
    console.error("Error updating propiedad:", error);
    return NextResponse.json(
      { error: "Error al actualizar propiedad" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await prisma.propiedad.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Propiedad eliminada" });
  } catch (error) {
    console.error("Error deleting propiedad:", error);
    return NextResponse.json(
      { error: "Error al eliminar propiedad" },
      { status: 500 }
    );
  }
}
