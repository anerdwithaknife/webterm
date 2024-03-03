function drawCRTLines() {
  const canvas = document.getElementById('screen');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const lineHeight = 2; // Height of each horizontal bar
  const gap = 5; // Gap between bars
  const opacityVariation = 0.05; // Variation in opacity for dynamic effect

  for (let y = 0; y < canvas.height; y += lineHeight + gap) {
    const opacity = Math.random() * opacityVariation; // Randomize opacity for each line
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`; // Adjust color and opacity here
    ctx.fillRect(0, y, canvas.width, lineHeight);
  }

  requestAnimationFrame(drawCRTLines);
}

drawCRTLines();
