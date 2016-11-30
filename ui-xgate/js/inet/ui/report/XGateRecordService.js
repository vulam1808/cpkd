// #PACKAGE: xgate-ui-report-record-service
// #MODULE: XGateRecordService
$(function () {
    iNet.ns("iNet.ui.report", "iNet.ui.report.Record");

    iNet.ui.report.Record = function () {
        this.id = 'report-record-div';
        var self = this;

        var resource = {
            record: iNet.resources.xgate.report.record,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            SEARCH: $('#report-record-search-btn'),
            PRINT: $('#report-record-print-btn'),
            VIEW: $('#report-record-view-btn'),
            EXPORT: $('#report-record-export-btn')
        };

        var url = {
            procedureList: iNet.getUrl('onegate/procedure/maplist'),

            report: iNet.getUrl('firmtask/report/task'),
            view: iNet.getUrl('onegate/deptrecord/report'),

            generator: iNet.getUrl('onegate/excel/generator'),//type=Record
            chkstatus: iNet.getUrl('report/file/chkstatus'),//reportID
            download: iNet.getUrl('report/file/download')//reportID
        };

        var $form = {
            fromDate: $('#report-record-from'),
            toDate: $('#report-record-to'),
            procedure: $('#report-record-procedure'),
            status: $('#report-record-status'),

            report: $('#report-record-content')
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

        $form.procedure = FormService.createSelect("report-record-procedure", [], "id", 1, true, false);
        $.postJSON(url.procedureList, {}, function(result){
            var __result = result || {};
            if (CommonService.isSuccess(__result)){
                var __list = [];
                $.each(__result.elements || [], function(i, item){
                    __list.push({id: item.uuid, code: item.uuid, name: item.subject});
                });
                $form.procedure = FormService.createSelect("report-record-procedure", __list, "id", 1, true, false);
            }
        });

        var __statusList = [
            {id: "", code: "", name: resource.record.statusAll},
            {id: "INPROCESS", code: "INPROCESS", name: resource.record.statusINPROCESS},
            {id: "COMPLETED", code: "COMPLETED", name: resource.record.statusCOMPLETED},
            {id: "REJECTED", code: "REJECTED", name: resource.record.statusREJECTED},
            {id: "PUBLISHED", code: "PUBLISHED", name: resource.record.statusPUBLISHED}
        ];
        $form.status = FormService.createSelect("report-record-status", __statusList, "id", 1, true, false);
        $form.status.setValue("");

        var dataSource = new DataSource({
            columns: [
                {
                    property: 'procedureName',
                    label : resource.record.procedureName,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'subject',
                    label : resource.record.subject,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'fullName',
                    label : resource.record.fullName,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'recordBook',
                    label : resource.record.recordBook,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'recordOrder',
                    label : resource.record.recordOrder,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'status',
                    label : resource.record.status,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'created',
                    label : resource.record.created,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'appointment',
                    label : resource.record.appointment,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'completed',
                    label : resource.record.completed,
                    sortable : true,
                    disabled: true
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'report-record-grid',
            url: url.view,
            params: {},
            convertData: function (data) {
                var __data = data || {};
                $.each(__data.items || [], function(i, item){
                    item.status = resource.record["status"+item.status] || "";
                    item.created = (item.created>0)? new Date(item.created).format('H:i d/m/Y') : "";
                    item.appointment = (item.appointment>0)? new Date(item.appointment).format('H:i d/m/Y') : "";
                    item.completed = (item.completed>0)? new Date(item.completed).format('H:i d/m/Y') : "";
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
            __params.procedure = $form.procedure.getValue() || "";
            __params.status = $form.status.getValue() || "";

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
            __params.procedure = $form.procedure.getValue() || "";
            __params.status = $form.status.getValue() || "";

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
            __params.type = "Record";
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

        iNet.ui.report.Record.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.report.Record, iNet.ui.app.widget);

    new iNet.ui.report.Record().show();
});
