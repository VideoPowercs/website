document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');

  // Resize canvas
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.scale(dpr, dpr);
  }

  const starLayers = [
    {
      count: 50,
      radiusRange: [1, 2],
      speedRange: [0.02, 0.05],
      colors: ['#fff'],
    },
    {
      count: 30,
      radiusRange: [2, 3],
      speedRange: [0.05, 0.1],
      colors: ['#fff', '#ffb22c'],
    },
    {
      count: 10,
      radiusRange: [3, 4],
      speedRange: [0.1, 0.2],
      colors: ['#ffb22c'],
    },
  ];

  let stars = [];

  function createStars() {
    stars = [];
    starLayers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius:
            Math.random() * (layer.radiusRange[1] - layer.radiusRange[0]) +
            layer.radiusRange[0],
          speedX:
            (Math.random() * (layer.speedRange[1] - layer.speedRange[0]) +
              layer.speedRange[0]) * (Math.random() < 0.5 ? 1 : -1),
          speedY:
            (Math.random() * (layer.speedRange[1] - layer.speedRange[0]) +
              layer.speedRange[0]) * (Math.random() < 0.5 ? 1 : -1),
          color: layer.colors[Math.floor(Math.random() * layer.colors.length)],
        });
      }
    });
  }

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
      star.x += star.speedX;
      star.y += star.speedY;

      // Wrap around
      if (star.x > window.innerWidth) star.x = 0;
      if (star.x < 0) star.x = window.innerWidth;
      if (star.y > window.innerHeight) star.y = 0;
      if (star.y < 0) star.y = window.innerHeight;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.fill();
    });

    requestAnimationFrame(animateStars);
  }

  // Initial setup
  resizeCanvas();
  createStars();
  animateStars();

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      createStars();
    }, 200);
  });
});

document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.main-nav').classList.toggle('active');
});
