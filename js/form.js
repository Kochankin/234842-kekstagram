'use strict';

(function () {

  // для базовых операций
  var uploadForm = document.querySelector('.upload-form');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadImgFile = document.querySelector('#upload-file');
  var closeButton = document.querySelector('#upload-cancel');
  var submitButton = document.querySelector('#upload-submit');
  var image = document.querySelector('.effect-image-preview');

  // работа с увеличением/уменьшением
  var SCALE_DEFAULT = '100%';
  var scaleDownIcon = document.querySelector('.upload-resize-controls-button-dec');
  var enlargeIcon = document.querySelector('.upload-resize-controls-button-inc');
  var scaleValueField = document.querySelector('.upload-resize-controls-value');
  var scaleValue = scaleValueField.getAttribute('value');
  var scaleStep = scaleValueField.getAttribute('step');

  // работа с полями хештегов и комментария
  var hashtagsField = document.querySelector('.upload-form-hashtags');
  var commentField = document.querySelector('.upload-form-description');

  var uploadEffectControls = document.querySelector('.upload-effect-controls');// блок с мини-превьюшками эффектов

  // переменные для ползунка
  var effectsSliderContainer = document.querySelector('.upload-effect-level');
  var slider = document.querySelector('.upload-effect-level-line');
  var thumb = slider.querySelector('.upload-effect-level-pin');
  thumb.style.position = 'relative';
  var saturationValue = document.querySelector('.upload-effect-level-value');
  var saturationLevel = slider.querySelector('.upload-effect-level-val');

  // прячем ползунок
  //  effectsSliderContainer.classList.add('hidden');

  // узел для сообщений об ошибке
  commentField.insertAdjacentHTML('afterend', '<p></p>');
  var errorMessageHTML = commentField.nextElementSibling;
  errorMessageHTML.classList.add('error-message');

  // сброс всех изменений фото
  function resetToDefault() {
    scaleValueField.setAttribute('value', SCALE_DEFAULT);
    image.style.transform = 'scale(1)';
    image.setAttribute('class', '');
    image.classList.add('effect-image-preview');
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

  // отправить фото
  function submitPhoto() {
    uploadForm.submit();
    resetToDefault();
  }
  // ///////////////////////////////////
  var defaultEffectsObject = {
    chrome: 'grayscale(1)',
    sepia: 'sepia(1)',
    marvin: 'invert(100%)',
    phobos: 'blur(5px)',
    heat: 'brightness(3)'
  };
  // //////////////////////////////////

  // выбор эффекта по радиокнопке
  function onRadioEffectClick(event) {
    event.path.forEach(function (element) {
      if (element.classList && element.classList.contains('upload-effect-label')) {
        var effect = element.previousElementSibling.getAttribute('id').slice(7);
        image.setAttribute('class', '');
        image.classList.add('effect-image-preview');
        image.classList.add(effect);
        if (image.classList[1] !== 'effect-none') {
          var defaultEffect = effect.slice(7);
          image.style.filter = defaultEffectsObject[defaultEffect];
          //   effectsSliderContainer.classList.remove('hidden');
        } else {
        //  effectsSliderContainer.classList.add('hidden');
          image.style.filter = 'none';
        }
      }
    });
  }

  // увеличение и уменьшение масштаба фото
  function onResizeIconClick(event) {
    event.path.forEach(function (element) {
      if (element === scaleDownIcon && scaleValue !== '25%') {
        scaleValue = (parseInt(scaleValue, 10) - scaleStep) + '%';
      }
      if (element === enlargeIcon && scaleValue !== '100%') {
        scaleValue = parseInt(scaleValue, 10) + Number(scaleStep) + '%';
      }
      scaleValueField.setAttribute('value', scaleValue);
      image.style.transform = 'scale(' + parseInt(scaleValue, 10) * 0.01 + ')';
    });
  }

  // оформление ошибки
  function makeBorderRed(element) {
    element.style.borderColor = 'red';
    element.style.borderWidth = '2px';
  }
  // убираем оформление ошибки
  function removeErrorAlarm() {
    errorMessageHTML.textContent = '';
    submitButton.removeAttribute('disabled');
    hashtagsField.style.borderColor = 'black';
    commentField.style.borderColor = 'black';
    hashtagsField.style.borderWidth = '1px';
    commentField.style.borderWidth = '1px';
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

  window.form = {
    initUploadForm: function () {
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
      // отправка формы с фото
      submitButton.addEventListener('click', submitPhoto);
      submitButton.addEventListener('keydown', function (event) {
        if (event.keyCode === window.utils.ENTER_KEYCODE) {
          submitPhoto();
        }
      });
      // эффекты для фото
      document.body.addEventListener('click', onRadioEffectClick);
      // изменение масштаба фото
      uploadOverlay.addEventListener('click', onResizeIconClick);
      // валидация формы
      uploadForm.addEventListener('input', onFormFillingIn);
    }
  };

  window.form.initUploadForm();

  // ползунок

  // получаем координаты слайдера

  var sliderClientCoords = slider.getBoundingClientRect();
  var sliderCoords = {};
  sliderCoords.top = sliderClientCoords.top + pageYOffset;
  sliderCoords.left = sliderClientCoords.left + pageXOffset;
  saturationLevel.style.top = '1%';

  // MOUSEDOWN
  thumb.addEventListener('mousedown', function (event) {
    event.preventDefault();
    thumb.ondragstart = function () {
      return false;
    };

    // получаем координаты самой точки
    var thumbClientCoords = thumb.getBoundingClientRect();
    var thumbCoords = {};
    thumbCoords.top = thumbClientCoords.top + pageYOffset;
	  thumbCoords.left = thumbClientCoords.left + pageXOffset;

    // максимально возможное правое положение точки
    var right = slider.offsetWidth;

    // сдвиг мышки относительно точки
    var shiftX = event.pageX - thumbCoords.left;

    // MOUSEMOVE
    var onMouseMove = function (moveEvent) {
      moveEvent.preventDefault();

      // =от текущего положения мыши до левого края слайдера
      var newLeft = moveEvent.pageX - sliderCoords.left - shiftX;
      if (newLeft < 0) {
        newLeft = 0;
      }// если меньше нуля, обнуляем, чтоб не ехала левее
      if (newLeft > right) {
        newLeft = right;
      }// если мышь уходит вправо, не позволяем выйти ей за максим.возможное расстояние
      thumb.style.left = newLeft + 'px';// задаем местонахождение
      var percentValue = Math.round(newLeft / right * 100);
      saturationValue.setAttribute('value', percentValue);
      saturationLevel.style.width = percentValue + '%';
      // объект с эффектами
      var effectsObject = {
        chrome: 'grayscale(' + (newLeft / right).toFixed(1) + ')',
        sepia: 'sepia(' + (newLeft / right).toFixed(1) + ')',
        marvin: 'invert(' + (newLeft / right).toFixed(1) + ')',
        phobos: 'blur(' + Math.round(newLeft / right * 3) + 'px)',
        heat: 'brightness(' + (newLeft / right).toFixed(1) * 3 + ')'
      };
      // смотрим в классе эффект, если он есть
      if (image.classList[1] !== 'effect-none') { // добавляем обработку с ползунком
        var effect = image.classList[1].slice(7);
        image.style.filter = effectsObject[effect];
      }
      // else {
      // image.style.filter = 'none';
      // }
      return false;
    };

    // MOUSEUP
    var onMouseUp = function (upEvent) {
      upEvent.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

})();
