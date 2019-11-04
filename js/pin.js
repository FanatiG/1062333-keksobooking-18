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
  var MAX_PRICE_ID = 'high';
  var DEFAULT_SELECT_VALUE = 'any';
  var FORM_NUMBER = 0;

  var formHtmlClassList = document.querySelector('.ad-form--disabled').classList;
  var pin = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPinsElement = document.querySelector('.map__pins');

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

  function removeExcessivePins() {
    while (document.querySelectorAll('.map__pin:not(.map__pin--main)').length > MAX_PINS_AMOUNT) {
      document.querySelectorAll('.map__pin:not(.map__pin--main)')[document.querySelectorAll('.map__pin:not(.map__pin--main)').length - 1].remove();
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
  }

  function generatePinsData(pinsDataList) {
    var fragment = document.createDocumentFragment();
    for (var elem in pinsDataList) {
      if (Object.prototype.hasOwnProperty.call(pinsDataList, elem)) {
        fragment.appendChild(createPin(pinsDataList[elem], elem));
      }
    }
    mapPinsElement.appendChild(fragment);
    removeExcessivePins();
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

  var housingType = document.querySelector('#housing-type');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var housingPrice = document.querySelector('#housing-price');
  var housingFeatureWifi = document.querySelector('#filter-wifi');
  var housingFeatureDishwasher = document.querySelector('#filter-dishwasher');
  var housingFeatureParking = document.querySelector('#filter-parking');
  var housingFeatureWasher = document.querySelector('#filter-washer');
  var housingFeatureElevator = document.querySelector('#filter-elevator');
  var housingFeatureConditioner = document.querySelector('#filter-conditioner');
  document.forms[FORM_NUMBER].addEventListener('change', filterPinsList);

  function onHousingTypeChange() {
    var filterValue = housingType.options[housingType.selectedIndex].value;
    if (filterValue !== DEFAULT_SELECT_VALUE && filterValue !== undefined) {
      var sameHousingPins = window.xhr.serverData.filter(function (it) {
        return it.offer.type === filterValue;
      });
    } else {
      sameHousingPins = window.xhr.serverData;
    }
    return sameHousingPins;
  }

  function onHousingPriceChange() {
    var filterValue = housingPrice.options[housingPrice.selectedIndex].value;
    if (filterValue !== DEFAULT_SELECT_VALUE && filterValue !== undefined) {
      if (filterValue === MIN_PRICE_ID) {
        var samePricePins = onHousingTypeChange().filter(function (it) {
          return it.offer.price <= MIN_PRICE;
        });
      }
      if (filterValue === MID_PRICE_ID) {
        samePricePins = onHousingTypeChange().filter(function (it) {
          return it.offer.price >= MIN_PRICE && it.offer.price <= MAX_PRICE;
        });
      }
      if (filterValue === MAX_PRICE_ID) {
        samePricePins = onHousingTypeChange().filter(function (it) {
          return it.offer.price >= MAX_PRICE;
        });
      }
    } else {
      samePricePins = onHousingTypeChange();
    }
    return samePricePins;
  }

  function onHousingRoomsChange() {
    var filterValue = housingRooms.options[housingRooms.selectedIndex].value;
    if (filterValue !== DEFAULT_SELECT_VALUE && filterValue !== undefined) {
      var sameRoomingPins = onHousingPriceChange().filter(function (it) {
        return it.offer.rooms === Number(filterValue);
      });
    } else {
      sameRoomingPins = onHousingPriceChange();
    }
    return sameRoomingPins;
  }

  function onHousingGuestsChange() {
    var filterValue = housingGuests.options[housingGuests.selectedIndex].value;
    if (filterValue !== DEFAULT_SELECT_VALUE && filterValue !== undefined) {
      var sameGuestsPins = onHousingRoomsChange().filter(function (it) {
        return it.offer.guests === Number(filterValue);
      });
    } else {
      sameGuestsPins = onHousingRoomsChange();
    }
    return sameGuestsPins;
  }

  function filterByFeature(filterValue, listToFilter, featureName) {
    var sameFeatureWifiPins = filterValue ? listToFilter.filter(function (it) {
      return it.offer.features.includes(featureName);
    }) : listToFilter;
    return sameFeatureWifiPins;
  }

  function onHousingFeatureWifiChange() {
    var filterValue = housingFeatureWifi.checked;
    return filterByFeature(filterValue, onHousingGuestsChange(), 'wifi');
  }

  function onHousingFeatureDishwasherChange() {
    var filterValue = housingFeatureDishwasher.checked;
    return filterByFeature(filterValue, onHousingFeatureWifiChange(), 'dishwasher');
  }

  function onHousingFeatureParkingChange() {
    var filterValue = housingFeatureParking.checked;
    return filterByFeature(filterValue, onHousingFeatureDishwasherChange(), 'parking');
  }

  function onHousingFeatureWasherChange() {
    var filterValue = housingFeatureWasher.checked;
    return filterByFeature(filterValue, onHousingFeatureParkingChange(), 'washer');
  }

  function onHousingFeatureElevatorChange() {
    var filterValue = housingFeatureElevator.checked;
    return filterByFeature(filterValue, onHousingFeatureWasherChange(), 'elevator');
  }

  function onHousingFeatureConditionerChange() {
    var filterValue = housingFeatureConditioner.checked;
    return filterByFeature(filterValue, onHousingFeatureElevatorChange(), 'conditioner');
  }

  function filterPinsList() {
    renderPinsOnMap(onHousingFeatureConditionerChange());
  }

  window.pin = {
    formHtmlClassList: formHtmlClassList,
    mapPinsElement: mapPinsElement,
    onHousingFeatureConditionerChange: onHousingFeatureConditionerChange,
    filterPinsList: filterPinsList
  };
})();
