# Guidelines de DEV — UnlockIt

Ce document résume les règles de développement sur tout le site **UnlockIt**.

---

## Couleurs

### Couleurs principales

| Variable             | Couleur   | Usage                                              |
| -------------------- | --------- | -------------------------------------------------- |
| --color-void         | #111111   | Fond principal très sombre                         |
| --color-tar          | #1a1a1a   | Fond secondaire / blocs                            |
| --color-smoke        | #2a2a2a   | Zones neutres / séparateurs                        |
| --color-onyx         | #2f2f2f   | Cartes, encarts, surfaces intermédiaires           |
| --color-carbon       | #444444   | Texte secondaire / icônes                          |
| --color-mist         | #aaaaaa   | Texte atténué / placeholders                       |
| --color-white        | #ffffff   | Texte inversé / éléments lumineux                  |
| --color-blue         | #1F6FEB   | Couleur de marque principale (liens, CTA, accents) |
| --color-green        | #00FF9F   | Validation, succès, accents “tech”                 |
| --color-blue-shadow  | #1f71ebaa | Ombres bleutées / hover                            |
| --color-green-shadow | #00ff9d88 | Ombres vertes / hover                              |

### Autres couleurs

| Variable            | Couleur                | Usage                                      |
| ------------------- | ---------------------- | ------------------------------------------ |
| --color-hover-light | rgba(255,255,255,0.15) | Hover clair sur fond sombre (header, menu) |
| --color-hover-dark  | rgba(0,0,0,0.15)       | Hover sombre sur fond clair                |
| --color-error       | #ff4d4d;               | pour les echecs, alertes, etc.             |
| --color-success     | #0cd34e;               | pour les succes, alertes, etc.             |
| --color-info        | #ffd966;               | pour les infos, alertes, etc.              |

### Règles générales

- Jamais de couleur brute dans le CSS → toujours via variables (sauf cas particulier : ombre, dégradé, one-time-use, etc.).
- Les contrastes doivent rester lisibles.
- Ajouter une nouvelle variable de couleur si, et seulement si elle risque d'etre récurrente et suit le reste du thème.

---

## Nommage

- variables : nomVariable
- constantes globales : NOM_VARIABLE
- composants :
  - composant : NomComposant
  - fichier : NomComposant.tsx
  - css composant : nomComposant.module.css
- dossier : nom-dossier
- fichier à lire : READ_ME.md / READ_ME.txt

---

## Modularité

Un composant SuperComposant.tsx doit toujours avoir un css local utilisant un module css possedant le nom superComposant.module.css

son css doit lui etre propre et etre repris par aucun composant parent. Les parents peuvent eventuelement lui creer un conteneur (par exemple pour les grilles)

un composant est soit utilisé dans le but du partager pour mieux regner, cad, separer les responsibilité si le composant parent devient trop gros (par exemple +500 lignes de code avec appels api et rendu)

soit car il s'agit d'une partie de code repris par plusieurs composant page (ex : Boutons, Cards, TexteArea, etc.)

## Architecture API Frontend

Le frontend sépare strictement les responsabilités en trois couches : **service**, **hook**, et **store**. Cette séparation garde le code propre, testable et réutilisable.

### axios.instance.ts

Point d'entrée unique pour tous les appels HTTP. Ne jamais importer `axios` directement dans un composant, passez toujours par les hooks (`useAuth()`, etc.).

```typescript
// src/api/axios.instance.ts
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // nécessaire pour envoyer les cookies httpOnly
});
```

---

### Services (`api/services/xxx.service.ts`)

Responsabilité unique : **faire l'appel HTTP et retourner la donnée brute**. Les services peuvent donc être utilisés avec des mocks on mode `OFFLINE_DEV` si l'api n'est pas fonctionnelle en temps de développement.

- Utilise `api` (axios.instance)
- Ne gère pas les erreurs
- Ne touche pas au store
- Ne contient pas de logique métier
- Nommés comme côté NestJS : `auth.service.ts`, `users.service.ts`, etc.

```typescript
// api/services/users.service.ts
export const usersService = {
    fetchAll: async (): Promise<Employee[]> => {
        if(OFFLINE_DEV) {
          // ...
          // return data;
        }

        const res = await api.get("/users");
        return res.data;
    },
    create: async (loginId: string, username: string, password: string) => {
        if(OFFLINE_DEV) {
          // ...
          // return data;
        }

        const res = await api.post("/users", { loginId, username, password });
        return res.data;
    },
};
```

---

### Hooks (`api/hooks/useXxx.hook.ts`)

Responsabilité : **utiliser le service, intercepter les erreurs, exposer des méthodes prêtes à l'emploi** pour les composants.

- Appelle les services, jamais `api` directement
- Gère les erreurs et les transforme en code lisible, permettant nottament leur traduction avec i18n (ex: `"username_taken"`)
- Met à jour le store si nécessaire
- Expose uniquement ce dont les composants ont besoin

```typescript
// api/hooks/useUsers.hook.ts
export function useUsers() {
    const [error, setError] = useState<string | null>(null);

    const create = async (loginId: string, username: string, password: string) => {
        setError(null);
        try {
            await usersService.create(loginId, username, password);
            return true;
        } catch (err: any) {
            if (err.response?.status === 409) setError("username_taken");
            else setError("create_failed");
            return false;
        }
    };

    return { create, error };
}
```

---

### Stores (`api/stores/xxx.store.ts`)

Responsabilité : **état global partagé entre plusieurs composants**. À utiliser uniquement si la donnée doit persister entre les pages ou être lue par plusieurs composants sans prop drilling.

- Utilise Zustand
- Ne fait jamais d'appels HTTP
- Ne contient pas de logique métier
- Ne stocke **jamais** de token JWT (sécurité) — les tokens restent dans les cookies httpOnly gérés par le backend

```typescript
// api/stores/auth.store.ts
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLogged: false,
    setUser: (user) => set({ user, isLogged: true }),
    logout: () => set({ user: null, isLogged: false }),
}));
```

---

### Résumé des règles

| Couche   | Fichier             | Fait                                    | Ne fait pas                             |
| -------- | ------------------- | --------------------------------------- | --------------------------------------- |
| Instance | `axios.instance.ts` | Configure axios (baseURL, credentials)  | Appels HTTP directs                     |
| Service  | `xxx.service.ts`    | Appel HTTP + retour donnée brute        | Gestion erreurs, store, logique         |
| Hook     | `useXxx.hook.ts`    | Erreurs, traductions, mise à jour store | Appels axios directs                    |
| Store    | `xxx.store.ts`      | État global partagé                     | Appels HTTP, logique métier, tokens JWT |

### Flux type

```
Composant
    → useXxx.hook       (gestion erreurs, logique)
        → xxx.service   (appel HTTP brut)
            → api       (axios.instance)
                → Backend NestJS
    → xxx.store         (lecture/écriture état global si nécessaire)
```

---

---

## Structure du projet

```
frontend/
├── index.html                   # Point d'entrée du projet
├── vite.config.ts               # Configuration de Vite
├── package.json                 # Dépendances et scripts
├── [autres fichiers]            # Fichiers globaux (configs, etc.)
├── public/                      # Fichiers statiques accessibles directement
│   ├── fonts/                   # Polices utilisées dans le projet
│   └── media/
│       ├── img/                 # Images, icônes, etc.
│       ├── vid/                 # Vidéos, GIF, etc.
│       ├── ico/                 # Icones
│       └── [autres medias]      # Cursor, favicon, etc.
└── src/                         # Code source principal
    ├── components/              # Composants réutilisables
    │   ├── layout/              # Header, Footer, Background, etc.
    │   ├── ui/                  # Boutons, Cards, Inputs, etc.
    │   └── [autres composants]
    ├── features/                # Pages fonctionnelles / privées
    │   ├── login/
    │   ├── age-gate/
    │   ├── auth-gate/
    │   ├── not-found/
    │   ├── forgotten-password/
    │   └── [autres features]
    ├── pages/                   # Pages principales du site
    │   ├── about-us/
    │   ├── cart/
    │   ├── shop/
    │   └── [autres pages]
    ├── styles/                  # Styles globaux et partagés
    │   ├── components/          # Styles des composants importés
    │   ├── fonts.css
    │   ├── index.css
    │   └── [autres styles]
    ├── api/                     # Couches api frontend
    │   ├── hook/
    │   ├── mock/                # Données à utiliser en OFFLINE_DEV
    │   ├── services/
    │   ├── stores/              # Zustand pour la logique api frontend
    │   ├── types/               # Type a importer pour repliquer le DTO
    |   └── axios.instance.ts
    ├── utils/
    │   ├── formatters/          # Formattage de date, prix, etc.
    │   ├── helpers/             # Petites fonctions utilitaires
    │   ├── hooks/               # Hooks réutilisables (animations, etc.)
    │   ├── stores/              # Zustand pour d'autre logique (lang, thème, etc.)
    │   └── validators/          # Règles et validations
    ├── App.tsx                  # Composant racine
    └── main.tsx                 # Point d'entrée React (injecté dans index.html)
```

```
nom-composant/
├── nom-sous-composant-1/         # Décomposition en sous-composants,
├── nom-sous-composant-2/         # Peuvent eux-même avoir des sous-composants,
├── nom-sous-composant-n/         # Autant de sous-composants que nécessaire, etc.
├── nomComposant.module.css       # Style local, grâce aux CSS Modules
└── NomComposant.tsx              # Composant principal(logique + rendu)
```

---

## Responsive

### Breakpoints

Mobile : 0–699px  
Tablette : 700–1023px  
Desktop : 1024px+

### Mise en page par device

#### Mobile (0–699px)
- 1 colonne
- Images 100% largeur
- Grilles : 1 colonne
- Boutons pleine largeur
- Titres plus petits

#### Tablette (700–1023px)
- 1 ou 2 colonnes
- Images 60–70% largeur
- Grilles : 2 colonnes
- Titres intermédiaires

#### Desktop (1024px+)
- 2 colonnes pour les sections texte + image
- Images 40–50% largeur
- Grilles : 3–4 colonnes
- Titres plus grands
- Contenu centré (max-width 1100px)

### Tailles de texte

|         | Mobile | Tablette | Desktop |
| ------- | ------ | -------- | ------- |
| H1      | 2rem   | 2.5rem   | 3rem    |
| H2      | 1.6rem | 2rem     | 2.2rem  |
| H3      | 1.2rem | 1.4rem   | 1.6rem  |
| Texte   | 1rem   | 1.1rem   | 1.15rem |
| Boutons | 1.1rem | 1.2rem   | 1.3rem  |

Typographies :  
- Titres / Sous-titres : Audiowide  
- Textes, label, etc. : Orbitron

### Images

- Mobile : 100%
- Tablette : 70%
- Desktop : 45–50%
- Toujours : object-fit: cover, border-radius: 12px
- Animations : transform: scale(1.03); on hover
  
### Logos

- Mobile : 60%
- Tablette : 40%
- Desktop : 25-30%
- Eviter : border-radius
- Animations : transform: scale(1.05); on hover

### Grilles

Mobile : 1 colonne  
Tablette : 2 colonnes  
Desktop : 2–4+ colonnes  

### Tests 

Téléphones :
- 375×667 (iPhone SE)
- 390×844 (iPhone 12/13/14/15)
- 360×800 (Samsung Galaxy S20/S21/S22)

Tablettes :
- 768×1024 (iPad portrait)
- 834×1194 (iPad Pro landscape)

Desktop :
- 1366×768 (Laptop standard)
- 1920×1080 (Full HD)

### Dépendances

Lancer `npm install` à la racine de chaque projet pour installer toutes les dépendances.

#### Frontend

| Package                        | Usage            |
| ------------------------------ | ---------------- |
| react, react-dom               | Noyau React      |
| react-router, react-router-dom | Navigation       |
| axios                          | Appels HTTP      |
| zustand                        | State management |