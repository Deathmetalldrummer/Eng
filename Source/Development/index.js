var lang = 'en';
var langReverse = 'ru';
var inputWord = $('#inputWord');
var outputWord = $('#outputWord');
var innerText = outputWord.text();
var further = $('#further');
var furtherText = further.text();
var emptyArray = [];
var errorArray = [];
var randomNumber;
var textField = ($('textField').hasClass('hidden')) ? false : true;

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
});
$('#textField').on('click', function() {
  $(this).toggleClass('hidden');
  inputWord.toggleClass('hidden');
  textField = !textField;
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
$('#hamburger').on('click', function () {
  $(this).closest('#nav').toggleClass('collapse');
});


function getJaSON() {
  var url = './Json/engWeek' + ($('.week.active').attr('id').replace('week', '')) + '.json';
  $.getJSON(url, function(data) {
    if (data && data.arr.length) {
      outputWord.text(innerText);
      inputWord.val('');
      further.text(furtherText);
      emptyArray = [];
      errorArray = [];
      further.unbind('click').on('click', function() {
        wordRandom(data.arr);
        $(this).text('Далее');
      });
    }
  });
}


function wordRandom(db) {
  if (!emptyArray.length) {
    randomNumber = getRandom(0, db.length);
    setWord(db);
  } else if (emptyArray.length === db.length) {
    outputWord.html('Слова закончились ;)');
  } else {
    if (textField) {
      validate(db);
    } else {
      functionName(db);
    }
  }
}

function functionName(db) {
  randomNumber = getRandom(0, db.length)
  var indx = emptyArray.indexOf(randomNumber);
  if (indx === -1) {
    setWord(db);
  } else {
    functionName(db);
  }
}


function validate(db) {
  if (db[randomNumber][lang] === inputWord.val()) {
    functionName(db)
  } else {
    console.log(false);
  }
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function setWord(db) {
  var description = db[randomNumber].desc || '';
  outputWord.html(db[randomNumber][lang] + '<span>' + description + '</span>');
  emptyArray.push(randomNumber);
}
