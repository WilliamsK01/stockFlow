# StockAirys — Système de gestion de stock multi-secteur

Application web de gestion d'inventaire construite avec **Next.js 15**, **React 19** et **TypeScript**. Elle couvre la gestion des articles, catégories, fournisseurs, entrepôts et mouvements de stock, avec un tableau de bord analytique.

---

## Table des matières

1. [Aperçu technique](#aperçu-technique)
2. [Stack technologique](#stack-technologique)
3. [Structure du projet](#structure-du-projet)
4. [État d'avancement](#état-davancement)
5. [Ce qui manque](#ce-qui-manque)
6. [Améliorations prioritaires](#améliorations-prioritaires)
7. [Installation et démarrage](#installation-et-démarrage)
8. [Modèle de base de données](#modèle-de-base-de-données)
9. [Feuille de route recommandée](#feuille-de-route-recommandée)

---

## Aperçu technique

| Critère | État |
|---|---|
| Interface utilisateur | 100 % complète (12/12 modules) |
| Backend / API | Non implémenté |
| Base de données | Non connectée |
| Authentification | Non implémentée |
| Données persistantes | Non — tout est en mock statique |
| Prêt pour la production | Non (frontend complet, backend à faire) |

---

## Stack technologique

| Catégorie | Outil |
|---|---|
| Framework | Next.js 15.4 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, ShadcnUI, Radix UI |
| Animations | Framer Motion 12 |
| Formulaires | React Hook Form 7 + Zod 4 |
| Icônes | Lucide React, Iconsax |
| Date | date-fns, react-datepicker, react-day-picker |
| Téléphone | react-phone-number-input |
| Notifications | Sonner (toasts) |
| Thème | next-themes (dark/light) |
| Typage | TypeScript 5 |
| Linting | ESLint + Prettier |

---

## Structure du projet

```text
stockflow/
├── app/                        # Pages Next.js (App Router)
│   ├── page.tsx                # Redirige vers /dashboard
│   ├── layout.tsx              # Layout racine
│   ├── globals.css
│   ├── dashboard/page.tsx      # Tableau de bord principal
│   ├── articles/page.tsx       # Gestion des articles
│   ├── categories/page.tsx     # Gestion des catégories
│   ├── suppliers/page.tsx      # Gestion des fournisseurs
│   ├── movements/page.tsx      # Journal des mouvements
│   └── warehouses/page.tsx     # Gestion des entrepôts (INCOMPLET)
│
├── components/
│   ├── layout/
│   │   ├── main-layout.tsx     # Wrapper principal (sidebar + header)
│   │   ├── sidebar.tsx         # Navigation (12 entrées, 6 actives)
│   │   └── header.tsx          # Barre supérieure (recherche, notifs, thème)
│   ├── articles/
│   │   └── article-dialog.tsx  # Formulaire création/édition article
│   ├── categories/
│   │   └── category-dialog.tsx # Formulaire catégorie + color picker
│   ├── suppliers/
│   │   ├── supplier-dialog.tsx # Formulaire fournisseur
│   │   └── country-selector.tsx
│   ├── movements/
│   │   ├── movement-dialog.tsx # Formulaire mouvement de stock
│   │   └── date-picker-input.tsx
│   ├── warehouses/
│   │   └── warehouse-dialog.tsx # Formulaire entrepôt
│   ├── utils/                  # Composants utilitaires réutilisables
│   └── ui/                     # 19 composants ShadcnUI
│
├── lib/
│   ├── utils.ts                # Utilitaire cn()
│   ├── allCountries.ts         # Liste complète des pays
│   ├── currencySymbols.ts      # Symboles monétaires
│   └── getFlagEmoji.ts         # Génération d'emojis de drapeaux
│
├── types/
│   ├── type.tsx                # Interfaces TypeScript principales
│   └── countries.json          # Données de référence pays
│
└── public/                     # Assets statiques
```

---

## État d'avancement

### Vue d'ensemble des modules

| Module | Route | UI | CRUD | Données réelles |
|---|---|---|---|---|
| Tableau de bord | `/dashboard` | Complet | — | Non (mock) |
| Articles | `/articles` | Complet | Complet | Non (mock) |
| Catégories | `/categories` | Complet | Complet | Non (mock) |
| Fournisseurs | `/suppliers` | Complet | Complet | Non (mock) |
| Mouvements | `/movements` | Complet | Complet | Non (mock) |
| Entrepôts | `/warehouses` | Complet | Complet | Non (mock) |
| Réceptions | `/receptions` | Complet | Complet | Non (mock) |
| Commandes | `/orders` | Complet | Complet | Non (mock) |
| Prévisions | `/forecasting` | Complet | — (lecture seule) | Non (mock) |
| Rapports | `/reports` | Complet | — (lecture seule) | Non (mock) |
| Alertes | `/alerts` | Complet | Partiel (acknowledge/resolve/delete) | Non (mock) |
| Paramètres | `/settings` | Complet | Local (toast) | Non |

---

### Détail par module implémenté

#### Tableau de bord (`/dashboard`)
- KPI cards : articles en stock, valeur totale, taux de rotation, alertes actives
- Section alertes critiques (articles sous seuil minimum)
- Journal des mouvements récents
- Statistiques secondaires : fournisseurs, entrepôts, commandes en cours
- Données entièrement statiques (hardcodées)

#### Articles (`/articles`)
- Tableau avec colonnes : référence, désignation, catégorie, classification ABC, stock, unité, prix, statut
- Dialog de création/édition avec 50+ champs (infos générales, stock, prix, localisation, codes-barres)
- Recherche par référence ou désignation
- Filtres : catégorie, classification (A, B, C)
- Actions : Voir, Modifier, Supprimer
- KPI cards en en-tête

#### Catégories (`/categories`)
- Arborescence parent/enfant
- Color picker intégré
- Configuration de la rotation et de la classification ABC automatique
- Filtre par statut actif/inactif

#### Fournisseurs (`/suppliers`)
- Informations complètes : contact, adresse, pays, délai livraison, conditions de paiement, remise
- Sélecteur de pays avec drapeau emoji
- Champ téléphone international (react-phone-number-input)
- Gestion des certifications (tableau dynamique)
- Note (étoiles) de qualité fournisseur
- Filtres : pays, statut (Actif, Inactif, Suspendu)

#### Mouvements (`/movements`)
- Types : Entrée, Sortie, Transfert, Ajustement
- Statuts : Terminé, En cours, Planifié, Annulé
- Champs : référence, article, lot, entrepôt source/destination, emplacement, coût unitaire, dates
- Filtres : type, statut, période
- Icônes et badges couleur par type

#### Entrepôts (`/warehouses`)

- KPI : total, actifs, capacité totale, taux d'occupation moyen
- Onglets : Warehouses (table) et Locations (emplacements)
- Table : nom/code, manager, type (badge), capacité, occupation %, température, statut, actions
- Dialog CRUD complet avec sélecteur de pays et gestion des caractéristiques physiques

---

### Composants transversaux

| Composant | État |
|---|---|
| Sidebar navigation | Complet (12 entrées dont 6 sans route active) |
| Header (recherche, notifs, thème, profil) | Complet visuellement — recherche non fonctionnelle |
| Theme dark/light | Fonctionnel |
| Toast notifications (Sonner) | Fonctionnel |
| CountrySelector (drapeau + nom) | Fonctionnel |
| PhoneInputComponent | Fonctionnel |
| DatePickerInput | Fonctionnel |
| 19 composants ShadcnUI | Prêts à l'emploi |

---

## Ce qui manque

### Bloquant pour la production

1. **Backend et API** — Aucune route `/api/` n'existe. Toutes les données sont des constantes JavaScript en mémoire, perdues à chaque rechargement de page.

2. **Base de données** — Aucun schéma ni ORM configuré (Prisma, Drizzle, ou autre). Aucune table de persistance.

3. **Authentification** — Aucun système de connexion, de session ou de protection de route (NextAuth.js, Clerk, ou équivalent).

4. **Page Entrepôts** — Le tableau d'affichage des entrepôts et des emplacements n'est pas implémenté, malgré le dialog fonctionnel et les données mock présentes.

5. **Variables d'environnement** — Aucun fichier `.env.local` ou `.env.example` n'est configuré.

### Modules absents

6. **Réceptions** — Enregistrement des entrées de marchandises liées aux commandes fournisseurs.
7. **Commandes** — Gestion des bons de commande (achats et ventes).
8. **Prévisions** — Module d'analyse et de prévision de la demande.
9. **Rapports** — Exports, graphiques avancés, rapports périodiques.
10. **Alertes** — Page dédiée à la gestion des règles d'alerte (seuils min/max, péremption).
11. **Paramètres** — Configuration de l'application (devise, unités, entreprise, utilisateurs).

### Problèmes de qualité du code

12. Types `any` utilisés dans plusieurs composants dialogs et pages au lieu de types stricts.
13. La suppression d'articles/catégories/fournisseurs/mouvements ne fait qu'une mise à jour d'état local sans confirmation visuelle ni appel API.
14. La recherche dans le header est un champ visuel non câblé à aucune logique.
15. Certaines options dans les `<Select>` sont des valeurs hardcodées qui devraient être dynamiques (catégories, fournisseurs dans les formulaires).

---

## Améliorations prioritaires

### Qualité du code

- [ ] Remplacer les types `any` par des types stricts (notamment dans les dialogs)
- [ ] Extraire les données mock dans des fichiers dédiés (`/lib/mock/`)
- [ ] Ajouter la gestion des erreurs sur les actions CRUD (try/catch, états d'erreur)
- [ ] Ajouter des états de chargement (`loading`) pour les futurs appels API
- [ ] Mettre en place la pagination sur tous les tableaux
- [ ] Ajouter une boîte de confirmation avant chaque suppression

### Fonctionnalités manquantes à fort impact

- [ ] **Export CSV/Excel** pour articles, mouvements, fournisseurs
- [ ] **Import en masse** (CSV upload pour alimenter le stock initial)
- [ ] **Recherche globale** fonctionnelle dans le header
- [ ] **Impression / PDF** des bons de mouvement et fiches articles
- [ ] **Gestion des images** pour les articles (upload)
- [ ] **Notifications en temps réel** (stock sous seuil, alertes)
- [ ] **Rôles et permissions** (admin, gestionnaire, opérateur, lecture seule)
- [ ] **Journal d'audit** persistant (qui a fait quoi et quand)

### UX / Design

- [ ] Graphiques sur le dashboard (courbes de mouvements, camembert par catégorie)
- [ ] Vue carte ou plan pour les entrepôts et emplacements
- [ ] Mode mobile optimisé (sidebar en drawer sur petit écran)
- [ ] Internationalisation (i18n) — l'interface est en français mais sans système i18n formel
- [ ] Accessibilité complète (aria-labels, navigation clavier)
- [ ] Squelettes de chargement (`skeleton`) sur les tableaux

### Infrastructure

- [ ] Configurer une base de données (recommandé : PostgreSQL + Prisma)
- [ ] Créer les routes API Next.js (`app/api/...`)
- [ ] Ajouter NextAuth.js ou Clerk pour l'authentification
- [ ] Configurer les variables d'environnement (`.env.example`)
- [ ] Mettre en place les tests (Jest + React Testing Library)
- [ ] CI/CD (GitHub Actions ou similaire)

---

## Installation et démarrage

### Prérequis

- Node.js >= 18
- npm >= 9

### Démarrage en développement

```bash
# Cloner le projet
git clone <url-du-repo>
cd stockflow

# Installer les dépendances
npm install

# Lancer le serveur de développement (Turbopack)
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000) et redirigera automatiquement vers `/dashboard`.

### Scripts disponibles

```bash
npm run dev      # Serveur de développement avec Turbopack
npm run build    # Build de production
npm start        # Démarrer le serveur de production
npm run lint     # Vérification ESLint
```

---

## Modèles de données définis

Les interfaces TypeScript suivantes sont définies dans `types/type.tsx` et servent de contrat pour l'ensemble de l'application :

| Entité | Champs principaux |
|---|---|
| `Article` | id, référence, désignation, catégorie, classification ABC, unité, seuils min/max, prix, stock, fournisseur, emplacement, codes-barres |
| `Category` | id, nom, description, parent, rotation, classification auto, actif |
| `Supplier` | id, nom, contact, email, téléphone, adresse, pays, délai livraison, conditions paiement, remise, certifications |
| `Movement` | id, référence, type, article, quantité, entrepôt source/destination, emplacement, utilisateur, dates, statut, lot, coût |
| `Warehouse` | id, nom, code, adresse, pays, responsable, superficie, capacité max, occupation, type, température |

---

## Modèle de base de données

### Technologie recommandée

| Couche | Outil | Raison |
|---|---|---|
| Base de données | **PostgreSQL** | Robustesse, types avancés (jsonb, enum natif), support Prisma excellent |
| ORM | **Prisma** | Typage TypeScript auto-généré, migrations versionnées, client fluent |
| Auth | **NextAuth.js v5** | Intégration Next.js native, sessions JWT, providers OAuth |
| Cache | **Redis** (optionnel) | Cache des KPI dashboard, sessions, alertes temps réel |

### Architecture des relations

```text
User ──────────────────────────────────────────────────┐
│ (effectue)                                            │ (crée)
▼                                                       ▼
Movement ──── MovementLine ──── Article ────── Alert
                    │               │
                    │           ┌───┴─────────────────┐
                    │           │                     │
               Location      Category            Supplier
                    │        (arbre)          ┌──────┴──────┐
                    │                         │             │
               Warehouse                 Reception      Order
                                              │             │
                                        ReceptionLine  OrderLine
```

### Schéma Prisma complet

```prisma
// ─────────────────────────────────────────────────────────────
// prisma/schema.prisma
// ─────────────────────────────────────────────────────────────

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ── Utilisateurs & Auth ───────────────────────────────────────

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  role      Role     @default(OPERATOR)
  password  String
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  movements     Movement[]
  resolvedAlerts Alert[]   @relation("ResolvedBy")

  @@map("users")
}

enum Role {
  ADMIN
  MANAGER
  OPERATOR
  VIEWER
}

// ── Catégories (arbre parent/enfant) ─────────────────────────

model Category {
  id                 Int        @id @default(autoincrement())
  name               String     @unique
  description        String?
  color              String     @default("#6366f1")
  parentId           Int?
  parent             Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children           Category[] @relation("CategoryTree")
  seuilRotation      Float      @default(0)
  autoClassification Boolean    @default(false)
  active             Boolean    @default(true)
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt

  articles Article[]

  @@map("categories")
}

// ── Fournisseurs ──────────────────────────────────────────────

model Supplier {
  id             Int              @id @default(autoincrement())
  name           String
  contact        String?
  email          String?          @unique
  phone          String?
  address        String?
  city           String?
  postalCode     String?
  country        String           @default("CI")
  deliveryTime   Int?
  paymentTerms   String?
  discount       Float            @default(0)
  rating         Float            @default(0)
  notes          String?
  status         SupplierStatus   @default(ACTIVE)
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  certifications SupplierCertification[]
  articles       Article[]
  receptions     Reception[]
  orders         Order[]

  @@map("suppliers")
}

enum SupplierStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

model SupplierCertification {
  id         Int      @id @default(autoincrement())
  supplierId Int
  supplier   Supplier @relation(fields: [supplierId], references: [id], onDelete: Cascade)
  name       String

  @@map("supplier_certifications")
}

// ── Entrepôts & Emplacements ──────────────────────────────────

model Warehouse {
  id          Int             @id @default(autoincrement())
  name        String
  code        String          @unique
  address     String?
  city        String?
  postalCode  String?
  country     String          @default("CI")
  manager     String?
  phone       String?
  email       String?
  area        Float?
  maxCapacity Int             @default(0)
  type        WarehouseType   @default(MAIN)
  temperature TemperatureType @default(AMBIENT)
  notes       String?
  status      WarehouseStatus @default(ACTIVE)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  locations       Location[]
  sourceMovements Movement[]  @relation("SourceWarehouse")
  destMovements   Movement[]  @relation("DestWarehouse")
  receptions      Reception[]
  orders          Order[]

  @@map("warehouses")
}

enum WarehouseType   { MAIN REGIONAL SPECIALIZED TRANSIT }
enum TemperatureType { AMBIENT REFRIGERATED FROZEN CONTROLLED }
enum WarehouseStatus { ACTIVE INACTIVE MAINTENANCE }

model Location {
  id          Int       @id @default(autoincrement())
  code        String    @unique
  warehouseId Int
  warehouse   Warehouse @relation(fields: [warehouseId], references: [id])
  zone        String?
  aisle       String?
  span        String?
  level       String?
  maxCapacity Int       @default(1)
  createdAt   DateTime  @default(now())

  stocks          Stock[]
  sourceLines     MovementLine[] @relation("SourceLocation")
  destLines       MovementLine[] @relation("DestLocation")

  @@map("locations")
}

// ── Articles & Codes-barres ───────────────────────────────────

model Article {
  id             Int              @id @default(autoincrement())
  reference      String           @unique
  designation    String
  description    String?
  categoryId     Int?
  category       Category?        @relation(fields: [categoryId], references: [id])
  classification Classification   @default(C)
  uniteMesure    String
  weight         Float?
  volume         Float?
  seuilMin       Int              @default(0)
  seuilMax       Int              @default(0)
  unitPrice      Float            @default(0)
  supplierId     Int?
  supplier       Supplier?        @relation(fields: [supplierId], references: [id])
  status         ArticleStatus    @default(ACTIVE)
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  barcodes       ArticleBarcode[]
  stocks         Stock[]
  movementLines  MovementLine[]
  receptionLines ReceptionLine[]
  orderLines     OrderLine[]
  alerts         Alert[]

  @@map("articles")
}

enum Classification { A B C }
enum ArticleStatus  { ACTIVE INACTIVE DISCONTINUED }

model ArticleBarcode {
  id        Int     @id @default(autoincrement())
  articleId Int
  article   Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  code      String  @unique

  @@map("article_barcodes")
}

// ── Stock (quantité par article × emplacement × lot) ─────────

model Stock {
  id         Int       @id @default(autoincrement())
  articleId  Int
  article    Article   @relation(fields: [articleId], references: [id])
  locationId Int
  location   Location  @relation(fields: [locationId], references: [id])
  quantity   Int       @default(0)
  lotNumber  String?
  expiryDate DateTime?
  updatedAt  DateTime  @updatedAt

  @@unique([articleId, locationId, lotNumber])
  @@map("stocks")
}

// ── Mouvements de stock ───────────────────────────────────────

model Movement {
  id                Int            @id @default(autoincrement())
  reference         String         @unique
  type              MovementType
  sourceWarehouseId Int?
  sourceWarehouse   Warehouse?     @relation("SourceWarehouse", fields: [sourceWarehouseId], references: [id])
  destWarehouseId   Int?
  destWarehouse     Warehouse?     @relation("DestWarehouse", fields: [destWarehouseId], references: [id])
  userId            Int?
  user              User?          @relation(fields: [userId], references: [id])
  status            MovementStatus @default(PLANNED)
  reason            String?
  notes             String?
  executionDate     DateTime?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  lines MovementLine[]

  @@map("movements")
}

enum MovementType   { ENTRY EXIT TRANSFER ADJUSTMENT }
enum MovementStatus { PLANNED IN_PROGRESS COMPLETED CANCELLED }

model MovementLine {
  id               Int       @id @default(autoincrement())
  movementId       Int
  movement         Movement  @relation(fields: [movementId], references: [id], onDelete: Cascade)
  articleId        Int
  article          Article   @relation(fields: [articleId], references: [id])
  sourceLocationId Int?
  sourceLocation   Location? @relation("SourceLocation", fields: [sourceLocationId], references: [id])
  destLocationId   Int?
  destLocation     Location? @relation("DestLocation", fields: [destLocationId], references: [id])
  quantity         Int
  unitCost         Float     @default(0)
  lotNumber        String?

  @@map("movement_lines")
}

// ── Réceptions ────────────────────────────────────────────────

model Reception {
  id           Int             @id @default(autoincrement())
  reference    String          @unique
  supplierId   Int
  supplier     Supplier        @relation(fields: [supplierId], references: [id])
  warehouseId  Int
  warehouse    Warehouse       @relation(fields: [warehouseId], references: [id])
  orderId      Int?            @unique
  order        Order?          @relation(fields: [orderId], references: [id])
  status       ReceptionStatus @default(PENDING)
  expectedDate DateTime
  receivedDate DateTime?
  notes        String?
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt

  lines ReceptionLine[]

  @@map("receptions")
}

enum ReceptionStatus { PENDING RECEIVED PARTIAL CANCELLED }

model ReceptionLine {
  id          Int       @id @default(autoincrement())
  receptionId Int
  reception   Reception @relation(fields: [receptionId], references: [id], onDelete: Cascade)
  articleId   Int
  article     Article   @relation(fields: [articleId], references: [id])
  orderedQty  Int
  receivedQty Int       @default(0)
  unitPrice   Float

  @@map("reception_lines")
}

// ── Commandes ─────────────────────────────────────────────────

model Order {
  id           Int         @id @default(autoincrement())
  reference    String      @unique
  type         OrderType
  supplierId   Int?
  supplier     Supplier?   @relation(fields: [supplierId], references: [id])
  client       String?
  warehouseId  Int?
  warehouse    Warehouse?  @relation(fields: [warehouseId], references: [id])
  status       OrderStatus @default(DRAFT)
  orderDate    DateTime    @default(now())
  expectedDate DateTime?
  notes        String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  lines     OrderLine[]
  reception Reception?

  @@map("orders")
}

enum OrderType   { PURCHASE SALE }
enum OrderStatus { DRAFT CONFIRMED IN_PROGRESS DELIVERED CANCELLED }

model OrderLine {
  id        Int     @id @default(autoincrement())
  orderId   Int
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  articleId Int
  article   Article @relation(fields: [articleId], references: [id])
  quantity  Int
  unitPrice Float

  @@map("order_lines")
}

// ── Alertes ───────────────────────────────────────────────────

model Alert {
  id          Int         @id @default(autoincrement())
  reference   String      @unique
  type        AlertType
  level       AlertLevel
  articleId   Int?
  article     Article?    @relation(fields: [articleId], references: [id])
  warehouseId Int?
  message     String
  status      AlertStatus @default(ACTIVE)
  createdAt   DateTime    @default(now())
  resolvedAt  DateTime?
  resolvedById Int?
  resolvedBy  User?       @relation("ResolvedBy", fields: [resolvedById], references: [id])

  @@map("alerts")
}

enum AlertType   { LOW_STOCK EXPIRY CAPACITY THRESHOLD }
enum AlertLevel  { CRITICAL HIGH MEDIUM LOW }
enum AlertStatus { ACTIVE ACKNOWLEDGED RESOLVED }
```

### Correspondance types TypeScript → tables SQL

| Interface TS (`types/type.tsx`) | Table Prisma | Notes |
| --- | --- | --- |
| `Article` | `articles` | `bareCodes` → table `article_barcodes` |
| `Category` | `categories` | `parent: string` → `parentId: Int` (FK auto-référentielle) |
| `Supplier` | `suppliers` + `supplier_certifications` | `certifications: string[]` → table dédiée |
| `Warehouse` | `warehouses` | `currentOccupation` → calculé depuis `stocks` |
| `Movement` | `movements` + `movement_lines` | Champ `article` unique → lignes multiples |
| `Reception` | `receptions` + `reception_lines` | Idem |
| `Order` | `orders` + `order_lines` | `supplier: string` → `supplierId: Int` (FK) |
| `Alert` | `alerts` | `warehouse?: string` → `warehouseId?: Int` (FK) |
| — | `users` | À créer (non encore dans les types TS) |
| — | `locations` | À créer (non encore dans les types TS) |
| — | `stocks` | À créer — table pivot article × emplacement × lot |

### Mise en place rapide (Prisma)

```bash
# 1. Installer Prisma
npm install prisma @prisma/client
npx prisma init

# 2. Configurer .env
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/stockairys"' >> .env

# 3. Coller le schéma ci-dessus dans prisma/schema.prisma, puis :
npx prisma migrate dev --name init

# 4. Générer le client TypeScript
npx prisma generate

# 5. (Optionnel) Ouvrir Prisma Studio pour explorer les données
npx prisma studio
```

### Champs calculés à ne pas stocker en base

Ces valeurs doivent être **calculées à la requête** (via Prisma aggregations ou SQL) plutôt que stockées :

| Champ UI | Calcul |
|---|---|
| `currentOccupation` (Warehouse) | `SUM(stocks.quantity)` filtré par warehouseId |
| `occupiedLocations` (Warehouse) | `COUNT(locations WHERE stocks.quantity > 0)` |
| `nbArticles` (Category) | `COUNT(articles WHERE categoryId = ?)` |
| `stockValue` (Category) | `SUM(articles.unitPrice × stocks.quantity)` |
| `totalAmount` (Order) | `SUM(order_lines.quantity × order_lines.unitPrice)` |
| `totalValue` (Reception) | `SUM(reception_lines.receivedQty × reception_lines.unitPrice)` |
| `nbOrder` / `totalAmount` (Supplier) | Aggrégats sur la table `orders` |

---

## Feuille de route recommandée

### Phase 1 — Stabilisation (priorité haute)
1. Compléter la page Entrepôts (tableau, KPI, liste des emplacements)
2. Connecter une base de données (PostgreSQL + Prisma)
3. Créer les routes API CRUD pour chaque entité
4. Ajouter l'authentification (NextAuth.js)
5. Configurer les variables d'environnement

### Phase 2 — Modules manquants
6. Module Réceptions
7. Module Commandes
8. Page Paramètres
9. Page Alertes

### Phase 3 — Valeur ajoutée
10. Export CSV/PDF
11. Graphiques dashboard (Recharts ou Chart.js)
12. Prévisions de stock
13. Rapports périodiques
14. Rôles et permissions

### Phase 4 — Production
15. Tests unitaires et d'intégration
16. CI/CD
17. Monitoring et logs
18. Documentation API
