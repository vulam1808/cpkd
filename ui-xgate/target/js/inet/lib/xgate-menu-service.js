// #PACKAGE: xgate-menu-service
// #MODULE: MenuService
$(function () {
    iNet.ns("iNet.ui.task");

    iNet.ui.task.Menu = function () {
        var self = this;

        var userProfile = {};
        var menuCount = {};
        var $LISTTASK = $('#sidebar');
        var $REFRESH = $('#my-task-refresh-btn');
        var $CREATE = $('#my-task-create-btn');
        $CREATE.hide();

        var url = {
            formlist: iNet.getUrl('firmtask/process/formlist'),
            summaryTask: iNet.getUrl('firmtask/process/summary'),
            processqueue: iNet.getUrl('firmtask/process/queue'),

            tasktree: iNet.getUrl('onegate/additional/tasktree'),
            taskquery: iNet.getUrl('onegate/additional/taskquery'), //procedure

            recordcount: iNet.getUrl('onegate/deptrecord/count'), //if type=record completed else processing
            recordsearch: iNet.getUrl('onegate/deptrecord/search'), //type=normal&status=INPROCESS

            additionalreqquery: iNet.getUrl('onegate/externaldata/reqquery') //
        };

        var onRefresh = function(){
            window.location.href = iNet.getUrl('xgate/page/index');
        };
        var onCheckCreate = function(){
            setTimeout(function(){
                $.each($LISTTASK.find('li.active'), function(i, item){
                    if (!iNet.isEmpty($(item).attr('assigned') ||'')){
                        $CREATE.show();
                    }
                });
            }, 1000);
        };
        var onCreate = function () {
            self.fireEvent("create");
        }.createDelegate(this);

        $LISTTASK.find('li').on('click', function(e){
            $CREATE.hide();
            onCheckCreate();
        });
        $REFRESH.on('click', onRefresh);
        $CREATE.on('click', onCreate);

        var initMenu = function(){
            if(iNet.roles.receiver) {
                refreshNumberReceiver();
            }

            if(iNet.roles.processor) {
                refreshNumberProcess("", "create");
            }

            onCheckCreate();
        };

        var refreshNumberReceiver = function(data){
            $.postJSON(url.taskquery, {status:"CREATED", assign: false, replyForOrgID: false}, function (result) {
                menuCount.expwayprocedureNoWorkflow = (result || {}).total || 0;
                $LISTTASK.find('#receiver-expway-procedureNoWorkflow [data-type="number"]').text(((result || {}).total || "").toString());
            });

            $.postJSON(url.taskquery, {status:"CREATED", assign: true, replyForOrgID: false}, function (result) {
                menuCount.expwayprocedureWorkflow = (result || {}).total || 0;
                $LISTTASK.find('#receiver-expway-procedureWorkflow [data-type="number"]').text(((result || {}).total || "").toString());
            });

            $.postJSON(url.taskquery, {status:"CREATED", assign: false, replyForOrgID: true}, function (result) {
                menuCount.organprocedureNoWorkflow = (result || {}).total || 0;
                $LISTTASK.find('#receiver-organization-procedureNoWorkflow [data-type="number"]').text(((result || {}).total || "").toString());
            });

            $.postJSON(url.taskquery, {status:"CREATED", assign: true, replyForOrgID: true}, function (result) {
                menuCount.organprocedureWorkflow = (result || {}).total || 0;
                $LISTTASK.find('#receiver-organization-procedureWorkflow [data-type="number"]').text(((result || {}).total || "").toString());
            });

            $.postJSON(url.taskquery, {status:"REFUSE"}, function (result) {
                menuCount.refuse = (result || {}).total || 0;
                $LISTTASK.find('#receiver-refuse [data-type="number"]').text(((result || {}).total || "").toString());
            });

            $.postJSON(url.additionalreqquery, {}, function (result) {
                menuCount.additional = (result || {}).total || 0;
                $LISTTASK.find('#receiver-additional [data-type="number"]').text(((result || {}).total || "").toString());
            });

            $.postJSON(url.recordsearch, {status: 'INPROCESS'}, function (result) {
                menuCount.inprocess = (result || {}).total || 0;
                $LISTTASK.find('#receiver-inprocess [data-type="number"]').text(((result || {}).total || "").toString());
            });

            $.postJSON(url.recordsearch, {status: 'COMPLETED'}, function (result) {
                menuCount.completed = (result || {}).total || 0;
                $LISTTASK.find('#receiver-completed [data-type="number"]').text(((result || {}).total || "").toString());
            });

            $.postJSON(url.recordsearch, {status: 'REJECTED'}, function (result) {
                menuCount.rejected = (result || {}).total || 0;
                $LISTTASK.find('#receiver-rejected [data-type="number"]').text(((result || {}).total || "").toString());
            });

            $.postJSON(url.recordsearch, {status: 'PUBLISHED'}, function (result) {
                menuCount.published = (result || {}).total || 0;
                $LISTTASK.find('#receiver-published [data-type="number"]').text(((result || {}).total || "").toString());
            });

            $.postJSON(url.processqueue, {}, function (result) {
                menuCount.queue = (result || {}).total || 0;
                $LISTTASK.find('#receiver-queue [data-type="number"]').text(((result || {}).total || "").toString());
            });
        };
        var refreshNumberProcess = function(data, type){
            $.postJSON(url.summaryTask, {}, function (result) {
                result = result || [];
                $LISTTASK.find('#task-open [data-type="number"]').text((result[0] || "").toString());
            });
        };

        this.setUserProfile = function(profileData){
            var __profileData = profileData || {};
            if (!iNet.isEmpty(__profileData.uuid)){
                userProfile['up' + __profileData.uuid] = __profileData;
            }
        };
        this.getUserProfile = function(profileId){
            var __profileId = profileId || "";
            if (!iNet.isEmpty(__profileId)){
                return userProfile['up' + __profileId] || {};
            } else {
                return {};
            }
        };
        this.count = function(type){
            return menuCount[type] || 0;
        };
        this.refresh = function(data){
            if(iNet.roles.receiver) {
                refreshNumberReceiver(data);
            }

            if(iNet.roles.processor) {
                refreshNumberProcess(data, "refresh");
            }
        };
        this.hideCreate = function(){
            $CREATE.hide();
        };
        this.showCreate = function(){
            $CREATE.show();
        };

        initMenu();
        iNet.ui.task.Menu.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.task.Menu, iNet.ui.common.Menu);
});
