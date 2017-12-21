'use strict';

(function () {

  window.initializeScale = function (scaleElement, callback) {

    var SCALE_DEFAULT = '100%'; // по умолчанию
    var SCALE_MAX = '100%';
    var SCALE_MIN = '25%';
    var SCALE_STEP = 25;
    var value = SCALE_DEFAULT;

    // увеличение и уменьшение масштаба фото
    function onResizeButtonClick(event) {
      var path = event.path || (event.composedPath && event.composedPath() || window.utils.composedPath(event.target));
      path.forEach(function (element) {
        if (element === window.form.scaleDownButton && value !== SCALE_MIN) {
          value = (parseInt(value, 10) - SCALE_STEP) + '%';
        }
        if (element === window.form.enlargeButton && value !== SCALE_MAX) {
          value = parseInt(value, 10) + Number(SCALE_STEP) + '%';
        }
        callback(value);
      });
    }

    document.body.addEventListener('click', onResizeButtonClick);

    window.scaleListener = {
      onResizeButtonClick: onResizeButtonClick
    };

  };

})();
