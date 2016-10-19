// #PACKAGE: taxcode-widget
// #MODULE: TaxCodeWidget

$(function() {


  iNet.ns("iNet.ui", "iNet.ui.ita");
  iNet.ui.ita.TaxCodeWidget = function (config) {

    var resource = {
      common: ita.resources.common,
      validate: ita.resources.validate
    };
    this.$input = {
      taxCode: $('#homebusiness-txt-taxCode'),
      button_process: $('#action-process-btn')
    };

    var url = {
      //view: iNet.getUrl('ita/personrepresent/load'),
      // save: iNet.getUrl('ita/personrepresent/save'),
      update_taxCodeHomeBusiness: iNet.getUrl('ita/business/updatetaxcode'),
      update_statusProcess: iNet.getUrl('ita/businessprocess/updatestatus')
    };

    var __config = config || {};
    iNet.apply(this, __config);// apply configuration
    this.id = this.id || 'taxcode-widget';

    iNet.ui.ita.TaxCodeWidget.superclass.constructor.call(this);


    var me = this;
    me.idHomeBusiness = __config.idHomeBusiness;
    me.taxCode = __config.taxCode;
    me.parent_ID=__config.parent_ID;
    me.statusType=__config.statusType;
    me.statusProcess=__config.statusProcess;
    //me.__id_homebusiness = '';
    var updateTaxCodeHomeBusiness = function(data){
      var _data = data || '';
     // var _data = {taxCode: _taxcode};
      $.postJSON(url.update_taxCodeHomeBusiness, _data, function (result) {
        var __result = result || {};
        if (CommonService.isSuccess(__result)) {
          me.$input.button_process.removeClass("hide");
          //console.log('Update Taxcode success'+data+">>>>",_data);
          me.notifySuccess(resource.validate.save_title, resource.validate.update_success);
        }
        else
        {
          //console.log('Update Taxcode error'+data+">>>>",_data);
          me.notifyError(resource.validate.save_title, me.getNotifyContent(resource.validate.save_error, __result.errors || []));
        }
      });
    }

    $('#taxcode-location-btn-update').on('click', function(){

      var __data = me.getDataTaxCode() || {};
      console.log('updateTaxCode>>', __data);

      updateTaxCodeHomeBusiness(__data);
    }.createDelegate(this));

  var loadinfo = function()
  {
      if(me.taxCode != ""){
        me.$input.taxCode.val(me.taxCode);
        me.$input.button_process.removeClass("hide");
      }
  };
    this.$input.button_process.on('click',function(){
          var __data = {
            idHomeBusiness: me.idHomeBusiness,
            statusProcess:me.statusProcess,
            statusType:me.statusType,
            parent_ID:me.parent_ID
          };
          console.log("button_process data?>>>", __data);
          confirmDialog.params  = __data;
          confirmDialog.show();

    });
    var confirmDialog = me.confirmDialog(
        resource.validate.process_title, me.getNotifyContent(resource.validate.sure_process, ''), function () {
          if (!iNet.isEmpty(confirmDialog.params || {})) {
            confirmDialog.hide();
            $.postJSON(url.update_statusProcess, confirmDialog.params, function (result) {
              var __result = result || {};
              console.log("__result button process?>>>", __result);
              buttonBack();
            }/*, {
             mask: me.getMask(),
             msg: iNet.validate.process_success
             }*/);
          }
        });
    var buttonBack = function(){
      console.log("Show ACT>>>", me.act);
      var __url = iNet.getUrl('cpkd/page/index')+'#menu-process-business';
      iNet.getLayout().window.location.href = __url;
      iNet.getLayout().parentParams={act: me.statusProcess};
    };
    loadinfo();
};

  iNet.extend(iNet.ui.ita.TaxCodeWidget, iNet.ui.app.widget,{
    getDataTaxCode: function () {

      var __data = {};

      __data.idHomeBusiness = this.idHomeBusiness;
      __data.taxCode = this.$input.taxCode.val();

      return __data;
    }
  });

 /* var wgProvince = new iNet.ui.ita.TaxCodeWidget();
  wgProvince.show();*/

});