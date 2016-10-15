// #PACKAGE: button-process
// #MODULE: ButtonProcessWidget
$(function () {

    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.ButtonProcess = function (config) {
        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };
        var url = {
            update_statusProcess: iNet.getUrl('ita/businessprocess/updatestatus')

        };
        var $form = {
            //input_id_homebusiness:$('#id-homebusiness'),

            button_back: $('#action-process-back-btn'),
            div_dropdown: $('#action-dropdown'),
            button_dropdown_additional: $('#action-dropdown-additional-btn'),
            button_dropdown_transfer: $('#action-dropdown-transfer-btn'),
            button_dropdown_workflow: $('#action-dropdown-workflow-btn'),
            button_process: $('#action-process-btn'),
            button_process_numberBusiness: $('#action-process-numberBusiness-btn'),
            button_process_taxcode: $('#action-process-taxcode-btn')
        };
        this.id = 'business-process-toolbar';
        var me = this;
        var __config = config || {};
         me.idHomeBusiness = __config.idHomeBusiness;
            me.statusProcess= __config.statusProcess;
             me.parent_ID=__config.parent_ID;
            me.act = __config.act;
        var self = this;
        var parentPage = null;
//EVENT Button click ==========================================================
        $form.button_back.on('click',function(){
            buttonBack();

        }.createDelegate(this));

        var buttonBack = function(){
            console.log("Show ACT>>>", me.act);
            var __url = iNet.getUrl('cpkd/page/index')+'#menu-process-business';
            iNet.getLayout().window.location.href = __url;
            iNet.getLayout().parentParams={act: me.act};
        };
        $form.button_dropdown_additional.on('click',function(){

        });
        $form.button_dropdown_transfer.on('click',function(){

        });
        $form.button_dropdown_workflow.on('click',function(){

        });
        $form.button_process.on('click',function(){
            var __data = {
                idHomeBusiness: me.idHomeBusiness,
                statusProcess:me.act,
                statusType:me.statusType,
                parent_ID:me.parent_ID};
            $.postJSON(url.update_statusProcess, __data, function (result) {
                var __result = result || {};
                console.log("__result button process?>>>", __result);
                buttonBack();
            });
        });
        $form.button_process_numberBusiness.on('click',function(){

        });
        $form.button_process_taxcode.on('click',function(){

        });

        this.disabledButtonProcess = function()
        {
            $form.button_process.addClass('disabled');
        }
        this.enableButtonProcess = function()
        {
            $form.button_process.removeClass('disabled');
        }
        iNet.ui.ita.ButtonProcess.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.ita.ButtonProcess, iNet.ui.app.widget);
});
