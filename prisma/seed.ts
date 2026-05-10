import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── 1. Utilisateur admin ──────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("Admin@2025", 10);
  const admin = await prisma.user.upsert({
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
  console.log("  ✓ Admin user");

  // ── 2. Catégories ─────────────────────────────────────────────────────────
  const screws = await prisma.category.upsert({
    where: { name: "Screws" },
    update: {},
    create: { name: "Screws", description: "Fasteners and screws", color: "#ef4444", active: true, seuilRotation: 4 },
  });
  const lubricants = await prisma.category.upsert({
    where: { name: "Lubricants" },
    update: {},
    create: { name: "Lubricants", description: "Oils and lubricants", color: "#f97316", active: true, seuilRotation: 3, autoClassification: true },
  });
  const bearings = await prisma.category.upsert({
    where: { name: "Bearings" },
    update: {},
    create: { name: "Bearings", description: "Bearings and bushings", color: "#3b82f6", active: true, seuilRotation: 2 },
  });
  await prisma.category.upsert({
    where: { name: "Electrical" },
    update: {},
    create: { name: "Electrical", description: "Electrical components", color: "#8b5cf6", active: true, seuilRotation: 3, autoClassification: true },
  });
  console.log("  ✓ 4 catégories");

  // ── 3. Fournisseurs ───────────────────────────────────────────────────────
  const acm = await prisma.supplier.upsert({
    where: { email: "acm@visserie.ci" },
    update: {},
    create: { name: "ACM Visserie", contact: "Jean Dupont", email: "acm@visserie.ci", phone: "+22507000001", country: "CI", deliveryTime: 5, discount: 2.5, status: "ACTIVE", rating: 4.5 },
  });
  const petroci = await prisma.supplier.upsert({
    where: { email: "contact@petroci.ci" },
    update: {},
    create: { name: "PetroCI", contact: "Marie Martin", email: "contact@petroci.ci", phone: "+22507000002", country: "CI", deliveryTime: 3, discount: 0, status: "ACTIVE", rating: 4.0 },
  });
  const skf = await prisma.supplier.upsert({
    where: { email: "skf@distribution.de" },
    update: {},
    create: { name: "SKF Distribution", contact: "Hans Müller", email: "skf@distribution.de", phone: "+49400000001", country: "DE", deliveryTime: 14, discount: 5, status: "ACTIVE", rating: 4.8 },
  });
  console.log("  ✓ 3 fournisseurs");

  // ── 4. Entrepôts ──────────────────────────────────────────────────────────
  const ep001 = await prisma.warehouse.upsert({
    where: { code: "EP-001" },
    update: {},
    create: { name: "Entrepôt Principal", code: "EP-001", address: "Avenue des Métiers, Koumassi", city: "Abidjan", country: "CI", manager: "Williams KOFFI", phone: "+225 05 960 84 000", area: 2500, maxCapacity: 10000, type: "MAIN", temperature: "AMBIENT", status: "ACTIVE" },
  });
  const ep002 = await prisma.warehouse.upsert({
    where: { code: "EP-002" },
    update: {},
    create: { name: "Entrepôt Frigorifique", code: "EP-002", address: "Zone Industrielle, Port-Bouët", city: "Abidjan", country: "CI", manager: "Pierre Martin", phone: "+225 07 000 00 03", area: 1200, maxCapacity: 5000, type: "SPECIALIZED", temperature: "REFRIGERATED", status: "ACTIVE" },
  });
  console.log("  ✓ 2 entrepôts");

  // ── 5. Articles ───────────────────────────────────────────────────────────
  const art001 = await prisma.article.upsert({
    where: { reference: "REF-001" },
    update: {},
    create: { reference: "REF-001", designation: "Vis M6x20 Inox", description: "Visserie inox haute résistance M6x20mm", classification: "A", uniteMesure: "Piece", seuilMin: 50, seuilMax: 500, unitPrice: 25000, status: "ACTIVE", categoryId: screws.id, supplierId: acm.id },
  });
  const art002 = await prisma.article.upsert({
    where: { reference: "REF-002" },
    update: {},
    create: { reference: "REF-002", designation: "Huile moteur 5L SAE 10w40", description: "Huile moteur multigrade synthétique", classification: "B", uniteMesure: "Liter", seuilMin: 10, seuilMax: 100, unitPrice: 150057, status: "ACTIVE", categoryId: lubricants.id, supplierId: petroci.id },
  });
  const art003 = await prisma.article.upsert({
    where: { reference: "REF-003" },
    update: {},
    create: { reference: "REF-003", designation: "Roulement SKF 6205-2RS", description: "Roulement à billes double étanchéité", classification: "A", uniteMesure: "Piece", seuilMin: 15, seuilMax: 75, unitPrice: 12651, status: "ACTIVE", categoryId: bearings.id, supplierId: skf.id },
  });
  console.log("  ✓ 3 articles");

  // ── 6. Emplacements ───────────────────────────────────────────────────────
  const locA1B1 = await prisma.location.upsert({
    where: { code: "EP001-A1-B1-C1" },
    update: {},
    create: { code: "EP001-A1-B1-C1", warehouseId: ep001.id, zone: "A", aisle: "1", span: "B1", level: "C1", maxCapacity: 500 },
  });
  const locA1B2 = await prisma.location.upsert({
    where: { code: "EP001-A1-B2-C1" },
    update: {},
    create: { code: "EP001-A1-B2-C1", warehouseId: ep001.id, zone: "A", aisle: "1", span: "B2", level: "C1", maxCapacity: 200 },
  });
  const locA2B1 = await prisma.location.upsert({
    where: { code: "EP001-A2-B1-C1" },
    update: {},
    create: { code: "EP001-A2-B1-C1", warehouseId: ep001.id, zone: "A", aisle: "2", span: "B1", level: "C1", maxCapacity: 100 },
  });
  const locB1A1 = await prisma.location.upsert({
    where: { code: "EP001-B1-A1-C1" },
    update: {},
    create: { code: "EP001-B1-A1-C1", warehouseId: ep001.id, zone: "B", aisle: "1", span: "A1", level: "C1", maxCapacity: 300 },
  });
  await prisma.location.upsert({
    where: { code: "EP001-B1-A1-C2" },
    update: {},
    create: { code: "EP001-B1-A1-C2", warehouseId: ep001.id, zone: "B", aisle: "1", span: "A1", level: "C2", maxCapacity: 300 },
  });
  await prisma.location.upsert({
    where: { code: "EP002-F1-A1-C1" },
    update: {},
    create: { code: "EP002-F1-A1-C1", warehouseId: ep002.id, zone: "F", aisle: "1", span: "A1", level: "C1", maxCapacity: 200 },
  });
  await prisma.location.upsert({
    where: { code: "EP002-F1-A1-C2" },
    update: {},
    create: { code: "EP002-F1-A1-C2", warehouseId: ep002.id, zone: "F", aisle: "1", span: "A1", level: "C2", maxCapacity: 200 },
  });
  console.log("  ✓ 7 emplacements");

  // ── 7. Stocks initiaux ────────────────────────────────────────────────────
  // Pattern : createIfNotExists (lot null pose des pb avec upsert en PostgreSQL)
  for (const [articleId, locationId, quantity] of [
    [art001.id, locA1B1.id, 150],
    [art002.id, locA1B2.id, 25],
    [art003.id, locA2B1.id, 5],
  ] as [number, number, number][]) {
    const existing = await prisma.stock.findFirst({ where: { articleId, locationId, lotNumber: null } });
    if (!existing) {
      await prisma.stock.create({ data: { articleId, locationId, quantity } });
    }
  }
  console.log("  ✓ 3 stocks initiaux");

  // ── 8. Mouvements ─────────────────────────────────────────────────────────
  const movements = [
    {
      reference: "MVT-2024-001",
      type: "ENTRY" as const,
      destWarehouseId: ep001.id,
      status: "COMPLETED" as const,
      executionDate: new Date("2024-01-10"),
      line: { articleId: art001.id, destLocationId: locA1B1.id, quantity: 200, unitCost: 25000 },
    },
    {
      reference: "MVT-2024-002",
      type: "ENTRY" as const,
      destWarehouseId: ep001.id,
      status: "COMPLETED" as const,
      executionDate: new Date("2024-01-12"),
      line: { articleId: art002.id, destLocationId: locA1B2.id, quantity: 30, unitCost: 150057 },
    },
    {
      reference: "MVT-2024-003",
      type: "ENTRY" as const,
      destWarehouseId: ep001.id,
      status: "COMPLETED" as const,
      executionDate: new Date("2024-01-08"),
      line: { articleId: art003.id, destLocationId: locA2B1.id, quantity: 20, unitCost: 12651 },
    },
    {
      reference: "MVT-2024-004",
      type: "EXIT" as const,
      sourceWarehouseId: ep001.id,
      status: "COMPLETED" as const,
      executionDate: new Date("2024-01-14"),
      line: { articleId: art001.id, sourceLocationId: locA1B1.id, quantity: 50, unitCost: 25000 },
    },
    {
      reference: "MVT-2024-005",
      type: "EXIT" as const,
      sourceWarehouseId: ep001.id,
      status: "COMPLETED" as const,
      executionDate: new Date("2024-01-15"),
      line: { articleId: art002.id, sourceLocationId: locA1B2.id, quantity: 5, unitCost: 150057 },
    },
    {
      reference: "MVT-2024-006",
      type: "EXIT" as const,
      sourceWarehouseId: ep001.id,
      status: "COMPLETED" as const,
      executionDate: new Date("2024-01-10"),
      line: { articleId: art003.id, sourceLocationId: locA2B1.id, quantity: 15, unitCost: 12651 },
    },
    {
      reference: "MVT-2024-007",
      type: "TRANSFER" as const,
      sourceWarehouseId: ep001.id,
      destWarehouseId: ep002.id,
      status: "IN_PROGRESS" as const,
      line: { articleId: art001.id, sourceLocationId: locA1B1.id, quantity: 10, unitCost: 25000 },
    },
    {
      reference: "MVT-2024-008",
      type: "ADJUSTMENT" as const,
      destWarehouseId: ep001.id,
      status: "PLANNED" as const,
      reason: "Inventaire annuel — correction écart",
      line: { articleId: art002.id, destLocationId: locA1B2.id, quantity: 5, unitCost: 0 },
    },
  ];

  for (const m of movements) {
    const existing = await prisma.movement.findUnique({ where: { reference: m.reference } });
    if (!existing) {
      const { line, ...mvtData } = m;
      await prisma.movement.create({
        data: {
          ...mvtData,
          userId: admin.id,
          lines: { create: [line] },
        },
      });
    }
  }
  console.log("  ✓ 8 mouvements");

  // ── 9. Commandes ──────────────────────────────────────────────────────────
  const orders = [
    {
      reference: "ORD-2024-001",
      type: "PURCHASE" as const,
      supplierId: acm.id,
      warehouseId: ep001.id,
      status: "CONFIRMED" as const,
      orderDate: new Date("2024-01-10"),
      expectedDate: new Date("2024-01-20"),
      line: { articleId: art001.id, quantity: 1000, unitPrice: 250 },
    },
    {
      reference: "ORD-2024-002",
      type: "SALE" as const,
      client: "Client ABC SARL",
      warehouseId: ep001.id,
      status: "DELIVERED" as const,
      orderDate: new Date("2024-01-12"),
      expectedDate: new Date("2024-01-15"),
      line: { articleId: art002.id, quantity: 10, unitPrice: 18500 },
    },
    {
      reference: "ORD-2024-003",
      type: "PURCHASE" as const,
      supplierId: skf.id,
      warehouseId: ep001.id,
      status: "IN_PROGRESS" as const,
      orderDate: new Date("2024-01-14"),
      expectedDate: new Date("2024-01-28"),
      line: { articleId: art003.id, quantity: 30, unitPrice: 12800 },
    },
    {
      reference: "ORD-2024-004",
      type: "SALE" as const,
      client: "Client XYZ Industries",
      warehouseId: ep001.id,
      status: "DRAFT" as const,
      orderDate: new Date("2024-01-16"),
      expectedDate: new Date("2024-01-22"),
      line: { articleId: art001.id, quantity: 200, unitPrice: 28000 },
    },
  ];

  for (const o of orders) {
    const existing = await prisma.order.findUnique({ where: { reference: o.reference } });
    if (!existing) {
      const { line, ...orderData } = o;
      await prisma.order.create({
        data: {
          ...orderData,
          lines: { create: [line] },
        },
      });
    }
  }
  console.log("  ✓ 4 commandes");

  // ── 10. Réceptions ────────────────────────────────────────────────────────
  const receptions = [
    {
      reference: "REC-2024-001",
      supplierId: acm.id,
      warehouseId: ep001.id,
      status: "RECEIVED" as const,
      expectedDate: new Date("2024-01-15"),
      receivedDate: new Date("2024-01-14"),
      line: { articleId: art001.id, orderedQty: 500, receivedQty: 498, unitPrice: 250 },
    },
    {
      reference: "REC-2024-002",
      supplierId: petroci.id,
      warehouseId: ep001.id,
      status: "PENDING" as const,
      expectedDate: new Date("2024-01-22"),
      line: { articleId: art002.id, orderedQty: 50, receivedQty: 0, unitPrice: 15000 },
    },
    {
      reference: "REC-2024-003",
      supplierId: skf.id,
      warehouseId: ep001.id,
      status: "PARTIAL" as const,
      expectedDate: new Date("2024-01-20"),
      receivedDate: new Date("2024-01-20"),
      line: { articleId: art003.id, orderedQty: 30, receivedQty: 15, unitPrice: 12651 },
    },
  ];

  for (const r of receptions) {
    const existing = await prisma.reception.findUnique({ where: { reference: r.reference } });
    if (!existing) {
      const { line, ...recData } = r;
      await prisma.reception.create({
        data: {
          ...recData,
          lines: { create: [line] },
        },
      });
    }
  }
  console.log("  ✓ 3 réceptions");

  // ── 11. Alertes ───────────────────────────────────────────────────────────
  const alerts = [
    {
      reference: "ALT-001",
      type: "LOW_STOCK" as const,
      level: "CRITICAL" as const,
      articleId: art003.id,
      message: "Stock REF-003 à 5 unités — seuil minimum : 15. Réapprovisionnement urgent.",
      status: "ACTIVE" as const,
    },
    {
      reference: "ALT-002",
      type: "CAPACITY" as const,
      level: "HIGH" as const,
      warehouseId: ep001.id,
      message: "Entrepôt Principal à 75% de sa capacité. Planifier un réaménagement.",
      status: "ACTIVE" as const,
    },
    {
      reference: "ALT-003",
      type: "EXPIRY" as const,
      level: "MEDIUM" as const,
      articleId: art002.id,
      message: "Lot de REF-002 (Huile moteur) expire dans 30 jours. Vérifier la rotation.",
      status: "ACKNOWLEDGED" as const,
    },
    {
      reference: "ALT-004",
      type: "THRESHOLD" as const,
      level: "LOW" as const,
      articleId: art001.id,
      message: "REF-001 : point de réapprovisionnement atteint. Commander 350 unités recommandé.",
      status: "ACTIVE" as const,
    },
    {
      reference: "ALT-005",
      type: "LOW_STOCK" as const,
      level: "HIGH" as const,
      articleId: art003.id,
      message: "Alerte précédente sur REF-003 — résolue après commande SKF.",
      status: "RESOLVED" as const,
      resolvedAt: new Date("2024-01-15"),
    },
  ];

  for (const a of alerts) {
    const existing = await prisma.alert.findUnique({ where: { reference: a.reference } });
    if (!existing) {
      await prisma.alert.create({ data: { ...a, resolvedById: a.status === "RESOLVED" ? admin.id : undefined } });
    }
  }
  console.log("  ✓ 5 alertes");

  console.log("\n✅ Seed terminé avec succès !");
  console.log("   └─ Connexion : williamsk.koffi1@gmail.com / Admin@2025");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
