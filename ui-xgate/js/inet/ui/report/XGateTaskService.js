// #PACKAGE: xgate-ui-report-task-service
// #MODULE: XGateTaskService
$(function () {
    iNet.ns("iNet.ui.report", "iNet.ui.report.Task");

    iNet.ui.report.Task = function () {
        this.id = 'report-task-div';
        var self = this;

        var resource = {
            task: iNet.resources.xgate.report.task,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            SEARCH: $('#report-task-search-btn'),
            PRINT: $('#report-task-print-btn'),
            VIEW: $('#report-task-view-btn'),
            EXPORT: $('#report-task-export-btn')
        };

        var url = {
            procedurelist: iNet.getUrl('onegate/procedurelist'),
            userList: iNet.getUrl('system/account/role'),

            report: iNet.getUrl('onegate/taskreport'),
            view: iNet.getUrl('onegate/taskreport'),

            generator: iNet.getUrl('onegate/excel/generator'),//type=Task
            chkstatus: iNet.getUrl('report/file/chkstatus'),//reportID
            download: iNet.getUrl('report/file/download')//reportID
        };

        var $form = {
            fromDate: $('#report-task-from'),
            toDate: $('#report-task-to'),
            processor: $('#report-task-processor'),
            procedure: $('#report-task-procedure'),
            type: $('#report-task-type'),
            keyword: $('#report-task-keyword'),
            serialNo: $('#report-task-serialNo'),
            receiptNo: $('#report-task-receiptNo'),

            report: $('#report-task-content')
        };

        var fromDate = $form.fromDate.datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate',function (ev) {
            fromDate.hide();
        }).data('datepicker');
        $form.fromDate.val(CommonService.getFirstDate());

        var toDate = $form.toDate.datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate',function (ev) {
            toDate.hide();
        }).data('datepicker');
        $form.toDate.val(CommonService.getCurrentDate());

        $form.processor = FormService.createSelect("report-task-processor", [], "id", 2, true, false);
        $.postJSON(url.userList, {}, function(result){
            var __result = result || {};
            if (CommonService.isSuccess(__result)){
                var __list = [];
                $.each(__result.items || [], function(i, item){
                    __list.push({id: item.username, code: item.username, name: item.fullname});
                });
                $form.processor = FormService.createSelect("report-task-processor", __list, "id", 2, true, false);
            }
        });

        $form.procedure = FormService.createSelect("report-task-procedure", [], "id", 1, true, false);
        $.postJSON(url.procedurelist, {}, function(result){
            var __result = result || {};
            if (CommonService.isSuccess(__result)){
                var __list = [];
                $.each(__result.elements || [], function(i, item){
                    __list.push({id: item.uuid, code: item.uuid, name: item.subject});
                });
                $form.procedure = FormService.createSelect("report-task-procedure", __list, "id", 1, true, false);
            }
        });

        var __sourceType = [
            {id: 1, code: 1, name: resource.task.typeLate},
            {id: 2, code: 2, name: resource.task.typeProcess},
            {id: 3, code: 3, name: resource.task.typeComplete}
        ];
        //$form.type = FormService.createSelect("report-task-type", __sourceType, "id", 1, true, false);


        var dataSource = new DataSource({
            columns: [
                {
                    property : 'subject',
                    label : resource.task.subject,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'serialNo',
                    label : resource.task.serialNo,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'receiptNo',
                    label : resource.task.receiptNo,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'taskName',
                    label : resource.task.taskName,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'taskProcessorName',
                    label : resource.task.processorName,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'taskCreated',
                    label : resource.task.created,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'taskExpiredTask',
                    label : resource.task.expiredTime,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'taskCompletedTime',
                    label : resource.task.completedTime,
                    sortable : true,
                    disabled: true
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'report-task-grid',
            url: url.view,
            params: {
                pageNumber: 0,
                pageSize: 10
            },
            convertData: function (data) {
                var __data = data || {};
                grid.setTotal(__data.total);

                $.each(__data.items || [], function(i, item){
                    item.status = resource.task.statusCreated;
                    if (item.taskCompletedTime > 0){
                        item.status = resource.task.statusCompleted;
                    }

                    if (item.taskName == 'xgate.receiver'){
                        item.taskName = resource.task.xgateReceiver || "";
                    }

                    if (item.appointment > 0 && (item.taskExpiredTask || 0) == 0){
                        item.taskExpiredTask = item.appointment;
                    }

                    item.taskExpiredTask = (item.taskExpiredTask>0) ?
                        ((
                        (new Date().getTime() > item.taskExpiredTask && item.taskCompletedTime==0) ||
                        (item.taskCompletedTime > item.taskExpiredTask)
                        ) ?
                        '<label style="color: #ff0511;font-weight: bolder;">'+new Date(item.taskExpiredTask).format('H:i d/m/Y')+'</label>' :
                        '<label style="color:#0000C0;font-weight: bolder;">'+new Date(item.taskExpiredTask).format('H:i d/m/Y')+'</label>') : "";

                    item.taskCompletedTime = ((item.taskCompletedTime || 0) > 0) ? new Date(item.taskCompletedTime).format('H:i d/m/Y') : "";
                    item.taskCreated = new Date(item.taskCreated).format('H:i d/m/Y');
                });
                return __data.items;
            },
            dataSource: dataSource,
            stretchHeight: false,
            editable: false,
            firstLoad: false,
            remotePaging: true,
            idProperty: 'uuid'
        });

        var getParams = function(){
            var __params = grid.getParams() || {};
            __params.from = $form.fromDate.val().dateToLong();
            __params.to = $form.toDate.val().endDateToLong();

            if($form.processor != null){
                __params.processor = $form.processor.getValue() || "";
            }

            if($form.procedure != null){
                __params.procedureID = $form.procedure.getValue() || "";
            }

            __params.keyword = $form.keyword.val();
            __params.serial = $form.serialNo.val();
            __params.receipt = $form.receiptNo.val();

            /*if($form.type != null){
                if ($form.type.getValue() != ""){
                    __params.type = $form.type.getValue() || "";
                }
            }*/

            return __params;
        };

        $toolbar.SEARCH.on('click', function(){
            $.postJSON(url.report, getParams(), function(result){
                var __result = result || {};
                $toolbar.PRINT.hide();
                if (CommonService.isSuccess(__result)){
                    $form.task.html(__result);
                    $toolbar.PRINT.show();
                } else {
                    self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                }
            },{
                mask: self.getMask(),
                msg: iNet.resources.ajaxLoading.loading
            });
        });
        $toolbar.PRINT.on('click', function(){
            var frame1 = document.createElement('iframe');
            frame1.name = "framePrint";
            frame1.style.position = "absolute";
            frame1.style.top = "-1000000px";
            document.body.appendChild(frame1);
            var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
            frameDoc.document.open();
            frameDoc.document.write($form.task.html());
            frameDoc.document.close();
            setTimeout(function () {
                window.frames["framePrint"].focus();
                window.frames["framePrint"].print();
                document.body.removeChild(frame1);
            }, 500);
        });

        $toolbar.VIEW.on('click', function(){
            grid.setParams(getParams());
            grid.load();

            $toolbar.EXPORT.show();
        });


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
        $toolbar.EXPORT.on('click', function(){
            var __params = grid.getParams() || {};
            __params.type = "Task";
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



        iNet.ui.report.Task.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.report.Task, iNet.ui.app.widget);

    new iNet.ui.report.Task().show();
});
