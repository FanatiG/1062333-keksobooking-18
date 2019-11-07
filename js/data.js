// модуль, который создаёт данные
'use strict';
(function () {
  var PIN_LEG_HEIGHT = 22;

  var menuFieldsetElementList = document.querySelectorAll('.ad-form fieldset');
  var mainPinElement = document.querySelector('.map__pin--main');
  var mainPinAvatarElement = mainPinElement.querySelector('img');
  var addressInputElement = document.querySelector('#address');
  var mapHtmlClassList = document.querySelector('.map').classList;

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
    selector.forEach(function (item) {
      item.disabled = status;
    });
  }

  window.data = {
    PIN_LEG_HEIGHT: PIN_LEG_HEIGHT,
    setAddressValue: setAddressValue,
    mainPinElement: mainPinElement,
    menuFieldsetElementList: menuFieldsetElementList,
    toggleAvailability: toggleAvailability,
    mapHtmlClassList: mapHtmlClassList
  };
})();
