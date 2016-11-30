// #PACKAGE: itask-ui-t-briefcase-service
// #MODULE: TBriefcaseService
$(function () {
    iNet.ns("iNet.ui.task", "iNet.ui.task.TBriefcase");
    iNet.ui.task.TBriefcase = function (config) {
        this.id = 'briefcase-div';
        var self = this;
        var selfData = {
            itemsSelected: []
        };
        var __config = config || {};
        //get form velocity
        var ctx = {
            isBack: false,
            briefcaseStatus: (typeof briefcaseStatus == "undefined") ? '' : briefcaseStatus, //get data from page
            recordID: (typeof recordID == "undefined") ? '' : recordID, //get data from page or widget
            keyword: (typeof keyword == 'undefined') ? '' : keyword,
            pageParent: (typeof pageParent == 'undefined') ? '' : pageParent,
            pageUrl: (typeof pageUrl == 'undefined') ? '' : pageUrl,
            context: iNet.context, //get data from widget
            zone: iNet.zone //get data from widget
        };

        if(!iNet.isEmpty((iNet.getLayout() || {}).parentParams || {})){
            iNet.apply(__config, (iNet.getLayout() || {}).parentParams || {});
            iNet.getLayout().parentParams = {};
        }


        if (!iNet.isEmpty(__config)) {
            ctx.recordID = __config.recordID;
            ctx.briefcaseStatus = __config.briefcaseStatus;
            ctx.keyword = __config.keyword;
            ctx.pageParent = __config.pageParent;
            ctx.pageUrl = __config.pageUrl;
            ctx.isBack = true;
        }

        if (!iNet.isEmpty(ctx.pageParent)
            || !iNet.isEmpty(ctx.pageUrl)
            || !iNet.isEmpty(ctx.recordID)
        )
            ctx.isBack = true;

        console.log(">>ctx>>", ctx);

        var resource = {
            completed: iNet.resources.receiver.completed,
            processor: iNet.resources.receiver.processor,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            task_search: iNet.getUrl('onegate/deptrecord/search'), //type=normal&status=INPROCESS, warnHour, keyword, serial, receipt

            update_request: iNet.getUrl('onegate/deptrecord/update'), //form firmtask/process/requpdate

            get_request_view: iNet.getUrl('onegate/deptrecord/load'), //request firmtask/process/reqload
            get_record_view: iNet.getUrl('onegate/deptrecord/view'), //request
            get_request_history: iNet.getUrl('firmtask/process/history'), //request

            submit_result: iNet.getUrl('onegate/resultupload'),

            signverify: iNet.getUrl('onegate/externaldata/signverify'), //fileId

            readComment: iNet.getUrl('firmtask/comment/read'), //task

            downloadFile: iNet.getUrl('onegate/binary/download'),
            avatarUser: iNet.getUrl('system/userprofile/photo'),

            loadGraphs: iNet.getUrl('onegate/deptgraphs/load'),

            generator: iNet.getUrl('onegate/excel/generator'),//type=CheckList
            chkstatus: iNet.getUrl('report/file/chkstatus'),//reportID
            download: iNet.getUrl('report/file/download')//reportID
        };

        //LEFT MENU ==============================================
        var $taskMenu = iNet.getLayout().taskMenu;
        $taskMenu.on('menuchange', function(){
        });
        $taskMenu.on('create', function(){
            createRequest();
        });

        //REQUEST TASK ===========================================
        var wgRequest = null;
        var createRequest = function () {
            if (wgRequest == null){
                wgRequest = new iNet.ui.task.TRequest();
            }

            wgRequest.on('finish', function(data){
                self.show();
                wgRequest.hide();
                if (!iNet.isEmpty(data)){
                    refresh();
                }
            });
            wgRequest.setData({});
            wgRequest.show();
            self.hide();
        };

        //LIST VIEW ===========================================
        var checkStatus = function(reportID){
            $.postJSON(url.chkstatus, {reportID: reportID}, function(result){
                var __resultChkstatus = result || 0;
                if(__resultChkstatus == 2){
                    window.location.href = url.download + "?reportID=" + reportID;
                } else if (__resultChkstatus == 1){
                    setTimeout(function(){
                        checkStatus(reportID);
                    }, 2000);
                }
            },{
                mask: self.getMask(),
                msg: iNet.resources.ajaxLoading.loading
            });
        };
        var setDataView = function(type){
            itemView.hide();
            workflowView.hide();
            resultView.hide();

            if (type == "item"){
                itemView.show();
                itemLoad();
            }

            if (type == "workflow"){
                workflowView.show();
                workflowLoad();
            }

            if (type == "result"){
                resultView.show();
                resultLoad();
            }
        };
        var fnListSearch = function(){
            var __params = listView.getParams() || {};

            __params.keyword = listView.basicSearch.$keyword.val();
            __params.receipt = listView.advanceSearch.$receipt.val();
            __params.serial = listView.advanceSearch.$serial.val();
            var __warnHour = listView.advanceSearch.$warnHour.val() || 0;
            if (__warnHour > 0){
                __params.type = "overdue";
                __params.warnHour = __warnHour;
            } else {
                delete __params.warnHour;
                delete __params.type;
            }

            listView.setParams(__params);
            listView.load();
        };
        var basicSearch = function() {
            this.id = "briefcase-list-basic-search";
            this.intComponent = function(){
                var $bs = this;
                var $expandBtn = $('#briefcase-list-basic-search-expand-btn');
                var $searchBtn = $('#briefcase-list-basic-search-search-btn');
                this.$keyword = $('#briefcase-list-basic-search-txt-keyword');
                this.$keyword.val(ctx.keyword || "");

                this.$keyword.on('keyup', function(e){
                    if (e.which == 13){
                        listView.advanceSearch.hide();
                        fnListSearch();
                    }
                });

                $searchBtn.on('click', function(){
                    listView.advanceSearch.hide();
                    fnListSearch();
                });

                $expandBtn.on('click', function(){
                    listView.advanceSearch.show();
                });
            };
        };
        var advanceSearch = function() {
            this.id = "briefcase-list-advance-search";
            this.intComponent = function(){
                var $as = this;
                var $searchBtn = $('#briefcase-list-advance-search-search-btn');
                var $closeBtn = $('#briefcase-list-advance-search-close-btn');
                this.$receipt = $('#briefcase-list-advance-search-receipt-txt');
                this.$serial = $('#briefcase-list-advance-search-serial-txt');
                this.$warnHour = $('#briefcase-list-advance-search-warnHour-txt');

                $searchBtn.on('click', function(){
                    listView.advanceSearch.hide();
                    var __params = listView.getParams() || {};
                    fnListSearch();
                });
                $closeBtn.on('click', function(){
                    listView.advanceSearch.hide();
                });
            };
        };
        var pullLeft = function() {
            this.id = "briefcase-list-pull-left";
            this.intComponent = function(){
            };
        };
        var toolbar = function() {
            this.id = "briefcase-list-toolbar";
            this.intComponent = function(){
                this.$excelBtn = $('#briefcase-list-excel-btn');
                this.$excelBtn.on('click', function(){
                    var __params = listView.getParams() || {};
                    __params.records = "";

                    $(selfData.itemsSelected).each(function(i, item){
                        __params.records += item.key + ",";
                    });

                    $.postJSON(url.loadGraphs, {}, function(data){
                        var __data = data || [];
                        console.log(">>graphs>>", __data, __data.toString());
                        __params.graphs = __data.toString();
                        __params.type = "CheckList";
                        $.postJSON(url.generator, __params, function(result){
                            var __result = result || {};
                            if (CommonService.isSuccess(__result)){
                                setTimeout(function(){
                                    checkStatus(__result.uuid);
                                }, 2000);
                            } else {
                                self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                            }
                        },{
                            mask: self.getMask(),
                            msg: iNet.resources.ajaxLoading.loading
                        });
                    });
                }.createDelegate(this));
            };
        };
        var listView = new iNet.ui.listview({
            id: "briefcase-list",
            uiItemId: "briefcase-list-item-ui",
            url: url.task_search,
            toolbar: toolbar,
            basicSearch: basicSearch,
            advanceSearch: advanceSearch,
            pullLeft: pullLeft,
            params: {
                pageSize: 20,
                pageNumber: 0,
                "status": ctx.briefcaseStatus,
                keyword: ctx.keyword,
                recordID: ctx.recordID
            },
            convertData: function(data){
                var __data = data || {};
                listView.setTotal(__data.total);
                $.each(__data.items || [], function(i, item){
                    listView.addItem(item);
                });
            }
        });
        listView.on('indexchange', function(data){
            if (!iNet.isEmpty(data.uuid) && ctx.briefcaseStatus == "PUBLISHED"){
                setDataView("result");
            } else {
                setDataView("item");
            }
        });
        listView.on('typechange', function(type){
            if (type == "max") {
                itemView.setType('min');
                workflowView.setType('min');
                resultView.setType('min');
            } else {
                itemView.setType('full');
                workflowView.setType('full');
                resultView.setType('full');
            }
        });
        listView.on('itemselected', function(datas){
            selfData.itemsSelected = datas || [];
            console.log(">>selfData.itemsSelected>>", selfData.itemsSelected);
            if ((datas || []).length > 0){
                //listView.toolbar.$sendBtn.show();
            } else {
                //listView.toolbar.$sendBtn.hide();
            }
        });

        //FILE VIEW ===================================================
        var fileView = new iNet.ui.fileview();
        fileView.setPageBack(self);

        //FILE VIEW ===================================================
        var signature = new iNet.ui.signature();
        signature.setPageBack(self);

        //ITEM VIEW ==========================================
        var itemLoad = function(){
            itemView.reset();
            itemView.toolbar.$updateBtn.hide();
            var data = listView.getData() || {};
            if (!iNet.isEmpty(data.uuid)){
                $.postJSON(url.get_request_view, {"request": data.requestID}, function (result) {
                    var __result = result || {};

                    itemView.setData(__result);
                    console.log("view_request result >>", __result);
                    if ((__result.request || {}).status == "UPDATE") {
                        itemView.toolbar.$updateBtn.show();
                    }


                    var __subjectData = {subject: data.subject || '', showAttachmentIcon: false, showCommentIcon: false, showDetailsIcon: false};
                    var __senderData = {name: data.creatorName, date: ' (' + $.timeago(data.created) + ')', showDetailsIcon: false};
                    itemView.setHeader({subject: __subjectData, sender: __senderData, object: __result});
                    itemView.setSubmitContent(__result.content);

                    var __commentData = (__result.request || {}).comments || [];
                    var __attBriefData = (__result.request || {}).attachments || [];
                    var __attExternalData = (__result.request || {}).externalData || [];

                    $.postJSON(url.get_record_view, {"request": data.requestID}, function (result) {
                        var __result = result || {};
                        var __docRecord = (__result.record || {}).documents || [];

                        itemView.setFooter({
                            comments: __commentData,
                            attBriefs: __attBriefData,
                            attExternalData: __attExternalData,
                            docRecord: __docRecord
                        });
                    },{
                        mask: self.getMask(),
                        msg: iNet.resources.ajaxLoading.loading
                    });
                },{
                    mask: self.getMask(),
                    msg: iNet.resources.ajaxLoading.loading
                });
            }
        };
        var submitRequest = function(url){
            var __messageValidate = !iNet.isFunction(((iNet || {}).requestData || {}).messageValidate) ? "" : ((iNet || {}).requestData || {}).messageValidate();
            console.log(">> submitRequest validate >>", {messageValidate: __messageValidate} );

            var __url = url || "";
            if (iNet.isEmpty(__messageValidate) && !iNet.isEmpty(__url)) {
                itemView.submit(__url);
            } else {
                self.notifyError(resource.constant.warning_title, __messageValidate);
            }
        };
        var itemToolBar = function() {
            this.id = "briefcase-view-toolbar";
            this.intComponent = function(){
                this.$workflowBtn = $('#briefcase-view-workflow-btn');
                this.$resultBtn = $('#briefcase-view-result-btn');
                this.$printBtn = $('#briefcase-view-print-btn');
                this.$updateBtn = $('#briefcase-view-update-btn');
                this.$backBtn = $('#briefcase-view-back-btn');

                this.$workflowBtn.on('click', function(){
                    setDataView('workflow');
                });

                this.$resultBtn.on('click', function(){
                    setDataView('result');
                });

                this.$updateBtn.on('click', function(){
                    var __listData = listView.getData() || {};
                    itemView.resetBodyHidden();
                    itemView.addBodyHidden('request', __listData.requestID);
                    submitRequest(url.update_request);
                });

                this.$printBtn.on('click', function(){
                    var __requestID = (listView.getData() || {}).requestID || "";
                    if (!iNet.isEmpty(__requestID)){
                        window.open(iNet.getUrl(CommonService.pageRequest.formNo03) + '?task=' + __requestID, '_blank');
                    }
                });

                this.$backBtn.on('click', function(){
                    if (!iNet.isEmpty(ctx.pageUrl)){
                        var __url = iNet.getUrl(CommonService.pageRequest.xgate) + CommonService.pageRequest.hashtag[ctx.pageUrl];
                        iNet.getLayout().window.location.href = __url
                    } else if (!iNet.isEmpty(ctx.pageParent)){
                        self.hide();
                        ctx.pageParent.show();
                    }
                    self.fireEvent('back');
                }.createDelegate(this));
            };
        };
        var itemView = new iNet.ui.itemview({
            id: "briefcase-view",
            resource: resource,
            url: url,
            toolbar: itemToolBar,
            ajaxMaskId: 'ajax-mask',
            headerDetails: {
                subject: "briefcase-view-subject-details",
                sender: "briefcase-view-sender-details"
            }
        });
        itemView.on('submitted', function(data){
            var __data = data || {};
            if (__data.type == "error"){
                self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __data.errors || []));
            } else {
                self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                if (ctx.isBack){
                    itemView.$backBtn.trigger('click');
                } else {
                    refresh();
                }
            }
        });
        itemView.on('headerchange', function(data){
            console.log(">>headerchange>>", data);
        });
        itemView.on('menuclick', function(){
            listView.setType('menu');
        });
        itemView.on('fileclick', function(data){
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

                if (__data.action == "verifyfile") {
                    signature.viewVerify(__data.uuid);
                }
            }
        });
        itemView.on('viewcomment', function(){
            var __requestID = ((itemView.getData() || {}).request || {}).uuid || "";

            $.postJSON(url.readComment, {task: __requestID, graph: __graphID}, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)){
                    console.log("readComment>>", __result);
                }
            },{
                mask: self.getMask(),
                msg: iNet.resources.ajaxLoading.processing
            });
        });

        //WORKFLOW VIEW ===================================================
        var workflowLoad = function(){
            workflowView.reset();
            var __graphID = (listView.getData() || {}).graphID || "";
            var __requestID = (listView.getData() || {}).requestID || "";

            if (iNet.isEmpty(__graphID)|| iNet.isEmpty(__requestID)){
                return;
            }

            var __graphData = {
                uuid: __graphID,
                zone: ctx.zone,
                context: ctx.context,
                version: "VIEW"
            };
            var __historyData = [];

            $.postJSON(url.get_request_history, {request: __requestID}, function(result){
                var __result = result || {};
                if(CommonService.isSuccess(__result)){
                    $.each(__result.items || [], function(i, item){
                        var __history = {};

                        var __nodeColor = "orange";
                        var __statusColor = "orange";
                        var __taskStatus = resource.processor.infoTaskCompleted;
                        var __taskAlter = resource.processor.taskAlterInprocess;
                        var __taskTime = resource.processor.infoTaskTimeNoLimit;

                        if (item.completedTime == 0) {
                            __nodeColor = "blue";
                            __statusColor = "blue";
                            __taskStatus = resource.processor.infoTaskProcessing;
                        }

                        var __localTime = item.completedTime || new Date().getTime();
                        console.log(">>get_request_history>>", __localTime, item.expiredTask, __localTime > item.expiredTask);
                        if (__localTime > item.expiredTask){
                            __taskAlter = resource.processor.taskAlterOverdue;
                        }

                        if (item.timeProcess > 0) {
                            __taskTime = item.timeProcess + ' ';
                            if (item.timeUnit == 0) {
                                __taskTime += resource.processor.infoTaskTimeMinutes;
                            } else if (item.timeUnit == 1) {
                                __taskTime += resource.processor.infoTaskTimeHours;
                            } else {
                                __taskTime += resource.processor.infoTaskTimeDay;
                            }
                        }

                        __history = iNet.apply(__history, item);
                        __history.nodeColor = __nodeColor;
                        __history.statusColor = __statusColor;
                        __history.nodeHtmlContent = '';
                        __history.nodeHtmlContent+='<b>+ '+resource.processor.infoTo+'</b>';
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>'+resource.processor.infoToUser+': </b>' + item.senderName;
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>'+resource.processor.infoToDate+': </b>' + new Date(item.created).format("H:i d/m/Y");
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>+ '+resource.processor.infoProcess+'</b>';
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>'+resource.processor.infoProcessUser+': </b>' + (item.processorName || "");
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>'+resource.processor.infoProcessDate+': </b>';
                        __history.nodeHtmlContent+=((item.completedTime > 0) ? new Date(item.completedTime).format("H:i d/m/Y") : '');
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>+ '+resource.processor.infoTask+'</b>';
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>'+resource.processor.infoTaskStatus+': </b>';
                        __history.nodeHtmlContent+=__taskStatus;
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>'+resource.processor.infoTaskTime+': </b>';
                        __history.nodeHtmlContent+=__taskTime;
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>'+resource.processor.infoTaskAlter+': </b>';
                        __history.nodeHtmlContent+=__taskAlter;
                        __history.nodeTitle = '';
                        __history.nodeName = item.taskName;

                        __historyData.push(__history);
                    });
                }

                console.log(">>workflowView.dataContent>>", workflowView.dataContent);
                workflowView.dataContent.$wfDesign.loadGraph(__graphData, __historyData);
                workflowView.dataContent.$wfDesign.show();
                workflowView.setDataContent("view");
            });
        };
        var workflowToolBar = function() {
            this.id = "briefcase-workflow-toolbar";
            this.intComponent = function(){
                this.$briefcaseBtn = $('#briefcase-workflow-briefcase-btn');
                this.$resultBtn = $('#briefcase-workflow-result-btn');
                this.$printBtn = $('#briefcase-workflow-print-btn');
                this.$backBtn = $('#briefcase-workflow-back-btn');

                this.$briefcaseBtn.on('click', function(){
                    setDataView("item");
                });

                this.$resultBtn.on('click', function(){
                    setDataView("result");
                });

                this.$printBtn.on('click', function(){
                    var __requestID = (listView.getData() || {}).requestID || "";
                    if (!iNet.isEmpty(__requestID)){
                        window.open(iNet.getUrl(CommonService.pageRequest.formNo03) + '?task=' + __requestID, '_blank');
                    }
                });

                this.$backBtn.on('click', function(){
                    self.fireEvent('back');
                }.createDelegate(this));
            };
        };
        var workflowDataContent = function() {
            this.id = "briefcase-workflow-data-content";
            this.intComponent = function(){
                this.$wfDesign = new iNet.ui.workflow.Workflow({id: "briefcase-workflow-data-content-view", context: ctx.context});
            };
        };
        var workflowView = new iNet.ui.itemview({
            id: "briefcase-workflow",
            resource: resource,
            url: url,
            toolbar: workflowToolBar,
            dataContent: workflowDataContent,
            ajaxMaskId: 'ajax-mask',
            headerDetails: {
                subject: "briefcase-workflow-subject-details",
                sender: "briefcase-workflow-sender-details"
            }
        });
        workflowView.on('menuclick', function(){
            listView.setType('menu');
        });

        //RESULT VIEW ===================================================
        var resultLoad = function(){
            var data = listView.getData() || {};
            if (data.replyFor){
                resultView.formContent.$reply.show();
                //resultView.formContent.$organ.text(data.organName || "");
                resultView.formContent.$organ.text('');
            } else {
                resultView.formContent.$reply.hide();
                resultView.formContent.$organ.text('');
            }

            resultView.formContent.$notes.val('');
            resultView.formContent.$listAttachment.html('');
            var $oldAttachment = resultView.formContent.$oldAttachment.find('#briefcase-result-form-attachment-list-old');
            $oldAttachment.html('');

            if ((data.attachments || []).length > 0){
                resultView.formContent.$oldAttachment.show();
                var __brief = '';
                $(data.attachments || []).each(function(i, attachment){
                    var $itemId = (attachment.contentID || attachment.gridfsUUID) || "";
                    var $itemFileName = (attachment.file || attachment.filename) || "";
                    var $itemFileName = (attachment.file || attachment.filename) || "";
                    var __briefIndex = (attachment.brief || "") + ' - ' + new Date(attachment.created).format("H:i d/m/Y");
                    if (__brief != __briefIndex){
                        $oldAttachment.append('<div style="padding: 5px;"><div style="border: 1px solid #DDD;border-radius:10px;padding: 5px;background-color: #B98F43;color: #FFF;">'+__briefIndex+'</div></div>');
                        __brief = __briefIndex;
                    }
                    if (!iNet.isEmpty($itemId)){
                        $oldAttachment.append('<div style="padding: 5px;padding-left:30px;"><a style="padding: 5px;" href="'+url.downloadFile+'?role=receiver&binary='+$itemId+'">'+(i+1)+'. <i class="'+iNet.FileFormat.getFileIcon($itemFileName)+'"></i> ' + $itemFileName + ' - ' + iNet.FileFormat.getSize(attachment.size || 0) + ' <i class="icon-download"></i></a></div>');
                    }
                });

            } else {
                resultView.formContent.$oldAttachment.hide();
            }
            resultView.setFormContent("view");
        };
        var resultToolBar = function() {
            this.id = "briefcase-result-toolbar";
            this.intComponent = function(){
                this.$briefcaseBtn = $('#briefcase-result-briefcase-btn');
                this.$workflowBtn = $('#briefcase-result-workflow-btn');
                this.$printBtn = $('#briefcase-result-print-btn');
                this.$submitBtn = $('#briefcase-result-submit-btn');
                this.$backBtn = $('#briefcase-result-back-btn');

                this.$briefcaseBtn.on('click', function(){
                    setDataView("item");
                });

                this.$workflowBtn.on('click', function(){
                    setDataView("workflow");
                });

                this.$printBtn.on('click', function(){
                    var __requestID = (listView.getData() || {}).requestID || "";
                    if (!iNet.isEmpty(__requestID)){
                        window.open(iNet.getUrl(CommonService.pageRequest.formNo03) + '?task=' + __requestID, '_blank');
                    }
                });

                this.$submitBtn.on('click', function(){
                    var __listData = listView.getData() || {};
                    resultView.resetBodyHidden();
                    resultView.addBodyHidden('record', __listData.uuid);
                    resultView.submit(url.submit_result);
                });

                this.$backBtn.on('click', function(){
                    self.fireEvent('back');
                }.createDelegate(this));
            };
        };
        var resultFormContent = function() {
            this.id = "briefcase-result-form-content";
            this.intComponent = function(){
                var me = this;
                this.$notes = $('#briefcase-result-form-notes');
                this.$organ = $('#briefcase-result-form-organ');
                this.$reply = $('#briefcase-result-form-reply');
                this.$oldAttachment = $('#briefcase-result-form-attachment-old');
                this.$listAttachment = $('#briefcase-result-form-attachment-list');
                this.$addAttachment = $('#briefcase-result-form-attachment-add');

                this.$oldAttachment.find('div:first').on('click', function(){
                    if (me.$oldAttachment.find('div:last').hasClass('hide')) {
                        me.$oldAttachment.find('div:last').removeClass('hide');
                    } else {
                        me.$oldAttachment.find('div:last').addClass('hide');
                    }
                });
                this.$addAttachment.on('click', function(){
                    var __htmlAtt = '';
                    __htmlAtt+='<div class="row-fluid">';
                    __htmlAtt+='    <label class="span2">'+resource.completed.attachmentFile+'</label>';
                    __htmlAtt+='    <div class="ace-file-input span10" data-container data-name="{0}">';
                    __htmlAtt+='         <label data-name="{0}" data-title="Click here" class="ace-file-container file-label">';
                    __htmlAtt+='             <span data-title="..." class="ace-file-name file-name"><i class="icon-upload-alt ace-icon"></i></span>';
                    __htmlAtt+='         </label>';
                    __htmlAtt+='         <a data-remove data-name="{0}" class="remove" href="#"><i class=" ace-icon fa fa-times"></i></a>';
                    __htmlAtt+='    </div>';
                    __htmlAtt+='    <input type="file" name="{0}" style="display:none;" data-file data-name="{0}"/>';
                    __htmlAtt+='</div>';

                    var __nameAtt = iNet.generateId();
                    me.$listAttachment.append(String.format(__htmlAtt, __nameAtt));

                    me.$listAttachment.find('[data-file][data-name="'+__nameAtt+'"]').on('change', function(){
                        if (this.files.length < 1) {
                            this.files = [];
                            return;
                        }
                        var __nameFile = this.files[0].name;
                        $(this).parent().find('span[data-title]').attr('data-title', __nameFile);
                        $(this).parent().find('.ace-file-container').addClass('selected');
                    });

                    me.$listAttachment.find('[data-remove][data-name="'+__nameAtt+'"]').on('click', function(){
                        $(this).parent().parent().remove();
                    });

                    me.$listAttachment.find('[data-container][data-name="'+__nameAtt+'"] label').on('click', function(){
                        var __dataName = $(this).attr('data-name');
                        me.$listAttachment.find('[data-file][data-name="'+__dataName+'"]').trigger('click');
                    });

                    me.$listAttachment.find('[data-file][data-name="'+__nameAtt+'"]').trigger('click');
                });
                this.$reply.on('change', function(){
                    me.$reply.find('[name="reply"]').attr('value', me.$reply.find('[name="reply"]').prop("checked"));
                });
            };
        };
        var resultView = new iNet.ui.itemview({
            id: "briefcase-result",
            resource: resource,
            url: url,
            toolbar: resultToolBar,
            formContent: resultFormContent,
            ajaxMaskId: 'ajax-mask',
            headerDetails: {
                subject: "briefcase-result-subject-details",
                sender: "briefcase-result-sender-details"
            }
        });
        resultView.on('menuclick', function(){
            listView.setType('menu');
        });
        resultView.on('submitted', function(data){
            var __data = data || {};
            if (__data.type == "error"){
                self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __data.errors || []));
            } else {
                self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                refresh();
            }
        });

        //PUBLISH FUNCTION ==============================================
        this.setData = function(data){
            var __data = data || {};

            var __params = listView.getParams() || {};
            __params.recordID = __data.recordID || "";
            listView.setParams(__params);

            listView.refresh();
            workflowView.toolbar.$backBtn.show();
            resultView.toolbar.$backBtn.show();

            ctx.isBack = true;
            itemView.toolbar.$backBtn.show();

            if (__data.briefcaseStatus == "INPROCESS"){
                workflowView.toolbar.$resultBtn.hide();
                itemView.toolbar.$resultBtn.hide();
            } else {
                workflowView.toolbar.$resultBtn.show();
                itemView.toolbar.$resultBtn.show();
            }
        };

        //OTHER ==============================================
        var refresh = function(){
            $taskMenu.refresh('process');
            listView.refresh();

            if (ctx.briefcaseStatus == "INPROCESS"){
                workflowView.toolbar.$resultBtn.hide();
                itemView.toolbar.$resultBtn.hide();
            } else {
                workflowView.toolbar.$resultBtn.show();
                itemView.toolbar.$resultBtn.show();
            }
        };

        var init = function(){
            listView.setType('max');

            if (ctx.briefcaseStatus == "INPROCESS"){
                workflowView.toolbar.$resultBtn.hide();
                itemView.toolbar.$resultBtn.hide();
            }

            if (ctx.briefcaseStatus != "INPROCESS"){
                workflowView.toolbar.$printBtn.hide();
                itemView.toolbar.$printBtn.hide();
                resultView.toolbar.$printBtn.hide();
            }


            if (ctx.isBack){
                itemView.toolbar.$backBtn.show();
            }
        };

        init();

        iNet.ui.task.TBriefcase.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.task.TBriefcase, iNet.ui.app.widget);

    //var wgBriefcase = new iNet.ui.task.TBriefcase();
    //wgBriefcase.show();
});
