# Esther House - Site Web

Site web pour le théâtre Esther House avec billetterie en ligne.

## Stack

- Next.js 14 (TypeScript)
- Tailwind CSS + shadcn/ui
- Supabase (base de données)
- Stripe (paiements)

## Installation
```bash
npm install
cp .env.example .env.local
# Remplir les variables d'environnement
npm run dev
```

## Variables d'environnement requises
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

## Structure
```
app/          # Pages et routes
components/   # Composants React
lib/          # Config Supabase/Stripe
types/        # Types TypeScript
```

## TODO

- [ ] Système de réservation
- [ ] Paiement Stripe
- [ ] Galerie photos
- [ ] Newsletter
- [ ] Version anglaise

## Notes

Le site est en français par défaut, l'anglais sera ajouté avec next-intl.