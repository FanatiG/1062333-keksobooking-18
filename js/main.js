'use strict';

function getRandomNumber(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function randomArrElement() {
  var innerArray = [];
  for (var i = 0; i < arguments.length; i++) {
    innerArray.push(arguments[i]);
  }
  return innerArray[Math.floor(Math.random() * Math.floor(innerArray.length))];
}

function shuffle(arr) {
  var j;
  var temp;
  for (var i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

function randomArr() {
  var innerArray = [];
  for (var i = 0; i < arguments.length; i++) {
    innerArray.push(arguments[i]);
  }
  shuffle(innerArray);
  return innerArray;
}

function generateDomElements(objArray) {
  for (var i = 0; i < 8; i++) {
    var fragment = document.createDocumentFragment();
    fragment.cloneNode(true);
    var pin = document.querySelector('#pin').content.querySelector('.map__pin');
    document.getElementsByClassName('map')[0].classList.remove('map--faded');
    var pinClone = pin.cloneNode(true);
    pinClone.style.left = objArray[i].location.x + 'px';
    pinClone.style.top = objArray[i].location.y + 'px';
    pinClone.querySelector('img').src = objArray[i].author.avatar;
    pinClone.querySelector('img').alt = objArray[i].offer.title;
    fragment.appendChild(pinClone);
    document.querySelector('.map__pins').appendChild(fragment);
  }
}

function generateArray() {
  var objArray = [];
  var title = 'title ' + i;
  var address = '600, 350';
  var price = 0;
  var rooms = 0;
  var guests = 0;
  var locationX = [];
  var locationY = [];
  var description = 'description';
  for (var i = 1; i < 9; i++) {
    var obj = {
      'author': {
        'avatar': './img/avatars/user0' + i + '.png'
      },
      'offer': {
        'title': title,
        'address': address,
        'price': price,
        'type': randomArrElement('palace', 'flat', 'house', 'bungalo'),
        'rooms': rooms,
        'guests': guests,
        'checkin': randomArrElement('12:00', '13:00', '14:00'),
        'checkout': randomArrElement('12:00', '13:00', '14:00'),
        'features': randomArr('wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'),
        'description': description,
        'photos': randomArr('http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg')
      },
      'location': {
        'x': getRandomNumber(0, 1150),
        'y': getRandomNumber(130, 630)
      }
    };
    locationX.push(obj.location.x);
    locationY.push(obj.location.y);
    objArray.push(obj);
  }
  generateDomElements(objArray);
}
generateArray();
