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
// крестик для закрытия 
var closePhotoIcon = document.querySelector('.gallery-overlay-close');

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
  picturesContainer.appendChild(documentFragment);
}

// запускаем генерацию объектов и создание шаблонов на их основе
function init() {
  photosData = getPhotosData(25);
  renderPictures(photosData);
}
init();

// коды для кнопок Esc и Enter
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

// функция для открытия галереи
function showPhoto(photoData, i) {
  galleryOverlayImage.setAttribute('src', photoData[i].url);
  commentsCount.textContent = photoData[i].comments.length;
  likesCount.textContent = photoData[i].likes;
  galleryOverlay.classList.remove('hidden');
}

// функция для закрытия фото
function closePhoto() {
  galleryOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
}

// функция для закрытия фото по кнопке Esc
var onPopupEscPress = function (event) {
  if (event.keyCode === ESC_KEYCODE) {
    closePhoto();
  }
};

// обработчик при клике на картинку
function onPictureClick(event) {
  for (var i = 0; i < event.path.length; i++) {
    var element = event.path[i];
    if (element.classList && element.classList.contains('picture')) {
      var id = Array.prototype.indexOf.call(element.parentNode.children, element);
      showPhoto(photosData, id);
      event.preventDefault();
      event.stopPropagation();
      document.addEventListener('keydown', onPopupEscPress);
      return;
    }
  }
}

// ставим обработчики открытия галереи
picturesContainer.addEventListener('click', onPictureClick, true);
picturesContainer.addEventListener('keydown', function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    onPictureClick();
  }
});

// добавляем обработчики закрытия фото
closePhotoIcon.addEventListener('click', function () {
  closePhoto();
});
closePhotoIcon.addEventListener('keydown', function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    closePhoto();
  }
});
