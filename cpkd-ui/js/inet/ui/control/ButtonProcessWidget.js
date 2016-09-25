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
            load_province: iNet.getUrl('ita/province/load'),
            load_district: iNet.getUrl('ita/district/load'),
            load_ward: iNet.getUrl('ita/ward/load'),
            load_areaBusiness: iNet.getUrl('ita/areabusiness/load'),

            load_enum: iNet.getUrl('ita/enums/load'),

            save_homebusiness: iNet.getUrl('ita/homebusiness/save'),
            save_changebusiness: iNet.getUrl('ita/changebusiness/save'),
            save_endbusiness: iNet.getUrl('ita/endbusiness/save'),
            save_pausebusiness: iNet.getUrl('ita/pausebusiness/save'),
            update_statusHomeBusiness: iNet.getUrl('ita/homebusiness/update'),
            check_name_business: iNet.getUrl('ita/homebusiness/checknamebusiness')
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
        var __config = config || {};
        var self = this;
        var parentPage = null;
//EVENT Button click ==========================================================
        $form.button_back.on('click',function(){

        });
        $form.button_dropdown_additional.on('click',function(){

        });
        $form.button_dropdown_transfer.on('click',function(){

        });
        $form.button_dropdown_workflow.on('click',function(){

        });
        $form.button_process.on('click',function(){

        });
        $form.button_process_numberBusiness.on('click',function(){

        });
        $form.button_process_taxcode.on('click',function(){

        });


        iNet.ui.ita.ButtonProcess.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.ita.ButtonProcess, iNet.ui.app.widget);
});
