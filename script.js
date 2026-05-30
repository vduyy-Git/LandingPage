/* =============================================
   SCRIPT.JS – Wedding Landing Page
   Văn Nguyên & Hiền Thư
   ============================================= */

(function () {
  'use strict';

  // ─── FALLING HEARTS & PETALS CANVAS ───────────────
  const canvas = document.getElementById('fallingCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 45;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class FallingParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * -canvas.height : -20;
      this.size = Math.random() * 14 + 6;
      this.speedY = Math.random() * 1.2 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.03;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.type = Math.random() > 0.4 ? 'heart' : 'petal';
      this.swayAmplitude = Math.random() * 30 + 10;
      this.swaySpeed = Math.random() * 0.02 + 0.005;
      this.swayOffset = Math.random() * Math.PI * 2;
      this.life = 0;

      // Petal colors – warm rose & pink hues
      if (this.type === 'petal') {
        const petalColors = [
          'rgba(212, 119, 142,',  // rose
          'rgba(200, 149, 108,',  // gold
          'rgba(184, 86, 112,',   // deep rose
          'rgba(232, 196, 160,',  // light gold
          'rgba(180, 130, 140,',  // mauve
        ];
        this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      } else {
        const heartColors = [
          'rgba(212, 119, 142,',
          'rgba(184, 86, 112,',
          'rgba(200, 100, 120,',
        ];
        this.color = heartColors[Math.floor(Math.random() * heartColors.length)];
      }
    }

    update() {
      this.life++;
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.life * this.swaySpeed + this.swayOffset) * 0.5;
      this.rotation += this.rotationSpeed;

      if (this.y > canvas.height + 30) {
        this.reset(false);
      }
    }

    drawHeart(ctx, x, y, size) {
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      // Left curve
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
      // Left bottom
      ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.5, x, y + size);
      // Right bottom
      ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.5, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
      // Right curve
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
      ctx.closePath();
    }

    drawPetal(ctx, x, y, size) {
      ctx.beginPath();
      ctx.ellipse(x, y, size * 0.35, size * 0.7, 0, 0, Math.PI * 2);
      ctx.closePath();
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'heart') {
        this.drawHeart(ctx, 0, 0, this.size);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
      } else {
        this.drawPetal(ctx, 0, 0, this.size);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
        // Inner shading for petal
        ctx.beginPath();
        ctx.ellipse(0, -this.size * 0.15, this.size * 0.15, this.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color + (this.opacity * 0.3) + ')';
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new FallingParticle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ─── SCROLL ANIMATIONS ────────────────────────────
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));

  // ─── COUNTDOWN TIMER ──────────────────────────────
  const weddingDate = new Date('2026-07-30T10:00:00+07:00').getTime();

  function updateCountdown() {
    const now = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '🎉';
      document.getElementById('cd-hours').textContent = '';
      document.getElementById('cd-minutes').textContent = '';
      document.getElementById('cd-seconds').textContent = '';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ─── FLOATING NAV – ACTIVE STATE ──────────────────
  const navDots = document.querySelectorAll('.nav-dot');
  const sections = document.querySelectorAll('.section');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 300;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navDots.forEach(dot => {
      dot.classList.remove('active');
      if (dot.getAttribute('data-section') === current) {
        dot.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ─── GALLERY LIGHTBOX ─────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentLightboxIndex = 0;
  const gallerySrcs = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    gallerySrcs.push(img.src);

    item.addEventListener('click', () => {
      currentLightboxIndex = index;
      openLightbox(img.src);
    });
  });

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex - 1 + gallerySrcs.length) % gallerySrcs.length;
    lightboxImg.src = gallerySrcs[currentLightboxIndex];
  });

  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex + 1) % gallerySrcs.length;
    lightboxImg.src = gallerySrcs[currentLightboxIndex];
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  // ─── WISHES FORM ──────────────────────────────────
  const wishesForm = document.getElementById('wishes-form');
  const wishesList = document.getElementById('wishes-list');

  // Pre-fill some sample wishes
  const sampleWishes = [
    { name: 'Gia đình hai bên', message: 'Chúc hai con trăm năm hạnh phúc, sớm có tin vui! 🎊' },
    { name: 'Bạn bè thân', message: 'Happy Wedding! Chúc anh chị mãi mãi yêu thương nhau 💕' },
  ];

  function createWishCard(name, message) {
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
      <p class="wish-author">💌 ${name}</p>
      <p class="wish-text">${message}</p>
    `;
    return card;
  }

  sampleWishes.forEach(w => {
    wishesList.appendChild(createWishCard(w.name, w.message));
  });

  wishesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('wish-name');
    const msgInput = document.getElementById('wish-message');
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();

    if (!name || !message) return;

    const card = createWishCard(name, message);
    wishesList.prepend(card);
    nameInput.value = '';
    msgInput.value = '';

    // Burst of hearts on submit
    for (let i = 0; i < 8; i++) {
      const p = new FallingParticle();
      p.type = 'heart';
      p.y = canvas.height * 0.5;
      p.x = canvas.width * 0.5 + (Math.random() - 0.5) * 200;
      p.speedY = -(Math.random() * 2 + 1);
      p.opacity = 0.7;
      particles.push(p);
    }

    // Clean up extra particles later
    setTimeout(() => {
      while (particles.length > PARTICLE_COUNT + 20) {
        particles.shift();
      }
    }, 4000);
  });

  // ─── MUSIC – AUTO PLAY & LOOP ──────────────────────
  const musicToggle = document.getElementById('music-toggle');
  const audio = new Audio('music.mp3');
  audio.loop = true;
  audio.volume = 0.5;
  let isPlaying = false;

  function startMusic() {
    audio.play().then(() => {
      isPlaying = true;
      musicToggle.classList.add('playing');
    }).catch(() => {});
  }

  // Trình duyệt chặn autoplay nếu chưa có tương tác
  // → Tự phát nhạc ngay khi người dùng click/scroll/chạm lần đầu
  const autoplayEvents = ['click', 'scroll', 'touchstart', 'keydown'];
  function autoplayOnInteraction() {
    startMusic();
    autoplayEvents.forEach(evt => {
      document.removeEventListener(evt, autoplayOnInteraction);
    });
  }
  autoplayEvents.forEach(evt => {
    document.addEventListener(evt, autoplayOnInteraction, { once: false, passive: true });
  });

  // Nút toggle để bật/tắt nhạc
  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      musicToggle.classList.remove('playing');
    } else {
      startMusic();
    }
  });

  // ─── SMOOTH PARALLAX ON HERO ──────────────────────
  const hero = document.getElementById('hero');
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
    }
  }, { passive: true });

})();
