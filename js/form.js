// модуль, который работает с формой объявления
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
  var houseTypes = {
    bungalo: {
      name: 'bungalo',
      min: 0,
      max: 1000000
    },
    flat: {
      name: 'flat',
      min: 1000,
      max: 1000000
    },
    house: {
      name: 'house',
      min: 5000,
      max: 1000000
    },
    palace: {
      name: 'palace',
      min: 10000,
      max: 1000000
    }
  };
  var submitButton = document.querySelector('.ad-form__submit');

  function submitForm() {
    submitButton.addEventListener('click', function (evt) {
      evt.preventDefault();
    });
    if (!titleChangeHandler()) {
      titleHtmlElement.style.border = 'solid #ff6d51';
    } else if (!priceChangeHandler()) {
      priceHtmlElement.style.border = 'solid #ff6d51';
    } else if (!guestsChangeHandler()) {
      guestsNumberElement.style.border = 'solid #ff6d51';
    } else {
      window.xhr.sendData();
      window.data.mainPinElement.style.left = '570px';
      window.data.mainPinElement.style.top = '375px';
      window.data.mapHtmlClassList.add('map--faded');
      window.pin.formHtmlClassList.add('ad-form--disabled');
      document.querySelector('.ad-form').reset();
      window.data.setAddressValue();
      while (document.querySelector('.map__pin:not(.map__pin--main)')) {
        document.querySelector('.map__pins').removeChild(document.querySelector('.map__pin:not(.map__pin--main)'));
      }
    }
  }

  function guestsChangeHandler() {
    var roomNumber = parseInt(roomsNumberElement.value, 10);
    var guestNumber = parseInt(guestsNumberElement.value, 10);
    if (roomNumber === 100 && guestNumber === 0) {
      guestsNumberElement.setCustomValidity('');
      return true;
    } else if (roomNumber !== 100 && guestNumber <= roomNumber) {
      guestsNumberElement.setCustomValidity('');
      return true;
    } else if (roomNumber === 100 && guestNumber !== 0) {
      guestsNumberElement.setCustomValidity('Значение "Количество мест" должно быть ' + guestsNumberElement[3].textContent);
      return false;
    } else {
      guestsNumberElement.setCustomValidity('Значение "Количество мест" должно быть ' + roomNumber + ' или меньше');
      return false;
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
      return false;
    } else {
      titleHtmlElement.setCustomValidity('');
      return true;
    }
  }

  function getPrices() {
    var minPriceValue = houseTypes[typeValue.value].min;
    var maxPriceValue = houseTypes[typeValue.value].max;
    return {
      min: minPriceValue,
      max: maxPriceValue
    };
  }

  function priceChangeHandler() {
    var priceValue = priceHtmlElement.value;
    if (priceValue < getPrices()['min'] || priceValue > getPrices()['max']) {
      priceHtmlElement.setCustomValidity('Цена должна быть от ' + getPrices()['min'] + ' и до ' + getPrices()['max']);
      return false;
    } else {
      priceHtmlElement.setCustomValidity('');
      return true;
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
    submitButton.addEventListener('mouseup', submitForm);
  }
  window.form = {
    validation: validation
  };
})();
