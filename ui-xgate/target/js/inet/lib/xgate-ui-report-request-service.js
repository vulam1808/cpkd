// #PACKAGE: xgate-ui-report-request-service
// #MODULE: XGateRequestService
$(function () {
    iNet.ns("iNet.ui.report", "iNet.ui.report.Request");

    iNet.ui.report.Request = function () {
        this.id = 'report-request-div';
        var self = this;

        var resource = {
            report: iNet.resources.xgate.report.request,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            SEARCH: $('#report-request-search-btn'),
            PRINT: $('#report-request-print-btn'),
            VIEW: $('#report-request-view-btn'),
            EXPORT: $('#report-request-export-btn')
        };

        var url = {
            graphList: iNet.getUrl('cloud/workflow/defproc/list'),
            userList: iNet.getUrl('system/account/role'),

            report: iNet.getUrl('firmtask/report/requester'),
            view: iNet.getUrl('firmtask/view/request'),

            generator: iNet.getUrl('onegate/excel/generator'),//type=Request
            chkstatus: iNet.getUrl('report/file/chkstatus'),//reportID
            download: iNet.getUrl('report/file/download')//reportID
        };

        var $form = {
            fromDate: $('#report-request-from'),
            toDate: $('#report-request-to'),
            requester: $('#report-request-requester'),
            graph: $('#report-request-graph'),

            report: $('#report-request-content')
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

        $form.requester = FormService.createSelect("report-request-requester", [], "id", 1, true, false);
        $.postJSON(url.userList, {}, function(result){
            var __result = result || {};
            if (CommonService.isSuccess(__result)){
                var __list = [];
                $.each(__result.items || [], function(i, item){
                    __list.push({id: item.username, code: item.username, name: item.fullname});
                });
                $form.requester = FormService.createSelect("report-request-requester", __list, "id", 1, true, false);
            }
        });

        $form.graph = FormService.createSelect("report-request-graph", [], "id", 1, true, false);
        $.postJSON(url.graphList, {zone: iNet.zone, context: iNet.context, version: "PRODUCTION"}, function(result){
            var __result = result || {};
            if (CommonService.isSuccess(__result)){
                var __list = [];
                $.each(__result.items || [], function(i, item){
                    __list.push({id: item.uuid, code: item.uuid, name: item.name});
                });
                $form.graph = FormService.createSelect("report-request-graph", __list, "id", 1, true, false);
            }
        });

        var dataSource = new DataSource({
            columns: [
                {
                    property : 'subject',
                    label : resource.report.subject,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'requestorName',
                    label : resource.report.requestorName,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'requestTime',
                    label : resource.report.requestTime,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'completedTime',
                    label : resource.report.completedTime,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'status',
                    label : resource.report.status,
                    sortable : true,
                    disabled: true
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'report-request-grid',
            url: url.view,
            params: {},
            convertData: function (data) {
                var __data = data || {};
                $.each(__data.items || [], function(i, item){
                    item.status = resource.report.statusCreated;
                    if (item.completedTime > 0){
                        item.status = resource.report.statusCompleted;
                    }

                    item.completedTime = ((item.completedTime || 0) > 0) ? (item.completedTime || 0).longToDate() : "";
                    item.requestTime = (item.requestTime || 0).longToDate();
                });
                return __data.items;
            },
            dataSource: dataSource,
            stretchHeight: false,
            editable: false,
            firstLoad: false,
            idProperty: 'uuid'
        });

        $toolbar.SEARCH.on('click', function(){
            var __params = {};
            __params.from = $form.fromDate.val().dateToLong();
            __params.to = $form.toDate.val().endDateToLong();
            __params.requester = $form.requester.getValue() || "";
            __params.graph = $form.graph.getValue() || "";

            $.postJSON(url.report, __params, function(result){
                var __result = result || {};
                $toolbar.PRINT.hide();
                if (CommonService.isSuccess(__result)){
                    $form.report.html(__result);
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
            frameDoc.document.write($form.report.html());
            frameDoc.document.close();
            setTimeout(function () {
                window.frames["framePrint"].focus();
                window.frames["framePrint"].print();
                document.body.removeChild(frame1);
            }, 500);
        });

        $toolbar.VIEW.on('click', function(){
            var __params = {};
            __params.from = $form.fromDate.val().dateToLong();
            __params.to = $form.toDate.val().endDateToLong();
            __params.requester = $form.requester.getValue() || "";
            __params.graph = $form.graph.getValue() || "";

            grid.setParams(__params);
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
            __params.type = "Request";
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

        iNet.ui.report.Request.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.report.Request, iNet.ui.app.widget);

    new iNet.ui.report.Request().show();
});
