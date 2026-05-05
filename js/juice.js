
/**
 * Hmong Heritage - Progressive Enhancement Script
 * Adds "Juice": Scroll reveals, magnetic buttons, and interaction feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.card, .section-header, .culture-card, .about-visual');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    // 2. Magnetic Button Effect
    const btns = document.querySelectorAll('.btn-primary, .btn-outline');
    btns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const { offsetX: x, offsetY: y } = e;
            const { offsetWidth: width, offsetHeight: height } = btn;
            const moveX = (x / width - 0.5) * 10;
            const moveY = (y / height - 0.5) * 10;
            btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0)`;
        });
    });

    // 3. Theme Switcher Transition Enhancement
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        });
    }
});
