var lang = 'en';
var langReverse = 'ru';
var inputField = $('#inputField');
var outputWord = $('#outputWord');
var innerText = outputWord.text();
var further = $('#further');
var answer = $('#answer');
var furtherText = further.text();
var defeat = $('#defeat');
var errors = $('#errors');
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
  if(inputField.hasClass('invalid')) inputField.removeClass('invalid');
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
  if (db) {
    var description = (db[randomNumber].desc && db[randomNumber].desc[langReverse]) ? '<span> (' + db[randomNumber].desc[langReverse]  + ')</span>' : '';
    answer.html(db[randomNumber][langReverse] + description);
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
      errors.html('');
      answer.html('');
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
    // $('#defeat').unbind('click');
    answer.text('');
    errorArray.forEach(function (i,ix,ar) {
      var descriptionLang = (db[i].desc && db[i].desc[lang]) ? '<span> (' + db[i].desc[lang]  + ')</span>' : '';
      var descriptionLangReverse = (db[i].desc && db[i].desc[langReverse]) ? '<span> (' + db[i].desc[langReverse]  + ')</span>' : '';
      errors.append('<li>'+db[i][lang]+descriptionLang+' - '+db[i][langReverse]+descriptionLangReverse+'</li>')
    });
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
    if (errorArray.indexOf(randomNumber) === -1) {
      errorArray.push(randomNumber);
    }
  }
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function setWord() {
  var description = (db[randomNumber].desc && db[randomNumber].desc[lang]) ? '<span> (' + db[randomNumber].desc[lang]  + ')</span>' : '';
  outputWord.html(db[randomNumber][lang] + description);
  emptyArray.push(randomNumber);
  answer.text('');
}
