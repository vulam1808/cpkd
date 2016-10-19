/**
 * Created by HS on 21/09/2016.
 */
// #PACKAGE: pausebusiness-form-widget
// #MODULE: PauseBusinessFormWidget

$(function() {


    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.PauseBusinessFormWidget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'endbusiness-widget';
        var me = this;

        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };
        this.$form = {
            textbox_dayofPause: $('#'+me.id + ' #pausebusiness-dayofPause'),
            textbox_dateStart: $('#'+me.id + ' #pausebusiness-dateStart'),
            textbox_reason: $('#'+me.id + ' #pausebusiness-reason')
        };



        me.idHomeBusiness = __config.idHomeBusiness;
        me.statusType = __config.statusType;
        me.PauseBusiness = __config.PauseBusiness;



        var loadPauseBusiness = function(){
            me.setData(me.PauseBusiness);
            me.setReadonly();
        }

        loadPauseBusiness();

        iNet.ui.ita.PauseBusinessFormWidget.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.ita.PauseBusinessFormWidget, iNet.ui.app.widget,{
        setReadonly: function(){

            this.$form.textbox_dayofPause.prop('readonly', true);
            this.$form.textbox_dateStart.prop('readonly', true);
            this.$form.textbox_reason.prop('readonly', true);
        },
        removeReadonly: function(){
            this.$form.textbox_dayofPause.prop('readonly', false);
            this.$form.textbox_dateStart.prop('readonly', false);
            this.$form.textbox_reason.prop('readonly', false);

        },

        setData: function (data) {
            var __data = data || {}

            this.$form.textbox_dayofPause.val(__data.dayofPause);
            this.$form.textbox_dateStart.val(__data.dateStart.longToDate());
            this.$form.textbox_reason.val(__data.reason);


        }
    });


});
