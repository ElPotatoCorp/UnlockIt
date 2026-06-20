# AGENT.md

## Mission

Rédiger, modifier ou compléter des rapports techniques longs au format Markdown enrichi de HTML.

L'objectif n'est pas uniquement de documenter une implémentation, mais également d'expliquer la démarche ayant conduit aux décisions techniques, les problèmes rencontrés, les solutions étudiées et les enseignements tirés du projet.

Le document doit conserver un ton académique, technique, pédagogique et humain.

---

# Priorité absolue

## Préserver la structure existante

Lors d'une modification, la structure du document est prioritaire sur le contenu ajouté.

Ne jamais :

* casser du HTML existant ;
* modifier des ancres sans mettre à jour les références ;
* casser la hiérarchie des titres ;
* désynchroniser le sommaire ;
* supprimer des balises nécessaires au rendu.

Avant toute modification, analyser la structure complète de la section concernée.

---

# Style rédactionnel

## Ton

Utiliser un ton professionnel mais naturel.

Le texte doit donner l'impression qu'il est écrit par des développeurs expliquant leur travail avec recul.

Privilégier :

* les explications ;
* les justifications ;
* les retours d'expérience ;
* les observations concrètes.

Éviter :

* le ton marketing ;
* les affirmations gratuites ;
* les superlatifs excessifs ;
* le jargon inutile.

---

## Formulations recommandées

Utiliser régulièrement des formulations du type :

* « Nous avons constaté que... »
* « Cette approche présentait plusieurs limites... »
* « Après plusieurs essais... »
* « Cette solution nous a permis de... »
* « Avec davantage d'expérience... »
* « Nous avons rapidement identifié... »
* « Cela nous a permis de mieux comprendre... »

---

## Structure narrative

Une section doit généralement suivre l'ordre suivant :

1. Contexte.
2. Problème.
3. Analyse.
4. Solution.
5. Résultat.
6. Retour d'expérience.

Le lecteur doit comprendre pourquoi une décision a été prise avant de découvrir comment elle a été implémentée.

---

## Niveau pédagogique

Supposer que le lecteur ne maîtrise pas forcément la technologie présentée.

Toujours :

* introduire un concept ;
* expliquer son rôle ;
* détailler son utilisation ;
* conclure sur ses bénéfices.

Lorsqu'un sujet devient complexe, commencer par une explication simple avant d'entrer dans les détails techniques.

Les analogies et vulgarisations sont encouragées lorsqu'elles améliorent la compréhension.

---

# Style des phrases

Privilégier des paragraphes rédigés.

Éviter les phrases télégraphiques.

Utiliser :

* les virgules ;
* les parenthèses ;
* les deux-points ;
* les points-virgules lorsque nécessaire.

Éviter les em-dash.

Préférer :

```txt
Cette approche présente plusieurs avantages, notamment...
```

à :

```txt
Cette approche présente plusieurs avantages — notamment...
```

---

# Utilisation des listes

Les listes doivent rester exceptionnelles.

Par défaut, privilégier des paragraphes explicatifs.

Utiliser une liste uniquement lorsque :

* plusieurs éléments doivent être énumérés ;
* une comparaison serait difficile à lire autrement ;
* la lisibilité est réellement améliorée.

Une liste ne doit jamais remplacer une explication.

---

# Philosophie de rédaction

Le rapport doit constamment répondre à la question :

« Pourquoi cette décision a-t-elle été prise ? »

La démarche est plus importante que l'implémentation.

Une bonne section raconte :

* un problème ;
* une réflexion ;
* une solution ;
* un résultat.

Elle ne se contente pas de décrire une fonctionnalité.

---

# Markdown et HTML

## Mélange Markdown / HTML

Le document mélange volontairement Markdown et HTML.

Conserver cette approche.

Ne jamais convertir automatiquement du HTML vers du Markdown.

Respecter les structures existantes :

```html
<div>
<details>
<summary>
<header>
<a>
<img>
```

Toute balise ouverte doit être correctement fermée.

---

## Cartes

Les illustrations utilisent généralement :

```html
<div class="card">

Contenu

</div>
```

Conserver cette convention.

---

## Blocs repliables

Utiliser :

```html
<details class="accordion">
<summary>Titre</summary>

Contenu

</details>
```

pour :

* les détails techniques ;
* les compléments ;
* les approfondissements ;
* les exemples secondaires.

Le contenu principal doit rester compréhensible sans ouvrir l'accordéon.

---

# Figures

Les images doivent généralement être accompagnées :

```md
![Description](image.png)

*Figure X – Description.*
```

Une figure ne doit jamais être laissée sans commentaire.

Toujours expliquer ce qu'elle montre et pourquoi elle est pertinente.

---

# Code

Le code est un support d'explication.

Ne jamais :

* afficher du code sans contexte ;
* afficher du code sans analyse.

Toujours :

1. introduire le code ;
2. afficher le code ;
3. expliquer le résultat.

---

# Diagrammes Mermaid

Les diagrammes Mermaid servent à illustrer :

* des architectures ;
* des flux ;
* des dépendances ;
* des structures de fichiers.

Toujours les contextualiser.

Ne jamais supposer qu'un diagramme est auto-explicatif.

---

# Structure des titres

## Hiérarchie obligatoire

La profondeur des titres détermine directement leur numérotation.

Règle :

```md
# 1. Partie

## 1.1 Sous-partie

### 1.1.1 Sous-sous-partie

#### 1.1.1.1 Niveau suivant
```

Chaque niveau supplémentaire ajoute un segment numérique.

---

## Cohérence de la numérotation

Les numéros doivent toujours être cohérents avec leur parent.

Exemple valide :

```md
# 3. Backend

## 3.1 Architecture

### 3.1.1 Modules

### 3.1.2 Services

## 3.2 Sécurité
```

Exemple invalide :

```md
# 3. Backend

### 3.2.1 Validation
```

Le niveau intermédiaire est absent.

---

## Modification de la hiérarchie

Lorsqu'un titre est ajouté :

* recalculer sa numérotation ;
* recalculer celle de ses éventuels frères ;
* mettre à jour le sommaire ;
* mettre à jour les références internes.

Lorsqu'un titre est supprimé :

* renuméroter les sections suivantes ;
* mettre à jour toutes les références concernées.

---

# Sommaire

## Synchronisation obligatoire

Le sommaire et le document doivent toujours décrire exactement la même structure.

Toute section présente dans le document doit apparaître dans le sommaire.

Toute entrée du sommaire doit pointer vers une section existante.

---

## Correspondance des niveaux

Les niveaux du sommaire doivent refléter la profondeur réelle du titre.

Exemple :

```html
<li>
    <a href="#2-frontend">2. Frontend</a>
</li>

<li class="lvl2">
    <a href="#21-refonte-de-larchitecture-react">
        2.1 Refonte de l'architecture React
    </a>
</li>
```

Le niveau HTML doit rester cohérent avec le niveau Markdown.

---

# Ancres et liens

## Correspondance des ancres

Chaque entrée du sommaire doit correspondre exactement à son titre.

Exemple :

```md
## 2.1 Refonte de l'architecture React
```

correspond à :

```html
<a href="#21-refonte-de-larchitecture-react">
```

Le texte, le numéro et l'ancre doivent toujours être synchronisés.

---

## Références internes

Tout lien interne doit cibler une section existante.

Exemple :

```html
<a href="#236-pixijs">2.3.6 PixiJS</a>
```

n'est valide que si :

```md
### 2.3.6 PixiJS
```

existe réellement.

---

## Vérification obligatoire

Avant de terminer une modification :

Vérifier :

* la hiérarchie Markdown ;
* la numérotation ;
* les ancres ;
* le sommaire ;
* les références internes.

Les cinq doivent décrire exactement le même arbre documentaire.

---

# Références croisées

Lorsqu'une section fait référence à une autre :

Préférer :

```html
<a href="#23-optimisation-des-performances">
    2.3 Optimisation des performances
</a>
```

plutôt qu'une référence textuelle vague.

Les références doivent rester navigables.

---

# Humour

Un humour léger est autorisé.

Il doit :

* rester occasionnel ;
* rester pertinent ;
* ne jamais nuire à la crédibilité technique.

L'autodérision légère est acceptable.

---

# Ce qu'il faut reproduire

Le rapport doit ressembler à un retour d'expérience technique rédigé après un projet réel.

Le lecteur doit avoir l'impression qu'un développeur explique :

* ce qu'il a construit ;
* pourquoi il l'a construit ainsi ;
* ce qu'il a appris ;
* ce qu'il referait différemment.

---

# Résumé opérationnel

Pour chaque nouvelle section :

1. Présenter le contexte.
2. Expliquer le problème.
3. Détailler la réflexion.
4. Présenter la solution.
5. Illustrer si nécessaire.
6. Expliquer les résultats.
7. Conclure par un retour d'expérience.

Toujours privilégier les paragraphes aux listes.

Toujours préserver le HTML.

Toujours synchroniser les titres, le sommaire, les ancres et les références internes.

Ne jamais casser la structure documentaire existante.