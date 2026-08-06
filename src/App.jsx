import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import LogoLoop from './components/LogoLoop';
import {
  SiReact, SiAngular, SiTypescript, SiJavascript, SiPhp,
  SiFlutter, SiDart, SiHtml5, SiCss, SiGit,
  SiPostgresql, SiMongodb, SiRedis, SiSupabase,
  SiDocker, SiLinux, SiNodedotjs, SiWordpress,
  SiGoogleappsscript, SiAirtable, SiVite, SiCockroachlabs,
  SiPython, SiFastapi, SiGooglecloud, SiLatex, SiJsonwebtokens
} from 'react-icons/si';
import { FaJava, FaCertificate, FaGithub, FaLinkedin, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import './App.css';

const techLogos = [
  { node: <SiReact />, title: 'React' },
  { node: <SiAngular />, title: 'Angular' },
  { node: <SiTypescript />, title: 'TypeScript' },
  { node: <SiJavascript />, title: 'JavaScript' },
  { node: <SiPhp />, title: 'PHP' },
  { node: <FaJava />, title: 'Java' },
  { node: <SiNodedotjs />, title: 'Node.js' },
  { node: <SiFlutter />, title: 'Flutter' },
  { node: <SiDart />, title: 'Dart' },
  { node: <SiHtml5 />, title: 'HTML5' },
  { node: <SiCss />, title: 'CSS' },
  { node: <SiVite />, title: 'Vite' },
  { node: <SiGit />, title: 'Git' },
  { node: <SiDocker />, title: 'Docker' },
  { node: <SiLinux />, title: 'Linux' },
  { node: <SiPostgresql />, title: 'PostgreSQL' },
  { node: <SiMongodb />, title: 'MongoDB' },
  { node: <SiRedis />, title: 'Redis' },
  { node: <SiCockroachlabs />, title: 'CockroachDB' },
  { node: <SiSupabase />, title: 'Supabase' },
  { node: <SiWordpress />, title: 'WordPress' },
  { node: <SiGoogleappsscript />, title: 'Apps Script' },
  { node: <SiAirtable />, title: 'Airtable' },
  { node: <SiPython />, title: 'Python' },
  { node: <SiFastapi />, title: 'FastAPI' },
  { node: <SiGooglecloud />, title: 'GCP' },
  { node: <SiLatex />, title: 'LaTeX' },
  { node: <SiJsonwebtokens />, title: 'OAuth / JWT' },
];

const projects = [
  {
    title: 'CinéSearch',
    desc: 'Application de recherche de films consommant l\'API REST TMDB, avec page de détail et interface en français. SPA React avec hooks personnalisés, recherche avec debounce, routing client-side et requêtes HTTP Axios.',
    tech: ['React', 'Vite', 'React Router', 'Axios', 'TMDB API'],
    img: './IMG/CineSearch.png.png',
    link: 'https://github.com/SKGE93/cine-search',
    color: '#6c4cff',
  },
  {
    title: 'WeatherDash',
    desc: 'Dashboard météo temps réel avec navigation multi-vues. Architecture orientée services Angular, Observables RxJS, dependency injection et graphiques interactifs Chart.js. Autocomplétion de villes et prévisions sur 24h.',
    tech: ['Angular 19', 'TypeScript', 'Chart.js', 'RxJS', 'OpenWeatherMap'],
    img: './IMG/WeatherDash.png',
    link: 'https://github.com/SKGE93/weather-dash',
    color: '#4fc3ff',
  },
  {
    title: 'OtakuGo',
    desc: 'Application mobile cross-platform suggérant des contenus selon les préférences utilisateur. Moteur de recommandation, fiches détaillées, persistance JSON locale. Réalisé en équipe de 5.',
    tech: ['Flutter', 'Dart', 'JSON', 'Cross-platform'],
    img: './IMG/AnimeApp.png.png',
    link: 'https://github.com/SKGE93/Application-mobile-de-recommendations-anime',
    color: '#ff7ac6',
  },
  {
    title: 'Gestion Utilisateurs — FastAPI',
    desc: 'Backend de gestion d\'utilisateurs en architecture par couches (routers, services, modèles). ORM SQLAlchemy, gestion de sessions et pratique du TDD, avec séparation des responsabilités et documentation.',
    tech: ['Python', 'FastAPI', 'SQLAlchemy', 'TDD', 'REST'],
    img: null,
    link: null,
    color: '#6c4cff',
  },
  {
    title: 'Messagerie instantanée',
    desc: 'Messagerie temps réel où chaque utilisateur doit annoter les messages pour continuer à échanger. Échanges via WebSocket (Ratchet), back-end PHP en architecture MVC, interface responsive conçue en équipe.',
    tech: ['PHP', 'WebSocket', 'Ratchet', 'MVC', 'Figma'],
    img: './IMG/message.png',
    link: 'https://github.com/Cheick6/SAE_S4',
    color: '#34e0b0',
  },
  {
    title: 'Basquiat & Warhol',
    desc: 'Site d\'exposition fictive autour des œuvres collaboratives de Basquiat et Warhol. Traduction anglaise dynamique en JavaScript, intégration vidéo immersive. Maquettes UI/UX réalisées sur Figma.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    img: './IMG/expo.png',
    link: 'https://github.com/SKGE93/Expo_Basquiat',
    color: '#ffb14e',
  },
  {
    title: 'Shapes — Dessin Java',
    desc: 'Application graphique Java pour dessiner des formes géométriques (maisons, montagnes, paysages). Modélisation UML des classes, composition de scènes, gestion des exceptions. Premier contact avec la POO.',
    tech: ['Java', 'UML', 'POO'],
    img: './IMG/imgMaison.png',
    link: null,
    color: '#ff5d57',
  },
];

const experiences = [
  {
    date: 'Mars — Juin 2026',
    title: 'Stagiaire IT — IFFP',
    desc: 'Institut Français de Formation Professionnelle · Nanterre',
    current: true,
    details: [
      'KioskSign — borne d\'accueil interactive en Apps Script + HTML/CSS, alimentée par Google Sheets',
      'Signatures Gmail — déploiement automatique de signatures HTML sur tout le domaine Google Workspace (clasp)',
      'Workspace Cleaner & Radar Drive — nettoyage des fichiers orphelins et rapport de conformité des permissions Drive',
      'Dashboard MDP & Onboarding Professeurs — tableaux de bord et automatisation de l\'intégration',
      'Modernisation réseau — segmentation VLAN, sécurité, administration Google Workspace',
      'Refonte du site vitrine sous WordPress / Elementor + documentation technique',
    ],
  },
  {
    date: '2023 — 2026',
    title: 'BUT Informatique — IUT de Villetaneuse',
    desc: 'Développement d\'applications · USPN',
    details: [
      'Développement full-stack — React, Angular, PHP, Java',
      'Bases de données — PostgreSQL, MongoDB, Redis',
      'Algorithmique, structures de données, tests unitaires',
      'Gestion de projet Agile / Scrum, travail en équipe produit',
    ],
  },
  {
    date: 'Fév. — Mars 2025',
    title: 'Stagiaire Informatique & Web — Asso Jean Luc François',
    desc: 'Pantin',
    details: [
      'Refonte et maintenance du site WordPress — thèmes, extensions, performances',
      'Workflows No-Code (Airtable, Zapier) pour réduire les tâches répétitives',
      'Force de proposition technique, adaptabilité',
    ],
  },
  {
    date: 'Juin — Août 2024',
    title: 'Agent SSIAP1 — Jeux Olympiques',
    desc: 'BSL Sécurité · Grand Palais, Paris',
    details: [
      'Gestion du public et communication avec les touristes',
      'Travail en équipe et direction d\'une équipe d\'agents',
      'Gestion du stress, rigueur et sens des responsabilités',
    ],
  },
  {
    date: '2021 — 2022',
    title: 'BAC STI2D — Lycée Le Corbusier',
    desc: 'Aubervilliers',
    details: [
      'Spécialité Systèmes d\'Information et Numérique',
      'Découverte de la programmation et des systèmes informatiques',
    ],
  },
];

const skillCats = [
  { title: 'Front-end', items: 'React, Angular 19, TypeScript, JavaScript, HTML/CSS, Vite, Chart.js, React Router, Axios' },
  { title: 'Back-end & API', items: 'Python, FastAPI, SQLAlchemy, PHP (MVC), Java, Node.js, REST API, WebSocket, OAuth/JWT' },
  { title: 'Bases de données', items: 'PostgreSQL, MongoDB, Redis, CockroachDB, Supabase, SQL, ORM' },
  { title: 'Mobile', items: 'Flutter, Dart, JSON, applications cross-platform' },
  { title: 'Outils & DevOps', items: 'Git, GitHub, Docker, Linux, GCP, Google Workspace, clasp, LaTeX' },
  { title: 'Méthodes', items: 'Agile / Scrum, TDD, Apps Script, WordPress / Elementor, Airtable, Zapier' },
];

const navLinks = [
  { id: 'about', label: 'À propos' },
  { id: 'skills', label: 'Compétences' },
  { id: 'projects', label: 'Projets' },
  { id: 'experience', label: 'Parcours' },
  { id: 'certifications', label: 'Certifs' },
  { id: 'contact', label: 'Contact' },
];

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

function Reveal({ children, delay = 0, y = 24, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedExp, setExpandedExp] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <ScrollProgress />

      {/* Navbar */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <a href="#hero" className="nav-logo">SÉ<span>.</span></a>
          <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
            {navLinks.map(l => (
              <a key={l.id} href={`#${l.id}`} onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
            <a href="#contact" className="nav-cta" onClick={() => setMenuOpen(false)}>Me contacter</a>
          </nav>
          <button className="nav-toggle" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section id="hero" className="hero">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
        <div className="container hero-content">
          <motion.span className="hero-badge"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="pulse-dot" /> Disponible pour un stage — juin 2026
          </motion.span>
          <motion.h1 className="hero-name"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}>
            Séraphin <span className="accent">Eyala</span>
          </motion.h1>
          <motion.p className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
            Développeur Full-Stack, orientation Data &amp; IA. Je construis des applications web et
            mobiles propres, du front à l’API.
          </motion.p>
          <motion.div className="hero-cta"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
            <a href="#projects" className="btn btn-primary">Voir mes projets <FaArrowRight /></a>
            <a href="#contact" className="btn btn-ghost">Me contacter</a>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section">
        <div className="container">
          <Reveal><p className="eyebrow">01 · À propos</p></Reveal>
          <div className="about-grid">
            <div>
              <Reveal delay={0.05}>
                <h2 className="section-title">Qui je suis</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="about-text">
                  Étudiant en 3ᵉ année de <strong>BUT Informatique</strong> à l’IUT de Villetaneuse,
                  je suis passionné par le développement web et mobile. En stage à l’<strong>IFFP</strong>,
                  j’ai automatisé des processus métiers (Apps Script, clasp) et conçu des solutions web.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="about-text">
                  Curieux et autodidacte, j’apprends en dehors des cours (React, Angular, Flutter, FastAPI).
                  Mon objectif est d’intégrer le <strong>MSc Data Engineering à Aivancity</strong>. Je fais
                  de la veille active sur l’IA générative et les LLMs.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="about-hobbies">En dehors du code · anime, jeux vidéo, sport, veille tech</p>
              </Reveal>
            </div>
            <Reveal delay={0.15} className="about-stats">
              {[['7', 'Projets réalisés'], ['3', 'Années de formation'], ['25+', 'Technologies'], ['2', 'Certifications']].map(([k, v]) => (
                <div className="stat-card" key={v}>
                  <span className="stat-num">{k}</span>
                  <span className="stat-label">{v}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section section-alt">
        <div className="container">
          <Reveal><p className="eyebrow">02 · Stack technique</p></Reveal>
          <Reveal delay={0.05}><h2 className="section-title">Ce que je maîtrise</h2></Reveal>
        </div>
        <div className="logoloop-wrapper">
          <LogoLoop logos={techLogos} speed={70} direction="left" logoHeight={38} gap={52} fadeOut fadeOutColor="#f3ecdf" />
        </div>
        <div className="container">
          <div className="skills-grid">
            {skillCats.map((cat, i) => (
              <Reveal delay={(i % 3) * 0.06} key={cat.title}>
                <div className="skill-card">
                  <h3>{cat.title}</h3>
                  <p>{cat.items}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="section">
        <div className="container">
          <Reveal><p className="eyebrow">03 · Réalisations</p></Reveal>
          <Reveal delay={0.05}><h2 className="section-title">Projets</h2></Reveal>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <motion.article key={p.title} className="project-card" style={{ '--pc': p.color }}
                initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: (i % 3) * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
                <div className="project-media">
                  {p.img
                    ? <img src={p.img} alt={p.title} loading="lazy" />
                    : <div className="project-media-ph"><span>{p.title.charAt(0)}</span></div>}
                </div>
                <div className="project-body">
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-desc">{p.desc}</p>
                  <div className="project-tech">
                    {p.tech.map(t => <span key={t}>{t}</span>)}
                  </div>
                  {p.link
                    ? <a href={p.link} target="_blank" rel="noreferrer" className="project-link">Voir le code <FaArrowRight /></a>
                    : <span className="project-link project-link--off">Projet d’école</span>}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="section section-alt">
        <div className="container">
          <Reveal><p className="eyebrow">04 · Parcours</p></Reveal>
          <Reveal delay={0.05}><h2 className="section-title">Expériences &amp; formation</h2></Reveal>
          <div className="timeline">
            {experiences.map((exp, i) => (
              <Reveal delay={(i % 4) * 0.05} key={i}>
                <div className={`timeline-item ${expandedExp === i ? 'expanded' : ''} ${exp.current ? 'current' : ''}`}
                  onClick={() => setExpandedExp(expandedExp === i ? null : i)}>
                  <div className="timeline-head">
                    <div>
                      <span className="timeline-date">{exp.date}</span>
                      <h3 className="timeline-title">{exp.title}</h3>
                      <p className="timeline-desc">{exp.desc}</p>
                    </div>
                    <span className="timeline-toggle">{expandedExp === i ? '−' : '+'}</span>
                  </div>
                  {expandedExp === i && exp.details && (
                    <ul className="timeline-details">
                      {exp.details.map((d, j) => <li key={j}>{d}</li>)}
                    </ul>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section id="certifications" className="section">
        <div className="container">
          <Reveal><p className="eyebrow">05 · Certifications</p></Reveal>
          <Reveal delay={0.05}><h2 className="section-title">Certifications</h2></Reveal>
          <div className="certs-grid">
            {[
              { title: 'AI Literacy', issuer: 'IBM SkillsBuild', year: '2026', href: 'https://www.credly.com/badges/b901991c-8e28-4cdc-be20-88fada58bb4e/public_url' },
              { title: 'Claude 101', issuer: 'Anthropic', year: '2026', href: 'https://verify.skilljar.com/c/oxt2ce3aw22r' },
            ].map((c, i) => (
              <Reveal delay={i * 0.06} key={c.title}>
                <a href={c.href} target="_blank" rel="noreferrer" className="cert-card">
                  <FaCertificate className="cert-icon" />
                  <div>
                    <h3 className="cert-title">{c.title}</h3>
                    <p className="cert-issuer">{c.issuer}</p>
                  </div>
                  <span className="cert-year">{c.year}</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section section-alt contact">
        <div className="container contact-inner">
          <Reveal><p className="eyebrow">06 · Contact</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="section-title contact-title">Travaillons ensemble</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="contact-text">Un projet, une opportunité de stage ou juste envie d’échanger sur la tech ?</p>
          </Reveal>
          <Reveal delay={0.15}>
            <a className="contact-mail" href="mailto:eyalas472@gmail.com">eyalas472@gmail.com</a>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="contact-links">
              <a href="mailto:eyalas472@gmail.com" className="btn btn-primary"><FaEnvelope /> Email</a>
              <a href="https://github.com/SKGE93" target="_blank" rel="noreferrer" className="btn btn-ghost"><FaGithub /> GitHub</a>
              <a href="https://www.linkedin.com/in/seraphin-eyala-68557b279/" target="_blank" rel="noreferrer" className="btn btn-ghost"><FaLinkedin /> LinkedIn</a>
            </div>
          </Reveal>
        </div>
        <p className="footer-text">© {new Date().getFullYear()} Séraphin Eyala · Développeur Full-Stack</p>
      </section>
    </>
  );
}
