-- ─────────────────────────────────────────────────────────────
-- Row Level Security — StockAirys
-- À exécuter dans : Supabase Dashboard → SQL Editor
-- But : bloquer l'accès direct via l'API PostgREST/anon key.
-- Notre app utilise Prisma (rôle postgres = superuser = bypass RLS).
-- ─────────────────────────────────────────────────────────────

-- Auth tables
ALTER TABLE public.users                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens    ENABLE ROW LEVEL SECURITY;

-- Stock tables
ALTER TABLE public.categories             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_barcodes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stocks                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movements              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movement_lines         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receptions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reception_lines        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_lines            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts                 ENABLE ROW LEVEL SECURITY;
