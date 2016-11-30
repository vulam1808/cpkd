$(function(){
  var $controlGroup = $('.control-group');
  var strength = 0;
  var ratingClasses = new Array(6);
  ratingClasses[0] = 'short';
  ratingClasses[1] = 'weak';
  ratingClasses[2] = 'fair';
  ratingClasses[3] = 'good';
  ratingClasses[4] = 'strong';
  ratingClasses[5] = 'notRated';
  
  var url = {
      firm: iNet.getUrl('cloud/firm/register'),
      pers: iNet.getUrl('cloud/firm/contact'),
      checkDomain: iNet.getUrl('cloud/firm/verification')
  };
  
  var $btn_common = {
    BTN_SIGNIN: $('#sign-in')
  };
  
  var $inp_personalRegisterForm = {
    GINPUT: $('#create-new-accout input'),
    FULLNAME: $('#fullname'),
    USERNAME: $('#username'),
    BIRTHDATE: $('#birth-day'),
    BIRTHYEAR: $('#birth-year'),
    YOUREMAIL: $('#your-email'),
    PHONE: $('#your-phone'),
    ADDRESS: $('#address1'),
    CFRVERIFI: $('#captcha'),
    FIRM: $('#firm-key'),
    FIRM_SERC: $('#firm-serc'),
    AGREERULE: $('#i-agree-rule')
  };
  var $cbx_personalRegisterForm = {
    BIRTHMONTH: $('#birth-month'),
    GENDER: $('#sex'),
    LOCATION: $('#country'),
    CITY: $('#city')
  }
  var $btn_personalRegisterForm = {
    CLEAR_ALL: $('#btn-clear-all'),
    REGISTERBTN: $('#btn-register'),
    REFRESHCFR: $('#refresh-verification')
  };
  
  var $inp_companyRegisterForm = {
    GINPUT: $('#create-company-account input'),
    CORP_NAME: $('#name'),
    CORP_DOMAIN: $('#prefix'),
    SECURITY_KEY: $('#secretkey'),
    CORP_EMAIL: $('#email'),
    CORP_SITE: $('#website'),
    CORP_PHONE: $('#phone'),
    CORP_FAX: $('#fax'),
    CORP_ADDR: $('#address1'),
    CORP_CFR_CAPT: $('#captcha'),
    CORP_AGREE_RULE: $('#own-agree-rule')
  };
  var $cbx_companyRegisterForm = {
    CORP_LOCATION: $('#company-location'),
    CORP_CITY: $('#company-city'),
    CORP_LANG: $('#company-language')
  }
  var $btn_companyRegisterForm = {
    CLEAR_ALL: $('#btn-clear-all'),
    BTN_CHECK_DOMAIN: $('#check-domain'),
    BTN_RFRSH_CAPT: $('#cpy-refresh-captcha'),
    BTN_REGISTER: $('#btn-firm-register')
  }
  
  var loadCompanyRegisterForm = function(){
    isTrueAll = false;
    $('#key-security-status').css({'width':0});
    $inp_companyRegisterForm.GINPUT.val('');
  }
  
  var loadPersonalRegisterForm = function() {
    isTrueAll = false;
    $('#password-status').css({'width':0});
    $('#confirm-password-status').text('');
    $inp_personalRegisterForm.GINPUT.val('');
  };
  
  var checkFocusOut = function($element, $status){
    if(iNet.isEmpty($element.val())){
      $element.parent().parent().addClass('error');
    }else{
      if($element.parent().parent().hasClass('error')){
        $element.parent().parent().removeClass('error');
      }
    }
  }
  
  function checkStrength(password) {
    var strength = 0;
    // initial strength
    // length is ok, lets continue.
    // if length is 8 characters or more, increase strength value
    if (password.length < 7)
      return strength;
    if (password.length > 7)
      strength += 1;
    // if password contains both lower and uppercase characters, increase
    // strength value
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))
      strength += 1;
    // if it has numbers and characters, increase strength value
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))
      strength += 1;
    // if it has one special character, increase strength value
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/))
      strength += 1;
    // if it has two special characters, increase strength value
    if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,",%,&,@,#,$,^,*,?,_,~])/))
      strength += 1;
    // now we have calculated strength value, we can return messages
    return strength;
  }
  
  $btn_personalRegisterForm.CLEAR_ALL.click(function(){
    loadPersonalRegisterForm();
  });
  $btn_companyRegisterForm.CLEAR_ALL.click(function(){
    loadCompanyRegisterForm();
  });
  $btn_common.BTN_SIGNIN.click(function(){
    document.location.href='http://www.inetcloud.vn/cas';
  });
  
  window.onload = loadCompanyRegisterForm();
  
  $('#cp-page-lang .select-page-lang').selectpicker({
    size: 4
  });
  
  /*-------- Check Personal Register ---------*/
  $btn_personalRegisterForm.REFRESHCFR.click();
  $inp_personalRegisterForm.BIRTHDATE.keyup(function(){
    var __key = $(this).val();
    if(!iNet.isNumber(Number(__key))){
      $('#birthday-status').text(iNet.resources.register.not_date);
      $(this).val('');
    }else if(Number(__key)>31){
      $('#birthday-status').text(iNet.resources.register.not_date);
      $(this).val('');
      $(this).parent().parent().addClass('error');
    }else{
      $('#birthday-status').text('');
      if($(this).parent().parent().hasClass('error')){
        $(this).parent().parent().removeClass('error');
      }
    }
  });
  
  $inp_personalRegisterForm.BIRTHDATE.focusout(function(){
    checkFocusOut($(this));
  });
  
  $cbx_personalRegisterForm.BIRTHMONTH.focusout(function(){
    if($(this).children(':selected').val() == 'not-select'){
      $(this).parent().parent().addClass('error');
    }else{
      if($(this).parent().parent().hasClass('error')){
        $(this).parent().parent().removeClass('error');
      }
    }
  });
  
  $cbx_personalRegisterForm.BIRTHMONTH.change(function(){
    if($(this).children(':selected').val() == 'not-select'){
      $(this).parent().parent().addClass('error');
    }else{
      $('#birthday-status').text('');
      if($(this).parent().parent().hasClass('error')){
        $(this).parent().parent().removeClass('error');
      }
    }
  });
  
  $inp_personalRegisterForm.BIRTHYEAR.keyup(function(){
    var __key = $(this).val();
    if(!iNet.isNumber(Number(__key))){
      $(this).parent().parent().addClass('error');
      $('#birthday-status').text(iNet.resources.register.not_year);
      $(this).val('');
    }else{
      $('#birthday-status').text('');
      if($(this).parent().parent().hasClass('error')){
        $(this).parent().parent().removeClass('error');
      }
    }
  });
  
  $inp_personalRegisterForm.BIRTHYEAR.focusout(function(){
    checkFocusOut($(this));
  });
  
  $inp_personalRegisterForm.YOUREMAIL.keyup(function(){
    var __email = $(this).val();
    if(!iNet.isEmail(__email)){
      $(this).parent().parent().addClass('error');
      $('#your-email-status').text(iNet.resources.register.is_email);
    }else{
      $('#your-email-status').text('');
      if($(this).parent().parent().hasClass('error')){
        $(this).parent().parent().removeClass('error');
      }
    }
  });
  
  $btn_personalRegisterForm.REGISTERBTN.click(function(){
    $btn_personalRegisterForm.REGISTERBTN.attr('disable','disable').addClass('disable');
    var isTrueAll = false;
    if(iNet.isEmpty($inp_personalRegisterForm.USERNAME.val())){
      $inp_personalRegisterForm.USERNAME.focus();
      return false;
    }
    if(iNet.isEmpty($inp_personalRegisterForm.FULLNAME.val())){
      $inp_personalRegisterForm.FULLNAME.focus();
      return false;
    }
    if(iNet.isEmpty($inp_personalRegisterForm.YOUREMAIL.val())){
      $inp_personalRegisterForm.YOUREMAIL.focus();
      return false;
    }
    if(iNet.isEmpty($inp_personalRegisterForm.CFRVERIFI.val())){
      $inp_personalRegisterForm.CFRVERIFI.focus();
      return false;
    }
    var __key_phone = $inp_personalRegisterForm.PHONE.val();
    if(!!__key_phone && !iNet.isNumber(Number(__key_phone))){
      $this = $inp_personalRegisterForm.PHONE;
      $this.parent().parent().addClass('error');
      $('#your-phone-status').text(iNet.resources.register.is_number);
      $this.val('');
      $this.focus();
      return false;
    }else{
      $('#your-phone-status').text('');
      $this = $inp_personalRegisterForm.PHONE;
      if($this.parent().parent().hasClass('error')){
        $this.parent().parent().removeClass('error');
      }
    }
    if($inp_personalRegisterForm.AGREERULE.is(':checked')==false){
      $inp_personalRegisterForm.AGREERULE.parent().css({'color':'#b94a48'});
      $('#registration-message').html(iNet.resources.register.do_not_agree).fadeIn(300);
      setTimeout(function(){$("#registration-message").fadeOut(500);},5000);
      isTrueAll = false;
      return false;
    }else{
      isTrueAll = true;
      $inp_personalRegisterForm.AGREERULE.parent().css({'color':'#333333'});
      isTrueAll = $controlGroup.hasClass('error') ? false : true;
      if(isTrueAll==false){
        $('#registration-message').html(iNet.resources.register.field_empty).fadeIn(300);
        setTimeout(function(){$("#registration-message").fadeOut(500);},5000);
        return false;
      }
    }
    if (isTrueAll) {
      var __data = [];
      __data.push({name: 'fullname', value: $inp_personalRegisterForm.FULLNAME.val()});
      __data.push({name: 'username', value: $inp_personalRegisterForm.USERNAME.val()});
      __data.push({name: 'birthday', value: $inp_personalRegisterForm.BIRTHDATE.val()});
      __data.push({name: 'birthmonth', value: $cbx_personalRegisterForm.BIRTHMONTH.children(':selected').val()});
      __data.push({name: 'birthyear', value: $inp_personalRegisterForm.BIRTHYEAR.val()});
      __data.push({name: 'sex', value: $cbx_personalRegisterForm.GENDER.children(':selected').val()});
      __data.push({name: 'phone', value: $inp_personalRegisterForm.PHONE.val()});
      __data.push({name: 'email', value: $inp_personalRegisterForm.YOUREMAIL.val()});
      __data.push({name: 'captcha', value: $inp_personalRegisterForm.CFRVERIFI.val()});
      __data.push({name: 'country', value: $cbx_personalRegisterForm.LOCATION.children(':selected').val()});
      __data.push({name: 'city', value: $cbx_personalRegisterForm.CITY.children(':selected').val()});
      __data.push({name: 'address1', value: $inp_personalRegisterForm.ADDRESS.val()});
      __data.push({name: 'firm', value: $inp_personalRegisterForm.FIRM.val()});
      __data.push({name: 'seckey', value: $inp_personalRegisterForm.FIRM_SERC.val()});
      __data.push({name: 'ajax', value: 'callback'});
      $.post(url.pers, __data, function(json) {
        if(!!json){
          if(!!json.errors && json.type=="ERROR" && json.errors[0].message=="captcha.unmatched"){
            $('#verification-status').text(iNet.resources.register.truth_captcha);
            $btn_personalRegisterForm.REFRESHCFR.click();
            $inp_personalRegisterForm.CFRVERIFI.focus();
            $('[id*=btn]').removeAttr('disabled');
            return false;
          }
          $('#registration-message').html(iNet.resources.register.create_acc_success+iNet.resources.register.check_email).show();
          setTimeout(function(){
            setTimeout(function(){$("#registration-message").fadeOut(300);},500);
            setTimeout(function(){document.location.href = '../../../'+json.uuid;},200);
          },1000);
        }
      },'json');
    }
  });
  
  /*------------ Check Company Register ----------*/
  $btn_companyRegisterForm.BTN_RFRSH_CAPT.click();
  $inp_companyRegisterForm.CORP_NAME.focusout(function(){
    checkFocusOut($(this));
  });
  $inp_companyRegisterForm.CORP_DOMAIN.focusout(function(){
    var $element = $inp_companyRegisterForm.CORP_DOMAIN;
    $element.parent().parent().addClass('error');
    if(iNet.isEmpty($element.val())){
      $element.parent().parent().addClass('error');
      $('#domain-regis-status').css({'color': '#B94A48'});
      $('#domain-regis-status').text(iNet.resources.register.domain_empty);
    }else{
      if($element.parent().parent().hasClass('error')){
        $element.parent().parent().removeClass('error');
      }
    }
  });
  $inp_companyRegisterForm.CORP_DOMAIN.keyup(function(){
    var $element = $inp_companyRegisterForm.CORP_DOMAIN;
    var __key = $inp_companyRegisterForm.CORP_DOMAIN.val();
    var __dt = {domain: __key};
    if(iNet.isEmpty(__key)){
      $element.parent().parent().addClass('error');
      $('#domain-regis-status').css({'color': '#B94A48'});
      $('#domain-regis-status').text(iNet.resources.register.domain_empty);
    }else{
      $.postJSON(url.checkDomain, __dt, function(isExist){
        console.log(isExist);
        if(isExist.uuid=="AVAILABLE"){
          $('#domain-regis-status').css({'color': '#007F00'});
          $('#domain-regis-status').text(iNet.resources.register.available_domain);
        }else if(isExist.uuid=="EXISTED"){
          $('#domain-regis-status').text(iNet.resources.register.exist_domain);
          $element.parent().parent().addClass('error');
        }else{
          if($element.parent().parent().hasClass('error')){
            $element.parent().parent().removeClass('error');
          }
        }
      });
    }
  });
  $inp_companyRegisterForm.SECURITY_KEY.focusout(function(){
    checkFocusOut($(this));
  });
  $inp_companyRegisterForm.SECURITY_KEY.keyup(function(){
    strength = checkStrength($(this).val());
    var titleBar = $('#key-security-status');
    var barLength = $('.key-security-strength').width();
    titleBar.removeAttr('class');
    titleBar.addClass(ratingClasses[strength]);
    titleBar.css({'width':(barLength * (parseInt(strength) + 1.0) / 6.0)});
    if(iNet.isEmpty($(this).val())){
      titleBar.css({'width': 0});
    }
    if(strength<2){
      $(this).parent().parent().addClass('error');
    }else{
      if($(this).parent().parent().hasClass('error')){
        $(this).parent().parent().removeClass('error');
      }
    }
  });
  $inp_companyRegisterForm.CORP_EMAIL.focusout(function(){
    checkFocusOut($(this));
  });
  $inp_companyRegisterForm.CORP_EMAIL.keyup(function(){
    var __email = $(this).val();
    if(!iNet.isEmail(__email)){
      $(this).parent().parent().addClass('error');
      $('#company-current-email-status').text(iNet.resources.register.is_email);
    }else{
      $('#company-current-email-status').text('');
      if($(this).parent().parent().hasClass('error')){
        $(this).parent().parent().removeClass('error');
      }
    }
  });
  $inp_companyRegisterForm.CORP_ADDR.focusout(function(){
    checkFocusOut($(this));
  });
  $inp_companyRegisterForm.CORP_CFR_CAPT.focusout(function(){
    checkFocusOut($(this));
  });
  $btn_companyRegisterForm.BTN_REGISTER.click(function(){
    $btn_companyRegisterForm.BTN_REGISTER.addClass('disable').attr('disable','disable');
    var isTrueAll = false;
    if(iNet.isEmpty($inp_companyRegisterForm.CORP_NAME.val())){
      $inp_companyRegisterForm.CORP_NAME.focus();
      return false;
    }
    if(iNet.isEmpty($inp_companyRegisterForm.CORP_DOMAIN.val())){
      $inp_companyRegisterForm.CORP_DOMAIN.focus();
      return false;
    }
    if(iNet.isEmpty($inp_companyRegisterForm.CORP_EMAIL.val())){
      $inp_companyRegisterForm.CORP_EMAIL.focus();
      return false;
    }
    if(iNet.isEmpty($inp_companyRegisterForm.CORP_CFR_CAPT.val())){
      $inp_companyRegisterForm.CORP_CFR_CAPT.focus();
      return false;
    }
    if(iNet.isEmpty($inp_companyRegisterForm.CORP_ADDR.val())){
      $inp_companyRegisterForm.CORP_ADDR.focus();
      return false;
    }
    var __key_phone = $inp_companyRegisterForm.CORP_PHONE.val();
    if(!!__key_phone && !iNet.isNumber(Number(__key_phone))){
      $this = $inp_companyRegisterForm.CORP_PHONE;
      $this.parent().parent().addClass('error');
      $('#company-phone-status').text(iNet.resources.register.is_number);
      $this.val('');
      $this.focus();
      return false;
    }else{
      $this = $inp_companyRegisterForm.CORP_FAX;
      $('#company-phone-status').text('');
      if($this.parent().parent().hasClass('error')){
        $this.parent().parent().removeClass('error');
      }
    }
    var __key_fax = $inp_companyRegisterForm.CORP_FAX.val();
    if(!!__key_fax && !iNet.isNumber(Number(__key_fax))){
      $this = $inp_companyRegisterForm.CORP_FAX;
      $this.parent().parent().addClass('error');
      $('#company-fax-status').text(iNet.resources.register.is_number);
      $this.val('');
      $this.focus();
      return false;
    }else{
      $this = $inp_companyRegisterForm.CORP_FAX;
      $('#company-fax-status').text('');
      if($this.parent().parent().hasClass('error')){
        $this.parent().parent().removeClass('error');
      }
    }
    if($inp_companyRegisterForm.CORP_AGREE_RULE.is(':checked')==false){
      $inp_companyRegisterForm.CORP_AGREE_RULE.parent().css({'color':'#b94a48'});
      $('#registration-message').html(iNet.resources.register.do_not_agree).fadeIn(300);
      setTimeout(function(){$("#registration-message").fadeOut(500);},5000);
      isTrueAll = false;
      return false;
    }else{
      isTrueAll = true;
      $inp_companyRegisterForm.CORP_AGREE_RULE.parent().css({'color':'#333333'});
      if(strength<=1){
        $('#registration-message').html(iNet.resources.register.pass_not_strength).fadeIn(300);
        setTimeout(function(){$("#registration-message").fadeOut(500);},5000);
        $inp_companyRegisterForm.SECURITY_KEY.parent().parent().addClass('error');
        $inp_companyRegisterForm.SECURITY_KEY.focus();
        isTrueAll = false;
        return false;
      }
      isTrueAll = $controlGroup.hasClass('error') ? false : true;
      if(isTrueAll==false){
        $('#registration-message').html(iNet.resources.register.field_empty).fadeIn(300);
        setTimeout(function(){$("#registration-message").fadeOut(500);},5000);
        return false;
      }
    }
    if (isTrueAll) {
      var __data = [];
      __data.push({name: 'name', value: $inp_companyRegisterForm.CORP_NAME.val()});
      __data.push({name: 'prefix', value: ($inp_companyRegisterForm.CORP_DOMAIN.val())});
      __data.push({name: 'secretkey', value: $inp_companyRegisterForm.SECURITY_KEY.val()});
      __data.push({name: 'email', value: $inp_companyRegisterForm.CORP_EMAIL.val()});
      __data.push({name: 'website', value: $inp_companyRegisterForm.CORP_SITE.val()});
      __data.push({name: 'phone', value: $inp_companyRegisterForm.CORP_PHONE.val()});
      __data.push({name: 'fax', value: $inp_companyRegisterForm.CORP_FAX.val()});
      __data.push({name: 'country', value: $cbx_companyRegisterForm.CORP_LOCATION.children(':selected').val()});
      __data.push({name: 'city', value: $cbx_companyRegisterForm.CORP_CITY.children(':selected').val()});
      __data.push({name: 'address1', value: $inp_companyRegisterForm.CORP_ADDR.val()});
      __data.push({name: 'languageUsed', value: $cbx_companyRegisterForm.CORP_LANG.children(':selected').val()});
      __data.push({name: 'captcha', value: $inp_companyRegisterForm.CORP_CFR_CAPT.val()});
      __data.push({name: 'ajax', value: 'callback'});
      $.post(url.firm, __data, function(json) {
          if(!!json){
            if(!!json.errors && json.type=="ERROR" && json.errors[0].message=="captcha.unmatched"){
              $('#verification-status').text(iNet.resources.register.truth_captcha);
              $btn_companyRegisterForm.BTN_RFRSH_CAPT.click();
              $inp_companyRegisterForm.CORP_CFR_CAPT.focus();
              $('[id*=btn]').removeAttr('disabled');
              return false;
            }
            $('#registration-message').html(iNet.resources.register.create_acc_success+iNet.resources.register.active_email).show();
            setTimeout(function(){
              setTimeout(function(){$("#registration-message").fadeOut(300);},500);
              setTimeout(function(){document.location.href = '../../../'+json.uuid;},200);
            },1000);
          }
      },'json');
    }
  });
});