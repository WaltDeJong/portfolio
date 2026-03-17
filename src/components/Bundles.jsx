import React, { useState } from 'react';
import { FaCode, FaLeaf, FaHeart, FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import '../styles/bundles.css';

const faviconUrl = (domain) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

// ── Item card ────────────────────────────────────────────────────────────────
function ItemCard({ item, showLeadership }) {
  const isLit = showLeadership && item.leadership;

  return (
    <div className={`bn-item${isLit ? ' bn-item--lit' : ''}`}>
      {isLit && (
        <div className="bn-lit-tag">
          <FaStar aria-hidden="true" /> Leadership Thread
        </div>
      )}

      <div className="bn-item-header">
        <div className="bn-item-logo">
          {item.logoEl || (
            <img
              src={item.logo}
              alt={item.org}
              width={30}
              height={30}
              className="bn-favicon"
              onError={(e) => { e.target.style.opacity = 0; }}
            />
          )}
        </div>
        <div className="bn-item-meta">
          <div className="bn-item-top-row">
            <span className="bn-item-title">{item.title}</span>
            <span className={`bn-type bn-type--${item.type}`}>
              {item.type === 'work' ? 'Work' : 'Education'}
            </span>
            {item.badge && <span className="bn-badge">{item.badge}</span>}
          </div>
          <div className="bn-item-org">{item.org}</div>
        </div>
      </div>

      <p className="bn-item-desc">{item.description}</p>

      {item.credential && (
        <a
          href={item.credential}
          target="_blank"
          rel="noopener noreferrer"
          className="bn-credential"
        >
          View Credential <FaExternalLinkAlt aria-hidden="true" />
        </a>
      )}

      {item.skills && (
        <div className="bn-skills">
          {item.skills.map((s) => (
            <span key={s} className="bn-skill">{s}</span>
          ))}
        </div>
      )}

      {item.sites && (
        <div className="bn-sites">
          {item.sites.map((domain) => (
            <a
              key={domain}
              href={`https://${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              title={domain}
              className="bn-site"
            >
              <img
                src={faviconUrl(domain)}
                alt={domain}
                width={14}
                height={14}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span>{domain}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Bundle selector tab ──────────────────────────────────────────────────────
function BundleTab({ bundle, isActive, onClick }) {
  return (
    <button
      className={`bn-tab${isActive ? ' bn-tab--active' : ''}`}
      style={{ '--c': bundle.color }}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <div className="bn-tab-icon">{bundle.iconEl}</div>
      <div className="bn-tab-label">{bundle.label}</div>
      <div className="bn-tab-tagline">{bundle.tagline}</div>
      <div className="bn-tab-previews">
        {bundle.items.slice(0, 4).map((item) =>
          item.logoEl ? (
            <span key={item.id} className="bn-tab-preview-el">
              {React.cloneElement(item.logoEl, {
                style: { width: 14, height: 14, fontSize: 14 },
                'aria-hidden': true,
              })}
            </span>
          ) : (
            <img
              key={item.id}
              src={item.logo}
              alt=""
              width={14}
              height={14}
              className="bn-tab-preview-img"
              onError={(e) => { e.target.style.opacity = 0; }}
            />
          )
        )}
      </div>
      <div className="bn-tab-count">{bundle.items.length} items</div>
    </button>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────
function Bundles() {
  const [activeId, setActiveId] = useState('software');
  const [fading, setFading] = useState(false);
  const [showLeadership, setShowLeadership] = useState(false);

  // ── Bundle data ────────────────────────────────────────────────────────────
  const BUNDLES = [
    {
      id: 'software',
      label: 'Software Development',
      tagline: 'Building systems that think.',
      summary:
        'Full-stack engineering, AI model evaluation, and product development from the ground up — anchored by rigorous academic training and years of shipping real work across clients and personal projects.',
      color: '#2d7a4f',
      iconEl: <FaCode aria-hidden="true" />,
      items: [
        {
          id: 'signala',
          type: 'work',
          title: 'Founder',
          org: 'Signala.io',
          badge: 'In Development',
          logoEl: (
            <div className="bn-circle" aria-label="Signala.io">S</div>
          ),
          description:
            'A data-driven Canadian jobs publication. Postgres backend, custom scraping tools for Statistics Canada and Employment Canada, two AI agents that write fact-based editorial content from live data, and a third that manages site-wide narrative.',
          skills: ['PostgreSQL', 'Node.js', 'React', 'AI Agents', 'Scraping'],
          leadership: false,
        },
        {
          id: 'da',
          type: 'work',
          title: 'Software Developer Specialist',
          org: 'DataAnnotation.tech',
          logo: faviconUrl('dataannotation.tech'),
          description:
            'Two years evaluating and red-teaming frontier AI models across software development, prompt engineering, business and finance. Also reviewed and assessed the work of other annotators.',
          skills: ['AI Evaluation', 'Prompt Engineering', 'Red Teaming', 'Code Review'],
          leadership: true,
        },
        {
          id: 'freelance',
          type: 'work',
          title: 'Web Developer',
          org: 'Independent / Freelance',
          logoEl: <FaCode className="bn-icon-el" aria-label="Web Developer" />,
          description:
            'Full-stack sites for clients in property management, health consulting, landscaping, and hospitality. Design through DigitalOcean deployment.',
          skills: ['React', 'Next.js', 'DigitalOcean', 'Full Stack'],
          sites: [
            'magnum-pei.ca',
            'muntslandscaping.ca',
            'dejonghealthconsulting.com',
            'fusiondr.ca',
          ],
          leadership: false,
        },
        {
          id: 'ubcx',
          type: 'education',
          title: 'MicroMasters® — Software Development',
          org: 'UBCx / edX',
          logo: '/images/UBCLogo.jpg',
          description:
            'Six graduate-level courses from the University of British Columbia covering software engineering, robust programming, and agile design. Java and TypeScript focused. Credits eligible toward a UBC Master\'s.',
          skills: ['Java', 'TypeScript', 'Software Design', 'Agile'],
          credential: 'https://credentials.edx.org/credentials/2c72714f22124783a1999131e0f09176/',
          leadership: false,
        },
      ],
    },

    {
      id: 'human-services',
      label: 'Human Services',
      tagline: 'Navigating complexity with people at the centre.',
      summary:
        'Case management, parole supervision, and addictions counselling — built on a psychology and criminology foundation and sharpened by working with people in genuinely difficult circumstances. Every skill here transfers directly into how I approach ambiguous problems.',
      color: '#1E3A8A',
      iconEl: <FaHeart aria-hidden="true" />,
      items: [
        {
          id: 'john-howard',
          type: 'work',
          title: 'Case Manager',
          org: 'John Howard Society',
          logo: faviconUrl('johnhoward.ca'),
          description:
            'Supervised individuals on federal parole — risk and needs assessment, reintegration planning, crisis intervention, and coordination with community service providers.',
          skills: ['Case Management', 'Risk Assessment', 'Crisis Intervention', 'Report Writing'],
          leadership: true,
        },
        {
          id: 'mcmaster',
          type: 'education',
          title: 'Psychology & Criminology',
          org: 'McMaster University',
          logo: faviconUrl('mcmaster.ca'),
          description:
            "Bachelor's degree grounded in human behaviour, empirical research methodology, and the systems of criminal justice. The analytical framework it built shows up in every other chapter.",
          skills: ['Research Methods', 'Behavioural Analysis', 'Critical Thinking'],
          leadership: false,
        },
        {
          id: 'addictions',
          type: 'education',
          title: 'Addictions Counselling Certificate',
          org: 'Continuing Education',
          logoEl: (
            <div className="bn-circle bn-circle--blue" aria-label="Addictions Certificate">
              A
            </div>
          ),
          description:
            'Specialized training in substance use counselling, harm reduction frameworks, and motivational interviewing — applied directly in the case management role.',
          skills: ['Harm Reduction', 'Motivational Interviewing', 'Trauma-Informed Care'],
          leadership: false,
        },
      ],
    },

    {
      id: 'horticulture',
      label: 'Horticulture & Land',
      tagline: 'Growing things from the ground up.',
      summary:
        'From planting over 100,000 trees in remote northern terrain to leading grounds crews and designing public spaces — a chapter defined by physical discipline, seasonal systems work, and accountability for living things.',
      color: '#6B5C3E',
      iconEl: <FaLeaf aria-hidden="true" />,
      items: [
        {
          id: 'cemetery',
          type: 'work',
          title: 'Cemetery Leadhand',
          org: 'Municipal Cemetery',
          logoEl: (
            <div className="bn-circle bn-circle--earth" aria-label="Cemetery Leadhand">
              C
            </div>
          ),
          description:
            'Led a grounds maintenance crew across a large cemetery — scheduling, training, seasonal operations, and day-to-day accountability for site condition.',
          skills: ['Team Leadership', 'Scheduling', 'Grounds Management'],
          leadership: true,
        },
        {
          id: 'horticulturalist',
          type: 'work',
          title: 'Municipal Horticulturalist',
          org: 'City Parks & Recreation',
          logoEl: <FaLeaf className="bn-icon-el bn-icon-el--earth" aria-label="Municipal Horticulturalist" />,
          description:
            'Designed and maintained public green spaces across the city — multi-site planting schedules, seasonal care plans, and hands-on installation.',
          skills: ['Landscape Design', 'Project Planning', 'Plant Biology'],
          leadership: false,
        },
        {
          id: 'treeplanter',
          type: 'work',
          title: 'Tree Planter',
          org: 'Northern Canada',
          logoEl: <FaLeaf className="bn-icon-el bn-icon-el--earth" aria-label="Tree Planter" />,
          description:
            'Planted over 100,000 trees in remote northern terrain under demanding physical conditions. Built resilience, output focus, and the ability to sustain performance over long seasons.',
          skills: ['Physical Endurance', 'Remote Work', 'Environmental Stewardship'],
          leadership: false,
        },
        {
          id: 'guelph',
          type: 'education',
          title: 'Horticulture Studies',
          org: 'University of Guelph',
          logo: faviconUrl('uoguelph.ca'),
          description:
            'Formal training in plant science, landscape design, and environmental systems — the academic foundation for the career that followed.',
          skills: ['Plant Science', 'Landscape Design', 'Environmental Systems'],
          leadership: false,
        },
      ],
    },
  ];

  const activeBundle = BUNDLES.find((b) => b.id === activeId);

  const handleTabClick = (id) => {
    if (id === activeId) return;
    setFading(true);
    setTimeout(() => {
      setActiveId(id);
      setFading(false);
    }, 180);
  };

  // All leadership-tagged items across every bundle
  const leadershipItems = BUNDLES.flatMap((b) =>
    b.items
      .filter((item) => item.leadership)
      .map((item) => ({ ...item, bundleLabel: b.label, bundleColor: b.color }))
  );

  return (
    <section className="bn-section" id="resume">
      <div className="bn-inner">

        {/* Heading */}
        <div className="bn-heading">
          <h2 className="bn-section-title">Career Chapters</h2>
          <p className="bn-narrative">
            Three distinct careers, not one. Software development, human services, and horticulture
            aren't detours from each other — they're the evidence. Each chapter built a different
            set of tools for thinking: about systems, about people, about growth under pressure.
            The thread running through all of it is the same curiosity about how things work
            and the same drive to make them work better.
          </p>
        </div>

        {/* Bundle selector tabs */}
        <div className="bn-tabs">
          {BUNDLES.map((bundle) => (
            <BundleTab
              key={bundle.id}
              bundle={bundle}
              isActive={bundle.id === activeId}
              onClick={() => handleTabClick(bundle.id)}
            />
          ))}
        </div>

        {/* Expanded panel */}
        <div
          className={`bn-panel${fading ? ' bn-panel--fading' : ''}`}
          style={{ '--c': activeBundle.color }}
        >
          <div className="bn-panel-header">
            <span className="bn-panel-icon">{activeBundle.iconEl}</span>
            <div>
              <h3 className="bn-panel-title">{activeBundle.label}</h3>
              <p className="bn-panel-summary">{activeBundle.summary}</p>
            </div>
          </div>

          <div className="bn-grid">
            {activeBundle.items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                showLeadership={showLeadership}
              />
            ))}
          </div>
        </div>

        {/* Leadership Thread */}
        <div className="bn-thread-section">
          <button
            className={`bn-thread-toggle${showLeadership ? ' bn-thread-toggle--on' : ''}`}
            onClick={() => setShowLeadership(!showLeadership)}
          >
            <FaStar aria-hidden="true" />
            {showLeadership ? 'Hide' : 'Show'} Leadership Thread
          </button>

          {showLeadership && (
            <div className="bn-thread-panel">
              <p className="bn-thread-intro">
                Leadership shows up in every chapter — not as a title, but as a pattern.
                Guiding others, managing complexity, and being accountable for outcomes
                beyond your own output.
              </p>
              <div className="bn-thread-items">
                {leadershipItems.map((item) => (
                  <div key={item.id} className="bn-thread-item">
                    <div className="bn-thread-logo">
                      {item.logoEl || (
                        <img
                          src={item.logo}
                          alt={item.org}
                          width={26}
                          height={26}
                          className="bn-favicon"
                          onError={(e) => { e.target.style.opacity = 0; }}
                        />
                      )}
                    </div>
                    <div>
                      <div className="bn-thread-item-title">{item.title}</div>
                      <div
                        className="bn-thread-item-meta"
                        style={{ color: item.bundleColor }}
                      >
                        {item.org} · {item.bundleLabel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default Bundles;
