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

function generateDomElements(objArray, offersNumber) {
  for (var i = 0; i < offersNumber; i++) {
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
  var offersNumber = 8;
  var objArray = [];
  for (var i = 1; i < offersNumber + 1; i++) {
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
  generateDomElements(objArray, offersNumber);
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
