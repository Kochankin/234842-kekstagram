'use strict';

(function () {

  function onPictureClick(event) {
    var path = event.path || (event.composedPath && event.composedPath() || window.utils.composedPath(event.target));
    for (var i = 0; i < path.length; i++) {
      var element = path[i];
      if (element.classList && element.classList.contains('picture')) {
        var url = element.querySelector('img').getAttribute('src');
        var likes = element.querySelector('.picture-likes').textContent;
        var comments = element.querySelector('.picture-comments').textContent;
        window.preview.showPhoto(url, likes, comments);
        event.preventDefault();
        event.stopPropagation();
        closeGallery();
        return;
      }
    }
  }

  // функция для открытия с помощью табов и Enter
  function onPictureEnterKeydown(event) {
    if (event.keyCode === window.utils.ENTER_KEYCODE) {
      onPictureClick();
    }
  }

  function openGallery() {
    window.pictures.picturesContainer.addEventListener('click', onPictureClick, true);
    window.pictures.picturesContainer.addEventListener('keydown', onPictureEnterKeydown);
  }

  function closeGallery() {
    // добавляем обработчики закрытия фото
    window.preview.closePhotoIcon.addEventListener('click', window.preview.onCloseIconClick);
    window.preview.closePhotoIcon.addEventListener('keydown', window.preview.onCloseIconEnter);
    window.preview.closePhotoIcon.addEventListener('keydown', window.preview.onEscPress);
  }

  openGallery();

})();
