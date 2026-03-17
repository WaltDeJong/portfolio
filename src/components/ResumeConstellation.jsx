import { useRef, useEffect, useState, useCallback } from 'react';
import '../styles/resumeconstellation.css';
import NODE_DATA from '../data/nodes.js';

// Node data → src/data/nodes.js

// ── Config ────────────────────────────────────────────────────────────────────
const BUNDLES = {
  TECH:     { color: '#3B6FBF', rgb: '59,111,191',  label: 'Software / AI',         desc: 'Engineering, AI evaluation, and product development.' },
  PHYSICAL: { color: '#4A8C3F', rgb: '74,140,63',   label: 'Physical / Land',        desc: 'Silviculture, horticulture, and environmental operations.' },
  PEOPLE:   { color: '#B06030', rgb: '176,96,48',   label: 'People / Community',     desc: 'Case management, counselling, and community programs.' },
};

const CLUSTER_LABELS = {
  'AI/LLM Applied':          'AI / LLM Systems',
  'Systems Thinking':        'Systems & Engineering',
  'Community & High-Trust':  'Community & Trust',
  'Land & Environmental':    'Land & Environment',
  'Operations & Leadership': 'Operations & Leadership',
  'Entrepreneurship':        'Entrepreneurship',
};

const BRIDGE_IDS = new Set(['rezit', 'leadhand']);

// ── Helpers ───────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function isRelated(a, b) {
  if (a.bundle.some(k => b.bundle.includes(k))) return true;
  return a.clusters.some(c => b.clusters.includes(c));
}
function primaryColor(node) { return BUNDLES[node.bundle[0]].color; }

// ── Canvas draw helpers ───────────────────────────────────────────────────────

// Faint dot grid — drawn once per frame but cheap
function drawDotGrid(ctx, W, H) {
  const sp = 26;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.055)';
  for (let gx = sp / 2; gx < W; gx += sp) {
    for (let gy = sp / 2; gy < H; gy += sp) {
      ctx.beginPath();
      ctx.arc(gx, gy, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

// Soft coloured atmospheric blobs centred on each bundle's node cluster
function drawZoneBlobs(ctx, nodes) {
  const acc = {};
  for (const n of nodes) {
    const k = n.bundle[0];
    if (!acc[k]) acc[k] = { x: 0, y: 0, c: 0 };
    acc[k].x += n.currentX; acc[k].y += n.currentY; acc[k].c++;
  }
  for (const [k, a] of Object.entries(acc)) {
    const cx = a.x / a.c, cy = a.y / a.c;
    const { rgb } = BUNDLES[k];
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 150);
    g.addColorStop(0,   `rgba(${rgb},0.09)`);
    g.addColorStop(0.55,`rgba(${rgb},0.035)`);
    g.addColorStop(1,   `rgba(${rgb},0)`);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, 150, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  }
}

// Ambient thin lines between nearby same-bundle nodes
function drawAmbientEdges(ctx, nodes, filterBundle) {
  const MAX_DIST = 185;
  ctx.save();
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      if (!a.bundle.some(k => b.bundle.includes(k))) continue;
      const dist = Math.hypot(a.currentX - b.currentX, a.currentY - b.currentY);
      if (dist > MAX_DIST) continue;
      const fade = (1 - dist / MAX_DIST);
      const alpha = fade * 0.1 * Math.min(a.opacity, b.opacity);
      ctx.beginPath();
      ctx.moveTo(a.currentX, a.currentY);
      ctx.lineTo(b.currentX, b.currentY);
      ctx.strokeStyle = `rgba(80,80,80,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
  ctx.restore();
}

// Gradient + animated edges for selected node
function drawActiveEdges(ctx, nodes, selNode, relIds, t) {
  if (!selNode) return;
  const { r: cr, g: cg, b: cb } = hexToRgb(primaryColor(selNode));
  ctx.save();
  for (const n of nodes) {
    if (n.id === selNode.id || !relIds.has(n.id)) continue;
    const minOp = Math.min(selNode.opacity, n.opacity);
    // Gradient stroke
    const g = ctx.createLinearGradient(selNode.currentX, selNode.currentY, n.currentX, n.currentY);
    g.addColorStop(0, `rgba(${cr},${cg},${cb},${minOp * 0.55})`);
    g.addColorStop(1, `rgba(${cr},${cg},${cb},${minOp * 0.06})`);
    ctx.beginPath();
    ctx.moveTo(selNode.currentX, selNode.currentY);
    ctx.lineTo(n.currentX, n.currentY);
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Animated flow dot travelling from selected → related
    const p = (t * 0.55) % 1;
    const fx = selNode.currentX + (n.currentX - selNode.currentX) * p;
    const fy = selNode.currentY + (n.currentY - selNode.currentY) * p;
    ctx.beginPath();
    ctx.arc(fx, fy, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${cr},${cg},${cb},${minOp * 0.7})`;
    ctx.fill();
  }
  ctx.restore();
}

// Draw a single node — favicon (or gradient fallback), bridge pulse, selection rings
function drawNode(ctx, node, isSel, isRel, isHov, t, faviconImages) {
  const { currentX: x, currentY: y, radius: r, opacity } = node;
  if (r < 0.5 || opacity < 0.01) return;
  const isDual = node.bundle.length > 1;
  const isBridge = BRIDGE_IDS.has(node.id);

  ctx.save();
  ctx.globalAlpha = clamp(opacity, 0, 1);

  // ── DataAnnotation: permanent emanating blue pulse ──────────────────────
  if (node.id === 'data-annotator' && !isSel) {
    const { r: cr, g: cg, b: cb } = hexToRgb(BUNDLES.TECH.color);
    // Soft radial background haze
    const haze = ctx.createRadialGradient(x, y, r, x, y, r + 72);
    haze.addColorStop(0,   `rgba(${cr},${cg},${cb},${opacity * 0.18})`);
    haze.addColorStop(0.5, `rgba(${cr},${cg},${cb},${opacity * 0.07})`);
    haze.addColorStop(1,   `rgba(${cr},${cg},${cb},0)`);
    ctx.fillStyle = haze;
    ctx.beginPath();
    ctx.arc(x, y, r + 72, 0, Math.PI * 2);
    ctx.fill();
    // Three expanding rings at staggered phases — slow, atmospheric
    for (let i = 0; i < 3; i++) {
      const phase = ((t * 0.28 + i / 3) % 1);
      const ringR = r + 6 + phase * 58;
      const alpha = (1 - phase) * 0.45;
      ctx.globalAlpha = clamp(opacity * alpha, 0, 1);
      ctx.beginPath();
      ctx.arc(x, y, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgb(${cr},${cg},${cb})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.globalAlpha = clamp(opacity, 0, 1);
  }

  // ── Radiating rings for selected node ───────────────────────────────────
  if (isSel) {
    const { r: cr, g: cg, b: cb } = hexToRgb(primaryColor(node));
    for (let i = 0; i < 3; i++) {
      const phase = ((t * 0.55 + i / 3) % 1);
      const ringR = r + 7 + phase * 38;
      const alpha = (1 - phase) * 0.3;
      ctx.globalAlpha = clamp(opacity * alpha, 0, 1);
      ctx.beginPath();
      ctx.arc(x, y, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgb(${cr},${cg},${cb})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.globalAlpha = clamp(opacity, 0, 1);
  }

  // ── Bridge node slow pulse ring ──────────────────────────────────────────
  if (isBridge && !isSel) {
    const pulse = 0.5 + Math.sin(t * 1.6 + node.phase) * 0.5;
    const pR = r + 3 + pulse * 4.5;
    ctx.globalAlpha = clamp(opacity * (0.12 + pulse * 0.18), 0, 1);
    ctx.beginPath();
    ctx.arc(x, y, pR, 0, Math.PI * 2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.globalAlpha = clamp(opacity, 0, 1);
  }

  // ── Outer glow for hover / selected ─────────────────────────────────────
  if (isSel || isHov) {
    const { r: cr, g: cg, b: cb } = hexToRgb(primaryColor(node));
    const glow = ctx.createRadialGradient(x, y, r, x, y, r + 14);
    glow.addColorStop(0, `rgba(${cr},${cg},${cb},${opacity * 0.35})`);
    glow.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, r + 14, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Node fill ────────────────────────────────────────────────────────────
  const img = faviconImages && faviconImages[node.id];
  const imgReady = img && img.complete && img.naturalWidth > 0;

  if (imgReady) {
    // Circle background (white by default, or node.logoBg if set)
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = node.logoBg ?? '#ffffff';
    ctx.fill();

    // Favicon clipped to circle — preserve aspect ratio
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r - 1.5, 0, Math.PI * 2);
    ctx.clip();
    const size = (r - 1.5) * 2;
    const aspect = img.naturalWidth / img.naturalHeight;
    const dw = aspect >= 1 ? size : size * aspect;
    const dh = aspect >= 1 ? size / aspect : size;
    ctx.drawImage(img, x - dw / 2, y - dh / 2, dw, dh);
    ctx.restore();

    // Bundle-colored ring — split for dual-bundle nodes
    if (isDual) {
      const c0 = BUNDLES[node.bundle[0]].color;
      const c1 = BUNDLES[node.bundle[1]].color;
      // Left half ring
      ctx.save();
      ctx.beginPath();
      ctx.rect(x - r - 4, y - r - 4, r + 4, (r + 4) * 2);
      ctx.clip();
      ctx.beginPath();
      ctx.arc(x, y, r + 2, 0, Math.PI * 2);
      ctx.strokeStyle = c0;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
      // Right half ring
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y - r - 4, r + 4, (r + 4) * 2);
      ctx.clip();
      ctx.beginPath();
      ctx.arc(x, y, r + 2, 0, Math.PI * 2);
      ctx.strokeStyle = c1;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
      // Thin white divider
      ctx.beginPath();
      ctx.moveTo(x, y - r - 3); ctx.lineTo(x, y + r + 3);
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 1.5; ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, r + 2, 0, Math.PI * 2);
      ctx.strokeStyle = BUNDLES[node.bundle[0]].color;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  } else {
    // Fallback: spherical gradient
    const drawSphere = (color, clipLeft, clipRight) => {
      const { r: cr, g: cg, b: cb } = hexToRgb(color);
      if (clipLeft !== undefined) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(clipLeft, y - r - 1, clipRight - clipLeft, r * 2 + 2);
        ctx.clip();
      }
      const g = ctx.createRadialGradient(x - r * 0.28, y - r * 0.32, 0, x, y, r * 1.15);
      g.addColorStop(0,   `rgb(${clamp(cr+75,0,255)},${clamp(cg+75,0,255)},${clamp(cb+75,0,255)})`);
      g.addColorStop(0.45, color);
      g.addColorStop(1,   `rgb(${clamp(cr-35,0,255)},${clamp(cg-35,0,255)},${clamp(cb-35,0,255)})`);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, r - 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      if (clipLeft !== undefined) ctx.restore();
    };

    if (isDual) {
      drawSphere(BUNDLES[node.bundle[0]].color, x - r - 1, x);
      drawSphere(BUNDLES[node.bundle[1]].color, x,         x + r + 1);
      ctx.beginPath();
      ctx.moveTo(x, y - r + 1); ctx.lineTo(x, y + r - 1);
      ctx.strokeStyle = 'rgba(255,255,255,0.65)';
      ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, r + 2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1.5; ctx.stroke();
    } else {
      drawSphere(BUNDLES[node.bundle[0]].color);
    }
  }

  ctx.restore();
}

// Label pills for selected + related nodes
function drawLabels(ctx, nodes, selId, relIds) {
  for (const n of nodes) {
    const isSel = n.id === selId;
    const isRel = relIds.has(n.id);
    if (!isSel && !isRel) continue;
    if (n.opacity < 0.3) continue;

    const maxLen = 20;
    const label = n.title.length > maxLen ? n.title.slice(0, maxLen) + '…' : n.title;

    ctx.save();
    ctx.font = `${isSel ? 600 : 400} 10px system-ui,-apple-system,sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const tw = ctx.measureText(label).width;
    const lx = n.currentX, ly = n.currentY + n.radius + 6;
    const pad = 5, bh = 14, br = 4;
    const bx = lx - tw / 2 - pad;

    // Pill shadow
    ctx.globalAlpha = n.opacity * 0.08;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.roundRect(bx + 1, ly + 1, tw + pad * 2, bh, br);
    ctx.fill();

    // Pill background
    ctx.globalAlpha = n.opacity * 0.82;
    ctx.fillStyle = isSel ? primaryColor(n) : 'rgba(248,248,248,0.95)';
    ctx.beginPath();
    ctx.roundRect(bx, ly, tw + pad * 2, bh, br);
    ctx.fill();

    // Label text
    ctx.globalAlpha = n.opacity * 0.95;
    ctx.fillStyle = isSel ? '#fff' : '#1a2336';
    ctx.fillText(label, lx, ly + 2);
    ctx.restore();
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ResumeConstellation() {
  const canvasRef        = useRef(null);
  const leftRef          = useRef(null);   // canvas panel div — ResizeObserver target
  const animRef          = useRef(null);
  const nodesRef         = useRef([]);
  const stateRef         = useRef({ selectedId: null, filterBundle: null, isMobile: false, hoveredId: null });
  const lastSizeRef      = useRef({ W: 0, H: 0 });
  const faviconImagesRef = useRef({});

  const [selectedId,   setSelectedId]   = useState(null);
  const [filterBundle, setFilterBundle] = useState(null);
  const [hoveredId,    setHoveredId]    = useState(null);
  const [tooltipPos,   setTooltipPos]   = useState({ x: 0, y: 0 });

  useEffect(() => { stateRef.current.selectedId   = selectedId;   }, [selectedId]);
  useEffect(() => { stateRef.current.filterBundle = filterBundle; }, [filterBundle]);

  // ── Favicon preload ───────────────────────────────────────────────────────
  useEffect(() => {
    const images = {};
    for (const nd of NODE_DATA) {
      const src = nd.icon ?? (nd.faviconDomain ? `https://www.google.com/s2/favicons?domain=${nd.faviconDomain}&sz=64` : null);
      if (!src) continue;
      const img = new Image();
      img.src = src;
      images[nd.id] = img;
    }
    faviconImagesRef.current = images;
  }, []);

  // ── Node initialisation ───────────────────────────────────────────────────
  const initNodes = useCallback((W, H) => {
    const zones = {
      TECH:     { cx: W * 0.66, cy: H * 0.30 },
      PHYSICAL: { cx: W * 0.28, cy: H * 0.66 },
      PEOPLE:   { cx: W * 0.18, cy: H * 0.30 },
    };
    const byBundle = {};
    for (const nd of NODE_DATA) {
      const k = nd.bundle[0];
      if (!byBundle[k]) byBundle[k] = [];
      byBundle[k].push(nd);
    }
    const posMap = {};
    for (const [bundle, bNodes] of Object.entries(byBundle)) {
      const zone = zones[bundle];
      const count = bNodes.length;
      const spread = count <= 3 ? 52 : count <= 5 ? 78 : 108;
      bNodes.forEach((nd, i) => {
        const angle = (i / count) * Math.PI * 2;
        const r = spread * (0.38 + Math.random() * 0.62);
        posMap[nd.id] = {
          bx: clamp(zone.cx + Math.cos(angle) * r, 28, W - 28),
          by: clamp(zone.cy + Math.sin(angle) * r, 28, H - 68),
        };
      });
    }
    // DataAnnotation anchored at canvas centre
    posMap['data-annotator'] = { bx: W * 0.5, by: H * 0.5 };

    nodesRef.current = NODE_DATA.map(nd => {
      const { bx, by } = posMap[nd.id];
      const isDual = nd.bundle.length > 1;
      const isTech = nd.bundle.includes('TECH');
      const defR   = isDual ? 24 : isTech ? 24 : 18;
      return {
        ...nd,
        baseX: bx, baseY: by, currentX: bx, currentY: by, targetX: bx, targetY: by,
        phase: Math.random() * Math.PI * 2,
        driftFreq:  0.52 + Math.random() * 0.26,
        driftFreqY: 0.52 + Math.random() * 0.26,
        radius: defR, targetRadius: defR, defaultRadius: defR,
        opacity: 1,  targetOpacity: 1,
      };
    });
    lastSizeRef.current = { W, H };
  }, []);

  // ── Proportional resize ───────────────────────────────────────────────────
  const handleResize = useCallback((W, H) => {
    const { W: oW, H: oH } = lastSizeRef.current;
    if (!oW || !oH) { initNodes(W, H); return; }
    const sx = W / oW, sy = H / oH;
    for (const n of nodesRef.current) {
      n.baseX *= sx;    n.baseY *= sy;
      n.currentX *= sx; n.currentY *= sy;
      n.targetX *= sx;  n.targetY *= sy;
    }
    lastSizeRef.current = { W, H };
  }, [initNodes]);

  // ── Animation loop ────────────────────────────────────────────────────────
  const startLoop = useCallback(() => {
    const dpr = window.devicePixelRatio || 1;
    const tick = (ts) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const { selectedId, filterBundle, isMobile, hoveredId } = stateRef.current;
      const { W, H } = lastSizeRef.current;
      if (!W || !H) { animRef.current = requestAnimationFrame(tick); return; }

      const t  = ts / 1000;
      const cx = W / 2, cy = H / 2;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // ── Background layers ──────────────────────────────────────────────
      drawDotGrid(ctx, W, H);
      drawZoneBlobs(ctx, nodesRef.current);

      const selNode = selectedId ? nodesRef.current.find(n => n.id === selectedId) : null;
      const relIds  = new Set();
      if (selNode) {
        for (const n of nodesRef.current) {
          if (n.id !== selectedId && isRelated(n, selNode)) relIds.add(n.id);
        }
      }

      // Cluster target positions for related nodes
      const relArr = [...relIds].map(id => nodesRef.current.find(n => n.id === id));
      const cR = clamp(relArr.length * 20, 68, 135);
      relArr.forEach((n, i) => {
        const a = (i / relArr.length) * Math.PI * 2 - Math.PI / 2;
        n.targetX = cx + Math.cos(a) * cR;
        n.targetY = cy + Math.sin(a) * cR;
        n.targetOpacity = 1;
        n.targetRadius  = 20;
      });

      // ── Per-node animation ─────────────────────────────────────────────
      const amp = isMobile ? 0 : 15;
      for (const n of nodesRef.current) {
        if (!selectedId && !filterBundle) {
          n.currentX = lerp(n.currentX, n.baseX + Math.sin(t * n.driftFreq  + n.phase)       * amp, 0.03);
          n.currentY = lerp(n.currentY, n.baseY + Math.cos(t * n.driftFreqY + n.phase + 1.5) * amp, 0.03);
          n.opacity  = lerp(n.opacity,  1,                 0.06);
          n.radius   = lerp(n.radius,   n.defaultRadius,   0.1);
        } else if (selectedId) {
          if (n.id === selectedId) {
            n.targetX = cx; n.targetY = cy;
            n.targetOpacity = 1; n.targetRadius = 28;
          } else if (!relIds.has(n.id)) {
            const dx = n.baseX - cx, dy = n.baseY - cy, len = Math.hypot(dx, dy) || 1;
            n.targetX = n.baseX + (dx / len) * 55;
            n.targetY = n.baseY + (dy / len) * 55;
            n.targetOpacity = 0.18;
            n.targetRadius  = n.defaultRadius;
          }
          n.currentX = lerp(n.currentX, n.targetX,       0.07);
          n.currentY = lerp(n.currentY, n.targetY,       0.07);
          n.opacity  = lerp(n.opacity,  n.targetOpacity, 0.07);
          n.radius   = lerp(n.radius,   n.targetRadius,  0.1);
        } else {
          n.currentX = lerp(n.currentX, n.baseX + Math.sin(t * n.driftFreq  + n.phase)       * amp, 0.03);
          n.currentY = lerp(n.currentY, n.baseY + Math.cos(t * n.driftFreqY + n.phase + 1.5) * amp, 0.03);
          n.opacity  = lerp(n.opacity,  n.bundle.includes(filterBundle) ? 1 : 0.13, 0.05);
          n.radius   = lerp(n.radius,   n.defaultRadius, 0.08);
        }
      }

      // ── Draw ───────────────────────────────────────────────────────────
      drawAmbientEdges(ctx, nodesRef.current, filterBundle);
      drawActiveEdges(ctx, nodesRef.current, selNode, relIds, t);

      // Dim nodes first, bright on top
      const sorted = [...nodesRef.current].sort((a, b) => a.opacity - b.opacity);
      for (const n of sorted) {
        drawNode(ctx, n, n.id === selectedId, relIds.has(n.id), n.id === hoveredId, t, faviconImagesRef.current);
      }
      drawLabels(ctx, nodesRef.current, selectedId, relIds);

      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  }, []);

  // ── Mount + ResizeObserver ────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const left   = leftRef.current;
    if (!canvas || !left) return;

    const dpr = window.devicePixelRatio || 1;
    const cssW = left.clientWidth;
    const cssH = left.clientHeight;
    canvas.width  = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width  = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    stateRef.current.isMobile = window.innerWidth < 640;

    initNodes(cssW, cssH);
    startLoop();

    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const W = Math.floor(e.contentRect.width);
        const H = Math.floor(e.contentRect.height);
        if (!W || !H) continue;
        const d = window.devicePixelRatio || 1;
        canvas.width  = W * d; canvas.height = H * d;
        canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
        stateRef.current.isMobile = window.innerWidth < 640;
        handleResize(W, H);
      }
    });
    ro.observe(left);

    return () => { ro.disconnect(); if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [initNodes, startLoop, handleResize]);

  // ── Canvas interaction ────────────────────────────────────────────────────
  const handleClick = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    for (const n of nodesRef.current) {
      if (Math.hypot(n.currentX - mx, n.currentY - my) <= n.radius + 7) {
        setSelectedId(prev => prev === n.id ? null : n.id);
        setFilterBundle(null);
        return;
      }
    }
    setSelectedId(null);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    let found = null;
    for (const n of nodesRef.current) {
      if (Math.hypot(n.currentX - mx, n.currentY - my) <= n.radius + 7) { found = n; break; }
    }
    const id = found?.id ?? null;
    stateRef.current.hoveredId = id;
    setHoveredId(id);
    if (found) setTooltipPos({ x: mx, y: my });
    canvasRef.current.style.cursor = found ? 'pointer' : 'default';
  }, []);

  const handleMouseLeave = useCallback(() => {
    stateRef.current.hoveredId = null;
    setHoveredId(null);
    if (canvasRef.current) canvasRef.current.style.cursor = 'default';
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const selNode  = selectedId ? NODE_DATA.find(n => n.id === selectedId) : null;
  const hovNode  = hoveredId  ? NODE_DATA.find(n => n.id === hoveredId)  : null;

  const clusterLabel = selNode
    ? [...new Set(selNode.clusters)].map(c => CLUSTER_LABELS[c] ?? c).join(',  ')
    : null;

  const cardColor = selNode ? primaryColor(selNode) : '#194D33';
  const { r: cr, g: cg, b: cb } = hexToRgb(cardColor);
  const chipBg    = `rgba(${cr},${cg},${cb},0.11)`;
  const chipColor = cardColor;
  const isDualSel = selNode?.bundle.length > 1;

  return (
    <section className="rc-section" id="experience">
      <div className="rc-heading-area">
        <p className="rc-eyebrow">Career Trajectory</p>
        <h2 className="rc-title">CAREER CONSTELLATION</h2>
        <p className="rc-sub">
          Click any node to explore a role or credential. Related experiences pull toward
          the centre. Split nodes&nbsp;
          <span className="rc-bridge-pill">bridge chapters</span>.
        </p>
      </div>

      {/* ── Outer card ── */}
      <div className="rc-outer">

        {/* Left: canvas panel */}
        <div className="rc-left" ref={leftRef}>
          <canvas
            ref={canvasRef}
            className="rc-canvas"
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />

          {/* Cluster label */}
          {clusterLabel && <div className="rc-cluster-label">{clusterLabel}</div>}

          {/* Reset */}
          {selectedId && (
            <button
              className="rc-reset-btn"
              onClick={e => { e.stopPropagation(); setSelectedId(null); }}
              aria-label="Clear selection"
            >×</button>
          )}

          {/* Bundle legend */}
          <div className="rc-legend">
            {Object.entries(BUNDLES).map(([key, { color, label }]) => (
              <button
                key={key}
                className={`rc-leg-btn${filterBundle === key ? ' rc-leg-btn--on' : ''}`}
                onClick={e => { e.stopPropagation(); setFilterBundle(f => f === key ? null : key); setSelectedId(null); }}
              >
                <span className="rc-leg-dot" style={{ background: color }} />
                {label}
              </button>
            ))}
          </div>

          {/* Hover tooltip */}
          {hovNode && !selectedId && (
            <div className="rc-tooltip" style={{ left: tooltipPos.x + 14, top: tooltipPos.y }}>
              <strong>{hovNode.title}</strong>
              {hovNode.org}
            </div>
          )}
        </div>

        {/* Right: info panel */}
        <div className="rc-right">
          {selNode ? (
            // ── Selected node detail ────────────────────────────────────
            <div className="rc-detail" key={selNode.id}>
              {/* Bundle colour bar */}
              <div
                className="rc-detail-bar"
                style={
                  isDualSel
                    ? { background: `linear-gradient(90deg, ${BUNDLES[selNode.bundle[0]].color} 50%, ${BUNDLES[selNode.bundle[1]].color} 50%)` }
                    : { background: cardColor }
                }
              />
              <div className="rc-detail-body">
                {/* Org logo */}
                {selNode.logo && (
                  <div className="rc-detail-org-header">
                    <img
                      src={selNode.logo}
                      alt={selNode.org}
                      className="rc-detail-logo"
                      style={selNode.logoBg ? { background: selNode.logoBg, padding: '4px 8px' } : undefined}
                    />
                  </div>
                )}
                <div className="rc-detail-badges">
                  {selNode.bundle.map(k => (
                    <span key={k} className="rc-detail-badge" style={{ background: `rgba(${BUNDLES[k].rgb},0.12)`, color: BUNDLES[k].color }}>
                      {BUNDLES[k].label}
                    </span>
                  ))}
                  {BRIDGE_IDS.has(selNode.id) && (
                    <span className="rc-detail-badge rc-detail-badge--bridge">Bridge node</span>
                  )}
                </div>
                <h3 className="rc-detail-title" style={{ color: cardColor }}>{selNode.title}</h3>
                <p className="rc-detail-meta">{selNode.org} · {selNode.dates}</p>
                <p className="rc-detail-summary">{selNode.summary}</p>
                <div className="rc-chips">
                  {selNode.skills.map(s => (
                    <span key={s} className="rc-chip" style={{ background: chipBg, color: chipColor }}>{s}</span>
                  ))}
                </div>
                {selNode.credentialUrl && (
                  <a
                    href={selNode.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rc-credential-link"
                    style={{ color: cardColor }}
                  >
                    View Credential →
                  </a>
                )}
                {clusterLabel && (
                  <p className="rc-detail-cluster">
                    <span className="rc-cluster-icon">◈</span> {clusterLabel}
                  </p>
                )}
              </div>
            </div>
          ) : (
            // ── Default panel ───────────────────────────────────────────
            <div className="rc-default">
              <p className="rc-default-title">Three chapters,<br />one career.</p>
              <p className="rc-default-sub">
                Each node is a role or credential. Click to pull it to centre —
                connected nodes follow.
              </p>
              <div className="rc-default-bundles">
                {Object.entries(BUNDLES).map(([key, { color, label, desc }]) => (
                  <div key={key} className="rc-default-bundle">
                    <span className="rc-default-dot" style={{ background: color }} />
                    <div>
                      <div className="rc-default-bundle-label">{label}</div>
                      <div className="rc-default-bundle-desc">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="rc-default-hint">
                Split nodes <span className="rc-hint-split">◑</span> bridge two chapters.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
