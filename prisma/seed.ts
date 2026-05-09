import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Admin user
  const hashedPassword = await bcrypt.hash("Admin@2025", 10);

  await prisma.user.upsert({
    where: { email: "williamsk.koffi1@gmail.com" },
    update: {},
    create: {
      email: "williamsk.koffi1@gmail.com",
      name: "Williams KOFFI",
      password: hashedPassword,
      role: "ADMIN",
      active: true,
    },
  });

  // 2. Catégories
  const screws = await prisma.category.upsert({
    where: { name: "Screws" },
    update: {},
    create: {
      name: "Screws",
      description: "Fasteners and screws",
      color: "#ef4444",
      active: true,
      seuilRotation: 4,
      autoClassification: false,
    },
  });

  const lubricants = await prisma.category.upsert({
    where: { name: "Lubricants" },
    update: {},
    create: {
      name: "Lubricants",
      description: "Oils and lubricants",
      color: "#f97316",
      active: true,
      seuilRotation: 3,
      autoClassification: true,
    },
  });

  const bearings = await prisma.category.upsert({
    where: { name: "Bearings" },
    update: {},
    create: {
      name: "Bearings",
      description: "Bearings and bushings",
      color: "#3b82f6",
      active: true,
      seuilRotation: 2,
      autoClassification: false,
    },
  });

  await prisma.category.upsert({
    where: { name: "Electrical" },
    update: {},
    create: {
      name: "Electrical",
      description: "Electrical components",
      color: "#8b5cf6",
      active: true,
      seuilRotation: 3,
      autoClassification: true,
    },
  });

  // 3. Fournisseurs
  const acm = await prisma.supplier.upsert({
    where: { email: "acm@visserie.ci" },
    update: {},
    create: {
      name: "ACM Visserie",
      contact: "Jean Dupont",
      email: "acm@visserie.ci",
      phone: "+225 07 000 00 01",
      country: "CI",
      deliveryTime: 5,
      discount: 2.5,
      status: "ACTIVE",
      rating: 4.5,
    },
  });

  const petroci = await prisma.supplier.upsert({
    where: { email: "contact@petroci.ci" },
    update: {},
    create: {
      name: "PetroCI",
      contact: "Marie Martin",
      email: "contact@petroci.ci",
      phone: "+225 07 000 00 02",
      country: "CI",
      deliveryTime: 3,
      discount: 0,
      status: "ACTIVE",
      rating: 4.0,
    },
  });

  const skf = await prisma.supplier.upsert({
    where: { email: "skf@distribution.de" },
    update: {},
    create: {
      name: "SKF Distribution",
      contact: "Hans Müller",
      email: "skf@distribution.de",
      phone: "+49 40 000 0001",
      country: "DE",
      deliveryTime: 14,
      discount: 5,
      status: "ACTIVE",
      rating: 4.8,
    },
  });

  // 4. Entrepôts
  await prisma.warehouse.upsert({
    where: { code: "EP-001" },
    update: {},
    create: {
      name: "Entrepôt Principal",
      code: "EP-001",
      address: "Avenue des Métiers, Koumassi",
      city: "Abidjan",
      country: "CI",
      manager: "Williams KOFFI",
      phone: "+225 05 960 84 000",
      area: 2500,
      maxCapacity: 10000,
      type: "MAIN",
      temperature: "AMBIENT",
      status: "ACTIVE",
    },
  });

  await prisma.warehouse.upsert({
    where: { code: "EP-002" },
    update: {},
    create: {
      name: "Entrepôt Frigorifique",
      code: "EP-002",
      address: "Zone Industrielle, Port-Bouët",
      city: "Abidjan",
      country: "CI",
      manager: "Pierre Martin",
      phone: "+225 07 000 00 03",
      area: 1200,
      maxCapacity: 5000,
      type: "SPECIALIZED",
      temperature: "REFRIGERATED",
      status: "ACTIVE",
    },
  });

  // 5. Articles
  await prisma.article.upsert({
    where: { reference: "REF-001" },
    update: {},
    create: {
      reference: "REF-001",
      designation: "Vis M6x20 Inox",
      classification: "A",
      uniteMesure: "Piece",
      seuilMin: 50,
      seuilMax: 500,
      unitPrice: 25000,
      status: "ACTIVE",
      categoryId: screws.id,
      supplierId: acm.id,
    },
  });

  await prisma.article.upsert({
    where: { reference: "REF-002" },
    update: {},
    create: {
      reference: "REF-002",
      designation: "Huile moteur 5L SAE 10w40",
      classification: "B",
      uniteMesure: "Liter",
      seuilMin: 10,
      seuilMax: 100,
      unitPrice: 150057,
      status: "ACTIVE",
      categoryId: lubricants.id,
      supplierId: petroci.id,
    },
  });

  await prisma.article.upsert({
    where: { reference: "REF-003" },
    update: {},
    create: {
      reference: "REF-003",
      designation: "Roulement SKF 6205-2RS",
      classification: "A",
      uniteMesure: "Piece",
      seuilMin: 15,
      seuilMax: 75,
      unitPrice: 12651,
      status: "ACTIVE",
      categoryId: bearings.id,
      supplierId: skf.id,
    },
  });

  console.log("✓ Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
