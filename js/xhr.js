/* модуль для отрисовки меток на карте так, чтобы в качестве данных использовались не случайно сгенерированные объекты,
которые вы делали в задании «Личный проект: пока все дома», а те данные, которые вы загрузите с сервера */
'use strict';
(function () {
  var mainElement = document.querySelector('main');
  var serverErrorMessageTemplate = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
  var receiveData = new XMLHttpRequest();
  receiveData.onreadystatechange = function () {
    window.xhr = {};
    if (this.readyState === 4 && this.status === 200) {
      window.xhr.serverData = JSON.parse(this.responseText);
      window.xhr.sendData = sendData;
    }
  };
  receiveData.onerror = function () {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(serverErrorMessageTemplate);
    mainElement.appendChild(fragment);
  };
  receiveData.open('GET', 'https://js.dump.academy/keksobooking/data', true);
  receiveData.send();

  function sendData() {
    var dataToSend = new XMLHttpRequest();
    dataToSend.onerror = function () {
      function escCloseErrorMenu(evt) {
        if (evt.keyCode === window.map.ESC_KEY_CODE) {
          serverErrorMessageTemplate.remove();
          mainElement.removeEventListener('keydown', escCloseErrorMenu);
        }
      }
      var fragment = document.createDocumentFragment();
      fragment.appendChild(serverErrorMessageTemplate);
      serverErrorMessageTemplate.addEventListener('click', function () {
        serverErrorMessageTemplate.remove();
      });
      mainElement.addEventListener('keydown', escCloseErrorMenu);
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
      if (this.readyState === 4 && this.status === 200) {
        var serverSuccessMessageTemplate = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
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
})();
