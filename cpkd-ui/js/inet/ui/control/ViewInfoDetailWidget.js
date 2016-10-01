/**
 * Created by HS on 21/09/2016.
 */
// #PACKAGE: view-info-detail
// #MODULE: ViewInfoDetailWidget

$(function() {


    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.ViewInfoDetailWidget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration

        this.id = __config.id || 'view-info-div';
        this.idInterface = 'view-info-detail';
        iNet.ui.ita.ViewInfoDetailWidget.superclass.constructor.call(this);
        var me = this;

        var $itemDetail = $.getCmp(me.id);
        var $interface = $.getCmp(me.idInterface);
        if (iNet.isEmpty($itemDetail.html().replace(/ /gi, "").replace(/\n/gi, ""))){
            $itemDetail.html('').append($interface.html());
        }

        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };
        me.$form = {
            input_name: $('#' + me.id + ' [data-id="homebusiness-name"]'),
            input_address: $('#' + me.id + ' [data-id="homebusiness-address"]'),
            input_province: $('#' + me.id + ' [data-id="homebusiness-province"]'),
            idInterface:$('#view-info-detail')
        };

        var url = {
            update_capitalHomeBusiness: iNet.getUrl('ita/capital/update')
        };
        me.idHomeBusiness = __config.idHomeBusiness;
        me.statusType = __config.statusType;
        me.HomeBusiness = __config.HomeBusiness;
        var loadInfoDetail = function(){
            me.setInfo(me.HomeBusiness);


        };
        loadInfoDetail();


    };

    iNet.extend(iNet.ui.ita.ViewInfoDetailWidget, iNet.Component,{
        setInfo : function (data) {

            var __data = data || {};

            this.$form.input_name.val(__data.nameBusiness);
            this.$form.input_address.val(__data.address);
            this.$form.input_province.val(__data.province_ID);


            return __data;
        }
    });


});
