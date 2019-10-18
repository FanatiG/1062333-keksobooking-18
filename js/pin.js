// модуль, который отвечает за создание пина — метки на карте
'use strict';
(function () {
  var formHtmlClassList = document.querySelector('.notice').querySelector('.ad-form--disabled').classList;
  var pin = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPinsElement = document.querySelector('.map__pins');
  var ENTER_KEY_CODE = 13;

  function createPin(pinsList, i) {
    var pinClone = pin.cloneNode(true);
    pinClone.style.left = pinsList.location.x + 'px';
    pinClone.style.top = pinsList.location.y + 'px';
    pinClone.querySelector('img').src = pinsList.author.avatar;
    pinClone.querySelector('img').alt = pinsList.offer.title;
    pinClone.querySelector('img').dataset.id = i;
    return pinClone;
  }

  function renderPinsOnMap(pinsList) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.data.PINS_AMOUNT; i++) {
      fragment.appendChild(createPin(pinsList[i], i));
    }
    mapPinsElement.appendChild(fragment);
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
    mainPin.style.zIndex = getComputedStyle(document.querySelectorAll('.map__pin:not(.map__pin--main)')[0])['zIndex'] + 1;
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var mainPinMouseMove = function (moveEvt) {
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
      if (mainPin.style.left.slice(0, -2) < window.data.locationX[0]) {
        mainPin.style.left = window.data.locationX[0] + 'px';
      }
      if (mainPin.style.left.slice(0, -2) > window.data.locationX[1]) {
        mainPin.style.left = window.data.locationX[1] + 'px';
      }
      if (mainPin.style.top.slice(0, -2) < window.data.locationY[0]) {
        mainPin.style.top = window.data.locationY[0] + 'px';
      }
      if (mainPin.style.top.slice(0, -2) > window.data.locationY[1]) {
        mainPin.style.top = window.data.locationY[1] + 'px';
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
    var pinsElementList = document.querySelectorAll('.map__pin:not(.map__pin--main)');
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
    formHtmlClassList.remove('ad-form--disabled');
    window.data.toggleAvailability(window.data.menuFieldsetElementList, false);
    window.data.setAddressValue(window.data.PIN_LEG_HEIGHT);
    window.data.activateMap();
    renderPinsOnMap(window.data.pins);
    addPopupOnPins();
    window.form.validation();
  }
})();
