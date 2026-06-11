import { useEffect, useRef } from 'react';
import './AsciiStatic.css';

const AsciiStatic = ({ text = 'SERAPHIN', opacity = 0.45 }) => {
  const preRef = useRef(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    const CW = 6, CH = 10;
    const RAMP = ' .:-=+*#%@';
    const SOLID = '@#%&$80';

    const render = () => {
      const w = pre.clientWidth, h = pre.clientHeight;
      if (!w || !h) return;
      const cols = Math.floor(w / CW), rows = Math.floor(h / CH);
      const cv = document.createElement('canvas');
      cv.width = w;
      cv.height = h;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let fs = h * 0.5;
      ctx.font = `800 ${fs}px 'Fira Code', monospace`;
      const tw = ctx.measureText(text).width;
      if (tw > w * 0.92) fs = fs * (w * 0.92) / tw;
      ctx.font = `800 ${fs}px 'Fira Code', monospace`;
      ctx.fillText(text, w / 2, h * 0.44);

      const data = ctx.getImageData(0, 0, w, h).data;
      let out = '';
      for (let r = 0; r < rows; r++) {
        let line = '';
        for (let c = 0; c < cols; c++) {
          const x = Math.min(w - 1, c * CW + 3);
          const y = Math.min(h - 1, r * CH + 5);
          const v = data[(y * w + x) * 4] / 255;
          if (v < 0.08) line += ' ';
          else if (v > 0.85) line += SOLID[(c * 7 + r * 13) % SOLID.length];
          else line += RAMP[Math.floor(v * (RAMP.length - 1))];
        }
        out += line + '\n';
      }
      pre.textContent = out;
    };

    render();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
    let to = null;
    const ro = new ResizeObserver(() => {
      clearTimeout(to);
      to = setTimeout(render, 150);
    });
    ro.observe(pre);
    return () => { ro.disconnect(); clearTimeout(to); };
  }, [text]);

  return <pre ref={preRef} className="ascii-static" style={{ opacity }} aria-hidden="true"></pre>;
};

export default AsciiStatic;
