
// ===== ФОРМАТИРОВАНИЕ ТЕЛЕФОНА =====
document.addEventListener('DOMContentLoaded', () => {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
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
  
  // ===== ОТПРАВКА ФОРМ ЧЕРЕЗ WEB3FORMS БЕЗ РЕДИРЕКТА =====
  const forms = document.querySelectorAll('form[action*="web3forms"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Останавливаем стандартную отправку
      
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      const isDarkForm = form.closest('.bg-slate-900') !== null;
      
      // Блокируем кнопку
      btn.disabled = true;
      btn.textContent = 'Отправляю...';
      
      // Собираем данные формы
      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);
      
      try {
        // Отправляем на Web3Forms
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: json
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Показываем красивое уведомление
          showSuccessNotification(isDarkForm);
          
          // Очищаем форму
          form.reset();
        } else {
          throw new Error('Ошибка отправки');
        }
      } catch (error) {
        // Показываем ошибку
        showErrorNotification(isDarkForm);
      } finally {
        // Возвращаем кнопку в исходное состояние
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  });
  
  // ===== ФУНКЦИЯ ПОКАЗА УВЕДОМЛЕНИЯ ОБ УСПЕХЕ =====
  function showSuccessNotification(isDark) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 max-w-sm rounded-lg shadow-2xl transform transition-all duration-500 translate-x-full`;
    
    if (isDark) {
      notification.className += ' bg-gradient-to-r from-green-500 to-emerald-600 text-white';
    } else {
      notification.className += ' bg-white border-2 border-green-500 text-slate-900';
    }
    
    notification.innerHTML = `
      <div class="p-5">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-full ${isDark ? 'bg-white/20' : 'bg-green-100'} flex items-center justify-center">
              <svg class="w-6 h-6 ${isDark ? 'text-white' : 'text-green-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <p class="font-bold text-lg leading-tight">Заявка отправлена! 🎉</p>
            <p class="text-sm mt-1 ${isDark ? 'text-white/90' : 'text-slate-600'}">
              Мы свяжемся с вами в ближайшее время
            </p>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="${isDark ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-slate-600'}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => notification.remove(), 500);
    }, 5000);
  }
  
  // ===== ФУНКЦИЯ ПОКАЗА УВЕДОМЛЕНИЯ ОБ ОШИБКЕ =====
  function showErrorNotification(isDark) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 max-w-sm rounded-lg shadow-2xl transform transition-all duration-500 translate-x-full`;
    
    if (isDark) {
      notification.className += ' bg-gradient-to-r from-red-500 to-rose-600 text-white';
    } else {
      notification.className += ' bg-white border-2 border-red-500 text-slate-900';
    }
    
    notification.innerHTML = `
      <div class="p-5">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-full ${isDark ? 'bg-white/20' : 'bg-red-100'} flex items-center justify-center">
              <svg class="w-6 h-6 ${isDark ? 'text-white' : 'text-red-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <p class="font-bold text-lg leading-tight">Ошибка отправки 😔</p>
            <p class="text-sm mt-1 ${isDark ? 'text-white/90' : 'text-slate-600'}">
              Попробуйте ещё раз или позвоните: +7 965 650-71-74
            </p>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="${isDark ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-slate-600'}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => notification.remove(), 500);
    }, 6000);
  }
});
