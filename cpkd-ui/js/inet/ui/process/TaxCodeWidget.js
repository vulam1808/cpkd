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

    var updateTaxCodeHomeBusiness = function(taxcode){
      var _taxcode = taxcode || '';
      //var _data = {taxCode: _taxcode, idHomeBusiness:''};
      var _data = {taxCode: _taxcode};
      $.postJSON(url.update_taxCodeHomeBusiness, _data, function (result) {
        var __result = result || {};
        if (CommonService.isSuccess(__result)) {
          console.log('Update taxcode success'+taxcode+">>>>",_data);
        }
        else
        {
          console.log('Update taxcode error'+taxcode+">>>>",_data);
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

     // __data.homeBusiness_ID = $input.input_id_homebusiness.val();
      __data.taxCode = $input.$taxCode.getValue();

      return __data;
    }
  });

  var wgProvince = new iNet.ui.ita.TaxCodeWidget();
  wgProvince.show();

});