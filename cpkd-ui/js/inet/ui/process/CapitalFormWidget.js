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
        $cashCapital: $('#capital-txt-cashCapital'),
        $assetCapital: $('#capital-txt-assetCapital'),
        $businessCapital: $('#capital-txt-businessCapital')

    };

    var url = {
        view: iNet.getUrl('ita/personrepresent/load'),
        save: iNet.getUrl('ita/personrepresent/save'),
        update: iNet.getUrl('ita/homebusiness/update'),
        del: iNet.getUrl('ita/personrepresent/delete')
    };

    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.CapitalFormWidget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'capital-form-widget';

        iNet.ui.ita.CapitalFormWidget.superclass.constructor.call(this);


        var me = this;

        $('#capital-location-btn-update').on('click', function(){
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

    iNet.extend(iNet.ui.ita.CapitalFormWidget, iNet.ui.app.widget,{
        getData: function () {
            var __ownerData = this.ownerData || {};
            var __data = {};
            __data.cashCapital = $input.$cashCapital.val();
            __data.assetCapital = $input.$assetCapital.val();
            __data.businessCapital = $input.$businessCapital.val();

            if(!iNet.isEmpty(__ownerData.uuid)){
                __data.uuid = __ownerData.uuid;
            }
            return __data;
        },
        setData: function (data) {
            var __data = data || {};
            /* this.ownerData = __data;*/
            $input.$cashCapital.val(__data.cashCapital);
            $input.$assetCapital.val(__data.assetCapital);
            $input.$businessCapital.val(__data.businessCapital);
            /* if(!iNet.isEmpty(__ownerData.uuid)){
             __data.uuid = __ownerData.uuid;
             }*/
            return __data;
        }
    });

    var wgProvince = new iNet.ui.ita.TaxCodeWidget();
    wgProvince.show();

});
