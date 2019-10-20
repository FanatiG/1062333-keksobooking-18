// модуль для отрисовки меток на карте так, чтобы в качестве данных использовались не случайно сгенерированные объекты,
// которые вы делали в задании «Личный проект: пока все дома», а те данные, которые вы загрузите с сервера
'use strict';
(function () {
  var receiveData = new XMLHttpRequest();
  receiveData.onreadystatechange = function () {
    window.xhr = {};
    if (this.readyState === 4 && this.status === 200) {
      window.xhr.serverData = JSON.parse(this.responseText);
      window.xhr.sendData = sendData;
    }
  };
  receiveData.onerror = function () {
    var serverErrorMessageTemplate = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
    var fragment = document.createDocumentFragment();
    fragment.appendChild(serverErrorMessageTemplate);
    document.querySelector('main').appendChild(fragment);
  };
  receiveData.open('GET', 'https://js.dump.academy/keksobooking/data', true);
  receiveData.send();

  function sendData() {
    var dataToSend = new XMLHttpRequest();
    dataToSend.open('POST', 'https://js.dump.academy/keksobooking');
    dataToSend.send(new FormData(document.forms[1]));
  }

})();
