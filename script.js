document.addEventListener('DOMContentLoaded', () => { 
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

      // Mirgošana IZSLĒGTA:
      // star.alpha += 0.01 * star.alphaDir;
      // if (star.alpha <= 0.3 || star.alpha >= 1) star.alphaDir *= -1;

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

  // Start
  resizeCanvas();
  createStars();
  animateStars();
});
