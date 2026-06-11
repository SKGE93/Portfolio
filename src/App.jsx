import { useState, useEffect } from 'react';
import TargetCursor from './components/TargetCursor';
import LogoLoop from './components/LogoLoop';
import ASCIIText from './components/ASCIIText';
import CurvedLoop from './components/CurvedLoop';
import ElectricBorder from './components/ElectricBorder';
import {
  SiReact, SiAngular, SiTypescript, SiJavascript, SiPhp,
  SiFlutter, SiDart, SiHtml5, SiCss, SiGit,
  SiPostgresql, SiMongodb, SiRedis, SiSupabase,
  SiDocker, SiLinux, SiNodedotjs, SiWordpress,
  SiGoogleappsscript, SiAirtable, SiVite, SiCockroachlabs,
  SiPython, SiFastapi, SiGooglecloud, SiLatex, SiJsonwebtokens
} from 'react-icons/si';
import { FaJava, FaCertificate } from 'react-icons/fa';
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
    desc: 'Application de recherche de films consommant l\'API REST TMDB, avec page de détail et interface en français. SPA React avec hooks personnalisés, recherche avec debounce, routing client-side via React Router, requêtes HTTP Axios. Affichage des films populaires, synopsis, note, date de sortie.',
    tech: ['React', 'Vite', 'React Router', 'Axios', 'TMDB API', 'Hooks'],
    img: './IMG/CineSearch.png.png',
    link: 'https://github.com/SKGE93/cine-search',
    color: '#00ff41'
  },
  {
    title: 'WeatherDash',
    desc: 'Dashboard météo temps réel affichant des données atmosphériques avec navigation multi-vues. Architecture orientée services Angular, Observables RxJS, dependency injection, lifecycle hooks, graphiques interactifs Chart.js. Autocomplétion de villes, prévisions sur 24h.',
    tech: ['Angular 19', 'TypeScript', 'Chart.js', 'RxJS', 'OpenWeatherMap API'],
    img: './IMG/WeatherDash.png',
    link: 'https://github.com/SKGE93/weather-dash',
    color: '#00f3ff'
  },
  {
    title: 'OtakuGo',
    desc: 'Application mobile cross-platform suggérant des contenus selon les préférences utilisateur. Sélection des genres, moteur de recommandation, fiches détaillées par animé avec synopsis, note et épisodes. Persistance des données en JSON local. Réalisé en équipe de 5 développeurs.',
    tech: ['Flutter', 'Dart', 'JSON', 'Cross-platform'],
    img: './IMG/AnimeApp.png.png',
    link: 'https://github.com/SKGE93/Application-mobile-de-recommendations-anime',
    color: '#ff00ff'
  },
  {
    title: 'Messagerie Instantanée',
    desc: 'Application de messagerie temps réel avec une particularité — chaque utilisateur doit annoter les messages pour continuer à échanger. Échanges via WebSocket (Ratchet), back-end PHP avec architecture MVC, interface responsive conçue en équipe. Projet SAE en groupe.',
    tech: ['PHP', 'WebSocket', 'Ratchet', 'JavaScript', 'MVC'],
    img: './IMG/message.png',
    link: 'https://github.com/Cheick6/SAE_S4',
    color: '#00ff41'
  },
  {
    title: 'Basquiat & Warhol',
    desc: 'Site web fictif présentant une exposition imaginée autour des oeuvres collaboratives de Basquiat et Warhol. Présentation des artistes, traduction anglaise dynamique via JavaScript, intégration vidéo immersive. Maquettes UI/UX réalisées sur Figma avant intégration.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    img: './IMG/expo.png',
    link: 'https://github.com/SKGE93/Expo_Basquiat',
    color: '#00f3ff'
  },
  {
    title: 'Gestion Utilisateurs — FastAPI',
    desc: 'Backend de gestion d\'utilisateurs avec architecture en couches (routers, services, modèles). ORM SQLAlchemy pour mapper des modèles Python sur une base SQL, gestion de sessions et requêtes propres sans SQL brut. Pratique du TDD — écriture des tests avant le code, séparation des responsabilités, nommage clair et documentation.',
    tech: ['Python', 'FastAPI', 'SQLAlchemy', 'TDD', 'REST API'],
    img: './IMG/fastapi.png',
    link: null,
    color: '#00ff41'
  },
  {
    title: 'Shapes — Dessin Java',
    desc: 'Application graphique Java pour dessiner des formes géométriques — maisons, montagnes, paysages. Modélisation UML des classes de formes, composition de scènes complexes, gestion des exceptions avec try-catch. Premier contact avec les bibliothèques externes et la POO.',
    tech: ['Java', 'UML', 'OOP', 'Bibliothèque graphique'],
    img: './IMG/imgMaison.png',
    link: null,
    color: '#ff00ff'
  },
];

const experiences = [
  {
    date: 'Mars — Juin 2026',
    title: 'Stagiaire IT — IFFP',
    desc: 'Institut Français de Formation Professionnelle — Nanterre',
    details: [
      'KioskSign — Borne d\'accueil interactive développée en Apps Script + HTML/CSS, affichant des informations dynamiques via Google Sheets',
      'Signatures Gmail — Script clasp/Apps Script de déploiement automatique de signatures HTML personnalisées pour tout le domaine Google Workspace',
      'Workspace Cleaner — Outil Apps Script de nettoyage automatique des fichiers orphelins et doublons dans Google Drive partagé',
      'Radar Drive — Script Apps Script analysant les permissions Drive et générant un rapport de conformité sur Google Sheets',
      'Dashboard MDP — Tableau de bord Apps Script + Google Sheets pour le suivi des changements de mots de passe utilisateurs',
      'Onboarding Professeurs — Automatisation Apps Script du processus d\'intégration des nouveaux professeurs (comptes, accès, documents)',
      'Modernisation réseau — Segmentation VLAN, renforcement sécurité, administration Google Workspace',
      'Refonte WordPress — Conception et optimisation du site vitrine sous WordPress / Elementor',
      'Rédaction de documentation technique complète pour chaque projet'
    ]
  },
  {
    date: '2023 — 2026',
    title: 'BUT Informatique — IUT de Villetaneuse',
    desc: 'Développement d\'applications — USPN, Île-de-France',
    details: [
      'Développement full-stack — React, Angular, PHP, Java',
      'Bases de données — PostgreSQL, MongoDB, Redis',
      'Algorithmique, structures de données, tests unitaires',
      'Gestion de projet Agile / Scrum, diagramme de Gantt',
      'Droit numérique, travail en équipe produit'
    ]
  },
  {
    date: 'Fév. — Mars 2025',
    title: 'Stagiaire Informatique & Web — Association JLF',
    desc: 'Association Jean Luc François — Pantin',
    details: [
      'Refonte et maintenance du site WordPress — optimisation thèmes / extensions, performances améliorées',
      'Mise en place de workflows No-Code (Airtable, Zapier) — réduction des tâches manuelles répétitives',
      'Force de proposition technique, adaptabilité'
    ]
  },
  {
    date: '2024',
    title: 'Agent de sécurité — Événementiel',
    desc: 'Gestion de la sécurité lors d\'événements',
    details: [
      'Communication avec le public et les équipes',
      'Gestion du stress en situation imprévue',
      'Rigueur, ponctualité, sens des responsabilités'
    ]
  },
  {
    date: '2021 — 2022',
    title: 'BAC STI2D — Lycée Le Corbusier',
    desc: 'Aubervilliers',
    details: [
      'Spécialité Sciences et Technologies de l\'Industrie et du Développement Durable',
      'Découverte de la programmation et des systèmes informatiques'
    ]
  },
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedExp, setExpandedExp] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = ['about', 'skills', 'projects', 'experience', 'certifications', 'contact'];

  return (
    <>
      <TargetCursor spinDuration={3} hideDefaultCursor={true} parallaxOn={true} />

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#hero" className="nav-logo">[S.E]</a>
          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            {navLinks.map(id => (
              <li key={id}>
                <a href={`#${id}`} onClick={() => setMenuOpen(false)}>
                  {'>'} {id}
                </a>
              </li>
            ))}
          </ul>
          <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="hero-section">
        <div className="hero-ascii-bg">
          <ASCIIText text="SERAPHIN" enableWaves={true} asciiFontSize={8} textColor="#00ff41" />
        </div>
        <div className="hero-overlay">
          <div className="container hero-content">
            <p className="hero-label">&gt; system.init()</p>
            <h1 className="hero-name">Séraphin <span className="text-cyan">Eyala</span></h1>
            <p className="hero-subtitle">
              <span className="typing-cursor">Développeur Full-Stack — Orientation Data & IA</span>
            </p>
            <p className="hero-status">
              <span className="pulse-dot" /> Recherche un stage de 6 semaines à 2 mois — Disponible juin 2026
            </p>
            <div className="hero-cta">
              <a href="#projects" className="btn btn-primary cursor-target">&gt; voir_projets()</a>
              <a href="#contact" className="btn btn-cyan cursor-target">&gt; contact()</a>
            </div>
          </div>
        </div>
      </section>

      {/* CurvedLoop separator */}
      <CurvedLoop
        marqueeText="Developer  ✦  Fan d'anime  ✦  Naruto > One Piece  ✦  Fairy Tail  ✦  SNK  ✦  Code addict  ✦  Gamer  ✦  Gym  ✦  Veille tech  ✦  Hacker News  ✦  Autodidacte  ✦  "
        speed={1.5}
        curveAmount={300}
        direction="left"
        interactive={true}
      />

      {/* About */}
      <section id="about" className="section">
        <div className="container">
          <p className="section-label">who_i_am</p>
          <h2 className="section-title">À propos</h2>
          <div className="about-grid">
            <div className="glass-card cursor-target">
              <p>
                Étudiant en 3ème année de <strong>BUT Informatique</strong> à l'IUT de
                Villetaneuse (USPN), passionné par le développement web et mobile.
                Récemment en stage à l'<strong>IFFP</strong> à Nanterre où j'ai automatisé
                des processus métiers (Apps Script, clasp) et conçu des solutions web.
                Actuellement <strong>à la recherche d'un stage</strong> de 6 semaines à 2 mois.
              </p>
              <p style={{ marginTop: 16 }}>
                Curieux et autodidacte, j'apprends en dehors des cours — React, Angular,
                Flutter, FastAPI. Mon objectif est d'intégrer le <strong>MSc Data Engineering à
                Aivancity</strong>, une école spécialisée en IA et data. Je fais de la
                veille active sur Hacker News, Reddit et Dev.to autour de l'IA
                générative et des LLMs.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-card glass-card cursor-target">
                <span className="stat-num">7</span>
                <span className="stat-label">Projets réalisés</span>
              </div>
              <div className="stat-card glass-card cursor-target">
                <span className="stat-num">3</span>
                <span className="stat-label">Années de formation</span>
              </div>
              <div className="stat-card glass-card cursor-target">
                <span className="stat-num">25+</span>
                <span className="stat-label">Technologies maîtrisées</span>
              </div>
              <div className="stat-card glass-card cursor-target">
                <span className="stat-num">2</span>
                <span className="stat-label">Certifications</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills / LogoLoop */}
      <section id="skills" className="section">
        <div className="container">
          <p className="section-label">cat skills.json</p>
          <h2 className="section-title">Technologies</h2>
        </div>
        <div className="logoloop-wrapper">
          <LogoLoop
            logos={techLogos}
            speed={80}
            direction="left"
            logoHeight={40}
            gap={48}
            fadeOut
            fadeOutColor="#0a0a0f"
          />
        </div>
        <div className="container" style={{ marginTop: 48 }}>
          <div className="skills-grid">
            {[
              { title: 'Front-end', items: 'React, Angular 19, TypeScript, JavaScript, HTML/CSS, Vite, Chart.js, React Router, Axios' },
              { title: 'Back-end & API', items: 'Python, FastAPI, SQLAlchemy, PHP (MVC), Java, Node.js, REST API, WebSocket, OAuth/JWT' },
              { title: 'Bases de données', items: 'PostgreSQL, MongoDB, Redis, CockroachDB, Supabase, SQL, ORM' },
              { title: 'Mobile', items: 'Flutter, Dart, JSON, applications cross-platform' },
              { title: 'Outils & DevOps', items: 'Git, GitHub, Docker, Linux, GCP, Google Workspace, clasp, LaTeX, VS Code, IntelliJ' },
              { title: 'Méthodes & Autres', items: 'Agile / Scrum, TDD, Apps Script, WordPress / Elementor, Airtable, Zapier, Aivancity' },
            ].map(cat => (
              <div key={cat.title} className="glass-card skill-cat cursor-target">
                <h3>{`> ${cat.title}`}</h3>
                <p>{cat.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="section">
        <div className="container">
          <p className="section-label">ls ~/projects</p>
          <h2 className="section-title">Projets</h2>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <ElectricBorder key={i} color={p.color} speed={0.8} chaos={0.08} borderRadius={8}>
                <div className="project-card cursor-target">
                  <img src={p.img} alt={p.title} />
                  <div className="project-card-body">
                    <h3 className="project-card-title" style={{ color: p.color }}>{p.title}</h3>
                    <p className="project-card-desc">{p.desc}</p>
                    <div className="project-tech">
                      {p.tech.map(t => <span key={t}>{t}</span>)}
                    </div>
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                        &gt; voir_code()
                      </a>
                    )}
                  </div>
                </div>
              </ElectricBorder>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="section">
        <div className="container">
          <p className="section-label">git log --oneline</p>
          <h2 className="section-title">Parcours</h2>
          <div className="timeline">
            {experiences.map((exp, i) => (
              <div
                key={i}
                className={`timeline-item cursor-target ${exp.current ? 'current' : ''} ${expandedExp === i ? 'expanded' : ''}`}
                onClick={() => setExpandedExp(expandedExp === i ? null : i)}
                style={{ cursor: 'pointer' }}
              >
                <div className="timeline-header">
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
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section id="certifications" className="section">
        <div className="container">
          <p className="section-label">cat certifications.json</p>
          <h2 className="section-title">Certifications</h2>
          <div className="certifications-grid">
            <a
              href="https://www.credly.com/badges/b901991c-8e28-4cdc-be20-88fada58bb4e/public_url"
              target="_blank"
              rel="noreferrer"
              className="glass-card cert-card cursor-target"
            >
              <FaCertificate className="cert-icon" />
              <div>
                <h3 className="cert-title">AI Literacy</h3>
                <p className="cert-issuer">IBM SkillsBuild</p>
                <span className="cert-year">2026</span>
              </div>
            </a>
            <a
              href="https://verify.skilljar.com/c/oxt2ce3aw22r"
              target="_blank"
              rel="noreferrer"
              className="glass-card cert-card cursor-target"
            >
              <FaCertificate className="cert-icon" />
              <div>
                <h3 className="cert-title">Claude 101</h3>
                <p className="cert-issuer">Anthropic</p>
                <span className="cert-year">2026</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="section-label">ping contact</p>
          <h2 className="section-title">Contact</h2>
          <p className="contact-text">
            Un projet, une opportunité ou juste envie de discuter tech ?
          </p>
          <div className="contact-links">
            <a href="mailto:eyalas472@gmail.com" className="btn btn-primary cursor-target">
              &gt; send_mail()
            </a>
            <a href="https://github.com/SKGE93" target="_blank" rel="noreferrer" className="btn btn-cyan cursor-target">
              &gt; github()
            </a>
            <a href="https://linkedin.com/in/seraphin-eyala" target="_blank" rel="noreferrer" className="btn btn-cyan cursor-target">
              &gt; linkedin()
            </a>
          </div>
          <p className="footer-text">
            &copy; 2026 Séraphin Eyala
          </p>
        </div>
      </section>
    </>
  );
}
