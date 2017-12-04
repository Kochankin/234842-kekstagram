'use strict';

(function () {

// переменные для шаблонов
  var template = document.querySelector('#picture-template');
  var imgTemplate = template.content.querySelector('img');
  var commentsTepmlate = template.content.querySelector('.picture-comments');
  var likesTemplate = template.content.querySelector('.picture-likes');

  // функция для вставки данных из массива в шаблон
  function getPicture(photoData) {
    imgTemplate.setAttribute('src', photoData.url);
    commentsTepmlate.textContent = photoData.comments.length;
    likesTemplate.textContent = photoData.likes;
    return template.content.cloneNode(true);
  }

  // вставляем каждый из шаблонов в фрагмент, а его в дом 
  function renderPictures(pictureData) {
    var documentFragment = document.createDocumentFragment();
    for (var i = 0; i < pictureData.length; i++) {
      documentFragment.appendChild(getPicture(pictureData[i]));
    }
    window.pictures.picturesContainer.appendChild(documentFragment);
  }

  window.pictures = {
  // массив сгенерированных объектов с данными для фото
    photosData: [],
    // переменная контейнера, куда будут вставлены миниатюры
    picturesContainer: document.querySelector('.pictures'),

    initRenderPictures: function () {
      window.pictures.photosData = window.data.getPhotosData(25);
      renderPictures(window.pictures.photosData);
    }
  };

})();
