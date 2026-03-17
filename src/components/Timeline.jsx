import React, { useEffect, useRef, useState } from 'react';
import { FaCode } from 'react-icons/fa';
import '../styles/timeline.css';

// Uses Google's favicon service — reliable for public domains
const faviconUrl = (domain) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

// ── Single timeline entry ─────────────────────────────────────────────────────
function TimelineEntry({ entry }) {
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
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`tl-entry${visible ? ' tl-entry--visible' : ''}`}>
      {/* Dot sitting on the vertical rule */}
      <div className="tl-dot-col">
        <div className="tl-dot" />
      </div>

      <div className="tl-content">
        {/* Header: logo + title on the same line */}
        <div className="tl-header">
          <div className="tl-logo">{entry.logo}</div>
          <div className="tl-title-group">
            <h3 className="tl-title">{entry.title}</h3>
            {entry.badge && <span className="tl-badge">{entry.badge}</span>}
          </div>
        </div>

        <div className="tl-dates">{entry.dates}</div>
        <p className="tl-description">{entry.description}</p>

        {/* Row of client site favicons (Entry 3) */}
        {entry.links && (
          <div className="tl-site-links">
            {entry.links.map(({ domain }) => (
              <a
                key={domain}
                href={`https://${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                title={domain}
                className="tl-site-link"
              >
                <img
                  src={faviconUrl(domain)}
                  alt={domain}
                  width={24}
                  height={24}
                  onError={(e) => {
                    // Fallback: first letter of domain in a small circle
                    e.target.style.display = 'none';
                  }}
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Timeline section ──────────────────────────────────────────────────────────
function Timeline() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  // Grow the vertical rule downward as the user scrolls through the section
  useEffect(() => {
    const tick = () => {
      if (!sectionRef.current || !lineRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = Math.max(0, window.innerHeight - rect.top);
      lineRef.current.style.height = `${Math.min(scrolled, rect.height)}px`;
    };
    window.addEventListener('scroll', tick, { passive: true });
    tick(); // run once on mount in case section is already in view
    return () => window.removeEventListener('scroll', tick);
  }, []);

  // ── Entry definitions ───────────────────────────────────────────────────────
  const entries = [

    // ── ENTRY 1: DataAnnotation ─────────────────────────────────────────────
    {
      id: 1,
      title: 'Software Developer Specialist — Data Annotator',
      company: 'DataAnnotation.tech',
      dates: '2024 — 2026',
      logo: (
        <img
          src={faviconUrl('dataannotation.tech')}
          alt="DataAnnotation.tech"
          className="tl-favicon"
          width={32}
          height={32}
          onError={(e) => { e.target.style.opacity = 0; }}
        />
      ),
      description:
        'Two years evaluating and red teaming frontier AI models across software development, prompt engineering, business and finance use cases, and workflow analysis. Also reviewed and assessed the work of other annotators.',
    },

    // ── ENTRY 2: Signala.io ─────────────────────────────────────────────────
    {
      id: 2,
      title: 'Signala.io — Founder',
      dates: 'Ongoing',
      badge: 'In Development',
      logo: (
        // Text placeholder — replace with real logo when available
        <div className="tl-logo-circle" aria-label="Signala.io">S</div>
      ),
      description:
        'A data-driven Canadian jobs publication. Built a Postgres database backend, an admin UI with custom scraping tools for Statistics Canada and Employment Canada, and two AI agents that generate fact-based editorial content from live data. A third agent manages narrative updates across the site.',
    },

    // ── ENTRY 3: Independent Web Developer ─────────────────────────────────
    {
      id: 3,
      title: 'Web Developer — Independent',
      dates: '2018 — Present',
      logo: <FaCode className="tl-code-icon" aria-label="Web Developer" />,
      description:
        'Built and deployed client websites across property management, health consulting, landscaping, and hospitality. Full stack from design to DigitalOcean deployment.',
      links: [
        { domain: 'magnum-pei.ca' },
        { domain: 'muntslandscaping.ca' },
        { domain: 'dejonghealthconsulting.com' },
        { domain: 'fusiondr.ca' },
      ],
    },

    // ── ADD ENTRY 4 AND BEYOND HERE ─────────────────────────────────────────
    // Each entry follows this shape:
    // {
    //   id: 4,
    //   title: 'Role — Company',
    //   dates: 'YYYY — YYYY',
    //   logo: <img src={faviconUrl('domain.com')} ... /> or a styled element,
    //   description: 'Short description.',
    //   badge: 'Optional badge text',   // optional
    //   links: [{ domain: 'site.com' }], // optional — shows favicon row
    // }

  ];

  return (
    <section className="tl-section" ref={sectionRef}>
      <div className="tl-container">
        {/* Vertical rule — grows downward via JS as user scrolls */}
        <div className="tl-line-track">
          <div className="tl-line" ref={lineRef} />
        </div>

        {entries.map((entry) => (
          <TimelineEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}

export default Timeline;
