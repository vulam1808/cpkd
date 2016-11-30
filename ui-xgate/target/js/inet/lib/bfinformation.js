// #PACKAGE: bfinformation
// #MODULE: BFInformationService
$(function () {
    iNet.ns("iNet.ui.xgate", "iNet.ui.xgate.BfInformation");
    iNet.ui.xgate.BfInformation = function (config) {
        this.id = 'briefcase-information-div';
        var __config = config || {};
        var self = this;
        var parentPage = null;
        
        //get form velocity
        var ctx = {
            context: iNet.context, //get data from widget
            zone: iNet.zone, //get data from widget
            usercode: iNet.usercode //get data from widget
        };

        var resource = {
            task: iNet.resources.task.task,
            BfInformation: iNet.resources.xgate.BfInformation,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            executor_task: iNet.getUrl('firmtask/process/executor'), //task, direction, note
            update_task: iNet.getUrl('firmtask/process/additional'), //task, note --> old service iNet.getUrl('firmtask/process/noteupdate')
            reject_task: iNet.getUrl('firmtask/process/reject'), //process
            mark_task: iNet.getUrl('firmtask/process/workermark'), //task, note
            late_task: iNet.getUrl('firmtask/process/latemark'), //task, reason
            readComment: iNet.getUrl('firmtask/comment/read'), //task
            photo: iNet.getUrl('system/userprofile/photo'), //usercode

            additional_upload: iNet.getUrl('onegate/externaldata/upload'),
            additional_reqload: iNet.getUrl('onegate/externaldata/reqload'),

            new_request: iNet.getUrl('firmtask/process/request'), //form
            submit_request: iNet.getUrl('firmtask/process/submit'),
            update_request: iNet.getUrl('onegate/deptrecord/update'), //request firmtask/process/requpdate
            load_request: iNet.getUrl('onegate/deptrecord/load'), //request firmtask/process/reqload
            history_request: iNet.getUrl('firmtask/process/history'), //request
            downloadFile: iNet.getUrl('onegate/binary/download'),

            task_view: iNet.getUrl('firmtask/process/view'), //task, graph
            record_view: iNet.getUrl('onegate/deptrecord/view') //request
        };

        //MENU VIEW ===========================================
        var $taskMenu = iNet.getLayout().window.parent.taskMenu;
        $taskMenu.on('menuchange', function(){
        });
        $taskMenu.on('create', function(){
        });

        //LIST VIEW ===========================================
        var $taskFrame = iNet.getLayout().window.taskFrame;
        $taskFrame.on('typechange', function(type){
            if (type == 'min'){
                informationView.setMenuButton(true);
            } else {
                informationView.setMenuButton(false);
            }
        });

        //MODAL VIEW ==========================================
        var $taskModal = new iNet.ui.modalview();
        $taskModal.on('success', function(){
            this.hide();
            $taskFrame.refresh();
            $taskMenu.refresh("task");
        });

        //FILE VIEW ===================================================
        var fileView = new iNet.ui.fileview();
        fileView.setPageBack(self);

        //FILE VIEW ===================================================
        var signature = new iNet.ui.signature();
        signature.setPageBack(self);

        //INFORMATION VIEW ===================================================
        var informationLoad = function(){
            informationView.reset();
            var __taskInfo = $taskFrame.getTaskDataIndex();
            var __graphID = ((__taskInfo || {}).history || {}).graphID || "";
            var __taskID = ((__taskInfo || {}).history || {}).taskID || "";

            $.postJSON(url.task_view, {task: __taskID, graph: __graphID}, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)){
                    informationView.setData(__result);

                    informationView.toolbar.$updateBtn.hide();
                    informationView.toolbar.$markBtn.parent().removeClass('hide');
                    informationView.toolbar.$markBtn.parent().find('[data-toggle="dropdown"]').hide();
                    informationView.toolbar.$unmarkBtn.parent().addClass('hide');
                    informationView.toolbar.$unmarkBtn.parent().find('[data-toggle="dropdown"]').hide();
                    informationView.toolbar.$markList.html('');

                    var __request = __result.request || {};
                    var __history = __result.history || {};

                    var __htmlMark = '';
                    __htmlMark+='<li style="padding: 5px; border-bottom: {5}px solid #DDD; display: flex;">';
                    __htmlMark+='<span style="width: 30px;"><img src="{0}?usercode={1}" style="height: 30px; width: 30px; border-radius: 15px;"></span>';
                    __htmlMark+='<span class="hide"> {2}<i class="icon-calendar"></i></span>';
                    __htmlMark+='<span style="padding-left: 5px;">';
                    __htmlMark+='<div>{3}</div>';
                    __htmlMark+='<div><i style="font-size: 16px;" class="icon-info-sign"></i> {2} - {4}</div>';
                    __htmlMark+='</span>';
                    __htmlMark+='<span class="hide"> <i title="[{2}] {4}" style="font-size: 16px;" class="icon-info-sign"></i></span>';
                    __htmlMark+='</li>';

                    var __workers = __history.workers || [];
                    $.each(__workers, function(i, worker){
                        if (worker.senderCode == ctx.usercode){
                            informationView.toolbar.$markBtn.parent().addClass('hide');
                            informationView.toolbar.$unmarkBtn.parent().removeClass('hide');
                        }
                        informationView.toolbar.$markList.append(
                            String.format(
                                __htmlMark,
                                url.photo,
                                worker.senderCode,
                                (worker.created || 0).longToDate(),
                                worker.sender,
                                worker.note,
                                (i == (__workers.length -1)) ? 0 : 1
                            )
                        );
                    });

                    if (__workers.length > 0) {
                        informationView.toolbar.$markBtn.parent().find('[data-toggle="dropdown"]').show();
                        informationView.toolbar.$unmarkBtn.parent().find('[data-toggle="dropdown"]').show();
                    }

                    var __subjectData = {subject: __request.subject || '', showAttachmentIcon: false, showCommentIcon: false, showDetailsIcon: false};
                    var __senderData = {name: __history.senderName, date: ' (' + $.timeago(__history.created || 0) + ')', showDetailsIcon: false};
                    informationView.setHeader({subject: __subjectData, sender: __senderData, object: __result});
                    informationView.setSubmitContent(__result.content);

                    var __commentData = (__result.request || {}).comments || [];
                    var __attBriefData = (__result.request || {}).attachments || [];
                    var __attExternalData = (__result.request || {}).externalData || [];

                    $.postJSON(url.record_view, {"request": __request.uuid}, function (result) {
                        var __result = result || {};
                        var __docRecord = (__result.record || {}).documents || [];

                        informationView.setFooter({
                            comments: __commentData,
                            attBriefs: __attBriefData,
                            attExternalData: __attExternalData,
                            docRecord: __docRecord
                        });
                    },{
                        mask: self.getMask(),
                        msg: iNet.resources.ajaxLoading.loading
                    });

                    $.postJSON(url.additional_reqload, {"packageID": (__result.request || {}).additionalID}, function (result) {
                        if (!iNet.isEmpty((result || {}).uuid || "")){
                            informationView.toolbar.$viewProcessBtn.hide();
                            informationView.toolbar.$viewTransferBtn.hide();
                        }
                    });
                }
            },{
                mask: self.getMask(),
                msg: iNet.resources.ajaxLoading.processing
            });
        };
        var informationToolBar = function() {
            this.id = "briefcase-information-toolbar";
            this.intComponent = function(){
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
        };
        var informationView = new iNet.ui.itemview({
            id: "briefcase-information",
            resource: resource,
            url: url,
            toolbar: informationToolBar,
            ajaxMaskId: 'ajax-mask',
            headerDetails: {
                subject: "briefcase-information-subject-details",
                sender: "briefcase-information-sender-details"
            }
        });
        informationView.on('menuclick', function(){
            $taskFrame.setListTaskType('menu');
        });        
        informationView.on('fileclick', function(data){
            var __data = data || {};
            if (!iNet.isEmpty(__data.uuid)) {
                if (__data.action == "viewfile") {
                    fileView.viewFile(__data.uuid);
                    self.hide();
                }

                if (__data.action == "downfile") {
                    window.open(url.downloadFile + '?binary=' + __data.uuid, '_blank');
                    /*$.postJSON(url.downloadFile, {binary: __data.uuid}, function(result){
                     console.log(">>downloadFile>>", result);
                     });*/
                }

                if (__data.action == "signfile") {
                    signature.show();
                    signature.setData(__data);
                    self.hide();
                }

                if (__data.action == "verifyfile") {
                    signature.viewVerify(__data.uuid);
                }
            }
        });
        informationView.on('viewcomment', function(){
            var __taskInfo = $taskFrame.getTaskDataIndex();
            var __graphID = ((__taskInfo || {}).history || {}).graphID || "";
            var __taskID = ((__taskInfo || {}).history || {}).taskID || "";

            $.postJSON(url.readComment, {task: __taskID, graph: __graphID}, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)){
                    console.log("readComment>>", __result);
                }
            },{
                mask: self.getMask(),
                msg: iNet.resources.ajaxLoading.processing
            });
        });

        //PUBLISH FUNCTION ==========================================
        this.load = function(){
            informationLoad();
        };
        this.setPageBack = function(page, showBackButton){
            parentPage = page;
            if (parentPage != null && showBackButton != false){
                informationView.toolbar.$backBtn.show();
            } else {
                informationView.toolbar.$backBtn.hide();
            }
        };
        this.setType = function(type){
            //type: full, min
            $('#'+ self.id + ' [data-id="item-view-control"].item-view').removeClass('full').addClass(type);
            //self.setMenuButton(type);
        };

        iNet.ui.xgate.BfInformation.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.xgate.BfInformation, iNet.ui.app.widget);
});
