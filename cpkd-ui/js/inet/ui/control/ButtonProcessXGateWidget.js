// #PACKAGE: button-process-xgate
// #MODULE: ButtonProcessXGateWidget
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
        this.id = 'ita-information-toolbar';
        var self = this;
        var __config = config || {};
        /* me.idHomeBusiness = __config.idHomeBusiness;
         me.statusType= __config.statusType;
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
         console.log("button_process data?>>>", __data);
         confirmDialog.params  = __data;
         //confirmDialog.setContent(String.format(resource.constant.del_content, record.name));
         confirmDialog.show();
         /!*$.postJSON(url.update_statusProcess, __data, function (result) {
         var __result = result || {};
         console.log("__result button process?>>>", __result);
         buttonBack();
         });*!/
         });
         var confirmDialog = me.confirmDialog(
         resource.validate.process_title, me.getNotifyContent(resource.validate.sure_process, ''), function () {
         if (!iNet.isEmpty(confirmDialog.params || {})) {
         confirmDialog.hide();
         $.postJSON(url.update_statusProcess, confirmDialog.params, function (result) {
         var __result = result || {};
         console.log("__result button process?>>>", __result);
         buttonBack();
         }/!*, {
         mask: me.getMask(),
         msg: iNet.validate.process_success
         }*!/);
         }
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
         }*/
        iNet.ui.ita.ButtonProcess.superclass.constructor.call(this);
        var parentPage = null;
        var $taskFrame = iNet.getLayout().window.taskFrame;
        /*$taskFrame.on('typechange', function(type){
         if (type == 'min'){
         informationView.setMenuButton(true);
         } else {
         informationView.setMenuButton(false);
         }
         });*/
        var $taskMenu = iNet.getLayout().window.parent.taskMenu;
        $taskMenu.on('menuchange', function(){
        });
        $taskMenu.on('create', function(){
        });
        var $taskModal = new iNet.ui.modalview();
        $taskModal.on('success', function(){
            this.hide();
            $taskFrame.refresh();
            $taskMenu.refresh("task");
        });
        var informationToolBar = function() {
            this.id = "briefcase-information-toolbar";
            var __taskInfo = $taskFrame.getTaskDataIndex();

            this.$markList = $('[data-id="briefcase-information-mark-list"]');

            this.$backBtn = $('#briefcase-information-back-btn');
            this.$backBtn.on('click', function(){
                self.fireEvent('back');
                if (parentPage != null){
                    parentPage.show();
                    self.hide();
                }
            }.createDelegate(this));

            this.$updateBtn = $('#briefcase-information-update-btn');
            this.$updateBtn.on('click', function(){
                var __taskInfo = $taskFrame.getTaskDataIndex();
                var __taskID = ((__taskInfo || {}).history || {}).taskID || "";

                $taskModal.setTitle($(this).attr('title'));
                $taskModal.setDescription($(this).attr('description'));
                $taskModal.setParams({task: __taskID});
                $taskModal.setUrl(url.update_task);
                $taskModal.show();
            });


            this.$rejectBtn = $('#briefcase-information-reject-btn');
            this.$rejectBtn.on('click', function(){
                var __taskInfo = $taskFrame.getTaskDataIndex();
                var __processUUID = ((__taskInfo || {}).history || {}).processUUID || "";
                var __taskID = ((__taskInfo || {}).history || {}).taskID || '';
                var __graphID  = ((__taskInfo || {}).history || {}).graphID || '';

                $taskModal.setTitle($(this).attr('title'));
                $taskModal.setDescription($(this).attr('description'));
                $taskModal.setParams({process: __processUUID});
                $taskModal.setAdditional(url.additional_upload, {task: __taskID, graph: __graphID});
                $taskModal.setUrl(url.reject_task);
                $taskModal.show();
            });
            var __reject = (((__taskInfo || {}).history || {}).attributes || {}).reject || "0";
            if (__reject == "1"){
                this.$rejectBtn.show();
            } else {
                this.$rejectBtn.hide();
            }

            this.$markBtn = $('#briefcase-information-mark-btn');
            this.$markBtn.on('click', function(){
                var __taskInfo = $taskFrame.getTaskDataIndex();
                var __taskID = ((__taskInfo || {}).history || {}).taskID || "";

                $taskModal.setTitle($(this).attr('title'));
                $taskModal.setDescription($(this).attr('description'));
                $taskModal.setParams({task: __taskID});
                $taskModal.setUrl(url.mark_task);
                $taskModal.show();
            });

            this.$unmarkBtn = $('#briefcase-information-unmark-btn');
            this.$unmarkBtn.on('click', function(){
                var __taskInfo = $taskFrame.getTaskDataIndex();
                var __taskID = ((__taskInfo || {}).history || {}).taskID || "";
                $.postJSON(url.mark_task, {task: __taskID}, function(result){
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)){
                        self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                        $taskFrame.refresh();
                        $taskMenu.refresh("task");
                    } else {
                        self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                    }
                });
            });

            this.$viewProcessBtn = $('#briefcase-information-process-btn');
            this.$viewProcessBtn.on('click', function(){
                self.fireEvent('changeview', {type: 'process'});
            }.createDelegate(this));
            this.$viewAdditionalBtn = $('#briefcase-information-additional-btn');
            this.$viewAdditionalBtn.on('click', function(){
                self.fireEvent('changeview', {type: 'additional'});
            }.createDelegate(this));
            this.$viewIDeskBtn = $('#briefcase-information-idesk-btn');
            this.$viewIDeskBtn.on('click', function(){
                //TODO: View iDesk
                //$taskFrame.changeLayout(iNet.getUrl("idesk/page/global/view-ed-instant"), 'iDesk', idDoc);
                $taskFrame.changeLayout(iNet.getUrl("idesk/page/global/search-ed-instant"), 'iDesk');
                self.fireEvent('changeview', {type: 'idesk'});
            }.createDelegate(this));
            this.$viewTransferBtn = $('#briefcase-information-transfer-btn');
            this.$viewTransferBtn.on('click', function(){
                self.fireEvent('changeview', {type: 'transfer'});
            }.createDelegate(this));
            var __camel = (((__taskInfo || {}).history || {}).attributes || {}).camel || "0";
            if (__camel == "1"){
                this.$viewTransferBtn.show();
            } else {
                this.$viewTransferBtn.hide();
            }
            this.$viewWorkflowBtn = $('#briefcase-information-workflow-btn');
            this.$viewWorkflowBtn.on('click', function(){
                self.fireEvent('changeview', {type: 'workflow'});
            }.createDelegate(this));

        };
        this.setPageBack = function(page, showBackButton){
            parentPage = page;
            if (parentPage != null && showBackButton != false){
                this.$backBtn.show();
            } else {
                this.$backBtn.hide();
            }
        };
    };

    iNet.extend(iNet.ui.ita.ButtonProcess, iNet.ui.app.widget);
});
