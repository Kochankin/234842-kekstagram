'use strict';

(function () {

  // сохранить с сервера (GET)
  function load(onLoad, onError) {
    var URL = 'https://1510.dump.academy/kekstagram/data';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s
    xhr.open('GET', URL);
    xhr.send();
  }

  load(onLoadGet, onErrorGet);

  function onLoadGet(response) {
    window.pictures.renderPictures(response);
  }

  function onErrorGet(response) {
    renderErrorDiv(document.body, response);
  }

  // загрузить на сервер (POST)
  var save = function (data, onLoad, onError) {
    var URL = ' https://1510.dump.academy/kekstagram';
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    xhr.open('POST', URL);
    xhr.send(data);
  };

  function onLoadPost() {
    window.form.closeUploadForm();
  }

  function onErrorPost(errorMessage) {
    window.form.resetToDefault();
    renderErrorDiv(window.form.submitButton, errorMessage);
  }

  function submitForm() {
    var form = window.form.uploadForm;
    form.addEventListener('submit', function (event) {
      save(new FormData(form), onLoadPost, onErrorPost);
      event.preventDefault();
    });
  }

  window.form.submitButton.addEventListener('click', submitForm);
  window.form.submitButton.addEventListener('keydown', function (event) {
    if (event.keyCode === window.utils.ENTER_KEYCODE) {
      submitForm();
    }
  });

  function renderErrorDiv(elem, errorMessage) {
    if (!document.body.querySelector('.error-style')) {
      var errorDiv = document.createElement('div');
      errorDiv.textContent = errorMessage;
      errorDiv.setAttribute('class', 'error-style');

      var warningImg = document.createElement('img');
      warningImg.setAttribute('class', 'warning-img');

      var close = document.createElement('span');
      close.textContent = 'X';
      close.setAttribute('class', 'close-img');
      close.addEventListener('click', function () {
        errorDiv.parentElement.removeChild(errorDiv);
      });
      warningImg.setAttribute('src', 'img/icon-warning.png');
      errorDiv.insertAdjacentElement('afterbegin', warningImg);
      errorDiv.insertAdjacentElement('beforeend', close);
      elem.insertAdjacentElement('beforebegin', errorDiv);
    }
  }

  window.backend = {
    load: load,
    save: save
  };

})();
