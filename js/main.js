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

function guestsNumber(roomsNumber, GUESTS) {
  var guestsDescription;
  switch (roomsNumber) {
    case 1:
      guestsDescription = GUESTS[0];
      break;
    case 2:
      guestsDescription = GUESTS[0] + ' ' + GUESTS[1];
      break;
    case 3:
      guestsDescription = GUESTS[1] + ' ' + GUESTS[2];
      break;
    case 100:
      guestsDescription = GUESTS[3];
      break;
  }
  return guestsDescription;
}

function priceValue(type) {
  var priceDescription;
  switch (type) {
    case 'bungalo':
      priceDescription = getRandomNumber(0, 1000000);
      break;
    case 'flat':
      priceDescription = getRandomNumber(1000, 1000000);
      break;
    case 'house':
      priceDescription = getRandomNumber(5000, 1000000);
      break;
    case 'palace':
      priceDescription = getRandomNumber(10000, 1000000);
      break;
  }
  return priceDescription;
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
  var TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var ROOMS = [1, 2, 3, 100];
  var GUESTS = ['для 1 гостя', 'для 2 гостей', 'для 3 гостей', 'не для гостей'];
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
        'type': randomArrElement(TYPE),
        'rooms': randomArrElement(ROOMS),
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
    obj.offer.price = priceValue(obj.offer.type);
    obj.offer.guests = guestsNumber(obj.offer.rooms, GUESTS);
    objArray.push(obj);
  }
  generateDomElements(objArray);
  createPopup(objArray);
}
generateArray();

function createPopup(objArray) {
  var fragment = document.createDocumentFragment();
  fragment.cloneNode(true);
  var popup = document.querySelector('#card').content.querySelector('.map__card');
  popup.querySelector('.popup__title').textContent = objArray[0].offer.title;
  popup.querySelector('.popup__text--address').textContent = objArray[0].offer.address;
  popup.querySelector('.popup__text--price').textContent = objArray[0].offer.price + '₽/ночь';
  switch (objArray[0].offer.type) {
    case 'palace':
      popup.querySelector('.popup__type').textContent = 'Дворец';
      break;

    case 'flat':
      popup.querySelector('.popup__type').textContent = 'Квартира';
      break;

    case 'house':
      popup.querySelector('.popup__type').textContent = 'Дом';
      break;

    case 'bungalo':
      popup.querySelector('.popup__type').textContent = 'Бунгало';
      break;
  }
  popup.querySelector('.popup__text--capacity').textContent = objArray[0].offer.rooms + ' комнаты для ' + objArray[0].offer.guests + ' гостей';
  popup.querySelector('.popup__text--time').textContent = 'Заезд после ' + objArray[0].offer.checkin + ', выезд после ' + objArray[0].offer.checkout;
  var feature = popup.querySelector('.popup__features').querySelector('.popup__feature');
  while (popup.querySelector('.popup__features').firstChild) {
    popup.querySelector('.popup__features').removeChild(popup.querySelector('.popup__features').firstChild);
  }
  for (var i = 0; i < objArray[0].offer.features.length; i++) {
    var featureClone = feature.cloneNode(true);
    featureClone.classList.value = 'popup__feature popup__feature--' + objArray[0].offer.features[i];
    popup.querySelector('.popup__features').appendChild(featureClone);
  }
  popup.querySelector('.popup__description').textContent = objArray[0].offer.description;
  var photo = popup.querySelector('.popup__photos').querySelector('.popup__photo');
  while (popup.querySelector('.popup__photos').firstChild) {
    popup.querySelector('.popup__photos').removeChild(popup.querySelector('.popup__photos').firstChild);
  }
  for (i = 0; i < objArray[0].offer.photos.length; i++) {
    var photoClone = photo.cloneNode(true);
    photoClone.src = objArray[0].offer.photos[i];
    popup.querySelector('.popup__photos').appendChild(photoClone);
  }
  popup.querySelector('.popup__avatar').src = objArray[0].author.avatar;
  fragment.appendChild(popup);
  document.querySelector('.map').insertBefore(fragment, document.querySelector('.map__filters-container'));
}
