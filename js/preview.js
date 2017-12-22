'use strict';

(function () {

// переменные для работы с галереей
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayImage = document.querySelector('.gallery-overlay-image');
  var likesCount = document.querySelector('.likes-count');
  var commentsCount = document.querySelector('.comments-count');
  var closePhotoIcon = document.querySelector('.gallery-overlay-close');

  // функция для открытия галереи 
  function showPhoto(url, likes, comments) {
    galleryOverlayImage.setAttribute('src', url);
    commentsCount.textContent = comments;
    likesCount.textContent = likes;
    galleryOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onEscPress);
  }

  // функции для закрытия фото
  function onCloseIconClick() {
    galleryOverlay.classList.add('hidden');
    closePhotoIcon.removeEventListener('click', onCloseIconClick);
    closePhotoIcon.removeEventListener('keydown', onCloseIconEnter);
    closePhotoIcon.removeEventListener('keydown', onEscPress);
  }

  function onEscPress(event) {
    if (event.keyCode === window.utils.ESC_KEYCODE) {
      window.preview.onCloseIconClick();
    }
  }

  function onCloseIconEnter(event) {
    if (event.keyCode === window.utils.ENTER_KEYCODE) {
      window.preview.onCloseIconClick();
    }
  }

  window.preview = {
    closePhotoIcon: closePhotoIcon,
    onEscPress: onEscPress,
    showPhoto: showPhoto,
    onCloseIconEnter: onCloseIconEnter,
    onCloseIconClick: onCloseIconClick
  };
})();
