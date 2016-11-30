// #PACKAGE: xgate-ui-report-summary-service
// #MODULE: XGateSummaryService
$(function () {
    iNet.ns("iNet.ui.report", "iNet.ui.report.Summary");

    iNet.ui.report.Summary = function () {
        this.id = 'report-summary-div';
        var self = this;

        var resource = {
            summary: iNet.resources.xgate.report.summary,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            SEARCH: $('#report-summary-search-btn'),
            PRINT: $('#report-summary-print-btn'),
            VIEW: $('#report-summary-view-btn'),
            EXPORT: $('#report-summary-export-btn')
        };

        var url = {
            report: iNet.getUrl('onegate/summaryreport'),
            view: iNet.getUrl('onegate/summaryreport'),

            generator: iNet.getUrl('onegate/excel/generator'),//type=Task
            chkstatus: iNet.getUrl('report/file/chkstatus'),//reportID
            download: iNet.getUrl('report/file/download')//reportID
        };

        var $form = {
            fromDate: $('#report-summary-from'),
            toDate: $('#report-summary-to'),

            report: $('#report-summary-content'),
            tableBody: $('#report-summary-table-body'),
            rowTemplate: $('#report-summary-table-row')
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

        var htmlRow = function(itemData){
            var __itemData = itemData || {};

            for(var key in __itemData){
                $form.rowTemplate.find('[data-type="'+key+'"]').text(__itemData[key]);
            }


            return '<tr>'+$form.rowTemplate.html()+'</tr>';
        };

        var dataSource = new DataSource({
            columns: [
                {
                    property : 'industry',
                    label : resource.summary.industry,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'inventory',
                    label : resource.summary.inventory,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'receiver',
                    label : resource.summary.receiver,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'inTime',
                    label : resource.summary.inTime,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'afterTime',
                    label : resource.summary.afterTime,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'percent',
                    label : resource.summary.percent,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'inTerm',
                    label : resource.summary.inTerm,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'outTerm',
                    label : resource.summary.outTerm,
                    sortable : true,
                    disabled: true
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'report-summary-grid',
            url: url.view,
            params: {},
            convertData: function (data) {
                var __data = data || [];
                return __data;
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

            $.postJSON(url.report, __params, function(result){
                var __result = result || {};
                $toolbar.PRINT.hide();
                if (CommonService.isSuccess(__result)){
                    $form.summary.html(__result);
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
            frameDoc.document.write($form.summary.html());
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

            //grid.setParams(__params);
            //grid.load();

            $.postJSON(url.view, __params, function(result){
                var __result = result || [];
                $form.tableBody.html('');
                if (CommonService.isSuccess(__result)){
                    $.each(__result, function(i, item){
                        $form.tableBody.append(htmlRow(item));
                    });
                } else {
                    self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                }
            },{
                mask: self.getMask(),
                msg: iNet.resources.ajaxLoading.loading
            });

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
            __params.type = "Summary";
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


        CommonService.syncProcedure();
        iNet.ui.report.Summary.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.report.Summary, iNet.ui.app.widget);

    new iNet.ui.report.Summary().show();
});
