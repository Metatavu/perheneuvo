(function() {
  'use strict';

  function hasFormValidation() {
    return (typeof document.createElement( 'input' ).checkValidity == 'function');
  };
  
  function validateField(field){
    var validity = {};
    if(hasFormValidation()){
      validity = $(field)[0].validity;
    }else{
      var req = $(field).attr('required');
      var patt = $(field).attr('pattern');
      var val = $(field).val();
      validity.valid = true;
      if (typeof req !== typeof undefined && req !== false) {
        if(val == '' || typeof val == typeof undefined){
          validity.valid = false;
          validity.valueMissing = true;
        }
      }
      if(typeof patt !== typeof undefined && patt !== false){
        var pattern = new RegExp(patt);
        if(!pattern.test(val)){
          validity.valid = false;
          validity.patternMismatch = true;
        }
      }
    }
    if(!validity.valid){
      $(field).addClass('not-valid');
      if(validity.patternMismatch){
        $(field).after('<span class="error-msg-container">'+$(field).data('customerror')+'</span>');
      }else if(validity.valueMissing){
        $(field).after('<span class="error-msg-container">Pakollinen kenttä!</span>');
      }
    }

  };
  
  $(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
    $('#show-flag-form').click(function() {
      $('.info-container').fadeOut('slow', function(){
        $('#main-index-container').addClass('form-visible');
        $('body').css({'padding': '0px', 'margin':'0px'});
        $('.form-container').fadeIn('slow');
      });
    });
    $('#cancel-flag-btn').click(function(e){
      e.preventDefault();
      $('.form-container').fadeOut('slow', function(){
        $('.info-container').fadeIn('slow');
        $('#main-index-container').removeClass('form-visible');
      });
    });
    $('#send-flag-form').submit(function(e){
      e.preventDefault();
      $('.flag-form-input').each(function(){
        validateField(this);
      });
      if(!$('.not-valid').length){
        var values = getFormValues(e);
        $('.form-container').fadeOut('fast', function(){
          $('.loader-container').fadeIn('fast');
          $.post(SERVER_ROOT+'/flag',values, function(res) {
            $('.loader-container').fadeOut('fast', function(){
              $('.success-msg-container').fadeIn('fast',function(){
                setTimeout(function(){
                  $('.success-msg-container').fadeOut('fast', function(){
                    $('.form-container').fadeIn('fast');
                  });
                }, 3000);
              });
            });
          }).fail(function(res) {
            $('.flag-form-input').each(function(){
              var name = $(this).attr('name');
              $(this).val(values[name]);
            });
            $('.loader-container').fadeOut('fast', function(){
              $('#server-error-message').text(res.responseText);
              $('.error-msg-container').fadeIn('fast',function(){
                setTimeout(function(){
                  $('.error-msg-container').fadeOut('fast', function(){
                    $('.form-container').fadeIn('fast');
                  });
                }, 3000);
              });
            });
          });
        });
      }
    });
    
    $('.flag-form-input').focus(function(e){
      $(this).removeClass('not-valid');
      $(this).nextAll('.error-msg-container').remove();
    });
    
    $('.flag-form-input').blur(function(e){
      validateField(this);
    });
  });

}).call(this);