'use strict';

(function () {

  var xhrData = {
    get: {
      data: '',
      url: 'https://1510.dump.academy/kekstagram/data'
    },
    post: {
      data: 'data',
      url: ' https://1510.dump.academy/kekstagram'
    }
  }

  var URL_GET = 'https://1510.dump.academy/kekstagram/data';
  var URL_POST = ' https://1510.dump.academy/kekstagram';

  // сохранить с сервера (GET)
  function load(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    /// вот эти все три обьработчкиа повесить в одном месте
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
    xhr.open('GET', URL_GET);
    xhr.send();
  }

  load(window.pictures.onLoadGet, window.pictures.onErrorGet);

  // загрузить на сервер (POST)
  function save(data, onLoad, onError) {
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

    xhr.open('POST', URL_POST);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    save: save
  };

})();
