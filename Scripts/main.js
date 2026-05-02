document.addEventListener('DOMContentLoaded', () => {

    // --- Matrix Binary Background ---
    const matrixCanvas = document.getElementById('matrix-bg');
    if (matrixCanvas) {
        const mCtx = matrixCanvas.getContext('2d');
        let matrixMouseX = -9999, matrixMouseY = -9999;
        const FONT_SIZE = 14;
        const BASE_OPACITY = 0.07;
        const HOVER_OPACITY = 0.28;
        const HOVER_RADIUS = 140;

        function resizeMatrix() {
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;
            initColumns();
        }

        let cols = [];
        function initColumns() {
            const count = Math.floor(matrixCanvas.width / FONT_SIZE);
            cols = [];
            for (let i = 0; i < count; i++) {
                cols.push({
                    x: i * FONT_SIZE + FONT_SIZE / 2,
                    y: Math.random() * -matrixCanvas.height,
                    speed: 0.5 + Math.random() * 2,
                    chars: []
                });
                const len = 8 + Math.floor(Math.random() * 20);
                for (let j = 0; j < len; j++) {
                    cols[i].chars.push(Math.random() > 0.5 ? '1' : '0');
                }
            }
        }

        resizeMatrix();
        window.addEventListener('resize', resizeMatrix);
        document.addEventListener('mousemove', (e) => { matrixMouseX = e.clientX; matrixMouseY = e.clientY; });

        function drawMatrixBg() {
            mCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            mCtx.font = `500 ${FONT_SIZE}px "JetBrains Mono", monospace`;
            mCtx.textAlign = 'center';

            for (let i = 0; i < cols.length; i++) {
                const col = cols[i];
                col.y += col.speed;

                for (let j = 0; j < col.chars.length; j++) {
                    const cy = col.y + j * FONT_SIZE;
                    if (cy < -FONT_SIZE || cy > matrixCanvas.height + FONT_SIZE) continue;

                    if (Math.random() < 0.01) col.chars[j] = Math.random() > 0.5 ? '1' : '0';

                    const dx = col.x - matrixMouseX;
                    const dy = cy - matrixMouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    let opacity = BASE_OPACITY;
                    if (dist < HOVER_RADIUS) {
                        const factor = 1 - dist / HOVER_RADIUS;
                        opacity = BASE_OPACITY + (HOVER_OPACITY - BASE_OPACITY) * factor * factor;
                    }

                    const headFade = j === 0 ? 1 : (j < 3 ? 0.7 : 0.4 + Math.random() * 0.2);
                    opacity *= headFade;

                    const g = Math.floor(100 + (155 * opacity / HOVER_OPACITY));
                    mCtx.fillStyle = `rgba(0, ${g}, 0, ${opacity})`;
                    mCtx.fillText(col.chars[j], col.x, cy);
                }

                const lastCharY = col.y + col.chars.length * FONT_SIZE;
                if (lastCharY < -FONT_SIZE) {
                    col.y = matrixCanvas.height + Math.random() * 200;
                    col.speed = 0.5 + Math.random() * 2;
                    const len = 8 + Math.floor(Math.random() * 20);
                    col.chars = [];
                    for (let j = 0; j < len; j++) col.chars.push(Math.random() > 0.5 ? '1' : '0');
                }
                if (col.y > matrixCanvas.height + 300) {
                    col.y = -col.chars.length * FONT_SIZE - Math.random() * 400;
                    col.speed = 0.5 + Math.random() * 2;
                }
            }

            requestAnimationFrame(drawMatrixBg);
        }
        drawMatrixBg();
    }

    // --- Navbar scroll ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- Mobile menu ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // --- GSAP ScrollTrigger Animations ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        document.querySelectorAll('.fade-up').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        gsap.fromTo('.hero-content', { opacity: 0, scale: 0.95 }, {
            opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out', delay: 0.2
        });

        gsap.utils.toArray('.glass-card').forEach((card, i) => {
            gsap.fromTo(card,
                { opacity: 0, y: 30, scale: 0.97 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    },
                    delay: (i % 3) * 0.1
                }
            );
        });

        gsap.utils.toArray('.project-row').forEach((row, i) => {
            const img = row.querySelector('.project-row-image');
            const info = row.querySelector('.project-row-info');
            const isReverse = row.classList.contains('reverse');
            gsap.fromTo(img,
                { opacity: 0, x: isReverse ? 50 : -50 },
                {
                    opacity: 1, x: 0, duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none none' }
                }
            );
            gsap.fromTo(info,
                { opacity: 0, x: isReverse ? -50 : 50 },
                {
                    opacity: 1, x: 0, duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none none' },
                    delay: 0.15
                }
            );
        });

        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            gsap.fromTo(item,
                { opacity: 0, x: -30 },
                {
                    opacity: 1, x: 0, duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    delay: i * 0.12
                }
            );
        });

        gsap.fromTo('.cta-box',
            { opacity: 0, scale: 0.92 },
            {
                opacity: 1, scale: 1, duration: 0.8,
                ease: 'back.out(1.4)',
                scrollTrigger: { trigger: '.cta-box', start: 'top 85%' }
            }
        );

    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    }

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- Counter animation ---
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                let current = 0;
                const step = Math.ceil(target / 40);
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) { current = target; clearInterval(timer); }
                    el.textContent = current;
                }, 30);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    // --- Rotating Crosshair Cursor ---
    const hackerCanvas = document.getElementById('hacker-cursor');
    if (hackerCanvas && window.innerWidth > 768) {
        const hCtx = hackerCanvas.getContext('2d');
        let mx = -100, my = -100;
        let rotation = 0;

        function resizeHacker() {
            hackerCanvas.width = window.innerWidth;
            hackerCanvas.height = window.innerHeight;
        }
        resizeHacker();
        window.addEventListener('resize', resizeHacker);

        document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

        function drawCrosshair() {
            hCtx.clearRect(0, 0, hackerCanvas.width, hackerCanvas.height);
            rotation += 0.012;

            const color = '#4f6ef7';

            hCtx.save();
            hCtx.translate(mx, my);
            hCtx.rotate(rotation);
            hCtx.strokeStyle = color;
            hCtx.lineWidth = 1.5;
            hCtx.shadowColor = color;
            hCtx.shadowBlur = 10;
            hCtx.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI) / 2;
                hCtx.moveTo(Math.cos(angle) * 14, Math.sin(angle) * 14);
                hCtx.lineTo(Math.cos(angle) * 20, Math.sin(angle) * 20);
            }
            hCtx.stroke();
            hCtx.restore();

            requestAnimationFrame(drawCrosshair);
        }
        drawCrosshair();

        document.body.style.cursor = 'none';
        document.documentElement.style.cursor = 'none';
    }

    // --- Expandable Timeline Cards ---
    document.querySelectorAll('.timeline-expand-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetId = btn.getAttribute('aria-controls');
            const content = document.getElementById(targetId);
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';

            btn.setAttribute('aria-expanded', String(!isExpanded));
            btn.classList.toggle('open', !isExpanded);
            btn.querySelector('i').className = isExpanded ? 'fa-solid fa-plus' : 'fa-solid fa-minus';
            content.classList.toggle('open', !isExpanded);
        });
    });

    // --- Active nav ---
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.style.color = 'var(--text)';
                } else {
                    link.style.color = '';
                }
            }
        });
    });

});
