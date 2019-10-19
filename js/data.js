// модуль, который создаёт данные
'use strict';
(function () {
  var PIN_LEG_HEIGHT = 22;
  var menuFieldsetElementList = document.querySelector('.ad-form').querySelectorAll('fieldset');
  var mainPinElement = document.querySelector('.map__pin--main');
  var mainPinAvatarElement = mainPinElement.querySelector('img');
  var addressInputElement = document.getElementById('address');
  var LOCATION_X = [0, 1135];
  var LOCATION_Y = [130, 630];
  var mapHtmlClassList = document.getElementsByClassName('map')[0].classList;

  function setAddressValue(pinLegHeight) {
    var mainPinOffsetTop = mainPinElement.offsetTop;
    var mainPinOffsetLeft = mainPinElement.offsetLeft;
    var pinHorizontalCoordinates = Math.floor(mainPinOffsetLeft + (mainPinAvatarElement.offsetWidth / 2));
    var inactivePinVerticalCoordinates = Math.floor(mainPinOffsetTop + mainPinAvatarElement.offsetHeight + pinLegHeight);
    var activePinVerticalCoordinates = Math.floor(mainPinElement.offsetTop + mainPinAvatarElement.offsetHeight / 2);
    var inactivePin = pinHorizontalCoordinates + ', ' + inactivePinVerticalCoordinates;
    var activePin = pinHorizontalCoordinates + ', ' + activePinVerticalCoordinates;
    var addressValue = pinLegHeight ? inactivePin : activePin;
    addressInputElement.value = addressValue;
    return addressValue;
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
    PIN_LEG_HEIGHT: PIN_LEG_HEIGHT,
    setAddressValue: setAddressValue,
    mainPinElement: mainPinElement,
    activateMap: activateMap,
    menuFieldsetElementList: menuFieldsetElementList,
    toggleAvailability: toggleAvailability,
    locationX: LOCATION_X,
    locationY: LOCATION_Y
  };
})();
