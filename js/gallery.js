'use strict';

(function () {
  window.gallery = {
    initGallery: function(){
      window.pictures.initRenderPictures();
      window.preview.openGallery();
      window.preview.closeGallery();
    }
  };

  window.gallery.initGallery();
})();
