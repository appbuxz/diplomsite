const menuBtn = document.getElementById('menu-toggle');
const nav = document.getElementById('main-nav');
if (menuBtn && nav) menuBtn.addEventListener('click', () => nav.classList.toggle('open'));

const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    const name = bookingForm.name.value.trim();
    const phone = bookingForm.phone.value.trim();
    const date = bookingForm.date.value;
    const guests = Number(bookingForm.guests.value);
    if (!name || !phone || !date || !guests || guests < 1) {
      e.preventDefault();
      alert('Пожалуйста, заполните все поля формы корректно.');
      return;
    }
    alert('Заявка отправлена! Мы свяжемся с вами.');
  });
}
