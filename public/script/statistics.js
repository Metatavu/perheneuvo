(function(){
  'use strict';
  
  var first_flag = 0;
  var selectedTimeRange = 'hour';
  var values = [];
  
  function serializeMonthCount(data) {
    var result = $('<ul>');
    for(var monthYearKey in data) {
      if(data.hasOwnProperty(monthYearKey)) {
        result.append($('<li>').text(monthYearKey + ': '+data[monthYearKey]));
      }
    }
    return result.html();
  }

  function millisToHumanReadable(ms, short){
    var seconds = Math.floor(ms / 1000);
    var minutes = 0;
    var hours = 0;
    var days = 0;
    if(seconds > 60){
      minutes = Math.floor(seconds / 60);
      seconds = seconds - (minutes * 60);
      if(minutes > 60){
        hours = Math.floor(minutes / 60);
        minutes = minutes - (hours * 60);
        if(hours > 24){
          days = Math.floor(hours / 24);
          hours = hours - (days * 24);
        }
      }
    }
    if(typeof(short) !== 'undefined'){
      return days+' päivää '+hours+' tuntia';
    }else{
      return days+' päivää '+hours+' tuntia '+minutes+' minuuttia '+seconds+' sekuntia';
    }
    
  }
  
  $('.timeRangeSelector').click(function(){
    $('.timeRangeSelector').removeClass('btn-warning');
    $('.timeRangeSelector').addClass('btn-default');
    $(this).removeClass('btn-default');
    $(this).addClass('btn-warning');
  });
  
  $.getJSON(SERVER_ROOT+'/flag/list/all', function(flags){
    var monthCount = {};
    var totalProcessingTime = 0;
    var processedCount = 0;
    var rangeCounter = 0;
    var rangeCount = 0;
    var rangeProcessedCount = 0;
    var rangeTotal = 0;
    var totalCount = 0;
    first_flag = flags[0].created;
    var timeRange = {start : moment(first_flag).startOf(selectedTimeRange)._i, end : moment(first_flag).endOf(selectedTimeRange)._i};
    $('#allFlagCount').text(flags.length);
    for(var i = 0, j = flags.length;i < j; i++){
      var flag = flags[i];
      var monthYearKey = moment(flag.created).format('YYYY-MM');
      if(typeof(monthCount[monthYearKey]) == 'undefined') {
        monthCount[monthYearKey] = 1;
      } else {
        monthCount[monthYearKey]++;
      }
      if(flag.created > timeRange.end){
        values[rangeCounter] = {key:timeRange.start, avg: totalProcessingTime / totalCount, count: rangeCount, processed: rangeProcessedCount};
        rangeCount = 0;
        rangeTotal = 0;
        rangeProcessedCount = 0;
        rangeCounter++;
        var old_end = timeRange.end + 3600000;
        timeRange = {start : moment(old_end).startOf(selectedTimeRange)._i, end : moment(old_end).endOf(selectedTimeRange)._i};
      }
      var processed = new Date().getTime();
      if(typeof(flag.processed) !== 'undefined'){
        processed = flag.processed;
        processedCount++;
        rangeProcessedCount++;
      }
      rangeCount++;
      totalCount++;
      var processingTime = processed - flag.created;
      totalProcessingTime += processingTime;
      rangeTotal += processingTime;

    }
    $('#month-count').html(serializeMonthCount(monthCount));
    values[rangeCounter] = {key:timeRange.start, avg: totalProcessingTime / totalCount, count: rangeCount, processed: rangeProcessedCount};
    var avgPlot = [];
    var countPlot = [];
    var processedPlot = [];
    for(var i = 0; i < values.length;i++){
      avgPlot.push([values[i].key, values[i].avg]);
      countPlot.push([values[i].key, values[i].count]);
      processedPlot.push([values[i].key, values[i].processed])
    }
    $.plot(('#plot-container'), [
     { data: countPlot, label: 'Ilmotuksia tehty', yaxis: 1 },
     { data: processedPlot, label: 'Ilmotuksia Käsitelty', yaxis: 1 },
     { data: avgPlot, label: 'Keskimääräinen käsittelyaika', yaxis: 2 }
    ], {
      xaxis : {
        mode: 'time'
      },
      yaxes : [
          {minTickSize: 1, min: 0},
          {tickFormatter: function(i, j){
              return millisToHumanReadable(i, true);
           },
           position: 'right'
          }
      ]
    }); 
    $('#ProcessedCount').text(processedCount);
    var avgProcessingTime = totalProcessingTime / flags.length;
    $('#avgProcessingTime').text(millisToHumanReadable(avgProcessingTime));
  });
  
})();