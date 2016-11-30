// #PACKAGE: xgate-ui-report-detail-service
// #MODULE: XGateDetailService
$(function () {
    iNet.ns("iNet.ui.report", "iNet.ui.report.Detail");

    iNet.ui.report.Detail = function () {
        this.id = 'report-detail-div';
        var self = this;
        var selfData = {
            source: {
                procedureList: [],
                industry: [],
                procedure: []
            }
        };

        var resource = {
            detail: iNet.resources.xgate.report.detail,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            SEARCH: $('#report-detail-search-btn'),
            PRINT: $('#report-detail-print-btn'),
            VIEW: $('#report-detail-view-btn'),
            EXPORT: $('#report-detail-export-btn')
        };

        var url = {
            report: iNet.getUrl('onegate/detailreport'),
            view: iNet.getUrl('onegate/detailreport'),

            procedurelist: iNet.getUrl('onegate/procedurelist'),
            procedureAttr: iNet.getUrl('onegate/prodattr'), //procedure

            loadGraphs: iNet.getUrl('onegate/deptgraphs/load'),

            generator: iNet.getUrl('onegate/excel/generator'),//type=Task
            chkstatus: iNet.getUrl('report/file/chkstatus'),//reportID
            download: iNet.getUrl('report/file/download')//reportID
        };

        var $form = {
            fromDate: $('#report-detail-from'),
            toDate: $('#report-detail-to'),

            report: $('#report-detail-content'),
            industry: $('#report-detail-industry'),
            procedure: $('#report-detail-procedure'),
            keyword: $('#report-detail-keyword'),
            serialNo: $('#report-detail-serialNo'),
            receiptNo: $('#report-detail-receiptNo'),
            attr: $('#report-detail-attr')
        };

        $form.industry = FormService.createSelect("report-detail-industry", selfData.source.industry, "id", 1, true, false);
        $form.procedure = FormService.createSelect("report-detail-procedure", selfData.source.procedure, "id", 1, true, false);
        $form.attr = FormService.createSelect("report-detail-attr", [], "id", 1, true, true);

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

        var loadAttribute = function(){
            $form.attr = FormService.createSelect("report-detail-attr", [], "id", 1, true, true);
            if (!iNet.isEmpty($form.procedure.getValue())){
                $.postJSON(url.procedureAttr, {procedure: $form.procedure.getValue()}, function(result){
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)){
                        $form.attr = FormService.createSelect("report-detail-attr", __result.elements || [], "id", 1, true, true);
                    }
                });
            }
        };
        var loadProcedure = function(){
            $.postJSON(url.procedurelist, {}, function(result){
                var __result = result || {};
                selfData.source.procedureList = __result.elements || [];
                selfData.source.industry = [];
                selfData.source.procedure = [];
                var __industryString = ";";
                $.each(selfData.source.procedureList, function(i, item){
                    if (__industryString.indexOf(";" + item.industry + ";") < 0) {
                        selfData.source.industry.push({id: item.industry, code: item.industry, name: item.industry});
                        __industryString += item.industry + ";";
                    }

                    selfData.source.procedure.push({id: item.uuid, code: item.uuid, name: item.subject});
                });

                $form.industry = FormService.createSelect("report-detail-industry", selfData.source.industry, "id", 1, true, false);
                $form.industry.on('change', function(){
                    selfData.source.procedure = [];
                    $form.procedure.setValue('');
                    $.each(selfData.source.procedureList, function(i, item){
                        if (item.industry.indexOf($form.industry.getValue()) >= 0 || $form.industry.getValue() == "") {
                            selfData.source.procedure.push({id: item.uuid, code: item.uuid, name: item.subject});
                        }
                    });
                    $form.procedure = FormService.createSelect("report-detail-procedure", selfData.source.procedure, "id", 1, true, false);
                    $form.procedure.on('change', function(){
                        loadAttribute();
                    });
                    $form.attr = FormService.createSelect("report-detail-attr", [], "id", 1, true, true);
                });
                $form.procedure = FormService.createSelect("report-detail-procedure", selfData.source.procedure, "id", 1, true, false);
                $form.procedure.on('change', function(){
                    loadAttribute();
                });
                $form.attr = FormService.createSelect("report-detail-attr", [], "id", 1, true, true);
            });
        };
        loadProcedure();

        var dataSource = new DataSource({
            columns: [
                {
                    property : 'subject',
                    label : resource.detail.subject,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'serialNo',
                    label : resource.detail.serialNo,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'receiptNo',
                    label : resource.detail.receiptNo,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'fullName',
                    label : resource.detail.fullName,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'created',
                    label : resource.detail.created,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'appointment',
                    label : resource.detail.appointment,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'completed',
                    label : resource.detail.completed,
                    sortable : true,
                    disabled: true
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'report-detail-grid',
            url: url.view,
            params: {
                pageNumber: 0,
                pageSize: 10
            },
            convertData: function (data) {
                var __data = data || {};
                grid.setTotal(__data.total);
                $.each(__data.items || [], function(i, item){
                    item.created = (item.created > 0) ? new Date(item.created).format('H:i d/m/Y') : '';
                    item.appointment = (item.appointment>0)?
                        ((
                        (new Date().getTime() > item.appointment && item.completed==0) ||
                        (item.completed>item.appointment)
                        ) ?
                        '<label style="color: #ff0511;font-weight: bolder;">'+new Date(item.appointment).format('H:i d/m/Y')+'</label>' :
                        '<label style="color:#0000C0;font-weight: bolder;">'+new Date(item.appointment).format('H:i d/m/Y')+'</label>') : "";

                    item.completed = (item.completed > 0) ? new Date(item.completed).format('H:i d/m/Y') : '';
                    item.status = resource.detail["status"+item.status] || "";
                });
                return __data.items || [];
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
            __params.keyword = $form.keyword.val();
            __params.serial = $form.serialNo.val();
            __params.receipt = $form.receiptNo.val();

            if ($form.procedure != null){
                __params.procedure = $form.procedure.getValue();
            }

            if ($form.industry != null){
                __params.industry = $form.industry.getValue();
            }

            if ($form.attr != null){
                __params.attrs = $form.attr.getValue().toString();
            }


            return __params;
        };
        $toolbar.SEARCH.on('click', function(){
            $.postJSON(url.report, getParams(), function(result){
                var __result = result || {};
                $toolbar.PRINT.hide();
                if (CommonService.isSuccess(__result)){
                    $form.detail.html(__result);
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
            frameDoc.document.write($form.detail.html());
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
            __params.attrs = "";
            __params.labels = "";

            $.postJSON(url.loadGraphs, {}, function(data){
                var __data = data || [];
                console.log(">>graphs>>", __data, __data.toString());
                __params.graphs = __data.toString();

                if ($form.attr != null){
                    var n = ($form.attr.getData() || []).length - 1;
                    $($form.attr.getData() || []).each(function(i, attr){
                        __params.attrs += attr.id + ((n==i)?"" :",");
                        __params.labels += attr.name + ((n==i)?"" :",");
                    });
                }

                if (iNet.isEmpty(__params.attrs)){
                    __params.type = "Detail";
                } else {
                    __params.type = "ProcedureDetail";
                }

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
        });

        iNet.ui.report.Detail.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.report.Detail, iNet.ui.app.widget);

    new iNet.ui.report.Detail().show();
});
