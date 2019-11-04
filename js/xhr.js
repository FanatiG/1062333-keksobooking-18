// модуль, который получает данные с сервера и отправляет их на сервер
'use strict';
(function () {
  var READY_STATE = 4;
  var STATUS = 200;

  var mainElement = document.querySelector('main');
  var serverErrorMessageTemplate = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
  var serverSuccessMessageTemplate = document.querySelector('#success').content.querySelector('.success').cloneNode(true);

  function receiveData() {
    var receivedData = new XMLHttpRequest();
    receivedData.onreadystatechange = function () {
      window.xhr = {};
      if (this.readyState === READY_STATE && this.status === STATUS) {
        window.xhr.serverData = JSON.parse(this.responseText);
        window.xhr.sendData = sendData;
        window.xhr.receiveData = receiveData;
        window.pin.filterPinsList();
      }
    };
    receivedData.onerror = function () {
      var fragment = document.createDocumentFragment();
      fragment.appendChild(serverErrorMessageTemplate);
      mainElement.appendChild(fragment);
    };
    receivedData.open('GET', 'https://js.dump.academy/keksobooking/data', true);
    receivedData.send();
  }

  function sendData() {
    var dataToSend = new XMLHttpRequest();
    dataToSend.onerror = function () {
      function escCloseErrorMenuHandler(evt) {
        if (evt.keyCode === window.map.ESC_KEY_CODE) {
          serverErrorMessageTemplate.remove();
          mainElement.removeEventListener('keydown', escCloseErrorMenuHandler);
        }
      }
      var fragment = document.createDocumentFragment();
      fragment.appendChild(serverErrorMessageTemplate);
      serverErrorMessageTemplate.addEventListener('click', function () {
        serverErrorMessageTemplate.remove();
      });
      mainElement.addEventListener('keydown', escCloseErrorMenuHandler);
      mainElement.appendChild(fragment);
      serverErrorMessageTemplate.querySelector('.error__button').addEventListener('click', function () {
        event.stopPropagation();
        serverErrorMessageTemplate.remove();
      });
    };
    dataToSend.onreadystatechange = function () {
      function escCloseSuccessMenu(evt) {
        if (evt.keyCode === window.map.ESC_KEY_CODE) {
          serverSuccessMessageTemplate.remove();
          mainElement.removeEventListener('keydown', escCloseSuccessMenu);
        }
      }
      if (this.readyState === READY_STATE && this.status === STATUS) {
        var fragment = document.createDocumentFragment();
        fragment.appendChild(serverSuccessMessageTemplate);
        serverSuccessMessageTemplate.addEventListener('click', function () {
          serverSuccessMessageTemplate.remove();
        });
        mainElement.addEventListener('keydown', escCloseSuccessMenu);
        mainElement.appendChild(fragment);
      }
    };
    dataToSend.open('POST', 'https://js.dump.academy/keksobooking');
    dataToSend.send(new FormData(document.forms[1]));
  }
  window.xhr = {
    receiveData: receiveData
  };
})();
