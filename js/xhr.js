// модуль для отрисовки меток на карте так, чтобы в качестве данных использовались не случайно сгенерированные объекты,
// которые вы делали в задании «Личный проект: пока все дома», а те данные, которые вы загрузите с сервера
'use strict';
(function () {
  var x = new XMLHttpRequest();
  x.onreadystatechange = function () {
    window.xhr = {};
    if (this.readyState === 4 && this.status === 200) {
      window.xhr.serverData = JSON.parse(this.responseText);
    }
  };
  x.onerror = function () {
    var serverErrorMessageTemplate = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
    var fragment = document.createDocumentFragment();
    fragment.appendChild(serverErrorMessageTemplate);
    document.querySelector('main').appendChild(fragment);
  };
  x.open('GET', 'https://js.dump.academy/keksobooking/data', true);
  x.send();
})();
