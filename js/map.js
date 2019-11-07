// модуль, который управляет карточками объявлений и пинами: добавляет на страницу нужную карточку, отрисовывает пины и осуществляет взаимодействие карточки и метки на карте
'use strict';
(function () {
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
  var feature = popup.querySelector('.popup__features').querySelector('.popup__feature');
  var photo = popup.querySelector('.popup__photos').querySelector('.popup__photo');

  function popupIntercation() {
    document.querySelector('.map__card').classList.add('hidden');
    document.querySelector('.map').removeChild(document.querySelector('.map__card'));
    window.data.setAddressValue(window.data.PIN_LEG_HEIGHT);
    var allButMainPins = window.pin.mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    allButMainPins.forEach(function (item) {
      item.classList.remove('map__pin--active');
    });
  }

  function popupCloseMouseHandler() {
    popupIntercation();
  }

  function popupCloseButtonHandler(evt) {
    if (evt.keyCode === ESC_KEY_CODE) {
      popupIntercation();
    }
  }

  function openPopup() {
    var pinImage = event.target instanceof Image ? event.target : event.target.querySelector('img');
    var pinNumber = pinImage.dataset.id || 0;
    mapElement.insertBefore(renderPopup(window.pin.pins[pinNumber]), mapContainerElement);
    document.querySelector('.map__card').classList.remove('hidden');
    document.querySelector('.popup__close').addEventListener('mousedown', popupCloseMouseHandler);
    document.addEventListener('keydown', popupCloseButtonHandler);
    var allButMainPins = window.pin.mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    allButMainPins.forEach(function (item) {
      item.classList.remove('map__pin--active');
    });
    if (event.target instanceof Image) {
      event.target.parentNode.classList.add('map__pin--active');
    } else {
      event.target.classList.add('map__pin--active');
    }
  }

  function renderPopup(pinsList) {
    var fragment = document.createDocumentFragment();
    popup.querySelector('.popup__description').textContent = pinsList.offer.description;
    popup.querySelector('.popup__title').textContent = pinsList.offer.title;
    popup.querySelector('.popup__text--address').textContent = pinsList.offer.address;
    popup.querySelector('.popup__text--price').textContent = pinsList.offer.price + '₽/ночь';
    popup.querySelector('.popup__type').textContent = translate[pinsList.offer.type]['rusName'];
    popup.querySelector('.popup__text--capacity').textContent = pinsList.offer.rooms + ' комнат(ы) для ' + pinsList.offer.guests + ' гостя(ей)';
    popup.querySelector('.popup__text--time').textContent = 'Заезд после ' + pinsList.offer.checkin + ', выезд после ' + pinsList.offer.checkout;
    var popupFeatures = popup.querySelector('.popup__features');
    var popupPhotos = popup.querySelector('.popup__photos');
    if (pinsList.offer.features.length !== 0) {
      while (popupFeatures.firstChild) {
        popupFeatures.removeChild(popupFeatures.firstChild);
      }
      pinsList.offer.features.forEach(function (item) {
        var featureClone = feature.cloneNode(true);
        featureClone.classList.value = 'popup__feature popup__feature--' + item;
        popupFeatures.appendChild(featureClone);
      });
    } else {
      while (popupFeatures.firstChild) {
        popupFeatures.removeChild(popupFeatures.firstChild);
      }
    }
    if (pinsList.offer.photos.length !== 0) {
      while (popupPhotos.firstChild) {
        popupPhotos.removeChild(popupPhotos.firstChild);
      }
      pinsList.offer.photos.forEach(function (item) {
        var photoClone = photo.cloneNode(true);
        photoClone.src = item;
        popupPhotos.appendChild(photoClone);
      });
    } else {
      while (popupPhotos.firstChild) {
        popupPhotos.removeChild(popupPhotos.firstChild);
      }
    }
    popup.querySelector('.popup__avatar').src = pinsList.author.avatar;
    fragment.appendChild(popup);
    return fragment;
  }

  window.map = {
    openPopup: openPopup,
    ESC_KEY_CODE: ESC_KEY_CODE
  };
})();
