// модуль, который отвечает за создание пина — метки на карте
'use strict';
(function () {
  var ENTER_KEY_CODE = 13;
  var maxPinsAmount = 5;
  var filtersList = {};
  var formHtmlClassList = document.querySelector('.notice').querySelector('.ad-form--disabled').classList;
  var pin = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPinsElement = document.querySelector('.map__pins');
  var mapFiltersElements = document.querySelector('.map__filters');
  var featureButtons = mapFiltersElements.querySelector('#housing-features').querySelectorAll('input');
  var featureButtonsCount = mapFiltersElements.querySelector('#housing-features').querySelectorAll('input').length;
  var typeFeatureElement = mapFiltersElements.querySelector('#housing-type');
  var priceFeatureElement = mapFiltersElements.querySelector('#housing-price');
  var roomsFeatureElement = mapFiltersElements.querySelector('#housing-rooms');
  var guestsFeatureElement = mapFiltersElements.querySelector('#housing-guests');

  function createPin(pinsList, i) {
    var pinClone = pin.cloneNode(true);
    pinClone.style.left = pinsList.location.x + 'px';
    pinClone.style.top = pinsList.location.y + 'px';
    pinClone.querySelector('img').src = pinsList.author.avatar;
    pinClone.querySelector('img').alt = pinsList.offer.title;
    pinClone.querySelector('img').dataset.id = i;
    // activeInactivePin(pinClone);
    return pinClone;
  }

  // function activeInactivePin(pinsElementList) {
  //   //   console.log(pinsArr.length - 1);
  //   pinsElementList.addEventListener('click', pinStatus);
  // }

  // function pinStatus(trgt) {
  //   console.log(trgt.target);
  // }

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

  function renderPinsOnMap() {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.xhr.serverData.length; i++) {
      fragment.appendChild(createPin(window.xhr.serverData[i], i));
    }
    mapPinsElement.appendChild(fragment);
    if (mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)').length > maxPinsAmount) {
      removeExcessivePins();
    }
  }

  function renderFilteredPins(filter) {
    var isTypeCorrect = [];
    var isPriceCorrect = [];
    var isRoomsCorrect = [];
    var isGuestsCorrect = [];

    if (filter.type === undefined) {
      filter.type = 'any';
    }
    if (filter.price === undefined) {
      filter.price = 'any';
    }
    if (filter.rooms === undefined) {
      filter.rooms = 'any';
    }
    if (filter.guests === undefined) {
      filter.guests = 'any';
    }

    var isWifi = [];
    var isDishwasher = [];
    var isParking = [];
    var isWasher = [];
    var isElevator = [];
    var isConditioner = [];

    if (filter.wifi === undefined) {
      filter.wifi = false;
    }
    if (filter.dishwasher === undefined) {
      filter.dishwasher = false;
    }
    if (filter.parking === undefined) {
      filter.parking = false;
    }
    if (filter.washer === undefined) {
      filter.washer = false;
    }
    if (filter.elevator === undefined) {
      filter.elevator = false;
    }
    if (filter.conditioner === undefined) {
      filter.conditioner = false;
    }

    var fragment = document.createDocumentFragment();
    for (var elem in filter) {
      if (Object.prototype.hasOwnProperty.call(filter, elem)) {
        for (var i = 0; i < window.xhr.serverData.length; i++) {
          if (elem === 'type' && filter.type === 'any' || elem === 'type' && filter.type === undefined) {
            isTypeCorrect[i] = true;
          }
          if (elem === 'price' && filter.price === 'any' || elem === 'price' && filter.price === undefined) {
            isPriceCorrect[i] = true;
          }
          if (elem === 'rooms' && filter.rooms === 'any' || elem === 'rooms' && filter.rooms === undefined) {
            isRoomsCorrect[i] = true;
          }
          if (elem === 'guests' && filter.guests === 'any' || elem === 'guests' && filter.guests === undefined) {
            isGuestsCorrect[i] = true;
          }
          if (filter[elem].name === 'low' && filter[elem] !== 'any') {
            isPriceCorrect[i] = (window.xhr.serverData[i].offer.price <= filter[elem].max) ? true : false;
          }
          if (filter[elem].name === 'middle' && filter[elem] !== 'any') {
            isPriceCorrect[i] = (window.xhr.serverData[i].offer.price <= filter[elem].max && window.xhr.serverData[i].offer.price >= filter[elem].min) ? true : false;
          }
          if (filter[elem].name === 'high' && filter[elem] !== 'any') {
            isPriceCorrect[i] = (window.xhr.serverData[i].offer.price >= filter[elem].min) ? true : false;
          }
          if (elem === 'type' && filter[elem] !== 'any') {
            isTypeCorrect[i] = (window.xhr.serverData[i].offer.type.toString() === filter.type) ? true : false;
          }
          if (elem === 'rooms' && filter[elem] !== 'any') {
            isRoomsCorrect[i] = (window.xhr.serverData[i].offer.rooms.toString() === filter.rooms) ? true : false;
          }
          if (elem === 'guests' && filter[elem] !== 'any') {
            isGuestsCorrect[i] = (window.xhr.serverData[i].offer.guests.toString() === filter.guests) ? true : false;
          }
          if (isTypeCorrect[i] === true && isPriceCorrect[i] === true && isRoomsCorrect[i] === true && isGuestsCorrect[i] === true) {
            if (filter.wifi === true || filter.dishwasher === true || filter.parking === true || filter.washer === true || filter.elevator === true || filter.conditioner === true) {
              isWifi[i] = (filter.wifi === true && window.xhr.serverData[i].offer.features.indexOf('wifi') === -1) ? false : true;
              isDishwasher[i] = (filter.dishwasher === true && window.xhr.serverData[i].offer.features.indexOf('dishwasher') === -1) ? false : true;
              isParking[i] = (filter.parking === true && window.xhr.serverData[i].offer.features.indexOf('parking') === -1) ? false : true;
              isWasher[i] = (filter.washer === true && window.xhr.serverData[i].offer.features.indexOf('washer') === -1) ? false : true;
              isElevator[i] = (filter.elevator === true && window.xhr.serverData[i].offer.features.indexOf('elevator') === -1) ? false : true;
              isConditioner[i] = (filter.conditioner === true && window.xhr.serverData[i].offer.features.indexOf('conditioner') === -1) ? false : true;
            } else {
              fragment.appendChild(createPin(window.xhr.serverData[i], i));
            }
            if (isWifi[i] === true && isDishwasher[i] === true && isParking[i] === true && isWasher[i] === true && isElevator[i] === true && isConditioner[i] === true) {
              fragment.appendChild(createPin(window.xhr.serverData[i], i));
            }
          }
        }
      }
    }
    clearPinsFromMap();
    document.querySelector('.map__card').classList.add('hidden');
    mapPinsElement.appendChild(fragment);
    addPopupOnPins();
    if (mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)').length > maxPinsAmount) {
      removeExcessivePins();
    }
  }

  function addEventsOnFilters() {
    typeFeatureElement.addEventListener('change', filterPinsHandler);
    priceFeatureElement.addEventListener('change', filterPinsByPriceHandler);
    roomsFeatureElement.addEventListener('change', filterPinsHandler);
    guestsFeatureElement.addEventListener('change', filterPinsHandler);
    for (var i = 0; i < featureButtonsCount; i++) {
      featureButtons[i].addEventListener('change', filterPinsByFeatureHandler);
    }
  }

  function filterPinsByFeatureHandler(trgt) {
    filtersList[trgt.target.value] = trgt.target.checked;
    window.setTimeout(renderFilteredPins(filtersList), 500);
  }

  function filterPinsHandler(trgt) {
    filtersList[trgt.target.name.slice(8)] = trgt.target.value;
    window.setTimeout(renderFilteredPins(filtersList), 500);
  }

  function filterPinsByPriceHandler(trgt) {
    if (trgt.target.value === 'low') {
      filtersList[trgt.target.name.slice(8)] = {
        name: 'low',
        max: 10000
      };
    }
    if (trgt.target.value === 'middle') {
      filtersList[trgt.target.name.slice(8)] = {
        name: 'middle',
        min: 10000,
        max: 50000
      };
    }
    if (trgt.target.value === 'high') {
      filtersList[trgt.target.name.slice(8)] = {
        name: 'high',
        min: 50000
      };
    }
    if (trgt.target.value === 'any') {
      filtersList[trgt.target.name.slice(8)] = 'any';
    }
    window.setTimeout(renderFilteredPins(filtersList), 500);
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
      addEventsOnFilters();
    }
  }
  window.pin = {
    formHtmlClassList: formHtmlClassList,
    mapPinsElement: mapPinsElement
  };
})();
