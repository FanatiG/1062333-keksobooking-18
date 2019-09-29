'use strict';

function getRandomNumber(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function randomArrElement(arr) {
  return arr[Math.floor(Math.random() * Math.floor(arr.length))];
}

function shuffle(arr) {
  var j;
  var temp;
  for (var i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

function randomArr(arr) {
  var index = Math.floor(Math.random() * Math.floor(arr.length));
  arr = shuffle(arr).slice(index);
  return arr;
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
  var TITLE = 'title ' + i;
  var ADDRESS = '600, 350';
  var PRICE = 0;
  var TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var ROOMS = 0;
  var GUESTS = 0;
  var CHECKIN = ['12:00', '13:00', '14:00'];
  var CHECKOUT = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var DESCRIPTION = 'description';
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var LOCATIONX = [0, 1150];
  var LOCATIONY = [130, 630];
  for (var i = 1; i < 9; i++) {
    var obj = {
      'author': {
        'avatar': './img/avatars/user0' + i + '.png'
      },
      'offer': {
        'title': TITLE,
        'address': ADDRESS,
        'price': PRICE,
        'type': randomArrElement(TYPE),
        'rooms': ROOMS,
        'guests': GUESTS,
        'checkin': randomArrElement(CHECKIN),
        'checkout': randomArrElement(CHECKOUT),
        'features': randomArr(FEATURES),
        'description': DESCRIPTION,
        'photos': randomArr(PHOTOS)
      },
      'location': {
        'x': getRandomNumber(LOCATIONX[0], LOCATIONX[1]),
        'y': getRandomNumber(LOCATIONY[0], LOCATIONY[1]),
      }
    };
    objArray.push(obj);
  }
  generateDomElements(objArray);
}
generateArray();
