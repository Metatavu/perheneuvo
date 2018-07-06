(function(){
  'use strict';
  
  function createStatistics(flags) {
    var statistics = {
      total: flags.length,
      fromSources: {},
      fromReasons: {}
    };
    
    for(var i = 0; i < flags.length; i++) {
      var source = flags[i].contact_source || 'lomake';
      var reason = flags[i].problem_category || 'muu';
      
      if (statistics.fromSources[source]) {
        statistics.fromSources[source]++;
      } else {
        statistics.fromSources[source] = 1;
      }
      
      if (statistics.fromReasons[reason]) {
        statistics.fromReasons[reason]++;
      } else {
        statistics.fromReasons[reason] = 1;
      }
    }
    
    return statistics;
  }
  
  function renderStatistics(flags) {
    var statistics = createStatistics(flags);
    $('.statistics-container').empty();
    $('.statistics-container').append('<p>Yhteydenottoja yhteensä: <b>'+ statistics.total +'</b></p><br/>');
    $('.statistics-container').append('<p><b>Yhteydenottoja tullut:</b></p>');
    for (var source in statistics.fromSources) {
      if (statistics.fromSources.hasOwnProperty(source)) {
        $('.statistics-container').append('<p>'+source+': <b>'+ statistics.fromSources[source] +'</b></p>');
      }
    }
    
    $('.statistics-container').append('<br/><p><b>Liittyen:</b></p>');
    for (var reason in statistics.fromReasons) {
      if (statistics.fromReasons.hasOwnProperty(reason)) {
        $('.statistics-container').append('<p>'+reason+': <b>'+ statistics.fromReasons[reason] +'</b></p>');
      }
    }
    
  }
  
  $('#statictics-time-range').daterangepicker({
    "showDropdowns": true,
    ranges: {
      'Viimeiset 7 päivää': [moment().subtract(6, 'days'), moment()],
      'Viimeiset 30 päivää': [moment().subtract(29, 'days'), moment()],
      'Tämä kuukausi': [moment().startOf('month'), moment().endOf('month')],
      'Viime kuukausi': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'Tämä vuosi': [moment().startOf('year'), moment().endOf('year')],
      'Viime vuosi': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
    },
    "locale": {
      "format": "DD.MM.YYYY",
      "separator": " - ",
      "applyLabel": "Käytä",
      "cancelLabel": "Peruuta",
      "fromLabel": "Alkaen",
      "toLabel": "Päättyen",
      "customRangeLabel": "Muu",
      "weekLabel": "V",
      "daysOfWeek": [
        "Su",
        "Ma",
        "Ti",
        "Ke",
        "To",
        "Pe",
        "La"
      ],
      "monthNames": [
        "Tammikuu",
        "Helmikuu",
        "Maaliskuu",
        "Huhtikuu",
        "Toukokuu",
        "Kesäkuu",
        "Heinäkuu",
        "Elokuu",
        "Syyskuu",
        "Lokakuu",
        "Marraskuu",
        "Joulukuu"
      ],
      "firstDay": 1
    },
    "alwaysShowCalendars": true
  }, function(start, end, label) {
    $.getJSON(SERVER_ROOT+'/flag/list/'+start.valueOf()+'/'+end.valueOf(), function(flags){
      renderStatistics(flags);
    });
  });

})();
