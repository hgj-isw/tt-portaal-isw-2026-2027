/** Parallax, 3D-tilt, magnetische knoppen en header-diepte */

function fxReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initScrollParallax() {
    const wraps = document.querySelectorAll('.orb-wrap');
    const grid = document.querySelector('.perspective-grid');
    let ticking = false;

    const update = () => {
        const y = window.scrollY;
        wraps.forEach((wrap, i) => {
            const factor = i === 0 ? 0.035 : 0.055;
            wrap.style.transform = `translate3d(0, ${y * factor}px, 0)`;
        });
        if (grid) {
            grid.style.transform = `translate3d(0, ${y * 0.06}px, 0)`;
        }
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });
    update();
}

function initHeaderScroll() {
    const header = document.querySelector('.pro-header');
    if (!header) return;

    const update = () => {
        header.classList.toggle('header-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
}

function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');
    const maxTilt = 6;

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('tilt-card-hover'));
        card.addEventListener('mouseleave', () => {
            card.classList.remove('tilt-card-hover');
            card.style.transform = '';
        });
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform =
                `perspective(900px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg) translateY(-4px)`;
        });
    });
}

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.cyber-btn, .nav-btn, .home-plan-link, .plan-tab, .plan-hier-btn');
    const strength = 0.28;

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

function initCyberBtnArrows() {
    document.querySelectorAll('.cyber-btn').forEach(btn => {
        const arrow = btn.querySelector('span');
        if (arrow) arrow.classList.add('cyber-btn-arrow');
    });
}

function initFx() {
    if (fxReducedMotion()) return;
    initScrollParallax();
    initHeaderScroll();
    initTiltCards();
    initMagneticButtons();
    initCyberBtnArrows();
}
