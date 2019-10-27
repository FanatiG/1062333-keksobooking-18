// модуль, который отвечает за загрузку фотографий
'use strict';
(function () {
  var avatarPreviewElement = document.querySelector('.ad-form-header__preview').querySelector('img');
  var housePhotoElement = document.querySelector('.ad-form__photo');

  function uploadAvatarHandler(evt) {
    var file = evt.target.files;
    var f = file[0];
    var reader = new FileReader();
    reader.onload = (function () {
      return function (e) {
        avatarPreviewElement.src = e.target.result;
      };
    })(f);
    reader.readAsDataURL(f);
  }

  function uploadHousePhotoHandler(evt) {
    var file = evt.target.files;
    var f = file[0];
    var reader = new FileReader();
    reader.onload = (function (theFile) {
      return function (e) {
        if (!document.querySelector('.ad-form__photo').querySelector('img')) {
          var imgToInsert = document.createElement('img');
          imgToInsert.title = escape(theFile.name);
          imgToInsert.src = e.target.result;
          imgToInsert.width = housePhotoElement.clientWidth;
          imgToInsert.height = housePhotoElement.clientHeight;
          housePhotoElement.appendChild(imgToInsert);
        } else {
          housePhotoElement.querySelector('img').title = escape(theFile.name);
          housePhotoElement.querySelector('img').src = e.target.result;
        }
      };
    })(f);
    reader.readAsDataURL(f);
  }
  document.getElementById('avatar').addEventListener('change', uploadAvatarHandler);
  document.getElementById('images').addEventListener('change', uploadHousePhotoHandler);
})();
