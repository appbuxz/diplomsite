const menuBtn = document.getElementById('menu-toggle');
const nav = document.getElementById('main-nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
}
