// #PACKAGE: numberbusiness-widget
// #MODULE: NumberBusinessWidget

$(function() {
  var resource = {
    common: ita.resources.common,
    validate: ita.resources.validate
  };
  var $input = {
    numberBusiness: $('#homebusiness-txt-numberBusiness')

  };

  var url = {
    //view: iNet.getUrl('ita/personrepresent/load'),
   // save: iNet.getUrl('ita/personrepresent/save'),
    update_numberBusinessHomeBusiness: iNet.getUrl('ita/homebusiness/update'),
    del: iNet.getUrl('ita/homebusiness/delete')
  };

  iNet.ns("iNet.ui", "iNet.ui.ita");
  iNet.ui.ita.NumberBusinessWidget = function (config) {
    var __config = config || {};
    iNet.apply(this, __config);// apply configuration
    this.id = this.id || 'numberbusiness-widget';

    iNet.ui.ita.NumberBusinessWidget.superclass.constructor.call(this);


    var me = this;
   me.__id_homebusiness = "57e49badec35b70960d34909";
    //me.__id_homebusiness = '';
    var updateNumberBusinessHomeBusiness = function(data){
      var _data = data || '';
     // var _data = {taxCode: _taxcode};
      $.postJSON(url.update_numberBusinessHomeBusiness, _data, function (result) {
        var __result = result || {};
        if (CommonService.isSuccess(__result)) {
          //console.log('Update Taxcode success'+data+">>>>",_data);
          me.notifyError(resource.validate.save_title, resource.validate.save_error_namebusiness);
        }
        else
        {
          //console.log('Update Taxcode error'+data+">>>>",_data);
          me.notifyError(resource.validate.save_title, me.getNotifyContent(resource.validate.save_error, __result.errors || []));
        }
      });
    }

    $('#numberbusiness-location-btn-update').on('click', function(){

      var __data = me.getDataNumberBusiness() || {};
      console.log('updatenumberBusiness>>', __data);

      updateNumberBusinessHomeBusiness(__data);
    }.createDelegate(this));



  };

  iNet.extend(iNet.ui.ita.NumberBusinessWidget, iNet.ui.app.widget,{
    getDataNumberBusiness: function () {

      var __data = {};

      __data.idHomeBusiness = this.__id_homebusiness;
      __data.numberBusiness = $input.numberBusiness.val();

      return __data;
    }
  });

  var wgProvince = new iNet.ui.ita.NumberBusinessWidget();
  wgProvince.show();

});