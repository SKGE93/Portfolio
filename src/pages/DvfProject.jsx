import { useEffect, useState } from 'react';
import './DvfProject.css';

const REPO = 'https://github.com/SKGE93/dvf-pipeline';

const keyFacts = [
  { num: '4', label: 'tâches automatisées, du téléchargement au modèle final' },
  { num: '~1 min 20', label: 'pour exécuter le pipeline de bout en bout' },
  { num: '26', label: 'tests automatisés (16 dbt + 10 pytest)' },
  { num: '1 × 3', label: '1 département, 3 années — extensible par configuration' },
];

const flow = [
  { name: 'data.gouv.fr', sub: 'Source DVF publique', tone: 'muted' },
  { name: 'Ingestion', sub: 'Python · Requests', tone: 'green' },
  { name: 'Bronze', sub: 'CSV brut · data lake S3', tone: 'bronze' },
  { name: 'Transformation', sub: 'Pandas · règles métier', tone: 'green' },
  { name: 'Silver', sub: 'Parquet · data lake S3', tone: 'silver' },
  { name: 'Chargement', sub: 'PostgreSQL · schéma raw', tone: 'green' },
  { name: 'Staging', sub: 'dbt · vues', tone: 'cyan' },
  { name: 'Gold', sub: 'dbt · schéma en étoile', tone: 'gold' },
];

const stack = [
  { cat: 'Langages', items: ['Python', 'SQL'] },
  { cat: 'Traitement', items: ['Pandas', 'PyArrow', 'Parquet', 'Requests'] },
  { cat: 'Stockage', items: ['Silo (API S3)', 'boto3', 'PostgreSQL 16', 'SQLAlchemy', 'psycopg'] },
  { cat: 'Modélisation', items: ['dbt'] },
  { cat: 'Orchestration', items: ['Apache Airflow 3'] },
  { cat: 'Infra & qualité', items: ['Docker', 'Docker Compose', 'pytest', 'Ruff', 'GitHub Actions', 'Git'] },
];

const steps = [
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
    visual: {
      src: './IMG/dvf/data-lake-bucket.webp',
      alt: 'Bucket du data lake avec les dossiers bronze et silver',
      caption: 'Le bucket du data lake : couche bronze (CSV brut) et couche silver (Parquet), 6 objets pour 3 années.',
    },
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
    visual: {
      src: './IMG/dvf/dbt-lineage.webp',
      alt: 'Graphe de lignage dbt de la source jusqu’aux tables gold',
      caption: 'Lignage dbt : de la source raw.ventes à la table de faits, puis au test singulier sur les bornes du prix au m².',
    },
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
    visual: {
      src: './IMG/dvf/airflow-dag.webp',
      alt: 'DAG Airflow avec les 4 tâches en succès et les journaux de la tâche ingestion',
      caption: 'Le DAG Airflow : les 4 tâches en succès. Les journaux de l’ingestion montrent l’incrémental : les 3 fichiers déjà présents sont ignorés.',
    },
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
];

const challenges = [
  {
    problem: 'MinIO a cessé de publier ses images communautaires.',
    solution: 'Bascule vers Silo, un fork compatible. Aucune ligne de code modifiée : le pipeline ne parle qu’à l’API S3, pas à un produit précis.',
  },
  {
    problem: 'Les connexions au data lake et à la base échouaient depuis les conteneurs.',
    solution: 'Dans un conteneur, localhost désigne le conteneur lui-même. Configuration par noms de services Docker, pour un même code en local et dans Airflow.',
  },
  {
    problem: 'Des scripts affichaient des erreurs mais se terminaient « en succès ».',
    solution: 'Ajout de codes de sortie explicites. Airflow voit désormais les échecs partiels et relance la tâche.',
  },
  {
    problem: 'Des modèles dbt construits dans le mauvais schéma.',
    solution: 'Compréhension du lien entre dossiers dbt et configuration, et du fait que dbt ne supprime jamais les anciens objets. Une macro garde désormais des noms de schémas propres.',
  },
  {
    problem: 'Une même vente comptée plusieurs fois.',
    solution: 'DVF répète la ligne d’un logement pour chaque parcelle. Dédoublonnage avant tout comptage.',
  },
];

const results = [
  { commune: 'Les Lilas', prix: '6 682', ventes: 165 },
  { commune: 'Saint-Ouen-sur-Seine', prix: '6 279', ventes: 486 },
  { commune: 'Le Pré-Saint-Gervais', prix: '6 166', ventes: 124 },
  { commune: 'Montreuil', prix: '5 870', ventes: 927 },
  { commune: 'Pantin', prix: '5 800', ventes: 467 },
];

const learnings = [
  {
    concept: 'Idempotence',
    text: 'Un pipeline doit pouvoir être relancé sans créer de doublons. Le delete + insert par fichier dans une transaction m’a montré pourquoi c’est la condition pour que les retries d’Airflow soient sans danger.',
  },
  {
    concept: 'Architecture médaillon',
    text: 'Séparer brut (bronze), nettoyé (silver) et prêt à l’analyse (gold) permet de rejouer une étape sans tout retélécharger, et de savoir à quel niveau chercher une erreur.',
  },
  {
    concept: 'Modélisation dimensionnelle',
    text: 'Fixer la granularité de la table de faits avant d’écrire du SQL. Une fois « une ligne = la vente d’un logement » posé, le dédoublonnage et les jointures devenaient évidents.',
  },
  {
    concept: 'Tests de données',
    text: 'Les tests unitaires vérifient le code, les tests dbt vérifient les données. Les deux sont nécessaires : un code correct peut recevoir une source qui a changé.',
  },
  {
    concept: 'Orchestration',
    text: 'Un orchestrateur ne sait que ce que les scripts lui disent. Sans code de sortie fiable, une tâche « verte » peut cacher un échec.',
  },
  {
    concept: 'Isolation des dépendances',
    text: 'Airflow et le pipeline n’ont pas les mêmes besoins en bibliothèques. Un environnement Python séparé dans l’image évite des conflits difficiles à diagnostiquer.',
  },
];

const limits = [
  'Une vente qui inclut une dépendance (cave, parking) garde un prix qui inclut cette dépendance : le prix au m² est légèrement surestimé dans ce cas.',
  'Si un fichier bronze est mis à jour à la source, il n’est pas retransformé automatiquement.',
];

const nextSteps = [
  'Alertes en cas d’échec du DAG',
  'Test d’intégration de bout en bout dans la CI',
  'Déploiement sur AWS avec Terraform',
  'Dashboard branché sur la couche gold',
];

function Visual({ src, alt, caption }) {
  const [missing, setMissing] = useState(false);
  return (
    <figure className="dvf-visual">
      {missing ? (
        <div className="dvf-visual-placeholder" role="img" aria-label={alt}>
          <span>[ capture à venir ]</span>
          <span className="dvf-visual-path">{src.replace('./', '/')}</span>
        </div>
      ) : (
        <a href={src} target="_blank" rel="noreferrer" title="Ouvrir en taille réelle">
          <img src={src} alt={alt} loading="lazy" onError={() => setMissing(true)} />
        </a>
      )}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function SectionHead({ label, title }) {
  return (
    <>
      <p className="eyebrow">{label}</p>
      <h2 className="dvf-h2">{title}</h2>
    </>
  );
}

export default function DvfProject() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = 'Pipeline ELT DVF — Séraphin Eyala';
    return () => { document.title = prev; };
  }, []);

  return (
    <main className="dvf-page">
      <div className="container dvf-container">
        <a href="#projects" className="dvf-back">← Retour aux projets</a>

        <header className="dvf-header">
          <p className="eyebrow">Étude de cas · Data Engineering</p>
          <h1 className="dvf-title">Pipeline ELT — Données immobilières DVF</h1>
          <p className="dvf-hook">
            Transformer les ventes immobilières brutes publiées par l’État en prix au m² fiables,
            modélisés et mis à jour chaque mois sans intervention.
          </p>
          <ul className="dvf-meta">
            <li>Projet personnel</li>
            <li>Octobre 2026</li>
            <li>Autoformation</li>
            <li>Exécuté en local avec Docker</li>
          </ul>
          <div className="dvf-cta">
            <a href={REPO} target="_blank" rel="noreferrer" className="btn btn-primary">Voir le code</a>
          </div>
        </header>

        <section className="dvf-section">
          <SectionHead label="01 · En bref" title="L’essentiel en 30 secondes" />
          <div className="dvf-facts">
            {keyFacts.map(f => (
              <div key={f.label} className="dvf-card dvf-fact">
                <span className="dvf-fact-num">{f.num}</span>
                <span className="dvf-fact-label">{f.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dvf-section">
          <SectionHead label="02 · Contexte" title="Le problème" />
          <div className="dvf-prose">
            <p>
              Les données DVF (Demandes de Valeurs Foncières) recensent les ventes immobilières en France.
              Elles sont publiques, mais brutes.
            </p>
            <ul className="dvf-list">
              <li>Une vente peut s’étaler sur plusieurs lignes, avec le prix répété sur chacune.</li>
              <li>Appartements, caves et parkings sont mélangés dans la même vente.</li>
              <li>Certaines surfaces sont absurdes.</li>
            </ul>
            <p>
              Résultat : impossible de répondre directement à une question simple comme
              <strong> « quel est le prix médian au m² par commune ? »</strong>
            </p>
            <p>
              Le projet transforme cette source en données fiables, modélisées et mises à jour automatiquement.
            </p>
          </div>
        </section>

        <section className="dvf-section">
          <SectionHead label="03 · Architecture" title="La solution en un schéma" />
          <ol className="dvf-flow" aria-label="Flux de données du pipeline">
            {flow.map(n => (
              <li key={n.name} className={`dvf-node dvf-node--${n.tone}`}>
                <span className="dvf-node-name">{n.name}</span>
                <span className="dvf-node-sub">{n.sub}</span>
              </li>
            ))}
          </ol>
          <p className="dvf-flow-note">
            Orchestré par <strong>Airflow</strong> · conteneurisé avec <strong>Docker Compose</strong> ·
            vérifié par <strong>GitHub Actions</strong>
          </p>
        </section>

        <section className="dvf-section">
          <SectionHead label="04 · Stack" title="Outils utilisés" />
          <div className="dvf-stack">
            {stack.map(s => (
              <div key={s.cat} className="dvf-stack-row">
                <span className="dvf-stack-cat">{s.cat}</span>
                <div className="project-tech">
                  {s.items.map(t => <span key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dvf-section">
          <SectionHead label="05 · Étapes" title="Étapes clés" />
          <ol className="dvf-steps">
            {steps.map((s, i) => (
              <li key={s.title} className="dvf-step">
                <span className="dvf-step-num">{String(i + 1).padStart(2, '0')}</span>
                <div className="dvf-step-body">
                  <h3>{s.title}</h3>
                  {s.text.map((t, j) => <p key={j}>{t}</p>)}
                  {s.visual && <Visual {...s.visual} />}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="dvf-section">
          <SectionHead label="06 · Défis" title="Défis résolus" />
          <div className="dvf-challenges">
            {challenges.map(c => (
              <div key={c.problem} className="dvf-card dvf-challenge">
                <p className="dvf-challenge-problem"><span>problème</span>{c.problem}</p>
                <p className="dvf-challenge-solution"><span>solution</span>{c.solution}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dvf-section">
          <SectionHead label="07 · Résultat" title="Ce que ça donne" />
          <div className="dvf-prose">
            <p>
              Le pipeline complet s’exécute en <strong>environ 1 min 20</strong>, entièrement vert dans Airflow.
            </p>
            <p>
              Sur la couche gold, la question de départ se résout en deux jointures.
              Exemple : prix médian au m² en 2024 en Seine-Saint-Denis.
            </p>
          </div>
          <div className="dvf-table-wrap">
            <table className="dvf-table">
              <thead>
                <tr><th>Commune</th><th>Prix médian / m²</th><th>Ventes</th></tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.commune}>
                    <td>{r.commune}</td>
                    <td>{r.prix} €</td>
                    <td>{r.ventes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="dvf-small">Maisons et appartements, ventes classiques, après nettoyage.</p>
        </section>

        <section className="dvf-section">
          <SectionHead label="08 · Apprentissages" title="Ce que j’ai appris" />
          <div className="dvf-learnings">
            {learnings.map(l => (
              <div key={l.concept} className="dvf-card dvf-learning">
                <h3>{l.concept}</h3>
                <p>{l.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dvf-section">
          <SectionHead label="09 · Limites" title="Limites et suite" />
          <div className="dvf-two-col">
            <div>
              <h3 className="dvf-h3">Limites connues</h3>
              <ul className="dvf-list">
                {limits.map(l => <li key={l}>{l}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="dvf-h3">Prochaines étapes</h3>
              <ul className="dvf-list">
                {nextSteps.map(n => <li key={n}>{n}</li>)}
              </ul>
            </div>
          </div>
          <p className="dvf-small">
            Périmètre actuel : 1 département et 3 années, extensible par configuration.
            Projet exécuté en local, non déployé sur le cloud.
          </p>
        </section>

        <section className="dvf-section dvf-links">
          <SectionHead label="10 · Liens" title="Aller plus loin" />
          <div className="dvf-cta">
            <a href={REPO} target="_blank" rel="noreferrer" className="btn btn-primary">Code source sur GitHub</a>
            <a href="#projects" className="btn btn-ghost">Autres projets</a>
          </div>
        </section>
      </div>
    </main>
  );
}
