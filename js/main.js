'use strict';

var PINSAMOUNT = 8;
var TITLE = 'title';
var bungalo = {
  name: 'bungalo',
  min: 0,
  max: 1000000
};
var flat = {
  name: 'flat',
  min: 1000,
  max: 1000000
};
var house = {
  name: 'house',
  min: 5000,
  max: 1000000
};
var palace = {
  name: 'palace',
  min: 10000,
  max: 1000000
};
var TYPE = [palace, flat, house, bungalo];
var ROOMS = [1, 2, 3, 100];
var GUESTS = ['для 1 гостя', 'для 2 гостей', 'для 3 гостей', 'не для гостей'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = 'description';
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var LOCATIONX = [0, 1150];
var LOCATIONY = [130, 630];

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
  var result = arr;
  return shuffle(result.slice(Math.floor(Math.random() * Math.floor(arr.length))));
}

function guestsNumber(roomsNumber) {
  var guestsDescription;
  switch (roomsNumber) {
    case 1:
      guestsDescription = GUESTS[0];
      break;
    case 2:
      guestsDescription = GUESTS[0] + ' ' + GUESTS[1];
      break;
    case 3:
      guestsDescription = GUESTS[0] + ' ' + GUESTS[1] + ' ' + GUESTS[2];
      break;
    case 100:
      guestsDescription = GUESTS[3];
      break;
  }
  return guestsDescription;
}

function priceValue(type) {
  var priceDescription;
  switch (type.name) {
    case 'bungalo':
      priceDescription = getRandomNumber(type.min, type.max);
      break;
    case 'flat':
      priceDescription = getRandomNumber(type.min, type.max);
      break;
    case 'house':
      priceDescription = getRandomNumber(type.min, type.max);
      break;
    case 'palace':
      priceDescription = getRandomNumber(type.min, type.max);
      break;
  }
  return priceDescription;
}

function renderPinsOnMap(pinsList) {
  var fragment = document.createDocumentFragment();
  var pin = document.querySelector('#pin').content.querySelector('.map__pin');
  document.getElementsByClassName('map')[0].classList.remove('map--faded');
  for (var i = 0; i < PINSAMOUNT; i++) {
    var pinClone = pin.cloneNode(true);
    pinClone.style.left = pinsList[i].location.x + 'px';
    pinClone.style.top = pinsList[i].location.y + 'px';
    pinClone.querySelector('img').src = pinsList[i].author.avatar;
    pinClone.querySelector('img').alt = pinsList[i].offer.title;
    fragment.appendChild(pinClone);
  }
  document.querySelector('.map__pins').appendChild(fragment);
}

function generatePinData() {
  var pinsList = [];
  for (var i = 1; i < PINSAMOUNT + 1; i++) {
    var rndRooms = randomArrElement(ROOMS);
    var rndGuests = guestsNumber(rndRooms, GUESTS);
    var rndType = randomArrElement(TYPE);
    var rndPrice = priceValue(rndType);
    var pinCoordX = getRandomNumber(LOCATIONX[0], LOCATIONX[1]);
    var pinCoordY = getRandomNumber(LOCATIONY[0], LOCATIONY[1]);
    var address = pinCoordX + ' ' + pinCoordY;
    var obj = {
      'author': {
        'avatar': './img/avatars/user0' + i + '.png'
      },
      'offer': {
        'title': TITLE,
        'address': address,
        'type': rndType.name,
        'rooms': rndRooms,
        'price': rndPrice,
        'guests': rndGuests,
        'checkin': randomArrElement(CHECKIN),
        'checkout': randomArrElement(CHECKOUT),
        'features': randomArr(FEATURES),
        'description': DESCRIPTION,
        'photos': randomArr(PHOTOS)
      },
      'location': {
        'x': pinCoordX,
        'y': pinCoordY,
      }
    };
    pinsList.push(obj);
  }
  renderPinsOnMap(pinsList);
}
generatePinData();
