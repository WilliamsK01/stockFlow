# StockAirys — Système de gestion de stock multi-secteur

Application web de gestion d'inventaire construite avec **Next.js 16**, **React 19** et **TypeScript**. Déployée sur **Vercel**, connectée à **Supabase (PostgreSQL)**, authentifiée avec **NextAuth.js v5**.

🌐 **Production** : [https://stockflow-airys.vercel.app](https://stockflow-airys.vercel.app)

---

## Table des matières

1. [État du projet](#état-du-projet)
2. [Stack technologique](#stack-technologique)
3. [Architecture](#architecture)
4. [Modules et pages](#modules-et-pages)
5. [API REST](#api-rest)
6. [Base de données](#base-de-données)
7. [Authentification](#authentification)
8. [Sécurité](#sécurité)
9. [Installation et démarrage](#installation-et-démarrage)
10. [Déploiement Vercel](#déploiement-vercel)
11. [Améliorations futures](#améliorations-futures)

---

## État du projet

| Critère | État |
|---|---|
| Interface utilisateur | 100 % — 12 modules, 14 pages |
| Backend / API REST | 100 % — 19 routes, 10 entités |
| Base de données | Connectée — Supabase PostgreSQL |
| Authentification | Fonctionnelle — NextAuth.js v5 + JWT |
| Sécurité base de données | RLS activé sur 19 tables |
| Déploiement | En production sur Vercel |
| Données mock | Remplacées par API réelle |

---

## Stack technologique

### Frontend

| Catégorie | Outil |
| --- | --- |
| Framework | Next.js 16.2 (App Router) |
| UI | React 19, Tailwind CSS 4, ShadcnUI, Radix UI |
| Animations | Framer Motion 12 |
| Formulaires | React Hook Form 7 + Zod 4 |
| Icônes | Lucide React, Iconsax |
| Dates | date-fns, react-datepicker |
| Notifications | Sonner (toasts) |
| Thème | next-themes (dark/light) |

### Backend

| Catégorie | Outil |
| --- | --- |
| ORM | Prisma 5.22 |
| Base de données | PostgreSQL via Supabase |
| Authentification | NextAuth.js v5 (beta) + bcryptjs |
| Sessions | JWT (stateless) |
| Adapter auth | @auth/prisma-adapter |
| Typage | TypeScript 5 |

### Infrastructure

| Catégorie | Outil |
| --- | --- |
| Hébergement | Vercel (déploiement automatique) |
| Base de données cloud | Supabase (session pooler, port 5432) |
| CI/CD | GitHub → Vercel (push → redéploiement) |

---

## Architecture

```text
stockflow/
├── app/                          # Pages Next.js (App Router)
│   ├── login/page.tsx            # Page de connexion
│   ├── dashboard/page.tsx        # Tableau de bord
│   ├── articles/page.tsx         # Articles
│   ├── categories/page.tsx       # Catégories
│   ├── suppliers/page.tsx        # Fournisseurs
│   ├── movements/page.tsx        # Mouvements de stock
│   ├── warehouses/page.tsx       # Entrepôts
│   ├── receptions/page.tsx       # Réceptions
│   ├── orders/page.tsx           # Commandes
│   ├── alerts/page.tsx           # Alertes
│   ├── forecasting/page.tsx      # Prévisions
│   ├── reports/page.tsx          # Rapports
│   ├── settings/page.tsx         # Paramètres
│   └── api/                      # Routes API REST
│       ├── auth/[...nextauth]/   # Handlers NextAuth
│       ├── articles/             # CRUD articles
│       ├── categories/           # CRUD catégories
│       ├── suppliers/            # CRUD fournisseurs
│       ├── warehouses/           # CRUD entrepôts
│       ├── movements/            # CRUD mouvements
│       ├── receptions/           # CRUD réceptions
│       ├── orders/               # CRUD commandes
│       ├── alerts/               # CRUD alertes
│       ├── users/                # Liste utilisateurs
│       └── dashboard/            # Agrégats dashboard
│
├── components/
│   ├── layout/
│   │   ├── main-layout.tsx       # Wrapper (sidebar + header + footer)
│   │   ├── sidebar.tsx           # Navigation rétractable avec footer utilisateur
│   │   ├── header.tsx            # Barre supérieure
│   │   └── footer.tsx            # Pied de page (horloge, statut système)
│   ├── articles/article-dialog.tsx
│   ├── categories/category-dialog.tsx
│   ├── suppliers/supplier-dialog.tsx
│   ├── movements/movement-dialog.tsx
│   ├── warehouses/warehouse-dialog.tsx
│   ├── receptions/reception-dialog.tsx
│   ├── orders/order-dialog.tsx
│   └── ui/                       # 20+ composants ShadcnUI
│
├── lib/
│   ├── prisma.ts                 # Client Prisma singleton (datasourceUrl explicite)
│   └── utils.ts                  # Utilitaires
│
├── prisma/
│   ├── schema.prisma             # Schéma complet (15 modèles, 12 enums)
│   ├── seed.ts                   # Données initiales
│   └── rls.sql                   # Script RLS pour Supabase
│
├── auth.ts                       # Config NextAuth complète (Node.js uniquement)
├── auth.config.ts                # Config NextAuth Edge-compatible (middleware)
└── middleware.ts                 # Protection des routes (JWT check)
```

---

## Modules et pages

### Navigation (sidebar rétractable)

La sidebar dispose d'un **bouton toggle** pour se réduire (icônes seules) ou s'agrandir (icônes + labels), avec une animation fluide. Elle comprend un **footer utilisateur** (avatar, nom, rôle, déconnexion au hover).

| Module | Route | Fonctionnalité |
|---|---|---|
| Tableau de bord | `/dashboard` | KPI, alertes critiques, mouvements récents |
| Articles | `/articles` | CRUD complet, classification ABC, seuils |
| Catégories | `/categories` | Arborescence parent/enfant, color picker |
| Fournisseurs | `/suppliers` | CRUD, sélecteur pays, téléphone international |
| Mouvements | `/movements` | Entrées/Sorties/Transferts/Ajustements |
| Entrepôts | `/warehouses` | Onglets Warehouses + Locations |
| Réceptions | `/receptions` | Lignes dynamiques, calcul totalValue |
| Commandes | `/orders` | Achats/Ventes, lignes dynamiques, total |
| Alertes | `/alerts` | Acknowledge / Resolve / Delete par action |
| Prévisions | `/forecasting` | Jours restants colorés, plan réapprovisionnement |
| Rapports | `/reports` | 4 onglets : Stock, Mouvements, Fournisseurs, Entrepôts |
| Paramètres | `/settings` | 4 onglets : Entreprise, Préférences, Notifications, Utilisateurs |
| Connexion | `/login` | Email + mot de passe, feedback d'erreur |

### Layout global

- **Header** : barre de recherche, notifications, toggle thème dark/light, menu utilisateur
- **Footer** : nom de l'app, version, statut système (indicateur animé), horloge en temps réel
- **Sidebar** : toggle collapse/expand, badge actif sur la route courante, logout discret au hover

---

## API REST

Toutes les routes sont **protégées par session JWT** via `auth()` de NextAuth. Chaque entité expose les méthodes standard :

| Endpoint | GET | POST | GET/:id | PUT/:id | DELETE/:id |
| --- | --- | --- | --- | --- | --- |
| `/api/articles` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/api/categories` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/api/suppliers` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/api/warehouses` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/api/movements` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/api/receptions` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/api/orders` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/api/alerts` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/api/users` | ✓ | — | — | — | — |
| `/api/dashboard` | ✓ | — | — | — | — |

**Réponses** : JSON, codes HTTP standard (200, 201, 204, 401, 404, 500).

---

## Base de données

### Technologie

- **PostgreSQL** hébergé sur **Supabase** (région EU West — eu-west-1)
- **Prisma 5** comme ORM (migrations, typage auto-généré, relations)
- Connexion via **session pooler** (port 5432, compatible IPv4)

### Modèles (15 tables)

| Modèle | Table | Description |
|---|---|---|
| `User` | `users` | Utilisateurs et rôles |
| `Account` | `accounts` | OAuth accounts (NextAuth) |
| `Session` | `sessions` | Sessions JWT (NextAuth) |
| `VerificationToken` | `verification_tokens` | Tokens de vérification |
| `Category` | `categories` | Catégories (arbre parent/enfant) |
| `Supplier` | `suppliers` | Fournisseurs |
| `SupplierCertification` | `supplier_certifications` | Certifications fournisseurs |
| `Warehouse` | `warehouses` | Entrepôts |
| `Location` | `locations` | Emplacements dans les entrepôts |
| `Article` | `articles` | Articles du catalogue |
| `ArticleBarcode` | `article_barcodes` | Codes-barres |
| `Stock` | `stocks` | Quantité par article × emplacement × lot |
| `Movement` + `MovementLine` | `movements` + `movement_lines` | Mouvements de stock |
| `Reception` + `ReceptionLine` | `receptions` + `reception_lines` | Réceptions fournisseurs |
| `Order` + `OrderLine` | `orders` + `order_lines` | Commandes achat/vente |
| `Alert` | `alerts` | Alertes système |

### Enums (12)

`Role`, `SupplierStatus`, `WarehouseType`, `TemperatureType`, `WarehouseStatus`, `Classification`, `ArticleStatus`, `MovementType`, `MovementStatus`, `ReceptionStatus`, `OrderType`, `OrderStatus`, `AlertType`, `AlertLevel`, `AlertStatus`

### Champs calculés (non stockés)

Ces valeurs sont calculées à la requête via Prisma aggregations :

| Champ UI | Calcul SQL |
|---|---|
| Occupation entrepôt | `SUM(stocks.quantity)` par warehouseId |
| Valeur stock catégorie | `SUM(unitPrice × quantity)` |
| Total commande | `SUM(orderLines.quantity × unitPrice)` |
| Valeur réception | `SUM(receivedQty × unitPrice)` |

---

## Authentification

- **Provider** : `CredentialsProvider` (email + mot de passe)
- **Hash** : bcryptjs (côté Node.js uniquement, pas dans l'Edge Runtime)
- **Sessions** : JWT stateless (stratégie `jwt`)
- **Middleware** : protège toutes les routes sauf `/login`, `/api/auth/*` et les assets statiques
- **Architecture Edge-safe** : `auth.config.ts` (sans Prisma ni bcryptjs) utilisé par le middleware, `auth.ts` (complet) utilisé par les API routes

### Rôles disponibles

| Rôle | Description |
|---|---|
| `ADMIN` | Accès complet |
| `MANAGER` | Gestion opérationnelle |
| `OPERATOR` | Saisie et consultation |
| `VIEWER` | Lecture seule |

---

## Sécurité

### Row Level Security (RLS)

Le RLS est activé sur les **19 tables publiques** via le script `prisma/rls.sql`. Cela bloque tout accès direct via l'API PostgREST/anon key de Supabase. Notre app n'est pas affectée (Prisma se connecte avec le rôle `postgres` qui bypass le RLS par conception PostgreSQL).

Tables protégées : `users`, `accounts`, `sessions`, `verification_tokens`, `categories`, `suppliers`, `supplier_certifications`, `warehouses`, `locations`, `articles`, `article_barcodes`, `stocks`, `movements`, `movement_lines`, `receptions`, `reception_lines`, `orders`, `order_lines`, `alerts`.

### Middleware de protection

Toutes les routes (sauf `/login` et `/api/auth/*`) sont protégées par le middleware NextAuth. Un utilisateur non authentifié est automatiquement redirigé vers `/login`.

### Dépendances

CVEs Next.js corrigées — version 16.2.6+ utilisée en production.

---

## Installation et démarrage

### Prérequis

- Node.js >= 18
- npm >= 9
- Compte Supabase (gratuit)

### 1. Cloner et installer

```bash
git clone https://github.com/WilliamsK01/stockFlow.git
cd stockflow
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Remplissez `.env.local` :

```env
# Supabase — Session pooler (port 5432)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?sslmode=require&connection_limit=5&pool_timeout=20"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?sslmode=require"

# NextAuth.js
AUTH_SECRET="<générer avec: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_NAME="StockAirys"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### 3. Initialiser la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer toutes les tables dans Supabase
npm run db:push

# Insérer les données initiales (admin + catégories + fournisseurs + entrepôts + articles)
npm run db:seed
```

### 4. Lancer en développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) — vous serez redirigé vers `/login`.

**Compte admin par défaut :**

- Email : `williamsk.koffi1@gmail.com`
- Mot de passe : `Admin@2025`

### Scripts disponibles

```bash
npm run dev          # Serveur dev (Turbopack)
npm run build        # Build production (prisma generate + next build)
npm start            # Serveur production
npm run lint         # ESLint
npm run db:generate  # Générer le client Prisma
npm run db:push      # Synchroniser le schéma avec Supabase
npm run db:seed      # Insérer les données initiales
npm run db:migrate   # Créer une migration versionnée
npm run db:studio    # Ouvrir Prisma Studio (GUI base de données)
```

---

## Déploiement Vercel

### Variables d'environnement requises

Dans **Vercel Dashboard → Settings → Environment Variables**, ajoutez :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | URL session pooler Supabase (port 5432) |
| `DIRECT_URL` | Même URL (ou direct connection) |
| `AUTH_SECRET` | Secret aléatoire 32 bytes |
| `NEXTAUTH_URL` | `https://votre-domaine.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `StockAirys` |
| `NEXT_PUBLIC_APP_VERSION` | `1.0.0` |

### Déploiement automatique

Chaque push sur la branche `main` déclenche automatiquement un redéploiement via l'intégration GitHub → Vercel.

### Points importants pour Vercel

- `prisma generate` s'exécute automatiquement avant `next build` (configuré dans package.json)
- Le middleware utilise `auth.config.ts` (Edge-compatible) — pas de Node.js APIs
- `bcryptjs` n'est chargé que dans les API routes (Node.js runtime), pas dans le middleware (Edge runtime)

---

## Améliorations futures

### Fonctionnalités prioritaires

- [ ] **Brancher les pages sur l'API** — les pages UI utilisent encore des données mock ; connecter chaque page à son endpoint `/api/*`
- [ ] **Graphiques dashboard** — intégrer Recharts ou Chart.js pour les courbes de mouvements et camemberts
- [ ] **Export CSV/Excel** — articles, mouvements, rapports
- [ ] **Import en masse** — upload CSV pour alimenter le stock initial
- [ ] **Recherche globale** — câbler la barre de recherche du header
- [ ] **Notifications temps réel** — alertes stock bas via WebSocket ou Supabase Realtime
- [ ] **Gestion des images** — upload photo pour les articles

### Qualité et infrastructure

- [ ] **Rôles et permissions** — restreindre les actions selon le rôle (ADMIN/MANAGER/OPERATOR/VIEWER)
- [ ] **Tests** — Jest + React Testing Library pour les composants clés
- [ ] **Pagination** — sur tous les tableaux (actuellement chargement complet)
- [ ] **Gestion d'erreurs UI** — états d'erreur et de chargement sur chaque page
- [ ] **Journal d'audit** — traçabilité complète des actions utilisateur
- [ ] **i18n** — internationalisation formelle (actuellement mixte FR/EN)
- [ ] **Mode mobile** — sidebar en drawer sur petit écran
