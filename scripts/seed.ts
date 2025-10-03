
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SAMPLE_IMAGES = [
  "https://cdn.abacus.ai/images/4746d21d-3c32-4746-a403-a48fb088fda2.png",
  "https://cdn.abacus.ai/images/24589c8d-bd88-4d42-b639-69c3d2b3c7b5.png",
  "https://cdn.abacus.ai/images/7db5a365-cf1a-4812-9955-3ccdda5011bc.png",
  "https://cdn.abacus.ai/images/5c13bb65-1141-469d-b89e-bfa8983f8712.png",
  "https://cdn.abacus.ai/images/de402b0d-7f68-4f2b-8601-6c811aad6481.png",
];

async function main() {
  console.log("🌱 Starting seed...");

  // Create default admin account
  const hashedPassword = await bcrypt.hash("johndoe123", 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: "john@doe.com" },
    update: {},
    create: {
      email: "john@doe.com",
      name: "John Doe",
      phone: "3312345678",
      password: hashedPassword,
    },
  });

  console.log("✅ Admin user created:", adminUser.email);

  // Create sample properties
  const propiedades = [
    {
      titulo: "Casa Moderna en Providencia",
      descripcion: "Hermosa casa de dos plantas en una de las zonas más exclusivas de Guadalajara. Cuenta con amplios espacios, jardín privado y acabados de lujo.",
      precio: 8500000,
      ciudad: "Guadalajara",
      estado: "Jalisco",
      colonia: "Providencia",
      tipo: "Casa",
      superficie: 350,
      habitaciones: 4,
      banos: 3,
      estacionamiento: 2,
      amenidades: ["Jardín", "Alberca", "Cocina integral", "Seguridad 24/7"],
      plantas: 2,
      imagenes: SAMPLE_IMAGES,
    },
    {
      titulo: "Departamento de Lujo en Puerta de Hierro",
      descripcion: "Exclusivo departamento con vista panorámica a la ciudad. Ubicado en zona premium con acceso a gimnasio, alberca y áreas verdes.",
      precio: 6200000,
      ciudad: "Zapopan",
      estado: "Jalisco",
      colonia: "Puerta de Hierro",
      tipo: "Departamento",
      superficie: 180,
      habitaciones: 3,
      banos: 2,
      estacionamiento: 2,
      amenidades: ["Gimnasio", "Alberca", "Elevador", "Seguridad 24/7", "Terraza"],
      plantas: 1,
      imagenes: SAMPLE_IMAGES.slice(0, 5),
    },
    {
      titulo: "Terreno Residencial en Zapopan",
      descripcion: "Amplio terreno en zona residencial de alta plusvalía. Ideal para desarrollar proyecto habitacional o casa de campo.",
      precio: 4500000,
      ciudad: "Zapopan",
      estado: "Jalisco",
      colonia: "El Palomar",
      tipo: "Terreno",
      superficie: 500,
      habitaciones: 0,
      banos: 0,
      estacionamiento: 0,
      amenidades: ["Acceso pavimentado", "Servicios completos"],
      plantas: 1,
      imagenes: [SAMPLE_IMAGES[4], SAMPLE_IMAGES[0], SAMPLE_IMAGES[2], SAMPLE_IMAGES[3], SAMPLE_IMAGES[1]],
    },
    {
      titulo: "Oficina Corporativa en Zona Financiera",
      descripcion: "Oficina equipada en edificio corporativo de primer nivel. Ubicación estratégica con fácil acceso y estacionamiento.",
      precio: 5800000,
      ciudad: "Guadalajara",
      estado: "Jalisco",
      colonia: "Zona Financiera",
      tipo: "Oficina",
      superficie: 220,
      habitaciones: 0,
      banos: 2,
      estacionamiento: 3,
      amenidades: ["Elevador", "Seguridad 24/7", "Aire acondicionado", "Recepción"],
      plantas: 1,
      imagenes: [SAMPLE_IMAGES[2], SAMPLE_IMAGES[3], SAMPLE_IMAGES[1], SAMPLE_IMAGES[0], SAMPLE_IMAGES[4]],
    },
    {
      titulo: "Penthouse con Vista al Bosque",
      descripcion: "Espectacular penthouse en el último piso con terraza privada y vista inigualable. Acabados premium y diseño contemporáneo.",
      precio: 12500000,
      ciudad: "Guadalajara",
      estado: "Jalisco",
      colonia: "Colinas de San Javier",
      tipo: "Penthouse",
      superficie: 420,
      habitaciones: 4,
      banos: 4,
      estacionamiento: 3,
      amenidades: ["Terraza", "Alberca privada", "Gimnasio", "Elevador", "Cocina integral", "Amueblado"],
      plantas: 2,
      imagenes: [SAMPLE_IMAGES[3], SAMPLE_IMAGES[1], SAMPLE_IMAGES[4], SAMPLE_IMAGES[0], SAMPLE_IMAGES[2]],
    },
    {
      titulo: "Local Comercial en Plaza",
      descripcion: "Local comercial en plaza de alto tráfico. Excelente ubicación para negocio retail o servicios.",
      precio: 3200000,
      ciudad: "Tlaquepaque",
      estado: "Jalisco",
      colonia: "Centro",
      tipo: "Local comercial",
      superficie: 85,
      habitaciones: 0,
      banos: 1,
      estacionamiento: 1,
      amenidades: ["Aire acondicionado", "Acceso independiente"],
      plantas: 1,
      imagenes: [SAMPLE_IMAGES[2], SAMPLE_IMAGES[0], SAMPLE_IMAGES[3], SAMPLE_IMAGES[1], SAMPLE_IMAGES[4]],
    },
  ];

  for (const propData of propiedades) {
    const propiedad = await prisma.propiedad.create({
      data: {
        ...propData,
        asesorId: adminUser.id,
      },
    });
    console.log("✅ Propiedad creada:", propiedad.titulo);
  }

  // Create sample leads
  const allPropiedades = await prisma.propiedad.findMany();
  
  const sampleLeads = [
    {
      nombreCliente: "María García",
      email: "maria@example.com",
      telefono: "3398765432",
      mensaje: "Me interesa conocer más detalles sobre la propiedad",
      estadoPipeline: "nuevo",
    },
    {
      nombreCliente: "Carlos Rodríguez",
      email: "carlos@example.com",
      telefono: "3387654321",
      mensaje: "Quisiera agendar una visita",
      estadoPipeline: "contacto",
    },
    {
      nombreCliente: "Ana López",
      email: "ana@example.com",
      telefono: "3376543210",
      mensaje: "Estoy interesada en esta propiedad para inversión",
      estadoPipeline: "negociacion",
    },
  ];

  for (let i = 0; i < sampleLeads.length && i < allPropiedades.length; i++) {
    const lead = await prisma.lead.create({
      data: {
        ...sampleLeads[i],
        propiedadId: allPropiedades[i]?.id || "",
        asesorId: adminUser.id,
      },
    });
    console.log("✅ Lead creado:", lead.nombreCliente);

    // Add sample note
    await prisma.nota.create({
      data: {
        leadId: lead.id,
        contenido: "Cliente muestra interés genuino. Seguimiento programado.",
      },
    });
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
