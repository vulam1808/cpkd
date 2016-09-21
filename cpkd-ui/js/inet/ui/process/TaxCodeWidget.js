// #PACKAGE: taxcode-widget
// #MODULE: TaxCodeWidget

$(function() {
  var resource = {
    common: ita.resources.common,
    validate: ita.resources.validate
  };
  var $input = {
    $taxCode: $('#homebusiness-txt-taxCode')

  };

  var url = {
    view: iNet.getUrl('ita/personrepresent/load'),
    save: iNet.getUrl('ita/personrepresent/save'),
    update: iNet.getUrl('ita/homebusiness/update'),
    del: iNet.getUrl('ita/personrepresent/delete')
  };

  iNet.ns("iNet.ui", "iNet.ui.ita");
  iNet.ui.ita.TaxCodeWidget = function (config) {
    var __config = config || {};
    iNet.apply(this, __config);// apply configuration
    this.id = this.id || 'taxcode-widget';

    iNet.ui.ita.TaxCodeWidget.superclass.constructor.call(this);


    var me = this;

    $('#taxcode-location-btn-update').on('click', function(){
      getData();
      var __data = me.setData() || {};
      console.log('update>>', __data);

      $.postJSON(url.update, __data, function (result) {
        var __result = result || {};
        if (CommonService.isSuccess(__result)) {

          me.notifySuccess(resource.validate.save_title, resource.validate.save_success);
        } else {

          me.notifyError(resource.validate.save_title, me.getNotifyContent(resource.validate.save_error, __result.errors || []));
        }
      });
    }.createDelegate(this));



  };

  iNet.extend(iNet.ui.ita.TaxCodeWidget, iNet.ui.app.widget,{
    getData: function () {
      var __ownerData = this.ownerData || {};
      var __data = {};
      __data.taxCode = $input.$taxCode.val();
      if(!iNet.isEmpty(__ownerData.uuid)){
        __data.uuid = __ownerData.uuid;
      }
      return __data;
    },
    setData: function (data) {
      var __data = data || {};
     /* this.ownerData = __data;*/
      $input.$taxCode.val(__data.taxCode);


     /* if(!iNet.isEmpty(__ownerData.uuid)){
       __data.uuid = __ownerData.uuid;
       }*/
      return __data;
    }
  });

  var wgProvince = new iNet.ui.ita.TaxCodeWidget();
  wgProvince.show();

});