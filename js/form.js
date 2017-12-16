'use strict';

(function () {

  // для базовых операций
  var uploadForm = document.querySelector('.upload-form');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadImgFile = document.querySelector('#upload-file');
  var closeButton = document.querySelector('#upload-cancel');
  var submitButton = document.querySelector('#upload-submit');
  var img = document.querySelector('.effect-image-preview');

  // работа с увеличением/уменьшением
  var scaleElement = document.querySelector('.effect-image-preview');
  var scaleValueField = document.querySelector('.upload-resize-controls-value');
  var scaleDownButton = document.querySelector('.upload-resize-controls-button-dec');
  var enlargeButton = document.querySelector('.upload-resize-controls-button-inc');

  // работа с полями хештегов и комментария
  var hashtagsField = document.querySelector('.upload-form-hashtags');
  var commentField = document.querySelector('.upload-form-description');

  var uploadEffectControls = document.querySelector('.upload-effect-controls');// блок с мини-превьюшками эффектов

  // переменные для ползунка 
  var effectsSliderContainer = document.querySelector('.upload-effect-level');
  var slider = document.querySelector('.upload-effect-level-line');
  var thumb = slider.querySelector('.upload-effect-level-pin');
  thumb.style.position = 'relative';
  var saturationValue = document.querySelector('.upload-effect-level-value');// значение value 
  var saturationLevel = slider.querySelector('.upload-effect-level-val');// желтая заливка линии
  var targetElement = 'upload-effect-label';// для обработки клика на картинку
  saturationLevel.style.top = '1%';

  // узел для сообщений об ошибке
  commentField.insertAdjacentHTML('afterend', '<div></div>');
  var errorMessageHTML = commentField.nextElementSibling;
  errorMessageHTML.classList.add('error-message');

  // сброс всех изменений фото
  function resetToDefault() {
    scaleValueField.setAttribute('value', '100%');
    img.style.transform = 'scale(1)';
    img.setAttribute('class', 'effect-image-preview');
    var radioEffect = uploadEffectControls.querySelectorAll('[type=radio]');
    radioEffect.forEach(function (item) {
      item.checked = false;
      radioEffect[0].checked = true;
    });
    hashtagsField.value = '';
    commentField.value = '';
  }

  // открыть форму загрузки фото
  function openUploadForm() {
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onEscPress);
    resetSlider();
  }

  // закрыть форму загрузки фото
  function closeUploadForm() {
    uploadOverlay.classList.add('hidden');
    resetToDefault();
    document.removeEventListener('keydown', onEscPress);
  }

  // функция для закрытия фото по кнопке Esc
  function onEscPress(event) {
    if (event.keyCode === window.utils.ESC_KEYCODE) {
      closeUploadForm();
    }
  }

  function resetSlider() {
    saturationValue.value = 100;
    saturationLevel.style.width = '100%';
    thumb.style.left = '100%';
  }

  function applyFilter(image, oldFilter, newFilter) {
    image.classList.remove('effect-' + oldFilter);
    image.classList.add('effect-' + newFilter);
  }

  // изменение масштаба фото
  function adjustScale(value) {
    scaleValueField.setAttribute('value', value);
    scaleElement.style.transform = 'scale(' + parseInt(value, 10) * 0.01 + ')';
  }

  // оформление ошибки заполнения формы
  function makeBorderRed(element) {
    element.style.borderColor = 'red';
    element.style.borderWidth = '2px';
  }
  // убираем оформление ошибки заполнения формы
  function removeErrorAlarm() {
    errorMessageHTML.textContent = '';
    submitButton.removeAttribute('disabled');
    hashtagsField.style.borderColor = 'black';
    commentField.style.borderColor = 'black';
    hashtagsField.style.borderWidth = '1px';
    commentField.style.borderWidth = '1px';
  }

  // оформление сообщения об ошибке при отправке формы
  function renderErrorDiv(elem, errorMessage) {
    if (!document.body.querySelector('.error-style')) {
      var errorDiv = document.createElement('div');
      errorDiv.textContent = errorMessage;
      errorDiv.setAttribute('class', 'error-style');

      var warningImg = document.createElement('img');
      warningImg.setAttribute('class', 'warning-img');

      var close = document.createElement('span');
      close.textContent = 'X';
      close.setAttribute('class', 'close-img');
      close.addEventListener('click', function () {
        errorDiv.parentElement.removeChild(errorDiv);
      });
      warningImg.setAttribute('src', 'img/icon-warning.png');
      errorDiv.insertAdjacentElement('afterbegin', warningImg);
      errorDiv.insertAdjacentElement('beforeend', close);
      elem.insertAdjacentElement('beforebegin', errorDiv);
    }
  }

  // ошибка при отправке формы (POST)
  function onErrorPost(errorMessage) {
    resetToDefault();
    renderErrorDiv(submitButton, errorMessage);
  }

  // функция для валидации
  function onFormFillingIn() {
    if (errorMessageHTML.textContent) {
      removeErrorAlarm();
    }
    var errorsMessageArray = [];
    var hashtagsArray = hashtagsField.value.split(' ');
    hashtagsArray = hashtagsArray.filter(function (hashtag) {
      return hashtag;
    });
    var hashtagValidity = hashtagsArray.every(function (hashtag) {
      return hashtag.match(/#[A-Za-zА-Яа-яЁё0-9]{1,20}/);
    });

    if (!hashtagValidity) {
      errorsMessageArray.push('Хеш-тег должен начинаться с символа # и разделяться пробелами, длина не должна превышать 20 символов.');
      makeBorderRed(hashtagsField);
    }
    if (hashtagsArray.length > 5) {
      errorsMessageArray.push('Количество хештегов не должно превышать 5.');
      makeBorderRed(hashtagsField);
    }
    if (!window.utils.isUnique(hashtagsArray)) {
      errorsMessageArray.push('Не допускается повторение хештегов.');
      makeBorderRed(hashtagsField);
    }
    if (commentField.value.length > 140) {
      errorsMessageArray.push('Длина комментария не должна превышать 140 символов.');
      makeBorderRed(commentField);
    }
    if (errorsMessageArray.length !== 0) {
      var errorMessageText = '';
      errorsMessageArray.forEach(function (item) {
        errorMessageText += item;
        errorMessageHTML.textContent = errorMessageText;
      });
      submitButton.setAttribute('disabled', 'disable');
    }
  }

  // функция для отправки формы
  function submitForm() {
    uploadForm.addEventListener('submit', function (event) {
      window.backend.save(new FormData(uploadForm), closeUploadForm, onErrorPost);
      event.preventDefault();
    });
  }

  function initUploadForm() {
    // открываем форму загрузки фото
    uploadImgFile.addEventListener('change', openUploadForm);
    uploadForm.addEventListener('keydown', function (event) {
      if (event.keyCode === window.utils.ENTER_KEYCODE) {
        uploadImgFile.click();
      }
    });
    // закрываем форму загрузки фото
    closeButton.addEventListener('click', closeUploadForm);
    closeButton.addEventListener('keydown', function (event) {
      if (event.keyCode === window.utils.ENTER_KEYCODE) {
        closeUploadForm();
      }
    });
    // работа с фильтрами
    window.initializeFilters(img, applyFilter);
    // изменение масштаба фото
    window.initializeScale(scaleElement, adjustScale);
    // валидация формы
    uploadForm.addEventListener('input', onFormFillingIn);
    effectsSliderContainer.classList.add('hidden');
    // отправка формы
    submitButton.addEventListener('click', submitForm);
    submitButton.addEventListener('keydown', function (event) {
      if (event.keyCode === window.utils.ENTER_KEYCODE) {
        submitForm();
      }
    });
  }

  window.form = {
    renderErrorDiv: renderErrorDiv,
    scaleDownButton: scaleDownButton,
    enlargeButton: enlargeButton,
    effectsSliderContainer: effectsSliderContainer,
    slider: slider,
    thumb: thumb,
    saturationValue: saturationValue,
    saturationLevel: saturationLevel,
    targetElement: targetElement,
    resetSlider: resetSlider
  };

  initUploadForm();

})();

