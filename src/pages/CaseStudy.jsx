import { useEffect, useState } from 'react';
import './CaseStudy.css';

// Turns **text** into <strong> so case study data can stay plain strings.
function rich(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

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
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function Visuals({ items }) {
  if (!items?.length) return null;
  return (
    <div className={items.length > 1 ? 'dvf-visual-pair' : undefined}>
      {items.map(v => <Visual key={v.src} {...v} />)}
    </div>
  );
}

function Blocks({ blocks }) {
  return (
    <div className="dvf-prose">
      {blocks.map((b, i) => (Array.isArray(b)
        ? <ul key={i} className="dvf-list">{b.map(li => <li key={li}>{rich(li)}</li>)}</ul>
        : <p key={i}>{rich(b)}</p>))}
    </div>
  );
}

export default function CaseStudy({ study }) {
  const {
    docTitle, eyebrow, title, hook, meta, repo, facts, context, flow, stack,
    steps, challenges, result, learnings, limits, next, scopeNote,
  } = study;

  useEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = `${docTitle} — Séraphin Eyala`;
    return () => { document.title = prev; };
  }, [docTitle]);

  let n = 0;
  const head = (label, heading) => {
    n += 1;
    return (
      <>
        <p className="eyebrow">{`${String(n).padStart(2, '0')} · ${label}`}</p>
        <h2 className="dvf-h2">{heading}</h2>
      </>
    );
  };

  return (
    <main className="dvf-page">
      <div className="container dvf-container">
        <a href="#projects" className="dvf-back">← Retour aux projets</a>

        <header className="dvf-header">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="dvf-title">{title}</h1>
          <p className="dvf-hook">{hook}</p>
          <ul className="dvf-meta">{meta.map(m => <li key={m}>{m}</li>)}</ul>
          {repo && (
            <div className="dvf-cta">
              <a href={repo} target="_blank" rel="noreferrer" className="btn btn-primary">Voir le code</a>
            </div>
          )}
        </header>

        {facts && (
          <section className="dvf-section">
            {head('En bref', 'L’essentiel en 30 secondes')}
            <div className="dvf-facts">
              {facts.map(f => (
                <div key={f.label} className="dvf-card dvf-fact">
                  <span className="dvf-fact-num">{f.num}</span>
                  <span className="dvf-fact-label">{f.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {context && (
          <section className="dvf-section">
            {head('Contexte', context.title)}
            <Blocks blocks={context.blocks} />
          </section>
        )}

        {flow && (
          <section className="dvf-section">
            {head('Architecture', 'La solution en un schéma')}
            <ol className="dvf-flow" aria-label="Schéma d’architecture">
              {flow.nodes.map(node => (
                <li key={node.name} className={`dvf-node dvf-node--${node.tone}`}>
                  <span className="dvf-node-name">{node.name}</span>
                  <span className="dvf-node-sub">{node.sub}</span>
                </li>
              ))}
            </ol>
            {flow.note && <p className="dvf-flow-note">{rich(flow.note)}</p>}
          </section>
        )}

        {stack && (
          <section className="dvf-section">
            {head('Stack', 'Outils utilisés')}
            <div className="dvf-stack">
              {stack.map(s => (
                <div key={s.cat} className="dvf-stack-row">
                  <span className="dvf-stack-cat">{s.cat}</span>
                  <div className="project-tech">{s.items.map(t => <span key={t}>{t}</span>)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {steps && (
          <section className="dvf-section">
            {head('Étapes', 'Étapes clés')}
            <ol className="dvf-steps">
              {steps.map((s, i) => (
                <li key={s.title} className="dvf-step">
                  <span className="dvf-step-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="dvf-step-body">
                    <h3>{s.title}</h3>
                    {s.text.map((t, j) => <p key={j}>{rich(t)}</p>)}
                    <Visuals items={s.visuals} />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {challenges && (
          <section className="dvf-section">
            {head(challenges.label, challenges.title)}
            <div className="dvf-challenges">
              {challenges.items.map(c => (
                <div key={c.a} className="dvf-card dvf-challenge">
                  <p className="dvf-challenge-problem"><span>{challenges.tags[0]}</span>{rich(c.a)}</p>
                  <p className="dvf-challenge-solution"><span>{challenges.tags[1]}</span>{rich(c.b)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {result && (
          <section className="dvf-section">
            {head('Résultat', 'Ce que ça donne')}
            <Blocks blocks={result.blocks} />
            {result.table && (
              <>
                <div className="dvf-table-wrap">
                  <table className="dvf-table">
                    <thead><tr>{result.table.head.map(h => <th key={h}>{h}</th>)}</tr></thead>
                    <tbody>
                      {result.table.rows.map(r => (
                        <tr key={r[0]}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {result.table.note && <p className="dvf-small">{result.table.note}</p>}
              </>
            )}
            <Visuals items={result.visuals} />
          </section>
        )}

        {learnings && (
          <section className="dvf-section">
            {head('Apprentissages', 'Ce que j’ai appris')}
            <div className="dvf-learnings">
              {learnings.map(l => (
                <div key={l.concept} className="dvf-card dvf-learning">
                  <h3>{l.concept}</h3>
                  <p>{rich(l.text)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(limits || next) && (
          <section className="dvf-section">
            {head('Limites', 'Limites et suite')}
            <div className="dvf-two-col">
              {limits && (
                <div>
                  <h3 className="dvf-h3">Limites connues</h3>
                  <ul className="dvf-list">{limits.map(l => <li key={l}>{rich(l)}</li>)}</ul>
                </div>
              )}
              {next && (
                <div>
                  <h3 className="dvf-h3">Pistes d’amélioration</h3>
                  <ul className="dvf-list">{next.map(x => <li key={x}>{rich(x)}</li>)}</ul>
                </div>
              )}
            </div>
            {scopeNote && <p className="dvf-small">{scopeNote}</p>}
          </section>
        )}

        <section className="dvf-section">
          {head('Liens', 'Aller plus loin')}
          <div className="dvf-cta">
            {repo && <a href={repo} target="_blank" rel="noreferrer" className="btn btn-primary">Code source sur GitHub</a>}
            <a href="#projects" className="btn btn-ghost">Autres projets</a>
          </div>
        </section>
      </div>
    </main>
  );
}
