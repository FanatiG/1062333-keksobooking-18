// модуль, который отвечает за создание пина — метки на карте
/*
pins
PIN_LEG_HEIGHT
menuFieldsetElementList
mainPinElement
PINS_AMOUNT
setAddressValue
toggleAvailability
activateMap
*/
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

  function mainPinMouseDown() {
    activatePage();
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
    window.data.openPopup();
  }

  function pinEnterDown(evt) {
    if (evt.keyCode === ENTER_KEY_CODE) {
      window.data.openPopup();
    }
  }

  document.onload = function () {
    window.data.mainPinElement.addEventListener('mousedown', mainPinMouseDown);
    window.data.mainPinElement.addEventListener('keydown', mainPinEnterDown);
  }();
  function activatePage() {
    formHtmlClassList.remove('ad-form--disabled');
    window.data.mainPinElement.removeEventListener('mousedown', mainPinMouseDown);
    window.data.mainPinElement.removeEventListener('keydown', mainPinEnterDown);
    window.data.toggleAvailability(window.data.menuFieldsetElementList, false);
    window.data.setAddressValue(window.data.PIN_LEG_HEIGHT);
    window.data.activateMap();
    renderPinsOnMap(window.data.pins);
    addPopupOnPins();
    window.data.validation();
  }
})();
