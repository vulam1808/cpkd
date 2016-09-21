// #PACKAGE: taxcode-widget
// #MODULE: TaxCodeWidget

$(function() {
  var resource = {
    common: ita.resources.common,
    validate: ita.resources.validate
  };
  var $input = {
    taxCode: $('#homebusiness-txt-taxCode')

  };

  var url = {
    view: iNet.getUrl('ita/personrepresent/load'),
    save: iNet.getUrl('ita/personrepresent/save'),
    update_taxCodeHomeBusiness: iNet.getUrl('ita/homebusiness/update'),
    del: iNet.getUrl('ita/personrepresent/delete')
  };

  iNet.ns("iNet.ui", "iNet.ui.ita");
  iNet.ui.ita.TaxCodeWidget = function (config) {
    var __config = config || {};
    iNet.apply(this, __config);// apply configuration
    this.id = this.id || 'taxcode-widget';

    iNet.ui.ita.TaxCodeWidget.superclass.constructor.call(this);


    var me = this;
   me.__id_homebusiness = "57e247003525e914ace2cb04";
    //me.__id_homebusiness = '';
    var updateTaxCodeHomeBusiness = function(data){
      var _data = data || '';
     // var _data = {taxCode: _taxcode};
      $.postJSON(url.update_taxCodeHomeBusiness, _data, function (result) {
        var __result = result || {};
        if (CommonService.isSuccess(__result)) {
          //console.log('Update Taxcode success'+data+">>>>",_data);
        }
        else
        {
          //console.log('Update Taxcode error'+data+">>>>",_data);
        }
      });
    }

    $('#taxcode-location-btn-update').on('click', function(){

      var __data = me.getDataTaxCode() || {};
      console.log('updateTaxCode>>', __data);

      updateTaxCodeHomeBusiness(__data);
    }.createDelegate(this));



  };

  iNet.extend(iNet.ui.ita.TaxCodeWidget, iNet.ui.app.widget,{
    getDataTaxCode: function () {

      var __data = {};

      __data.idHomeBusiness = this.__id_homebusiness;
      __data.taxCode = $input.taxCode.val();

      return __data;
    }
  });

  var wgProvince = new iNet.ui.ita.TaxCodeWidget();
  wgProvince.show();

});