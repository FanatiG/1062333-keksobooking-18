'use strict';

function getRandomNumber(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function randomArrElement(el1, el2, el3, el4, el5, el6) {
  var arr = [];
  if (el4 === undefined && el5 === undefined && el6 === undefined) {
    arr = [el1, el2, el3];
    return arr[Math.floor(Math.random() * Math.floor(arr.length))];
  } else if (el5 === undefined && el6 === undefined) {
    arr = [el1, el2, el3, el4];
    return arr[Math.floor(Math.random() * Math.floor(arr.length))];
  } else {
    arr = [el1, el2, el3, el4, el5, el6];
    for (var i = 0; i < getRandomNumber(i, arr.length); i++) {
      arr.pop();
    }
    return arr;
  }
}

function randomArr(el1, el2, el3, el4, el5, el6) {
  var arr = [];
  var i = 0;
  if (el4 === undefined && el5 === undefined && el6 === undefined) {
    arr = [el1, el2, el3];
    for (i = 0; i < getRandomNumber(i, arr.length); i++) {
      arr.pop();
    }
    return arr;
  } else {
    arr = [el1, el2, el3, el4, el5, el6];
    for (i = 0; i < getRandomNumber(i, arr.length); i++) {
      arr.pop();
    }
    return arr;
  }
}

function generateDomElements(objArray) {
  for (var i = 0; i < 8; i++) {
    var fragment = document.createDocumentFragment();
    fragment.cloneNode(true);
    var pin = document.querySelector('#pin').content.querySelector('.map__pin');
    document.getElementsByClassName('map')[0].classList.remove('map--faded');
    var pinClone = pin.cloneNode(true);
    pinClone.style.left = objArray[i].location.x + 'px';
    pinClone.style.top = objArray[i].location.y + 'px';
    pinClone.querySelector('img').src = objArray[i].author.avatar;
    pinClone.querySelector('img').alt = objArray[i].offer.title;
    fragment.appendChild(pinClone);
    document.querySelector('.map__pins').appendChild(fragment);
  }
}

function generateArray() {
  var objArray = [];
  for (var i = 1; i < 9; i++) {
    var obj = {
      'author': {
        'avatar': './img/avatars/user' + '0' + i + '.png'
      },
      'offer': {
        'title': 'title ' + i,
        'address': '600, 350',
        'price': 9999,
        'type': randomArrElement('palace', 'flat', 'house', 'bungalo'),
        'rooms': 9999,
        'guests': 9999,
        'checkin': randomArrElement('12:00', '13:00', '14:00'),
        'checkout': randomArrElement('12:00', '13:00', '14:00'),
        'features': randomArr('wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'),
        'description': 'description',
        'photos': randomArr('http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg')
      },
      'location': {
        'x': getRandomNumber(0, 1150),
        'y': getRandomNumber(130, 630)
      }
    };
    objArray.push(obj);
  }
  generateDomElements(objArray);
}
generateArray();
