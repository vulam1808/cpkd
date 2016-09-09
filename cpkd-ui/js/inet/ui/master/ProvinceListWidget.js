// #PACKAGE: province-list
// #MODULE: ProvinceListWidget
/**
 * Created by LamLe on 9/8/2016.
 */
$(function() {
    var resource = {
        common: iNet.resources.common
    };

    var url = {
        view: iNet.getUrl('ita/province/load'),
        save: iNet.getUrl('ita/province/save'),
        update: iNet.getUrl('ita/province/update'),
        "delete": iNet.getUrl('ita/province/delete')
    };
    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.ProvinceListWidget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'province-widget';
        /*var abc = this;
        var wgAddProvince = null;

        nut.them.on('click', function(){
            if (wgAddProvince == null)
                wgAddProvince = new iNet.ui.ita.ProvinceAddWidget();

            wgAddProvince.show();
            abc.hide();
        });*/

        iNet.ui.ita.ProvinceListWidget.superclass.constructor.call(this);



        var me= this;

       /* this.show = function(){
            $('#' + me.id).css('display', '');
        };
        this.hide = function(){
            $('#' + me.id).css('display', 'none');
        };*/

        var dataSource = new iNet.ui.grid.DataSource({
            columns : [{
                type : 'selection',
                align: 'center',
                width : 30
            },{
                property : 'code',
                label : resource.common.codeProvince,
                sortable : true,
                type : 'text',
                validate : function(v) {
                    if (iNet.isEmpty(v))
                        return 'Code must not be empty';
                }
            },{
                property : 'name',
                label : resource.common.nameProvince,
                sortable : true,
                type : 'text',
                validate : function(v) {
                    if (iNet.isEmpty(v))
                        return 'Name must not be empty';
                }
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
                        console.log(record);
                        me.grid().edit(record[me.grid().getIdProperty()]);
                    }
                },{
                    text : 'Delete',
                    icon : 'icon-trash',
                    labelCls: 'label label-important',
                    fn : function(record) {
                        me.grid().remove(record[me.grid().getIdProperty()]);
                    }
                }]
            }]
        });

        this.grid = new iNet.ui.grid.Grid({
            id : 'province-grid',
            dataSource : dataSource,
            url: url.view,
            firstLoad: false,
            idProperty : 'uuid',
            pageSize: 10,
            convertData: function (data) {
                var __data = data || {};
                var __items = __data.items || [];
                return __items;
            },
            editable: true
        });

        this.grid.on('save', function(data) {
            var __data = data || {};
            console.log('saved>>', __data);

            $.postJSON(url.save, __data, function (result) {
                var __result = result || {};
                    if(!CommonService.isSuccess(__result))
                    {
                        this.grid.insert(__result);
                        self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                    }
                    else {
                        self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                    }


            });
        }.createDelegate(this));

        this.grid.on('update', function(data, odata) {
            var __data = data || {};

            console.log('updated>>', __data);
            $.postJSON(url.update, __data, function (result) {
                var __result = result || {};
                if(!CommonService.isSuccess(__result))
                {
                    this.grid.update(__result);
                    this.grid.commit();
                    self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                }
                else {
                    self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                }


            });

        }.createDelegate(this));

        this. grid.on('selectionchange', function(sm, data){
            console.log('selectionchange>>', sm, data);
        });

        $('#province-btn-add').on('click', function(){
            this.grid.newRecord();
        }.createDelegate(this));

        $('#employees-btn-add-office').on('click', function(){
            this.fireEvent('addoffice', this);
        }.createDelegate(this));

        $('#employees-btn-add-dialog').on('click', function(){
            this.fireEvent('adddialog', this);
        }.createDelegate(this));
    };

    iNet.extend(iNet.ui.ita.ProvinceListWidget, iNet.ui.Widget);
    var wgProvince = new iNet.ui.ita.ProvinceListWidget();
    wgProvince.show();


});