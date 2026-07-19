const asciiViewport = document.getElementById('ascii-viewport');
const asciiArt = document.getElementById('ascii-art');

function fitAsciiPortrait() {
  asciiArt.style.transform = 'none';
  asciiViewport.style.height = 'auto';

  const naturalWidth = asciiArt.scrollWidth;
  const naturalHeight = asciiArt.scrollHeight;
  const availableWidth = asciiViewport.clientWidth;

  if (!naturalWidth || !naturalHeight || !availableWidth) return;

  const scale = Math.min(1, availableWidth / naturalWidth);
  asciiArt.style.transform = `scale(${scale})`;
  asciiViewport.style.height = `${Math.ceil(naturalHeight * scale)}px`;
}

fetch('assets/profile-ascii.txt')
  .then(response => {
    if (!response.ok) throw new Error('No se pudo cargar el retrato');
    return response.text();
  })
  .then(portrait => {
    asciiArt.textContent = portrait.trimEnd();
    fitAsciiPortrait();
  })
  .catch(() => {
    asciiArt.textContent = '[ profile.txt no disponible ]';
    fitAsciiPortrait();
  });

let resizeFrame;
window.addEventListener('resize', () => {
  window.cancelAnimationFrame(resizeFrame);
  resizeFrame = window.requestAnimationFrame(fitAsciiPortrait);
});
