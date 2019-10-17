// модуль, который создаёт данные
'use strict';
(function () {
  var PIN_LEG_HEIGHT = 22;
  var menuFieldsetElementList = document.querySelector('.ad-form').querySelectorAll('fieldset');
  var mainPinElement = document.querySelector('.map__pin--main');
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
  var mainPinOffsetTop = mainPinElement.offsetTop;
  var mainPinOffsetLeft = mainPinElement.offsetLeft;
  var mainPinAvatarElement = mainPinElement.querySelector('img');
  var addressInputElement = document.getElementById('address');
  var PINS_AMOUNT = 8;
  var TITLE = 'title';
  var ROOMS = [1, 2, 3, 100];
  var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
  var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var DESCRIPTION = 'description';
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var LOCATION_X = [0, 1150];
  var LOCATION_Y = [130, 630];
  var mapHtmlClassList = document.getElementsByClassName('map')[0].classList;

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
      // console.log(pinsList);
    }
    return pinsList;
  }
  var pins = generatePinData();

  function setAddressValue(pinLegHeight) {
    var pinHorizontalCoordinates = Math.floor(mainPinOffsetLeft + (mainPinAvatarElement.offsetWidth / 2));
    var inactivePinVerticalCoordinates = Math.floor(mainPinOffsetTop + mainPinAvatarElement.offsetHeight + pinLegHeight);
    var activePinVerticalCoordinates = Math.floor(mainPinElement.offsetTop + mainPinAvatarElement.offsetHeight / 2);
    var inactivePin = pinHorizontalCoordinates + ', ' + inactivePinVerticalCoordinates;
    var activePin = pinHorizontalCoordinates + ', ' + activePinVerticalCoordinates;
    var addressValue = pinLegHeight ? inactivePin : activePin;
    addressInputElement.value = addressValue;
  }

  function toggleAvailability(selector, status) {
    for (var i = 0; i < selector.length; i++) {
      selector[i].disabled = status;
    }
  }

  function activateMap() {
    mapHtmlClassList.remove('map--faded');
  }

  window.data = {
    pins: pins, // map, pin
    PIN_LEG_HEIGHT: PIN_LEG_HEIGHT, // map, pin
    setAddressValue: setAddressValue, // map, pin, form
    mainPinElement: mainPinElement, // pin
    PINS_AMOUNT: PINS_AMOUNT, // pin
    activateMap: activateMap, // pin
    menuFieldsetElementList: menuFieldsetElementList, // pin, form
    toggleAvailability: toggleAvailability, // pin, form
    houseTypes: houseTypes // form
  };
})();
