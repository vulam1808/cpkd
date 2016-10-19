/**
 * Created by HS on 3/10/2016.
 */
// #PACKAGE: processbusiness-list
// #MODULE: ProcessBusinessList

$(function() {
    var resource = {
        common: ita.resources.common,
        validate: ita.resources.validate
    };

    var url = {
        view: iNet.getUrl('ita/listbusinessdetail/load'),
        load_infoDetail: iNet.getUrl('ita/homebusiness/loadinfo')
        /* save: iNet.getUrl('ita/areabusiness/save'),
         update: iNet.getUrl('ita/areabusiness/update'),
         del: iNet.getUrl('ita/areabusiness/delete')*/
    };
    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.HomeBusinessList = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'homebusiness-list-widget';
        this.act = iNet.act;
        this.idHomeBusiness = __config.idHomeBusiness;
        console.log("act >>>", iNet.act);


        var me= this;

        var dataSource = new iNet.ui.grid.DataSource({
            columns : [/*{
                type : 'selection',
                align: 'center',
                width : 30
            },*/{
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
                    text : 'Xử lý',
                    icon : 'icon-cogs',
                    labelCls: 'label label-danger',
                    fn : function(record) {
                        if(iNet.act=="PROCESS")
                        {
                            console.log("record >>>>",record);
                            // var __url = iNet.$ctx.page('cpkd/page/process/homeBusinessProcess');
                            var __url = iNet.getUrl('cpkd/page/index')+'#menu-process-homebusines';//?taskID='+record.taskID+'&act='+me.act;
                            iNet.getLayout().parentParams={taskID: record.taskID, act: me.act};
                            iNet.getLayout().window.location.href = __url;

                            console.log("record.taskID",record.taskID);
                        }
                        else if(iNet.act=="PROCESS_TAX")
                        {
                            var __data = {
                                parent_ID:record.parent_ID,
                                statusType:record.statusType,
                                statusProcess:record.statusProcess,
                                taxCode:record.taxCode,
                                taskID :record.taskID,
                                idHomeBusiness :record.idHomeBusiness};
                            var info = new iNet.ui.ita.TaxCodeWidget(__data);
                            //info.show();
                            var officeDialog = new iNet.ui.ita.UtilsDialog({id:'taxcode-widget'});
                            //officeDialog.id =;

                            officeDialog.show();
                        }
                        else if(iNet.act=="PROCESS_ID")
                        {
                            var __data = {
                                parent_ID:record.parent_ID,
                                statusType:record.statusType,
                                statusProcess:record.statusProcess,
                                numberBusiness:record.numberBusiness,
                                idHomeBusiness:record.idHomeBusiness,
                                taskID :record.taskID};
                            var info = new iNet.ui.ita.NumberBusinessWidget(__data);
                            //info.show();
                            var officeDialog = new iNet.ui.ita.UtilsDialog({id:'numberbusiness-widget'});
                            //officeDialog.id =;

                            officeDialog.show();
                        }
                        else if(iNet.act=="DONE")
                        {
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
                                    me.notifyError(me.resource.validate.save_title, me.resource.validate.save_error, __result.errors || []);
                                }
                            });
                        }
                        /*var cm = me.grid.getColumnModel();
                         var __cell = null;
                         __cell = cm.getColumnByName("province_ID").getCellAdd(0);
                         __cell.setDisabled(false);
                         __cell.setValue(me.grid.getIdProperty());*/
                    }
                }]
            }]
        });
        //load grid
        this.grid = new iNet.ui.grid.Grid({
            id : 'listprocessbusiness-grid',
            dataSource : dataSource,
            url: url.view,
            firstLoad: true,
            idProperty : 'uuid',
            pageSize: 10,
            params: {
                act: this.act
            },
            convertData: function (data) {
                var __data = data || {};
               // var __items = __data.items || [];

                $.each(__data, function(i, obj){
                    obj.dateSubmit1 = obj.dateSubmit.longToDate();
                    obj.statusTypeName = resource.common[obj.statusType]
                    if(obj.namePeprensent == "")
                    {
                        obj.namePeprensent ="Đang cập nhật ...";
                    }
                });
                console.log("__data__data>>",__data);
                return __data;
            },
            editable: false
        });

        iNet.ui.ita.HomeBusinessList.superclass.constructor.call(this);


    };

    iNet.extend(iNet.ui.ita.HomeBusinessList, iNet.ui.app.widget);
    var wgabc = new iNet.ui.ita.HomeBusinessList();
    wgabc.show();


});
