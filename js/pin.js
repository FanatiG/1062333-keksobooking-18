// модуль, который отвечает за создание пина — метки на карте
'use strict';
(function () {
  var formHtmlClassList = document.querySelector('.notice').querySelector('.ad-form--disabled').classList;
  var pin = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPinsElement = document.querySelector('.map__pins');
  var mapFiltersElements = document.querySelector('.map__filters');
  var ENTER_KEY_CODE = 13;
  var pinsAmount = 10;
  var maxPinsAmount = 5;
  var filtersList = {};

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
    if (mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)').length > maxPinsAmount) {
      while (mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)').length > maxPinsAmount) {
        mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)')[mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)').length - 1].remove();
      }
    }
  }

  function renderPinsOnMap() {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.xhr.serverData.length; i++) {
      fragment.appendChild(createPin(window.xhr.serverData[i], i));
    }
    mapPinsElement.appendChild(fragment);
    removeExcessivePins();
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
    clearPinsFromMap();
    var fragment = document.createDocumentFragment();
    for (var elem in filter) {
      if (Object.prototype.hasOwnProperty.call(filter, elem)) {
        for (var i = 0; i < pinsAmount; i++) {
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
            if (window.xhr.serverData[i].offer.price <= filter[elem].max) {
              isPriceCorrect[i] = true;
            } else {
              isPriceCorrect[i] = false;
            }
          }
          if (filter[elem].name === 'middle' && filter[elem] !== 'any') {
            if (window.xhr.serverData[i].offer.price <= filter[elem].max && window.xhr.serverData[i].offer.price >= filter[elem].min) {
              isPriceCorrect[i] = true;
            } else {
              isPriceCorrect[i] = false;
            }
          }
          if (filter[elem].name === 'high' && filter[elem] !== 'any') {
            if (window.xhr.serverData[i].offer.price >= filter[elem].min) {
              isPriceCorrect[i] = true;
            } else {
              isPriceCorrect[i] = false;
            }
          }
          if (elem === 'type' && filter[elem] !== 'any') {
            if (window.xhr.serverData[i].offer.type.toString() === filter.type) {
              isTypeCorrect[i] = true;
            } else {
              isTypeCorrect[i] = false;
            }
          }
          if (elem === 'rooms' && filter[elem] !== 'any') {
            if (window.xhr.serverData[i].offer.rooms.toString() === filter.rooms) {
              isRoomsCorrect[i] = true;
            } else {
              isRoomsCorrect[i] = false;
            }
          }
          if (elem === 'guests' && filter[elem] !== 'any') {
            if (window.xhr.serverData[i].offer.guests.toString() === filter.guests) {
              isGuestsCorrect[i] = true;
            } else {
              isGuestsCorrect[i] = false;
            }
          }
          if (isTypeCorrect[i] === true && isPriceCorrect[i] === true && isRoomsCorrect[i] === true && isGuestsCorrect[i] === true) {
            fragment.appendChild(createPin(window.xhr.serverData[i], i));
          }
        }
      }
    }
    mapPinsElement.appendChild(fragment);
    addPopupOnPins();
    removeExcessivePins();
  }

  function addEventsOnFilters() {
    mapFiltersElements.querySelector('#housing-type').addEventListener('change', filterPinsByType);
    mapFiltersElements.querySelector('#housing-price').addEventListener('change', filterPinsByPrice);
    mapFiltersElements.querySelector('#housing-rooms').addEventListener('change', filterPinsByRooms);
    mapFiltersElements.querySelector('#housing-guests').addEventListener('change', filterPinsByGuests);
  }


  function filterPinsByType(trgt) {
    filtersList[trgt.target.name.slice(8)] = trgt.target.value;
    renderFilteredPins(filtersList);
  }

  function filterPinsByPrice(trgt) {
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
    renderFilteredPins(filtersList);
  }

  function filterPinsByRooms(trgt) {
    filtersList[trgt.target.name.slice(8)] = trgt.target.value;

    renderFilteredPins(filtersList);
  }

  function filterPinsByGuests(trgt) {
    filtersList[trgt.target.name.slice(8)] = trgt.target.value;

    renderFilteredPins(filtersList);
  }

  function mainPinMouseDown(evt) {
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
    var mainPinMouseMove = function (moveEvt) {
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
    var mainPinMouseUp = function (upEvt) {
      upEvt.preventDefault();
      mainPin.removeEventListener('mousemove', mainPinMouseMove);
      mainPin.removeEventListener('mouseup', mainPinMouseUp);
      window.data.setAddressValue(window.data.PIN_LEG_HEIGHT);
    };
    mainPin.addEventListener('mousemove', mainPinMouseMove);
    mainPin.addEventListener('mouseup', mainPinMouseUp);
  }

  function mainPinEnterDown(evt) {
    if (evt.keyCode === ENTER_KEY_CODE) {
      activatePage();
    }
  }


  function addPopupOnPins() {
    var pinsElementList = mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pinsElementList.length; i++) {
      pinsElementList[i].addEventListener('mousedown', pinMouseDown);
      pinsElementList[i].addEventListener('keydown', pinEnterDown);
    }
  }

  function pinMouseDown() {
    window.map.openPopup();
  }

  function pinEnterDown(evt) {
    if (evt.keyCode === ENTER_KEY_CODE) {
      window.map.openPopup();
    }
  }

  document.onload = function () {
    window.data.mainPinElement.addEventListener('mousedown', mainPinMouseDown);
    window.data.mainPinElement.addEventListener('keydown', mainPinEnterDown);
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
    formHtmlClassList: formHtmlClassList
  };
})();
