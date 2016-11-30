/**
 * Created by HS on 3/10/2016.
 */
// #PACKAGE: reportsummary-list
// #MODULE: ReportSummaryList

$(function() {

    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.ExportSummary = function (config) {
        var me= this;
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'report-summary-list-widget';
        //this.act = iNet.act;
        //this.idHomeBusiness = __config.idHomeBusiness;
        //console.log("act >>>", iNet.act);

        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };

        var url = {
            view: iNet.getUrl('cpkd/reportsummary'),
            load_enum: iNet.getUrl('ita/enums/load'),

            export_excel: iNet.getUrl('cpkd/excel/generator'),
            chkstatus: iNet.getUrl('report/file/chkstatus'),//reportID
            download: iNet.getUrl('report/file/download')
            /* save: iNet.getUrl('ita/areabusiness/save'),
             update: iNet.getUrl('ita/areabusiness/update'),
             del: iNet.getUrl('ita/areabusiness/delete')*/
        };
        var $form = {
            button_search: $('#report-search-btn'),
            input_dateStart: $('#input-dateStart'),
            input_dateEnd: $('#input-dateEnd'),
            button_excel: $('#report-export-excel-btn')
        };
        var dateStart = $form.input_dateStart.datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate',function (ev) {
            dateStart.hide();
        }).data('datepicker');
        $form.input_dateStart.val(CommonService.getCurrentDate());

        var dateEnd = $form.input_dateEnd.datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate',function (ev) {
            dateEnd.hide();
        }).data('datepicker');
        $form.input_dateEnd.val(CommonService.getCurrentDate());

        var dataSource = new iNet.ui.grid.DataSource({
            columns : [/*{
             type : 'selection',
             align: 'center',
             width : 30
             },*/{
                property : 'statusTypeName',
                label : resource.common.status,
                sortable : true,
                type : 'text'

            },{
                property : 'done',
                label : resource.common.countTaskDone,
                sortable : true,
                type : 'text'

            },{
                property : 'process',
                label : resource.common.countTaskProcess,
                sortable : true,
                type : 'text'

            }]
        });
        //load grid
        grid = new iNet.ui.grid.Grid({
            id : 'listreportsummary-grid',
            dataSource : dataSource,
            url: url.view,
            firstLoad: true,
            idProperty : 'uuid',
            pageSize: 10,
            params: {
                dateStart: $form.input_dateStart.val().dateToLong(),
                dateEnd: $form.input_dateEnd.val().dateToLong()
            },
            convertData: function (data) {
                var _data = data || {};
                // var __items = __data.items || [];

                $.each(_data, function(i, obj){

                    obj.statusTypeName = resource.common[obj.name];

                });
                console.log("__data__data>>",_data);
                return _data;
            },
            editable: false
        });


        $form.button_search.on('click',function(){
            var __params = {};
            __params.dateStart= $form.input_dateStart.val().dateToLong();
            __params.dateEnd= $form.input_dateEnd.val().dateToLong();
            grid.setParams(__params);
            grid.load();
        });
        $form.button_excel.on('click',function(){
            var __params = grid.getParams() || {};
            __params.type = "Summary4";
            $.postJSON(url.export_excel, __params, function (result) {
                var __result = result || {};
                console.log("Summary Detail",__result);
                var __result = result || {};
                if (CommonService.isSuccess(__result)){
                    setTimeout(function(){
                        checkStatus(__result.uuid);
                    }, 2000);
                } else {
                    me.notifyError(resource.validate.save_title, resource.validate.save_error, __result.errors || []);
                }
            },{
                mask: me.getMask(),
                msg: "Loading"
            });
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
                mask: me.getMask(),
                msg: "Loading"
            });
        };


        iNet.ui.ita.ExportSummary.superclass.constructor.call(this);


    };

    iNet.extend(iNet.ui.ita.ExportSummary, iNet.ui.app.widget);
    var wgabc = new iNet.ui.ita.ExportSummary();
    wgabc.show();


});
