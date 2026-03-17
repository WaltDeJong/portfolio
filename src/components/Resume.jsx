import React, { useEffect, useRef, useState } from 'react';
import { FaCode } from 'react-icons/fa';
import '../styles/resume.css';

const faviconUrl = (domain) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

// ── Logo renderer ────────────────────────────────────────────────────────────
function EntryLogo({ entry }) {
  if (entry.logoEl) return entry.logoEl;
  if (entry.logo) {
    return (
      <img
        src={entry.logo}
        alt={entry.company}
        className="rs-favicon"
        width={32}
        height={32}
        onError={(e) => { e.target.style.opacity = 0; }}
      />
    );
  }
  return null;
}

// ── Single timeline entry ────────────────────────────────────────────────────
function ResumeEntry({ entry }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`rs-entry rs-entry--${entry.type}${visible ? ' rs-entry--visible' : ''}`}
    >
      {/* Dot on the vertical rule */}
      <div className="rs-dot-col">
        <div className="rs-dot" />
      </div>

      <div className="rs-content">
        {/* Header row: logo + title + company + pills */}
        <div className="rs-header">
          <div className="rs-logo">
            <EntryLogo entry={entry} />
          </div>
          <div className="rs-title-group">
            <div className="rs-title-row">
              <h3 className="rs-title">{entry.title}</h3>
              <span className={`rs-type-pill rs-type-pill--${entry.type}`}>
                {entry.type === 'work' ? 'Work' : 'Education'}
              </span>
              {entry.badge && <span className="rs-badge">{entry.badge}</span>}
            </div>
            <div className="rs-company">{entry.company}</div>
          </div>
        </div>

        <div className="rs-dates">{entry.dates}</div>
        <p className="rs-description">{entry.description}</p>

        {/* Credential link (education entries) */}
        {entry.credential && (
          <a
            href={entry.credential}
            target="_blank"
            rel="noopener noreferrer"
            className="rs-credential"
          >
            View Credential →
          </a>
        )}

        {/* Skills chips */}
        {entry.skills && (
          <div className="rs-skills">
            {entry.skills.map((skill) => (
              <span key={skill} className="rs-skill">
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Client site favicons (freelance work entry) */}
        {entry.links && (
          <div className="rs-site-links">
            {entry.links.map(({ domain }) => (
              <a
                key={domain}
                href={`https://${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                title={domain}
                className="rs-site-link"
              >
                <img
                  src={faviconUrl(domain)}
                  alt={domain}
                  width={22}
                  height={22}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span>{domain}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Resume section ───────────────────────────────────────────────────────────
function Resume() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      if (!sectionRef.current || !lineRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = Math.max(0, window.innerHeight - rect.top);
      lineRef.current.style.height = `${Math.min(scrolled, rect.height)}px`;
    };
    window.addEventListener('scroll', tick, { passive: true });
    tick();
    return () => window.removeEventListener('scroll', tick);
  }, []);

  // ── Entries ────────────────────────────────────────────────────────────────
  // Ordered recent-first. type: 'work' | 'education'
  const entries = [

    // ── Signala.io ──────────────────────────────────────────────────────────
    {
      id: 1,
      type: 'work',
      title: 'Founder',
      company: 'Signala.io',
      dates: '2024 — Present',
      badge: 'In Development',
      logoEl: <div className="rs-logo-circle" aria-label="Signala.io">S</div>,
      description:
        'A data-driven Canadian jobs publication. Built a Postgres backend, an admin UI with custom scraping tools for Statistics Canada and Employment Canada, and two AI agents that generate fact-based editorial content from live data. A third agent manages narrative updates across the site.',
      skills: ['PostgreSQL', 'Node.js', 'React', 'AI Agents', 'Data Scraping'],
    },

    // ── DataAnnotation ──────────────────────────────────────────────────────
    {
      id: 2,
      type: 'work',
      title: 'Software Developer Specialist',
      company: 'DataAnnotation.tech',
      dates: '2024 — 2026',
      logo: faviconUrl('dataannotation.tech'),
      description:
        'Two years evaluating and red teaming frontier AI models across software development, prompt engineering, business and finance use cases, and workflow analysis. Also reviewed and assessed the work of other annotators.',
      skills: ['AI Evaluation', 'Prompt Engineering', 'Red Teaming', 'Code Review'],
    },

    // ── UBCx MicroMasters ───────────────────────────────────────────────────
    {
      id: 3,
      type: 'education',
      title: 'MicroMasters® in Software Development',
      company: 'UBCx / edX',
      dates: 'Completed',
      logo: '/images/UBCLogo.jpg',
      description:
        'Six rigorous graduate-level courses in software engineering, robust programming, and agile design — offered by UBCx in collaboration with edX. Focused on Java and TypeScript. Credits are eligible toward a UBC Master\'s degree.',
      credential: 'https://credentials.edx.org/credentials/2c72714f22124783a1999131e0f09176/',
      skills: ['Java', 'TypeScript', 'Software Design', 'Agile'],
    },

    // ── Independent Web Developer ───────────────────────────────────────────
    {
      id: 4,
      type: 'work',
      title: 'Web Developer',
      company: 'Independent / Freelance',
      dates: '2018 — Present',
      logoEl: <FaCode className="rs-code-icon" aria-label="Web Developer" />,
      description:
        'Built and deployed client websites across property management, health consulting, landscaping, and hospitality. Full stack from design to DigitalOcean deployment.',
      skills: ['React', 'Next.js', 'DigitalOcean', 'Full Stack'],
      links: [
        { domain: 'magnum-pei.ca' },
        { domain: 'muntslandscaping.ca' },
        { domain: 'dejonghealthconsulting.com' },
        { domain: 'fusiondr.ca' },
      ],
    },

    // ── McMaster ─────────────────────────────────────────────────────────────
    {
      id: 5,
      type: 'education',
      title: 'Psychology & Criminology',
      company: 'McMaster University',
      dates: 'Completed',
      logo: faviconUrl('mcmaster.ca'),
      description:
        'Bachelor\'s degree grounded in human behaviour, research methodology, and analytical thinking. The rigour of academic research and the habit of questioning assumptions carry directly into how I approach software problems today.',
    },

    // ── University of Guelph ─────────────────────────────────────────────────
    {
      id: 6,
      type: 'education',
      title: 'Horticulture Studies & Municipal Horticulturalist',
      company: 'University of Guelph',
      dates: 'Completed',
      logo: faviconUrl('uoguelph.ca'),
      description:
        'Horticultural studies that led to hands-on work as a municipal horticulturalist. Managing living systems at scale built instincts around planning, iteration, and working within constraints — all of which translate cleanly into software development.',
    },

  ];

  return (
    <section className="rs-section" ref={sectionRef} id="resume">
      <div className="rs-inner">

        {/* Section heading + narrative */}
        <div className="rs-heading">
          <h2 className="rs-section-title">
            Experience <span className="rs-amp">&amp;</span> Education
          </h2>
          <p className="rs-narrative">
            Not a traditional path — and that's the point. Psychology, horticulture, freelance web
            development, AI evaluation, and product building from scratch: every chapter added new
            tools for thinking in systems and building with precision. The common thread is curiosity
            that doesn't stop at disciplinary boundaries.
          </p>
        </div>

        {/* Timeline */}
        <div className="rs-container">
          <div className="rs-line-track">
            <div className="rs-line" ref={lineRef} />
          </div>

          {entries.map((entry) => (
            <ResumeEntry key={entry.id} entry={entry} />
          ))}
        </div>

      </div>
    </section>
  );
}

export default Resume;
