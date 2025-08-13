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

  // ====== Hamburger menu ======
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.contains('open');
      menuToggle.classList.toggle('open');
      mainNav.classList.toggle('open');
      mainNav.hidden = isOpen; // ja atvērta, paslēpt; ja slēgta, parādīt
    });

    // Aizver izvēlni, kad klikšķina uz saites
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        mainNav.classList.remove('open');
        mainNav.hidden = true;
      });
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

    cards.forEach(card => {
      const link = card.querySelector('a');
      if (link) {
        link.addEventListener('click', event => {
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          progressBars.forEach(bar => (bar.style.width = '0%'));
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
