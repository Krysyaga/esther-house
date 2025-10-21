# 🏗️ Architecture & Décisions - Esther House

## 🎯 Principes Directeurs

### 1. **Next.js 14+ App Router**
**Pourquoi?** 
- ✅ Standard moderne de Next.js
- ✅ Server Components par défaut
- ✅ Performance optimale
- ✅ Meilleure organisation du code

**Impact:** 
- Toutes les routes dans `app/`
- Pages comme fichiers `page.tsx`
- API routes dans `app/api/`

---

### 2. **TypeScript Strict**
**Pourquoi?**
- ✅ Détecte les erreurs à la compilation
- ✅ Meilleure expérience développeur
- ✅ Auto-complétion IDE
- ✅ Documentation implicite

**Configuration:**
```json
"strict": true,
"noUnusedLocals": true,
"noUnusedParameters": true,
"noImplicitReturns": true
```

---

### 3. **Server Components par Défaut**
**Pourquoi?**
- ✅ Pas d'expédition de JavaScript au client
- ✅ Accès direct à la BD sécurisé
- ✅ Tokens secrets non exposés
- ✅ Meilleures performances

**Règle:** Utiliser `"use client"` seulement quand c'est nécessaire
```typescript
// ✅ BON: Server Component par défaut
export function MyComponent() { }

// ⚠️ SEULEMENT SI NÉCESSAIRE: Client Component
"use client"
export function InteractiveComponent() { }
```

---

### 4. **Tailwind CSS + shadcn/ui**
**Pourquoi?**
- ✅ Développement rapide
- ✅ Design système cohérent
- ✅ Pas de duplication CSS
- ✅ Composants de haute qualité

**Hiérarchie:**
1. Composants shadcn/ui (core UI)
2. Composants custom (layout, pages)
3. Styles Tailwind inline

---

### 5. **Supabase pour la BD**
**Pourquoi?**
- ✅ PostgreSQL puissant
- ✅ Auth intégré
- ✅ Real-time capabilities
- ✅ Storage inclus
- ✅ Pricing transparent

**Architecture:**
```
Supabase (BD centralisée)
    ↓
Client Supabase (lib/supabase.ts)
    ↓
API Routes (app/api/)
    ↓
Components & Pages
```

---

### 6. **Stripe pour les Paiements**
**Pourquoi?**
- ✅ Leader du marché
- ✅ Sécurité PCI-DSS
- ✅ Support multidevise
- ✅ Dashboard puissant

**Architecture:**
```
Client Stripe (lib/stripe.ts)
    ↓
API Route (app/api/checkout)
    ↓
Webhook Stripe (app/api/webhooks/stripe)
    ↓
Supabase (enregistrement de la transaction)
```

---

### 7. **next-intl pour l'Internationalisation**
**Pourquoi?**
- ✅ Intégration optimale Next.js 14
- ✅ Traductions par route
- ✅ Détection de langue automatique
- ✅ Pas de rechargement de page

**Support:** Français (fr) + Anglais (en)

---

## 📁 Structure et Conventions

### Règles de Nommage

#### Fichiers
```
✅ components/home/hero.tsx         (kabab-case)
✅ lib/utils.ts                     (lowercase)
✅ types/index.ts                   (lowercase)
❌ components/HomePage.tsx          (PascalCase pour les fichiers)
```

#### Composants
```typescript
// ✅ BON: Noms descriptifs
export function HeroSection() { }
export function UpcomingEventsList() { }
export function ContactForm() { }

// ❌ MAUVAIS: Noms génériques
export function Container() { }
export function Card() { }
```

#### Variables & Fonctions
```typescript
// ✅ BON
const eventList = []
function handleSubmit() { }
const isLoading = false

// ❌ MAUVAIS
const list = []
function submit() { }
const loading = false
```

### Organisation des Imports

```typescript
// 1. Imports Next.js
import { useEffect, useState } from "react"
import Link from "next/link"
import { Metadata } from "next"

// 2. Imports dépendances externes
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

// 3. Imports locaux
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { Event } from "@/types"
import { Header } from "@/components/layout/header"
```

---

## 🔄 Patterns de Développement

### 1. **Composant Simple (Server)**

```typescript
// components/home/stats.tsx
export function StatsSection() {
  return (
    <section className="py-12">
      {/* Contenu */}
    </section>
  )
}
```

### 2. **Composant Interactif (Client)**

```typescript
"use client"

import { useState } from "react"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  
  return (
    <form>
      {/* Contenu interactif */}
    </form>
  )
}
```

### 3. **Page avec Métadonnées Dynamiques**

```typescript
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Titre",
    description: "Description",
  }
}

export default function Page() {
  return <div>Contenu</div>
}
```

### 4. **Route API**

```typescript
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase.from("events").select("*")
  
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true, data })
}
```

---

## 🗄️ Modèle de Données

### Entités Principales

```
Events (Événements)
├── id (UUID)
├── title, description
├── date, location
├── price, capacity
└── category (concert, theatre, exposition)

Tickets (Réservations)
├── id (UUID)
├── event_id (FK)
├── user_email, quantity
├── total_price, status
└── stripe_payment_id

ContactMessages
├── id (UUID)
├── name, email, subject
├── message, status
└── created_at

NewsletterSubscribers
├── id (UUID)
├── email (UNIQUE)
├── language
└── is_active
```

---

## 🔐 Sécurité

### Variables d'Environnement

```
✅ NEXT_PUBLIC_* → Client-safe (public)
❌ Non préfixé → Server-only (secret)

Exemple:
NEXT_PUBLIC_SUPABASE_URL=... (public)
STRIPE_SECRET_KEY=...        (secret)
```

### Row Level Security (RLS)

Toutes les tables Supabase doivent avoir des policies RLS:

```sql
-- Exemple
CREATE POLICY "Public read events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Admin manage events" ON events
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### Validation

Toujours valider avec Zod côté serveur:

```typescript
import { z } from "zod"

const eventSchema = z.object({
  title: z.string().min(3),
  price: z.number().positive(),
})

export async function POST(request: Request) {
  const data = eventSchema.parse(await request.json())
  // Utiliser data validé
}
```

---

## 📊 Performance

### Optimisations Implémentées

1. **Images**
   - Utiliser `next/image` plutôt que `<img>`
   - Lazy loading automatique
   - Format optimal (WebP)

2. **Code Splitting**
   - Automatique avec App Router
   - Lazy load les composants lourds

3. **Caching**
   - ISR pour les pages statiques
   - Revalidation intelligente

4. **Database**
   - Indexes sur les colonnes fréquemment interrogées
   - RLS policies optimisées

---

## 🧪 Testing Strategy

### À Implémenter

1. **Unit Tests** (jest + vitest)
   - Fonctions utilitaires
   - Hooks custom

2. **Component Tests** (testing-library)
   - Composants isolés
   - Interactions utilisateur

3. **E2E Tests** (playwright ou cypress)
   - Parcours utilisateur complets
   - Workflows critiques

---

## 📈 Scalabilité

### Plan d'Évolution

#### Phase 1 (MVP - Maintenant)
- Pages statiques
- Gestion basique d'événements
- Formulaires simples

#### Phase 2 (Croissance)
- Authentification admin
- Dashboard
- Notifications email
- Analytics

#### Phase 3 (Maturité)
- Système de recommandation
- Micro-services
- CDN global
- Caching avancé

---

## 🚀 Déploiement

### Stratégie de Déploiement

```
Développement (local)
    ↓
Staging (branche develop)
    ↓
Production (branche main)
```

### CI/CD Pipeline (à configurer)

```yaml
1. Lint & Type-check
2. Unit tests
3. Build
4. E2E tests
5. Deploy
```

---

## 📝 Guidelines de Contribution

### Avant de Commiter

```bash
npm run type-check  # ✅ Pas d'erreurs TS
npm run lint       # ✅ Code valide
npm run build      # ✅ Build réussit
```

### Commits

```
✅ "feat: add event filtering"
✅ "fix: event date parsing"
✅ "refactor: extract hero component"
❌ "update"
❌ "fix bug"
```

### Pull Requests

- [ ] Tests passent
- [ ] Types TypeScript validés
- [ ] Documentation à jour
- [ ] Pas de breaking changes

---

## 🎓 Ressources pour Maintenir l'Architecture

### Documentation à Consulter
- Next.js App Router: https://nextjs.org/docs/app
- TypeScript: https://www.typescriptlang.org/docs
- React: https://react.dev
- Supabase: https://supabase.com/docs

### Code Quality
- ESLint pour la cohérence
- TypeScript pour la sécurité des types
- Prettier pour le formatage

---

## 🔄 Révision Régulière

### Points de Révision Importants
- [ ] Dépendances à jour?
- [ ] Performance acceptable?
- [ ] Sécurité révisée?
- [ ] Documentation à jour?

---

**Cette architecture est conçue pour être maintenable, scalable et moderne! 🚀**

---

_Dernière mise à jour: Octobre 2025_
