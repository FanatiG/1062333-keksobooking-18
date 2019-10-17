// модуль, который управляет карточками объявлений и пинами: добавляет на страницу нужную карточку, отрисовывает пины и осуществляет взаимодействие карточки и метки на карте
/*
pins
PIN_LEG_HEIGHT
setAddressValue
*/
'use strict';
(function () {
  // console.log(window.data.pins);
  var ESC_KEY_CODE = 27;
  var mapElement = document.querySelector('.map');
  var mapContainerElement = document.querySelector('.map__filters-container');
  var popup = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);
  var translate = {
    bungalo: {
      rusName: 'Бунгало'
    },
    flat: {
      rusName: 'Квартира'
    },
    house: {
      rusName: 'Дом'
    },
    palace: {
      rusName: 'Дворец'
    }
  };

  function popupIntercation() {
    document.querySelector('.map__card').classList.add('hidden');
    window.data.setAddressValue(window.data.PIN_LEG_HEIGHT);
  }

  function popupCloseMouse() {
    popupIntercation();
  }

  function popupCloseButton(evt) {
    if (evt.keyCode === ESC_KEY_CODE) {
      popupIntercation();
    }
  }

  function openPopup() {
    var pinImage = event.target instanceof Image ? event.target : event.target.querySelector('img');
    var pinNumber = pinImage.dataset.id || 0;
    mapElement.insertBefore(renderPopup(window.data.pins[pinNumber]), mapContainerElement);
    document.querySelector('.map__card').classList.remove('hidden');
    document.querySelector('.popup__close').addEventListener('mousedown', popupCloseMouse);
    document.addEventListener('keydown', popupCloseButton);
  }

  function renderPopup(pinsList) {
    var fragment = document.createDocumentFragment();
    popup.querySelector('.popup__title').textContent = pinsList.offer.title;
    popup.querySelector('.popup__text--address').textContent = pinsList.offer.address;
    popup.querySelector('.popup__text--price').textContent = pinsList.offer.price + '₽/ночь';
    popup.querySelector('.popup__type').textContent = translate[pinsList.offer.type]['rusName'];
    popup.querySelector('.popup__text--capacity').textContent = pinsList.offer.rooms + ' комнат(ы) для ' + pinsList.offer.guests + ' гостя(ей)';
    popup.querySelector('.popup__text--time').textContent = 'Заезд после ' + pinsList.offer.checkin + ', выезд после ' + pinsList.offer.checkout;
    var feature = popup.querySelector('.popup__features').querySelector('.popup__feature');
    while (popup.querySelector('.popup__features').firstChild) {
      popup.querySelector('.popup__features').removeChild(popup.querySelector('.popup__features').firstChild);
    }
    for (var i = 0; i < pinsList.offer.features.length; i++) {
      var featureClone = feature.cloneNode(true);
      featureClone.classList.value = 'popup__feature popup__feature--' + pinsList.offer.features[i];
      popup.querySelector('.popup__features').appendChild(featureClone);
    }
    popup.querySelector('.popup__description').textContent = pinsList.offer.description;
    var photo = popup.querySelector('.popup__photos').querySelector('.popup__photo');
    while (popup.querySelector('.popup__photos').firstChild) {
      popup.querySelector('.popup__photos').removeChild(popup.querySelector('.popup__photos').firstChild);
    }
    for (i = 0; i < pinsList.offer.photos.length; i++) {
      var photoClone = photo.cloneNode(true);
      photoClone.src = pinsList.offer.photos[i];
      popup.querySelector('.popup__photos').appendChild(photoClone);
    }
    popup.querySelector('.popup__avatar').src = pinsList.author.avatar;
    fragment.appendChild(popup);
    return fragment;
  }
  window.data = {
    openPopup: openPopup,
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
