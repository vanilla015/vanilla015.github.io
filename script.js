const asciiViewport = document.getElementById('ascii-viewport');
const asciiArt = document.getElementById('ascii-art');
const asciiSize = document.getElementById('ascii-size');

function trimAscii(source) {
  const lines = source.replace(/\r/g, '').split('\n');

  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines.at(-1).trim()) lines.pop();

  const contentLines = lines.filter(line => line.trim());
  const leftEdge = Math.min(...contentLines.map(line => line.search(/\S/)));
  const rightEdge = Math.max(...contentLines.map(line => line.trimEnd().length));

  return lines.map(line => line.slice(leftEdge, rightEdge)).join('\n');
}

function fitAsciiPortrait() {
  asciiArt.style.transform = 'none';
  asciiViewport.style.height = 'auto';

  const naturalWidth = asciiArt.scrollWidth;
  const naturalHeight = asciiArt.scrollHeight;
  const viewportStyle = window.getComputedStyle(asciiViewport);
  const horizontalPadding = parseFloat(viewportStyle.paddingLeft) + parseFloat(viewportStyle.paddingRight);
  const verticalPadding = parseFloat(viewportStyle.paddingTop) + parseFloat(viewportStyle.paddingBottom);
  const availableWidth = asciiViewport.clientWidth - horizontalPadding;

  if (!naturalWidth || !naturalHeight || !availableWidth) return;

  const characterRatio = 0.58;
  const correctedWidth = naturalWidth * characterRatio;
  const maxPortraitHeight = window.matchMedia('(max-width: 900px)').matches ? 480 : 620;
  const scale = Math.min(1, availableWidth / correctedWidth, maxPortraitHeight / naturalHeight);

  asciiArt.style.transform = `scale(${scale * characterRatio}, ${scale})`;
  asciiViewport.style.height = `${Math.ceil(naturalHeight * scale + verticalPadding)}px`;
}

fetch('assets/profile-ascii.txt')
  .then(response => {
    if (!response.ok) throw new Error('No se pudo cargar el retrato');
    return response.text();
  })
  .then(source => {
    const portrait = trimAscii(source);
    const lines = portrait.split('\n');
    const columns = Math.max(...lines.map(line => line.length));

    asciiArt.textContent = portrait;
    asciiSize.textContent = `${columns} x ${lines.length}`;
    fitAsciiPortrait();
  })
  .catch(() => {
    asciiArt.textContent = '[ PROFILE OFFLINE ]';
    asciiSize.textContent = 'ERROR';
    fitAsciiPortrait();
  });

let resizeFrame;
window.addEventListener('resize', () => {
  window.cancelAnimationFrame(resizeFrame);
  resizeFrame = window.requestAnimationFrame(fitAsciiPortrait);
});
