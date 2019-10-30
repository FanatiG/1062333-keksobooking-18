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
  var submitButtonElement = document.querySelector('.ad-form__submit');
  var resetButtonElement = document.querySelector('.ad-form__reset');
  var filtersElementList = document.querySelector('.map__filters-container').querySelector('.map__filters').querySelectorAll('select');
  var featuresElementList = document.querySelector('.map__filters-container').querySelector('.map__filters').querySelector('#housing-features').querySelectorAll('input');

  function resetPage() {
    window.data.mainPinElement.style.left = '570px';
    window.data.mainPinElement.style.top = '375px';
    window.data.mapHtmlClassList.add('map--faded');
    window.pin.formHtmlClassList.add('ad-form--disabled');
    document.querySelector('.ad-form').reset();
    window.data.setAddressValue();
    typeChangeHandler();
    while (document.querySelector('.map__pin:not(.map__pin--main)')) {
      document.querySelector('.map__pins').removeChild(document.querySelector('.map__pin:not(.map__pin--main)'));
    }
    for (var i = 0; i < filtersElementList.length; i++) {
      filtersElementList[i].value = 'any';
    }
    for (i = 0; i < featuresElementList.length; i++) {
      featuresElementList[i].checked = false;
    }
    document.querySelector('.ad-form-header__preview').querySelector('img').src = 'img/muffin-grey.svg';
    if (document.querySelector('.ad-form__photo').querySelector('img')) {
      document.querySelector('.ad-form__photo').querySelector('img').src = 'img/muffin-grey.svg';
    }
    while (document.querySelector('.ad-form__photo').firstChild) {
      document.querySelector('.ad-form__photo').removeChild(document.querySelector('.ad-form__photo').firstChild);
    }
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
    if (titleChangeHandler() && priceChangeHandler() && guestsChangeHandler()) {
      window.xhr.sendData();
      resetPage();
    }
  }

  function guestsChangeHandler() {
    var roomNumber = parseInt(roomsNumberElement.value, 10);
    var guestNumber = parseInt(guestsNumberElement.value, 10);
    if (roomNumber === 100 && guestNumber === 0) {
      guestsNumberElement.style.border = '1px solid #d9d9d3';
      guestsNumberElement.setCustomValidity('');
      return true;
    } else if (roomNumber !== 100 && guestNumber <= roomNumber) {
      guestsNumberElement.style.border = '1px solid #d9d9d3';
      guestsNumberElement.setCustomValidity('');
      return true;
    } else if (roomNumber === 100 && guestNumber !== 0) {
      guestsNumberElement.style.border = 'solid #ff6d51';
      guestsNumberElement.setCustomValidity('Значение "Количество мест" должно быть ' + guestsNumberElement[3].textContent);
      return false;
    } else {
      guestsNumberElement.style.border = 'solid #ff6d51';
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
      titleHtmlElement.style.border = 'solid #ff6d51';
      titleHtmlElement.setCustomValidity('Заголовок должен содержать от 30 до 100 символов!');
      return titleHtmlElement.valid;
    } else {
      titleHtmlElement.style.border = '1px solid #d9d9d3';
      titleHtmlElement.setCustomValidity('');
      return titleHtmlElement.valid;
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
      priceHtmlElement.style.border = 'solid #ff6d51';
      priceHtmlElement.setCustomValidity('Цена должна быть от ' + getPrices()['min'] + ' и до ' + getPrices()['max']);
      return false;
    } else {
      priceHtmlElement.style.border = '1px solid #d9d9d3';
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
