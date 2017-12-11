'use strict';

(function () {

  window.initializeFilters = function (image, callback) {

    var effectsSliderContainer = window.form.effectsSliderContainer;
    var slider = window.form.slider;
    var thumb = window.form.thumb;
    var saturationValue = window.form.saturationValue;
    var saturationLevel = window.form.saturationLevel;
    var targetElement = window.form.targetElement;
    var resetSlider = window.form.resetSlider;

    // генерация эффектов 
    function addEffect(eLeft, eRight) {
      var effectsObject = {
        none: 'none',
        chrome: 'grayscale(' + (eLeft / eRight).toFixed(1) + ')',
        sepia: 'sepia(' + (eLeft / eRight).toFixed(1) + ')',
        marvin: 'invert(' + (eLeft / eRight).toFixed(1) + ')',
        phobos: 'blur(' + Math.round(eLeft / eRight * 3) + 'px)',
        heat: 'brightness(' + (eLeft / eRight).toFixed(1) * 3 + ')'
      };
      return effectsObject;
    }

    // добавляем data-effect для будущего target события клика
    var effectRadios = document.querySelectorAll('[name=effect]');
    var effectsArray = [];
    for (var j = 0; j < effectRadios.length; j++) {
      var valueEffect = effectRadios[j].getAttribute('value');
      effectRadios[j].nextElementSibling.setAttribute('data-effect', valueEffect);
      effectsArray.push(valueEffect);
    }

    function resetFilter(elem) {
      var defaultEffect = elem.getAttribute('data-effect');
      var defaultEffectsObject = addEffect(1, 1);
      image.style.filter = defaultEffectsObject[defaultEffect];
    }

    function show(elem) {
      if (Array.prototype.indexOf.call(elem.classList, 'hidden') !== -1) {
        elem.classList.remove('hidden');
      }
    }

    function hide(elem) {
      if (Array.prototype.indexOf.call(elem.classList, 'hidden') === -1) {
        elem.classList.add('hidden');
      }
    }

    var oldFilter;
    image.classList.add('effect-none');
    // выбор эффекта по радиокнопке 
    function onRadioEffectClick(event) {
      for (var i = 0; i < event.path.length; i++) {
        var element = event.path[i];
        if (element.classList && element.classList.contains(targetElement)) {
          effectsArray.forEach(function (item) {
            if (image.classList.contains('effect-' + item)) {
              oldFilter = item;
            }
          });
          var newFilter = element.getAttribute('data-effect');
          callback(image, oldFilter, newFilter);
          // сброс значений ползунка
          resetSlider();
          // сброс значений фильтра
          resetFilter(element);
          // показ-скрывание ползунка
          if (newFilter !== 'none') {
            show(effectsSliderContainer);
          } else {
            hide(effectsSliderContainer);
          }
        }
      }
    }
    document.body.addEventListener('click', onRadioEffectClick);

    // / ОБРАБОТЧИК ДЛЯ ПОЛЗУНКА
    // MOUSEDOWN
    thumb.addEventListener('mousedown', function (event) {
      event.preventDefault();

      // получаем координаты самой точки
      var thumbClientCoords = thumb.getBoundingClientRect();
      var thumbCoords = {};
      thumbCoords.left = thumbClientCoords.left + pageXOffset; // левая координата
      var startX = event.clientX; // начальная позиция курсора
      var maxRight = slider.clientWidth;// максимально возможное правое положение точки

      // сдвиг мышки относительно точки
      // var cursorShiftX = event.pageX - thumbCoords.left;

      // MOUSEMOVE
      var onMouseMove = function (moveEvent) {
        moveEvent.preventDefault();
        var evtShiftX = startX - moveEvent.clientX; // сдвиг курсора по оси x
        var estimatedCoordX = thumb.offsetLeft - evtShiftX; // координата x для точки
        if (estimatedCoordX < 0 || estimatedCoordX > maxRight) {
          return;
        }
        startX = moveEvent.clientX; // сбрасываем начало - теперь в текущее место
        thumb.style.left = estimatedCoordX + 'px'; // перемещаем точку в новую координату
        saturationValue.value = Math.round(estimatedCoordX / maxRight * 100);
        saturationLevel.style.width = saturationValue.value + '%';
        // объект с эффектами
        var effectsObject = addEffect(estimatedCoordX, maxRight);
        // добавляем обработку с ползунком
        var sliderEffect = image.classList[1].slice(7);
        image.style.filter = effectsObject[sliderEffect];
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
  };

})();
