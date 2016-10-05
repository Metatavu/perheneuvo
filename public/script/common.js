(function(){
  'use strict';
  
  window.getFormValues = function(e){
    var values = {};
    for(var i = 0; i < e.target.length;i++){
      if($(e.target[i]).attr('name')){
        var value = '';
        if($(e.target[i]).attr('type') === 'checkbox'){
          value = $(e.target[i]).is(':checked') ? true : false;
        }else{
          value = $(e.target[i]).val();
        }
        values[$(e.target[i]).attr('name')] = value;
        $(e.target[i]).val("");
      }
    }
    return values;
  };
  
  
})();