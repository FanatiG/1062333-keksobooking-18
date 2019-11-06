// модуль, который отвечает за загрузку фотографий
'use strict';
(function () {
  var avatarPreviewElement = document.querySelector('.ad-form-header__preview img');
  var housePhotoElement = document.querySelector('.ad-form__photo');

  function uploadAvatarHandler(evt) {
    var uploadedFileAvatar = evt.target.files;
    var uploadedFileData = uploadedFileAvatar[0];
    var reader = new FileReader();
    reader.onload = (function () {
      return function (trgt) {
        avatarPreviewElement.src = trgt.target.result;
      };
    })(uploadedFileData);
    reader.readAsDataURL(uploadedFileData);
  }

  function uploadHousePhotoHandler(evt) {
    var uploadedFileHousePhoto = evt.target.files;
    var uploadedFileData = uploadedFileHousePhoto[0];
    var reader = new FileReader();
    reader.onload = (function (theFile) {
      return function (trgt) {
        if (!document.querySelector('.ad-form__photo img')) {
          var imgToInsert = document.createElement('img');
          imgToInsert.title = escape(theFile.name);
          imgToInsert.src = trgt.target.result;
          imgToInsert.width = housePhotoElement.clientWidth;
          imgToInsert.height = housePhotoElement.clientHeight;
          housePhotoElement.appendChild(imgToInsert);
        } else {
          housePhotoElement.querySelector('img').title = escape(theFile.name);
          housePhotoElement.querySelector('img').src = trgt.target.result;
        }
      };
    })(uploadedFileData);
    reader.readAsDataURL(uploadedFileData);
  }

  document.querySelector('#avatar').addEventListener('change', uploadAvatarHandler);
  document.querySelector('#images').addEventListener('change', uploadHousePhotoHandler);
})();
