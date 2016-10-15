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
        view: iNet.getUrl('ita/listbusinessdetail/load')
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
                property : 'dateSubmit',
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
                    text : 'Edit',
                    icon : 'icon-pencil',
                    labelCls: 'label label-info',
                    fn : function(record) {
                        console.log("record >>>>",record);
                       // var __url = iNet.$ctx.page('cpkd/page/process/homeBusinessProcess');
                        var __url = iNet.getUrl('cpkd/page/index')+'#menu-process-homebusines';//?taskID='+record.taskID+'&act='+me.act;
                        iNet.getLayout().parentParams={taskID: record.taskID, act: me.act};
                        iNet.getLayout().window.location.href = __url;

                        console.log("record.taskID",record.taskID);
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
                    obj.statusTypeName = resource.common[obj.statusType]
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
