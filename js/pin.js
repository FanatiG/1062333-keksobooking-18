// модуль, который отвечает за создание пина — метки на карте
'use strict';
(function () {
  var ENTER_KEY_CODE = 13;
  var MAX_PINS_AMOUNT = 5;
  var MAP_WIDTH = Number(window.getComputedStyle(document.querySelector('body')).getPropertyValue('max-width').slice(0, 4));
  var PIN_WIDTH = document.querySelector('.map__pin--main img').offsetWidth;
  var MAX_X_VALUE = MAP_WIDTH - (PIN_WIDTH / 2);
  var LOCATION_X = [0, MAX_X_VALUE];
  var LOCATION_Y = [130, 630];
  var MIN_PRICE = 10000;
  var MAX_PRICE = 50000;
  var MIN_PRICE_ID = 'low';
  var MID_PRICE_ID = 'middle';
  var FORM_NUMBER = 0;
  var FILTER_DEFAULT_VALUE = 'any';

  var formHtmlClassList = document.querySelector('.ad-form--disabled').classList;
  var pin = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPinsElement = document.querySelector('.map__pins');
  var defaultPins = [];
  var houseTypeQuantity = document.querySelector('#housing-type');
  var houseRoomsQuantity = document.querySelector('#housing-rooms');
  var houseGuestsQuantity = document.querySelector('#housing-guests');
  var housePriceQuantity = document.querySelector('#housing-price');
  var houseFeatures = document.querySelectorAll('#housing-features input');

  function createPin(pinsList, i) {
    var pinClone = pin.cloneNode(true);
    pinClone.style.left = pinsList.location.x + 'px';
    pinClone.style.top = pinsList.location.y + 'px';
    pinClone.querySelector('img').src = pinsList.author.avatar;
    pinClone.querySelector('img').alt = pinsList.offer.title;
    pinClone.querySelector('img').dataset.id = i;
    return pinClone;
  }

  function clearPinsFromMap() {
    while (document.querySelector('.map__pin:not(.map__pin--main)')) {
      mapPinsElement.removeChild(document.querySelector('.map__pin:not(.map__pin--main)'));
    }
  }

  function renderPinsOnMap(filteredPinsList) {
    if (document.querySelector('.map__card')) {
      document.querySelector('.map__card').classList.add('hidden');
    }
    clearPinsFromMap();
    if (filteredPinsList) {
      generatePinsData(filteredPinsList);
    } else {
      generatePinsData(window.xhr.serverData);
    }
    addPopupOnPins();
    defaultPins = window.xhr.serverData;
    window.pin.pins = defaultPins;
  }

  function generatePinsData(pinsDataList) {
    if (pinsDataList.length > 5) {
      var removeExcessivePins = pinsDataList.slice(0, MAX_PINS_AMOUNT);
    } else {
      removeExcessivePins = pinsDataList;
    }
    var fragment = document.createDocumentFragment();
    for (var elem in removeExcessivePins) {
      if (Object.prototype.hasOwnProperty.call(removeExcessivePins, elem)) {
        fragment.appendChild(createPin(removeExcessivePins[elem], elem));
      }
    }
    mapPinsElement.appendChild(fragment);
  }

  function mainPinMouseDownHandler(evt) {
    if (formHtmlClassList.contains('ad-form--disabled')) {
      activatePage();
    } else {
      dragDropMainPin(evt);
    }
  }

  function dragDropMainPin(evt) {
    var mainPin = window.data.mainPinElement;
    mainPin.style.zIndex = getComputedStyle(document.querySelector('.map__pin'))['zIndex'] + 1;
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var mainPinMouseMoveHandler = function (moveEvt) {
      var minCoordX = LOCATION_X[0];
      var maxCoordX = LOCATION_X[1];
      var minCoordY = LOCATION_Y[0];
      var maxCoordY = LOCATION_Y[1];
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      if (mainPin.style.left.slice(0, -2) < minCoordX) {
        mainPin.style.left = minCoordX + 'px';
      }
      if (mainPin.style.left.slice(0, -2) > maxCoordX) {
        mainPin.style.left = maxCoordX + 'px';
      }
      if (mainPin.style.top.slice(0, -2) < minCoordY) {
        mainPin.style.top = minCoordY + 'px';
      }
      if (mainPin.style.top.slice(0, -2) > maxCoordY) {
        mainPin.style.top = maxCoordY + 'px';
      }
      window.data.setAddressValue(window.data.PIN_LEG_HEIGHT);
    };
    var mainPinStopHandler = function () {
      mainPin.removeEventListener('mousemove', mainPinMouseMoveHandler);
      mainPin.removeEventListener('mouseup', mainPinStopHandler);
      mainPin.removeEventListener('mouseout', mainPinStopHandler);
    };
    mainPin.addEventListener('mousemove', mainPinMouseMoveHandler);
    mainPin.addEventListener('mouseup', mainPinStopHandler);
    mainPin.addEventListener('mouseout', mainPinStopHandler);
  }

  function mainPinEnterDownHandler(evt) {
    if (evt.keyCode === ENTER_KEY_CODE) {
      activatePage();
    }
  }

  function addPopupOnPins() {
    var pinsElementList = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var elem in pinsElementList) {
      if (Object.prototype.hasOwnProperty.call(pinsElementList, elem)) {
        pinsElementList[elem].addEventListener('mousedown', pinMouseDownHandler);
        pinsElementList[elem].addEventListener('keydown', pinEnterDownHandler);
      }
    }
  }

  function pinMouseDownHandler() {
    window.map.openPopup();
  }

  function pinEnterDownHandler(evt) {
    if (evt.keyCode === ENTER_KEY_CODE) {
      window.map.openPopup();
    }
  }

  document.onload = function () {
    window.data.mainPinElement.addEventListener('mousedown', mainPinMouseDownHandler);
    window.data.mainPinElement.addEventListener('keydown', mainPinEnterDownHandler);
  }();

  function activatePage() {
    formHtmlClassList.remove('ad-form--disabled');
    window.data.toggleAvailability(window.data.menuFieldsetElementList, false);
    window.data.setAddressValue(window.data.PIN_LEG_HEIGHT);
    window.data.mapHtmlClassList.remove('map--faded');
    window.xhr.receiveData();
    window.form.validation();
  }

  var filterByType = function (item) {
    return houseTypeQuantity.value === FILTER_DEFAULT_VALUE ?
      true :
      item.offer.type === houseTypeQuantity.value;
  };
  var filterByPrice = function (item) {
    if (housePriceQuantity.value === FILTER_DEFAULT_VALUE) {
      return true;
    } else if (housePriceQuantity.value === MIN_PRICE_ID) {
      return item.offer.price <= MIN_PRICE;
    } else if (housePriceQuantity.value === MID_PRICE_ID) {
      return item.offer.price >= MIN_PRICE && item.offer.price <= MAX_PRICE;
    } else {
      return item.offer.price >= MAX_PRICE;
    }
  };
  var filterByRooms = function (item) {
    return houseRoomsQuantity.value === FILTER_DEFAULT_VALUE ?
      true :
      item.offer.rooms === parseInt(houseRoomsQuantity.value, 10);
  };
  var filterByGuests = function (item) {
    return houseGuestsQuantity.value === FILTER_DEFAULT_VALUE ?
      true :
      item.offer.guests === parseInt(houseGuestsQuantity.value, 10);
  };
  var filterByFeatures = function (item) {
    return Array.from(houseFeatures)
      .filter(function (element) {
        return element.checked === true;
      })
      .map(function (element) {
        return element.value;
      })
      .every(function (feature) {
        return item.offer.features.includes(feature);
      });
  };
  var filterData = function (data) {
    return data
      .filter(function (item) {
        return filterByType(item) && filterByPrice(item) && filterByRooms(item) &&
          filterByGuests(item) && filterByFeatures(item);
      })
      .slice(0, MAX_PINS_AMOUNT);
  };

  document.forms[FORM_NUMBER].addEventListener('change', function () {
    renderPinsOnMap(filterData(defaultPins));
    window.pin.pins = filterData(defaultPins);
  });

  window.pin = {
    formHtmlClassList: formHtmlClassList,
    mapPinsElement: mapPinsElement,
    renderPinsOnMap: renderPinsOnMap,
    pins: defaultPins,
    filterData: filterData
  };
})();
