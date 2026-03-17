import { useState, useEffect } from 'react';
import { FaReact, FaEnvelope, FaGithub, FaTimes } from 'react-icons/fa';
import { SiNextdotjs, SiVite, SiGoogleads, SiGoogleanalytics } from 'react-icons/si';
import '../styles/works.css';

const TECH_ICONS = {
  React:             { icon: FaReact,            color: '#61DAFB', label: 'React' },
  'Next.js':         { icon: SiNextdotjs,         color: '#000000', label: 'Next.js' },
  Vite:              { icon: SiVite,              color: '#646CFF', label: 'Vite' },
  'Google Ads':      { icon: SiGoogleads,         color: '#4285F4', label: 'Google Ads' },
  'Google Analytics':{ icon: SiGoogleanalytics,   color: '#E37400', label: 'Analytics' },
  EmailJS:           { icon: FaEnvelope,          color: '#194D33', label: 'EmailJS' },
};

function TechPill({ name }) {
  const entry = TECH_ICONS[name];
  if (!entry) return <span className="works-chip">{name}</span>;
  const Icon = entry.icon;
  return (
    <span className="works-chip works-chip--icon" title={entry.label}>
      <Icon style={{ color: entry.color, fontSize: '0.9rem' }} />
      <span>{entry.label}</span>
    </span>
  );
}

function PhotoModal({ photo, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="works-modal-backdrop" onClick={onClose}>
      <div className="works-modal" onClick={e => e.stopPropagation()}>
        <button className="works-modal-close" onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>
        <img src={photo.src} alt={photo.caption || 'Project screenshot'} className="works-modal-img" />
        {photo.caption && <p className="works-modal-caption">{photo.caption}</p>}
      </div>
    </div>
  );
}

const CLIENT_SITES = [
  {
    id: 'munts',
    name: 'Munts Landscaping',
    logo: '/images/muntsLogo.svg',
    url: 'muntslandscaping.ca',
    href: 'https://muntslandscaping.ca',
    description:
      'Full-stack client site for a local landscaping company. Built with pure React and Vite — fast, lightweight, and fully custom. Integrated EmailJS for seamless contact form handling. Ran Google Ads and Analytics campaigns to drive local traffic and measure conversion.',
    tech: ['React', 'Vite', 'Google Ads', 'Google Analytics', 'EmailJS'],
    accent: '#4A8C3F',
  },
  {
    id: 'magnum',
    name: 'Magnum PEI',
    logo: '/images/MagnumPEILogo.webp',
    url: 'magnum-pei.ca',
    href: 'https://magnum-pei.ca',
    description:
      'Property rental platform built with Next.js. Designed a modular content backend so the owner can independently add and manage long-term rental listings without developer involvement. Integrated EmailJS for direct inquiry handling.',
    tech: ['Next.js', 'EmailJS'],
    accent: '#3B6FBF',
  },
  {
    id: 'harpers',
    name: "Harper's Property Services",
    logo: '/images/HarperPropertyServices.webp',
    url: 'harperpropertyservices.ca',
    href: 'https://www.harperpropertyservices.ca/',
    description:
      'Service company website built with pure React and Vite. Clean, fast, and optimised for local search. Integrated EmailJS for contact and quote requests. Managed Google Ads and Analytics to track leads and grow organic reach.',
    tech: ['React', 'Vite', 'Google Ads', 'Google Analytics', 'EmailJS'],
    accent: '#B06030',
  },
];

const AI_PROJECTS = [
  {
    id: 'signala',
    name: 'Signala',
    repo: 'https://github.com/WaltDeJong/Signala',
    description:
      'Signala is a Next.js web application built to track and visualize Canadian labour market data — unemployment, wages, job vacancies, sector shifts, and regional employment. Features a PostgreSQL backend, dynamic Plotly charts, and a JWT-protected admin panel. Powered by three AI agents built on the Anthropic Claude API: a Chart Agent that generates and updates Plotly visualizations from plain-language prompts, an Article Agent that drafts and publishes labour market analysis, and a Media Manager Agent that handles image assets across the platform.',
    tech: [],
    photos: [
      {
        src: '/images/SignalaDashboard.webp',
        caption: 'A JWT-protected control panel for managing all site content and data. From a single interface you can create datasets, launch scrapers, write and publish articles, build narrative overlays, and review AI-generated chart previews before they go live.',
      },
      {
        src: '/images/SignalaChartAgent.webp',
        caption: 'An AI agent powered by Claude that builds and updates Plotly charts directly from database records. Given a plain-language prompt, it queries existing datasets, scrapes additional Statistics Canada data if needed, builds the chart configuration, and saves it so the public site serves it immediately — with a preview/approval step when rebuilding existing charts.',
      },
      {
        src: '/images/SignalaTools.webp',
        caption: 'A suite of 8 Statistics Canada scrapers that fetch CSV exports directly from StatCan, normalize the records, and upsert them into the database. Each scraper targets a specific table covering employment trends, job vacancies, earnings, EI claims, hours worked, job permanency, education, and regional labour data.',
      },
    ],
    status: 'active',
  },
  {
    id: 'survivor',
    name: 'LLM Survivor',
    repo: 'https://github.com/WaltDeJong/AgentSurvivor',
    description:
      'LLM Survivor is a fully automated social strategy game where eight AI agents — drawn from Anthropic, OpenAI, Google, and xAI — compete against each other with no human involvement once the game begins. Each agent is given a unique persona and has no knowledge of its own model identity or any other agent\'s, forcing them to navigate alliances and rivalries purely through in-game interaction. The agents communicate through group chats, form private back-channel alliances, compete in word puzzles, and vote each other out at tribal council — all driven by live API calls to frontier models. A ninth agent plays Jeff Probst, hosting tribal council, asking probing questions, and narrating eliminations. The result is an emergent social experiment: watch how different model architectures bluff, scheme, and build trust when their only tool is language.',
    tech: [],
    photos: [
      {
        src: '/images/SurvivorScreen.webp',
        caption: 'The home screen displays the full cast of eight agents as color-coded badges showing each player\'s name alongside their underlying model. From here you can launch a new game with one click or revisit any past game\'s full event log from the history list.',
      },
      {
        src: '/images/SurvivorChallenge.webp',
        caption: 'The challenge screen shows the live Wheel-of-Fortune-style puzzle board for each tribe side by side, updating as agents guess letters, fumble, or attempt a solve. A step-through action log lets you replay the challenge turn by turn to see exactly which agent made each decision and whether it paid off.',
      },
      {
        src: '/images/SurvivorSocial.webp',
        caption: 'Surfaces all of the losing tribe\'s communication for the round, toggling between the group chat and each private one-on-one conversation via tabbed navigation. This is where agent strategy becomes most visible — alliances form, votes get floated, and agents say very different things depending on who they think is listening.',
      },
    ],
    status: 'active',
  },
];

export default function Works() {
  const [activePhoto, setActivePhoto] = useState(null);

  return (
    <section className="works-section" id="works">
      <div className="works-inner">

        {/* ── Heading ── */}
        <div className="works-heading-area">
          <p className="works-eyebrow">Portfolio</p>
          <h2 className="works-title">WORK & PROJECTS</h2>
          <p className="works-sub">
            Client sites built and deployed end-to-end, and agentic AI systems built for real-world tasks.
          </p>
        </div>

        {/* ── Client Sites ── */}
        <div className="works-group">
          <p className="works-group-label">Client Work</p>
          <div className="works-grid works-grid--3">
            {CLIENT_SITES.map(site => (
              <a
                key={site.id}
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="works-card works-card--site"
                style={{ '--accent': site.accent }}
              >
                <div className="works-logo-header">
                  <img
                    src={site.logo}
                    alt={site.name}
                    className="works-client-logo"
                    loading="lazy"
                    decoding="async"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="works-card-body">
                  <div className="works-card-accent-bar" style={{ background: site.accent }} />
                  <h3 className="works-card-title">{site.name}</h3>
                  <p className="works-card-desc">{site.description}</p>
                  <div className="works-chips">
                    {site.tech.map(t => <TechPill key={t} name={t} />)}
                  </div>
                  <span className="works-card-link" style={{ color: site.accent }}>
                    Visit site →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── AI / Agentic Projects ── */}
        <div className="works-group">
          <p className="works-group-label">AI &amp; Agent Projects</p>
          <div className="works-grid works-grid--2">
            {AI_PROJECTS.map(proj => (
              <div key={proj.id} className="works-card works-card--proj">

                {/* Photos row — always 3 slots */}
                <div className="works-proj-photos">
                  {[0, 1, 2].map(i => {
                    const raw = proj.photos[i];
                    const photo = raw
                      ? typeof raw === 'string'
                        ? { src: raw, caption: '' }
                        : raw
                      : null;
                    return photo ? (
                      <button
                        key={i}
                        className="works-proj-photo-btn"
                        onClick={() => setActivePhoto(photo)}
                        aria-label={`View photo ${i + 1}`}
                      >
                        <img
                          src={photo.src}
                          alt={photo.caption || `${proj.name} screenshot ${i + 1}`}
                          className="works-proj-photo"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="works-proj-photo-overlay">View</span>
                      </button>
                    ) : (
                      <div key={i} className="works-proj-photo-placeholder">
                        <span>Photo</span>
                      </div>
                    );
                  })}
                </div>

                {/* Card content */}
                <div className="works-card-body">
                  <div className="works-card-accent-bar works-card-accent-bar--green" />
                  <h3 className="works-card-title">{proj.name}</h3>
                  <p className={`works-card-desc${proj.status === 'coming soon' ? ' works-card-desc--muted' : ''}`}>
                    {proj.description}
                  </p>
                  {proj.tech.length > 0 && (
                    <div className="works-chips">
                      {proj.tech.map(t => <TechPill key={t} name={t} />)}
                    </div>
                  )}
                  <a
                    href={proj.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="works-card-link works-card-link--github"
                    onClick={e => e.stopPropagation()}
                  >
                    <FaGithub style={{ marginRight: 5 }} />
                    View on GitHub →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Photo Modal ── */}
      {activePhoto && (
        <PhotoModal photo={activePhoto} onClose={() => setActivePhoto(null)} />
      )}
    </section>
  );
}
