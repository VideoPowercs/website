document.addEventListener('DOMContentLoaded', () => {
  // ====== Zvaigžņu animācija ======
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');

  let animationFrameId;
  const dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
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
          alphaDir: Math.random() > 0.5 ? 1 : -1,
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

      // Wrap
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

    ctx.globalAlpha = 1; // Reset
    animationFrameId = requestAnimationFrame(animateStars);
  }

  // Pause when tab is inactive
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animateStars();
    }
  });

  // Resize debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      createStars();
    }, 200);
  });

  // Start animation
  resizeCanvas();
  createStars();
  animateStars();

  // ====== Hamburger izvēlne mobilajām ierīcēm ======
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('show');
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.video-card'));
  const slideDuration = 4000; // 4 sekundes progress
  const slideOutDuration = 600; // slide-out animācija
  const restartDelay = 800; // pauze pirms atkārtošanas

  const progressBars = cards.map(card => {
    const bar = document.createElement('div');
    bar.classList.add('progress-bar');
    card.appendChild(bar);
    return bar;
  });

  let currentIndex = 0;
  let animationFrameId = null;
  let startTime = null;

  function animateProgress(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / slideDuration, 1);

    progressBars[currentIndex].style.width = `${progress * 100}%`;

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animateProgress);
    } else {
      cards[currentIndex].style.transition = 'transform 0.5s ease, opacity 0.5s ease';
      cards[currentIndex].style.transform = 'translateX(-150%)';
      cards[currentIndex].style.opacity = '0';

      setTimeout(() => {
        progressBars[currentIndex].style.width = '0%';
        currentIndex++;

        if (currentIndex >= cards.length) {
          setTimeout(() => {
            cards.forEach(card => {
              card.style.transition = 'none';
              card.style.transform = 'translateX(0)';
              card.style.opacity = '1';
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

  // Sākam pirmo ciklu
  animationFrameId = requestAnimationFrame(animateProgress);

  // Klikšķa apstrāde – vienmēr restartē no sākuma un ļauj iet uz video
  cards.forEach((card) => {
    const link = card.querySelector('a');

    if (link) {
      link.addEventListener('click', (event) => {
        // Pārtrauc automātisko slideru
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        progressBars.forEach(bar => bar.style.width = '0%');
        cards.forEach(c => {
          c.style.transition = 'none';
          c.style.transform = 'translateX(0)';
          c.style.opacity = '1';
        });
        currentIndex = 0; // Vienmēr no paša sākuma
        startTime = null;

        // Neliels aizkaves restartēšanai, pirms dodas uz video
        event.preventDefault();
        animationFrameId = requestAnimationFrame(animateProgress);
        setTimeout(() => {
          window.location.href = link.href;
        }, 100);
      });
    }
  });
});
