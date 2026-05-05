// ========================================
// HmongHeritage — Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Nav Toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close nav when clicking a link (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Scroll Progress Bar ---
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = scrollPercent + '%';
    });
  }

  // --- Lesson Tabs ---
  const lessonTabs = document.querySelectorAll('.lesson-tab');
  const lessonContents = document.querySelectorAll('.lesson-content');

  lessonTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Remove active from all tabs
      lessonTabs.forEach(t => t.classList.remove('active'));
      lessonContents.forEach(c => c.classList.remove('active'));

      // Add active to clicked tab and corresponding content
      tab.classList.add('active');
      const targetContent = document.getElementById('tab-' + target);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // --- Animate on Scroll ---
  const animateElements = document.querySelectorAll('.card, .culture-card, .timeline-item');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    observer.observe(el);
  });

  // --- Active Nav Link Highlight ---
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPath ||
        (currentPath.endsWith('/') && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });

  console.log('🐾 HmongHeritage loaded — Kev Cai Hmoob!');
});

  // --- Theme Toggle (Light ↔ Dark) ---\n  const themeToggle = document.getElementById('themeToggle');\n  if (themeToggle) {\n    themeToggle.addEventListener('click', () => {\n      document.body.classList.toggle('dark-mode');\n      const isDark = document.body.classList.contains('dark-mode');\n      themeToggle.textContent = isDark ? '☀️' : '🌙';\n      localStorage.setItem('theme', isDark ? 'dark' : 'light');\n    });\n\n    if (localStorage.getItem('theme') === 'dark') {\n      document.body.classList.add('dark-mode');\n      themeToggle.textContent = '☀️';\n    }\n  }\n\n  // --- Word of the Day Logic ---\n  async function updateWordOfDay() {\n    const wotdHm = document.getElementById('wotd-hm');\n    const wotdPron = document.getElementById('wotd-pron');\n    const wotdEn = document.getElementById('wotd-en');\n\n    if (!wotdHm || !wotdPron || !wotdEn) return;\n\n    try {\n      const response = await fetch('js/words.json');\n      const words = await response.json();\n      const randomWord = words[Math.floor(Math.random() * words.length)];\n\n      wotdHm.textContent = randomWord.hm;\n      wotdPron.textContent = `[${randomWord.pron}]`;\n      wotdEn.textContent = randomWord.en;\n    } catch (error) {\n      console.error('Error loading Word of the Day:', error);\n      wotdEn.textContent = 'Check back soon!';\n    }\n  }\n\n  if (document.getElementById('wordOfDay')) {\n    updateWordOfDay();\n  }\n\n  // --- Language Toggle (EN ↔ HMN) ---\n
  const langToggle = document.getElementById('langToggle');
  const hmnElements = document.querySelectorAll('[data-lang="hm"], [data-lang-block="hm"]');
  const enElements = document.querySelectorAll('[data-lang="en"], [data-lang-block="en"]');

  let isHmnMode = false;

  // Check localStorage for saved preference
  if (localStorage.getItem('hm-lang') === 'hm') {
    document.body.classList.add('hmn-mode');
    isHmnMode = true;
    if (langToggle) langToggle.textContent = '🇭🇲 Hmoob';
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      isHmnMode = !isHmnMode;
      document.body.classList.toggle('hmn-mode', isHmnMode);
      langToggle.textContent = isHmnMode ? '🇭🇲 Hmoob' : '🇺🇸 English';
      localStorage.setItem('hm-lang', isHmnMode ? 'hm' : 'en');
    });
  }
