'use strict';

(function () {

// переменные для шаблонов
  var template = document.querySelector('#picture-template');
  var imgTemplate = template.content.querySelector('img');
  var commentsTepmlate = template.content.querySelector('.picture-comments');
  var likesTemplate = template.content.querySelector('.picture-likes');

  var picturesContainer = document.querySelector('.pictures');
  var filtersForm = document.body.querySelector('.filters');
  var recommendButton = filtersForm.querySelector('#filter-recommend');
  var popularButton = filtersForm.querySelector('#filter-popular');
  var discussedButton = filtersForm.querySelector('#filter-discussed');
  var randomButton = filtersForm.querySelector('#filter-random');
  var loadedPictures;

  // функция для вставки данных из массива в шаблон
  function getPicture(photoData) {
    imgTemplate.setAttribute('src', photoData.url);
    likesTemplate.textContent = photoData.likes;
    commentsTepmlate.textContent = photoData.comments.length;
    return template.content.cloneNode(true);
  }

  // вставляем каждый из шаблонов в фрагмент, а его в дом 
  function renderPictures(pictureData) {
    var documentFragment = document.createDocumentFragment();
    pictureData.forEach(function (currentValue) {
      documentFragment.appendChild(getPicture(currentValue));
    });
    picturesContainer.appendChild(documentFragment);
  }

  // при успешной загрузке изображений (GET)
  function onLoadGet(response) {
    renderPictures(response);
    filtersForm.classList.remove('filters-inactive');
    loadedPictures = response;
  }

  // ошибка при запросе картинок (GET)
  function onErrorGet(response) {
    window.form.renderErrorDiv(document.body, response);
  }

  // функция по созданию нового массива со случайным порядком элементов внутри
  function makeShuffledArray(array) {
    var shuffledElems = [];
    array.forEach(function (currentValue) {
      var newIndex = window.utils.getRandomInt(0, (array.length - 1));
      while (shuffledElems[newIndex]) {
        newIndex = window.utils.getRandomInt(0, (array.length - 1));
      }
      shuffledElems[newIndex] = currentValue;
    });
    return shuffledElems;
  }

  // возвращает отсортированный массив при нажатии на popularButton или discussedButton
  function onPopAndDiscButtonsClick(param1, param2) {
    var originPictures = loadedPictures.slice();
    var newPictures = originPictures.sort(function (a, b) {
      var x = param1;
      var differenceArray = b[x].length - a[x].length;
      var differenceString = difference = b[x] - a[x];
      if (Array.isArray(b[param1])) {
        var difference = differenceArray;
        if (difference === 0) {
          x = param2;
          difference = differenceString;
        }
      } else {
        difference = differenceString;
        if (difference === 0) {
          x = param2;
          difference = differenceArray;
        }
      }
      return difference;
    });
    return newPictures;
  }

  // обобщенная функция для всех кнопок по фильтрации 
  function onFilterButtonClick(button) {
    picturesContainer.innerHTML = '';
    var newPictures;
    switch (button) {
      case recommendButton:
        newPictures = loadedPictures.slice();
        break;
      case popularButton:
        newPictures = onPopAndDiscButtonsClick.bind(null, 'likes', 'comments')();
        break;
      case discussedButton:
        newPictures = onPopAndDiscButtonsClick.bind(null, 'comments', 'likes')();
        break;
      case randomButton:
        newPictures = makeShuffledArray(loadedPictures.slice());
        break;
    }
    renderPictures(newPictures);
  }

  // хранилище с функциями фильтрации, очищенными от дребезга
  var debounced = {
    onRecommendButtonClick: window.utils.debounce(function () {
      onFilterButtonClick(recommendButton);
    }),
    onPopularButtonClick: window.utils.debounce(function () {
      onFilterButtonClick(popularButton);
    }),
    onDiscussedButtonClick: window.utils.debounce(function () {
      onFilterButtonClick(discussedButton);
    }),
    onRandomButtonClick: window.utils.debounce(function () {
      onFilterButtonClick(randomButton);
    })
  };

  // обработчики на кнопки фильтрации
  function filtersButtonInit() {
    recommendButton.addEventListener('click', debounced.onRecommendButtonClick);
    popularButton.addEventListener('click', debounced.onPopularButtonClick);
    discussedButton.addEventListener('click', debounced.onDiscussedButtonClick);
    randomButton.addEventListener('click', debounced.onRandomButtonClick);
  }

  filtersButtonInit();

  window.pictures = {
    onLoadGet: onLoadGet,
    onErrorGet: onErrorGet,
    picturesContainer: picturesContainer
  };

})();
