'use strict';

(function () {
// коды для кнопок Esc и Enter
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;


  // генерация рандомного числа от min до max
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }

  // проверка на уникальность - если есть дубли в массиве, возвращает false
  function isUnique(array) {
    var storage = [];
    array.forEach(function (currentValue) {
      if (!storage.includes(currentValue)) {
        storage.push(currentValue);
      }
    });
    if (array.length > storage.length) {
      return false;
    } else {
      return true;
    }
  }

  // для устранения дребезга
  function debounce(func) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(func, DEBOUNCE_INTERVAL);
  }

  // полифилл для path / composedPath
  function composedPath(el) {
    var path = [];
    while (el) {
      path.push(el);
      if (el.tagName === 'HTML') {
        path.push(document);
        path.push(window);
        return path;
      }
      el = el.parentElement;
    }
    return path;
  }

  window.utils = {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,
    getRandomInt: getRandomInt,
    isUnique: isUnique,
    debounce: debounce,
    composedPath: composedPath
  };

})();
