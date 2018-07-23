(function(){
  'use strict';
  
  var flagData = {};
  
  var stateMap = {
      'odottaa' : 'Odottaa käsittelyä.',
      'kasittelyssa' : 'Käsittelyssä',
      'processed' : 'Käsitelty'
  };
  
  function removeRow(id){
    $('#new-flags-table > tr').each(function(){
      if($(this).data('id') == id){
        $(this).hide('slow');
        return $(this);
      }
    });
    
  };
  
  $(document).ready(function(){
    $('.show-flags-btn').after('<ul><li><a href="#" data-state="odottaa" class="flag-category-selection">Odottaa käsittelyä</a></li><li><a href="#" data-state="kasittelyssa" class="flag-category-selection">Käsittelyssä</a></li><li><a href="#" data-state="processed" class="flag-category-selection">Käsitelty</a></li></ul>');
    $('form input[type=submit]').click(function() {
      $('input[type=submit]', $(this).parents('form')).removeAttr('clicked');
      $(this).attr('clicked', "true");
    });
  });
  
  function getFlags(state){
    $.getJSON(SERVER_ROOT+'/flag/listbystate/'+state, function(flags){
      flagData = {};
      $('#new-flags-table').empty();
      for(var i = 0, j = flags.length;i < j; i++){
        var flag = flags[i];
        flagData[flag._id] = flag;
        var target_told = flag.target_told ? 'X' : '';
        var source_anonym = flag.source_anonym ? 'X' : '';
        $('#new-flags-table').append('<tr data-id="'+flag._id+'">' +
            '<td>'+flag.target_name+'</td>' +
            '<td>'+flag.target_address+'</td>' +
            '<td>'+flag.target_phone+'</td>' +
            '<td>'+target_told+'</td>' +
            '<td>'+flag.problem_category+'</td>' +
            '<td>'+flag.source_name+'</td>' +
            '<td>'+flag.source_address+'</td>' +
            '<td>'+flag.source_phone+'</td>' +
            '<td>'+flag.source_email+'</td>' +
            '<td>'+source_anonym+'</td>' +
            '<td>'+new Date(flag.created).toLocaleString()+'</td>'+
            '<td>'+(flag.contact_source ? flag.contact_source : 'lomake')+'</td>'+
            '<td>'+stateMap[flag.state]+'</td></tr>');
      }
    });
  }
  
  function renderComments(comments) {
    var commentsArr = comments || [];
    $('.comments-container').empty();
    for(var i = 0; i < commentsArr.length; i++) {
      $('.comments-container').append(renderComment(commentsArr[i]));
    }
  } 
  
  function renderComment(comment) {
    return '<div class="form-group"><p class="form-control-static"><pre>'+comment.body+'</pre></p><span class="help-block">'+ comment.author +' '+ new Date(comment.date).toLocaleString() +'</span></div><hr/>';
  }
  
  getFlags('odottaa');
  
  $(document).on('click', '#new-flags-table > tr', function(e){
    var data = flagData[$(this).data('id')];
    $('.flag-info').empty();
    $('.flag-info').append('<p>Kohteen tiedot:</p>');
    $('.flag-info').append('<input name="flag_id" type="hidden" value="'+data._id+'" /><div class="row"><label class="col-sm-2 control-label">Nimi:</label><p class="col-sm-10">'+data.target_name+'</p></div>');
    $('.flag-info').append('<div class="row"><label class="col-sm-2 control-label">Osoite:</label><p class="col-sm-10">'+data.target_address+'</p></div>');
    $('.flag-info').append('<div class="row"><label class="col-sm-2 control-label">Puhelin:</label><p class="col-sm-10">'+data.target_phone+'</p></div>');
    $('.flag-info').append('<div class="row"><label class="col-sm-2 control-label">Kategoria:</label><p class="col-sm-10">'+data.problem_category+'</p></div>');
    var target_told = data.target_told ? 'Henkilö on tietoinen liputuksesta' : 'Henkilö ei ole tietoinen liputuksesta';
    $('.flag-info').append('<div class="row"><label class="col-sm-12 control-label">'+target_told+'</label></div>');
    $('.flag-info').append('<hr/><p>Ilmoittajan tiedot:</p>');
    var source_anonym = data.source_anonym ? 'Ilmoittajan tietoja ei saa luovuttaa kohteelle.' : 'Ilmoittajan tiedot saa luovuttaa.';
    $('.flag-info').append('<div class="row"><label class="col-sm-12 control-label">'+source_anonym+'</label</div>');
    $('.flag-info').append('<div class="row"><label class="col-sm-2 control-label">Ilmoittaja:</label><p class="col-sm-10">'+data.source_name+'</p></div>');
    $('.flag-info').append('<div class="row"><label class="col-sm-2 control-label">Ilmoittajan osoite:</label><p class="col-sm-10">'+data.source_address+'</p></div>');
    $('.flag-info').append('<div class="row"><label class="col-sm-2 control-label">Ilmoittajan puh:</label><p class="col-sm-10">'+data.source_phone+'</p></div>');
    $('.flag-info').append('<div class="row"><label class="col-sm-2 control-label">Ilmoittajan email:</label><p class="col-sm-10">'+data.source_email+'</p></div>');
    $('.flag-info').append('<div class="row"><label class="col-sm-2 control-label">Ilmoittajan suhde kohteeseen:</label><p class="col-sm-10">'+data.source_relation+'</p></div><hr/>');
    $('.flag-info').append('<div class="row"><label class="col-sm-2 control-label">Liputettu:</label><p class="col-sm-10">'+new Date(data.created).toLocaleString()+'</p></div>');
    $('.flag-info').append('<div class="row"><label class="col-sm-2 control-label">Lähde:</label><p class="col-sm-10">'+(data.contact_source ? data.contact_source : 'lomake')+'</p></div>');
    if(typeof(data.processed) !== 'undefined'){
      $('.flag-info').append('<div class="row"><label class="col-sm-2 control-label">Käsitelty:</label><p class="col-sm-10">'+new Date(data.processed).toLocaleString()+'</p></div>');
      $('.flag-info').append('<div class="row"><label class="col-sm-2 control-label">Käsitellyt:</label><p class="col-sm-10 processed-by-container">'+data.processedBy+'</p></div>');
      if(data.processedBy && data.processedBy.indexOf('@') < 0) {
        $.getJSON(SERVER_ROOT+'/user/get/'+data.processedBy, function(user){
          $('.processed-by-container').text(user.email);
        });
      }
    }
    $('.flag-info').append('<div class="row"><label class="col-sm-2 control-label">Tila:</label><p class="col-sm-10 flag-created">'+stateMap[data.state]+'</p></div>');
    $('.flag-info').append('<label class="control-label">Kuvaus:</label>');
    $('.flag-info').append('<div class="form-group"><p class="form-control-static">'+data.desc+'</p></div><hr/>');
    if(data.state === 'processed'){
      $('.action-performed-container').hide();
      $('.set-processed-btn').hide();
      $('.set-to-processing-container').hide();
      $('.set-processing-btn').hide();
      if(typeof(data.action) !== 'undefined'){
        $('.flag-info').append('<label class="control-label">Tehty toimenpide:</label>');
        $('.flag-info').append('<div class="form-group"><p class="form-control-static">'+data.action+'</p></div><hr/>');
      }
    } else if(data.state === 'kasittelyssa'){
      $('.set-to-processing-container').hide();
      $('.action-performed-container').show();
      $('.set-processed-btn').show();
    } else{
      $('.set-to-processing-container').show();
      $('.action-performed-container').show();
      $('.set-processed-btn').show();
    }
    renderComments(data.comments);
    $('#respond-to-flag-modal').modal('show');
  });
  
  $('#respond-to-flag-form').submit(function(e){
    e.preventDefault();
    var operation = $("input[type=submit][clicked=true]").attr('data-operation');
    var data = getFormValues(e, operation === 'add_comment');
    var method = $(e.target).attr('method');
    var action = $(e.target).attr('action');
    data.operation = operation;

    $.ajax({
      type: method.toUpperCase(),
      url: SERVER_ROOT+action,
      dataType: "json",
      data: data,
      success: function(flag){
        if(data.operation === 'add_comment') {
          renderComments(flag.comments);
          $('textarea[name="comment"]').val('');
        } else {
          removeRow(flag._id);
          $('#respond-to-flag-modal').modal('hide');
        }
      }
    });
  });
  
  $(document).on('click', '.flag-category-selection', function(e){
    e.preventDefault();
    var state = $(this).data('state');
    getFlags(state);
  });
  
})();