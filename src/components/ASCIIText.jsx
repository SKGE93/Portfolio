import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uEnableWaves;
void main() {
    vUv = uv;
    float time = uTime * 5.0;
    float wf = uEnableWaves;
    vec3 t = position;
    t.x += sin(time + position.y) * 0.5 * wf;
    t.y += cos(time + position.z) * 0.15 * wf;
    t.z += sin(time + position.x) * wf;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(t, 1.0);
}`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTexture;
void main() {
    float time = uTime;
    vec2 pos = vUv;
    float r = texture2D(uTexture, pos + cos(time * 2.0 - time + pos.x) * 0.01).r;
    float g = texture2D(uTexture, pos + tan(time * 0.5 + pos.x - time) * 0.01).g;
    float b = texture2D(uTexture, pos - cos(time * 2.0 + time + pos.y) * 0.01).b;
    float a = texture2D(uTexture, pos).a;
    gl_FragColor = vec4(r, g, b, a);
}`;

const PX_RATIO = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

if (typeof Math.map === 'undefined') {
  Math.map = function (n, start, stop, start2, stop2) {
    return ((n - start) / (stop - start)) * (stop2 - start2) + start2;
  };
}

class AsciiFilter {
  constructor(renderer, { fontSize, fontFamily, charset, invert } = {}) {
    this.renderer = renderer;
    this.domElement = document.createElement('div');
    this.domElement.style.position = 'absolute';
    this.domElement.style.top = '0';
    this.domElement.style.left = '0';
    this.domElement.style.width = '100%';
    this.domElement.style.height = '100%';
    this.pre = document.createElement('pre');
    this.domElement.appendChild(this.pre);
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.domElement.appendChild(this.canvas);
    this.deg = 0;
    this.invert = invert ?? true;
    this.fontSize = fontSize ?? 12;
    this.fontFamily = fontFamily ?? "'Fira Code', monospace";
    this.charset = charset ?? ' .\'`^",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
    this.center = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this.onMouseMove = this.onMouseMove.bind(this);
    document.addEventListener('mousemove', this.onMouseMove);
  }
  setSize(w, h) {
    this.width = w; this.height = h;
    this.renderer.setSize(w, h);
    this.reset();
    this.center = { x: w / 2, y: h / 2 };
    this.mouse = { x: this.center.x, y: this.center.y };
  }
  reset() {
    this.context.font = `${this.fontSize}px ${this.fontFamily}`;
    const cw = this.context.measureText('A').width;
    this.cols = Math.floor(this.width / (this.fontSize * (cw / this.fontSize)));
    this.rows = Math.floor(this.height / this.fontSize);
    this.canvas.width = this.cols; this.canvas.height = this.rows;
    Object.assign(this.pre.style, {
      fontFamily: this.fontFamily, fontSize: `${this.fontSize}px`, margin: '0', padding: '0',
      lineHeight: '1em', position: 'absolute', left: '0', top: '0', zIndex: '9',
      backgroundAttachment: 'fixed', mixBlendMode: 'difference'
    });
  }
  render(scene, camera) {
    this.renderer.render(scene, camera);
    const w = this.canvas.width, h = this.canvas.height;
    this.context.clearRect(0, 0, w, h);
    if (w && h) this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
    this.asciify(this.context, w, h);
    this.hue();
  }
  onMouseMove(e) { this.mouse = { x: e.clientX * PX_RATIO, y: e.clientY * PX_RATIO }; }
  hue() {
    const dx = this.mouse.x - this.center.x, dy = this.mouse.y - this.center.y;
    const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    this.deg += (deg - this.deg) * 0.075;
    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;
  }
  asciify(ctx, w, h) {
    if (!w || !h) return;
    const data = ctx.getImageData(0, 0, w, h).data;
    let str = '';
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (x + y * w) * 4;
        if (data[i + 3] === 0) { str += ' '; continue; }
        let gray = (0.3 * data[i] + 0.6 * data[i + 1] + 0.1 * data[i + 2]) / 255;
        let idx = Math.floor((1 - gray) * (this.charset.length - 1));
        if (this.invert) idx = this.charset.length - idx - 1;
        str += this.charset[idx];
      }
      str += '\n';
    }
    this.pre.innerHTML = str;
  }
  dispose() { document.removeEventListener('mousemove', this.onMouseMove); }
}

class CanvasTxt {
  constructor(txt, { fontSize = 200, fontFamily = 'Fira Code', color = '#00ff41' } = {}) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.txt = txt; this.fontSize = fontSize; this.fontFamily = fontFamily; this.color = color;
    this.font = `600 ${this.fontSize}px ${this.fontFamily}`;
  }
  resize() {
    this.context.font = this.font;
    const m = this.context.measureText(this.txt);
    this.canvas.width = Math.ceil(m.width) + 20;
    this.canvas.height = Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) + 20;
  }
  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;
    const m = this.context.measureText(this.txt);
    this.context.fillText(this.txt, 10, 10 + m.actualBoundingBoxAscent);
  }
  get width() { return this.canvas.width; }
  get height() { return this.canvas.height; }
  get texture() { return this.canvas; }
}

export default function ASCIIText({
  text = 'SERAPHIN',
  asciiFontSize = 8,
  textFontSize = 200,
  textColor = '#00ff41',
  planeBaseHeight = 8,
  enableWaves = true
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    let animId = null;

    const setup = async () => {
      try {
        await document.fonts.load('600 200px "Fira Code"');
        await document.fonts.load('500 12px "Fira Code"');
      } catch {}
      await document.fonts.ready;
      if (cancelled) return;

      const container = containerRef.current;
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;

      const textCanvas = new CanvasTxt(text, { fontSize: textFontSize, fontFamily: 'Fira Code', color: textColor });
      textCanvas.resize();
      textCanvas.render();

      const texture = new THREE.CanvasTexture(textCanvas.texture);
      texture.minFilter = THREE.NearestFilter;
      const aspect = textCanvas.width / textCanvas.height;
      const planeW = planeBaseHeight * aspect, planeH = planeBaseHeight;
      const geometry = new THREE.PlaneGeometry(planeW, planeH, 36, 36);
      const material = new THREE.ShaderMaterial({
        vertexShader, fragmentShader, transparent: true,
        uniforms: { uTime: { value: 0 }, mouse: { value: 1 }, uTexture: { value: texture }, uEnableWaves: { value: enableWaves ? 1 : 0 } }
      });
      const mesh = new THREE.Mesh(geometry, material);
      const scene = new THREE.Scene();
      scene.add(mesh);
      const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
      camera.position.z = 30;

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setPixelRatio(1);
      renderer.setClearColor(0x000000, 0);

      const filter = new AsciiFilter(renderer, { fontFamily: "'Fira Code', monospace", fontSize: asciiFontSize, invert: true });
      container.appendChild(filter.domElement);
      filter.setSize(width, height);

      let mouse = { x: width / 2, y: height / 2 };
      const onMove = e => {
        const bounds = container.getBoundingClientRect();
        mouse = { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
      };
      container.addEventListener('mousemove', onMove);

      const animate = () => {
        if (cancelled) return;
        const time = Date.now() * 0.001;
        textCanvas.render();
        texture.needsUpdate = true;
        material.uniforms.uTime.value = Math.sin(time);
        const rx = Math.map(mouse.y, 0, height, 0.5, -0.5);
        const ry = Math.map(mouse.x, 0, width, -0.5, 0.5);
        mesh.rotation.x += (rx - mesh.rotation.x) * 0.05;
        mesh.rotation.y += (ry - mesh.rotation.y) * 0.05;
        filter.render(scene, camera);
        animId = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        container.removeEventListener('mousemove', onMove);
        filter.dispose();
        if (filter.domElement.parentNode) container.removeChild(filter.domElement);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
      };
    };

    let cleanup;
    setup().then(fn => { cleanup = fn; });
    return () => {
      cancelled = true;
      if (animId) cancelAnimationFrame(animId);
      if (cleanup) cleanup();
    };
  }, [text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap');
        div[style*="position: relative"] canvas {
          position: absolute; left: 0; top: 0; width: 100%; height: 100%;
          image-rendering: pixelated;
        }
        div[style*="position: relative"] pre {
          margin: 0; user-select: none; padding: 0; line-height: 1em;
          position: absolute; left: 0; top: 0;
          background-image: linear-gradient(135deg, #00ff41 0%, #00f3ff 50%, #ff00ff 100%);
          background-attachment: fixed;
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
          z-index: 9; mix-blend-mode: difference;
        }
      `}</style>
    </div>
  );
}
