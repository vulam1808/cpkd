// #PACKAGE: district-list
// #MODULE: DistrictListWidget
/**
 * Created by LamLe on 9/8/2016.
 */
$(function() {
    var resource = {
        common: ita.resources.common,
        validate: ita.resources.validate
    };

    var url = {
        load_province: iNet.getUrl('ita/province/load'),
        view: iNet.getUrl('ita/district/load'),
        save: iNet.getUrl('ita/district/save'),
        update: iNet.getUrl('ita/district/update'),
        del: iNet.getUrl('ita/district/delete')
    };
    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.DistrictListWidget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'district-widget';
        /*var abc = this;
         var wgAddProvince = null;

         nut.them.on('click', function(){
         if (wgAddProvince == null)
         wgAddProvince = new iNet.ui.ita.ProvinceAddWidget();

         wgAddProvince.show();
         abc.hide();
         });*/

        iNet.ui.ita.DistrictListWidget.superclass.constructor.call(this);



        var me= this;

        /* this.show = function(){
         $('#' + me.id).css('display', '');
         };
         this.hide = function(){
         $('#' + me.id).css('display', 'none');
         };*/
        var __provinceList = [];
        $.postJSON(url.load_province, {}, function (result) {
            var __result = result || {};
           console.log('load_province>>', result.items);
            if (CommonService.isSuccess(__result)) {
                __provinceList = [];
                $.each(__result.items || [], function (u, item) {
                    __provinceList.push({id: item.uuid, code: item.code, name: item.name});
                });
                console.log('load_province123>>', __provinceList);
                me.grid.load();
            }
        });
        var convertProvinceList = function(list){
            var __province = "";
            var idProvince = list || "";
            $.each(__provinceList, function(i, obj){
                if (idProvince.indexOf(obj.id.toString()) != -1){
                    if (iNet.isEmpty(obj.name)){
                        obj.name = "empty";
                    }
                    __province = {id: idProvince, code: obj.code, name: obj.name};
                    //__province+='<label class="label label-info" style="margin-right: 5px;">'+obj.name+'</label>';

                    //break;
                }
            });
            return __province;
        };
        var dataSource = new iNet.ui.grid.DataSource({
            columns : [/*{
                type : 'selection',
                align: 'center',
                width : 30
            },*/{
                property : 'province_ID',
                label : resource.common.province,
                sortable : true,
                disabled: false,
                type : 'selectx',
                editData: __provinceList,
                displayField : 'name',
                valueField: 'id',
                config: {
                    multiple: false,
                    data: [],
                    minimumInputLength: 0,
                    initSelection: function (element, callback) {
                        var id = $(element).val();
                        console.log('load_province_id>>', id);
                        if (id == "") return;
                        var ids = id.split(',');
                        if (__provinceList.length > 0) {
                            var __items = [];
                            $.each(__provinceList, function(i, obj){
                                if (ids.indexOf(obj.id.toString()) != -1){
                                    if (iNet.isEmpty(obj.name)){
                                        obj.name = "empty";
                                    }
                                    callback(obj);
                                    //__items.push(obj);
                                }
                            });
                            //callback(__items);
                        }
                    },
                    formatResult: function (item) {
                        return item.name;
                    },
                    formatSelection: function (item) {
                        return item.name;
                    },
                    query: function (query) {
                        var data = {results: []};

                        $.each(__provinceList, function () {
                            if (query.term.length == 0 || this.name.toUpperCase().indexOf(query.term.toUpperCase()) >= 0) {
                                data.results.push({id: this.id, name: this.name });
                            }
                        });

                        query.callback(data);
                    },
                    escapeMarkup: function (m) {
                        return m;
                    }
                },
                validate: function (v) {
                    if ($.trim(v) == '')
                        return String.format(resource.validate.is_not_blank, resource.commission.authorizedPerson);
                }
            },{
                property : 'name',
                label : resource.common.district,
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
                        me.grid.edit(record[me.grid.getIdProperty()]);
                        /*var cm = me.grid.getColumnModel();
                        var __cell = null;
                        __cell = cm.getColumnByName("province_ID").getCellAdd(0);
                        __cell.setDisabled(false);
                        __cell.setValue(me.grid.getIdProperty());*/
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

        this.grid = new iNet.ui.grid.Grid({
            id : 'district-grid',
            dataSource : dataSource,
            url: url.view,
            firstLoad: false,
            idProperty : 'uuid',
            pageSize: 10,
            convertData: function (data) {
                var __data = data || {};
                var __items = __data.items || [];
                $.each(__items, function(i, item){
                    item.province_ID = convertProvinceList(item.province_ID);
                    //item.province_ID = convertProvinceList(item.province_ID);
                });
                return __items;
            },
            editable: false
        });

        this.grid.on('save', function(data) {
            var __data = data || {};
            __data.province_ID = __data.province_ID.toString();
            console.log('saved>>', __data);

            $.postJSON(url.save, __data, function (result) {
                var __result = result || {};

                if (CommonService.isSuccess(__result)) {
                    __result.province_ID = convertProvinceList(__result.province_ID);
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
            $.postJSON(url.update, __data, function (obj) {
                var __result = obj || {};
                if (CommonService.isSuccess(__result)) {
                    __result.province_ID = convertProvinceList(__result.province_ID);
                    console.log('updated123>>', __result);
                    me.grid.update(__result);
                    me.grid.commit();
                    me.notifySuccess(resource.validate.save_title, resource.validate.update_success);
                } else {

                    me.notifyError(resource.validate.save_title, me.getNotifyContent(resource.validate.update_error, __result.errors || []));
                }



            });

        }.createDelegate(this));

      /*  this.grid.on('selectionchange', function(sm, data){
            console.log('selectionchange>>', sm, data);
        });*/

        $('#district-btn-add').on('click', function(){
            me.grid.newRecord();
            var cm = me.grid.getColumnModel();
            var __cell = null;
            __cell = cm.getColumnByName("province_ID").getCellAdd(1);
            __cell.setDisabled(false);
            __cell.setValue("");
        }.createDelegate(this));

        /*  $('#employees-btn-add-office').on('click', function(){
         this.fireEvent('addoffice', this);
         }.createDelegate(this));

         $('#employees-btn-add-dialog').on('click', function(){
         this.fireEvent('adddialog', this);
         }.createDelegate(this));*/
    };

    iNet.extend(iNet.ui.ita.DistrictListWidget, iNet.ui.app.widget);
    var wgProvince = new iNet.ui.ita.DistrictListWidget();
    wgProvince.show();


});