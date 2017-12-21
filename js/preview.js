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
      window.preview.onCloseIconClick();
    }
  }

  // функция для открытия галереи 
  function showPhoto(url, likes, comments) {
    galleryOverlayImage.setAttribute('src', url);
    commentsCount.textContent = comments;
    likesCount.textContent = likes;
    galleryOverlay.classList.remove('hidden');
    document.addEventListener('keydown', window.preview.onEscPress);
  }

  function onCloseIconEnter(event) {
    if (event.keyCode === window.utils.ENTER_KEYCODE) {
      window.preview.onCloseIconClick();
    }
  }

  // функции для закрытия фото
  function onCloseIconClick() {
    galleryOverlay.classList.add('hidden');
    document.removeEventListener('keydown', window.preview.onEscPress);
    window.preview.closePhotoIcon.removeEventListener('click', onCloseIconClick);
    window.preview.closePhotoIcon.removeEventListener('keydown', onCloseIconEnter);
    window.preview.closePhotoIcon.removeEventListener('keydown', onEscPress);
  }

  window.preview = {
    closePhotoIcon: closePhotoIcon,
    onEscPress: onEscPress,
    showPhoto: showPhoto,
    onCloseIconEnter: onCloseIconEnter,
    onCloseIconClick: onCloseIconClick
  };
})();
