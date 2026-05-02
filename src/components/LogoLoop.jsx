import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import './LogoLoop.css';

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

const LogoLoop = memo(({
  logos,
  speed = 120,
  direction = 'left',
  width = '100%',
  logoHeight = 28,
  gap = 32,
  hoverSpeed = 0,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  ariaLabel = 'Technologies',
  className,
  style
}) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const seqRef = useRef(null);
  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  const isVertical = direction === 'up' || direction === 'down';

  const targetVelocity = useMemo(() => {
    const mag = Math.abs(speed);
    const dir = direction === 'left' || direction === 'up' ? 1 : -1;
    return mag * dir * (speed < 0 ? -1 : 1);
  }, [speed, direction]);

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const seqRect = seqRef.current?.getBoundingClientRect();
    const sequenceWidth = seqRect?.width ?? 0;
    if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      const copies = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copies));
    }
  }, []);

  useEffect(() => {
    const ro = new ResizeObserver(updateDimensions);
    if (containerRef.current) ro.observe(containerRef.current);
    if (seqRef.current) ro.observe(seqRef.current);
    updateDimensions();
    return () => ro.disconnect();
  }, [updateDimensions, logos]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || seqWidth <= 0) return;
    let raf = null;
    let last = null;
    let offset = 0;
    let velocity = 0;

    const animate = ts => {
      if (last === null) last = ts;
      const dt = Math.max(0, ts - last) / 1000;
      last = ts;
      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;
      const ease = 1 - Math.exp(-dt / ANIMATION_CONFIG.SMOOTH_TAU);
      velocity += (target - velocity) * ease;
      offset = ((offset + velocity * dt) % seqWidth + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [targetVelocity, seqWidth, isHovered, hoverSpeed]);

  const cssVars = useMemo(() => ({
    '--logoloop-gap': `${gap}px`,
    '--logoloop-logoHeight': `${logoHeight}px`,
    ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor })
  }), [gap, logoHeight, fadeOutColor]);

  const rootClass = [
    'logoloop',
    isVertical ? 'logoloop--vertical' : 'logoloop--horizontal',
    fadeOut && 'logoloop--fade',
    scaleOnHover && 'logoloop--scale-hover',
    className
  ].filter(Boolean).join(' ');

  const renderItem = (item, key) => {
    const isNode = 'node' in item;
    const content = isNode
      ? <span className="logoloop__node">{item.node}</span>
      : <img src={item.src} alt={item.alt ?? ''} title={item.title} loading="lazy" draggable={false} />;
    const wrapped = item.href
      ? <a className="logoloop__link" href={item.href} target="_blank" rel="noreferrer noopener">{content}</a>
      : content;
    return <li className="logoloop__item" key={key} role="listitem">{wrapped}</li>;
  };

  const lists = useMemo(() =>
    Array.from({ length: copyCount }, (_, ci) => (
      <ul className="logoloop__list" key={ci} role="list" aria-hidden={ci > 0} ref={ci === 0 ? seqRef : undefined}>
        {logos.map((item, ii) => renderItem(item, `${ci}-${ii}`))}
      </ul>
    )), [copyCount, logos]);

  return (
    <div ref={containerRef} className={rootClass}
      style={{ width: typeof width === 'number' ? `${width}px` : width, ...cssVars, ...style }}
      role="region" aria-label={ariaLabel}
    >
      <div className="logoloop__track" ref={trackRef}
        onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      >
        {lists}
      </div>
    </div>
  );
});

LogoLoop.displayName = 'LogoLoop';
export default LogoLoop;
