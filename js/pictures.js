'use strict';
/* global getPhotosData */

// создаем шаблоны и переменные для его узлов
var template = document.querySelector('#picture-template');
var imgTemplate = template.content.querySelector('img');
var commentsTepmlate = template.content.querySelector('.picture-comments');
var likesTemplate = template.content.querySelector('.picture-likes');
// переменная контейнера
var picturesContainer = document.querySelector('.pictures');
// в этот массив кладем сгенерированные объекты
var photosData = [];
// переменные для формы с фото
var galleryOverlay = document.querySelector('.gallery-overlay');
var galleryOverlayImage = document.querySelector('.gallery-overlay-image');
var likesCount = document.querySelector('.likes-count');
var commentsCount = document.querySelector('.comments-count');
// крестик для закрытия 
var closePhotoIcon = document.querySelector('.gallery-overlay-close');

// функция для вставки данных из массива в шаблон
function getPicture(photoData) {
  imgTemplate.setAttribute('src', photoData.url);
  commentsTepmlate.textContent = photoData.comments.length;
  likesTemplate.textContent = photoData.likes;
  return template.content.cloneNode(true);
}

// вставляем каждый из шаблонов в фрагмент, а его в дом  
function renderPictures(pictureData) {
  var documentFragment = document.createDocumentFragment();
  for (var i = 0; i < pictureData.length; i++) {
    documentFragment.appendChild(getPicture(pictureData[i]));
  }
  picturesContainer.appendChild(documentFragment);
}

// коды для кнопок Esc и Enter
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

// функция для открытия галереи
function showPhoto(photoData, i) {
  galleryOverlayImage.setAttribute('src', photoData[i].url);
  commentsCount.textContent = photoData[i].comments.length;
  likesCount.textContent = photoData[i].likes;
  galleryOverlay.classList.remove('hidden');
}

// функция для закрытия фото
function closePhoto() {
  galleryOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
}

// функция для закрытия фото по кнопке Esc
function onPopupEscPress(event) {
  if (event.keyCode === ESC_KEYCODE) {
    closePhoto();
  }
}

// обработчик при клике на картинку
function onPictureClick(event) {
  for (var i = 0; i < event.path.length; i++) {
    var element = event.path[i];
    if (element.classList && element.classList.contains('picture')) {
      var id = Array.prototype.indexOf.call(element.parentNode.children, element);
      showPhoto(photosData, id);
      event.preventDefault();
      event.stopPropagation();
      document.addEventListener('keydown', onPopupEscPress);
      return;
    }
  }
}

// переменные для работы с формой загрузки фото
var uploadForm = document.querySelector('.upload-form');
var uploadOverlay = document.querySelector('.upload-overlay');
var uploadImgFile = document.querySelector('#upload-file');
var closeUploadFormIcon = document.querySelector('#upload-cancel');
var submitUploadForm = document.querySelector('#upload-submit');
var image = document.querySelector('.effect-image-preview');
var imgScaleDownIcon = document.querySelector('.upload-resize-controls-button-dec');
var imgEnlargeIcon = document.querySelector('.upload-resize-controls-button-inc');
var scaleValueField = document.querySelector('.upload-resize-controls-value');
var scaleValue = scaleValueField.getAttribute('value');
var SCALE_STEP = scaleValueField.getAttribute('step');
var SCALE_DEFAULT = '100%';
var imgResizeTool = document.querySelector('.upload-resize-controls');
var hashtagsField = document.querySelector('.upload-form-hashtags');
var commentField = document.querySelector('.upload-form-description');
var uploadEffectControls = document.querySelector('.upload-effect-controls');

// функция для закрытия фото по кнопке Esc
function onUploadFormEscPress(event) {
  if (event.keyCode === ESC_KEYCODE) {
    closeUploadForm();
  }
}

// открыть форму загрузки фото
function openUploadForm() {
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onUploadFormEscPress);
}
uploadImgFile.addEventListener('change', openUploadForm);
uploadForm.addEventListener('keydown', function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    uploadImgFile.click();
  }
});

// закрыть форму загрузки фото
function closeUploadForm() {
  uploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onUploadFormEscPress);
}
closeUploadFormIcon.addEventListener('click', closeUploadForm);
closeUploadFormIcon.addEventListener('keydown', function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    closeUploadForm();
  }
});


// отправить фото
function submitPhoto() {
  uploadForm.submit();
  scaleValueField.setAttribute('value', SCALE_DEFAULT);
  image.style.transform = 'scale(1)';
  image.setAttribute('class', '');
  image.classList.add('effect-image-preview');
  var radioEffect = uploadEffectControls.querySelectorAll('[type=radio]'); radioEffect.forEach(function (item) {
    item.checked = false;
    radioEffect[0].checked = true;
  });
  hashtagsField.value = '';
  commentField.value = '';
}

// выбор эффекта по радиокнопке
function onRadioEffectClick(event) {
  for (var i = 0; i < event.path.length; i++) {
    var element = event.path[i];
    if (element.classList && element.classList.contains('upload-effect-label')) {
      var id = element.previousElementSibling.getAttribute('id');
      var effect = id.slice(7);
      if (image.classList) {
        image.setAttribute('class', '');
        image.classList.add('effect-image-preview');
      }
      image.classList.add(effect);
    }
  }
}

// увеличение и уменьшение масштаба фото

function onImgResizeIconClick(event) {
  for (var i = 0; i < event.path.length; i++) {
    var element = event.path[i];
    if (element === imgScaleDownIcon && scaleValue !== '25%') {
      scaleValue = (parseInt(scaleValue, 10) - SCALE_STEP) + '%';
    }
    if (element === imgEnlargeIcon && scaleValue !== '100%') {
      scaleValue = parseInt(scaleValue, 10) + Number(SCALE_STEP) + '%';
    }
    scaleValueField.setAttribute('value', scaleValue);
    var transformScaleValue = parseInt(scaleValue, 10) * 0.01;
    image.style.transform = 'scale(' + transformScaleValue + ')';
  }
}

// проверка на уникальность - если возвращает false, то есть дубли
function isUnique(array) {
  var items = array.slice(1);
  var itemsCount = 0;
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < items.length; j++) {
      if (array[i] === items[j]) {
        itemsCount++;
      }
    }
  }
  if (itemsCount > array.length) {
    return false;
  } else {
    return true;
  }
}

// узел для сообщений об ошибке
commentField.insertAdjacentHTML('afterend', '<p></p>');
var errorMessageHTML = commentField.nextElementSibling;
errorMessageHTML.classList.add('error-message');

function onFormFillingIn() {
  if (errorMessageHTML.textContent) {
    errorMessageHTML.textContent = '';
    submitUploadForm.removeAttribute('disabled');
    hashtagsField.style.borderColor = 'black';
    hashtagsField.style.borderWidth = '1px';
    commentField.style.borderWidth = '1px';
  }

  // массив с сообщениями об ошибках
  var errorsMessageArray = [];
  // массив из введенных хештегов
  var hashtagsArray = hashtagsField.value.split(' ');
  hashtagsArray = hashtagsArray.filter(function (hashtag) {
    return hashtag;
  });

  // проверка регулярки.вернет false, если хоть один критерий не соблюден
  var hashtagValidity = hashtagsArray.every(function (hashtag) {
    return hashtag.match(/#[A-Za-zА-Яа-яЁё0-9]{1,20}/);
  });

  function makeBorderRed(element) {
    element.style.borderColor = 'red';
    element.style.borderWidth = '2px';
  }

  if (!hashtagValidity) {
    errorsMessageArray.push('Хеш-тег должен начинаться с символа # и разделяться пробелами, длина не должна превышать 20 символов.');
    makeBorderRed(hashtagsField);
  }

  if (hashtagsArray.length > 5) {
    errorsMessageArray.push('Количество хештегов не должно превышать 5.');
    makeBorderRed(hashtagsField);
  }

  if (!isUnique(hashtagsArray)) {
    errorsMessageArray.push('Не допускается повторение хештегов.');
    makeBorderRed(hashtagsField);
  }

  if (commentField.value.length > 140) {
    errorsMessageArray.push('Длина комментария не должна превышать 140 символов.');
    makeBorderRed(commentField);
  }

  if (errorsMessageArray.length !== 0) {
    var errorMessageText = '';
    errorsMessageArray.forEach(function (item) {
      errorMessageText += item;
      errorMessageHTML.textContent = errorMessageText;
    });
    submitUploadForm.setAttribute('disabled', 'disable');
  }
}

// запускаем главную функцию
function init() {
  photosData = getPhotosData(25);
  renderPictures(photosData);

  // ставим обработчики открытия галереи
  picturesContainer.addEventListener('click', onPictureClick, true);
  picturesContainer.addEventListener('keydown', function (event) {
    if (event.keyCode === ENTER_KEYCODE) {
      onPictureClick();
    }
  });

  // добавляем обработчики закрытия фото
  closePhotoIcon.addEventListener('click', function () {
    closePhoto();
  });
  closePhotoIcon.addEventListener('keydown', function (event) {
    if (event.keyCode === ENTER_KEYCODE) {
      closePhoto();
    }
  });

  // отправка формы с фото
  submitUploadForm.addEventListener('click', submitPhoto);
  submitUploadForm.addEventListener('keydown', function (event) {
    if (event.keyCode === ENTER_KEYCODE) {
      submitPhoto();
    }
  });

  // эффекты для фото
  document.body.addEventListener('click', onRadioEffectClick);

  // изменение масштаба фото
  imgResizeTool.addEventListener('click', onImgResizeIconClick);

  // валидация формы
  uploadForm.addEventListener('input', onFormFillingIn);
}

init();

