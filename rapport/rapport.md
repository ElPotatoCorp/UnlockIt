<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="hljs.css">

<div class="cover-page">

<img src="./assets/logo-unlockit.svg" class="logo" alt="UnlockIt Logo">

# UnlockIt

## Rapport Qualité et Refonte Architecturale

### Frozen1753 & ElPotato

BUT Informatique

<img src="./assets/cover-homepage.webp" class="cover-image" alt="Capture UnlockIt">

</div>

<div class="page-break"></div>

# Sommaire

<div class="toc">

- [1. Introduction](#1-introduction)
- [2. Analyse de l'ancien projet](#2-analyse-de-lancien-projet)
- [3. Frontend](#3-frontend)
- [4. Backend](#4-backend)
- [5. Conclusion](#5-conclusion)

</div>

# 1. Introduction

## 1.1 Présentation du projet

UnlockIt est une plateforme de distribution de jeux vidéo dématérialisés inspirée des principaux acteurs du marché. Le projet permet la consultation d'un catalogue, la gestion d'une bibliothèque personnelle, l'ajout de jeux dans une liste de souhaits ainsi que l'achat de clés numériques.

La première version du projet avait permis de valider les fonctionnalités essentielles attendues. Cependant, au fil du développement, plusieurs limites techniques sont apparues et ont rendu l'évolution du projet plus difficile.

## 1.2 Objectifs de la refonte

L'objectif de cette seconde itération n'était plus uniquement d'ajouter des fonctionnalités mais de reconstruire le projet sur des bases plus saines.

Cette refonte avait pour objectif principal d'améliorer la qualité globale du logiciel, la maintenabilité du code, les performances de l'application et la capacité du projet à évoluer dans le temps.

# 2. Analyse de l'ancien projet

## 2.1 Constats

La première version du projet remplissait correctement son rôle fonctionnel. Néanmoins, son développement s'étant effectué de manière itérative, certaines décisions techniques prises en début de projet ne répondaient plus aux besoins apparus par la suite.

Les composants React contenaient parfois à la fois de la logique métier, des appels API et du rendu visuel. Cette situation compliquait la lecture du code et rendait les tests plus difficiles.

## 2.2 Avant / Après la refonte

<div class="comparison">

<div class="before">

### Avant

![Architecture V1](./assets/placeholder-architecture-v1.webp)

L'architecture de la première version était principalement orientée vers la mise en place rapide des fonctionnalités.

</div>

<div class="after">

### Après

![Architecture V2](./assets/placeholder-architecture-v2.webp)

L'architecture actuelle privilégie la séparation des responsabilités, les performances et la maintenabilité.

</div>

</div>

# 3. Frontend

## 3.1 Refonte de l'architecture React

...

## 3.2 Référencement et indexation

### 3.2.1 React Helmet

Parmi les améliorations apportées, une attention particulière a été portée au référencement naturel. React Helmet a été utilisé afin de générer dynamiquement les balises meta de chaque page du site.

### 3.2.2 Robots.txt

Un fichier robots.txt a été ajouté afin de guider les robots d'indexation et d'améliorer la visibilité du projet.

### 3.2.3 Sitemap XML

La génération d'un sitemap.xml permet aux moteurs de recherche d'identifier rapidement les différentes pages disponibles.

## 3.3 Optimisation des performances

### 3.3.1 React Scan

React Scan a été utilisé afin d'identifier les composants effectuant des rendus inutiles.

### 3.3.2 Lighthouse

Lighthouse a permis de mesurer objectivement les performances, l'accessibilité et le référencement du site.

### 3.3.3 Firefox Profiler

Firefox Profiler a été utilisé pour analyser les temps d'exécution JavaScript et identifier les opérations coûteuses.

### 3.3.4 Lazy Loading et Suspense

L'utilisation de React.lazy et Suspense permet désormais de charger certaines pages uniquement lorsqu'elles sont nécessaires.

## 3.4 Refonte graphique

Une partie importante de la refonte a consisté à remplacer plusieurs ressources PNG par des équivalents SVG afin de réduire le poids des pages tout en améliorant la qualité visuelle.

## 3.5 PixiJS

Le système d'arrière-plan du site a été entièrement repensé grâce à PixiJS.

## 3.6 Nouvelle couche API Frontend

```mermaid
flowchart TD

A[Composant React]
--> B[Hook métier]

B --> C[Service API]

C --> D[NestJS Backend]
```

Les composants ne réalisent désormais plus directement leurs appels réseau.

## 3.7 Tests automatisés

Playwright a été intégré afin de mettre en place des tests unitaires et des scénarios End-to-End couvrant les fonctionnalités essentielles.

## 3.8 Difficultés rencontrées et solutions

Détailler ici les problèmes rencontrés durant la refonte React.

# 4. Backend

## 4.1 Migration vers NestJS

...

## 4.2 Architecture modulaire

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

## 4.3 Validation et sécurité

...

## 4.4 Maintenabilité

...

## 4.5 Difficultés rencontrées et solutions

...

# 5. Conclusion

## 5.1 Bilan

...

## 5.2 Perspectives

...

---

# Table des matières détaillée

(reprise automatique de toutes les sections du rapport)