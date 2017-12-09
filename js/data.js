'use strict';

(function () {
  //  массив подготовленных комментариев
  var PREPARED_COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

  //  выбор случайного комментария из массива
  function randomComment() {
    var randomNumber = window.utils.getRandomInt(0, PREPARED_COMMENTS.length - 1);
    return PREPARED_COMMENTS[randomNumber];
  }

  // генерация комментария
  function generateComment() {
    var commentsNumber = window.utils.getRandomInt(1, 2); // сколько комментариев надо генерировать: 1 или 2
    var comments = [];
    for (var i = 0; i < commentsNumber; i++) {
      var generatedComment = randomComment();
      while (comments.includes(generatedComment)) {
        generatedComment = randomComment();
      }
      comments.push(generatedComment);
    }
    return comments;
  }

  // генерация одного объекта с данными 
  function generatePhotoData(count) {
    return {
      url: 'photos/' + count + '.jpg',
      likes: window.utils.getRandomInt(15, 200),
      comments: generateComment(),
    };
  }

  window.data = {
    // генерация массива с 25 объектами
    getPhotosData: function (count) {
      var photosData = [];
      for (var i = 0; i < count; i++) {
        photosData.push(generatePhotoData(i + 1));
      }
      return photosData;
    }
  };

})();
