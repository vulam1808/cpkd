/**
 * Created by HS on 21/09/2016.
 */
// #PACKAGE: endbusiness-form-widget
// #MODULE: EndBusinessFormWidget

$(function() {


    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.EndBusinessFormWidget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'endbusiness-widget';

        this.idHomeBusiness = __config.idHomeBusiness;
        this.statusType = __config.statusType;
        this.EndBusiness = __config.EndBusiness;
        var me = this;
        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };
        this.$form = {
            textbox_DateEnd: $('#'+me.id + ' #endbusiness-dateEnd'),
            textbox_reason: $('#'+me.id + ' #endbusiness-reason')
        };



        iNet.ui.ita.EndBusinessFormWidget.superclass.constructor.call(this);

        var loadEndBusiness = function(){
            me.setData(me.EndBusiness);
            me.setReadonly();
        }

        loadEndBusiness();
    };

    iNet.extend(iNet.ui.ita.EndBusinessFormWidget, iNet.ui.app.widget,{
        setReadonly: function(){

            this.$form.textbox_DateEnd.prop('readonly', true);
            this.$form.textbox_reason.prop('readonly', true);
        },
        removeReadonly: function(){
            this.$form.textbox_DateEnd.prop('readonly', false);
            this.$form.textbox_reason.prop('readonly', false);

        },

        setData: function (data) {
            var __data = data || {}
            this.$form.textbox_DateEnd.val(__data.dateEnd.longToDate());
            this.$form.textbox_reason.val(__data.reason);


        }
    });


});
