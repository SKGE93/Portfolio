document.addEventListener('DOMContentLoaded', () => {

    // --- Multi-colored Particles ---
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const colors = [
            { r: 79, g: 110, b: 247 },
            { r: 168, g: 85, b: 247 },
            { r: 244, g: 63, b: 94 },
            { r: 20, g: 184, b: 166 },
            { r: 245, g: 158, b: 11 },
            { r: 192, g: 132, b: 252 },
            { r: 59, g: 130, b: 246 }
        ];

        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < 60; i++) {
            const c = colors[Math.floor(Math.random() * colors.length)];
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.15,
                color: c
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
                ctx.fill();
            });

            particles.forEach((a, i) => {
                particles.slice(i + 1).forEach(b => {
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const avgR = (a.color.r + b.color.r) / 2;
                        const avgG = (a.color.g + b.color.g) / 2;
                        const avgB = (a.color.b + b.color.b) / 2;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(${avgR}, ${avgG}, ${avgB}, ${0.06 * (1 - dist / 120)})`;
                        ctx.stroke();
                    }
                });
            });
            requestAnimationFrame(animate);
        }
        animate();
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

    // --- Hacker Binary Cursor ---
    const hackerCanvas = document.getElementById('hacker-cursor');
    if (hackerCanvas && window.innerWidth > 768) {
        const hCtx = hackerCanvas.getContext('2d');
        let hMouseX = -100, hMouseY = -100;
        const chars = [];
        const hackerColors = [
            '#a855f7', '#7c3aed', '#4f6ef7', '#3b82f6',
            '#06b6d4', '#14b8a6', '#22c55e', '#f43f5e',
            '#f97316', '#f59e0b', '#c026d3'
        ];
        const hexMsg = '6e617275746f206d65696c6c657572207175652046696e616c2046616e74617379';
        const secretMsg = 'naruto meilleur que one piece';
        let cycleTimer = 0;
        let showSecret = false;
        let secretChars = [];
        let spawnCounter = 0;

        function resizeHacker() {
            hackerCanvas.width = window.innerWidth;
            hackerCanvas.height = window.innerHeight;
        }
        resizeHacker();
        window.addEventListener('resize', resizeHacker);

        document.addEventListener('mousemove', (e) => {
            hMouseX = e.clientX;
            hMouseY = e.clientY;
        });

        function spawnBinary() {
            const char = Math.random() > 0.5 ? '1' : '0';
            chars.push({
                x: hMouseX + (Math.random() - 0.5) * 30,
                y: hMouseY + (Math.random() - 0.5) * 30,
                char: char,
                opacity: 0.9 + Math.random() * 0.1,
                color: hackerColors[Math.floor(Math.random() * hackerColors.length)],
                vy: -(0.3 + Math.random() * 0.8),
                vx: (Math.random() - 0.5) * 0.6,
                size: 11 + Math.random() * 5,
                decay: 0.008 + Math.random() * 0.006
            });
        }

        function triggerSecret() {
            secretChars = [];
            const hexChars = secretMsg.split('').map(c => c.charCodeAt(0).toString(16));
            const startX = window.innerWidth / 2 - (hexChars.length * 14) / 2;
            const startY = window.innerHeight / 2;
            hexChars.forEach((hex, i) => {
                secretChars.push({
                    x: startX + i * 14,
                    y: startY + (Math.random() - 0.5) * 20,
                    char: hex,
                    opacity: 1,
                    color: hackerColors[i % hackerColors.length],
                    size: 16,
                    decay: 0.003,
                    vy: -0.15,
                    vx: 0,
                    glow: true
                });
            });
            showSecret = true;
        }

        function animateHacker() {
            hCtx.clearRect(0, 0, hackerCanvas.width, hackerCanvas.height);

            spawnCounter++;
            if (spawnCounter % 2 === 0 && hMouseX > 0) {
                spawnBinary();
                if (spawnCounter % 4 === 0) spawnBinary();
            }

            cycleTimer++;
            if (cycleTimer >= 600 && !showSecret) {
                triggerSecret();
                cycleTimer = 0;
            }

            hCtx.font = '600 14px "JetBrains Mono", monospace';
            hCtx.textAlign = 'center';

            for (let i = chars.length - 1; i >= 0; i--) {
                const c = chars[i];
                c.x += c.vx;
                c.y += c.vy;
                c.opacity -= c.decay;
                if (c.opacity <= 0) { chars.splice(i, 1); continue; }
                hCtx.globalAlpha = c.opacity;
                hCtx.font = `600 ${c.size}px "JetBrains Mono", monospace`;
                hCtx.shadowColor = c.color;
                hCtx.shadowBlur = c.opacity * 8;
                hCtx.fillStyle = c.color;
                hCtx.fillText(c.char, c.x, c.y);
            }

            if (showSecret) {
                let allDone = true;
                for (let i = secretChars.length - 1; i >= 0; i--) {
                    const s = secretChars[i];
                    s.y += s.vy;
                    s.opacity -= s.decay;
                    if (s.opacity <= 0) { secretChars.splice(i, 1); continue; }
                    allDone = false;
                    hCtx.globalAlpha = s.opacity;
                    hCtx.font = `700 ${s.size}px "JetBrains Mono", monospace`;
                    hCtx.shadowColor = s.color;
                    hCtx.shadowBlur = s.opacity * 18;
                    hCtx.fillStyle = s.color;
                    hCtx.fillText(s.char, s.x, s.y);
                }
                if (allDone) showSecret = false;
            }

            hCtx.globalAlpha = 1;
            hCtx.shadowBlur = 0;
            requestAnimationFrame(animateHacker);
        }
        animateHacker();
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
