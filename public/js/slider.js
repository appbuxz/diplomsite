const images = [1,2,3,4,5].map((n) => `https://picsum.photos/900/420?random=${n}`);
let index = 0;
const imageEl = document.getElementById('slide-image');
const next = document.getElementById('next-slide');
const prev = document.getElementById('prev-slide');

function render() { imageEl.src = images[index]; }
if (next && prev && imageEl) {
  next.addEventListener('click', () => { index = (index + 1) % images.length; render(); });
  prev.addEventListener('click', () => { index = (index - 1 + images.length) % images.length; render(); });
  setInterval(() => { index = (index + 1) % images.length; render(); }, 4000);
}
