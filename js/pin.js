// модуль, который отвечает за создание пина — метки на карте
'use strict';
(function () {
  var ENTER_KEY_CODE = 13;
  var maxPinsAmount = 5;
  var formHtmlClassList = document.querySelector('.notice').querySelector('.ad-form--disabled').classList;
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
    while (mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)').length > maxPinsAmount) {
      mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)')[mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)').length - 1].remove();
    }
  }

  function renderPinsOnMap(filteredPinsList) {
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
    for (var i = 0; i < pinsDataList.length; i++) {
      fragment.appendChild(createPin(pinsDataList[i], i));
    }
    mapPinsElement.appendChild(fragment);
    if (mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)').length > maxPinsAmount) {
      removeExcessivePins();
    }
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
    mainPin.style.zIndex = getComputedStyle(mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)')[0])['zIndex'] + 1;
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var mainPinMouseMoveHandler = function (moveEvt) {
      var minCoordX = window.data.locationX[0];
      var maxCoordX = window.data.locationX[1];
      var minCoordY = window.data.locationY[0];
      var maxCoordY = window.data.locationY[1];
      moveEvt.preventDefault();
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
    };
    var mainPinMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      mainPin.removeEventListener('mousemove', mainPinMouseMoveHandler);
      mainPin.removeEventListener('mouseup', mainPinMouseUpHandler);
      window.data.setAddressValue(window.data.PIN_LEG_HEIGHT);
    };
    mainPin.addEventListener('mousemove', mainPinMouseMoveHandler);
    mainPin.addEventListener('mouseup', mainPinMouseUpHandler);
  }

  function mainPinEnterDownHandler(evt) {
    if (evt.keyCode === ENTER_KEY_CODE) {
      activatePage();
    }
  }


  function addPopupOnPins() {
    var pinsElementList = mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pinsElementList.length; i++) {
      pinsElementList[i].addEventListener('mousedown', pinMouseDownHandler);
      pinsElementList[i].addEventListener('keydown', pinEnterDownHandler);
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
    if (window.xhr.serverData) {
      formHtmlClassList.remove('ad-form--disabled');
      window.data.toggleAvailability(window.data.menuFieldsetElementList, false);
      window.data.setAddressValue(window.data.PIN_LEG_HEIGHT);
      window.data.activateMap();
      renderPinsOnMap();
      addPopupOnPins();
      window.form.validation();
    }
  }

  var housingType = document.querySelector('#housing-type');
  housingType.addEventListener('change', filterPinsList);
  var housingRooms = document.querySelector('#housing-rooms');
  housingRooms.addEventListener('change', filterPinsList);
  var housingGuests = document.querySelector('#housing-guests');
  housingGuests.addEventListener('change', filterPinsList);
  var housingPrice = document.querySelector('#housing-price');
  housingPrice.addEventListener('change', filterPinsList);
  var housingFeatureWifi = document.querySelector('#filter-wifi');
  housingFeatureWifi.addEventListener('change', filterPinsList);
  var housingFeatureDishwasher = document.querySelector('#filter-dishwasher');
  housingFeatureDishwasher.addEventListener('change', filterPinsList);
  var housingFeatureParking = document.querySelector('#filter-parking');
  housingFeatureParking.addEventListener('change', filterPinsList);
  var housingFeatureWasher = document.querySelector('#filter-washer');
  housingFeatureWasher.addEventListener('change', filterPinsList);
  var housingFeatureElevator = document.querySelector('#filter-elevator');
  housingFeatureElevator.addEventListener('change', filterPinsList);
  var housingFeatureConditioner = document.querySelector('#filter-conditioner');
  housingFeatureConditioner.addEventListener('change', filterPinsList);

  function onHousingTypeChange() {
    var filterValue = housingType.options[housingType.selectedIndex].value;
    if (filterValue !== 'any' && filterValue !== undefined) {
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
    if (filterValue !== 'any' && filterValue !== undefined) {
      if (filterValue === 'low') {
        var samePricePins = onHousingTypeChange().filter(function (it) {
          return it.offer.price <= 10000;
        });
      }
      if (filterValue === 'middle') {
        samePricePins = onHousingTypeChange().filter(function (it) {
          return it.offer.price >= 10000 && it.offer.price <= 50000;
        });
      }
      if (filterValue === 'high') {
        samePricePins = onHousingTypeChange().filter(function (it) {
          return it.offer.price >= 50000;
        });
      }
    } else {
      samePricePins = onHousingTypeChange();
    }
    return samePricePins;
  }

  function onHousingRoomsChange() {
    var filterValue = housingRooms.options[housingRooms.selectedIndex].value;
    if (filterValue !== 'any' && filterValue !== undefined) {
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
    if (filterValue !== 'any' && filterValue !== undefined) {
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
    onHousingFeatureConditionerChange: onHousingFeatureConditionerChange
  };
})();
