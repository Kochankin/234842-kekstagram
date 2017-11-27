'use strict';
/* exported getPhotosData */

// генерация рандомного числа от min до max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

//  массив комментариев
var PREPARED_COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

//  вызываю случайный комментарий из массива
function randomComment() {
  var randomNumber = getRandomInt(0, PREPARED_COMMENTS.length - 1);
  return PREPARED_COMMENTS[randomNumber];
}

// генерация комментария
function generateComment() {
  var commentsNumber = getRandomInt(1, 2); // сколько комментариев надо генерировать: 1 или 2
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

// генерация одного объекта
function generatePhotoData(count) {
  return {
    url: 'photos/' + count + '.jpg',
    likes: getRandomInt(15, 200),
    comments: generateComment()
  };
}

// генерация массива с 25 объектами
function getPhotosData(count) {
  var photosData = [];
  for (var i = 0; i < count; i++) {
    photosData.push(generatePhotoData(i + 1));
  }
  return photosData;
}
