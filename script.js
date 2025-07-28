const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

function createStars() {
  for (let i = 0; i < 150; i++) {
    let star = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      speedX: Math.random() * 0.2 - 0.1,
      speedY: Math.random() * 0.2 - 0.1,
      color: Math.random() < 0.5 ? '#fff' : '#ff6600', // White or Orange stars
    };
    stars.push(star);
  }
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    star.x += star.speedX;
    star.y += star.speedY;

    // Wrap around the stars to the other side of the screen if they go out of bounds
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

createStars();
animateStars();

// Handle video click events
document.querySelectorAll('.video-card').forEach(card => {
  card.addEventListener('click', () => {
    const videoId = card.getAttribute('data-video-id');
    window.open(`https://youtu.be/${videoId}`, '_blank');
  });
});

