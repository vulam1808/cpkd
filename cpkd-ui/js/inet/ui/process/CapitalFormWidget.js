/**
 * Created by HS on 21/09/2016.
 */
// #PACKAGE: capital-form-widget
// #MODULE: CapitalFormWidget

$(function() {
    var resource = {
        common: ita.resources.common,
        validate: ita.resources.validate
    };
    var $input = {
        cashCapital: $('#capital-txt-cashCapital'),
        assetCapital: $('#capital-txt-assetCapital'),
        businessCapital: $('#capital-txt-businessCapital')

    };

    var url = {
        //view: iNet.getUrl('ita/personrepresent/load'),
       // save: iNet.getUrl('ita/personrepresent/save'),
        update_capitalHomeBusiness: iNet.getUrl('ita/homebusiness/update'),
        del: iNet.getUrl('ita/homebusiness/delete')
    };

    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.CapitalFormWidget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'capital-form-widget';

        iNet.ui.ita.CapitalFormWidget.superclass.constructor.call(this);


        var me = this;

        me.__id_homebusiness = "57e247003525e914ace2cb04";
        //me.__id_homebusiness = '';
        var updateCapitalHomeBusiness = function(data){
            var _data = data || '';
            // var _data = {taxCode: _taxcode};
            $.postJSON(url.update_capitalHomeBusiness, _data, function (result) {
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

        $('#capital-location-btn-update').on('click', function(){

            var __data = me.getDataCapital() || {};
            console.log('updateCapital>>', __data);

            updateCapitalHomeBusiness(__data);
        }.createDelegate(this));



    };

    iNet.extend(iNet.ui.ita.CapitalFormWidget, iNet.ui.app.widget,{
        getDataCapital: function () {

            var __data = {};

            __data.idHomeBusiness = this.__id_homebusiness;
            __data.cashCapital = $input.cashCapital.val();
            __data.assetCapital = $input.assetCapital.val();
            __data.businessCapital = $input.businessCapital.val();

            return __data;
        }
    });


});
