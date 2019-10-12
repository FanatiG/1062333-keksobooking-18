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
var translate = {
  bungalo: {
    rusName: 'Бунгало'
  },
  flat: {
    rusName: 'Квартира'
  },
  house: {
    rusName: 'Дом'
  },
  palace: {
    rusName: 'Дворец'
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
var popup = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);
var PIN_LEG_HEIGHT = 22;
var mainPin = document.querySelector('.map__pin--main');
var ADDRESS_INPUT = document.getElementById('address');
var MENU_FIELDSET = document.querySelector('.ad-form').querySelectorAll('fieldset');
var pins = generatePinData();
var roomsNumber = document.querySelector('#room_number');
var guestsNumber = document.querySelector('#capacity');
var priceHtmlElement = document.querySelector('#price');
var titleHtmlElement = document.querySelector('#title');
var typeHtmlElement = document.querySelector('#type');
var timeInHtmlElement = document.querySelector('#timein');
var timeOutHtmlElement = document.querySelector('#timeout');

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

function renderPopup(pinsList) {
  var fragment = document.createDocumentFragment();
  popup.querySelector('.popup__title').textContent = pinsList.offer.title;
  popup.querySelector('.popup__text--address').textContent = pinsList.offer.address;
  popup.querySelector('.popup__text--price').textContent = pinsList.offer.price + '₽/ночь';
  popup.querySelector('.popup__type').textContent = translate[pinsList.offer.type]['rusName'];
  popup.querySelector('.popup__text--capacity').textContent = pinsList.offer.rooms + ' комнат(ы) для ' + pinsList.offer.guests + ' гостя(ей)';
  popup.querySelector('.popup__text--time').textContent = 'Заезд после ' + pinsList.offer.checkin + ', выезд после ' + pinsList.offer.checkout;
  var feature = popup.querySelector('.popup__features').querySelector('.popup__feature');
  while (popup.querySelector('.popup__features').firstChild) {
    popup.querySelector('.popup__features').removeChild(popup.querySelector('.popup__features').firstChild);
  }
  for (var i = 0; i < pinsList.offer.features.length; i++) {
    var featureClone = feature.cloneNode(true);
    featureClone.classList.value = 'popup__feature popup__feature--' + pinsList.offer.features[i];
    popup.querySelector('.popup__features').appendChild(featureClone);
  }
  popup.querySelector('.popup__description').textContent = pinsList.offer.description;
  var photo = popup.querySelector('.popup__photos').querySelector('.popup__photo');
  while (popup.querySelector('.popup__photos').firstChild) {
    popup.querySelector('.popup__photos').removeChild(popup.querySelector('.popup__photos').firstChild);
  }
  for (i = 0; i < pinsList.offer.photos.length; i++) {
    var photoClone = photo.cloneNode(true);
    photoClone.src = pinsList.offer.photos[i];
    popup.querySelector('.popup__photos').appendChild(photoClone);
  }
  popup.querySelector('.popup__avatar').src = pinsList.author.avatar;
  fragment.appendChild(popup);
  return fragment;
}

function setAddressValue(pinLegHeight) {
  var mainPinOffsetTop = mainPin.offsetTop;
  var mainPinOffsetLeft = mainPin.offsetLeft;
  var pinHorizontalCoordinates = Math.floor(mainPinOffsetLeft + (mainPin.querySelector('img').offsetWidth / 2));
  var inactivePinVerticalCoordinates = Math.floor(mainPinOffsetTop + mainPin.querySelector('img').offsetHeight + pinLegHeight);
  var activePinVerticalCoordinates = Math.floor(mainPin.offsetTop + mainPin.querySelector('img').offsetHeight / 2);
  var inactivePin = pinHorizontalCoordinates + ', ' + inactivePinVerticalCoordinates;
  var activePin = pinHorizontalCoordinates + ', ' + activePinVerticalCoordinates;
  var addressValue = pinLegHeight ? inactivePin : activePin;
  ADDRESS_INPUT.value = addressValue;
}

function toggleAvailability(selector, status) {
  for (var i = 0; i < selector.length; i++) {
    selector[i].disabled = status;
  }
}

function activatePage() {
  document.querySelector('.notice').querySelector('.ad-form--disabled').classList.remove('ad-form--disabled');
  mainPin.removeEventListener('mousedown', mainPinMouseDown);
  mainPin.removeEventListener('keydown', mainPinEnterDown);
  toggleAvailability(MENU_FIELDSET, false);
  setAddressValue(PIN_LEG_HEIGHT);
  activateMap();
  renderPinsOnMap(pins);
  addPopupOnPins();
  validation();
}

function mainPinMouseDown() {
  activatePage();
}

function mainPinEnterDown(evt) {
  if (evt.keyCode === 13) {
    activatePage();
  }
}

function checkGuestsValue() {
  var roomNumber = parseInt(roomsNumber.value, 10);
  var guestNumber = parseInt(guestsNumber.value, 10);
  if (roomNumber === 100 && guestNumber === 0) {
    guestsNumber.setCustomValidity('');
  } else if (roomNumber !== 100 && guestNumber <= roomNumber) {
    guestsNumber.setCustomValidity('');
  } else if (roomNumber === 100 && guestNumber !== 0) {
    guestsNumber.setCustomValidity('Значение "Количество мест" должно быть ' + guestsNumber[3].textContent);
  } else {
    guestsNumber.setCustomValidity('Значение "Количество мест" должно быть ' + roomNumber + ' или меньше');
  }
}

function addPopupOnPins() {
  var pinsHtmlList = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  for (var i = 0; i < document.querySelectorAll('.map__pin:not(.map__pin--main)').length; i++) {
    pinsHtmlList[i].addEventListener('mousedown', pinMouseDown);
    pinsHtmlList[i].addEventListener('keydown', pinEnterDown);
  }
}

function popupIntercation() {
  document.querySelector('.map__card').style.visibility = 'hidden';
  setAddressValue(PIN_LEG_HEIGHT);
}

function popupCloseMouse() {
  popupIntercation();
}

function popupCloseButton(evt) {
  if (evt.keyCode === 27) {
    popupIntercation();
  }
}

function openPopup() {
  var pinNumber = 0;
  if (event.target instanceof Image) {
    pinNumber = event.target.src.slice(-6, -4) - 1;
  } else {
    pinNumber = event.target.querySelector('img').src.slice(-6, -4) - 1;
  }
  document.querySelector('.map').insertBefore(renderPopup(pins[pinNumber]), document.querySelector('.map__filters-container'));
  document.querySelector('.map__card').style.visibility = 'visible';
  document.querySelector('.popup__close').addEventListener('mousedown', popupCloseMouse);
  document.addEventListener('keydown', popupCloseButton);
}

function pinMouseDown() {
  openPopup();
}

function pinEnterDown(evt) {
  if (evt.keyCode === 13) {
    openPopup();
  }
}

function timeIn() {
  if (timeInHtmlElement.value !== timeOutHtmlElement.value) {
    timeOutHtmlElement.value = timeInHtmlElement.value;
  }
}

function timeOut() {
  if (timeOutHtmlElement.value !== timeInHtmlElement.value) {
    timeInHtmlElement.value = timeOutHtmlElement.value;
  }
}

function titleFunction() {
  if (titleHtmlElement.value.length > 100 || titleHtmlElement.value.length < 30) {
    titleHtmlElement.setCustomValidity('Заголовок должен содержать от 30 до 100 символов!');
  } else {
    titleHtmlElement.setCustomValidity('');
  }
}

function getBuildingValue() {
  var minPriceValue = houseTypes[document.querySelector('#type').value].min;
  var maxPriceValue = houseTypes[document.querySelector('#type').value].max;
  return {
    min: minPriceValue,
    max: maxPriceValue
  };
}

function priceFunction() {
  var priceValue = priceHtmlElement.value;
  if (priceValue < getBuildingValue()['min'] || priceValue > getBuildingValue()['max']) {
    priceHtmlElement.setCustomValidity('Цена должна быть от ' + getBuildingValue()['min'] + ' и до ' + getBuildingValue()['max']);
  } else {
    priceHtmlElement.setCustomValidity('');
  }
}

function typeFunction() {
  priceFunction();
  priceHtmlElement.placeholder = getBuildingValue()['min'];
}

document.onload = function () {
  toggleAvailability(MENU_FIELDSET, true);
  mainPin.addEventListener('mousedown', mainPinMouseDown);
  mainPin.addEventListener('keydown', mainPinEnterDown);
  setAddressValue();
  typeFunction();
  ADDRESS_INPUT.readOnly = true;
  titleHtmlElement.setAttribute('required', '');
  priceHtmlElement.setAttribute('required', '');
}();

function validation() {
  checkGuestsValue();
  titleHtmlElement.addEventListener('input', titleFunction);
  priceHtmlElement.addEventListener('input', priceFunction);
  typeHtmlElement.addEventListener('change', typeFunction);
  timeInHtmlElement.addEventListener('change', timeIn);
  timeOutHtmlElement.addEventListener('change', timeOut);
}
