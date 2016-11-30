// #PACKAGE: bfworkflow
// #MODULE: BFWorkflowService
$(function () {
    iNet.ns("iNet.ui.xgate", "iNet.ui.xgate.BfWorkflow");
    iNet.ui.xgate.BfWorkflow = function (config) {
        this.id = 'briefcase-workflow-div';
        var __config = config || {};
        var self = this;
        var parentPage = null;
        
        //get form velocity
        var ctx = {
            context: iNet.context, //get data from widget
            zone: iNet.zone //get data from widget
        };

        var resource = {
            BfWorkflow: iNet.resources.xgate.BfWorkflow,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            history_request: iNet.getUrl('firmtask/process/history') //request
        };

        //LIST VIEW ===========================================
        var $taskFrame = iNet.getLayout().window.taskFrame;
        $taskFrame.on('typechange', function(type){
            if (type == 'min'){
                workflowView.setMenuButton(true);
            } else {
                workflowView.setMenuButton(false);
            }
        });

        //WORKFLOW VIEW ===================================================
        var workflowLoad = function(){
            workflowView.reset();
            var __taskInfo = $taskFrame.getTaskDataIndex();
            var __graphID = ((__taskInfo || {}).history || {}).graphID || "";
            var __requestID = ((__taskInfo || {}).request || {}).uuid || "";

            var __graphData = {
                uuid: __graphID,
                zone: ctx.zone,
                context: ctx.context,
                version: "VIEW"
            };
            var __historyData = [];

            $.postJSON(url.history_request, {request: __requestID}, function(result){
                var __result = result || {};
                if(CommonService.isSuccess(__result)){
                    $.each(__result.items || [], function(i, item){
                        var __history = {};

                        var __nodeColor = "orange";
                        var __statusColor = "orange";
                        var __taskStatus = resource.BfWorkflow.status.completed;
                        var __taskAlter = resource.BfWorkflow.status.inprocess;
                        var __taskTime = resource.BfWorkflow.time.unlimited;

                        if (item.completedTime == 0) {
                            __nodeColor = "blue";
                            __statusColor = "blue";
                            __taskStatus = resource.BfWorkflow.status.processing;
                        }

                        var __localTime = item.completedTime || new Date().getTime();
                        if (__localTime > item.expiredTask){
                            __taskAlter = resource.BfWorkflow.status.overdue;
                        }

                        if (item.timeProcess > 0) {
                            __taskTime = item.timeProcess + ' ';
                            if (item.timeUnit == 0) {
                                __taskTime += resource.BfWorkflow.time.minutes;
                            } else if (item.timeUnit == 1) {
                                __taskTime += resource.BfWorkflow.time.hours;
                            } else {
                                __taskTime += resource.BfWorkflow.time.day;
                            }
                        }

                        __history = iNet.apply(__history, item);
                        __history.nodeColor = __nodeColor;
                        __history.statusColor = __statusColor;
                        __history.nodeHtmlContent = '';
                        __history.nodeHtmlContent+='<b>+ '+resource.BfWorkflow.info.to+'</b>';
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>'+resource.BfWorkflow.info.sender+': </b>' + item.senderName;
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>'+resource.BfWorkflow.info.sendDate+': </b>' + new Date(item.created).format("H:i d/m/Y");
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>+ '+resource.BfWorkflow.info.process+'</b>';
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>'+resource.BfWorkflow.info.processor+': </b>' + (item.processorName || "");
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>'+resource.BfWorkflow.info.completedDate+': </b>';
                        __history.nodeHtmlContent+=((item.completedTime > 0) ? new Date(item.completedTime).format("H:i d/m/Y") : '');
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>+ '+resource.BfWorkflow.info.task+'</b>';
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>'+resource.BfWorkflow.info.status+': </b>';
                        __history.nodeHtmlContent+=__taskStatus;
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>'+resource.BfWorkflow.info.timeProcess+': </b>';
                        __history.nodeHtmlContent+=__taskTime;
                        __history.nodeHtmlContent+='<br/>';
                        __history.nodeHtmlContent+='<b>'+resource.BfWorkflow.info.alter+': </b>';
                        __history.nodeHtmlContent+=__taskAlter;
                        __history.nodeTitle = '';
                        __history.nodeName = item.taskName;

                        __historyData.push(__history);
                    });
                }

                //console.log(">> loadGraph >>", {graphData: __graphData, historyData: __historyData});
                workflowView.dataContent.$wfDesign.loadGraph(__graphData, __historyData);
                workflowView.dataContent.$wfDesign.show();
                workflowView.setDataContent("view");
            });
        };
        var workflowToolBar = function() {
            this.id = "briefcase-workflow-toolbar";
            this.intComponent = function(){
                this.$backBtn = $('#briefcase-workflow-back-btn');

                this.$backBtn.on('click', function(){
                    self.fireEvent('back');
                    if (parentPage != null){
                        parentPage.show();
                        self.hide();
                    }
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
            $taskFrame.setListTaskType('menu');
        });

        //PUBLISH FUNCTION ==========================================
        this.load = function(){
            workflowLoad();
        };
        this.setPageBack = function(page, showBackButton){
            parentPage = page;
            if (parentPage != null && showBackButton != false){
                workflowView.toolbar.$backBtn.show();
            } else {
                workflowView.toolbar.$backBtn.hide();
            }
        };
        this.setType = function(type){
            //type: full, min
            $('#'+ self.id + ' [data-id="item-view-control"].item-view').removeClass('full').addClass(type);
            //self.setMenuButton(type);
        };

        iNet.ui.xgate.BfWorkflow.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.xgate.BfWorkflow, iNet.ui.app.widget);
});
