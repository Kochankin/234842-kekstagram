'use strict';

(function () {

  // обработчик при клике на картинку
  function onPictureClick(event) {
    for (var i = 0; i < event.path.length; i++) {
      var element = event.path[i];
      if (element.classList && element.classList.contains('picture')) {
        var id = Array.prototype.indexOf.call(element.parentNode.children, element);
        window.preview.showPhoto(window.pictures.photosData, id);
        event.preventDefault();
        event.stopPropagation();
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

  function initGallery() {
    // ставим обработчики открытия галереи
    window.pictures.picturesContainer.addEventListener('click', onPictureClick, true);
    window.pictures.picturesContainer.addEventListener('keydown', onPictureEnter);
    // добавляем обработчики закрытия фото
    window.preview.closePhotoIcon.addEventListener('click', window.preview.onCloseIconClick);
    window.preview.closePhotoIcon.addEventListener('keydown', window.preview.onCloseIconEnter);
    window.preview.closePhotoIcon.addEventListener('keydown', window.preview.onEscPress);
  }

  function initPicturesAndGallery() {
    window.pictures.initRenderPictures();
    initGallery();
  }

  initPicturesAndGallery();
})();
