const dvf = {
  slug: 'dvf',
  docTitle: 'Pipeline ELT DVF',
  eyebrow: 'Étude de cas · Data Engineering',
  title: 'Pipeline ELT — Données immobilières DVF',
  hook: 'Transformer les ventes immobilières brutes publiées par l’État en prix au m² fiables, modélisés et mis à jour chaque mois sans intervention.',
  meta: ['Projet personnel', 'Octobre 2026', 'Autoformation', 'Exécuté en local avec Docker'],
  repo: 'https://github.com/SKGE93/dvf-pipeline',
  facts: [
    { num: '4', label: 'tâches automatisées, du téléchargement au modèle final' },
    { num: '~1 min 20', label: 'pour exécuter le pipeline de bout en bout' },
    { num: '26', label: 'tests automatisés (16 dbt + 10 pytest)' },
    { num: '1 × 3', label: '1 département, 3 années — extensible par configuration' },
  ],
  context: {
    title: 'Le problème',
    blocks: [
      'Les données DVF (Demandes de Valeurs Foncières) recensent les ventes immobilières en France. Elles sont publiques, mais brutes.',
      [
        'Une vente peut s’étaler sur plusieurs lignes, avec le prix répété sur chacune.',
        'Appartements, caves et parkings sont mélangés dans la même vente.',
        'Certaines surfaces sont absurdes.',
      ],
      'Résultat : impossible de répondre directement à une question simple comme **« quel est le prix médian au m² par commune ? »**',
      'Le projet transforme cette source en données fiables, modélisées et mises à jour automatiquement.',
    ],
  },
  flow: {
    nodes: [
      { name: 'data.gouv.fr', sub: 'Source DVF publique', tone: 'muted' },
      { name: 'Ingestion', sub: 'Python · Requests', tone: 'green' },
      { name: 'Bronze', sub: 'CSV brut · data lake S3', tone: 'bronze' },
      { name: 'Transformation', sub: 'Pandas · règles métier', tone: 'green' },
      { name: 'Silver', sub: 'Parquet · data lake S3', tone: 'silver' },
      { name: 'Chargement', sub: 'PostgreSQL · schéma raw', tone: 'green' },
      { name: 'Staging', sub: 'dbt · vues', tone: 'cyan' },
      { name: 'Gold', sub: 'dbt · schéma en étoile', tone: 'gold' },
    ],
    note: 'Orchestré par **Airflow** · conteneurisé avec **Docker Compose** · vérifié par **GitHub Actions**',
  },
  stack: [
    { cat: 'Langages', items: ['Python', 'SQL'] },
    { cat: 'Traitement', items: ['Pandas', 'PyArrow', 'Parquet', 'Requests'] },
    { cat: 'Stockage', items: ['Silo (API S3)', 'boto3', 'PostgreSQL 16', 'SQLAlchemy', 'psycopg'] },
    { cat: 'Modélisation', items: ['dbt'] },
    { cat: 'Orchestration', items: ['Apache Airflow 3'] },
    { cat: 'Infra & qualité', items: ['Docker', 'Docker Compose', 'pytest', 'Ruff', 'GitHub Actions', 'Git'] },
  ],
  steps: [
    {
      title: 'Ingestion',
      text: [
        'Un script Python télécharge les fichiers DVF depuis data.gouv.fr avec Requests, en streaming pour ne pas charger un fichier entier en mémoire.',
        'Il est incrémental : un fichier déjà présent dans le data lake n’est jamais retéléchargé. Les départements et les années se règlent par variables d’environnement, sans toucher au code.',
      ],
    },
    {
      title: 'Data lake',
      text: [
        'Les fichiers sont stockés dans un stockage objet compatible S3 (Silo, fork communautaire de MinIO), accessible avec boto3.',
        'Rangement partitionné par couche, année et département. Le même code fonctionnerait sur AWS S3 en changeant uniquement l’endpoint.',
      ],
      visuals: [{
        src: './IMG/dvf/data-lake-bucket.webp',
        alt: 'Bucket du data lake avec les dossiers bronze et silver',
        caption: 'Le bucket du data lake : couche bronze (CSV brut) et couche silver (Parquet), 6 objets pour 3 années.',
      }],
    },
    {
      title: 'Transformation',
      text: [
        'Pandas applique les règles métier : ventes classiques uniquement, maisons et appartements uniquement, dédoublonnage des logements répétés sur plusieurs parcelles, exclusion des ventes de plusieurs logements.',
        'Le prix au m² est calculé, puis les valeurs hors 500 – 20 000 €/m² sont écartées. Les codes (commune, département) sont typés en texte pour garder les zéros initiaux.',
        'Le résultat est écrit en Parquet : un format colonnaire, compressé et typé.',
      ],
    },
    {
      title: 'Chargement',
      text: [
        'Les données silver sont chargées dans PostgreSQL avec SQLAlchemy et psycopg. La table est créée explicitement pour contrôler les types plutôt que de les laisser deviner.',
        'Le chargement est idempotent : chaque fichier remplace ses propres lignes dans une transaction (delete puis insert). Relancer deux fois donne le même résultat.',
        'Deux colonnes de traçabilité indiquent le fichier source et la date de chargement de chaque ligne.',
      ],
    },
    {
      title: 'Modélisation dbt',
      text: [
        'La table brute est déclarée comme source dbt. Une couche staging en vues renomme et type les colonnes. Une couche gold en tables expose le modèle final.',
        'Schéma en étoile : fait_ventes (une ligne = la vente d’un logement), dim_commune et dim_date, une dimension de dates complète générée avec generate_series. Une macro garde des noms de schémas propres.',
      ],
      visuals: [{
        src: './IMG/dvf/dbt-lineage.webp',
        alt: 'Graphe de lignage dbt de la source jusqu’aux tables gold',
        caption: 'Lignage dbt : de la source raw.ventes à la table de faits, puis au test singulier sur les bornes du prix au m².',
      }],
    },
    {
      title: 'Qualité',
      text: [
        '16 tests dbt (unique, not_null, relationships, accepted_values, et un test singulier sur les bornes du prix au m²) tournent avec dbt build, donc à chaque construction des modèles.',
        '10 tests unitaires pytest vérifient les règles de nettoyage, à partir d’une petite fabrique de données de test. Le linter Ruff est configuré dans le projet.',
      ],
    },
    {
      title: 'Orchestration',
      text: [
        'Apache Airflow 3 enchaîne 4 tâches : ingestion, transformation, chargement, dbt build. Exécution mensuelle, fuseau Europe/Paris, 2 nouvelles tentatives espacées de 5 minutes, rattrapage désactivé.',
        'Chaque script renvoie un code de sortie en erreur si une partie échoue, pour qu’Airflow marque la tâche en échec au lieu de la croire réussie.',
      ],
      visuals: [{
        src: './IMG/dvf/airflow-dag.webp',
        alt: 'DAG Airflow avec les 4 tâches en succès et les journaux de la tâche ingestion',
        caption: 'Le DAG Airflow : les 4 tâches en succès. Les journaux de l’ingestion montrent l’incrémental : les 3 fichiers déjà présents sont ignorés.',
      }],
    },
    {
      title: 'Infrastructure',
      text: [
        'Docker Compose lance 3 services. L’image Airflow est personnalisée : elle contient un environnement Python isolé pour le pipeline, afin que ses dépendances n’entrent pas en conflit avec celles d’Airflow.',
        'Le code est monté en bind mount, les données vivent dans des volumes. Les conteneurs communiquent par noms de services.',
      ],
    },
    {
      title: 'Intégration continue',
      text: [
        'GitHub Actions lance deux jobs en parallèle : Ruff + pytest d’un côté, dbt parse de l’autre. Python 3.12, la même version que l’image Airflow.',
      ],
    },
  ],
  challenges: {
    label: 'Défis',
    title: 'Défis résolus',
    tags: ['problème', 'solution'],
    items: [
      { a: 'MinIO a cessé de publier ses images communautaires.', b: 'Bascule vers Silo, un fork compatible. Aucune ligne de code modifiée : le pipeline ne parle qu’à l’API S3, pas à un produit précis.' },
      { a: 'Les connexions au data lake et à la base échouaient depuis les conteneurs.', b: 'Dans un conteneur, localhost désigne le conteneur lui-même. Configuration par noms de services Docker, pour un même code en local et dans Airflow.' },
      { a: 'Des scripts affichaient des erreurs mais se terminaient « en succès ».', b: 'Ajout de codes de sortie explicites. Airflow voit désormais les échecs partiels et relance la tâche.' },
      { a: 'Des modèles dbt construits dans le mauvais schéma.', b: 'Compréhension du lien entre dossiers dbt et configuration, et du fait que dbt ne supprime jamais les anciens objets. Une macro garde désormais des noms de schémas propres.' },
      { a: 'Une même vente comptée plusieurs fois.', b: 'DVF répète la ligne d’un logement pour chaque parcelle. Dédoublonnage avant tout comptage.' },
    ],
  },
  result: {
    blocks: [
      'Le pipeline complet s’exécute en **environ 1 min 20**, entièrement vert dans Airflow.',
      'Sur la couche gold, la question de départ se résout en deux jointures. Exemple : prix médian au m² en 2024 en Seine-Saint-Denis.',
    ],
    table: {
      head: ['Commune', 'Prix médian / m²', 'Ventes'],
      rows: [
        ['Les Lilas', '6 682 €', '165'],
        ['Saint-Ouen-sur-Seine', '6 279 €', '486'],
        ['Le Pré-Saint-Gervais', '6 166 €', '124'],
        ['Montreuil', '5 870 €', '927'],
        ['Pantin', '5 800 €', '467'],
      ],
      note: 'Maisons et appartements, ventes classiques, après nettoyage.',
    },
  },
  learnings: [
    { concept: 'Idempotence', text: 'Un pipeline doit pouvoir être relancé sans créer de doublons. Le delete + insert par fichier dans une transaction m’a montré pourquoi c’est la condition pour que les retries d’Airflow soient sans danger.' },
    { concept: 'Architecture médaillon', text: 'Séparer brut (bronze), nettoyé (silver) et prêt à l’analyse (gold) permet de rejouer une étape sans tout retélécharger, et de savoir à quel niveau chercher une erreur.' },
    { concept: 'Modélisation dimensionnelle', text: 'Fixer la granularité de la table de faits avant d’écrire du SQL. Une fois « une ligne = la vente d’un logement » posé, le dédoublonnage et les jointures devenaient évidents.' },
    { concept: 'Tests de données', text: 'Les tests unitaires vérifient le code, les tests dbt vérifient les données. Les deux sont nécessaires : un code correct peut recevoir une source qui a changé.' },
    { concept: 'Orchestration', text: 'Un orchestrateur ne sait que ce que les scripts lui disent. Sans code de sortie fiable, une tâche « verte » peut cacher un échec.' },
    { concept: 'Isolation des dépendances', text: 'Airflow et le pipeline n’ont pas les mêmes besoins en bibliothèques. Un environnement Python séparé dans l’image évite des conflits difficiles à diagnostiquer.' },
  ],
  limits: [
    'Une vente qui inclut une dépendance (cave, parking) garde un prix qui inclut cette dépendance : le prix au m² est légèrement surestimé dans ce cas.',
    'Si un fichier bronze est mis à jour à la source, il n’est pas retransformé automatiquement.',
  ],
  next: [
    'Alertes en cas d’échec du DAG',
    'Test d’intégration de bout en bout dans la CI',
    'Déploiement sur AWS avec Terraform',
    'Dashboard branché sur la couche gold',
  ],
  scopeNote: 'Périmètre actuel : 1 département et 3 années, extensible par configuration. Projet exécuté en local, non déployé sur le cloud.',
};

const weatherdash = {
  slug: 'weatherdash',
  docTitle: 'WeatherDash',
  eyebrow: 'Étude de cas · Front-end Angular',
  title: 'WeatherDash — Dashboard météo',
  hook: 'Un tableau de bord météo en Angular : la météo actuelle d’une ville et la courbe des températures sur 24 heures, à partir de l’API OpenWeatherMap.',
  meta: ['Projet personnel', '2026', 'Autoformation', 'Exécuté en local'],
  repo: 'https://github.com/SKGE93/weather-dash',
  facts: [
    { num: '2', label: 'appels à l’API : météo actuelle et prévisions' },
    { num: '8', label: 'points sur la courbe : 24 h, un relevé toutes les 3 h' },
    { num: '3', label: 'briques séparées : page, service, composant graphique' },
    { num: '0', label: 'clé API dans le dépôt : elle reste dans un fichier local' },
  ],
  context: {
    title: 'Pourquoi ce projet',
    blocks: [
      'Après CinéSearch en React, je voulais pratiquer un framework plus structuré, très utilisé en entreprise et en ESN, et comparer les deux approches sur un projet concret.',
      'Le sujet : afficher la météo d’une ville et rendre lisible l’évolution des températures sur la journée.',
      [
        'Météo actuelle : température, ressenti, humidité, vent',
        'Icône météo selon les conditions, avec variantes jour et nuit',
        'Courbe des températures sur les 24 prochaines heures',
        'Recherche par ville (touche Entrée), descriptions en français',
      ],
    ],
  },
  flow: {
    nodes: [
      { name: 'Utilisateur', sub: 'saisit une ville', tone: 'muted' },
      { name: 'Page Home', sub: 'signals · état de la page', tone: 'cyan' },
      { name: 'WeatherService', sub: 'HttpClient · injection', tone: 'green' },
      { name: 'OpenWeatherMap', sub: '/weather · /forecast', tone: 'muted' },
      { name: 'Carte météo', sub: 'template Angular', tone: 'cyan' },
      { name: 'WeatherChart', sub: 'input() · ngOnChanges', tone: 'cyan' },
      { name: 'Chart.js', sub: 'courbe sur 24 h', tone: 'green' },
    ],
    note: 'La clé API est lue depuis **environment.ts**, un fichier local exclu du dépôt.',
  },
  stack: [
    { cat: 'Framework', items: ['Angular 21', 'Signals', 'Composants standalone'] },
    { cat: 'Langage', items: ['TypeScript 5'] },
    { cat: 'Données', items: ['HttpClient', 'Observables RxJS', 'OpenWeatherMap API'] },
    { cat: 'Visualisation', items: ['Chart.js 4'] },
    { cat: 'Styles', items: ['CSS'] },
  ],
  steps: [
    {
      title: 'Un service pour parler à l’API',
      text: [
        'WeatherService regroupe les deux appels HTTP : la météo actuelle et les prévisions. Il fixe une fois les paramètres communs : unités métriques et langue française.',
        'Il est fourni par injection de dépendances. Les composants le reçoivent dans leur constructeur et ne connaissent jamais l’URL de l’API.',
      ],
    },
    {
      title: 'La page et son état',
      text: [
        'La page Home garde son état dans des signals : la ville, la météo, les prévisions et l’indicateur de chargement. Au démarrage, elle affiche Paris.',
        'Quand on valide une ville avec Entrée, le signal de la ville change et les deux appels sont relancés. L’interface se met à jour sans gestion manuelle de la détection des changements.',
      ],
    },
    {
      title: 'Le graphique',
      text: [
        'WeatherChart reçoit les prévisions via input(). Il garde les 8 premiers relevés, soit 24 heures avec un point toutes les 3 heures.',
        'À chaque nouvelle recherche, ngOnChanges reconstruit la courbe. L’ancienne instance Chart.js est d’abord détruite avec chart.destroy(), sinon les graphiques se superposent et la mémoire n’est pas libérée.',
      ],
    },
    {
      title: 'La clé API hors du dépôt',
      text: [
        'La clé est dans src/environments/environment.ts, listé dans le .gitignore. Le README explique comment recréer ce fichier pour lancer le projet.',
      ],
    },
  ],
  challenges: {
    label: 'Choix',
    title: 'Choix techniques',
    tags: ['besoin', 'choix'],
    items: [
      { a: 'Comparer avec React sur un vrai projet.', b: 'Angular, un framework qui impose sa structure : services, injection de dépendances, cycle de vie des composants.' },
      { a: 'Ne pas disperser la logique d’appel à l’API.', b: 'Un service dédié, injecté dans les composants au lieu d’être instancié à la main.' },
      { a: 'Un graphique qui suit chaque nouvelle recherche.', b: 'Reconstruction dans ngOnChanges, avec destruction de l’instance précédente.' },
      { a: 'Un composant graphique réutilisable.', b: 'WeatherChart ne connaît pas l’API : il reçoit ses données de la page via input().' },
      { a: 'Ne jamais publier la clé API.', b: 'Un fichier d’environnement local, exclu par le .gitignore.' },
    ],
  },
  result: {
    blocks: [
      'Une seule page : on tape une ville, on valide, et la carte météo comme la courbe des 24 heures se mettent à jour.',
    ],
    visuals: [{
      src: './IMG/weatherdash/dashboard.webp',
      alt: 'Dashboard WeatherDash : météo de Paris et courbe des températures sur 24 heures',
      caption: 'Météo actuelle de Paris et courbe des températures sur 24 heures, un point toutes les 3 heures.',
    }],
  },
  learnings: [
    { concept: 'Injection de dépendances', text: 'Le composant demande un service au lieu de le créer. Le code d’accès à l’API vit à un seul endroit et peut être remplacé, par exemple pour des tests.' },
    { concept: 'État réactif avec les signals', text: 'L’équivalent du useState de React, natif à Angular : quand un signal change, l’affichage qui en dépend suit.' },
    { concept: 'Cycle de vie des composants', text: 'Savoir quand un composant reçoit de nouvelles données (ngOnChanges), et nettoyer ce qu’on a créé, comme une instance de graphique.' },
    { concept: 'Comparer deux frameworks', text: 'Le même type d’application en React puis en Angular : Angular fixe l’organisation (services, injection, cycle de vie), React laisse ces choix au développeur.' },
  ],
  limits: [
    'Aucun message visible si la ville n’existe pas : l’erreur part seulement dans la console.',
    'Le vent est affiché en km/h alors que l’API renvoie des m/s en unités métriques : 4,12 m/s correspondent en réalité à environ 15 km/h.',
    'Les réponses de l’API sont typées en any, ce qui retire une partie de l’intérêt de TypeScript.',
    'Les prévisions sur 5 jours sont récupérées, mais seules les 24 premières heures sont affichées.',
    'Pas de tests : les fichiers .spec.ts générés par Angular ne sont pas implémentés.',
    'La clé API est dans un fichier TypeScript : un build de production l’inclurait dans le code envoyé au navigateur.',
  ],
  next: [
    'Afficher un message clair quand la ville est introuvable',
    'Convertir le vent en km/h',
    'Typer les réponses de l’API avec des interfaces',
    'Afficher les prévisions sur 5 jours',
    'Tester le service et le composant graphique',
    'Passer par un petit backend pour garder la clé côté serveur',
  ],
  scopeNote: 'Projet exécuté en local, non déployé en ligne.',
};

const cinesearch = {
  slug: 'cinesearch',
  docTitle: 'CinéSearch',
  eyebrow: 'Étude de cas · Front-end React',
  title: 'CinéSearch — Recherche de films',
  hook: 'Une application React pour parcourir les films populaires, chercher un titre en direct et consulter sa fiche, à partir de l’API TMDB.',
  meta: ['Projet personnel', '2026', 'Autoformation', 'Exécuté en local'],
  repo: 'https://github.com/SKGE93/cine-search',
  facts: [
    { num: '500 ms', label: 'd’attente après la dernière frappe avant de chercher' },
    { num: '3', label: 'routes de l’API TMDB : populaires, recherche, fiche' },
    { num: '2', label: 'pages : l’accueil et la fiche d’un film' },
    { num: '1', label: 'client HTTP partagé, configuré une seule fois' },
  ],
  context: {
    title: 'Pourquoi ce projet',
    blocks: [
      'Un projet personnel pour pratiquer React et la consommation d’une API REST sur un cas concret : explorer un catalogue de films.',
      [
        'Les 20 films populaires du moment au chargement',
        'Une recherche qui se met à jour pendant la saisie',
        'Une fiche par film : affiche, synopsis, note et date de sortie',
        'Des données en français et une navigation sans rechargement de page',
      ],
    ],
  },
  flow: {
    nodes: [
      { name: 'Utilisateur', sub: 'tape un titre', tone: 'muted' },
      { name: 'Home.jsx', sub: 'recherche · debounce', tone: 'cyan' },
      { name: 'tmdb.js', sub: 'instance Axios', tone: 'green' },
      { name: 'API TMDB', sub: 'populaires · recherche · fiche', tone: 'muted' },
      { name: 'MovieCard.jsx', sub: 'une carte par film', tone: 'cyan' },
      { name: 'Detail.jsx', sub: 'route /film/:id', tone: 'cyan' },
    ],
    note: 'Le jeton TMDB est lu depuis **.env.local**, ignoré par Git.',
  },
  stack: [
    { cat: 'Framework', items: ['React 19', 'Hooks'] },
    { cat: 'Build', items: ['Vite 8', 'ESLint'] },
    { cat: 'Navigation', items: ['React Router 7'] },
    { cat: 'Données', items: ['Axios', 'API TMDB'] },
    { cat: 'Styles', items: ['CSS'] },
  ],
  steps: [
    {
      title: 'Un client API configuré une fois',
      text: [
        'services/tmdb.js crée une instance Axios avec l’adresse de l’API, le jeton d’accès dans l’en-tête et la langue française. Toutes les pages l’utilisent, sans répéter cette configuration.',
      ],
    },
    {
      title: 'Accueil et recherche',
      text: [
        'Au chargement, la page affiche les films populaires. Quand on tape un titre, un useEffect attend **500 ms** après la dernière frappe avant d’appeler l’API ; à chaque nouvelle frappe, clearTimeout annule l’attente précédente.',
        'Sans ce délai, taper « Batman » enverrait 6 requêtes. Avec, il n’en part qu’une. Si on vide le champ, les films populaires reviennent.',
      ],
      visuals: [{
        src: './IMG/cinesearch/recherche.webp',
        alt: 'Résultats de recherche pour Naruto dans CinéSearch',
        caption: 'Recherche « Naruto » : les résultats remplacent les films populaires.',
      }],
    },
    {
      title: 'Une carte par film',
      text: [
        'MovieCard reçoit un film en props et l’affiche. Il ne sait pas d’où viennent les données : c’est la page qui les récupère. Chaque carte est un lien vers la fiche du film.',
      ],
    },
    {
      title: 'La fiche d’un film',
      text: [
        'La route /film/:id lit l’identifiant dans l’URL avec useParams, puis appelle l’API pour ce film. La note est arrondie à une décimale et le bouton retour revient à la page précédente.',
        'Les deux captures ci-dessous montrent la même fiche avant et après ces réglages : la première version affichait le titre et le synopsis en anglais, avec une note brute.',
      ],
      visuals: [
        {
          src: './IMG/cinesearch/fiche-avant.webp',
          alt: 'Fiche Avatar en anglais avec une note de 7.261',
          caption: 'Avant : titre et synopsis en anglais, note « 7.261/10 ».',
        },
        {
          src: './IMG/cinesearch/fiche-apres.webp',
          alt: 'Fiche Avatar en français avec une note de 7.3',
          caption: 'Après : langue française dans le client API, note arrondie « 7.3/10 ».',
        },
      ],
    },
  ],
  challenges: {
    label: 'Choix',
    title: 'Choix techniques',
    tags: ['besoin', 'choix'],
    items: [
      { a: 'Un outil de build rapide et maintenu.', b: 'Vite plutôt que Create React App, qui n’est plus maintenu activement.' },
      { a: 'Ne pas répéter la configuration à chaque appel.', b: 'Une instance Axios unique : adresse de l’API, jeton et langue au même endroit.' },
      { a: 'Éviter une requête à chaque lettre tapée.', b: 'Un debounce de 500 ms avec setTimeout et clearTimeout.' },
      { a: 'Garder le jeton hors du code versionné.', b: 'Une variable d’environnement dans .env.local, ignoré par Git.' },
      { a: 'Séparer la récupération des données et l’affichage.', b: 'Un composant MovieCard qui reçoit ses données en props.' },
      { a: 'Des adresses propres pour chaque film.', b: 'React Router et une route /film/:id, sans rechargement de page.' },
    ],
  },
  result: {
    blocks: [
      'Une application qui répond pendant la saisie, sans saturer l’API, avec une fiche par film accessible par une adresse dédiée.',
    ],
    visuals: [{
      src: './IMG/cinesearch/accueil.webp',
      alt: 'Page d’accueil de CinéSearch avec la grille des films populaires',
      caption: 'L’accueil : barre de recherche et grille des films populaires.',
    }],
  },
  learnings: [
    { concept: 'useEffect et nettoyage', text: 'Un effet peut renvoyer une fonction de nettoyage. C’est elle qui annule l’attente précédente et rend le debounce possible.' },
    { concept: 'Centraliser la configuration', text: 'Une seule instance Axios pour toute l’application : changer la langue ou le jeton se fait à un seul endroit.' },
    { concept: 'Routage côté client', text: 'Une URL par film (/film/:id) : la page peut être partagée et rechargée, et la navigation reste instantanée.' },
    { concept: 'Composants et props', text: 'Séparer le composant qui récupère les données de celui qui les affiche rend l’affichage réutilisable.' },
  ],
  limits: [
    'Pas de pagination : seuls les 20 premiers résultats sont affichés.',
    'Aucun message si la recherche ne renvoie rien ou si l’API échoue : les appels n’ont pas de gestion d’erreur.',
    'Les films sans affiche s’affichent sans image : l’image de remplacement dépend d’un service externe qui ne s’affiche pas (visible sur la recherche « Naruto »).',
    'Le jeton TMDB est une variable Vite : il est inclus dans le code envoyé au navigateur, donc visible par un utilisateur averti.',
    'Pas de favoris, pas de filtre par genre, pas de tests automatisés.',
  ],
  next: [
    'Pagination ou défilement infini',
    'Gestion des erreurs et d’un état « aucun résultat »',
    'Une image de remplacement hébergée dans le projet',
    'Favoris enregistrés dans le navigateur',
    'Un petit backend pour garder le jeton côté serveur',
  ],
  scopeNote: 'Projet exécuté en local, non déployé en ligne.',
};

export const caseStudies = { dvf, weatherdash, cinesearch };
