<link rel="stylesheet" href="./src/style.css">
<link rel="stylesheet" href="./src/hljs.css">

<script src="./src/mermaid.min.js"></script> + rm styles + pseudo ref name

<header class="sticky-header">
    <span class="header-title">Rapport SAÉ 4.01 - Qualité</span>
    <img src="src/assets/unlock-it.svg" alt="UnlockIt Logo" class="header-logo">
</header>

<div class="false-body">

<div class="cover-page">
    <h1>Rapport SAÉ 4.01 - Qualité</h1>
    <a href="https://github.com/ElPotatoCorp/UnlockIt" target="_blank">
        <img src="src/assets/default-og-image.png" class="cover-image" alt="Capture UnlockIt">
    </a>
    <div class="cover-authors">
        <div class="info-line">Mars – Juin 2026</div>
        <div class="info-line authors">
            <a href="https://github.com/Frozen1753" target="_blank">Frozen1753</a>
            <span>&</span>
            <a href="https://github.com/ElPotatoCorp" target="_blank">ElPotato</a>
        </div>
        <div class="info-line">BUT Informatique</div>
</div>

</div>

<div class="page-break"></div>

# Sommaire

<div class="toc">

<ul>
    <li><a href="#1-introduction">1. Introduction</a></li>
    <li class="lvl2"><a href="#11-présentation-du-projet">1.1 Présentation du projet</a></li>
    <li class="lvl2"><a href="#12-présentation-des-membres">1.2 Présentation des membres</a></li>
    <li class="lvl2"><a href="#13-pourquoi-une-refonte-complète-">1.3 Pourquoi une refonte complète ?</a></li>
    <li class="lvl2"><a href="#14-avertissements-et-déclarations">1.4 Avertissements et déclarations</a></li>
    <li><a href="#2-frontend">2. Frontend</a></li>
    <li class="lvl2"><a href="#21-refonte-de-larchitecture-react">2.1 Refonte de l'architecture React</a></li>
    <li class="lvl2"><a href="#22-référencement-et-indexation">2.2 Référencement et indexation</a></li>
    <li class="lvl2"><a href="#23-optimisation-des-performances">2.3 Optimisation des performances</a></li>
    <li class="lvl2"><a href="#24-refonte-graphique">2.4 Refonte graphique</a></li>
    <li class="lvl2"><a href="#25-nouvelle-couche-api-frontend">2.5 Nouvelle couche API Frontend</a></li>
    <li class="lvl2"><a href="#26-tests-automatisés">2.6 Tests automatisés</a></li>
    <li class="lvl2"><a href="#27-difficultés-rencontrées-et-solutions">2.7 Difficultés rencontrées et solutions</a></li>
    <li><a href="#3-backend">3. Backend</a></li>
    <li class="lvl2"><a href="#31-migration-vers-nestjs">3.1 Migration vers NestJS</a></li>
    <li class="lvl2"><a href="#32-architecture-modulaire">3.2 Architecture modulaire</a></li>
    <li class="lvl2"><a href="#33-validation-et-sécurité">3.3 Validation et sécurité</a></li>
    <li class="lvl2"><a href="#34-maintenabilité">3.4 Maintenabilité</a></li>
    <li class="lvl2"><a href="#35-difficultés-rencontrées-et-solutions">3.5 Difficultés rencontrées et solutions</a></li>
    <li><a href="#4-conclusion">4. Conclusion</a></li>
    <li class="lvl2"><a href="#41-bilan">4.1 Bilan</a></li>
    <li class="lvl2"><a href="#42-perspectives">4.2 Perspectives</a></li>
</ul>

</div>

# 1. Introduction

## 1.1 Présentation du projet

UnlockIt est une plateforme web de distribution de jeux vidéo dématérialisés, s'inspirant des principales plateformes du marché telles que Steam, Instant Gaming ou Epic Games Store. Le projet a pour objectif de reproduire une partie de leurs fonctionnalités à travers une architecture full-stack moderne.

La première version du projet, durant la SAÉ 3.01, avait pour ambition de proposer une expérience complète autour de l'achat et de la gestion de jeux numériques. Les utilisateurs pouvaient consulter un catalogue de jeux, rechercher des produits, créer un compte, gérer leur panier d'achat, constituer une liste de souhaits et accéder à leur bibliothèque personnelle après l'achat.

L'objectif académique de cette première version était avant tout de nous confronter à la réalisation d'une application web de grande ampleur, nécessitant la conception d'un frontend moderne, d'une API backend ainsi que d'une base de données relationnelle relativement complexe. Ce projet nous a également permis d'expérimenter le travail en équipe, la gestion d'une architecture multi-couches et la mise en place de méthodologies de développement proches du monde professionnel.

<div class="card">

![Page d'accueil de UnlockIt V1](src/assets/old-homepage.png)

*Figure 1 – Capture de la page d'accueil de UnlockIt (SAÉ 3.01).*

</div>

D'un point de vue fonctionnel, UnlockIt (SAÉ 3.01) proposait déjà la majorité des fonctionnalités attendues pour une plateforme de distribution numérique :

* consultation du catalogue de jeux
* recherche et filtrage avancés
* authentification et gestion de compte
* système de panier et de wishlist
* historique d'achats
* récupération des clés d'activation
* système de commentaires et d'avis

Ces fonctionnalités ont permis de valider la faisabilité du projet et de produire une première version entièrement fonctionnelle.

<div class="card">

![Page produit de UnlockIt V1](src/assets/old-game-page.png)

*Figure 2 – Exemple de la page détaillée d'un jeu sur UnlockIt (SAÉ 3.01).*

</div>

L'architecture technique de cette première version reposait sur une séparation classique entre trois couches :

* un frontend développé avec **React**, **TypeScript** et **Vite**
* un backend développé en **PHP** suivant une architecture inspirée du modèle MVC
* une base de données **PostgreSQL** exploitant de nombreuses fonctionnalités natives, notamment les fonctions stockées et les triggers.

<div class="card">

<div class="mermaid-center" style="text-align:center;">

```mermaid
flowchart TB

    classDef front fill:#ffe9b3,stroke:#d1a84f,stroke-width:2px,color:#000;
    classDef back fill:#61dafb,stroke:#1b7aa6,stroke-width:2px,color:#000;
    classDef db fill:#ea77ff,stroke:#9d54b3,stroke-width:2px,color:#000;

    A["Frontend React"]:::front
    B["Backend (API PHP)"]:::back
    C["Database (PostgreSQL)"]:::db

    A -->|HTTP/REST| B
    B -->|JSON| A
    B -->|PDO| C
    C -->|SQL/PlpgSQL| B
```

</div>

*Figure 3 – Architecture simplifiée de UnlockIt (SAÉ 3.01).*

\* Si du code s'affiche à la place du schéma, rafraichissez la page.

</div>

Cette architecture nous a permis de développer rapidement un ensemble riche de fonctionnalités et de mieux appréhender les enjeux liés à la conception d’une application web complète. Toutefois, au fil de l’avancement du projet, plusieurs limites sont apparues. Le développement de nouvelles fonctionnalités devenait progressivement plus complexe, certains composants frontend mélangeaient logique métier et rendu visuel, et plusieurs parties du code manquaient d’homogénéité. L’absence d’outils d’analyse et de tests automatisés compliquait également la détection des régressions et l’optimisation des performances.

Bien que fonctionnelle et suffisamment robuste pour être présentée lors de la première soutenance, cette version s’apparentait davantage à un produit minimum viable (MVP) qu’à une base technique durable. Avec la montée en compétences de l’équipe, les parties les plus anciennes du code nous sont apparues comme insuffisamment structurées, parfois mal écrites, voire difficilement lisibles en comparaison des fonctionnalités plus récentes. Le projet tenait, mais ses fondations étaient fragiles. Pour envisager une évolution pérenne, une refonte devenait nécessaire.

Ces constats nous ont naturellement conduits à envisager une seconde itération du projet, non plus centrée sur l’ajout de fonctionnalités, mais sur une amélioration profonde de sa qualité technique et de son architecture.

## 1.2 Présentation des membres

### 1.2.1 Organisation

Notre équipe était composée de deux membres, chacun avec un domaine principal : le frontend pour l’un, le backend pour l’autre. Malgré cette répartition naturelle, notre manière de travailler n’a jamais été cloisonnée. Nous échangions en permanence sur nos avancées, nos idées, nos essais et nos ajustements, et chaque décision importante était discutée ensemble, même lorsqu’elle concernait un domaine attribué à l’autre. Cette communication continue nous a permis de conserver une vision commune du projet et d’assurer une cohérence globale entre toutes ses couches, du design de l’interface jusqu’à la structure de la base de données.

Pour organiser notre travail, nous nous appuyions sur trois outils complémentaires : Git pour le versionnement, Trello pour le suivi des tâches et Discord pour la communication quotidienne. Notre workflow Git était volontairement simple : nous ne travaillions pas avec des branches séparées, car nos fichiers ne se chevauchaient pas et les types étaient centralisés dans un module partagé compilé automatiquement. Cette approche, combinée à une communication fluide, nous a permis d’éviter les conflits et de maintenir un rythme de développement efficace. Nous nous synchronisions régulièrement sur l’avancement des fonctionnalités, en nous attendant mutuellement lorsque l’un avait besoin d’un ajustement côté front ou d’une nouvelle route côté back.

Lors des périodes de télétravail, nous travaillions dans le même salon vocal Discord, ce qui recréait une véritable proximité malgré la distance. Nous développions en direct, partagions nos écrans lorsque nécessaire et prenions même nos pauses ensemble. Cette dynamique a rendu le travail plus agréable et a renforcé notre coordination. Elle a également permis de résoudre rapidement les problèmes, d’ajuster les fonctionnalités au fur et à mesure et de maintenir une cohésion forte tout au long du projet.

### 1.2.2 Les membres

<div class="card">

<a href="https://github.com/Frozen1753" target="_blank">
    <h3>Frozen1753</h3>
</a>

**Compétences techniques**

- **Développement & Programmation :** Java • C • C++ • C# • Bash • Python
- **Développement Web :** JavaScript • TypeScript • React • Vite • Playwright • PHP • NestJS • TypeORM
- **Design & Interfaces :**  XAML • HTML • CSS • Figma
- **Bases de données :**  SQL • PostgreSQL
- **Réseaux & Systèmes :** TCP/IP • Cisco Packet Tracer • Windows • Linux
- **Outils & Environnements :** Visual Studio • IntelliJ • Git • GitHub • PowerBI • PhpMyAdmin • MySQL • Workbench • Docker

**Formation**  
Étudiant en 2ᵉ année de BUT Informatique (formation initiale)

**Rôles dans le projet**  
Frontend • UX/UI Design • Design graphique • Optimisation • Testing

</div>

<div class="card">

<a href="https://github.com/ElPotatoCorp" target="_blank">
    <h3>ElPotato</h3>
</a>

**Compétences techniques**

- **Développement & Programmation :** Rust • C • C++ • C# • Bash • Python
- **Développement Web :** JavaScript • TypeScript • React • PHP • Swagger • Vite • NestJS • TypeORM
- **Design & Interfaces :** XAML • XML • HTML • CSS
- **Bases de données :** SQL • PostgreSQL
- **Réseaux & Systèmes :** TCP/IP • Cisco Packet Tracer • Windows • Linux
- **Outils & Environnements :** Visual Studio • IntelliJ • Git • GitHub • PowerBI • PhpMyAdmin • MySQL • Workbench • Docker

**Formation**  
Étudiant en 2ᵉ année de BUT Informatique (formation initiale)

**Rôles dans le projet**  
Backend • Base de données • Documentation • Optimisation • Scripts

</div>

## 1.3 Pourquoi une refonte complète ?

À l'issue de la SAÉ 3.01, nous disposions d'une application fonctionnelle répondant à la majorité des objectifs initiaux. Malgré ce résultat satisfaisant, nous avions pleinement conscience des limites de notre implémentation. Une grande partie de l'architecture avait été construite progressivement, au fur et à mesure de l'ajout de nouvelles fonctionnalités et de notre montée en compétences durant le projet.

Avec le recul, certaines décisions techniques prises au début du développement ne correspondaient plus à nos besoins actuels. Plusieurs composants étaient devenus trop volumineux, certaines responsabilités étaient mal réparties et une partie du code était devenue difficile à maintenir. Ajouter une nouvelle fonctionnalité nécessitait parfois de modifier plusieurs zones de l'application, augmentant le risque d'introduire des régressions.

De plus, la première version du projet avait été développée avec un objectif principalement fonctionnel : produire une application complète dans le temps imparti. Des aspects plus avancés tels que l'optimisation des performances, le référencement, les tests automatisés, l'analyse des rendus React ou encore la mise en place d'une architecture frontend et backend plus moderne avaient volontairement été laissés de côté.

La SAÉ 4.01 nous a offert l'opportunité de revenir sur ce projet avec un regard plus critique et davantage d'expérience. Plutôt que d'ajouter de nouvelles fonctionnalités sur des fondations que nous jugions désormais fragiles, nous avons fait le choix de repartir de zéro.

Cette décision peut sembler radicale, mais elle nous a permis de repenser entièrement l'application :

* en adoptant une architecture plus propre et plus maintenable
* en améliorant les performances globales du site
* en modernisant les outils utilisés
* en introduisant des pratiques de développement plus professionnelles
* en préparant le projet à de futures évolutions

L'objectif de cette seconde version n'était donc pas simplement de produire un « UnlockIt plus complet », mais de transformer un premier prototype fonctionnel en une base technique plus robuste, plus cohérente et davantage orientée vers la qualité logicielle.

<div class="card">

![Évolution de UnlockIt entre la SAÉ 3.01 et la SAÉ 4.01](src/assets/placeholder-v1-v2-comparison.webp)

*Figure 4 – Passage d'un premier prototype fonctionnel à une refonte complète orientée qualité.*

</div>

Avant de présenter les changements apportés dans cette nouvelle version, il est nécessaire d'analyser plus en détail les principales limites de UnlockIt (SAÉ 3.01). Cette analyse permettra de comprendre les choix techniques effectués au cours de cette refonte et de justifier les différentes décisions présentées dans la suite de ce rapport.

## 1.4 Avertissements et déclarations

### **1.4.1 Utilisation de l’intelligence artificielle**

L’intelligence artificielle n’a été utilisée dans ce projet qu’à des fins ponctuelles et strictement encadrées. Elle a servi principalement à automatiser certaines tâches répétitives, à reformuler ou clarifier certains passages, et surtout à répondre à des questions techniques précises lorsque cela permettait d’éviter de longues recherches documentaires. Les sollicitations de l’IA portaient essentiellement sur des interrogations ciblées du type : « Existe‑t‑il une manière plus propre de faire X en Y ? » ou « Comment aborder tel problème sans passer par telle solution ? ». Dès lors qu’une réponse pouvait être trouvée rapidement dans la documentation officielle, nous privilégions systématiquement cette voie plutôt que l’IA.

Toutes les suggestions générées ont été systématiquement vérifiées, corrigées ou réécrites par les membres de l’équipe, et aucune partie du code métier, des algorithmes ou des décisions techniques n’a été produite automatiquement sans supervision humaine. Toute erreur restante sera donc authentiquement humaine, probablement due à notre maladresse ou à notre incompétence personnelle.

### **1.4.2 Images, médias et éléments graphiques**

L’ensemble des éléments visuels présents dans le projet — images, icônes, illustrations, SVG, animations ou compositions graphiques — a été soit réalisé manuellement, soit récupéré depuis des plateformes proposant des licences autorisant explicitement leur utilisation. Aucun média n’a été intégré sans vérification préalable de ses droits d’usage. Les ressources graphiques externes ont été sélectionnées avec soin afin de respecter les contraintes légales et d’assurer une cohérence esthétique avec l’identité visuelle du projet.

### **1.4.3 Ressources externes et données utilisées**

Toutes les données exploitées dans l’application proviennent de sources publiques ou ouvertes. Les informations relatives aux jeux vidéo, par exemple, ont été récupérées via l’API officielle de Steam, qui met ces données à disposition de manière publique. Elles ont ensuite été retraitées, filtrées et enrichies pour améliorer leur qualité et leur pertinence, ce qui explique leur quantité réduite par rapport à la version précédente du projet. De la même manière, les bibliothèques logicielles utilisées dans le code sont exclusivement des solutions publiques, open‑source ou librement accessibles, sélectionnées pour leur fiabilité et leur compatibilité avec les besoins du projet.

# 2. Frontend

## 2.1 Refonte de l'architecture React

### 2.1.1 Le problème

L’un des objectifs majeurs de cette seconde version d’UnlockIt a été d’améliorer et de clarifier l’architecture du frontend. La première version reposait déjà sur une base solide : une structure modulaire, organisée autour de composants réutilisables, de pages fonctionnelles et de dossiers bien séparés. Cette organisation était tout à fait exploitable et scalable, mais elle montrait ses limites à mesure que le projet grandissait.

Le principal défi ne venait donc pas d’un manque de modularité, mais plutôt de la **classification des composants et des fichiers**. Il devenait parfois difficile de déterminer où placer un nouvel élément :  
- un composant était‑il propre au projet ou suffisamment générique pour être réutilisable ailleurs ?  
- un hook relevait‑il de la logique métier, d’un helper ou d’un validateur ?  
- où ranger les refactors liés à l’API sans mélanger logique et présentation ?  
- comment éviter que certains dossiers deviennent des “fourre‑tout” au fil du temps ?  

Ces zones grises entraînaient des hésitations, des réorganisations ponctuelles et une perte de cohérence dans la structure globale.

La refonte n’a donc pas consisté à repartir de zéro, mais à rendre l’architecture plus explicite, plus cohérente et plus prévisible. Plusieurs dossiers ont été introduits ou repensés pour clarifier les responsabilités et éviter les ambiguïtés :

- <code class="c">layout/</code> regroupe désormais tous les composants qui encadrent ou se superposent aux pages (header, footer, background, panneau de debug, etc.). Le layout est ensuite appliqué globalement dans <code class="c">App.tsx</code>, ce qui simplifie la structure des pages.  
- <code class="c">common/</code> accueille les composants génériques et réutilisables indépendamment du projet : systèmes de skeleton, modals, alertes, providers, etc. Ce sont des briques transversales que l’on pourrait réutiliser dans d’autres applications.  
- <code class="c">api/</code> centralise toute la logique liée aux appels API : hooks dédiés, services, stores Zustand, types, mocks, et l’instance Axios. Les composants n’ont plus aucune logique API : ils se contentent d’appeler un hook métier.  
- <code class="c">utils/</code> regroupe tous les refactors logiques qui ne relèvent pas de l’API : formatteurs, validateurs, helpers, hooks transversaux, stores globaux (langue, thème, etc.).  
- <code class="c">public/media/</code> remplace l’ancien dossier <code class="c">images/</code>, qui servait parfois de fourre‑tout. Les médias sont désormais classés par type (images, vidéos, icônes, etc.), ce qui améliore la lisibilité et la maintenance.

L’objectif global était de **lever les ambiguïtés**, d’améliorer la lisibilité et de rendre l’architecture plus intuitive pour toute l’équipe. Cette nouvelle organisation facilite aujourd’hui l’intégration de nouvelles fonctionnalités, limite les risques de confusion et renforce la cohérence du projet sur le long terme.

### 2.1.2 Nouvelle architecture 

<div class="before">

<h3>Avant</h3>

<details class="accordion">
<summary>Voir plus d'informations</summary>

```mermaid
treeView-beta
    "frontend"
        "index.html"
        "vite.config.ts"
        "package.json"
        "public"
            "fonts"
            "images"
        "src"
            "components"
            "features"
            "pages"
            "styles"
            "App.tsx"
            "main.tsx"
```

Les composants pouvaient ressembler à ceci :

```mermaid
treeView-beta
    "nom-composant"
        "nom-sous-composant-1"
        "nom-sous-composant-2"
        "nomComposant.module.css"
        "NomComposant.tsx"
        "fallback-api-offline-1.json"
        "fallback-api-offline-2.json"
```


</details>

</div>

<div class="after">

<h3>Après</h3>

<details class="accordion">
<summary>Voir plus d'informations</summary>


```mermaid
treeView-beta
    "frontend"
        "index.html"
        "vite.config.ts"
        "package.json"
        "public"
            "fonts"
            "media"
                "img"
                "vid"
                "ico"
                "autres"
        "src"
            "components"
                "layout"
                "ui"
                "common"
            "features"
            "pages"
            "styles"
            "api"
                "hook"
                "mock"
                "services"
                "stores"
                "types"
                "axios.instance.ts"
            "utils"
                "formatters"
                "helpers"
                "hooks"
                "stores"
                "validators"
            "App.tsx"
            "main.tsx"
```

La structure d'un composant n'a pas réellement changer, sauf que cette fois ci, il n'y a pas de fallback locaux car tout marche bien :

```mermaid
treeView-beta
    "nom-composant"
        "nom-sous-composant-1"
        "nom-sous-composant-2"
        "nomComposant.module.css"
        "NomComposant.tsx"
```

</details>

</div>

## 2.2 Référencement et indexation

### 2.2.1 React Helmet

Lors du développement de la première version de UnlockIt, très peu d’attention avait été portée aux problématiques de référencement naturel. Comme dans la plupart des applications React, l’architecture reposait sur le principe d’une **Single Page Application (SPA)** : un unique fichier <code class="c">index.html</code> sert de point d’entrée, puis React prend le relais pour générer et mettre à jour l’interface.

Le fonctionnement suit une chaîne simple :

- **index.html :** contient uniquement la structure minimale et un conteneur <code class="c">\<div id="root"\></code>.
- **main.tsx :** monte l’application React dans <code class="c">#root</code>.
- **App.tsx :** constitue le composant racine et gère le routage.
- **Composants :** chaque page ou section du site est rendue dynamiquement à l’intérieur de <code class="c">App</code>.

Dans ce modèle, changer de page ne provoque pas le chargement d'un nouveau document HTML. Seul le contenu affiché à l'écran est modifié par JavaScript, ce qui empêche naturellement chaque page de disposer de ses propres métadonnées.

<details class="accordion">
<summary>Exemple de SPA React</summary>

```mermaid
treeView-beta
    "index.html"
    "public"
        "favicon.svg"
    "src"
        "main.tsx"
        "App.tsx"
        "App.css"
        "assets"
            "logo.svg"
            "..."
        "components"
            "Button"
            "Navbar"
            "..."
        "..."
```

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    ...
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

```tsx
// main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

```tsx
// App.tsx
export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />}/>
            <Route ... />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}
```

</details>

En nous intéressant davantage au fonctionnement des moteurs de recherche et aux recommandations fournies par Lighthouse, nous avons constaté que l'absence de métadonnées adaptées à chaque page pénalisait le référencement du site ainsi que le partage de son contenu sur les réseaux sociaux.

Pour répondre à cette problématique, nous avons intégré la bibliothèque **React Helmet Async**, qui permet de modifier dynamiquement le contenu de l'élément <code class="c">\<head\></code> en fonction de la page actuellement affichée.

Plutôt que de dupliquer les mêmes balises dans chaque composant, nous avons créé un composant réutilisable nommé <code class="c">UnlockItHelmet</code>, appliquant le principe DRY (Don't Repeat Yourself).  Celui-ci centralise la gestion :

* du titre de la page ;
* de la description ;
* des balises <code class="c">OpenGraph</code> ;
* des métadonnées Twitter ;
* de l'URL canonique ;
* des consignes d'indexation.

```tsx
<UnlockItHelmet
    title="Accueil"
    path="/"
/>
```

À partir de cette simple déclaration, le composant génère automatiquement l'ensemble des métadonnées nécessaires.

<details class="accordion">
<summary>Résultats</summary>

```html
<head>
    <...>
    <title>UnlockIt – Accueil</title>
    <meta name="description" content="UnlockIt : achetez vos jeux PC moins cher. Clés Steam, Origin et Uplay livrées instantanément au meilleur prix.">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="UnlockIt – Accueil">
    <meta ...>
    <meta name="twitter:card" content="summary_large_image">
    <meta ...>
    <link rel="canonical" href="https://unlock-it.com/">
    <...>
</head>
```

</details>

L'approche devient encore plus intéressante pour les pages dynamiques. Une recherche sur le terme <code class="c">test</code> génère automatiquement un titre et une description adaptés au contenu affiché.

```tsx
<UnlockItHelmet
    title={`Recherche : ${term}`}
    description={`Résultats de recherche pour "${term}"`}
    path={`/search/${term}`}
/>
```

<details class="accordion">
<summary>Résultats</summary>

```html
<head>
    <...>
    <title>UnlockIt – Recherche : test</title>
    <meta name="description" content="Résultats de recherche pour &quot;test&quot; sur UnlockIt. Trouvez vos jeux PC au meilleur prix.">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="UnlockIt – Recherche : test">
    <meta ...>
    <meta name="twitter:card" content="summary_large_image">
    <meta ...>
    <link rel="canonical" href="https://unlock-it.com/search/test">
    <...>
</head>
```

</details>

Cette amélioration, relativement simple à mettre en œuvre, rapproche davantage UnlockIt du fonctionnement d'un véritable site de production. Elle améliore les scores de référencement fournis par Lighthouse, facilite l'indexation par les moteurs de recherche et permet également un meilleur rendu lors du partage des pages sur les réseaux sociaux.

Au-delà de l'aspect technique, cette démarche nous a permis de mieux comprendre le fonctionnement du web moderne et de découvrir des problématiques que nous n'avions encore jamais abordées dans le cadre des précédentes SAÉ.

---

### 2.2.2 Robots.txt

Lors des différents audits réalisés avec Lighthouse, nous avons découvert plusieurs recommandations liées au référencement naturel et à l'indexation du site. Parmi celles-ci figurait la présence d'un fichier <code class="c">robots.txt</code>, mécanisme que nous ne connaissions pas avant cette refonte.

En nous documentant davantage, notamment à l'aide de la documentation officielle et de l'intelligence artificielle, nous avons découvert qu'il s'agissait d'un fichier standard du Web permettant de communiquer certaines informations aux robots d'exploration des moteurs de recherche.

Encore une fois, même si UnlockIt reste un projet académique et n’a pas vocation à être réellement indexé (surtout avec le marché actuel et des géants comme Steam ou Instant Gaming… on ne ferait pas long feu), nous avons tout de même souhaité reproduire le fonctionnement d’une application de production en mettant en place ce fichier.

Le fichier <code class="c">robots.txt</code> est placé dans le dossier <code class="c">public</code> afin d'être directement accessible à l'adresse :

<a>https://unlock-it.com/robots.txt</a>

Son contenu a été enrichi afin de refléter les bonnes pratiques d’un site e‑commerce moderne :

```txt
User-agent: *
Allow: /

Disallow: /settings
Disallow: /login
Disallow: /register
Disallow: /purchases
Disallow: /purchases/
Disallow: /purchases/*
Disallow: /wishlist

Sitemap: https://unlock-it.com/sitemap.xml
```

Ce fichier indique que l'ensemble du site peut être exploré, à l’exception des pages sensibles.
Nous avons choisi de bloquer explicitement :

* <code class="c">/login</code>, <code class="c">/register</code> et <code class="c">/settings</code> : pages strictement personnelles, sans intérêt SEO.
* <code class="c">/wishlist</code> : page liée au compte utilisateur, non destinée à être publique.
* <code class="c">/purchases</code> et <code class="c">/purchases/:id</code> : pages critiques contenant l’historique d’achat et les clés de jeux.

Même si ces pages sont protégées côté serveur, les exposer aux robots pourrait révéler des identifiants sensibles ou provoquer une indexation accidentelle, ce qui serait contraire aux bonnes pratiques de sécurité et de confidentialité.

Ainsi, le fichier robots.txt contribue à protéger les zones privées du site tout en guidant correctement les moteurs de recherche vers les pages réellement destinées à être explorées.

<details class="accordion">
<summary>Pourquoi le placer dans public ?</summary>

Le dossier <code class="c">public</code> de Vite contient les ressources statiques qui doivent être servies directement par le serveur sans être traitées par le bundler. Les fichiers <code class="c">robots.txt</code>, <code class="c">sitemap.xml</code> ou encore <code class="c">favicon.ico</code> sont donc naturellement placés dans ce répertoire afin d'être accessibles depuis la racine du site.

```
public/
├── favicon.ico
├── robots.txt
└── sitemap.xml
```

</details>

L'ajout de ce fichier participe à rendre le projet plus conforme aux standards actuels du Web et nous a permis de mieux comprendre le fonctionnement de l'exploration et de l'indexation des sites internet.

Le fichier <code class="c">robots.txt</code> ne garantit pas qu'une page sera indexée ou non par un moteur de recherche. Il constitue uniquement une convention permettant de donner des indications aux robots d'exploration.

---

### 2.2.3 Sitemap XML

Si le fichier <code class="c">robots.txt</code> indique aux robots d'exploration où trouver certaines informations, le fichier <code class="c">sitemap.xml</code> leur fournit quant à lui la liste des pages disponibles sur le site ainsi que certaines informations complémentaires concernant leur importance et leur fréquence de mise à jour.

<details class="accordion">
<summary>Grosso modo</summary>

> <code class="c">robots.txt</code> dit aux robots "où regarder".
>
> <code class="c">sitemap.xml</code> dit aux robots "quelles pages existent".

</details>

Lors de nos recherches sur le référencement naturel et après plusieurs audits réalisés avec Lighthouse, nous avons découvert qu'il était courant pour les sites de production de mettre à disposition un sitemap afin de faciliter leur indexation.

Nous avons donc décidé d'ajouter un fichier <code class="c">sitemap.xml</code> à la racine du projet, également placé dans le dossier <code class="c">public</code> afin qu'il soit accessible à l'adresse :

<a>https://unlock-it.com/sitemap.xml</a>

Le sitemap contient les principales pages publiques du site, accompagnées de plusieurs informations :

* <code class="c">loc</code> : l'adresse de la page ;
* <code class="c">changefreq</code> : la fréquence estimée des modifications ;
* <code class="c">priority</code> : l'importance relative de la page au sein du site.

L'extrait suivant présente quelques entrées du fichier :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://unlock-it.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://unlock-it.com/search</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>

  ...

  <url>
    <loc>https://unlock-it.com/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.2</priority>
  </url>

  <url>
    <loc>https://unlock-it.com/login</loc>
    <changefreq>yearly</changefreq>
    <priority>0.1</priority>
  </url>

  ...

</urlset>
```

Concernant les pages dynamiques, même si UnlockIt (SAÉ 4.01) ne comporte actuellement qu’une soixantaine de jeux issus de l’API Steam, l’application a été pensée pour évoluer. Dans un contexte réel, un site de vente de licences pourrait facilement proposer **plusieurs milliers de jeux**, chacun accessible via une URL de type : <code class="c">/games/:slug</code>

Dans ce cas, il serait évidemment **impossible et totalement irréaliste** de maintenir manuellement une entrée dans le sitemap pour chaque jeu.  
C’est d’ailleurs pour cette raison que les sites e‑commerce professionnels (Steam, Instant Gaming, Eneba, Amazon…) génèrent leurs sitemaps automatiquement, à l’aide d’un script.

Un tel script peut être exécuté :

* à partir de la base de données (pour lister tous les jeux disponibles)
* à chaque déploiement
* ou encore une fois par jour, afin de refléter les ajouts ou suppressions de produits

Cette approche garantit que le sitemap reste toujours à jour, sans intervention manuelle, même lorsque le catalogue atteint plusieurs milliers d’entrées.  
Le sitemap actuel d’UnlockIt ne contient donc que les pages statiques et publiques, mais sa structure a été pensée pour être compatible avec une génération dynamique future, comme cela se ferait dans un environnement de production.

Cette réflexion autour du sitemap nous a permis de mieux comprendre les mécanismes d’indexation modernes et de découvrir un aspect du développement web que nous n’avions encore jamais abordé au cours des précédentes SAÉ.  
Au‑delà de son utilité immédiate, cette fonctionnalité a constitué un excellent exercice pour adopter une démarche plus professionnelle et se rapprocher du fonctionnement réel d’une application web en production.

## 2.3 Optimisation des performances

L’optimisation des performances a constitué l’un des principaux axes de travail de cette nouvelle version de l’application. Lors du développement de la SAÉ 3.01, notre démarche reposait essentiellement sur une évaluation subjective : tant que l’interface semblait fluide et réactive, nous considérions que les performances étaient satisfaisantes. Avec davantage d’expérience, nous avons compris que cette approche était insuffisante. Une application peut en effet paraître rapide tout en exécutant des traitements inutiles, en chargeant des ressources superflues ou en déclenchant des rendus React non nécessaires.

Afin d’adopter une démarche plus rigoureuse et professionnelle, nous avons choisi de mesurer avant d’optimiser. Nous avons ainsi intégré plusieurs outils de profilage, d’audit et d’analyse permettant d’identifier objectivement les points de ralentissement, de comprendre leur origine et de valider l’impact réel des optimisations apportées. Cette approche nous a également permis de mieux appréhender le fonctionnement interne de React, du moteur JavaScript et du navigateur, révélant des problématiques que l’on ne perçoit pas sans instrumentation adaptée.

Les outils utilisés couvrent différents aspects de la performance : certains se concentrent sur le rendu React, d’autres analysent le comportement global du navigateur, tandis que des outils comme Lighthouse évaluent la qualité générale de l’application (accessibilité, bonnes pratiques, poids des ressources, etc.). Les sections suivantes détaillent ces outils et expliquent comment ils nous ont guidés dans l’amélioration de l’application.

---

### 2.3.1 Profilage et optimisation du rendu React

Au cours du développement de la seconde version de UnlockIt, nous nous sommes rapidement aperçus qu'il était difficile de savoir précisément quels composants React étaient réaffichés et à quel moment.

Dans une application de petite taille, ces rendus supplémentaires ont généralement peu d'impact. Cependant, lorsque le nombre de composants augmente et que certaines pages deviennent plus complexes, ces réaffichages inutiles peuvent progressivement dégrader les performances de l'application.

Nous avons donc cherché à mieux comprendre le fonctionnement interne de React en utilisant plusieurs outils de diagnostic et de profilage.

---

#### 2.3.1.1 React Scan

L’outil principal utilisé durant cette phase a été **React Scan**, un utilitaire léger permettant de visualiser en temps réel les composants qui se réaffichent.  
Son fonctionnement est extrêmement simple : une seule ligne suffit pour l’activer.

```html
<!-- placé dans le <head> du index.html -->
<script
  crossorigin="anonymous"
  src="//unpkg.com/react-scan/dist/auto.global.js">
</script>
```

React Scan met en évidence :

- les composants réaffichés ;
- la fréquence des re-rendus ;
- les zones de l’interface les plus coûteuses.

<div class="card">

**Figure X – Exemple de diagnostic avec React Scan.**  
*(placeholder capture d’écran)*

</div>

L’outil nous a permis d’identifier rapidement plusieurs comportements inattendus, notamment liés à **React Router**.

En effet, nous avons observé que certains composants se réaffichaient lors de simples navigations, même lorsque leur contenu ne dépendait pas de l’URL.  
Par exemple :

- les composants contenant des <code class="c">\<Link\></code> étaient réaffichés à cause de la mise à jour du contexte interne de React Router ;
- certains layouts se réaffichaient alors qu’ils ne dépendaient d’aucune donnée dynamique ;
- des composants structurels (header, footer…) étaient recalculés inutilement à chaque changement de route.

Ces observations nous ont permis de mieux comprendre le fonctionnement interne de React, notamment :

- la propagation des changements d’état ;
- l’impact des contextes globaux ;
- le coût des composants “structurels” dans l’arbre React ;
- l’importance de stabiliser les props et les références.

Suite à ces diagnostics, nous avons introduit l’utilisation de <code class="c">React.memo()</code> pour stabiliser certains composants structurels comme le header, le footer ou le layout global.

```tsx
export const Layout = memo(() => {
  return (
    <div>
      <Header />

      <main>
        <Background />
        <Outlet />
      </main>

      <Footer />
    </div>
  );
});
```

<div class="card">

**Figure X – Exemple d'avant-après.**  
*(placeholder capture d’écran)*

</div>

Cette optimisation a permis :

- d’éviter des re-rendus inutiles ;
- de réduire le coût global du rendu sur les pages complexes ;
- d’améliorer la fluidité générale de l’application.

Au-delà des optimisations, React Scan nous a surtout permis de **visualiser concrètement** ce qui se passe dans React :

- pourquoi certains composants se réaffichent ;
- comment les changements d’état se propagent ;
- quels composants sont réellement coûteux.

Cela nous a aidés à adopter de meilleurs réflexes lors de la conception de nouveaux composants, notamment en limitant les dépendances inutiles et en structurant plus clairement les responsabilités de chaque élément.

Sinder les grand composants aide aussi, par exemple avoir 1 page = 1 composant veut dire que si de la logique TS dois faire apparaitre une dive a une toute petite section de la page alors le composant entier sera rendu. On fais attention a casser un composant en plus petit quand il atteint un grand nombre de ligne ou beaucoup de logique, ca rends ca plus lisible et littérelement plus performant!

```
nom-composant/
├── nom-sous-composant-1/         # Décomposition en sous-composants,
├── nom-sous-composant-2/         # Peuvent eux-même avoir des sous-composants,
├── nom-sous-composant-n/         # Autant de sous-composants que nécessaire, etc.
├── nomComposant.module.css       # Style local, grâce aux CSS Modules
└── NomComposant.tsx              # Composant principal(logique + rendu)
```

---

#### 2.3.1.2 React Developer Tools

En complément de React Scan, nous avons utilisé **React Developer Tools**, disponible sous la forme d'une extension pour les navigateurs Chromium et Firefox.

Cet outil nous a permis d'inspecter :

- l'arbre des composants ;
- les propriétés et états en temps réel ;
- les contextes React ;
- certaines causes de re-rendus grâce à l’onglet *Profiler*.

<div class="card">

**Figure X – Analyse de l'arbre des composants avec React Developer Tools.**  
*(placeholder capture d’écran)*

</div>

React Developer Tools s’est révélé particulièrement utile pour comprendre l’impact de certains états globaux (comme ceux provenant de notre store) et vérifier que certaines optimisations produisaient bien les effets attendus.

---

#### 2.3.1.3 React Doctor

Nous avons également étudié l’utilisation de **React Doctor**, un outil plus avancé capable de détecter automatiquement :

- les re-rendus inutiles ;
- certaines dépendances incorrectes dans les hooks ;
- des composants potentiellement trop coûteux.

Cependant, l’outil étant encore relativement récent et parfois instable, nous avons préféré ne pas l’intégrer directement au projet.

Cette phase de veille technologique reste néanmoins intéressante, car elle nous a permis de découvrir de nouveaux outils de diagnostic qui pourront être envisagés dans de futurs projets.

---

### 2.3.2 Lighthouse

Lighthouse a été utilisé tout au long du développement afin de mesurer plusieurs indicateurs :

* performances
* accessibilité
* référencement
* bonnes pratiques.

Ces mesures nous ont permis de valider objectivement l'impact de certaines optimisations et de guider les améliorations à apporter au site.


<div class="card">

![Score de l'audit Lighthouse](src/assets/lighthouse-audit.png)

Figure X – Exemple d'audit de performances réalisé avec Lighthouse.

Les critiques qui reviennent sont :
- **Accessibility** : Certains contrastes de couleur ne sont pas respecté
- **Performance** : Les fonts locales sont trop nested par rapport a ce qu'il est conseillé
- **Best Practices** : Des warnings sont log, mais ces derniers viennent malheresement d'autre api comme celle de youtube qui nous permet de lire les trailer pour les jeux, on ne peux pas les retirer.

Les scores fluctuent legerement en fonction de la page et des circonstances de l'audit (surtout le Performance), mais en build les score restent généralement toujours au dessus de 95.

<details class="accordion">
<summary>Les 4 notations </summary>

// TODO expliquer + des exemples

</details>

</div>


---

### 2.3.3 Firefox Profiler

En complément de Lighthouse, Firefox Profiler a été utilisé afin d'obtenir une vision plus détaillée du comportement de l'application.

L'outil permet notamment d'analyser :

* le temps passé dans certaines fonctions
* le coût des opérations JavaScript
* les phases de rendu
* certaines opérations particulièrement coûteuses.

Cette analyse a été particulièrement utile lors de l'optimisation de certaines animations et de l'arrière-plan du site.

---

### 2.3.4 Lazy Loading et Suspense

L'une des principales optimisations apportées concerne le chargement des pages.

Dans la première version du projet, une partie importante du code JavaScript était chargée dès l'ouverture du site. Cette approche augmentait inutilement la taille du bundle initial.

La seconde version utilise désormais <code class="c">React.lazy</code> et <code class="c">Suspense</code> afin de charger certaines pages uniquement lorsqu'elles sont réellement nécessaires.

Cette technique de découpage du code permet de :

* réduire le temps de chargement initial
* diminuer la quantité de JavaScript téléchargée
* améliorer les scores de performance
* offrir une expérience plus fluide à l'utilisateur.

<div class="card">

![Code splitting](src/assets/lazy-loading-placeholder.webp)

*Figure X – Illustration du chargement différé des pages.*

</div>

---

### 2.3.5 PixiJS

Le système d'arrière-plan du site a été entièrement réécrit à l'aide de PixiJS.

Cette bibliothèque permet de s'appuyer sur l'accélération matérielle du navigateur afin de produire des animations plus fluides et moins coûteuses en ressources.

L'utilisation de PixiJS a également été l'occasion d'expérimenter de nouvelles technologies et d'approfondir notre compréhension du rendu graphique dans un environnement web.

<div class="card">

![Background PixiJS](src/assets/pixijs-background-placeholder.webp)

*Figure X – Nouvel arrière-plan développé avec PixiJS.*

</div>

---

### 2.3.6 Terser

// TODO parler de terser

---

## 2.4 Refonte graphique

### SVGR

La refonte du frontend a également été l'occasion de revoir une partie de l'identité visuelle du projet.

Plusieurs éléments graphiques ont été redessinés et certaines ressources PNG ont été remplacées par des équivalents SVG. Cette démarche permet de réduire significativement le poids des ressources tout en améliorant leur qualité d'affichage sur les écrans haute définition.

Parallèlement, plusieurs composants ont été entièrement repensés afin d'offrir une interface plus cohérente et plus homogène.

<div class="card">

![Ancien et nouveau design](src/assets/redesign-comparison-placeholder.webp)

*Figure X – Comparaison entre certains composants avant et après la refonte.*

</div>

---

## 2.5 Nouvelle couche API Frontend

L'un des changements les plus importants de cette refonte concerne la manière dont le frontend communique avec le backend.

Dans la première version, plusieurs composants réalisaient directement leurs appels réseau, mélangeant parfois logique métier, gestion des erreurs et rendu visuel.

La seconde version introduit une véritable couche d'abstraction composée :

* de hooks métiers
* de services d'accès aux données
* de modèles de données partagés.

Cette architecture permet d'obtenir un code plus lisible, plus facilement testable et beaucoup plus simple à maintenir.

Elle facilite également l'écriture de tests automatisés et réduit fortement le couplage entre l'interface utilisateur et l'API.

### Avant / Après la refonte

<div class="before">

### Avant

<details class="accordion">
<summary>Voir plus d'informations</summary>

```tsx
const onSubmit = async (data: FormData) => {
    setErrorMessage(null);
    setStatus("idle");

    if (!isStrong) {
        setStatus("error");
        setErrorMessage("Le mot de passe ne respecte pas les critères de sécurité");
        return;
    }

    try {
        const payload: any = {
            username: data.username,
            password: data.password,
        };

        if (data.contactType === "email") {
            payload.email = data.email;
        } else {
            payload.phone_wzc = data.phone_wzc;
            payload.phone_number = data.phone_number;
        }

        const res = await fetch(`/api/auth/register`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            setStatus("success");
            reset();
            navigate('/');
            window.location.reload();
        } else if (res.status === 403) {
            throw new Error("Un utilisateur avec ces informations existe déjà");
        } else {
            throw new Error(payload.message || "Échec de l'inscription");
        }
    } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || "Erreur d'inscription");
    }
};
```

L'architecture de la première version était principalement orientée vers la mise en place rapide des fonctionnalités.

</details>

</div>

<div class="after">

### Après

<details class="accordion">
<summary>Voir plus d'informations</summary>

```tsx
const onSubmit = async (data: FormData) => {
    try {
      await authRegister(data.username, data.email, data.password);

      navigate("/login");
    } catch (err: any) {
      setError("root", { message: err.message ?? "Erreur d'inscription." });
    }
};
```
```ts
import { api } from "../axios.instance";

export const authService = {
    {...}

    register: async (username: string, email: string, password: string) => {
        try {
            await api.post("/auth/register", { username, email, password });
        } catch (err: any) {
            const s = err.response?.status;

            if (s === 400) throw { message: "Données invalides." };
            if (s === 409) throw { message: "Email ou nom d'utilisateur déjà utilisé." };
            if (s === 429) throw { message: "Trop de tentatives. Réessayez plus tard." };
            throw { message: "Erreur serveur." };
        }
    }

    {...}
};
```

L'architecture actuelle privilégie la séparation des responsabilités, les performances et la maintenabilité.

</details>

</div>


<details class="accordion">
<summary>Voir le schéma</summary>

```mermaid
flowchart LR

    %% ========= Définition des styles =========
    classDef react fill:#61dafb,stroke:#1b7aa6,stroke-width:2px,color:#000;
    classDef hook fill:#b3e5ff,stroke:#4fa3d1,stroke-width:2px,color:#000;
    classDef service fill:#ffe9b3,stroke:#d1a84f,stroke-width:2px,color:#000;
    classDef backend fill:#ffb3b3,stroke:#d14f4f,stroke-width:2px,color:#000;
    classDef db fill:#c6ffb3,stroke:#4fd14f,stroke-width:2px,color:#000;
    classDef cache fill:#fff2b3,stroke:#d1c24f,stroke-width:2px,color:#000;
    classDef log fill:#d6b3ff,stroke:#7a4fd1,stroke-width:2px,color:#000;
    classDef external fill:#e0e0e0,stroke:#999,stroke-width:2px,color:#000;

    %% ========= Frontend =========
    subgraph FE[Frontend]
        A[Composant React]:::react
        B[Hook métier]:::hook
        C[Service API]:::service
    end

    %% ========= Backend =========
    subgraph BE[NestJS Backend]
        D[Controller]:::backend
        E[Service]:::backend
        F[Repository]:::backend
    end

    %% ========= Stockage =========
    G[(PostgreSQL)]:::db
    R[(Redis Cache)]:::cache

    %% ========= Logs =========
    L[Logger]:::log

    %% ========= Service externe =========
    X[Service Auth externe]:::external

    %% ========= Flux principal =========
    A e1@-->|Appel logique| B
    B e2@-->|Appel API| C
    C e3@-->|HTTP| D
    D e4@-->|Appel interne| E
    E e5@-->|Requête DB| F
    F e6@-->|SQL| G

    %% ========= Flux secondaires =========
    C e7@-->|Token| X
    E e8@-->|Cache| R
    E e9@-.->|Logs| L

    %% ========= Styles des courbes =========
    e1@{ curve: linear }
    e2@{ curve: linear }
    e3@{ curve: stepBefore }
    e4@{ curve: stepBefore }
    e5@{ curve: linear }
    e6@{ curve: linear }
    e7@{ curve: natural }
    e8@{ curve: stepAfter }
    e9@{ curve: natural }

    %% ========= Styles des liens =========
    linkStyle 0 stroke:#1b7aa6,stroke-width:2px
    linkStyle 1 stroke:#4fa3d1,stroke-width:2px
    linkStyle 2 stroke:#d1a84f,stroke-width:2px
    linkStyle 3 stroke:#d14f4f,stroke-width:2px
    linkStyle 4 stroke:#d14f4f,stroke-width:2px
    linkStyle 5 stroke:#4fd14f,stroke-width:2px
    linkStyle 6 stroke:#999,stroke-width:2px
    linkStyle 7 stroke:#d1c24f,stroke-width:2px
    linkStyle 8 stroke:#7a4fd1,stroke-width:2px,stroke-dasharray:4 4
```
\* Si seul le code du schéma s'affiche, rafraichissez la page pour voir le schéma. 

</details>

---

## 2.6 Tests automatisés

La première version du projet reposait principalement sur des tests manuels. Cette approche devenait rapidement chronophage à mesure que le nombre de fonctionnalités augmentait.

Afin de sécuriser davantage le développement, nous avons intégré Playwright et mis en place plusieurs scénarios automatisés couvrant les fonctionnalités essentielles du site.

Les tests permettent notamment de vérifier :

* l'authentification
* la navigation
* la gestion du panier
* la wishlist
* l'historique d'achats
* certains parcours utilisateurs critiques.

<div class="card">

![Tests Playwright](src/assets/playwright-placeholder.webp)

*Figure X – Exemple d'exécution d'un scénario de tests automatisés.*

</div>

L'introduction de ces tests constitue un véritable gain de temps lors du développement et réduit considérablement le risque de réintroduire d'anciens bugs.

---

## 2.7 Difficultés rencontrées et solutions

La principale difficulté rencontrée durant cette refonte a été de déterminer jusqu'où pousser la reconstruction de l'application. Repartir de zéro impliquait de réimplémenter de nombreuses fonctionnalités déjà existantes, tout en cherchant à améliorer leur qualité.

L'introduction de nouveaux outils, l'optimisation des performances et la réorganisation complète de l'architecture ont également nécessité une importante phase d'apprentissage.

Malgré ces difficultés, cette refonte nous a permis d'acquérir une meilleure compréhension des bonnes pratiques de développement frontend et de construire une base technique beaucoup plus saine pour les futures évolutions de UnlockIt.

# 3. Backend

## 3.1 Migration vers NestJS

...

## 3.2 Architecture modulaire

```mermaid
flowchart LR

Frontend
--> Controller

Controller
--> Service

Service
--> Repository

Repository
--> PostgreSQL
```

## 3.3 Validation et sécurité

...

## 3.4 Maintenabilité

...

## 3.5 Difficultés rencontrées et solutions

...

# 5. Conclusion

## 5.1 Bilan

...

## 5.2 Perspectives

...