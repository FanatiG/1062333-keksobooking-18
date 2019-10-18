// 'use strict';

// //////// data.js /////////////////////////////////////////////////////////////////////////////////////////////////

// var PINS_AMOUNT = 8;
// var TITLE = 'title';
// var ROOMS = [1, 2, 3, 100];
// var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
// var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
// var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
// var DESCRIPTION = 'description';
// var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
// var LOCATION_X = [0, 1150];
// var LOCATION_Y = [130, 630];
// var houseTypes = {
//   bungalo: {
//     name: 'bungalo',
//     min: 0,
//     max: 1000000
//   },
//   flat: {
//     name: 'flat',
//     min: 1000,
//     max: 1000000
//   },
//   house: {
//     name: 'house',
//     min: 5000,
//     max: 1000000
//   },
//   palace: {
//     name: 'palace',
//     min: 10000,
//     max: 1000000
//   }
// };
// var pins = generatePinData();
// var PIN_LEG_HEIGHT = 22;
// var ENTER_KEY_CODE = 13;
// var ESC_KEY_CODE = 27;
// var translate = {
//   bungalo: {
//     rusName: 'Бунгало'
//   },
//   flat: {
//     rusName: 'Квартира'
//   },
//   house: {
//     rusName: 'Дом'
//   },
//   palace: {
//     rusName: 'Дворец'
//   }
// };
// var pin = document.querySelector('#pin').content.querySelector('.map__pin');
// var mainPinElement = document.querySelector('.map__pin--main');
// var popup = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);
// var formHtmlClassList = document.querySelector('.notice').querySelector('.ad-form--disabled').classList;
// var mapElement = document.querySelector('.map');
// var mapContainerElement = document.querySelector('.map__filters-container');
// var mapPinsElement = document.querySelector('.map__pins');
// var mapHtmlClassList = document.getElementsByClassName('map')[0].classList;
// var menuFieldsetElementList = document.querySelector('.ad-form').querySelectorAll('fieldset');
// var MAX_TITLE_LENGTH = 100;
// var MIN_TITLE_LENGTH = 30;
// var addressInputElement = document.getElementById('address');
// var roomsNumberElement = document.querySelector('#room_number');
// var guestsNumberElement = document.querySelector('#capacity');
// var priceHtmlElement = document.querySelector('#price');
// var titleHtmlElement = document.querySelector('#title');
// var typeHtmlElement = document.querySelector('#type');
// var timeInHtmlElement = document.querySelector('#timein');
// var timeOutHtmlElement = document.querySelector('#timeout');
// var typeValue = document.querySelector('#type');
// var mainPinOffsetTop = mainPinElement.offsetTop;
// var mainPinOffsetLeft = mainPinElement.offsetLeft;
// var mainPinAvatarElement = mainPinElement.querySelector('img');

// //////////////////////////////////////////////////////////////////////////////////////////////


// // //////////////////////// map.js ////////////////////////////////////////////////////////////////////////////////////////////////
// function getRandomNumber(min, max) {
//   var rand = min + Math.random() * (max + 1 - min);
//   return Math.floor(rand);
// }

// function getRandomArrElement(arr) {
//   return arr[Math.floor(Math.random() * Math.floor(arr.length))];
// }

// function shuffle(arr) {
//   var j;
//   var temp;
//   for (var i = arr.length - 1; i > 0; i--) {
//     j = Math.floor(Math.random() * (i + 1));
//     temp = arr[j];
//     arr[j] = arr[i];
//     arr[i] = temp;
//   }
//   return arr;
// }

// function getRandomArr(arr) {
//   return shuffle(arr.slice(Math.floor(Math.random() * Math.floor(arr.length))));
// }

// function getPriceValue(type) {
//   return getRandomNumber(houseTypes[type]['min'], houseTypes[type]['max']);
// }
// function generatePinData() {
//   var pinsList = [];
//   for (var i = 1; i <= PINS_AMOUNT; i++) {
//     var roomsAmount = getRandomArrElement(ROOMS);
//     var guestsAmount = getRandomNumber(1, 100);
//     var roomType = getRandomArrElement(Object.keys(houseTypes));
//     var roomPrice = getPriceValue(roomType);
//     var pinCoordX = getRandomNumber(LOCATION_X[0], LOCATION_X[1]);
//     var pinCoordY = getRandomNumber(LOCATION_Y[0], LOCATION_Y[1]);
//     var address = pinCoordX + ' ' + pinCoordY;
//     var obj = {
//       'author': {
//         'avatar': './img/avatars/user0' + i + '.png'
//       },
//       'offer': {
//         'title': TITLE,
//         'address': address,
//         'type': roomType,
//         'rooms': roomsAmount,
//         'price': roomPrice,
//         'guests': guestsAmount,
//         'checkin': getRandomArrElement(CHECKIN_TIMES),
//         'checkout': getRandomArrElement(CHECKOUT_TIMES),
//         'features': getRandomArr(FEATURES),
//         'description': DESCRIPTION,
//         'photos': getRandomArr(PHOTOS)
//       },
//       'location': {
//         'x': pinCoordX,
//         'y': pinCoordY,
//       }
//     };
//     pinsList.push(obj);
//   }
//   return pinsList;
// }

// function activateMap() {
//   mapHtmlClassList.remove('map--faded');
// }

// function createPin(pinsList, i) {
//   var pinClone = pin.cloneNode(true);
//   pinClone.style.left = pinsList.location.x + 'px';
//   pinClone.style.top = pinsList.location.y + 'px';
//   pinClone.querySelector('img').src = pinsList.author.avatar;
//   pinClone.querySelector('img').alt = pinsList.offer.title;
//   pinClone.querySelector('img').dataset.id = i;
//   return pinClone;
// }

// function renderPinsOnMap(pinsList) {
//   var fragment = document.createDocumentFragment();
//   for (var i = 0; i < PINS_AMOUNT; i++) {
//     fragment.appendChild(createPin(pinsList[i], i));
//   }
//   mapPinsElement.appendChild(fragment);
// }

// function renderPopup(pinsList) {
//   var fragment = document.createDocumentFragment();
//   popup.querySelector('.popup__title').textContent = pinsList.offer.title;
//   popup.querySelector('.popup__text--address').textContent = pinsList.offer.address;
//   popup.querySelector('.popup__text--price').textContent = pinsList.offer.price + '₽/ночь';
//   popup.querySelector('.popup__type').textContent = translate[pinsList.offer.type]['rusName'];
//   popup.querySelector('.popup__text--capacity').textContent = pinsList.offer.rooms + ' комнат(ы) для ' + pinsList.offer.guests + ' гостя(ей)';
//   popup.querySelector('.popup__text--time').textContent = 'Заезд после ' + pinsList.offer.checkin + ', выезд после ' + pinsList.offer.checkout;
//   var feature = popup.querySelector('.popup__features').querySelector('.popup__feature');
//   while (popup.querySelector('.popup__features').firstChild) {
//     popup.querySelector('.popup__features').removeChild(popup.querySelector('.popup__features').firstChild);
//   }
//   for (var i = 0; i < pinsList.offer.features.length; i++) {
//     var featureClone = feature.cloneNode(true);
//     featureClone.classList.value = 'popup__feature popup__feature--' + pinsList.offer.features[i];
//     popup.querySelector('.popup__features').appendChild(featureClone);
//   }
//   popup.querySelector('.popup__description').textContent = pinsList.offer.description;
//   var photo = popup.querySelector('.popup__photos').querySelector('.popup__photo');
//   while (popup.querySelector('.popup__photos').firstChild) {
//     popup.querySelector('.popup__photos').removeChild(popup.querySelector('.popup__photos').firstChild);
//   }
//   for (i = 0; i < pinsList.offer.photos.length; i++) {
//     var photoClone = photo.cloneNode(true);
//     photoClone.src = pinsList.offer.photos[i];
//     popup.querySelector('.popup__photos').appendChild(photoClone);
//   }
//   popup.querySelector('.popup__avatar').src = pinsList.author.avatar;
//   fragment.appendChild(popup);
//   return fragment;
// }

// function activatePage() {
//   formHtmlClassList.remove('ad-form--disabled');
//   mainPinElement.removeEventListener('mousedown', mainPinMouseDown);
//   mainPinElement.removeEventListener('keydown', mainPinEnterDown);
//   toggleAvailability(menuFieldsetElementList, false);
//   setAddressValue(PIN_LEG_HEIGHT);
//   activateMap();
//   renderPinsOnMap(pins);
//   addPopupOnPins();
//   validation();
// }

// function mainPinMouseDown() {
//   activatePage();
// }

// function mainPinEnterDown(evt) {
//   if (evt.keyCode === ENTER_KEY_CODE) {
//     activatePage();
//   }
// }


// function addPopupOnPins() {
//   var pinsElementList = document.querySelectorAll('.map__pin:not(.map__pin--main)');
//   for (var i = 0; i < pinsElementList.length; i++) {
//     pinsElementList[i].addEventListener('mousedown', pinMouseDown);
//     pinsElementList[i].addEventListener('keydown', pinEnterDown);
//   }
// }

// function popupIntercation() {
//   document.querySelector('.map__card').classList.add('hidden');
//   setAddressValue(PIN_LEG_HEIGHT);
// }

// function popupCloseMouse() {
//   popupIntercation();
// }

// function popupCloseButton(evt) {
//   if (evt.keyCode === ESC_KEY_CODE) {
//     popupIntercation();
//   }
// }

// function openPopup() {
//   var pinImage = event.target instanceof Image ? event.target : event.target.querySelector('img');
//   var pinNumber = pinImage.dataset.id || 0;
//   mapElement.insertBefore(renderPopup(pins[pinNumber]), mapContainerElement);
//   document.querySelector('.map__card').classList.remove('hidden');
//   document.querySelector('.popup__close').addEventListener('mousedown', popupCloseMouse);
//   document.addEventListener('keydown', popupCloseButton);
// }

// function pinMouseDown() {
//   openPopup();
// }

// function pinEnterDown(evt) {
//   if (evt.keyCode === ENTER_KEY_CODE) {
//     openPopup();
//   }
// }

// document.onload = function () {
//   mainPinElement.addEventListener('mousedown', mainPinMouseDown);
//   mainPinElement.addEventListener('keydown', mainPinEnterDown);
// }();

// // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// // ///////////////////// form.js ////////////////////////////////////////////////////////////////////////////////////////////////


// function setAddressValue(pinLegHeight) {
//   var pinHorizontalCoordinates = Math.floor(mainPinOffsetLeft + (mainPinAvatarElement.offsetWidth / 2));
//   var inactivePinVerticalCoordinates = Math.floor(mainPinOffsetTop + mainPinAvatarElement.offsetHeight + pinLegHeight);
//   var activePinVerticalCoordinates = Math.floor(mainPinElement.offsetTop + mainPinAvatarElement.offsetHeight / 2);
//   var inactivePin = pinHorizontalCoordinates + ', ' + inactivePinVerticalCoordinates;
//   var activePin = pinHorizontalCoordinates + ', ' + activePinVerticalCoordinates;
//   var addressValue = pinLegHeight ? inactivePin : activePin;
//   addressInputElement.value = addressValue;
// }

// function toggleAvailability(selector, status) {
//   for (var i = 0; i < selector.length; i++) {
//     selector[i].disabled = status;
//   }
// }

// function guestsChangeHandler() {
//   var roomNumber = parseInt(roomsNumberElement.value, 10);
//   var guestNumber = parseInt(guestsNumberElement.value, 10);
//   if (roomNumber === 100 && guestNumber === 0) {
//     guestsNumberElement.setCustomValidity('');
//   } else if (roomNumber !== 100 && guestNumber <= roomNumber) {
//     guestsNumberElement.setCustomValidity('');
//   } else if (roomNumber === 100 && guestNumber !== 0) {
//     guestsNumberElement.setCustomValidity('Значение "Количество мест" должно быть ' + guestsNumberElement[3].textContent);
//   } else {
//     guestsNumberElement.setCustomValidity('Значение "Количество мест" должно быть ' + roomNumber + ' или меньше');
//   }
// }

// function timeInChangeHandler() {
//   if (timeInHtmlElement.value !== timeOutHtmlElement.value) {
//     timeOutHtmlElement.value = timeInHtmlElement.value;
//   }
// }

// function timeOutChangeHandler() {
//   if (timeOutHtmlElement.value !== timeInHtmlElement.value) {
//     timeInHtmlElement.value = timeOutHtmlElement.value;
//   }
// }


// function titleChangeHandler() {
//   if (titleHtmlElement.value.length > MAX_TITLE_LENGTH || titleHtmlElement.value.length < MIN_TITLE_LENGTH) {
//     titleHtmlElement.setCustomValidity('Заголовок должен содержать от 30 до 100 символов!');
//   } else {
//     titleHtmlElement.setCustomValidity('');
//   }
// }

// function getPrices() {
//   var minPriceValue = houseTypes[typeValue.value].min;
//   var maxPriceValue = houseTypes[typeValue.value].max;
//   return {
//     min: minPriceValue,
//     max: maxPriceValue
//   };
// }

// function priceChangeHandler() {
//   var priceValue = priceHtmlElement.value;
//   if (priceValue < getPrices()['min'] || priceValue > getPrices()['max']) {
//     priceHtmlElement.setCustomValidity('Цена должна быть от ' + getPrices()['min'] + ' и до ' + getPrices()['max']);
//   } else {
//     priceHtmlElement.setCustomValidity('');
//   }
// }

// function typeChangeHandler() {
//   priceChangeHandler();
//   priceHtmlElement.placeholder = getPrices()['min'];
// }

// document.onload = function () {
//   toggleAvailability(menuFieldsetElementList, true);
//   setAddressValue();
//   typeChangeHandler();
// }();

// function validation() {
//   guestsChangeHandler();
//   titleHtmlElement.addEventListener('input', titleChangeHandler);
//   priceHtmlElement.addEventListener('input', priceChangeHandler);
//   typeHtmlElement.addEventListener('change', typeChangeHandler);
//   timeInHtmlElement.addEventListener('change', timeInChangeHandler);
//   timeOutHtmlElement.addEventListener('change', timeOutChangeHandler);
//   guestsNumberElement.addEventListener('change', guestsChangeHandler);
//   roomsNumberElement.addEventListener('change', guestsChangeHandler);
// }

