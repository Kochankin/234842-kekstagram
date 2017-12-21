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
    for (var i = 0; i < pictureData.length; i++) {
      documentFragment.appendChild(getPicture(pictureData[i]));
    }
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

  // обработчик для кнопки РЕКОМЕНДУЕМЫЕ
  function onRecommendButtonClick() {
    picturesContainer.innerHTML = '';
    var originPictures = loadedPictures.slice();
    renderPictures(originPictures);
  }
  // обработчик для кнопки ПОПУЛЯРНЫЕ
  function onPopularButtonClick() {
    picturesContainer.innerHTML = '';
    var originPictures = loadedPictures.slice();
    var newPictures = originPictures.sort(function (a, b) {
      var difference = b.likes - a.likes;
      if (difference === 0) {
        difference = b.comments.length - a.comments.length;
      }
      return difference;
    });
    renderPictures(newPictures);
  }
  // обработчик для кнопки ОБСУЖДАЕМЫЕ
  function onDiscussedButtonClick() {
    picturesContainer.innerHTML = '';
    var originPictures = loadedPictures.slice();
    var newPictures = originPictures.sort(function (a, b) {
      var difference = b.comments.length - a.comments.length;
      if (difference === 0) {
        difference = b.likes - a.likes;
      }
      return difference;
    });
    renderPictures(newPictures);
  }
  // обработчик для кнопки СЛУЧАЙНЫЕ
  function onRandomButtonClick() {
    picturesContainer.innerHTML = '';
    var originPictures = loadedPictures.slice();
    var newPictures = makeShuffledArray(originPictures);
    renderPictures(newPictures);
  }

  // инициация обработчиков
  function filtersButtonInit() {
    randomButton.addEventListener('click', function () {
      window.utils.debounce(onRandomButtonClick);
    });
    popularButton.addEventListener('click', function () {
      window.utils.debounce(onPopularButtonClick);
    });
    discussedButton.addEventListener('click', function () {
      window.utils.debounce(onDiscussedButtonClick);
    });
    recommendButton.addEventListener('click', function () {
      window.utils.debounce(onRecommendButtonClick);
    });
  }

  filtersButtonInit();

  window.pictures = {
    onLoadGet: onLoadGet,
    onErrorGet: onErrorGet,
    picturesContainer: picturesContainer
  };

})();
