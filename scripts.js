document.addEventListener('DOMContentLoaded', () => {
    // 0. Particle Background
    const createParticles = () => {
        const hero = document.getElementById('hero');
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        hero.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];

        const resize = () => {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 50; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    };

    createParticles();

    // 1. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // 2. Animated Counters
    const animateCounters = () => {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText.replace('+', '').replace('+', ''); // Simple parsing
            const increment = target / 200;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment) + (counter.innerText.includes('+') ? '+' : '');
                setTimeout(animateCounters, 10);
            } else {
                counter.innerText = target + (counter.innerText.includes('+') ? '+' : '');
            }
        });
    };

    // 3. Cursor Glow Effect
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    const animateSkills = () => {
        document.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
        });
    };

    // 3. Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    let countersAnimated = false;
    let skillsAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-active');

                // Trigger counters
                if (entry.target.id === 'highlights' && !countersAnimated) {
                    animateCounters();
                    countersAnimated = true;
                }

                // Trigger skill bars
                if (entry.target.id === 'skills' && !skillsAnimated) {
                    animateSkills();
                    skillsAnimated = true;
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial observe for sections
    document.querySelectorAll('section, .reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // 5. Dynamic Certification Engine (Sync Ready)
    const certifications = [
        { title: 'Google Cloud Certified', issuer: 'Generative AI', icon: 'fa-google' },
        { title: 'IBM Certified', issuer: 'Generative AI Fundamentals', icon: 'fa-ibm' },
        { title: 'IBM Certified', issuer: 'Applications of Generative AI', icon: 'fa-ibm' },
        { title: 'NASSCOM Certified', issuer: 'Professional Certification', icon: 'fa-certificate' }
    ];

    const renderCerts = () => {
        const certsGrid = document.querySelector('.certs-grid');
        if (!certsGrid) return;

        certsGrid.innerHTML = certifications.map(cert => `
            <div class="cert-card glass-card reveal-on-scroll">
                <div class="cert-badge"><i class="fab ${cert.icon.startsWith('fa-') && !cert.icon.startsWith('fab') ? 'fas' : 'fab'} ${cert.icon}"></i></div>
                <h4>${cert.title}</h4>
                <p>${cert.issuer}</p>
            </div>
        `).join('');
    };

    renderCerts();

    // 6. Contact Form Handling (Silent AJAX)
    const contactForm = document.getElementById('portfolio-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop page refresh/redirect

            const submitBtn = document.getElementById('submit-btn');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: contactForm.name.value,
                        email: contactForm.email.value,
                        message: contactForm.message.value
                    })
                });

                if (response.ok) {
                    submitBtn.textContent = 'Message Sent! ✅';
                    submitBtn.style.backgroundColor = '#10b981';
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send');
                }
            } catch (error) {
                console.error('Error:', error);
                submitBtn.textContent = 'Error! Try Again ❌';
                submitBtn.style.backgroundColor = '#ef4444';
            } finally {
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 4000);
            }
        });
    }
    // 5. Smooth Scrolling for Navigation Links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
