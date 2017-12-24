'use strict';

(function () {
// коды для кнопок Esc и Enter
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var DEBOUNCE_INTERVAL = 500;

  // генерация рандомного числа от min до max
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }

  // проверка на уникальность - если есть дубли в массиве, возвращает false
  // спасибо Вам большое, Таинственный наставник!:) сама бы до такого элегантного решения не дошла)
  function isUnique(array) {
    var checked = [];
    var unique = true;
    for (var i = 0; i < array.length && unique; i++) {
      var item = array[i];
      unique = !checked.includes(item);
      checked.push(item);
    }
    return unique;
  }

  // для устранения дребезга
  function debounce(func) {
    var timeout;
    return function () {
      var ctx = null;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(ctx, args);
      }, DEBOUNCE_INTERVAL);
    };
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


