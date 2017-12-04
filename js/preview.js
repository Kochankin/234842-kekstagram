'use strict';

(function () {

// переменные для работы с галереей
  var galleryOverlay = document.querySelector('.gallery-overlay'); 
  var galleryOverlayImage = document.querySelector('.gallery-overlay-image');
  var likesCount = document.querySelector('.likes-count');
  var commentsCount = document.querySelector('.comments-count');
  var closePhotoIcon = document.querySelector('.gallery-overlay-close');

  // функция для открытия галереи 
  function showPhoto(photoData, i) {
    galleryOverlayImage.setAttribute('src', photoData[i].url);
    commentsCount.textContent = photoData[i].comments.length;
    likesCount.textContent = photoData[i].likes;
    galleryOverlay.classList.remove('hidden');
  }

  // обработчик при клике на картинку
  function onPictureClick(event) {
    for (var i = 0; i < event.path.length; i++) {
      var element = event.path[i];
      if (element.classList && element.classList.contains('picture')) {
        var id = Array.prototype.indexOf.call(element.parentNode.children, element);
        showPhoto(window.pictures.photosData, id);
        event.preventDefault();
        event.stopPropagation();
        document.addEventListener('keydown', onEscPress);
        return;
      }
    }
  }
  // функция для открытия с помощью табов и Enter
  function onPictureEnter(event) {
    if (event.keyCode === window.utils.ENTER_KEYCODE) {
      onPictureClick();
    }
  }

  // функции для закрытия фото
  function onCloseIconClick() {
    galleryOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onEscPress);
  }
  function onCloseIconEnter(event) {
    if (event.keyCode === window.utils.ENTER_KEYCODE) {
      onCloseIconClick();
    }
  }
  function onEscPress(event) {
    if (event.keyCode === window.utils.ESC_KEYCODE) {
      onCloseIconClick();
    }
  }

  window.preview = {
    openGallery: function () {
    // ставим обработчики открытия галереи
      window.pictures.picturesContainer.addEventListener('click', onPictureClick, true);
      window.pictures.picturesContainer.addEventListener('keydown', onPictureEnter);
    },
    closeGallery: function () {
    // добавляем обработчики закрытия фото
      closePhotoIcon.addEventListener('click', onCloseIconClick);
      closePhotoIcon.addEventListener('keydown', onCloseIconEnter);
      closePhotoIcon.addEventListener('keydown', onEscPress);
    }
  };

})();
