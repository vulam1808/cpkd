/**
 * Created by HS on 3/10/2016.
 */
// #PACKAGE: report-list
// #MODULE: ReportList

$(function() {

    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.ExportList = function (config) {
        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };

        var url = {
            view: iNet.getUrl('cpkd/reportlist'),
            load_enum: iNet.getUrl('ita/enums/load'),
            load_infoDetail: iNet.getUrl('ita/homebusiness/loadinfo'),
            load_areaBusiness: iNet.getUrl('ita/areabusiness/load'),
            export_excel: iNet.getUrl('cpkd/excel/generator'),
            chkstatus: iNet.getUrl('report/file/chkstatus'),//reportID
            download: iNet.getUrl('report/file/download')
            /* save: iNet.getUrl('ita/areabusiness/save'),
             update: iNet.getUrl('ita/areabusiness/update'),
             del: iNet.getUrl('ita/areabusiness/delete')*/
        };
        var $formReport = {
            button_search: $('#report-search-btn'),
            button_print: $('#report-print-btn'),
            button_excel: $('#report-export-excel-btn'),
            input_dateStart: $('#input-dateStart'),
            input_dateEnd: $('#input-dateEnd'),
            input_typeTask: $('#input-typeTask'),
            input_areaBusiness: $('#input-areaBusiness')

        };
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'report-list-widget';
        //this.act = iNet.act;
        //this.idHomeBusiness = __config.idHomeBusiness;
        //console.log("act >>>", iNet.act);

        var dateStart = $formReport.input_dateStart.datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate',function (ev) {
            dateStart.hide();
        }).data('datepicker');
        $formReport.input_dateStart.val(CommonService.getCurrentDate());

        var dateEnd = $formReport.input_dateEnd.datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate',function (ev) {
            dateEnd.hide();
        }).data('datepicker');
        $formReport.input_dateEnd.val(CommonService.getCurrentDate());

        var loadAreaBusiness = function(){
            $formReport.input_areaBusiness =  FormService.createSelect('input-areaBusiness', [], 'id', 1, false, true);
            //me.$form.input_areaBusiness.setValue(value || "");

            var __listAreaBusiness = [];
                $.postJSON(url.load_areaBusiness, {}, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        $.each(__result.items || [], function(i, obj){
                            __listAreaBusiness.push({id: obj.uuid, code: obj.code, name: obj.area});
                        });
                        $formReport.input_areaBusiness = FormService.createSelect('input-areaBusiness',__listAreaBusiness, 'id', 1, false, true);
                        console.log('__listAreaBusiness>>',__listAreaBusiness);
                    }
                });


        };
        loadAreaBusiness();
        var listStatusBusiness = function() {
            var __dataTypeTaskBusiness  = [];
            //__dataTypeTaskBusiness.push({id: "ALL", name: "Tất cả"})
            $formReport.input_typeTask = FormService.createSelect('input-typeTask', __dataTypeTaskBusiness, 'id', 1, false, true);
            $.postJSON(url.load_enum, {typeEnum: 'STATUS'}, function (result) {
                var __result = result || [];
                $(__result).each(function (i, item) {
                    __dataTypeTaskBusiness.push({id: item, name: resource.common[item]});
                });
                console.log("__dataTypeTaskBusiness>>",__dataTypeTaskBusiness);
                $formReport.input_typeTask = FormService.createSelect('input-typeTask', __dataTypeTaskBusiness, 'id', 1, false, true);
                $formReport.input_typeTask.setValue('ALL');
            });
        }
        listStatusBusiness();
        var me= this;

        var dataSource = new iNet.ui.grid.DataSource({
            columns : [{
             type : 'selection',
             align: 'center',
             width : 30
             },{
                property : 'name',
                label : resource.common.nameBusiness,
                sortable : true,
                type : 'text'

            },{
                property : 'namePeprensent',
                label : resource.common.personrepresent,
                sortable : true,
                type : 'text'

            },{
                property : 'dateSubmit1',
                label : resource.common.dateSubmit,
                sortable : true,
                type : 'text'

            },{
                property : 'address',
                label : resource.common.businessAddress,
                sortable : true,
                type : 'text'

            },{
                property : 'ward',
                label : resource.common.ward,
                sortable : true,
                type : 'text'

            }, {
                property : 'areaBusiness',
                label : resource.common.nameAreaBusiness,
                sortable : true,
                type : 'text'

            },{
                property : 'statusTypeName',
                label : resource.common.type_task,
                sortable : true,
                type : 'text'
            },{
                property : 'statusProcessName',
                label : resource.common.status,
                sortable : true,
                type : 'text'
            },{
                label : '',
                type : 'action',
                separate: '&nbsp;',
                align: 'center',
                cls: 'hidden-767',
                buttons : [{
                    text : 'Xem thông tin',
                    icon : 'fa-info',
                    labelCls: 'label label-info',
                    fn : function(record) {

                        var __data = {homeBusinessID:record.idHomeBusiness,taskID :record.taskID};
                        $.postJSON(url.load_infoDetail, __data, function (result) {
                            var __result = result || {};
                            console.log("Info Detail",__result);
                            if (CommonService.isSuccess(__result)) {
                                var info = new iNet.ui.ita.InfoBusinessWidget(__result);
                                var officeDialog = new iNet.ui.ita.UtilsDialog({id:'homebusiness-detail-dialog'});
                                //officeDialog.id =;

                                officeDialog.show();
                            }
                            else
                            {
                                me.notifyError(resource.validate.save_title, resource.validate.save_error, __result.errors || []);
                            }
                        },{
                            mask: me.getMask(),
                            msg: "Loading"
                        });
                    }
                },{
                    text : 'Export',
                    icon : 'fa-print',
                    labelCls: 'label label-success',
                    fn : function(record) {
                        var __data = {type:"License",homeBusinessID:record.idHomeBusiness, statusType : record.statusType};
                        $.postJSON(url.export_excel, __data, function (result) {
                            var __result = result || {};
                            console.log("Info Detail",__result);
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
                    },
                    visibled: function (data){
                        var type = data.statusType;
                        //console.log("statusType visibled export >>> ",type);
                        /*if(type=="CAP_MOI" || type=="CAP_DOI")
                        {
                            return true;
                        }*/
                        return true;
                    }
                }]
            }]
        });
        //load grid
        grid = new iNet.ui.grid.Grid({
            id : 'listreportbusiness-grid',
            dataSource : dataSource,
            url: url.view,
            firstLoad: true,
            idProperty : 'uuid',
            pageSize: 10,
            params: {
                dateStart: $formReport.input_dateStart.val().dateToLong(),
                dateEnd: $formReport.input_dateEnd.val().dateToLong(),
                typeTask: $formReport.input_typeTask.getValue()
            },
            convertData: function (data) {
               var _data = data || {};
                // var __items = __data.items || [];

                $.each(_data, function(i, obj){
                    obj.dateSubmit1 = obj.dateSubmit.longToDate();
                    obj.statusTypeName = resource.common[obj.statusType]
                    obj.statusProcessName = resource.common[obj.statusProcess]

                    if(obj.namePeprensent == "")
                    {
                        obj.namePeprensent ="Đang cập nhật ...";
                    }
                });
                console.log("__data__data>>",_data);
                return _data;
            },
            editable: false
        });




        $formReport.button_search.on('click',function(){
            /*var __data = {};
            __data.dateStart =(me.$formReport.input_dateStart.val()||0).dateToLong();
            __data.dateEnd =(me.$formReport.input_dateEnd.val()||0).dateToLong();
            __data.typeTask =me.$formReport.input_typeTask.val();*/
            var __params = {};
            __params.dateStart= $formReport.input_dateStart.val().dateToLong();
            __params.dateEnd= $formReport.input_dateEnd.val().dateToLong();
            __params.lstTypeTask= $formReport.input_typeTask.getValue().toString();
            __params.lstAreaID= $formReport.input_areaBusiness.getValue().toString();
            console.log("__params.lstTypeTask",__params.lstTypeTask);
            console.log("__params.lstAreaID",__params.lstAreaID);
            grid.setParams(__params);
            grid.load();
        });
        $formReport.button_excel.on('click',function(){
            var __params = grid.getParams() || {};
            __params.type = "List";

            $.postJSON(url.export_excel, __params, function (result) {
                var __result = result || {};
                console.log("Info Detail",__result);
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
        iNet.ui.ita.ExportList.superclass.constructor.call(this);


    };

    iNet.extend(iNet.ui.ita.ExportList, iNet.ui.app.widget);
    var wgabc = new iNet.ui.ita.ExportList();
    wgabc.show();


});
