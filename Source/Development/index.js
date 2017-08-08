var lang = 'en';
var langReverse = 'ru';
var inputField = $('#inputField');
var outputWord = $('#outputWord');
var innerText = outputWord.text();
var further = $('#further');
var answer = $('#answer');
var furtherText = further.text();
var defeat = $('#defeat');
var emptyArray = [];
var errorArray = [];
var randomNumber;
var toggleInputField = ($('toggleInputField').hasClass('hidden')) ? false : true;
var db;

getJaSON();

$('#lang').on('click', function() {
  if (lang === 'en') {
    lang = 'ru';
    langReverse = 'en';
    $(this).text('РУС');
  } else {
    lang = 'en';
    langReverse = 'ru';
    $(this).text('ENG');
  }
  emptyArray.pop();
  inputField.val('');
  answer.text('');
  randoom(db);
});

$('#toggleInputField').on('click', function() {
  $(this).toggleClass('hidden');
  inputField.toggleClass('hidden');
  toggleInputField = !toggleInputField;
});

$('#reset').on('click', function() {
  getJaSON();
});
$('.week').on('click', function(e) {
  e.preventDefault();
  if (!$(this).hasClass('active')) {
    $(this).addClass('active').siblings().removeClass('active');
    getJaSON();
  }
});
$('#hamburger').on('click', function() {
  $(this).closest('#nav').toggleClass('collapse');
});
$('#defeat').on('click', function() {
  if (db && (emptyArray.length !== db.length)) {
    answer.text(db[randomNumber][langReverse]);
    if (errorArray.indexOf(randomNumber) === -1) {
      errorArray.push(randomNumber);
    }
  }
});

function getJaSON() {
  var url = './Json/engWeek' + ($('.week.active').attr('id').replace('week', '')) + '.json';
  $.getJSON(url, function(data, textStatus) {
    if (data && data.arr.length) {
      db = data.arr;
      outputWord.text(innerText);
      inputField.val('');
      inputField.removeClass('invalid');
      further.text(furtherText);
      emptyArray = [];
      errorArray = [];
      further.unbind('click').on('click', function() {
        wordRandom();
        $(defeat).removeAttr('disabled')
        $(this).text('Далее');
      });
    } else {
      outputWord.html('Вы не готовы!');
      further.unbind('click');
      db = null;
    }
  });
}


function wordRandom() {
  if (!emptyArray.length) {
    randomNumber = getRandom(0, db.length);
    setWord();
  } else if ((emptyArray.length === db.length)) {
    outputWord.html('Слова закончились ;)');
    further.unbind('click');
  } else {
    if (toggleInputField) {
      validate();
    } else {
      randoom();
    }
  }
}

function randoom() {
  randomNumber = getRandom(0, db.length)
  var indx = emptyArray.indexOf(randomNumber);
  if (indx === -1) {
    setWord();
  } else {
    randoom();
  }
}


function validate() {
  if (db[randomNumber][langReverse].toLowerCase().trim() === inputField.val().toLowerCase().trim()) {
    inputField.removeClass('invalid');
    inputField.val('');
    randoom();
  } else {
    inputField.addClass('invalid');
    errorArray.push(randomNumber);
  }
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function setWord() {
  var description = db[randomNumber].desc || '';
  outputWord.html(db[randomNumber][lang] + '<span>' + description + '</span>');
  emptyArray.push(randomNumber);
  answer.text('');
}
