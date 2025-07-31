const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const starLayers = [
  {
    count: 50,                  // mazāk zvaigžņu
    radiusRange: [1, 2],
    speedRange: [0.02, 0.05],
    colors: ['#fff']
  },
  {
    count: 30,                  // mazāk zvaigžņu
    radiusRange: [2, 3],
    speedRange: [0.05, 0.1],
    colors: ['#fff', '#ffb22c']  // nomainīta krāsa uz #ffb22c
  },
  {
    count: 10,                  // mazāk zvaigžņu
    radiusRange: [3, 4],
    speedRange: [0.1, 0.2],
    colors: ['#ffb22c']          // nomainīta krāsa uz #ffb22c
  }
];

let stars = [];

function createStars() {
  stars = [];
  starLayers.forEach(layer => {
    for (let i = 0; i < layer.count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * (layer.radiusRange[1] - layer.radiusRange[0]) + layer.radiusRange[0],
        speedX: (Math.random() * (layer.speedRange[1] - layer.speedRange[0]) + layer.speedRange[0]) * (Math.random() < 0.5 ? 1 : -1),
        speedY: (Math.random() * (layer.speedRange[1] - layer.speedRange[0]) + layer.speedRange[0]) * (Math.random() < 0.5 ? 1 : -1),
        color: layer.colors[Math.floor(Math.random() * layer.colors.length)],
      });
    }
  });
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    star.x += star.speedX;
    star.y += star.speedY;

    if (star.x > canvas.width) star.x = 0;
    if (star.x < 0) star.x = canvas.width;
    if (star.y > canvas.height) star.y = 0;
    if (star.y < 0) star.y = canvas.height;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = star.color;
    ctx.fill();
  });

  requestAnimationFrame(animateStars);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createStars();
});

createStars();
animateStars();

