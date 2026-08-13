// Простая валидация телефона
document.addEventListener('DOMContentLoaded', () => {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      // Оставляем только цифры
      let value = e.target.value.replace(/\D/g, '');
      
      // Форматируем
      if (value.length > 0) {
        if (value[0] === '8') value = '7' + value.slice(1);
        if (value[0] !== '7') value = '7' + value;
        
        let formatted = '+7';
        if (value.length > 1) formatted += ' (' + value.slice(1, 4);
        if (value.length >= 5) formatted += ') ' + value.slice(4, 7);
        if (value.length >= 8) formatted += '-' + value.slice(7, 9);
        if (value.length >= 10) formatted += '-' + value.slice(9, 11);
        
        e.target.value = formatted;
      }
    });
  });
  
  // Плавная анимация появления секций при скролле
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });
});
// Показ сообщения об успешной отправке
if (window.location.search.includes('success=true')) {
  const successHTML = `
    <div class="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-bounce max-w-sm">
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <div>
          <p class="font-semibold">Заявка отправлена!</p>
          <p class="text-sm text-green-100">Мы свяжемся с вами в ближайшее время</p>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', successHTML);
  
  // Убираем параметр из URL
  const url = new URL(window.location);
  url.searchParams.delete('success');
  window.history.replaceState({}, '', url);
  
  // Скрываем сообщение через 5 секунд
  setTimeout(() => {
    document.querySelector('.fixed').remove();
  }, 5000);
}
