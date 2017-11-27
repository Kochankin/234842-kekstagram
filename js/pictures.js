'use strict';
/* global getPhotosData */

// создаем шаблоны и переменные для его узлов
var template = document.querySelector('#picture-template');
var imgTemplate = template.content.querySelector('img');
var commentsTepmlate = template.content.querySelector('.picture-comments');
var likesTemplate = template.content.querySelector('.picture-likes');
// переменная контейнера
var picturesContainer = document.querySelector('.pictures');
// в этот массив кладем сгенерированные объекты
var photosData = [];
// переменные для формы с фото
var galleryOverlay = document.querySelector('.gallery-overlay');
var galleryOverlayImage = document.querySelector('.gallery-overlay-image');
var likesCount = document.querySelector('.likes-count');
var commentsCount = document.querySelector('.comments-count');

// функция для вставки данных из массива в шаблон
function getPicture(photoData) {
  imgTemplate.setAttribute('src', photoData.url);
  commentsTepmlate.textContent = photoData.comments.length;
  likesTemplate.textContent = photoData.likes;
  return template.content.cloneNode(true);
}

// вставляем данные в каждый из шаблонов, добавляем в фрагмент, а его в дом  
function renderPictures(pictureData) {
  var documentFragment = document.createDocumentFragment();
  for (var i = 0; i < pictureData.length; i++) {
    documentFragment.appendChild(getPicture(pictureData[i]));
  }
  picturesContainer.appendChild(documentFragment);
}

// создание формы просмотра фото. Аргументы - массив объектов и номер объекта
function showPhoto(photoData, i) {
  galleryOverlayImage.setAttribute('src', photoData[i].url);
  commentsCount.textContent = photoData[i].comments.length;
  likesCount.textContent = photoData[i].likes;
  galleryOverlay.classList.remove('hidden');
}

// запускаем генерацию объектов и создание шаблонов на их основе
function init() {
  photosData = getPhotosData(25);
  renderPictures(photosData);
  showPhoto(photosData, 0);
}
init();

