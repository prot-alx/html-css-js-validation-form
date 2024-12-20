document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const submitButton = document.getElementById('form-button');

  // Все поля формы
  const firstName = document.getElementById('first-name');
  const lastName = document.getElementById('last-name');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const passwordConfirm = document.getElementById('password-confirm');
  const birthDay = document.getElementById('birth-day');

  // Регулярные выражения для валидации
  const nameRegex = /^[А-ЯЁ][а-яё]{1,19}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  // Отображение ошибки
  function showError(input, message) {
      removeError(input);
      const error = document.createElement('span');
      error.className = 'error-message';
      error.style.color = 'red';
      error.style.fontSize = '12px';
      error.textContent = message;
      input.parentNode.insertBefore(error, input.nextSibling);
      input.style.borderColor = 'red';
  }

  // Удаление ошибки
  function removeError(input) {
      const error = input.parentNode.querySelector('.error-message');
      if (error) {
          error.remove();
      }
      input.style.borderColor = '';
  }

  // Проверка возраста
  function checkAge(birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
      }
      return age >= 18;
  }

  // Проверки валидности всей формы
  function checkFormValidity() {
      // Проверяем каждое поле на валидность
      const isFirstNameValid = nameRegex.test(firstName.value);
      const isLastNameValid = nameRegex.test(lastName.value);
      const isEmailValid = emailRegex.test(email.value);
      const isPasswordValid = passwordRegex.test(password.value);
      const isPasswordConfirmValid = password.value === passwordConfirm.value && passwordConfirm.value !== '';
      const isBirthDayValid = birthDay.value && checkAge(birthDay.value);

      // Активируем кнопку только если все поля валидны
      submitButton.disabled = !(
          isFirstNameValid && 
          isLastNameValid && 
          isEmailValid && 
          isPasswordValid && 
          isPasswordConfirmValid && 
          isBirthDayValid
      );
  }

  // Валидации для каждого поля
  function validateField(input, validationFn, errorMessage) {
      // При потере фокуса
      input.addEventListener('blur', () => {
          if (input.value && !validationFn(input.value)) {
              showError(input, errorMessage);
          } else if (input.value) {
              removeError(input);
          }
          checkFormValidity();
      });

      // При вводе
      input.addEventListener('input', () => {
          if (!input.value) {
              removeError(input);
          }
          checkFormValidity();
      });
  }

  // Валидация имени
  validateField(firstName, 
      value => nameRegex.test(value),
      'Имя должно начинаться с заглавной буквы и содержать только русские буквы'
  );

  // Валидация фамилии
  validateField(lastName, 
      value => nameRegex.test(value),
      'Фамилия должна начинаться с заглавной буквы и содержать только русские буквы'
  );

  // Валидация email
  validateField(email, 
      value => emailRegex.test(value),
      'Введите корректный email адрес'
  );

  // Валидация пароля
  validateField(password, 
      value => passwordRegex.test(value),
      'Пароль должен содержать минимум 8 символов, одну заглавную букву, одну строчную букву, одну цифру и один специальный символ'
  );

  // Дополнительный обработчик для пароля, чтобы проверять подтверждение
  password.addEventListener('input', () => {
      if (passwordConfirm.value) {
          if (password.value !== passwordConfirm.value) {
              showError(passwordConfirm, 'Пароли не совпадают');
          } else {
              removeError(passwordConfirm);
          }
      }
      checkFormValidity();
  });

  // Валидация подтверждения пароля
  passwordConfirm.addEventListener('input', () => {
      if (!passwordConfirm.value) {
          removeError(passwordConfirm);
      } else if (password.value !== passwordConfirm.value) {
          showError(passwordConfirm, 'Пароли не совпадают');
      } else {
          removeError(passwordConfirm);
      }
      checkFormValidity();
  });

  // Валидация даты рождения
  birthDay.addEventListener('change', () => {
      if (!birthDay.value) {
          removeError(birthDay);
      } else if (!checkAge(birthDay.value)) {
          showError(birthDay, 'Вам должно быть не менее 18 лет');
      } else {
          removeError(birthDay);
      }
      checkFormValidity();
  });

  // Обработчик отправки формы
  form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!submitButton.disabled) {
          console.log('Форма успешно отправлена');
          form.reset();
          checkFormValidity();
      }
  });

  // Запуск первичной проверки формы
  checkFormValidity();
});