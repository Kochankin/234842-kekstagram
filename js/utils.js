'use strict';

window.utils = {

// коды для кнопок Esc и Enter
  ESC_KEYCODE: 27,
  ENTER_KEYCODE: 13,

  // генерация рандомного числа от min до max
  getRandomInt: function (min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  },

  // проверка на уникальность - если есть дубли в массиве, возвращает false
  isUnique: function (array) {
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
};
