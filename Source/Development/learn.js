var db;

$('#hamburger').on('click', function() {
  $(this).closest('#nav').toggleClass('collapse');
});
$('.week').on('click', function(e) {
  e.preventDefault();
  if (!$(this).hasClass('active')) {
    $(this).addClass('active').siblings().removeClass('active');
    getJaSON();
  }
});


getJaSON()

function getJaSON() {
  var url = './Json/' + ($('.week.active').attr('id')) + '.json';
  $.getJSON(url, function(data, textStatus) {
    if (data && data.arr.length) {
      db = data.arr;
      $('#content').html('');
      functionName();
    } else {
      $('#content').html('Вы не готовы!');
      db = null;
    }
  });
}


function functionName() {
  var l = 1;
  db.forEach(function(i, ix, ar) {
    var div = $('<div></div>');
    var header = $('<h1>' + i.name + '</h1>');
    div.append(header);
    i.word.forEach(function(it, inx, arr) {
      var div2 = $('<div></div>');
      var themeName = $('<h3>' + it.theme + '</h3>')
      var ol = $('<ol start="'+l+'"></ol>');
      it.array.forEach(function(item, index, aray) {
        var descEN = (item.desc && item.desc.en) ? ' (' + item.desc.en + ')' : '';
        var descRU = (item.desc && item.desc.ru) ? ' (' + item.desc.ru + ')' : '';
        var li = $('<li>' + item.en + descEN + ' - ' + item.ru + descRU + '</li>');
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
