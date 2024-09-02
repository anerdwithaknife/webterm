function drawCRTLines() {
  const canvas = document.getElementById('screen');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const lineHeight = 2;
  const gap = 5;
  const opacityVariation = 0.05;

  for (let y = 0; y < canvas.height; y += lineHeight + gap) {
    const opacity = Math.random() * opacityVariation;
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fillRect(0, y, canvas.width, lineHeight);
  }

  requestAnimationFrame(drawCRTLines);
}

drawCRTLines();
