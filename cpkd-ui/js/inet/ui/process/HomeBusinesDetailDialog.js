/**
 * Created by HS on 23/09/2016.
 */
// #PACKAGE:homebusiness-detail-dialog
// #MODULE: HomeBusinessDetailDialog
$(function () {
    var url = {
        load_areaBusiness: iNet.getUrl('ita/areabusiness/load')
    }
    var $input = {
        input_address: $('#homebusiness-address'),
        input_province: $('#homebusiness-province'),
        input_district: $('#homebusiness-district'),
        input_ward: $('#homebusiness-ward'),
        input_phone: $('#homebusiness-phone'),
        input_fax: $('#homebusiness-fax'),
        input_email: $('#homebusiness-email'),
        input_website: $('#homebusiness-website'),
        input_areaBusiness: $('#homebusiness-areaBusiness')
    };

    iNet.ns("iNet.ui","iNet.ui.ita");
    iNet.ui.ita.HomeBusinessDetailDialog = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'homebusiness-detail-dialog';
        iNet.ui.ita.HomeBusinessDetailDialog.superclass.constructor.call(this);
        //this.$element = $.getCmp(this.id);
        var me= this;


        var loadinfo = function(){
            var __data = {idh:config.idhomebusines};
            console.log('load>>', __data);

            $.postJSON(url.load_areaBusiness, __data, function (result) {
                var __result = me.loadData(result) || {};
                console.log('show>>', __result);

            });
        }

        loadinfo();
    };

    iNet.extend(iNet.ui.ita.HomeBusinessDetailDialog, iNet.ui.app.widget,{

        loadData: function (data) {
            var __data = data || {};
            /* this.ownerData = __data;*/
            $input.input_areaBusiness.val(__data.nameBusiness);
            $input.input_address.val(__data.address);
            $input.input_province.val(__data.province_ID);
            $input.input_district.val(__data.district_ID);
            $input.input_ward.val(__data.ward_ID);
            $input.input_phone.val(__data.phone);
            $input.input_fax.val(__data.fax);
            $input.input_email.val(__data.email);
            $input.input_website.val(__data.website);

            /* if(!iNet.isEmpty(__ownerData.uuid)){
             __data.uuid = __ownerData.uuid;
             }*/
            return __data;
        }
    });

});

