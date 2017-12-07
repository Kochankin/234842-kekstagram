'use strict';

(function () {

// переменные для работы с галереей
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayImage = document.querySelector('.gallery-overlay-image');
  var likesCount = document.querySelector('.likes-count');
  var commentsCount = document.querySelector('.comments-count');


  var closePhotoIcon = document.querySelector('.gallery-overlay-close');

  function onEscPress(event) {
    if (event.keyCode === window.utils.ESC_KEYCODE) {
      onCloseIconClick();
    }
  }

  // функция для открытия галереи 
  function showPhoto(photoData, i) {
    galleryOverlayImage.setAttribute('src', photoData[i].url);
    commentsCount.textContent = photoData[i].comments.length;
    likesCount.textContent = photoData[i].likes;
    galleryOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onEscPress);
  }

  function onCloseIconEnter(event) {
    if (event.keyCode === window.utils.ENTER_KEYCODE) {
      onCloseIconClick();
    }
  }

  // функции для закрытия фото
  function onCloseIconClick() {
    galleryOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onEscPress);
  }

  window.preview = {
    closePhotoIcon: closePhotoIcon,
    onEscPress: onEscPress,
    showPhoto: showPhoto,
    onCloseIconEnter: onCloseIconEnter,
    onCloseIconClick: onCloseIconClick
  };
})();
