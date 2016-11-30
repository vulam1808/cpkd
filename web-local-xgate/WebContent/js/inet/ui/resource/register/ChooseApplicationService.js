/**
 * @author Nguyen Ba Chi Cong
 * Choose Application, Choose Service 
 */
$(function(){
  var firm = {
      name: $('#firm-key'),
      key:  $('#firm-serc'),
      tpl: $('#iso-template')
  };
  var step = {
      st1: $('#btn-step-1'),
      st2: $('#btn-step-2'),
      st3: $('#btn-step-3'),
      st4: $('#btn-step-4'),
      back: $('#btn-back'),
      finish: $('#btn-finish'),
      buy: $('#btn-buy')
  };
  var url = {
      infras: iNet.getUrl('cloud/service/rental/resource'),
      db: iNet.getUrl('cloud/service/rental/database'),
      app: iNet.getUrl('cloud/service/rental/application'),
      other: iNet.getUrl('cloud/service/rental/facility')
  };
  var source_url = {
      application: iNet.getUrl('cloud/application/list')
  }
  var owner = {};
  var checkoutBlock = '#checkout-block table tbody';
  var hasItemInCart = function($thElement,$e){
    if($thElement.parent().find($e).length!=0){
      return true;
    }else{
      return false;
    }
  };
  var checkTemplate = function($cartElement, $appID, $tplID){
    if(checkApplications($cartElement, $appID)){
      var appItem = '#'+$appID, tpl = '#'+$tplID;
      if($(appItem).find(tpl).length!=0)
        return true;
      else
        return false;
    }else{
      return false;
    }
  }
  var checkApplications = function($cartElement, $appID){
    var app = '#'+$appID;
    if($(checkoutBlock).find(app).length!=0)
      return true;
    else
      return false;
  }
  //============== LOAD APPLICATION ////////////////////
  var loadApplication = function(cateID){
    var __data = [{name: 'category', value: cateID}];
    $.postJSON(source_url.application, __data, function(json){
      var __html = '<div class="parent-block">';
      var __imgDefault = '<div class="ctrl-item" data-type="remove-item">' +
          '<div class="ctrl-remove ctrl" data-type="remove-theme"></div></div>' +
          '<img class="theme-img" data-type="img-app" />';
      for ( var i = 0; i < json.total; i++) {
        var __item = json.items[i];
        __html += '<div data-cate="'+__item.categoryUUID+'" class="block">'
                 +'<div app="'+__item.uuid+'" class="inner-block">'
                 +'<h2>'+__item.name+'</h2>'
                 +'<p class="desc">'+__item.description+'</p>'
                 +'<div class="tpl-l" data-type="tpl-list">'
                 +'</div>'
                 +'<div class="version">'+__item.version+'</div>'
                 +'</div></div>';
        if(i==3){
          __html += '<br style="clear: both;" /></div><div class="parent-block">';
        }
      }
      __html += '<br style="clear: both;" /></div>';
      $('#list-app').empty().html(__html);
      //================= CHOOSE APP /////////
      $('#list-app .parent-block .block').off('click','.inner-block :not([data-type])').on('click','.inner-block :not([data-type])',function(){
        var $cartParentElement = $(checkoutBlock).children('tr[data-type=APPLICATION]');
        $(this).each(function(){
          var block = {};
          var theme_block = {w:778};
          var $that = $(this).parent();
          var id = $that.attr('app');
          var $e = 'tr[id='+id+']';
          var $parent = $that.parent().parent().parent();
          var $parent_block = $that.parent().parent();
          var appName = $that.children('h2').text();
          if($parent.find('.children-block').length>0){
            $parent.find('.children-block').slideUp('200');
          }
          var listApp = '#list-app';
          $(listApp).find('div.tpl-app').off('click','img');
          
          // load application template
          var __data = {'application':id};
          var tplUrl = iNet.getUrl('cloud/ui/list');
          var childElement = '';
          $.postJSON(tplUrl, __data, function(json){
            var tplItem = '';
            for ( var i = 0; i < json.total; i++) {
              var __item = json.items[i];
              var tplId = __item.uuid;
              var tplSrc = iNet.getUrl('cloud/ui/picture')+'?picture='+__item.uuid;
              var tplName = __item.description;
              tplItem += String.format('<div id="{0}" class="small-block"><img alt="{1}" src="{2}" /></div>',tplId, tplName, tplSrc);
            }
            childElement = '<div class="children-block popover bottom hide">'
            +'<div class="arrow"></div>'
            +'<h3 class="popover-title">Chọn giao diện</h3>'
            +'<div class="popover-content">'+tplItem+'<br style="clear: both;" /></div></div>';
            
            $parent.find('.children-block').remove();
            $parent_block.after(childElement);
            var $children_block = $parent_block.next('.children-block');
            var $children_content = $children_block.children('.popover-content');
            
            // auto set position for select theme block
            block.w = $that.parent().width();
            block.i = ($that.parent().index()+1);
            theme_block.item = {};
            theme_block.item.n = $children_content.children('.small-block').length;
            theme_block.item.w = theme_block.item.n*60;
            var padding_left = (block.w*(block.i-1))-(theme_block.item.w-block.w)/2;
            if((padding_left+theme_block.item.w)>theme_block.w){
              padding_left = padding_left-((padding_left+theme_block.item.w)-theme_block);
            }
            theme_block.paddingleft = padding_left<0?0:padding_left;
            /*$children_content.css({
              'padding-left':theme_block.paddingleft,
              'width': theme_block.w-theme_block.paddingleft
            });*/
            $children_block.children('.arrow').css({'left':(block.w*block.i)-(block.w/2)});
            $children_block.slideToggle('slow');
            //$that.css({'z-index':29000});
            //$('#mask').show();
            // template item event
            var botPosition = 1, rightPosition = -1;
            $children_content.children('.small-block').bind('click', function(){
              var $this = $(this);
              //$this.parent().parent().children('.small-block').removeClass('theme-selected');
              $this.addClass('theme-selected');
              //$this.parent().parent().parent().children().children('block').children($blockElement).addClass('checked');
              var childID = $this.attr('id');
              var childName = $this.children('img').attr('alt');
              var childIMG = $this.children('img').attr('src');
              $that.find('.tpl-app').fadeIn('slow');
              var $tplID = childID, $appID = id, tplList = '.tpl-l', itemId = 'tpl-'+id;
              if(checkApplications($cartParentElement, $appID)){
                var app = '#'+$appID;
                $(checkoutBlock).find(app).attr('id',$appID);
                if(checkTemplate($cartParentElement, $appID, $tplID)){
                  var tpl = '#'+$tplID;
                  $(app).find(tpl).attr('id',$tplID);
                }else{
                  botPosition+=3;
                  rightPosition+=3;
                  var __imgTPL = '';
                  __imgTPL = String.format('<div class="tpl-app" data-type="tpl-app" tpl="{0}" style="right: {1}%; bottom: {2}%;">'
                      +'<div class="ctrl-item" data-type="remove-item">'
                      +'<div class="ctrl-remove ctrl" data-type="remove-theme"></div></div>'
                      +'<img class="theme-img" src="{3}" data-type="img-app" /></div>',childID,rightPosition,botPosition,childIMG);
                  $that.find('.tpl-l').append(__imgTPL);
                  var __tplHTML = '';
                  var numTpl = $('[app='+id+']').find('.tpl-app').length;
                  for(var k=0; k<numTpl; k++){
                    var tpl = $(tplList).find('.tpl-app').eq(k).attr('tpl');
                    __tplHTML += String.format('<span style="display: none;" id="{0}" data="APPTPL"></span>',tpl);
                  }
                  var tdTPL = '#'+itemId;
                  $(tdTPL).html(__tplHTML);
                }
              }else{
                botPosition+=3;
                rightPosition+=3;
                var __imgTPL = '';
                __imgTPL = String.format('<div class="tpl-app" data-type="tpl-app" tpl="{0}" style="right: {1}%; bottom: {2}%;">'
                    +'<div class="ctrl-item" data-type="remove-item">'
                    +'<div class="ctrl-remove ctrl" data-type="remove-theme"></div></div>'
                    +'<img class="theme-img" src="{3}" data-type="img-app" /></div>',childID,rightPosition,botPosition,childIMG);
                $that.find('.tpl-l').append(__imgTPL);
                var __tplHTML = '', __appEl = '[app='+id+']';
                var numTpl = $(__appEl).find('.tpl-app').length;
                for(var k=0; k<numTpl; k++){
                  var tpl = $(__appEl).find('.tpl-app').eq(k).attr('tpl');
                  __tplHTML += String.format('<span style="display: none;" id="{0}" data="APPTPL"></span>',tpl);
                }
                var __appHTML = String.format('<tr id="{0}" data-content="app-content"><td>{1}</td>'
                    +'<td id="{2}" style="text-align: right;">{3}</td></tr>', $appID, appName, itemId, __tplHTML);
                $cartParentElement.after(__appHTML);
              }
              //$parent_block.children('block').children('.inner-block').css({'z-index':20000});
              //$('#mask').hide();
              $('div[data-type=remove-item]').off('click').on('click', function(){
                var tplItem = $(this).parent().attr('tpl');
                var appItem = $(this).parent().parent().parent().attr('app');
                var $tpl = '#'+tplItem, $cartITEM = '#'+appItem, $appITEM = '[app='+appItem+']';
                //$parent.find('.children-block').hide();
                //$parent.find('.children-block').remove();
                $(checkoutBlock).find($tpl).remove();
                $(this).parent().remove();
                $('.children-block').find($tpl).removeClass('theme-selected');
                botPosition -= 3, rightPosition -= 3;
                if($($appITEM).find('.tpl-app').length==0){
                  $(checkoutBlock).find($cartITEM).remove();
                }
              });
            });
          });
        });
      });
      //======= END CLICK EVENT //////////
    });
  };
  
  var loadServicePrice = function(){
    $('#cbb-hardware-system').change();
    $('#cbb-database-system').change();
    $('#cbb-database').change();
    $('#cbb-nosql').change();
    $('#cbb-cate-app').change();
    $('#pay-type input[name=payment-type]').change();
    $('#btn-back-step').show();
    $("#inet-other-service .line-item button.btn-select").show();
    $("#inet-other-service .line-item button.btn-unselect").hide();
    $('#pay-type fieldset .pay-type button.choose').show();
    $('#pay-type fieldset .pay-type.selected').children('button').hide();
  };
  $('#btn-next').click(function(){
    $(this).attr('disabled','disabled');
    $('form').submit();
  });
  $('#cbb-cate-app').change(function(){
    var cateID = $(this).children(':selected').val();
    loadApplication(cateID);
  });
  $('#cbb-hardware-system').change(function(){
    var $lbl = $('#hardware-system-price label');
    $lbl.children('span.month').text($(this).children(':selected').attr('data-month-price'));
    $lbl.children('span.quater').text($(this).children(':selected').attr('data-quater-price'));
    $lbl.children('span.year').text($(this).children(':selected').attr('data-year-price'));
    var hdName = $(this).children(':selected').text();
    $(checkoutBlock).children('tr[data-content=hd-content]').remove();
    $(checkoutBlock).children('tr[data-type=HARDWARE]').after('<tr id="'+$(this).children(':selected').val()+'" data-content="hd-content"><td colspan="2">'+hdName+'</td></tr>');
  });
  $('#cbb-database-system').change(function(){
    var $lbl = $('#database-system-price label');
    $lbl.children('span.month').text($(this).children(':selected').attr('data-month-price'));
    $lbl.children('span.quater').text($(this).children(':selected').attr('data-quater-price'));
    $lbl.children('span.year').text($(this).children(':selected').attr('data-year-price'));
    var dbSysName = $(this).children(':selected').text();
    $(checkoutBlock).children('tr[data-content=db-sys-content]').remove();
    $(checkoutBlock).children('tr[data-type=DB-SYSTEM]').after('<tr id="'+$(this).children(':selected').val()+'" data-content="db-sys-content"><td colspan="2">'+dbSysName+'</td></tr>');
  });
  $('#cbb-database').change(function(){
    var $lbl = $('#database-price label');
    $lbl.children('span.month').text($(this).children(':selected').attr('data-month-price'));
    $lbl.children('span.quater').text($(this).children(':selected').attr('data-quater-price'));
    $lbl.children('span.year').text($(this).children(':selected').attr('data-year-price'));
    var dbName = $(this).children(':selected').text();
    $(checkoutBlock).children('tr[data-content=db-type-content]').remove();
    $(checkoutBlock).children('tr[data-type=DB-TYPE]').after('<tr id="'+$(this).children(':selected').val()+'" data-content="db-type-content"><td colspan="2">'+dbName+'</td></tr>');
  });
  $('#cbb-nosql').change(function(){
    var $lbl = $('#nosql-price label');
    $lbl.children('span.month').text($(this).children(':selected').attr('data-month-price'));
    $lbl.children('span.quater').text($(this).children(':selected').attr('data-quater-price'));
    $lbl.children('span.year').text($(this).children(':selected').attr('data-year-price'));
    var nosqlName = $(this).children(':selected').text();
    $(checkoutBlock).children('tr[data-content=nosql-content]').remove();
    $(checkoutBlock).children('tr[data-type=NOSQL]').after('<tr id="'+$(this).children(':selected').val()+'" data-content="nosql-content"><td colspan="2">'+nosqlName+'</td></tr>');
  });
  
  loadServicePrice();
  $("#inet-other-service .line-item button.btn-select").click(function(){
    var $otherCartElement = $(checkoutBlock).children('tr[data-type=OTHER]');
    var $that = $(this).parent();
    var $this = $(this);
    var serviceId = $that.attr('id');
    $that.addClass('selected');
    $this.hide();
    $that.find('.btn-unselect').show();
    if(serviceId=='loadbalancing'){
      $('#loadbal-num').show();
      $('#loadbal-num').val('').focus();
      var loadbalNum = $('#loadbal-num').val();
      loadbalNum = loadbalNum==''?0:loadbalNum;
      $otherCartElement.after('<tr id="'+serviceId+'" data-type-content="loadbalance"><td>'+$that.children('span.service-name').text()+'</td><td id="'+loadbalNum+'" style="text-align: right;">'+loadbalNum+'</td></tr>');
      $('#loadbal-num').keyup(function(){
        var __key = $('#loadbal-num').val();
        if(!iNet.isNumber(Number(__key))){
          $(this).val('');
        }
        if(!!$otherCartElement.parent().find('tr[data-type-content=loadbalance]')){
          $otherCartElement.parent().find('tr[data-type-content=loadbalance]').children(':eq(1)').attr('id',Number(__key)).text(Number(__key));
        }
      });
    }else if(serviceId=='clustering'){
      var isCluster = false;
      if($that.hasClass('selected')){
        isCluster = true;
        $otherCartElement.after('<tr id="'+serviceId+'" data-value="'+isCluster+'" data-type-content="cluster"><td>'+$that.children('span.service-name').text()+'</td></tr>');
      }
    }else if($that.attr('data-name')=='capacity'){
      $('#capacity-num').show();
      $('#capacity-num').val('').focus();
      var capNum = $('#capacity-num').val();
      capNum = capNum==''?0:capNum;
      $otherCartElement.after('<tr data-value="'+serviceId+'" data-type-content="capacity"><td>'+$that.children('span.service-name').text()+'</td><td id="'+capNum+'" style="text-align: right;">'+capNum+'GB</td></tr>');
      $('#capacity-num').keyup(function(e){
        var __key = $('#capacity-num').val();
        var mprice = 0, qprice = 0, yprice = 0;
        if(!iNet.isNumber(Number(__key))){
          $(this).val('');
          $('#cap-p-month').text(capacity_price.month+'/GB');
          $('#cap-p-quater').text(capacity_price.quater+'/GB');
          $('#cap-p-year').text(capacity_price.year+'/GB');
        }else{
          mprice = capacity_price.month*Number(__key);
          qprice = capacity_price.quater*Number(__key);
          yprice = capacity_price.year*Number(__key);
        }
        $('#cap-p-month').text(mprice+'/GB');
        $('#cap-p-quater').text(qprice+'/GB');
        $('#cap-p-year').text(yprice+'/GB');
        if(!!$otherCartElement.parent().find('tr[data-type-content=capacity]')){
          $otherCartElement.parent().find('tr[data-type-content=capacity]').children(':eq(1)').attr('id',Number(__key)).text(Number(__key)+'GB');
        }
      });
    }else{
      $otherCartElement.after('<tr data-value="'+serviceId+'" data-content="other-content"><td>'+$that.children('span.service-name').text()+'</td></tr>');
    }
  });
  $("#inet-other-service .line-item button.btn-unselect").click(function(){
    var $otherCartElement = $(checkoutBlock).children('tr[data-type=OTHER]');
    var $that = $(this).parent();
    var $this = $(this);
    var serviceId = $that.attr('id');
    var element = 'tr[data-value='+serviceId+']';
    $that.removeClass('selected');
    if(!!$that.find('input')){
      $that.find('input').val('').hide();
    }
    if(serviceId=='loadbalancing'){
      $('#loadbal-num').hide();
      $otherCartElement.parent().find('tr[id=loadbalancing]').remove();
    }
    if(serviceId=='clustering'){
      $otherCartElement.parent().find('tr[id=clustering]').remove();
    }
    if($that.attr('data-name')=='capacity'){
      $('#capacity-num').hide();
    }
    $this.hide();
    $that.find('.btn-select').show();
    $(checkoutBlock).find(element).remove();
  });
  $('#pay-type fieldset .pay-type button.btn-choose').click(function(){
    var $self = $(this);
    var $this = $(this).parent();
    var $that = $this.parent().parent();
    $that.children().children().removeClass('selected');
    $this.addClass('selected');
    $that.children().children().children('button').show();
    $self.hide();
  });
  
  // ///////////// CHECK OUT BLOCK /////////////////
  $window = $(window);
  $checkout = $("#checkout-block");
  var top = 140;
  $window.scroll(function (event) {
    var y = $(this).scrollTop();
    if (y >= top) {
      $checkout.addClass('fixed');
    } else {
      $checkout.removeClass('fixed');
    }
  });
  $('#show-cart').bind('click',function(){
    $(this).each(function(){
      $(this).parent().toggleClass('active');
      if($('#checkout-block').hasClass('hide')){
        $('#checkout-block').slideDown(300).removeClass('hide');
      }else{
        $('#checkout-block').slideUp(300).addClass('hide');
      }
    });
  });
  
  var sendInfrasCart = function(){
    $('[id*=btn-back]').attr('disabled','disabled');
    $('[id*=btn-step]').attr('disabled','disabled');
    var __data = [];
    var $hdsysElement = $(checkoutBlock).children('tr[data-type=HARDWARE]');
    var $dbsysElement = $(checkoutBlock).children('tr[data-type=DB-SYSTEM]');
    __data.push({name: 'firm', value: firm.name.val()});
    __data.push({name: 'seckey', value: firm.key.val()});
    __data.push({name: 'isotemplate', value: firm.tpl.val()});
    if($hdsysElement.parent().find('tr[data-content=hd-content]').length==1){
      __data.push({name: 'app', value: $hdsysElement.next('tr[data-content=hd-content]').attr('id')});
    }
    if($dbsysElement.parent().find('tr[data-content=db-sys-content]').length==1){
      __data.push({name: 'dbs', value: $dbsysElement.next('tr[data-content=db-sys-content]').attr('id')});
    }
    __data.push({name: 'ajax', value: 'callback'});
    $.post(url.infras, __data, function(json){
      $('#registration-message').html('<p class="success">Thêm ứng dụng thành công!</p>').show();
      if(!!json && !!json.uuid){
        setTimeout(function(){document.location.href = '../../../../'+json.uuid;},100);
      }
    },'json').fail(function(){
      setTimeout(function(){$('#registration-message').html('<p class="error">Quá trình thêm ứng dụng không thành công!</p>').fadeOut(300);},2000);
    });
  };
  
  var sendDatabaseCart = function(){
    $('[id*=btn-back]').attr('disabled','disabled');
    $('[id*=btn-step]').attr('disabled','disabled');
    var __data = [];
    var $dbElement = $(checkoutBlock).children('tr[data-type=DB-TYPE]');
    var $nosqlElement = $(checkoutBlock).children('tr[data-type=NOSQL]');
    __data.push({name: 'firm', value: firm.name.val()});
    __data.push({name: 'seckey', value: firm.key.val()});
    __data.push({name: 'isotemplate', value: firm.tpl.val()});
    if($dbElement.parent().find('tr[data-content=db-type-content]').length==1){
      __data.push({name: 'sqldb', value: $dbElement.next('tr[data-content=db-type-content]').attr('id')});
    }
    if($nosqlElement.parent().find('tr[data-content=nosql-content]').length==1){
      __data.push({name: 'nosql', value: $nosqlElement.next('tr[data-content=nosql-content]').attr('id')});
    }
    __data.push({name: 'ajax', value: 'callback'});
    $.post(url.db, __data, function(json){
      $('#registration-message').html('<p class="success">Thêm ứng dụng thành công!</p>').show();
      if(!!json && !!json.uuid){
        setTimeout(function(){document.location.href = '../../../../'+json.uuid;},100);
      }
    },'json').fail(function(){
      $('#registration-message').html('<p class="error">Quá trình thêm ứng dụng không thành công!</p>').fadeOut(300);
      setTimeout(function(){},2000);
    });
  };
  
  var sendApplicationCart = function(){
    $('[id*=btn-back]').attr('disabled','disabled');
    $('[id*=btn-step]').attr('disabled','disabled');
    var __data = [];
    var appUUID = '';
    var numAPPTPL = $(checkoutBlock).find('[data=APPTPL]').length;
    if(numAPPTPL>=1){
      for ( var i = 0; i < numAPPTPL; i++) {
        appUUID += $(checkoutBlock).find('[data=APPTPL]').eq(i).attr('id')+',';
      }
      appUUID = appUUID.substring(0,(appUUID.length-1));
    }
    console.log(appUUID);
    __data.push({name: 'firm', value: firm.name.val()});
    __data.push({name: 'seckey', value: firm.key.val()});
    __data.push({name: 'isotemplate', value: firm.tpl.val()});
    __data.push({name: 'apps', value: appUUID});
    __data.push({name: 'ajax', value: 'callback'});
    $.post(url.app, __data, function(json){
      $('#registration-message').html('<p class="success">Thêm ứng dụng thành công!</p>').show();
      if(!!json && !!json.uuid){
        setTimeout(function(){document.location.href = '../../../../'+json.uuid;},100);
      }
    },'json').fail(function(){
      $('#registration-message').html('<p class="error">Quá trình thêm ứng dụng không thành công!</p>');
    });
  };
  
  var sendOtherSeviceCart = function(){
    $('[id*=btn-back]').attr('disabled','disabled');
    $('[id*=btn-finish]').attr('disabled','disabled');
    var __data = [];
    var otherUUID = '';
    var $otherElement = $(checkoutBlock).children('tr[data-type=OTHER]');
    var numOtherElement = $otherElement.parent().find('tr[data-content=other-content]').length;
    var capNum = 0;
    var loadBalNum = 0;
    var clusterNum = 'false';
    if($otherElement.parent().find('tr[data-type-content=capacity]').length==1){
      capNum = $otherElement.parent().find('tr[data-type-content=capacity]').children(':eq(1)').attr('id');
    }
    if($otherElement.parent().find('tr[data-type-content=loadbalance]').length==1){
      loadBalNum = $otherElement.parent().find('tr[id=loadbalancing]').children(':eq(1)').attr('id');
    }
    if($otherElement.parent().find('tr[data-type-content=cluster]').length==1){
      clusterNum = $otherElement.parent().find('tr[data-type-content=cluster]').attr('data-value');
    }
    var payType = $('#pay-type fieldset div.selected[data-name=payment-type]').attr('data-value');
    if(numOtherElement>=1){
      if(numOtherElement==1){
        otherUUID = $otherElement.parent().find('tr[data-content=other-content]').attr('data-value');
      }else{
        var otherElementIndex = $otherElement.index();
        var serviceIndex = $otherElement.parent().find('tr[data-content=other-content]').eq(0).index();
        for ( var i = 0; i < numOtherElement; i++) {
          otherUUID += $otherElement.parent().find('tr[data-content=other-content]').eq(i).attr('data-value') + ',';
        }
        otherUUID = otherUUID.substring(0,(otherUUID.length-1));
      }
    }
    __data.push({name: 'firm', value: firm.name.val()});
    __data.push({name: 'seckey', value: firm.key.val()});
    __data.push({name: 'isotemplate', value: firm.tpl.val()});
    __data.push({name: 'service', value: otherUUID});
    __data.push({name: 'cls', value: clusterNum});
    __data.push({name: 'lbs', value: loadBalNum});
    __data.push({name: 'capacity', value: capNum});
    __data.push({name: 'paym', value: payType});
    __data.push({name: 'ajax', value: 'callback'});
    $.post(url.other, __data, function(json){
      $('#registration-message').html('<p class="success">Thêm ứng dụng thành công!</p>').show();
      if(!!json && !!json.uuid){
        setTimeout(function(){document.location.href = '../../../../'+json.uuid;},100);
      }
    },'json').fail(function(){
      $('#registration-message').html('<p class="error">Quá trình thêm ứng dụng không thành công!</p>').fadeOut(300);
      setTimeout(function(){},2000);
    });
  };
  
  var rentalSubmit = function(){
    $('[id*=btn-back]').attr('disabled','disabled');
    $('[id*=btn-buy]').attr('disabled','disabled');
    var __data = [];
    __data.push({name: 'firm', value: firm.name.val()});
    __data.push({name: 'seckey', value: firm.key.val()});
    __data.push({name: 'isotemplate', value: firm.tpl.val()});
    __data.push({name: 'ajax', value: 'callback'});
    var url = iNet.getUrl('cloud/service/rental/submit');
    $.post(url, __data, function(json){
      window.location.href = '../../../../'+json.uuid;
    },'json');
  };
  step.back.click(function(){
    window.history.back();
  });
  step.st2.click(function(){
    sendInfrasCart();
  });
  step.st3.click(function(){
    sendDatabaseCart();
  });
  step.st4.click(function(){
    sendApplicationCart();
  });
  step.finish.click(function(){
    sendOtherSeviceCart();
  });
  step.buy.click(function(){
    rentalSubmit();
  });
});

var loadCart = function(){
  var checkoutBlock = '#checkout-block table tbody';
  var firm = {
      name: $('#firm-key'),
      key:  $('#firm-serc'),
      tpl: $('#iso-template')
  };
  var url = {
    cart_info: iNet.getUrl('cloud/service/rental')
  };
  var source_url = {
      hardware: iNet.getUrl('cloud/price/policy'),
      database: iNet.getUrl('cloud/license/policy'),
      application: iNet.getUrl('cloud/application/list'),
      otherserivce: iNet.getUrl('cloud/servicefee/policy')
  }
    var rental = {};
    var __data = [{name: 'firm', value: firm.name.val()},
                  {name: 'seckey', value: firm.key.val()}];
    $.getJSON(url.cart_info, __data, function(json_rental){
      rental = json_rental;
      $.getJSON(source_url.hardware,function(json_hd){// get hardware
        for ( var i = 0; i < json_hd.total; i++) {
          var __item = json_hd.items[i];
          if(rental.appPolicy == __item.uuid){
            $(checkoutBlock).children('tr[data-content=hd-content]').remove();
            $(checkoutBlock).children('tr[data-type=HARDWARE]').after('<tr id="'+__item.uuid+'" data-content="hd-content"><td colspan="2">'+__item.name+'</td></tr>');
          }
          if(rental.dbPolicy == __item.uuid){
            $(checkoutBlock).children('tr[data-content=db-sys-content]').remove();
            $(checkoutBlock).children('tr[data-type=DB-SYSTEM]').after('<tr id="'+__item.uuid+'" data-content="db-sys-content"><td colspan="2">'+__item.name+'</td></tr>');
          }
        }
      });
      $.getJSON(source_url.database,function(json_db){// get database
        for ( var i = 0; i < json_db.total; i++) {
          var __item = json_db.items[i];
          if(rental.sqldbcfg == __item.uuid){
            $(checkoutBlock).children('tr[data-content=db-type-content]').remove();
            $(checkoutBlock).children('tr[data-type=DB-TYPE]').after('<tr id="'+__item.uuid+'" data-content="db-type-content"><td colspan="2">'+__item.name+'</td></tr>');
          }
          if(rental.nosqlcfg == __item.uuid){
            $(checkoutBlock).children('tr[data-content=nosql-content]').remove();
            $(checkoutBlock).children('tr[data-type=NOSQL]').after('<tr id="'+__item.uuid+'" data-content="nosql-content"><td colspan="2">'+__item.name+'</td></tr>');
          }
        }
      });
      $.getJSON(source_url.application,function(json_app){// get application
        var $cartParentElement = $(checkoutBlock).children('tr[data-type=APPLICATION]');
        var __imgDefault = '<div class="ctrl-item" data-type="remove-item">' +
          '<div class="ctrl-remove ctrl" data-type="remove-theme"></div></div>' +
          '<img class="theme-img" data-type="img-app" />';
        var __imgTPL = '', rightPos = -1, botPos = 1;
        for ( var i = 0; i < json_app.total; i++) {
          var __item = json_app.items[i];
          for ( var j = 0; j < rental.firm.applications.length; j++) {
            var __app = rental.firm.applications[j];
            if(__app.appRefUUID == __item.uuid){
              var appId = '[app='+__app.appRefUUID+']', __tplHTML = '', tdTPL = 'tpl-'+__app.appRefUUID;
              for ( var k = 0; k < __app.uimaker.length; k++) {
                var uimaker = __app.uimaker[k], tplID = '';
                rightPos += 3, botPos += 3;
                if(!!uimaker.uuid){
                  tplID = uimaker.uuid;
                }
                var tplIMG = iNet.getUrl('cloud/ui/picture')+'?picture='+tplID;
                __tplHTML += String.format('<span style="display: none;" id="{0}" data="APPTPL"></span>',tplID);
                __imgTPL = String.format('<div class="tpl-app" data-type="tpl-app" tpl="{0}" style="right: {1}%; bottom: {2}%;">'
                    +'<div class="ctrl-item" data-type="remove-item">'
                    +'<div class="ctrl-remove ctrl" data-type="remove-theme"></div></div>'
                    +'<img class="theme-img" src="{3}" data-type="img-app" /></div>', tplID, rightPos, botPos, tplIMG);
                $(appId).find('.tpl-l').append(__imgTPL);
              }
              var $cartItem = String.format('<tr id="{0}" data-content="app-content"><td>{1}</td><td id="{2}" style="text-align: right;">{3}</td></tr>', __item.uuid, __item.name, tdTPL, __tplHTML);
              $cartParentElement.after($cartItem);
              $('div[data-type=remove-item]').off('click').on('click', function(){
                var tplItem = $(this).parent().attr('tpl');
                var appItem = $(this).parent().parent().parent().attr('app');
                var $tpl = '#'+tplItem, $cartITEM = '#'+appItem, $appITEM = '[app='+appItem+']';
                //$parent.find('.children-block').hide();
                //$parent.find('.children-block').remove();
                $(checkoutBlock).find($tpl).remove();
                $(this).parent().remove();
                $('.children-block').find($tpl).removeClass('theme-selected');
                botPos -= 3, rightPos -= 3;
                if($($appITEM).find('.tpl-app').length==0){
                  $(checkoutBlock).find($cartITEM).remove();
                }
              });
            }
          }
        }
      });
      $.getJSON(source_url.otherserivce, function(json_other){// get other service
        var $otherCartElement = $(checkoutBlock).children('tr[data-type=OTHER]');
        for ( var i = 0; i < json_other.total; i++) {
          var __item = json_other.items[i];
          for ( var j = 0; j < json_rental.services.length; j++) {
            var __service = json_rental.services[j];
            if(__item.uuid==__service){
              var element = '#'+__item.uuid;
              $(element).addClass('selected');
              $(element).find('.btn-select').hide();
              $(element).find('.btn-unselect').show();
              $otherCartElement.after('<tr data-value="'+__item.uuid+'" data-content="other-content"><td>'+__item.name+'</td></tr>');
            }
          }
        }
        if(json_rental.serviceLBS!=0){
          $('#loadbal-num').val(json_rental.serviceLBS).show();
          $('#loadbalancing').addClass('selected');
          $('#loadbalancing').find('.btn-select').hide();
          $('#loadbalancing').find('.btn-unselect').show();
          $otherCartElement.after('<tr id="loadbalancing" data-type-content="loadbalance"><td>Load Balancing</td><td id="'+json_rental.serviceLBS+'" style="text-align: right;">'+json_rental.serviceLBS+'</td></tr>');
          $('#loadbal-num').keyup(function(){
            var __key = $('#loadbal-num').val();
            if(!iNet.isNumber(Number(__key))){
              $(this).val('');
            }
            if(!!$otherCartElement.parent().find('tr[data-type-content=loadbalance]')){
              $otherCartElement.parent().find('tr[data-type-content=loadbalance]').children(':eq(1)').attr('id',Number(__key)).text(Number(__key));
            }
          });
        }
        if(json_rental.serviceCLS==true){
          $('#clustering').addClass('selected');
          $('#clustering').find('.btn-select').hide();
          $('#clustering').find('.btn-unselect').show();
          $otherCartElement.after('<tr id="clustering" data-value="'+json_rental.serviceCLS+'" data-type-content="cluster"><td>Clustering</td></tr>');
        }
        if(!!json_rental.paymentTerm){
          var $div = $('#pay-type fieldset div[data-name=payment-type]');
          $div.removeClass('selected');
          var eValue = '#pay-type fieldset div[data-value='+json_rental.paymentTerm+']';
          $(eValue).addClass('selected');
          $(eValue).find('button.btn-choose').hide();
        }
      });
    });
  };
//----------------------------------
// generate bill page---------------
var generateBill = function(){
  var firm = {
      name: $('#firm-key'),
      key:  $('#firm-serc'),
      tpl: $('#iso-template')
  };
  var url = {
    cart_info: iNet.getUrl('cloud/service/rental'),
    bill_info: iNet.getUrl('cloud/service/rental/bill')
  };
    var tblBillList = '#bill-list';
    var __data = [{name: 'firm', value: firm.name.val()},
                  {name: 'seckey', value: firm.key.val()}];
    $.postJSON(url.bill_info, __data, function(json){
      var payType = 0;
      var __html = '', totalPrice = 0, sumTitle = '';
      $.postJSON(url.cart_info, __data, function(ajson){
        var payment = '';
        payType = ajson.paymentTerm;
        if(payType==1){
          payment = "Hóa đơn thanh toán theo tháng";
          sumTitle = "Tổng tiền hàng tháng phải trả: ";
        }else if(payType==2){
          payment = "Hóa đơn thanh toán theo quý";
          sumTitle = "Tổng tiền hàng quý phải trả: ";
        }else if(payType==3){
          payment = "Hóa đơn thanh toán theo năm";
          sumTitle = "Tổng tiền hàng năm phải trả: ";
        }
        $('#total-bill .bill-sum').text(sumTitle);
      });
      for ( var i = 0; i < json.elements.length; i++) {
        totalPrice += Number(json.elements[i].total);
        __html += String.format('<tr><td>{0} {1}</td><td>{2}</td></tr>',json.elements[i].name,json.elements[i].description,json.elements[i].total);
      }
      $(tblBillList).children('tbody').html(__html);
      $('#total-bill .sum-price').text(totalPrice);
    });
  };