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
  var saturationValue = document.querySelector('.upload-effect-level-value');// значение value 
  var saturationLevel = slider.querySelector('.upload-effect-level-val');// желтая заливка линии
  var targetElement = 'upload-effect-label';// для обработки клика на картинку

  // узел для сообщений об ошибке
  commentField.insertAdjacentHTML('afterend', '<div></div>');
  var errorHTMLElement = commentField.nextElementSibling;
  errorHTMLElement.classList.add('error-message');

  // сброс всех изменений фото
  function resetToDefault() {
    scaleValueField.setAttribute('value', '100%');
    img.style.transform = 'scale(1)';
    img.setAttribute('class', 'effect-image-preview');
    var radioEffectButtons = uploadEffectControls.querySelectorAll('[type=radio]');
    radioEffectButtons.forEach(function (item) {
      item.checked = false;
      radioEffectButtons[0].checked = true;
    });
    hashtagsField.value = '';
    commentField.value = '';
  }

  function openUploadForm() {
    uploadImgFile.addEventListener('change', onUploadImgFileChange);
    uploadForm.addEventListener('keydown', function (event) {
      if (event.keyCode === window.utils.ENTER_KEYCODE) {
        uploadImgFile.click();
      }
    });
  }

  function onCloseButtonClick() {
    uploadOverlay.classList.add('hidden');
    resetToDefault();
    document.removeEventListener('keydown', onEscPress);
    closeButton.removeEventListener('click', onCloseButtonClick);
    closeButton.removeEventListener('keydown', onCloseButtonEnterKeydown);
    document.body.removeEventListener('click', window.filtersListener.onRadioEffectClick);
    document.body.removeEventListener('click', window.scaleListener.onResizeButtonClick);
    uploadForm.removeEventListener('input', onFormFillingIn);
    submitButton.removeEventListener('click', onSubmitButtonClick);
    submitButton.removeEventListener('keydown', onSubmitButtonEnterKeydown);
  }

  function onCloseButtonEnterKeydown(event) {
    if (event.keyCode === window.utils.ENTER_KEYCODE) {
      onCloseButtonClick();
    }
  }

  // функция для закрытия фото по кнопке Esc
  function onEscPress(event) {
    if (event.keyCode === window.utils.ESC_KEYCODE) {
      onCloseButtonClick();
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
  function makeRed(element) {
    if (element.matches('[type=submit]')) {
      element.style.color = 'red';
      element.style.backgroundColor = 'rgba(187, 0, 0, 0.4)';
    } else {
      element.style.borderColor = 'red';
      element.style.borderWidth = '2px';
    }
  }

  // убираем оформление ошибки заполнения формы
  function removeErrorAlarm() {
    errorHTMLElement.textContent = '';
    hashtagsField.style.borderColor = 'black';
    commentField.style.borderColor = 'black';
    hashtagsField.style.borderWidth = '1px';
    commentField.style.borderWidth = '1px';
    submitButton.style.color = '#ffe753';
    submitButton.style.backgroundColor = 'rgba(255, 231, 82, 0.2)';
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
      close.addEventListener('click', onCloseClick);
      warningImg.setAttribute('src', 'img/icon-warning.png');
      errorDiv.insertAdjacentElement('afterbegin', warningImg);
      errorDiv.insertAdjacentElement('beforeend', close);
      elem.insertAdjacentElement('beforebegin', errorDiv);
    }

    // закрытие сообщения об ошибке
    function onCloseClick() {
      errorDiv.parentElement.removeChild(errorDiv);
      close.removeEventListener('click', onCloseClick);
    }
  }

  // ошибка при отправке формы (POST)
  function onErrorPost(errorMessage) {
    resetToDefault();
    renderErrorDiv(submitButton, errorMessage);
  }

  var errorsAlarm = {
    symbols: 'Хеш-тег должен начинаться с символа # и разделяться пробелами, длина не должна превышать 20 символов.',
    count: 'Количество хештегов не должно превышать 5.',
    uniqueness: 'Не допускается повторение хештегов.',
    messageLength: 'Длина комментария не должна превышать 140 символов.'
  };

  // функция для валидации
  function onFormFillingIn() {

    if (errorHTMLElement.textContent) {
      removeErrorAlarm();
    }

    var errors = [];
    var hashtags = hashtagsField.value.split(' ');
    hashtags = hashtags.filter(function (hashtag) {
      return hashtag;
    });

    var hashtagValidity = hashtags.every(function (hashtag) {
      return hashtag.match(/#[A-Za-zА-Яа-яЁё0-9]{1,20}/);
    });

    var whiteSpaceValidity = true;
    if ((hashtagsField.value.split('  ').length - 1) > 0) {
      whiteSpaceValidity = false;
    }

    function showError() {
      makeRed(errorField);
      makeRed(submitButton);
      var errorMessageText = '';
      errors.forEach(function (item) {
        errorMessageText += item;
        errorHTMLElement.textContent = errorMessageText;
      });
      submitButton.removeEventListener('click', onSubmitButtonClick);
      uploadForm.addEventListener('submit', function (event) {
        event.preventDefault();
      });
    }

    if (!hashtagValidity || !whiteSpaceValidity) {
      errors.push(errorsAlarm.symbols);
      var errorField = hashtagsField;
    }
    if (hashtags.length > 5) {
      errors.push(errorsAlarm.count);
      errorField = hashtagsField;
    }
    if (!window.utils.isUnique(hashtags)) {
      errors.push(errorsAlarm.uniqueness);
      errorField = hashtagsField;
    }
    if (commentField.value.length > 140) {
      errors.push(errorsAlarm.messageLength);
      errorField = commentField;
    }

    if (errors.length !== 0) {
      showError();
    }
  }

  // функция для отправки формы
  function onSubmitButtonClick() {
    uploadForm.addEventListener('submit', function (event) {
      window.backend.save(new FormData(uploadForm), onCloseButtonClick, onErrorPost);
      event.preventDefault();
    });
  }

  function onSubmitButtonEnterKeydown(event) {
    if (event.keyCode === window.utils.ENTER_KEYCODE) {
      onSubmitButtonClick();
    }
  }

  // устранение дребезга
  var debouncedFormFillingIn = window.utils.debounce(onFormFillingIn);

  function onUploadImgFileChange() {
    uploadOverlay.classList.remove('hidden');
    resetSlider();
    document.addEventListener('keydown', onEscPress);
    // закрываем форму загрузки фото
    closeButton.addEventListener('click', onCloseButtonClick);
    closeButton.addEventListener('keydown', onCloseButtonEnterKeydown);
    // работа с фильтрами
    window.initializeFilters(img, applyFilter);
    // изменение масштаба фото
    window.initializeScale(scaleElement, adjustScale);
    // валидация формы
    uploadForm.addEventListener('input', debouncedFormFillingIn);
    effectsSliderContainer.classList.add('hidden');
    // отправка формы
    submitButton.addEventListener('click', onSubmitButtonClick);
    submitButton.addEventListener('keydown', onSubmitButtonEnterKeydown);
  }

  openUploadForm();

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

})();

