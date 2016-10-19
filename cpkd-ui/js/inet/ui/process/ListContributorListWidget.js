// #PACKAGE: listcontributor-list
// #MODULE: ListContributorListWidget
/**
 * Created by HS on 13/9/2016.
 */
$(function() {

    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.ListContributorListWidget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'listcontributor-widget';
        this.idHomeBusiness = __config.idHomeBusiness;
        this.statusType = __config.statusType;
        var me= this;
        $('#'+me.id + ' #listcontributor-grid').prop('id', 'listcontributor-grid-'+me.id );
        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };

        var url = {
            view: iNet.getUrl('ita/listcontributor/load'),
            save: iNet.getUrl('ita/listcontributor/save'),
            update: iNet.getUrl('ita/listcontributor/update'),
            del: iNet.getUrl('ita/listcontributor/delete')
        };


        /*var abc = this;
        var wgAddProvince = null;

        nut.them.on('click', function(){
            if (wgAddProvince == null)
                wgAddProvince = new iNet.ui.ita.ProvinceAddWidget();

            wgAddProvince.show();
            abc.hide();
        });*/

        iNet.ui.ita.ListContributorListWidget.superclass.constructor.call(this);




        var dataSource = new iNet.ui.grid.DataSource({
            columns : [/*{
                type : 'selection',
                align: 'center',
                width : 30
            },*/{
                property : 'name',
                label : resource.common.name,
                sortable : true,
                type : 'text',
                validate : function(v) {
                    if (iNet.isEmpty(v))
                        return 'Name must not be empty';
                }
            }
                ,{
                    property : 'idnumber',
                    label : resource.common.idnumber,
                    sortable : true,
                    type : 'text',
                    validate : function(v) {
                        if (iNet.isEmpty(v))
                            return 'CMND must not be empty';
                    }
                }
                ,{
                    property : 'permanentAddress',
                    label : resource.common.permanentAddress,
                    sortable : true,
                    type : 'text',
                    validate : function(v) {
                        if (iNet.isEmpty(v))
                            return 'permanentAddress must not be empty';
                    }
                }
                ,{
                    property : 'capitalValue',
                    label : resource.common.capitalValue,
                    sortable : true,
                    type : 'text',
                    validate : function(v) {
                        if (iNet.isEmpty(v))
                            return 'capitalValue must not be empty';
                    }
                }
                ,{
                    property : 'capitalProportion',
                    label : resource.common.capitalProportion,
                    sortable : true,
                    type : 'text',
                    validate : function(v) {
                        if (iNet.isEmpty(v))
                            return 'capitalProportion must not be empty';
                    }
                }
                ,{
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
                        console.log(record);
                        me.grid.edit(record[me.grid.getIdProperty()]);
                    }
                },{
                    text : 'Delete',
                    icon : 'icon-trash',
                    labelCls: 'label label-important',
                    fn : function(record) {
                        var __data = record || {};

                        var params = {
                            uuid: record[me.grid.getIdProperty()]
                        };
                        console.log('delete>>', params);
                        $.postJSON(url.del, params, function (result) {
                            var __result = result || {};
                            if (CommonService.isSuccess(__result)) {
                                me.grid.remove(record[me.grid.getIdProperty()]);
                                me.notifySuccess(resource.validate.save_title, resource.validate.delete_success);
                            } else {

                                me.notifyError(resource.validate.save_title, me.getNotifyContent(resource.validate.delete_error, __result.errors || []));
                            }
                        });

                    }
                }]
            }]
        });
        //load grid
        this.grid = new iNet.ui.grid.Grid({
            id : 'listcontributor-grid-'+me.id,
            dataSource : dataSource,
            url: url.view,
            firstLoad: true,
            idProperty : 'uuid',
            pageSize: 10,
            params: {
                idHomeBusiness: me.idHomeBusiness,
                statusType: me.statusType
            },
            convertData: function (data) {
                var __data = data || {};
                var __items = __data.items || [];
                return __items;
            },
            editable: false
        });

        this.grid.on('save', function(data) {
            var __data = data || {};
            __data.idHomeBusiness = me.idHomeBusiness;
            __data.statusType = me.statusType;
            console.log('saved>>', __data);

            $.postJSON(url.save, __data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    me.grid.insert(__result);
                    me.notifySuccess(resource.validate.save_title, resource.validate.save_success);
                } else {
                    me.grid.newRecord();
                    me.notifyError(resource.validate.save_title, me.getNotifyContent(resource.validate.save_error, __result.errors || []));
                }
            });
        }.createDelegate(this));

        this.grid.on('update', function(data, odata) {
            var __data = data || {};

            console.log('updated>>', __data);
            $.postJSON(url.update, __data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    me.grid.update(__result);
                    me.grid.commit();
                    me.notifySuccess(resource.common.save_title, resource.common.update_success);
                } else {

                    me.notifyError(resource.common.save_title, me.getNotifyContent(resource.common.update_error, __result.errors || []));
                }



            });

        }.createDelegate(this));

        this.grid.on('selectionchange', function(sm, data){
            console.log('selectionchange>>', sm, data);
        });

        $('#'+me.id + ' #listcontributor-btn-add').on('click', function(){
            me.grid.newRecord();
        }.createDelegate(this));





    };

    iNet.extend(iNet.ui.ita.ListContributorListWidget, iNet.ui.app.widget,{
        setHideButtonAdd: function () {
            $('#'+this.id + ' #listcontributor-btn-add').hide();
        }
    });


});