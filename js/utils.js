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
    var items = array.slice(1);
    var itemsCount = 0;
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < items.length; j++) {
        if (array[i] === items[j]) {
          itemsCount++;
        }
      }
    }
    if (itemsCount > array.length) {
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

  window.utils = {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,
    getRandomInt: getRandomInt,
    isUnique: isUnique,
    debounce: debounce
  };

})();
