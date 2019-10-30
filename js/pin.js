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
    var filteredValue = housingType.options[housingType.selectedIndex].value;
    if (filteredValue !== 'any' && filteredValue !== undefined) {
      var sameHousingPins = window.xhr.serverData.filter(function (it) {
        return it.offer.type === filteredValue;
      });
    } else {
      sameHousingPins = window.xhr.serverData;
    }
    return sameHousingPins;
  }

  function onHousingPriceChange() {
    var filteredValue = housingPrice.options[housingPrice.selectedIndex].value;
    if (filteredValue !== 'any' && filteredValue !== undefined) {
      if (filteredValue === 'low') {
        var samePricePins = onHousingTypeChange().filter(function (it) {
          return it.offer.price <= 10000;
        });
      }
      if (filteredValue === 'middle') {
        samePricePins = onHousingTypeChange().filter(function (it) {
          return it.offer.price >= 10000 && it.offer.price <= 50000;
        });
      }
      if (filteredValue === 'high') {
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
    var filteredValue = housingRooms.options[housingRooms.selectedIndex].value;
    if (filteredValue !== 'any' && filteredValue !== undefined) {
      var sameRoomingPins = onHousingPriceChange().filter(function (it) {
        return it.offer.rooms === Number(filteredValue);
      });
    } else {
      sameRoomingPins = onHousingPriceChange();
    }
    return sameRoomingPins;
  }

  function onHousingGuestsChange() {
    var filteredValue = housingGuests.options[housingGuests.selectedIndex].value;
    if (filteredValue !== 'any' && filteredValue !== undefined) {
      var sameGuestsPins = onHousingRoomsChange().filter(function (it) {
        return it.offer.guests === Number(filteredValue);
      });
    } else {
      sameGuestsPins = onHousingRoomsChange();
    }
    return sameGuestsPins;
  }

  function onHousingFeatureWifiChange() {
    var filteredValue = housingFeatureWifi.checked;
    var sameFeatureWifiPins = filteredValue ? onHousingGuestsChange().filter(function (it) {
      return it.offer.features.includes('wifi');
    }) : onHousingGuestsChange();
    return sameFeatureWifiPins;
  }

  function onHousingFeatureDishwasherChange() {
    var filteredValue = housingFeatureDishwasher.checked;
    var sameFeatureDishwasherPins = filteredValue ? onHousingFeatureWifiChange().filter(function (it) {
      return it.offer.features.includes('dishwasher');
    }) : onHousingFeatureWifiChange();
    return sameFeatureDishwasherPins;
  }

  function onHousingFeatureParkingChange() {
    var filteredValue = housingFeatureParking.checked;
    var sameFeatureParkingPins = filteredValue ? onHousingFeatureDishwasherChange().filter(function (it) {
      return it.offer.features.includes('parking');
    }) : onHousingFeatureDishwasherChange();
    return sameFeatureParkingPins;
  }

  function onHousingFeatureWasherChange() {
    var filteredValue = housingFeatureWasher.checked;
    var sameFeatureWasherPins = filteredValue ? onHousingFeatureParkingChange().filter(function (it) {
      return it.offer.features.includes('washer');
    }) : onHousingFeatureParkingChange();
    return sameFeatureWasherPins;
  }

  function onHousingFeatureElevatorChange() {
    var filteredValue = housingFeatureElevator.checked;
    var sameFeatureElevatorPins = filteredValue ? onHousingFeatureWasherChange().filter(function (it) {
      return it.offer.features.includes('elevator');
    }) : onHousingFeatureWasherChange();
    return sameFeatureElevatorPins;
  }

  function onHousingFeatureConditionerChange() {
    var filteredValue = housingFeatureConditioner.checked;
    var sameFeatureConditionerPins = filteredValue ? onHousingFeatureElevatorChange().filter(function (it) {
      return it.offer.features.includes('conditioner');
    }) : onHousingFeatureElevatorChange();
    return sameFeatureConditionerPins;
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
