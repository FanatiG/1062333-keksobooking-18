'use strict';

var PINS_AMOUNT = 8;
var TITLE = 'title';
var houseTypes = {
  bungalo: {
    name: 'bungalo',
    min: 0,
    max: 1000000
  },
  flat: {
    name: 'flat',
    min: 1000,
    max: 1000000
  },
  house: {
    name: 'house',
    min: 5000,
    max: 1000000
  },
  palace: {
    name: 'palace',
    min: 10000,
    max: 1000000
  }
};
var ROOMS = [1, 2, 3, 100];
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = 'description';
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var LOCATION_X = [0, 1150];
var LOCATION_Y = [130, 630];
var pin = document.querySelector('#pin').content.querySelector('.map__pin');

function activateMap() {
  document.getElementsByClassName('map')[0].classList.remove('map--faded');
}

function getRandomNumber(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function getRandomArrElement(arr) {
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

function getRandomArr(arr) {
  return shuffle(arr.slice(Math.floor(Math.random() * Math.floor(arr.length))));
}

function getPriceValue(type) {
  return getRandomNumber(houseTypes[type]['min'], houseTypes[type]['max']);
}

function createPin(pinsList) {
  var pinClone = pin.cloneNode(true);
  pinClone.style.left = pinsList.location.x + 'px';
  pinClone.style.top = pinsList.location.y + 'px';
  pinClone.querySelector('img').src = pinsList.author.avatar;
  pinClone.querySelector('img').alt = pinsList.offer.title;
  return pinClone;
}

function renderPinsOnMap(pinsList) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < PINS_AMOUNT; i++) {
    fragment.appendChild(createPin(pinsList[i]));
  }
  document.querySelector('.map__pins').appendChild(fragment);
}

function generatePinData() {
  var pinsList = [];
  for (var i = 1; i <= PINS_AMOUNT; i++) {
    var roomsAmount = getRandomArrElement(ROOMS);
    var guestsAmount = getRandomNumber(1, 100);
    var roomType = getRandomArrElement(Object.keys(houseTypes));
    var roomPrice = getPriceValue(roomType);
    var pinCoordX = getRandomNumber(LOCATION_X[0], LOCATION_X[1]);
    var pinCoordY = getRandomNumber(LOCATION_Y[0], LOCATION_Y[1]);
    var address = pinCoordX + ' ' + pinCoordY;
    var obj = {
      'author': {
        'avatar': './img/avatars/user0' + i + '.png'
      },
      'offer': {
        'title': TITLE,
        'address': address,
        'type': roomType,
        'rooms': roomsAmount,
        'price': roomPrice,
        'guests': guestsAmount,
        'checkin': getRandomArrElement(CHECKIN_TIMES),
        'checkout': getRandomArrElement(CHECKOUT_TIMES),
        'features': getRandomArr(FEATURES),
        'description': DESCRIPTION,
        'photos': getRandomArr(PHOTOS)
      },
      'location': {
        'x': pinCoordX,
        'y': pinCoordY,
      }
    };
    pinsList.push(obj);
  }
  return pinsList;
}
activateMap();
renderPinsOnMap(generatePinData());
