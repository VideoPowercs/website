document.addEventListener('DOMContentLoaded', () => {
  // ====== Zvaigžņu animācija ======
  const canvas = document.getElementById('stars');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    const starLayers = [
      { count: 50, radiusRange: [1, 2], speedRange: [0.02, 0.05], colors: ['#fff'] },
      { count: 30, radiusRange: [2, 3], speedRange: [0.05, 0.1], colors: ['#fff', '#ffb22c'] },
      { count: 10, radiusRange: [3, 4], speedRange: [0.1, 0.2], colors: ['#ffb22c'] },
    ];

    let stars = [];

    function getCanvasSize() {
      return {
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      };
    }

    function createStars() {
      stars = [];
      const { width, height } = getCanvasSize();

      starLayers.forEach(layer => {
        for (let i = 0; i < layer.count; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * (layer.radiusRange[1] - layer.radiusRange[0]) + layer.radiusRange[0],
            speedX: (Math.random() * (layer.speedRange[1] - layer.speedRange[0]) + layer.speedRange[0]) * (Math.random() < 0.5 ? 1 : -1),
            speedY: (Math.random() * (layer.speedRange[1] - layer.speedRange[0]) + layer.speedRange[0]) * (Math.random() < 0.5 ? 1 : -1),
            color: layer.colors[Math.floor(Math.random() * layer.colors.length)],
            alpha: Math.random() * 0.5 + 0.5,
          });
        }
      });
    }

    function animateStars() {
      const { width, height } = getCanvasSize();
      ctx.clearRect(0, 0, width, height);

      stars.forEach(star => {
        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x > width) star.x = 0;
        if (star.x < 0) star.x = width;
        if (star.y > height) star.y = 0;
        if (star.y < 0) star.y = height;

        ctx.beginPath();
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animateStars);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animateStars();
      }
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        createStars();
      }, 200);
    });

    resizeCanvas();
    createStars();
    animateStars();
  }

// ====== Hamburger izvēlne mobilajām ierīcēm ======
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (toggle && nav) {
  // Funkcija izvēlnes aizvēršanai
  const closeMenu = () => {
    nav.classList.remove('active');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Atvērt izvēlni');
    nav.setAttribute('hidden', '');
    document.body.style.overflow = '';
  };

  // Sākotnēji izvēlne ir slēgta
  closeMenu();

  // Ja ekrāna platums ir 768px vai mazāks, pielāgojam izvēlnes saturu
  if (window.innerWidth <= 768) {
    const menuItems = ['PARTNERS', 'VIDEOS', 'SPECIALS', 'GIVEAWAYS', 'STORE'];

    nav.innerHTML = `
      <div style="
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 15px;
        padding: 15px;
        font-size: 1rem;
      ">
        ${menuItems.map(item => `<span style="cursor:pointer;">${item}</span>`).join('')}
      </div>
    `;

    // Pievienojam klikšķa event listenerus katram span, lai aizvērtu izvēlni
    nav.querySelectorAll('span').forEach(span => {
      span.addEventListener('click', closeMenu);
    });
  }

  // Toggle izvēlni, kad klikšķinām uz hamburgera pogas
  toggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Lai klikšķis neizplatītos tālāk
    const isActive = nav.classList.toggle('active');
    toggle.classList.toggle('open');

    toggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    toggle.setAttribute('aria-label', isActive ? 'Aizvērt izvēlni' : 'Atvērt izvēlni');

    if (isActive) {
      nav.removeAttribute('hidden');
      document.body.style.overflow = 'hidden'; // Aizliedz scrollu, kamēr izvēlne vaļā
    } else {
      closeMenu();
    }
  });

  // Aizver izvēlni, ja klikšķis ārpus izvēlnes un hamburgera pogas
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Aizver izvēlni, ja nospiež ESC taustiņu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      closeMenu();
    }
  });
}

  // ====== Video karšu slaideris ar hover pauzi ======
  const cards = Array.from(document.querySelectorAll('.video-card'));
  const slideDuration = 4000;
  const slideOutDuration = 600;
  const restartDelay = 800;

  if (cards.length > 0) {
    const progressBars = cards.map(card => {
      const bar = document.createElement('div');
      bar.classList.add('progress-bar');
      card.appendChild(bar);
      return bar;
    });

    let currentIndex = 0;
    let animationFrameId = null;
    let startTime = null;
    let paused = false;

    function animateProgress(timestamp) {
      if (!startTime) startTime = timestamp;
      if (paused) {
        animationFrameId = requestAnimationFrame(animateProgress);
        return;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / slideDuration, 1);

      progressBars[currentIndex].style.width = `${progress * 100}%`;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateProgress);
      } else {
        cards[currentIndex].style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        cards[currentIndex].style.transform = 'translateX(-150%)';
        cards[currentIndex].style.opacity = '0';
        cards[currentIndex].style.pointerEvents = 'none';

        setTimeout(() => {
          progressBars[currentIndex].style.width = '0%';
          currentIndex++;

          if (currentIndex >= cards.length) {
            setTimeout(() => {
              cards.forEach(card => {
                card.style.transition = 'none';
                card.style.transform = 'translateX(0)';
                card.style.opacity = '1';
                card.style.pointerEvents = 'auto';
              });
              currentIndex = 0;
              startTime = null;
              animationFrameId = requestAnimationFrame(animateProgress);
            }, restartDelay);
          } else {
            startTime = null;
            animationFrameId = requestAnimationFrame(animateProgress);
          }
        }, slideOutDuration);
      }
    }

    animationFrameId = requestAnimationFrame(animateProgress);

    cards.forEach((card, index) => {
      if (!card.classList.contains('new')) return;

      card.addEventListener('mouseenter', () => {
        if (index === currentIndex) {
          paused = true;
          progressBars[currentIndex].style.transition = 'none';
        }
      });

      card.addEventListener('mouseleave', () => {
        if (index === currentIndex) {
          paused = false;
          const currentWidth = parseFloat(progressBars[currentIndex].style.width) || 0;
          startTime = performance.now() - (currentWidth / 100) * slideDuration;
        }
      });
    });

    cards.forEach((card) => {
      const link = card.querySelector('a');
      if (link) {
        link.addEventListener('click', (event) => {
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          progressBars.forEach(bar => bar.style.width = '0%');
          cards.forEach(c => {
            c.style.transition = 'none';
            c.style.transform = 'translateX(0)';
            c.style.opacity = '1';
            c.style.pointerEvents = 'auto';
          });
          currentIndex = 0;
          startTime = null;

          event.preventDefault();
          animationFrameId = requestAnimationFrame(animateProgress);
          setTimeout(() => {
            window.location.href = link.href;
          }, 100);
        });
      }
    });
  }
});
