// модуль, который работает с формой объявления
/*
menuFieldsetElementList
houseTypes
setAddressValue
toggleAvailability
*/
'use strict';
(function () {
  var typeValue = document.querySelector('#type');
  var MAX_TITLE_LENGTH = 100;
  var MIN_TITLE_LENGTH = 30;
  var titleHtmlElement = document.querySelector('#title');
  var guestsNumberElement = document.querySelector('#capacity');
  var roomsNumberElement = document.querySelector('#room_number');
  var timeInHtmlElement = document.querySelector('#timein');
  var timeOutHtmlElement = document.querySelector('#timeout');
  var priceHtmlElement = document.querySelector('#price');
  var typeHtmlElement = document.querySelector('#type');


  function guestsChangeHandler() {
    var roomNumber = parseInt(roomsNumberElement.value, 10);
    var guestNumber = parseInt(guestsNumberElement.value, 10);
    if (roomNumber === 100 && guestNumber === 0) {
      guestsNumberElement.setCustomValidity('');
    } else if (roomNumber !== 100 && guestNumber <= roomNumber) {
      guestsNumberElement.setCustomValidity('');
    } else if (roomNumber === 100 && guestNumber !== 0) {
      guestsNumberElement.setCustomValidity('Значение "Количество мест" должно быть ' + guestsNumberElement[3].textContent);
    } else {
      guestsNumberElement.setCustomValidity('Значение "Количество мест" должно быть ' + roomNumber + ' или меньше');
    }
  }

  function timeInChangeHandler() {
    if (timeInHtmlElement.value !== timeOutHtmlElement.value) {
      timeOutHtmlElement.value = timeInHtmlElement.value;
    }
  }

  function timeOutChangeHandler() {
    if (timeOutHtmlElement.value !== timeInHtmlElement.value) {
      timeInHtmlElement.value = timeOutHtmlElement.value;
    }
  }


  function titleChangeHandler() {
    if (titleHtmlElement.value.length > MAX_TITLE_LENGTH || titleHtmlElement.value.length < MIN_TITLE_LENGTH) {
      titleHtmlElement.setCustomValidity('Заголовок должен содержать от 30 до 100 символов!');
    } else {
      titleHtmlElement.setCustomValidity('');
    }
  }

  function getPrices() {
    var minPriceValue = window.data.houseTypes[typeValue.value].min;
    var maxPriceValue = window.data.houseTypes[typeValue.value].max;
    return {
      min: minPriceValue,
      max: maxPriceValue
    };
  }

  function priceChangeHandler() {
    var priceValue = priceHtmlElement.value;
    if (priceValue < getPrices()['min'] || priceValue > getPrices()['max']) {
      priceHtmlElement.setCustomValidity('Цена должна быть от ' + getPrices()['min'] + ' и до ' + getPrices()['max']);
    } else {
      priceHtmlElement.setCustomValidity('');
    }
  }

  function typeChangeHandler() {
    priceChangeHandler();
    priceHtmlElement.placeholder = getPrices()['min'];
  }

  document.onload = function () {
    window.data.toggleAvailability(window.data.menuFieldsetElementList, true);
    window.data.setAddressValue();
    typeChangeHandler();
  }();

  function validation() {
    guestsChangeHandler();
    titleHtmlElement.addEventListener('input', titleChangeHandler);
    priceHtmlElement.addEventListener('input', priceChangeHandler);
    typeHtmlElement.addEventListener('change', typeChangeHandler);
    timeInHtmlElement.addEventListener('change', timeInChangeHandler);
    timeOutHtmlElement.addEventListener('change', timeOutChangeHandler);
    guestsNumberElement.addEventListener('change', guestsChangeHandler);
    roomsNumberElement.addEventListener('change', guestsChangeHandler);
  }
  window.data = {
    validation: validation,
    openPopup: window.data.openPopup,
    pins: window.data.pins, // map, pin
    PIN_LEG_HEIGHT: window.data.PIN_LEG_HEIGHT, // map, pin
    setAddressValue: window.data.setAddressValue, // map, pin, form
    mainPinElement: window.data.mainPinElement, // pin
    PINS_AMOUNT: window.data.PINS_AMOUNT, // pin
    activateMap: window.data.activateMap, // pin
    menuFieldsetElementList: window.data.menuFieldsetElementList, // pin, form
    toggleAvailability: window.data.toggleAvailability, // pin, form
    houseTypes: window.data.houseTypes // form
  };
})();
