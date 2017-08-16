functionName();
function functionName() {
  $('.link').unbind('click').on('click', function(e) {
    e.preventDefault();
    var id = $(this).attr('id');
    if (id === 'learn') {
      $('#wrap').load('learn.html #wrapper', learn);
    }
    if (id === 'test') {
      $('#wrap').load('test.html #wrapper', test);
    }
  });

}
function test() {
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

  $('#toggleInputField').on('click', function() {
    $(this).toggleClass('hidden');
    inputField.toggleClass('hidden');
    if (inputField.hasClass('invalid')) inputField.removeClass('invalid');
    toggleInputField = !toggleInputField;
  });
  $('#reset').on('click', function() {
    getJaSON();
  });
  $('#hamburger .burger').on('click', function() {
    $(this).closest('#nav').toggleClass('collapse');
    collapseMenu()
  });
  collapseMenu();
  $(window).resize(collapseMenu);
  function collapseMenu() {
    if ($(window).width() < 768) {
      ($('#nav').hasClass('collapse')) ? $('#weeks').stop(true).slideUp() : $('#weeks').stop(true).slideDown()
    } else {
      $('#weeks').removeAttr('style');
    }
  }
  $('.week').on('click', function(e) {
    e.preventDefault();
    if (!$(this).hasClass('active')) {
      $(this).addClass('active').siblings().removeClass('active');
      getJaSON();
    }
  });

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  $('#setLang').on('click', function() {
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
    clearText();
    randoom();
  });

  function clearText() {
    inputField.val('');
    answer.html('');
  }
  $('#defeat').on('click', function() {
    if (db) {
      var description = (db[randomNumber].desc && db[randomNumber].desc[langReverse]) ? '<span> (' + db[randomNumber].desc[langReverse] + ')</span>' : '';
      answer.html(db[randomNumber][langReverse] + description);
      if (errorArray.indexOf(randomNumber) === -1) {
        errorArray.push(randomNumber);
      }
    }
  });

  function setWord() {
    clearText();
    var description = (db[randomNumber].desc && db[randomNumber].desc[lang]) ? '<span> (' + db[randomNumber].desc[lang] + ')</span>' : '';
    outputWord.html(db[randomNumber][lang] + description);
    emptyArray.push(randomNumber);
  }
  $('#burgerHome').on('click', function() {
    $('#wrap').load('index.html #wrapper', functionName);
  });



  getJaSON();

  function getJaSON() {
    var url = './Json/' + ($('.week.active').attr('id')) + '.json';
    $.getJSON(url, function(data, textStatus) {
      if (data && data.arr.length) {
        db = data.arr;
        outputWord.text(innerText);
        inputField.removeClass('invalid');
        further.text(furtherText);
        errors.html('');
        clearText()
        emptyArray = [];
        errorArray = [];
        further.unbind('click').on('click', function() {
          wordRandom();
          defeat.removeAttr('disabled')
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
      $('#defeat').unbind('click');
      answer.text('');
      errorArray.forEach(function(i, ix, ar) {
        var descriptionLang = (db[i].desc && db[i].desc[lang]) ? '<span> (' + db[i].desc[lang] + ')</span>' : '';
        var descriptionLangReverse = (db[i].desc && db[i].desc[langReverse]) ? '<span> (' + db[i].desc[langReverse] + ')</span>' : '';
        errors.append('<li>' + db[i][lang] + descriptionLang + ' - ' + db[i][langReverse] + descriptionLangReverse + '</li>')
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

}

function learn() {
  var db;

  $('#hamburger .burger').on('click', function() {
    $(this).closest('#nav').toggleClass('collapse');
    collapseMenu();
  });
  $('.week').on('click', function(e) {
    e.preventDefault();
    if (!$(this).hasClass('active')) {
      $(this).addClass('active').siblings().removeClass('active');
      getJaSON();
    }
  });
  $('#burgerHome').on('click', function() {
    $('#wrap').load('index.html #wrapper');
  });



  getJaSON()

  function getJaSON() {
    var url = './Json/' + ($('.week.active').attr('id')) + '.json';
    $.getJSON(url, function(data, textStatus) {
      if (data && data.arr.length) {
        db = data.arr;
        $('#content').html('');
        createList();
      } else {
        $('#content').html('Вы не готовы!');
        db = null;
      }
    });
  }

  function createList() {
    var l = 1;
    db.forEach(function(i, ix, ar) {
      var div = $('<div></div>');
      var header = $('<h1>' + i.name + '</h1>');
      div.append(header);
      i.word.forEach(function(it, inx, arr) {
        var div2 = $('<div></div>');
        var themeName = $('<h3>' + it.theme + '</h3>')
        var ol = $('<ol start="' + l + '"></ol>');
        it.array.forEach(function(item, index, aray) {
          var descEN = (item.desc && item.desc.en) ? ' <span class="bracket">(' + item.desc.en + ')</span>' : '';
          var descRU = (item.desc && item.desc.ru) ? ' <span class="bracket">(' + item.desc.ru + ')</span>' : '';
          var li = $('<li><span class="lang">' + item.en + descEN + '</span> - <span class="langReverse">' + item.ru + descRU + '</span></li>');
          ol.append(li);
        });
        l += it.array.length;
        div2.append(themeName);
        div2.append(ol);
        div.append(div2);
      });
      $('#content').append(div);
    });
  }
  $('#burgerHome').on('click', function() {
    $('#wrap').load('index.html #wrapper', functionName);
  });

  collapseMenu();
  $(window).resize(collapseMenu);
  function collapseMenu() {
    if ($(window).width() < 768) {
      ($('#nav').hasClass('collapse')) ? $('#weeks').stop(true).slideUp() : $('#weeks').stop(true).slideDown()
    } else {
      $('#weeks').removeAttr('style');
    }
  }
}
