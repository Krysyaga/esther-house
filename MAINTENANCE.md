# Système de Maintenance Esther House

## Vue d'ensemble
Le système de maintenance bloque complètement l'accès au site et redirige tous les visiteurs vers une page de maintenance personnalisée. C'est contrôlé via une variable d'environnement.

## Comment utiliser

### Activer la maintenance

#### Localement (développement) :
1. Ouvrez `.env.local`
2. Changez `MAINTENANCE_MODE=false` en `MAINTENANCE_MODE=true`
3. Redémarrez le serveur : `npm run dev` ou `node .next/standalone/server.js`
4. Visitez http://localhost:3000 - vous verrez la page maintenance

#### Sur Infomaniak (production) :
1. Connectez-vous au panel Infomaniak
2. Allez dans : **Serveur Node.js > Variables d'environnement**
3. Créez ou modifiez la variable : `MAINTENANCE_MODE=true`
4. Sauvegardez et redémarrez l'application
5. Visitez https://estherhouse.ch - vous verrez la page maintenance
6. **TOUT** le trafic (sauf `/maintenance`) est automatiquement redirigé

### Désactiver la maintenance
Répétez les étapes ci-dessus mais changez `MAINTENANCE_MODE=false`

## Comment ça fonctionne

### Middleware (`middleware.ts`)
- Intercepte TOUTES les requêtes
- Si `MAINTENANCE_MODE=true` ET la requête n'est pas pour `/maintenance` :
  - Redirige vers `/maintenance`
  - APIs (`/api/*`) restent accessibles
- Si `MAINTENANCE_MODE=false` :
  - Routing normal

### Page de maintenance (`app/maintenance/page.tsx`)
- Design matching le site (fond noir, couleur #860000)
- Countdown timer (24h par défaut, modifiable)
- Bouton contact
- Liens réseaux sociaux
- Responsive design (mobile/desktop)

## Personnalisations possibles

### Changer le message
Ouvrez `app/maintenance/page.tsx` et modifiez le texte/HTML

### Changer la durée du countdown
Dans `app/maintenance/page.tsx`, ligne ~17 :
```tsx
const maintenanceEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000).getTime(); // 24h
// Changez 24 en nombre d'heures désiré
```

### Permettre l'accès à certains IPs
Dans `middleware.ts`, ajoutez :
```tsx
const whitelist = ['192.168.1.1', '10.0.0.1'];
const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
if (maintenanceMode && !whitelist.includes(ip)) {
  // Redirige vers maintenance
}
```

## Points importants

✅ **TOUT** le site est inaccessible quand maintenance est ON (sauf `/maintenance`)
✅ Les APIs (`/api/*`) restent accessibles
✅ Aucun conflit avec le serveur Infomaniak
✅ Change instant (pas besoin de redéployer le code, juste la variable env)
✅ Design cohérent avec le site

## Tester avant de déployer

1. Testez localement avec `MAINTENANCE_MODE=true`
2. Vérifiez que vous êtes redirigé depuis n'importe quelle route
3. Vérifiez que `/maintenance` est accessible
4. Changez `MAINTENANCE_MODE=false` et testez que le site marche normalement

## Troubleshooting

**Je vois encore le site normal au lieu de la maintenance ?**
- Vérifiez que `MAINTENANCE_MODE=true` dans les variables d'environnement Infomaniak (pas seulement local)
- Redémarrez l'app Node.js depuis le panel

**Le countdown ne s'affiche pas ?**
- C'est normal si le temps restant est dépassé
- Modifiez la date dans `app/maintenance/page.tsx` ligne ~17

**Comment laisser les admins accéder au site en maintenance ?**
- Modifiez `middleware.ts` pour ajouter une IP whitelist (voir personnalisations)
- Ou créez un endpoint admin protégé par authentification
