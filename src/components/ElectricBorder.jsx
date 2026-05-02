import { useEffect, useRef, useCallback } from 'react';
import './ElectricBorder.css';

const ElectricBorder = ({
  children,
  color = '#00ff41',
  speed = 1,
  chaos = 0.12,
  borderRadius = 8,
  className,
  style
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  const random = useCallback(x => (Math.sin(x * 12.9898) * 43758.5453) % 1, []);

  const noise2D = useCallback((x, y) => {
    const i = Math.floor(x), j = Math.floor(y);
    const fx = x - i, fy = y - j;
    const a = random(i + j * 57), b = random(i + 1 + j * 57);
    const c = random(i + (j + 1) * 57), d = random(i + 1 + (j + 1) * 57);
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  }, [random]);

  const octavedNoise = useCallback((x, octaves, lac, gain, amp, freq, time, seed, flat) => {
    let y = 0, amplitude = amp, frequency = freq;
    for (let i = 0; i < octaves; i++) {
      let oa = amplitude;
      if (i === 0) oa *= flat;
      y += oa * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
      frequency *= lac;
      amplitude *= gain;
    }
    return y;
  }, [noise2D]);

  const getCornerPoint = useCallback((cx, cy, r, start, arc, p) => ({
    x: cx + r * Math.cos(start + p * arc),
    y: cy + r * Math.sin(start + p * arc)
  }), []);

  const getRoundedRectPoint = useCallback((t, l, top, w, h, r) => {
    const sw = w - 2 * r, sh = h - 2 * r, ca = Math.PI * r / 2;
    const total = 2 * sw + 2 * sh + 4 * ca;
    const d = t * total;
    let acc = 0;
    if (d <= acc + sw) return { x: l + r + (d - acc) / sw * sw, y: top };
    acc += sw;
    if (d <= acc + ca) return getCornerPoint(l + w - r, top + r, r, -Math.PI / 2, Math.PI / 2, (d - acc) / ca);
    acc += ca;
    if (d <= acc + sh) return { x: l + w, y: top + r + (d - acc) / sh * sh };
    acc += sh;
    if (d <= acc + ca) return getCornerPoint(l + w - r, top + h - r, r, 0, Math.PI / 2, (d - acc) / ca);
    acc += ca;
    if (d <= acc + sw) return { x: l + w - r - (d - acc) / sw * sw, y: top + h };
    acc += sw;
    if (d <= acc + ca) return getCornerPoint(l + r, top + h - r, r, Math.PI / 2, Math.PI / 2, (d - acc) / ca);
    acc += ca;
    if (d <= acc + sh) return { x: l, y: top + h - r - (d - acc) / sh * sh };
    acc += sh;
    return getCornerPoint(l + r, top + r, r, Math.PI, Math.PI / 2, (d - acc) / ca);
  }, [getCornerPoint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const borderOffset = 60;
    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width + borderOffset * 2, h = rect.height + borderOffset * 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      return { width: w, height: h };
    };
    let { width, height } = updateSize();

    const draw = ts => {
      const dt = (ts - lastFrameTimeRef.current) / 1000;
      timeRef.current += dt * speed;
      lastFrameTimeRef.current = ts;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const bw = width - 2 * borderOffset, bh = height - 2 * borderOffset;
      const r = Math.min(borderRadius, Math.min(bw, bh) / 2);
      const perim = 2 * (bw + bh) + 2 * Math.PI * r;
      const samples = Math.floor(perim / 2);

      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const p = i / samples;
        const pt = getRoundedRectPoint(p, borderOffset, borderOffset, bw, bh, r);
        const xn = octavedNoise(p * 8, 10, 1.6, 0.7, chaos, 10, timeRef.current, 0, 0);
        const yn = octavedNoise(p * 8, 10, 1.6, 0.7, chaos, 10, timeRef.current, 1, 0);
        const dx = pt.x + xn * 60, dy = pt.y + yn * 60;
        if (i === 0) ctx.moveTo(dx, dy); else ctx.lineTo(dx, dy);
      }
      ctx.closePath();
      ctx.stroke();
      animationRef.current = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => {
      const s = updateSize();
      width = s.width;
      height = s.height;
    });
    ro.observe(container);
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      ro.disconnect();
    };
  }, [color, speed, chaos, borderRadius, octavedNoise, getRoundedRectPoint]);

  return (
    <div ref={containerRef} className={`electric-border ${className ?? ''}`}
      style={{ '--electric-border-color': color, borderRadius, ...style }}
    >
      <div className="eb-canvas-container"><canvas ref={canvasRef} className="eb-canvas" /></div>
      <div className="eb-layers">
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
      <div className="eb-content">{children}</div>
    </div>
  );
};

export default ElectricBorder;
