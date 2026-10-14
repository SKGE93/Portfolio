# Profil complet — Séraphin Eyala

## Identité
- Séraphin Eyala, 21 ans, Île-de-France
- Titulaire d'un BUT Informatique (développement d'applications, IUT de Villetaneuse — USPN)
- En MSc Data Engineering & Cloud Computing à aivancity (2026 — 2028, rentrée en novembre 2026)
- Recherche : alternance en Data Engineering
- Orientation : Développeur Full-Stack (Python, TypeScript, SQL) orienté data et IA
- Email : eyalas472@gmail.com
- GitHub : github.com/SKGE93
- LinkedIn : linkedin.com/in/seraphin-eyala
- Portfolio : https://skge93.github.io/Portfolio/

## Qui suis-je
Développeur full stack (Python, TypeScript, SQL) orienté data et IA. J'aime construire des solutions de bout en bout, appliquer des standards de qualité (tests, code review) et intégrer les outils d'IA dans ma pratique. Veille active sur Hacker News, Reddit et Dev.to (écosystème data, IA générative, LLMs).

---

## Parcours / Timeline

- **Novembre 2026 — 2028 : MSc Data Engineering & Cloud Computing — aivancity** (La Grande École de l'Intelligence Artificielle et de la Data, Île-de-France)

- **Juin — Août 2026 : Stage Développeur Full Stack — Twini** (marketplace B2B de valorisation des déchets industriels, Station F, Paris)
  - Pipeline d'extraction et de structuration de données documentaires par LLM : 3 schémas métier dont un registre réglementaire à 23 champs, 6 contrôles automatiques dont 2 contre des référentiels officiels, architecture à fournisseur LLM interchangeable
  - Développement de fonctionnalités sur la marketplace en production : front React / Next.js, back TypeScript, base MySQL
  - Gestion des environnements test / pré-prod / prod, code review, versionning Git avec branches, PR et rebase

- **Mars — Mai 2026 : Stage IT — IFFP** (Institut Français de Formation Professionnelle, Nanterre)
  - Synthèse CV : automatisation de flux de traitement via Google Apps Script (scripts liés à Google Sheets pour le reporting et la réduction des tâches manuelles) ; optimisation de solutions web sous WordPress et Elementor ; administration Google Workspace
  - Détail des projets :
  - KioskSign — Borne d'accueil interactive (Apps Script + HTML/CSS), informations dynamiques via Google Sheets
  - Signatures Gmail — Script clasp/Apps Script de déploiement automatique de signatures HTML personnalisées pour tout le domaine Google Workspace
  - Workspace Cleaner — Outil Apps Script de nettoyage automatique des fichiers orphelins et doublons dans Google Drive partagé
  - Radar Drive — Script Apps Script analysant les permissions Drive, génère un rapport de conformité sur Google Sheets
  - Dashboard MDP — Tableau de bord Apps Script + Google Sheets pour le suivi des changements de mots de passe utilisateurs
  - Onboarding Professeurs — Automatisation Apps Script de l'intégration des nouveaux professeurs (comptes, accès, documents)
  - Modernisation réseau — Segmentation VLAN, renforcement sécurité, administration Google Workspace
  - Refonte WordPress — Conception/optimisation du site vitrine sous WordPress / Elementor
  - Rédaction de documentation technique complète pour chaque projet

- **2023 — 2026 : BUT Informatique (diplômé) — IUT de Villetaneuse** (Développement d'applications — USPN)
  - Développement full-stack : React, Angular, PHP, Java
  - Bases de données : PostgreSQL, MongoDB, Redis
  - Algorithmique, structures de données, tests unitaires
  - Gestion de projet Agile/Scrum, diagramme de Gantt
  - Droit numérique, travail en équipe produit

- **Février — Mars 2025 : Stagiaire Informatique & Web — Association Jean Luc François** (Pantin)
  - Refonte et maintenance du site WordPress — optimisation thèmes/extensions, performances améliorées
  - Mise en place de workflows No-Code (Airtable, Zapier) — réduction des tâches manuelles répétitives
  - Force de proposition technique, adaptabilité
  - (Détails V1) Stage de 8 semaines durant la 2ème année de BUT. Ambiance bienveillante, équipe restreinte et accueillante. Forte attache de l'équipe aux valeurs de l'association à but non lucratif. Découverte d'une gestion constructive des désaccords en réunion d'équipe (contrairement au cadre scolaire). A développé : adaptation rapide à un nouvel environnement, autonomie + intégration en équipe, écoute active et prise en compte des retours pour améliorer le travail.

- **Juin — Août 2024 : Agent SSIAP1 — Jeux Olympiques** (BSL Sécurité, Grand Palais, Paris)
  - Gestion du public, communication avec les touristes
  - Travail en équipe et direction d'équipe d'agents

- **2024 : Diplômes SSIAP1 et APS** (FP Académie)
  - Service de Sécurité Incendie et d'Assistance aux Personnes (SSIAP1)
  - Agent de Prévention et de Sécurité (APS)

- **2024 (autre mention) : Agent de sécurité — Événementiel**
  - Communication public/équipes, gestion du stress en situation imprévue, rigueur/ponctualité/sens des responsabilités

- **2022 — 2023 : BUT Informatique — 1ère année** (IUT de Villetaneuse)
  - Bases de la programmation et du développement web

- **2021 — 2022 : BAC STI2D SI — Lycée Le Corbusier** (Aubervilliers)
  - Spécialité Sciences et Technologies de l'Industrie et du Développement Durable, option Systèmes d'Information
  - Découverte de la programmation et des systèmes informatiques

---

## Projets réalisés

0a. **Pipeline ELT — Données immobilières DVF** (projet personnel, octobre 2026, autoformation, exécuté en local avec Docker, non déployé sur le cloud)
   - Problème : les données DVF de l'État sont brutes (vente sur plusieurs lignes, prix répété, appartements/caves/parkings mélangés, surfaces absurdes) → impossible d'obtenir directement le prix médian au m² par commune
   - Architecture : data.gouv.fr → ingestion Python → data lake bronze (CSV) → transformation Pandas → silver (Parquet) → PostgreSQL schéma raw → dbt staging (vues) → gold (schéma en étoile : fait_ventes, dim_commune, dim_date). Orchestré par Airflow 3 (DAG mensuel de 4 tâches), Docker Compose (3 services), CI GitHub Actions
   - Points clés : ingestion incrémentale en streaming ; stockage S3-compatible (Silo, fork de MinIO) via boto3 ; chargement idempotent (delete + insert par fichier en transaction) ; 16 tests dbt + 10 tests pytest ; Ruff ; environnement Python isolé dans l'image Airflow
   - Défis résolus : arrêt des images MinIO, localhost dans un conteneur, scripts en échec silencieux (codes de sortie), modèles dbt dans le mauvais schéma, dédoublonnage par parcelle
   - Résultat : pipeline complet en ~1 min 20 ; ex. prix médian au m² 2024 en Seine-Saint-Denis : Les Lilas 6 682 €, Saint-Ouen 6 279 €, Pré-Saint-Gervais 6 166 €, Montreuil 5 870 €, Pantin 5 800 €
   - Périmètre : 1 département, 3 années, extensible par configuration
   - Tech : Python, SQL, Pandas, PyArrow, Parquet, Requests, boto3, Silo, PostgreSQL 16, SQLAlchemy, psycopg, dbt, Airflow 3, Docker, pytest, Ruff, GitHub Actions
   - github.com/SKGE93/dvf-pipeline — page détaillée : https://skge93.github.io/Portfolio/#/projets/dvf

0b. **Application communautaire d'animés** (projet perso, en équipe, 2026)
   - Conception du backend de données : modèle relationnel, sécurisation des accès, circulation de la donnée entre profils, publications et abonnements
   - Backend Supabase / PostgreSQL : Row-Level Security, fonctions RPC, triggers, migrations SQL versionnées, CI GitHub Actions, tests
   - Tech : PostgreSQL, Supabase, SQL, Flutter, GitHub Actions

1. **CinéSearch** — Application de recherche de films (API REST TMDB), page de détail, interface française. SPA React, recherche avec debounce de 500 ms, routing client-side via React Router, requêtes HTTP Axios. Affichage films populaires, synopsis, note, date de sortie.
   - Tech : React, Vite, React Router, Axios, TMDB API, Hooks
   - github.com/SKGE93/cine-search

2. **WeatherDash** — Dashboard météo temps réel, navigation multi-vues. Architecture orientée services Angular, Observables RxJS, dependency injection, lifecycle hooks, graphiques Chart.js. Autocomplétion de villes, prévisions 24h.
   - Tech : Angular 21, TypeScript, Signals, Chart.js, RxJS, OpenWeatherMap API
   - github.com/SKGE93/weather-dash

3. **OtakuGo** — Application mobile cross-platform de recommandation de contenus selon préférences utilisateur. Sélection de genres, moteur de recommandation, fiches détaillées (synopsis, note, épisodes), persistance JSON locale. Réalisé en équipe de 5.
   - Tech : Flutter, Dart, JSON, Cross-platform
   - github.com/SKGE93/Application-mobile-de-recommendations-anime

4. **Messagerie Instantanée (annotation des messages)** — Application de messagerie temps réel avec particularité : chaque utilisateur doit annoter les messages pour continuer à échanger (encourage réflexion active). Maquettes Figma. HTML/CSS/JS pour structuration et dynamisation, back-end PHP en architecture MVC, échanges temps réel via WebSocket (bibliothèque Ratchet). Projet de groupe (SAE).
   - Tech : PHP, WebSocket, Ratchet, JavaScript, MVC, Figma, UX/UI design
   - github.com/Cheick6/SAE_S4

5. **Basquiat & Warhol (site exposition "À quatre mains")** — Site fictif présentant une exposition imaginée autour des œuvres collaboratives de Basquiat et Warhol. Présentation des artistes, traduction anglaise dynamique en JavaScript, intégration vidéo immersive. Maquettes Figma. Projet de groupe réalisé en fin de 1ère année — a permis de mobiliser toutes les compétences acquises (premier site complet).
   - Tech : HTML, CSS, JavaScript, Figma
   - github.com/SKGE93/Expo_Basquiat

6. **La ferme de la ville** — Simulation longue durée client/développeur : conception d'un site sur un thème défini par le "client", avec itérations et retours à intégrer (gestion de feedbacks, code évolutif).
   - Tech : HTML, CSS, Bootstrap
   - github.com/SKGE93/La-ferme-de-la-ville

7. **Shapes — Dessin Java (formes géométriques)** — Application graphique Java pour dessiner formes géométriques (maisons, montagnes, paysages). Modélisation UML des classes de formes, composition de scènes complexes, gestion d'exceptions try-catch. Premier contact avec bibliothèques externes et POO.
   - Tech : Java, UML, OOP, Bibliothèque graphique, Exceptions (try-catch)

8. **API REST FastAPI** (TP BUT 3, 2026) — API de gestion d'utilisateurs en Python, structurée en couches : expose les données via des endpoints REST et les persiste en base par un ORM. Clean Architecture, mapping modèles / SQL avec SQLAlchemy, validation Pydantic, injection de dépendances, endpoints CRUD. Pratique du TDD.
   - Tech : Python, FastAPI, SQLAlchemy, Pydantic, SQL

---

## Compétences universitaires (référentiel BUT Informatique)

### 1. Réaliser un développement d'application
- Manipulation de tableaux en Python (calculs géographiques, latitude/longitude) — premier langage appris, base de l'algorithmique
- Calculatrice Java avec gestion d'exceptions (try-catch, division par zéro), héritage et interfaces (POO)
- Dessin de formes géométriques en Java avec bibliothèques graphiques (maison entourée de montagnes)

### 2. Optimiser des applications informatiques
- Ensemble de Mandelbrot en Python — algorithmes de manipulation de nombres complexes, génération de graphes (projet mathématique complexe)

### 3. Administrer des systèmes informatiques communicants
- Préparation d'un serveur — première expérience d'installation de services réseau, rédaction de comptes rendus techniques
- Environnement LAMP (Linux, Apache, MySQL/MariaDB, PHP) — préparation d'un poste de travail pour le développement

### 4. Gérer des données de l'information
- Base de données universitaire (tables étudiant, évaluation...) — conception de modèle de données
- Système de gestion des notes — modèle de données pour notes/bilans, gestion des restrictions d'accès par rôle (étudiants, enseignants, responsables), sécurité et cohérence des données

### 5. Conduire un projet
- Simulation client/développeur — recueil de besoins, cahier des charges, dialogue continu, gestion à distance (maquettes, mails, délais)

### 6. Travailler en équipe informatique
- Site web exposition Basquiat/Warhol "À quatre mains" — projet de groupe, créativité, mobilisation des compétences de 1ère année, introduction à JavaScript (traduction de page)

---

## Compétences techniques

### Langages
Python, SQL, TypeScript, JavaScript, Java, Bash (aussi PHP, Dart)

### Data Engineering
Pandas, PyArrow, Parquet, dbt, Apache Airflow, data lake S3 (boto3), architecture médaillon, modélisation dimensionnelle (schéma en étoile), tests de données, idempotence

### IA
LLM multimodaux, extraction et structuration de données, validation automatique des sorties, assistants IA en IDE, prompt engineering

### Front-end
React 19, Next.js, Angular, TypeScript, JavaScript, HTML5, CSS, Vite, Chart.js, React Router, Axios, Figma (maquettage UI/UX)

### Back-end & API
Python, FastAPI, Pydantic, SQLAlchemy et Drizzle (ORM), Node.js, tRPC, REST API, architecture en couches, Clean Architecture, PHP (MVC), Java, WebSocket (Ratchet), Google Apps Script, OAuth/JWT
- Pratiques de qualité de code : séparation des responsabilités, nommage clair, évitement de duplication, documentation, TDD (tests avant code)

### Bases de données
PostgreSQL, MySQL/MariaDB, MongoDB, Redis, CockroachDB, Supabase (RLS, RPC, triggers, migrations versionnées), SQL, modélisation relationnelle (normalisation jusqu'à BCNF), conception et optimisation de requêtes

### Mobile
Flutter, Dart, JSON, applications cross-platform

### Outils & DevOps
Git, GitHub, GitLab, GitHub Actions (CI/CD), Docker, Docker Compose, Linux (ligne de commande, déploiement Unix), GCP, cloud (en formation à aivancity), Google Workspace (admin), clasp, LaTeX, VS Code, IntelliJ, WordPress / Elementor, Marionnet (simulation réseau, VLAN)

### Méthodes & autres
Agile/Scrum, Jira, diagramme de Gantt, TDD, No-code (Airtable, Zapier), réseaux (segmentation VLAN, sécurité)

---

## Soft skills
- Formulation CV : esprit analytique, rigueur, autonomie, bon relationnel, dialogue métier / technique
- **Créativité** — apportée dans la conception d'interfaces et l'imagination de contenus, projets techniques et artistiques
- **Ambition** — recherche constante d'évolution et de nouvelles compétences
- **Esprit d'équipe** — intégration facile, valorisation de la coopération
- **Autonomie** — capacité à avancer sans attendre des instructions, tout en sachant demander de l'aide
- Issu de l'expérience SSIAP (sécurité événementielle) : rigueur, réactivité, sens des responsabilités, gestion du stress, communication avec le public

---

## Certifications
- **AI Literacy — IBM SkillsBuild (2026)** — https://www.credly.com/badges/b901991c-8e28-4cdc-be20-88fada58bb4e/public_url
- **Claude 101 — Anthropic (2026)** — https://verify.skilljar.com/c/oxt2ce3aw22r

---

## Centres d'intérêt
- Musique (écoute fréquente, écouteurs)
- Cinéma
- Jeux vidéo (FPS, souls-like, gaming en général)
- Anime/Manga — fan de Naruto (> One Piece selon lui), Fairy Tail, SNK (Attack on Titan)
- Gym
- Veille technologique (Hacker News, Reddit, Dev.to)
- Code / autodidacte (apprentissage React, Angular, Flutter, FastAPI en dehors des cours)
