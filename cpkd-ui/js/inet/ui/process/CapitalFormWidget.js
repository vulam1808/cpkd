/**
 * Created by HS on 21/09/2016.
 */
// #PACKAGE: capital-form-widget
// #MODULE: CapitalFormWidget

$(function() {


    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.CapitalFormWidget = function (config) {
        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };
        this.$input = {
            cashCapital: $('#capital-txt-cashCapital'),
            assetCapital: $('#capital-txt-assetCapital'),
            businessCapital: $('#capital-txt-businessCapital')

        };

        var url = {
            update_capitalHomeBusiness: iNet.getUrl('ita/capital/update')
        };
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'capital-form-widget';

        this.idHomeBusiness = __config.idHomeBusiness;
        this.statusType = __config.statusType;
        this.HomeBusiness = __config.HomeBusiness;

        iNet.ui.ita.CapitalFormWidget.superclass.constructor.call(this);


        var me = this;


        //me.__id_homebusiness = '';
        me.updateCapitalHomeBusiness = function(){
            var _data = me.getDataCapital() || {};
            console.log('_data>>', _data);
            // var _data = {taxCode: _taxcode};
            $.postJSON(url.update_capitalHomeBusiness, _data, function (result) {
                var __result = result || {};
                console.log('__result>>', __result);
                if (CommonService.isSuccess(__result)) {

                }
                else
                {

                }
            });
        };

        var loadCapitalHomeBusiness = function(){
            me.setDataCapital();
        }

        loadCapitalHomeBusiness();
    };

    iNet.extend(iNet.ui.ita.CapitalFormWidget, iNet.ui.app.widget,{
        setReadonly: function(){

            this.$input.cashCapital.prop('readonly', true);
            this.$input.assetCapital.prop('readonly', true);
            this.$input.businessCapital.prop('readonly', true);
        },
        removeReadonly: function(){

            this.$input.cashCapital.prop('readonly', false);
            this.$input.assetCapital.prop('readonly', false);
            this.$input.businessCapital.prop('readonly', false);
        },
        getDataCapital: function () {

            var __data = {};

            __data.idHomeBusiness = this.idHomeBusiness;
            __data.statusType = this.statusType;

            __data.cashCapital = this.$input.cashCapital.val();
            __data.assetCapital = this.$input.assetCapital.val();
            __data.businessCapital = this.$input.businessCapital.val();

            return __data;
        },
        setDataCapital: function () {

            var __data = this.HomeBusiness || {};
                this.$input.cashCapital.val(__data.cashCapital);
                this.$input.assetCapital.val(__data.assetCapital);
                this.$input.businessCapital.val(__data.businessCapital);
                //this.setDisabled();
                return __data;

        }
    });


});
