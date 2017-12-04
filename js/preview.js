'use strict';

(function () {

// переменные для работы с галереей
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayImage = document.querySelector('.gallery-overlay-image');
  var likesCount = document.querySelector('.likes-count');
  var commentsCount = document.querySelector('.comments-count');

  window.preview = {
    closePhotoIcon: document.querySelector('.gallery-overlay-close'),

    onEscPress: function (event) {
      if (event.keyCode === window.utils.ESC_KEYCODE) {
        window.preview.onCloseIconClick();
      }
    },

    // функция для открытия галереи 
    showPhoto: function (photoData, i) {
      galleryOverlayImage.setAttribute('src', photoData[i].url);
      commentsCount.textContent = photoData[i].comments.length;
      likesCount.textContent = photoData[i].likes;
      galleryOverlay.classList.remove('hidden');
      document.addEventListener('keydown', window.preview.onEscPress);
    },

    onCloseIconEnter: function (event) {
      if (event.keyCode === window.utils.ENTER_KEYCODE) {
        window.preview.onCloseIconClick();
      }
    },

    // функции для закрытия фото
    onCloseIconClick: function () {
      galleryOverlay.classList.add('hidden');
      document.removeEventListener('keydown', window.preview.onEscPress);
    }

  };
})();
