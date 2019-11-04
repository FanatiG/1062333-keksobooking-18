// модуль, который работает с формой объявления
'use strict';
(function () {
  var MAX_TITLE_LENGTH = 100;
  var MIN_TITLE_LENGTH = 30;
  var MAX_ROOMS_NUMBER = 100;
  var GUESTS_NUMBER = 0;
  var NUMBER_SYSTEM = 10;
  var FORM_NUMBER = 1;
  var ERROR_INPUT_STYLE_BORDER = 'solid #ff6d51';
  var CORRECT_INPUT_STYLE_BORDER = '1px solid #d9d9d3';
  var MAIN_PIN_DEFAULT_STYLE_LEFT = '570px';
  var MAIN_PIN_DEFAULT_STYLE_TOP = '375px';

  var typeValue = document.querySelector('#type');
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
  var submitButtonElement = document.querySelector('.ad-form__submit');
  var resetButtonElement = document.querySelector('.ad-form__reset');
  var mainMap = document.querySelector('.map__pins');
  var mainForm = document.forms[FORM_NUMBER];
  var mainFormElements = document.forms[FORM_NUMBER].children;

  function resetPage() {
    var isPinsOnPage = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var clientHousePhoto = document.querySelector('.ad-form__photo img');
    var clientHousePhotoContainer = document.querySelector('.ad-form__photo');

    guestsNumberElement.style.border = CORRECT_INPUT_STYLE_BORDER;
    titleHtmlElement.style.border = CORRECT_INPUT_STYLE_BORDER;
    priceHtmlElement.style.border = CORRECT_INPUT_STYLE_BORDER;
    window.data.mainPinElement.style.left = MAIN_PIN_DEFAULT_STYLE_LEFT;
    window.data.mainPinElement.style.top = MAIN_PIN_DEFAULT_STYLE_TOP;
    window.data.mapHtmlClassList.add('map--faded');
    window.pin.formHtmlClassList.add('ad-form--disabled');
    typeChangeHandler();
    for (var elem in isPinsOnPage) {
      if (Object.prototype.hasOwnProperty.call(isPinsOnPage, elem)) {
        mainMap.removeChild(isPinsOnPage[elem]);
      }
    }
    mainForm.reset();
    for (elem in mainFormElements) {
      if (Object.prototype.hasOwnProperty.call(mainFormElements, elem)) {
        mainFormElements[elem].setAttribute('disabled', 'disabled');
      }
    }
    document.querySelector('.ad-form-header__preview img').src = 'img/muffin-grey.svg';
    if (clientHousePhoto) {
      clientHousePhoto.src = 'img/muffin-grey.svg';
    }
    while (clientHousePhotoContainer.firstChild) {
      clientHousePhotoContainer.removeChild(clientHousePhotoContainer.firstChild);
    }
    window.data.setAddressValue();
  }

  function resetButtonHandler() {
    resetButtonElement.addEventListener('click', function (evt) {
      evt.preventDefault();
    });
    resetPage();
  }

  function submitFormHandler() {
    submitButtonElement.addEventListener('click', function (evt) {
      evt.preventDefault();
    });
    if (!titleChangeHandler() || !priceChangeHandler() || !guestsChangeHandler()) {
      titleChangeHandler();
      priceChangeHandler();
      guestsChangeHandler();
    } else {
      window.xhr.sendData();
      resetPage();
    }
  }

  function guestsChangeHandler() {
    var roomNumber = parseInt(roomsNumberElement.value, NUMBER_SYSTEM);
    var guestNumber = parseInt(guestsNumberElement.value, NUMBER_SYSTEM);
    if (roomNumber === MAX_ROOMS_NUMBER && guestNumber === GUESTS_NUMBER) {
      guestsNumberElement.style.border = CORRECT_INPUT_STYLE_BORDER;
      guestsNumberElement.setCustomValidity('');
      return true;
    } else if (roomNumber !== MAX_ROOMS_NUMBER && guestNumber <= roomNumber) {
      guestsNumberElement.style.border = CORRECT_INPUT_STYLE_BORDER;
      guestsNumberElement.setCustomValidity('');
      return true;
    } else if (roomNumber === MAX_ROOMS_NUMBER && guestNumber !== GUESTS_NUMBER) {
      guestsNumberElement.style.border = ERROR_INPUT_STYLE_BORDER;
      guestsNumberElement.setCustomValidity('Значение "Количество мест" должно быть ' + guestsNumberElement[3].textContent);
      return false;
    } else {
      guestsNumberElement.style.border = ERROR_INPUT_STYLE_BORDER;
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
      titleHtmlElement.style.border = ERROR_INPUT_STYLE_BORDER;
      titleHtmlElement.setCustomValidity('Заголовок должен содержать от 30 до 100 символов!');
      return false;
    } else {
      titleHtmlElement.style.border = CORRECT_INPUT_STYLE_BORDER;
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
      priceHtmlElement.style.border = ERROR_INPUT_STYLE_BORDER;
      priceHtmlElement.setCustomValidity('Цена должна быть от ' + getPrices()['min'] + ' и до ' + getPrices()['max']);
      return false;
    } else {
      priceHtmlElement.style.border = CORRECT_INPUT_STYLE_BORDER;
      priceHtmlElement.setCustomValidity('');
      return true;
    }
  }

  function typeChangeHandler() {
    priceHtmlElement.placeholder = getPrices()['min'];
  }

  document.onload = function () {
    window.data.toggleAvailability(window.data.menuFieldsetElementList, true);
    window.data.setAddressValue();
    typeChangeHandler();
  }();

  function validation() {
    titleHtmlElement.addEventListener('input', titleChangeHandler);
    priceHtmlElement.addEventListener('input', priceChangeHandler);
    typeHtmlElement.addEventListener('change', typeChangeHandler);
    timeInHtmlElement.addEventListener('change', timeInChangeHandler);
    timeOutHtmlElement.addEventListener('change', timeOutChangeHandler);
    guestsNumberElement.addEventListener('change', guestsChangeHandler);
    roomsNumberElement.addEventListener('change', guestsChangeHandler);
    submitButtonElement.addEventListener('mouseup', submitFormHandler);
    resetButtonElement.addEventListener('mouseup', resetButtonHandler);
  }
  window.form = {
    validation: validation
  };
})();
