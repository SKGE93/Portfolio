import { useState, useEffect, useRef } from 'react';
import TargetCursor from './components/TargetCursor';
import LogoLoop from './components/LogoLoop';
import ASCIIText from './components/ASCIIText';
import CurvedLoop from './components/CurvedLoop';
import ElectricBorder from './components/ElectricBorder';
import {
  SiReact, SiAngular, SiTypescript, SiJavascript, SiPhp,
  SiFlutter, SiDart, SiHtml5, SiCss, SiGit,
  SiMysql, SiTailwindcss, SiFigma, SiNodedotjs
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import './App.css';

const techLogos = [
  { node: <SiReact />, title: 'React' },
  { node: <SiAngular />, title: 'Angular' },
  { node: <SiTypescript />, title: 'TypeScript' },
  { node: <SiJavascript />, title: 'JavaScript' },
  { node: <SiPhp />, title: 'PHP' },
  { node: <FaJava />, title: 'Java' },
  { node: <SiFlutter />, title: 'Flutter' },
  { node: <SiDart />, title: 'Dart' },
  { node: <SiHtml5 />, title: 'HTML5' },
  { node: <SiCss />, title: 'CSS3' },
  { node: <SiGit />, title: 'Git' },
  { node: <SiMysql />, title: 'MySQL' },
  { node: <SiTailwindcss />, title: 'Tailwind' },
  { node: <SiFigma />, title: 'Figma' },
  { node: <SiNodedotjs />, title: 'Node.js' },
];

const projects = [
  {
    title: 'CinéSearch',
    desc: 'Application web de recherche et exploration de films construite avec React et l\'API TMDB. Recherche dynamique, fiches détaillées, navigation SPA.',
    tech: ['React', 'Vite', 'React Router', 'Axios', 'TMDB API'],
    img: '/IMG/CineSearch.png.png',
    link: 'https://github.com/SKGE93/cine-search',
    color: '#00ff41'
  },
  {
    title: 'WeatherDash',
    desc: 'Application météo interactive avec graphiques de température sur 24h. Autocomplétion, données en temps réel via OpenWeatherMap.',
    tech: ['Angular 19', 'TypeScript', 'Chart.js', 'HttpClient'],
    img: '/IMG/WeatherDash.png',
    link: 'https://github.com/SKGE93/weather-dash',
    color: '#00f3ff'
  },
  {
    title: 'OtakuGo',
    desc: 'Application mobile cross-platform de recommandation d\'animés. Moteur de suggestion basé sur les préférences utilisateur.',
    tech: ['Flutter', 'Dart', 'JSON'],
    img: '/IMG/AnimeApp.png.png',
    link: 'https://github.com/SKGE93/Application-mobile-de-recommendations-anime',
    color: '#ff00ff'
  },
  {
    title: 'Messagerie Instantanée',
    desc: 'Application de chat temps réel avec système d\'annotations obligatoires des messages. Architecture MVC, WebSocket.',
    tech: ['PHP', 'WebSocket', 'Ratchet', 'JavaScript', 'MVC'],
    img: '/IMG/message.png',
    link: 'https://github.com/Cheick6/SAE_S4',
    color: '#00ff41'
  },
  {
    title: 'Basquiat & Warhol',
    desc: 'Site web d\'exposition fictive présentant les collaborations de Basquiat et Warhol. Traduction dynamique, vidéo immersive.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    img: '/IMG/expo.png',
    link: 'https://github.com/SKGE93/Expo_Basquiat',
    color: '#00f3ff'
  },
  {
    title: 'Shapes — Dessin Java',
    desc: 'Application graphique de dessin de formes géométriques. Modélisation UML, composition de scènes complexes.',
    tech: ['Java', 'UML', 'OOP'],
    img: '/IMG/imgMaison.png',
    link: null,
    color: '#ff00ff'
  },
];

const experiences = [
  { date: 'Avr. — Juin 2026', title: 'Stage Développeur — IFFP', desc: 'Développement d\'outils internes, maintenance d\'applications web. React, PHP, bases de données.', current: true },
  { date: '2023 — 2026', title: 'BUT Informatique — Paris', desc: 'Formation développement full-stack, bases de données, algorithmique, gestion de projet Agile.' },
  { date: '2024', title: 'Agent de sécurité — Événementiel', desc: 'Gestion de la sécurité lors d\'événements. Développement de soft skills — communication, gestion du stress.' },
  { date: '2023', title: 'Stage — Association JLF', desc: 'Développement web pour une association. Premiers projets concrets en HTML/CSS/JS.' },
  { date: '2023', title: 'Baccalauréat — Mention Bien', desc: 'Spécialités NSI et Mathématiques.' },
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = ['about', 'skills', 'projects', 'experience', 'contact'];

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
              <span className="typing-cursor">Développeur Full-Stack</span>
            </p>
            <p className="hero-status">
              <span className="pulse-dot" /> En stage — IFFP (Avr.–Juin 2026)
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
        marqueeText="Developer  ✦  Fan d'anime  ✦  Naruto > One Piece  ✦  Code addict  ✦  Gamer  ✦  "
        speed={1.5}
        curveAmount={300}
        direction="left"
        interactive={true}
      />

      {/* About */}
      <section id="about" className="section">
        <div className="container">
          <p className="section-label">whoami</p>
          <h2 className="section-title">À propos</h2>
          <div className="about-grid">
            <div className="glass-card">
              <p>
                Étudiant en 3ème année de <strong>BUT Informatique</strong> à Paris, passionné
                par le développement web et mobile. Actuellement en stage à l'<strong>IFFP</strong> où
                je développe des outils internes.
              </p>
              <p style={{ marginTop: 16 }}>
                Curieux et autodidacte, j'aime explorer de nouvelles technologies
                en dehors des cours — React, Angular, Flutter. Mon objectif est de
                créer des applications performantes et bien conçues.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-card glass-card cursor-target">
                <span className="stat-num">6</span>
                <span className="stat-label">Projets réalisés</span>
              </div>
              <div className="stat-card glass-card cursor-target">
                <span className="stat-num">3</span>
                <span className="stat-label">Années de formation</span>
              </div>
              <div className="stat-card glass-card cursor-target">
                <span className="stat-num">10+</span>
                <span className="stat-label">Technologies maîtrisées</span>
              </div>
              <div className="stat-card glass-card cursor-target">
                <span className="stat-num">2026</span>
                <span className="stat-label">Disponible en juin</span>
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
            speed={100}
            direction="left"
            logoHeight={40}
            gap={48}
            hoverSpeed={30}
            scaleOnHover
            fadeOut
            fadeOutColor="#0a0a0f"
          />
        </div>
        <div className="container" style={{ marginTop: 48 }}>
          <div className="skills-grid">
            {[
              { title: 'Frontend', items: 'React, Angular, TypeScript, HTML/CSS, Tailwind' },
              { title: 'Backend', items: 'PHP, Node.js, Java, SQL, REST API' },
              { title: 'Mobile', items: 'Flutter, Dart, JSON, Cross-platform' },
              { title: 'Outils', items: 'Git, Figma, VS Code, Agile/Scrum, MCP' },
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
              <div key={i} className={`timeline-item ${exp.current ? 'current' : ''}`}>
                <span className="timeline-date">{exp.date} {exp.current && '// en cours'}</span>
                <h3 className="timeline-title">{exp.title}</h3>
                <p className="timeline-desc">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="section-label">ssh contact@seraphin.dev</p>
          <h2 className="section-title">Contact</h2>
          <p className="contact-text">
            Un projet, une opportunité ou juste envie de discuter tech ?
          </p>
          <div className="contact-links">
            <a href="mailto:seraphineyala@gmail.com" className="btn btn-primary cursor-target">
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
            &copy; 2026 Séraphin Eyala — Built with React + coffee
          </p>
        </div>
      </section>
    </>
  );
}
