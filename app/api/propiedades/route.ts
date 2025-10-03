
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    
    const ciudad = searchParams.get("ciudad");
    const tipo = searchParams.get("tipo");
    const precioMin = searchParams.get("precioMin");
    const precioMax = searchParams.get("precioMax");
    const habitaciones = searchParams.get("habitaciones");
    const banos = searchParams.get("banos");
    const superficieMin = searchParams.get("superficieMin");
    const ordenar = searchParams.get("ordenar") || "recientes";
    const asesorId = searchParams.get("asesorId");

    const where: any = {};

    if (asesorId) {
      where.asesorId = asesorId;
    } else {
      where.estadoPropiedad = "activa";
    }

    if (ciudad) where.ciudad = { contains: ciudad, mode: "insensitive" };
    if (tipo && tipo !== "all") where.tipo = tipo;
    if (precioMin) where.precio = { ...where.precio, gte: parseFloat(precioMin) };
    if (precioMax) where.precio = { ...where.precio, lte: parseFloat(precioMax) };
    if (habitaciones) where.habitaciones = { gte: parseInt(habitaciones) };
    if (banos) where.banos = { gte: parseInt(banos) };
    if (superficieMin) where.superficie = { gte: parseFloat(superficieMin) };

    let orderBy: any = { fechaPublicacion: "desc" };
    if (ordenar === "precio-asc") orderBy = { precio: "asc" };
    if (ordenar === "precio-desc") orderBy = { precio: "desc" };
    if (ordenar === "vistas") orderBy = { vistas: "desc" };

    const propiedades = await prisma.propiedad.findMany({
      where,
      orderBy,
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

    return NextResponse.json(propiedades);
  } catch (error) {
    console.error("Error fetching propiedades:", error);
    return NextResponse.json(
      { error: "Error al obtener propiedades" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
    } = body;

    const propiedad = await prisma.propiedad.create({
      data: {
        asesorId: (session.user as any).id,
        titulo,
        descripcion,
        precio: parseFloat(precio),
        ciudad,
        estado,
        colonia,
        tipo,
        superficie: parseFloat(superficie),
        habitaciones: parseInt(habitaciones),
        banos: parseInt(banos),
        estacionamiento: parseInt(estacionamiento),
        amenidades: amenidades || [],
        plantas: parseInt(plantas),
        imagenes: imagenes || [],
      },
    });

    return NextResponse.json(propiedad, { status: 201 });
  } catch (error) {
    console.error("Error creating propiedad:", error);
    return NextResponse.json(
      { error: "Error al crear propiedad" },
      { status: 500 }
    );
  }
}
