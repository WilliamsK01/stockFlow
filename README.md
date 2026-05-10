# StockAirys — Système de gestion de stock multi-secteur

Application web de gestion d'inventaire construite avec **Next.js 16**, **React 19** et **TypeScript**. Déployée sur **Vercel**, connectée à **Supabase (PostgreSQL)**, authentifiée avec **NextAuth.js v5**.

🌐 **Production** : [https://stockflow-airys.vercel.app](https://stockflow-airys.vercel.app)

---

## Table des matières

1. [État du projet](#état-du-projet)
2. [Audit détaillé par domaine](#audit-détaillé-par-domaine)
3. [Ce qui manque / n'est pas encore créé](#ce-qui-manque--nest-pas-encore-créé)
4. [Stack technologique](#stack-technologique)
5. [Architecture](#architecture)
6. [Modules et pages](#modules-et-pages)
7. [API REST](#api-rest)
8. [Base de données](#base-de-données)
9. [Authentification](#authentification)
10. [Sécurité](#sécurité)
11. [Installation et démarrage](#installation-et-démarrage)
12. [Déploiement Vercel](#déploiement-vercel)
13. [Améliorations futures](#améliorations-futures)

---

## État du projet

| Critère | État réel |
| --- | --- |
| Pages UI créées | 12/12 modules présents dans la sidebar |
| Pages connectées à l'API réelle | 9/12 (Forecasting, Reports, Settings utilisent encore des données mock) |
| Routes API CRUD complètes | 8 entités complètes (GET/POST/GET:id/PUT/DELETE) |
| Routes API partielles | 3 (dashboard GET-only, users GET-only, auth NextAuth) |
| Routes API absentes | Forecasting, Reports, Settings |
| Base de données | Connectée — Supabase PostgreSQL (Prisma 5) |
| Authentification | Fonctionnelle — NextAuth.js v5 + JWT + bcryptjs |
| RLS Supabase | Activé sur 19 tables |
| Déploiement | En production sur Vercel |
| Tests | Aucun (0 %) |
| i18n | Absent — dossier `locales/` créé mais vide |
| Dossiers vides | `hooks/`, `contexts/`, `locales/`, `app/employees/`, `app/users/` |

---

## Audit détaillé par domaine

### Pages et données

| Module | Route | Page | API | Source données |
| --- | --- | --- | --- | --- |
| Tableau de bord | `/dashboard` | ✅ Complet | ✅ `/api/dashboard` | API réelle |
| Articles | `/articles` | ✅ Complet | ✅ CRUD complet | API réelle |
| Catégories | `/categories` | ✅ Complet | ✅ CRUD complet | API réelle |
| Fournisseurs | `/suppliers` | ✅ Complet | ✅ CRUD complet | API réelle |
| Mouvements | `/movements` | ✅ Complet | ✅ CRUD complet | API réelle |
| Entrepôts | `/warehouses` | ✅ Complet | ✅ CRUD complet | API réelle |
| Réceptions | `/receptions` | ✅ Complet | ✅ CRUD complet | API réelle |
| Commandes | `/orders` | ✅ Complet | ✅ CRUD complet | API réelle |
| Alertes | `/alerts` | ✅ Complet | ✅ CRUD complet | API réelle |
| Connexion | `/login` | ✅ Complet | ✅ NextAuth | API réelle |
| Prévisions | `/forecasting` | ⚠️ UI seule | ❌ Absent | **Mock data** |
| Rapports | `/reports` | ⚠️ UI seule | ❌ Absent | **Mock data** |
| Paramètres | `/settings` | ⚠️ UI seule | ❌ Absent | **Statique / toast local** |
| Employés | `/employees` | ❌ **Absent** | ❌ Absent | — |
| Utilisateurs | `/users` | ❌ **Absent** | ⚠️ GET only | — |

### Composants dialogs

| Dialog | Fichier | État |
| --- | --- | --- |
| Article | `components/articles/article-dialog.tsx` | ✅ Complet |
| Category | `components/categories/category-dialog.tsx` | ✅ Complet |
| Supplier | `components/suppliers/supplier-dialog.tsx` | ✅ Complet |
| Movement | `components/movements/movement-dialog.tsx` | ✅ Complet |
| Warehouse | `components/warehouses/warehouse-dialog.tsx` | ✅ Complet |
| Reception | `components/receptions/reception-dialog.tsx` | ✅ Complet |
| Order | `components/orders/order-dialog.tsx` | ✅ Complet |
| Alert (create) | — | ❌ **Absent** — les alertes sont système, pas manuelles |
| Employee | — | ❌ **Absent** |
| User (invite) | — | ❌ **Absent** |

### Seed de base de données

| Entité | Seed présent |
| --- | --- |
| Admin (1 user) | ✅ `williamsk.koffi1@gmail.com` / `Admin@2025` |
| Catégories (4) | ✅ Screws, Lubricants, Bearings, Electrical |
| Fournisseurs (3) | ✅ ACM Visserie, PetroCI, SKF Distribution |
| Entrepôts (2) | ✅ Entrepôt Principal, Entrepôt Frigorifique |
| Articles (3) | ✅ REF-001, REF-002, REF-003 |
| Mouvements (8) | ✅ MVT-2024-001 à MVT-2024-008 (Entry/Exit/Transfer/Adjustment) |
| Réceptions (3) | ✅ REC-2024-001 à REC-2024-003 (Received/Pending/Partial) |
| Commandes (4) | ✅ ORD-2024-001 à ORD-2024-004 (Purchase/Sale) |
| Alertes (5) | ✅ ALT-001 à ALT-005 (LowStock/Capacity/Expiry/Threshold) |
| Emplacements (7) | ✅ 5 dans EP-001 + 2 dans EP-002 |
| Stock initial (3) | ✅ REF-001: 150 · REF-002: 25 · REF-003: 5 |

### Dossiers créés mais vides

| Dossier | Usage prévu | État |
| --- | --- | --- |
| `hooks/` | Custom React hooks | ❌ Vide |
| `contexts/` | Context API / état global | ❌ Vide |
| `locales/` | Internationalisation (i18n) | ❌ Vide |
| `app/employees/` | Gestion des employés | ❌ Vide (pas de page.tsx) |
| `app/users/` | Gestion des utilisateurs | ❌ Vide (pas de page.tsx) |

---

## Ce qui manque / n'est pas encore créé

### Critique — fonctionnalités absentes

1. **Page `/employees`** — dossier créé, aucun fichier, aucune API, aucun dialog
2. **Page `/users`** — dossier créé, `GET /api/users` existe (lecture seule), mais pas de page UI ni de gestion (invite, role, désactivation)
3. **API Forecasting** — `/app/forecasting/page.tsx` utilise des données calculées côté client (mock), aucune route `/api/forecasting`
4. **API Reports** — `/app/reports/page.tsx` utilise des données statiques, aucune route `/api/reports`
5. **API Settings** — `/app/settings/page.tsx` sauvegarde avec un toast fictif, aucune persistance des préférences

### Important — données incomplètes

6. ~~**Seed incomplet**~~ — ✅ **Résolu** : seed complet avec 7 emplacements, 3 stocks, 8 mouvements, 4 commandes, 3 réceptions, 5 alertes

### Fonctionnalités UI non câblées

1. **Recherche globale** (header) — champ visible mais non fonctionnel
2. **Notifications** (header) — 3 notifications hardcodées, non branchées sur l'API `/api/alerts`
3. **Rôles et permissions** — 4 rôles définis (ADMIN, MANAGER, OPERATOR, VIEWER) mais aucune restriction d'accès basée sur le rôle n'est implémentée dans les pages

### Infrastructure

1. **Tests** — aucun test unitaire, d'intégration ou E2E (0 %)
2. **i18n** — dossier `locales/` vide, interface mélange français/anglais sans système formel
3. **Hooks custom** — dossier `hooks/` vide, logique répétée dans chaque page (`useEffect` fetch pattern)
4. **Context API** — dossier `contexts/` vide, état global géré via `useState` local par page (pas de partage entre pages)
5. **Pagination** — aucune pagination sur les tableaux (tous les enregistrements chargés d'un coup)
6. **Validation côté serveur** — les routes API ne valident pas les données reçues (pas de Zod côté API)

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
│   ├── login/page.tsx            # Page de connexion ✅
│   ├── dashboard/page.tsx        # Tableau de bord ✅ (API réelle)
│   ├── articles/page.tsx         # Articles ✅ (API réelle)
│   ├── categories/page.tsx       # Catégories ✅ (API réelle)
│   ├── suppliers/page.tsx        # Fournisseurs ✅ (API réelle)
│   ├── movements/page.tsx        # Mouvements ✅ (API réelle)
│   ├── warehouses/page.tsx       # Entrepôts ✅ (API réelle)
│   ├── receptions/page.tsx       # Réceptions ✅ (API réelle)
│   ├── orders/page.tsx           # Commandes ✅ (API réelle)
│   ├── alerts/page.tsx           # Alertes ✅ (API réelle)
│   ├── forecasting/page.tsx      # Prévisions ⚠️ (mock data)
│   ├── reports/page.tsx          # Rapports ⚠️ (mock data)
│   ├── settings/page.tsx         # Paramètres ⚠️ (statique)
│   ├── employees/                # ❌ Dossier vide — pas de page.tsx
│   ├── users/                    # ❌ Dossier vide — pas de page.tsx
│   └── api/                      # Routes API REST
│       ├── auth/[...nextauth]/   # ✅ NextAuth handler
│       ├── articles/             # ✅ CRUD complet
│       ├── categories/           # ✅ CRUD complet
│       ├── suppliers/            # ✅ CRUD complet
│       ├── warehouses/           # ✅ CRUD complet
│       ├── movements/            # ✅ CRUD complet
│       ├── receptions/           # ✅ CRUD complet
│       ├── orders/               # ✅ CRUD complet
│       ├── alerts/               # ✅ CRUD complet
│       ├── users/                # ⚠️ GET only
│       └── dashboard/            # ⚠️ GET only (agrégats)
│
├── components/
│   ├── layout/
│   │   ├── main-layout.tsx       # ✅ Wrapper (sidebar + header + footer)
│   │   ├── sidebar.tsx           # ✅ Navigation rétractable + logo
│   │   ├── header.tsx            # ✅ Barre supérieure
│   │   └── footer.tsx            # ✅ Pied de page (horloge, statut)
│   ├── articles/article-dialog.tsx        # ✅
│   ├── categories/category-dialog.tsx     # ✅
│   ├── suppliers/supplier-dialog.tsx      # ✅
│   ├── movements/movement-dialog.tsx      # ✅
│   ├── warehouses/warehouse-dialog.tsx    # ✅
│   ├── receptions/reception-dialog.tsx    # ✅
│   ├── orders/order-dialog.tsx            # ✅
│   └── ui/                               # ✅ 20+ composants ShadcnUI
│
├── lib/
│   ├── prisma.ts                 # ✅ Client Prisma singleton
│   ├── utils.ts                  # ✅ Utilitaire cn()
│   ├── allCountries.ts           # ✅ Liste pays
│   ├── currencySymbols.ts        # ✅ Symboles monétaires
│   └── getFlagEmoji.ts           # ✅ Emojis drapeaux
│
├── hooks/                        # ❌ Vide
├── contexts/                     # ❌ Vide
├── locales/                      # ❌ Vide (i18n non implémenté)
│
├── prisma/
│   ├── schema.prisma             # ✅ 18 modèles, 15 enums
│   ├── seed.ts                   # ⚠️ Partiel (pas de stock/mouvements/alertes)
│   └── rls.sql                   # ✅ RLS sur 19 tables
│
├── types/type.tsx                # ✅ 8 interfaces principales
├── auth.ts                       # ✅ Config NextAuth (Node.js)
├── auth.config.ts                # ✅ Config NextAuth (Edge-safe)
├── middleware.ts                 # ✅ Protection des routes
└── public/logo.jpeg              # ✅ Logo officiel StockAirys
```

---

## Modules et pages

### Navigation (sidebar rétractable)

La sidebar dispose d'un **bouton toggle** pour se réduire (icônes seules) ou s'agrandir (icônes + labels), avec une animation fluide. Elle comprend un **footer utilisateur** (avatar, nom, rôle, déconnexion au hover). Le logo officiel est affiché en haut.

| Module | Route | UI | Données | Notes |
| --- | --- | --- | --- | --- |
| Tableau de bord | `/dashboard` | ✅ | API réelle | KPI + alertes critiques + mouvements récents |
| Articles | `/articles` | ✅ | API réelle | CRUD, classification ABC, seuils, stock calculé |
| Catégories | `/categories` | ✅ | API réelle | Arborescence parent/enfant, color picker |
| Fournisseurs | `/suppliers` | ✅ | API réelle | CRUD, sélecteur pays, téléphone international |
| Mouvements | `/movements` | ✅ | API réelle | Entrées/Sorties/Transferts/Ajustements |
| Entrepôts | `/warehouses` | ✅ | API réelle | Onglets Warehouses + Locations |
| Réceptions | `/receptions` | ✅ | API réelle | Lignes dynamiques, totalValue calculé |
| Commandes | `/orders` | ✅ | API réelle | Achats/Ventes, lignes dynamiques, total |
| Alertes | `/alerts` | ✅ | API réelle | Acknowledge / Resolve / Delete |
| Prévisions | `/forecasting` | ⚠️ | **Mock data** | UI présente, aucune route API |
| Rapports | `/reports` | ⚠️ | **Mock data** | 4 onglets, données statiques |
| Paramètres | `/settings` | ⚠️ | **Statique** | 4 onglets, save = toast local, aucune persistance |
| Connexion | `/login` | ✅ | NextAuth | Logo + email/mdp + redirect dashboard |

### Layout global

- **Header** : barre de recherche (non câblée), notifications hardcodées, toggle thème dark/light, menu utilisateur
- **Footer** : logo miniature, version, statut système animé, horloge en temps réel
- **Sidebar** : toggle collapse/expand, badge actif sur la route courante, logout discret au hover

---

## API REST

Toutes les routes sont **protégées par session JWT** via `auth()` de NextAuth.

### CRUD complets (8 entités)

| Endpoint | GET | POST | GET/:id | PUT/:id | DELETE/:id |
| --- | --- | --- | --- | --- | --- |
| `/api/articles` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/categories` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/suppliers` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/warehouses` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/movements` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/receptions` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/orders` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/alerts` | ✅ | ✅ | ✅ | ✅ | ✅ |

### Partiels

| Endpoint | Méthodes | Manque |
| --- | --- | --- |
| `/api/users` | GET uniquement | POST (invite), PUT (rôle), DELETE (désactiver) |
| `/api/dashboard` | GET uniquement | Agrégats — pas de mutation nécessaire |
| `/api/auth/[...nextauth]` | GET + POST | Handler NextAuth — complet pour l'usage prévu |

### Absents

| Endpoint | Raison |
| --- | --- |
| `/api/forecasting` | Page utilise mock data — calculs à implémenter côté serveur |
| `/api/reports` | Page utilise mock data — requêtes agrégées à créer |
| `/api/settings` | Préférences non persistées — table `settings` absente du schéma |
| `/api/employees` | Module non créé |
| `/api/locations` | CRUD emplacements non exposé |
| `/api/stocks` | Mouvements de stock non tracés via API |

**Réponses** : JSON, codes HTTP standard (200, 201, 204, 401, 404, 500).

---

## Base de données

### Technologie

- **PostgreSQL** hébergé sur **Supabase** (région EU West — eu-west-1)
- **Prisma 5** comme ORM (migrations, typage auto-généré, relations)
- Connexion via **session pooler** (port 5432, compatible IPv4)

### Modèles (18 tables)

| Modèle | Table | Description |
| --- | --- | --- |
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
| `Movement` | `movements` | En-têtes de mouvements |
| `MovementLine` | `movement_lines` | Lignes de mouvements |
| `Reception` | `receptions` | En-têtes de réceptions |
| `ReceptionLine` | `reception_lines` | Lignes de réceptions |
| `Order` | `orders` | Commandes achat/vente |
| `OrderLine` | `order_lines` | Lignes de commandes |
| `Alert` | `alerts` | Alertes système |

### Tables absentes du schéma

| Table manquante | Utilité |
| --- | --- |
| `settings` | Préférences d'entreprise (devise, langue, thème) |
| `employees` | Gestion des employés (page vide) |
| `audit_logs` | Journal d'audit des actions |

### Enums (15)

`Role`, `SupplierStatus`, `WarehouseType`, `TemperatureType`, `WarehouseStatus`, `Classification`, `ArticleStatus`, `MovementType`, `MovementStatus`, `ReceptionStatus`, `OrderType`, `OrderStatus`, `AlertType`, `AlertLevel`, `AlertStatus`

### Champs calculés (non stockés)

Ces valeurs sont calculées à la requête via Prisma aggregations :

| Champ UI | Calcul |
| --- | --- |
| `stock` (Article) | `SUM(stocks.quantity)` filtré par articleId |
| `currentOccupation` (Warehouse) | `SUM(stocks.quantity)` filtré par warehouseId |
| `nbArticles` (Category) | `COUNT(articles WHERE categoryId = ?)` |
| `totalAmount` (Order) | `SUM(orderLines.quantity × unitPrice)` |
| `totalValue` (Reception) | `SUM(receptionLines.receivedQty × unitPrice)` |

---

## Authentification

- **Provider** : `CredentialsProvider` (email + mot de passe)
- **Hash** : bcryptjs (côté Node.js uniquement, pas dans l'Edge Runtime)
- **Sessions** : JWT stateless (stratégie `jwt`)
- **Middleware** : protège toutes les routes sauf `/login`, `/api/auth/*` et les assets statiques
- **Architecture Edge-safe** : `auth.config.ts` (sans Prisma ni bcryptjs) utilisé par le middleware, `auth.ts` (complet) utilisé par les API routes

### Rôles définis (non encore appliqués aux pages)

| Rôle | Description | Restrictions implémentées |
| --- | --- | --- |
| `ADMIN` | Accès complet | ❌ Non appliqué |
| `MANAGER` | Gestion opérationnelle | ❌ Non appliqué |
| `OPERATOR` | Saisie et consultation | ❌ Non appliqué |
| `VIEWER` | Lecture seule | ❌ Non appliqué |

> Les rôles sont définis dans le schéma Prisma et stockés en base, mais aucune restriction d'accès par rôle n'est implémentée dans les pages ou l'API. Toute personne connectée a accès à tout.

---

## Sécurité

### Row Level Security (RLS)

Le RLS est activé sur les **19 tables publiques** via le script `prisma/rls.sql`. Cela bloque tout accès direct via l'API PostgREST/anon key de Supabase. Notre app utilise Prisma (rôle `postgres`) qui bypass le RLS par conception PostgreSQL.

### Middleware de protection

Toutes les routes (sauf `/login` et `/api/auth/*`) sont protégées par le middleware NextAuth. Un utilisateur non authentifié est redirigé vers `/login`.

### Dépendances

CVEs Next.js corrigées — version 16.2.6 utilisée en production.

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
npm run db:generate   # Générer le client Prisma
npm run db:push       # Créer toutes les tables dans Supabase
npm run db:seed       # Insérer les données initiales
```

### 4. Lancer en développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

**Compte admin :**

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
| --- | --- |
| `DATABASE_URL` | URL session pooler Supabase (port 5432) |
| `DIRECT_URL` | Même URL |
| `AUTH_SECRET` | Secret aléatoire 32 bytes |
| `NEXTAUTH_URL` | `https://stockflow-airys.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `StockAirys` |
| `NEXT_PUBLIC_APP_VERSION` | `1.0.0` |

### Points importants

- `prisma generate` s'exécute automatiquement avant `next build`
- Le middleware utilise `auth.config.ts` (Edge-compatible)
- `bcryptjs` n'est chargé que dans les API routes (Node.js runtime)

---

## Améliorations futures

### Priorité 1 — Compléter ce qui est vide ou partiel

- [ ] **Créer la page `/employees`** — dossier présent, aucun fichier
- [ ] **Créer la page `/users`** — dossier présent, API GET existe, page manquante
- [ ] **Brancher Forecasting sur l'API** — créer `/api/forecasting` avec calculs réels depuis `stocks` et `movements`
- [ ] **Brancher Reports sur l'API** — créer `/api/reports` avec agrégations Prisma réelles
- [ ] **Persister les Paramètres** — ajouter table `settings` en base, créer `/api/settings`
- [ ] **Compléter le seed** — ajouter mouvements, réceptions, commandes, alertes, emplacements et stocks initiaux
- [ ] **Implémenter les restrictions par rôle** — ADMIN/MANAGER/OPERATOR/VIEWER sur chaque route et page

### Priorité 2 — Fonctionnalités manquantes

- [ ] **Remplir les hooks/** — extraire le pattern `useEffect + fetch` en custom hooks réutilisables (`useFetch`, `useCRUD`)
- [ ] **Remplir les contexts/** — partager l'état global (user, theme preferences) entre pages
- [ ] **Notifications en temps réel** — brancher les 3 notifications du header sur `/api/alerts`
- [ ] **Recherche globale** — câbler la barre de recherche du header
- [ ] **Pagination** — tous les tableaux chargent tout en mémoire, ajouter `page/limit` dans les API
- [ ] **Validation côté serveur** — ajouter Zod dans chaque route API pour valider `req.json()`
- [ ] **Export CSV/PDF** — articles, mouvements, rapports
- [ ] **Gestion des images** — upload photo pour les articles

### Priorité 3 — Qualité et infrastructure

- [ ] **i18n** — remplir `locales/`, utiliser `next-intl` ou `next-i18next`
- [ ] **Tests** — Jest + React Testing Library (0 % actuellement)
- [ ] **Error boundaries** — capturer les erreurs runtime dans les pages
- [ ] **Audit logs** — table `audit_logs` + middleware d'enregistrement des mutations
- [ ] **Mode mobile** — sidebar en drawer sur écrans < 768px
- [ ] **Accessibilité** — aria-labels, navigation clavier complète
