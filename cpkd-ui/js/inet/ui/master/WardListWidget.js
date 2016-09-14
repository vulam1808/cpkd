// #PACKAGE: ward-list
// #MODULE: WardListWidget
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
        load_district: iNet.getUrl('ita/district/load'),
        view: iNet.getUrl('ita/ward/load'),
        save: iNet.getUrl('ita/ward/save'),
        update: iNet.getUrl('ita/ward/update'),
        del: iNet.getUrl('ita/ward/delete')
    };
    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.WardListWidget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'ward-widget';
        /*var abc = this;
         var wgAddProvince = null;

         nut.them.on('click', function(){
         if (wgAddProvince == null)
         wgAddProvince = new iNet.ui.ita.ProvinceAddWidget();

         wgAddProvince.show();
         abc.hide();
         });*/

        iNet.ui.ita.WardListWidget.superclass.constructor.call(this);



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

            if (CommonService.isSuccess(__result)) {
                __provinceList = [];
                $.each(__result.items || [], function (u, item) {
                    __provinceList.push({id: item.uuid, code: item.code, name: item.name});
                });
                console.log('__provinceList>>', __provinceList);
                loadDistrict();


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
        var __districtList = [];
        var loadDistrict = function () {

            $.postJSON(url.load_district, {}, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    __districtList = [];
                    $.each(__result.items || [], function (u, item) {
                        __districtList.push({id: item.uuid, code: item.code,idProvince: item.province_ID, name: item.name});
                    });
                    console.log('__districtList>>', __districtList);
                    me.grid.load();
                }
            });
        };

        var convertDistrictList = function(list){
            var __district = "";
            var idDistrict = list || "";
            $.each(__districtList, function(i, obj){
                if (idDistrict.indexOf(obj.id.toString()) != -1){
                    if (iNet.isEmpty(obj.name)){
                        obj.name = "empty";
                    }
                    __district = {id: idDistrict, code: obj.code,idProvince: obj.province_ID, name: obj.name};
                    //__province+='<label class="label label-info" style="margin-right: 5px;">'+obj.name+'</label>';

                    //break;
                }
            });
            return __district;
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
                property : 'district_ID',
                label : resource.common.district,
                sortable : true,
                disabled: false,
                type : 'selectx',
                editData: __districtList,
                displayField : 'name',
                valueField: 'id',
                config: {
                    multiple: false,
                    data: [],
                    minimumInputLength: 0,
                    initSelection: function (element, callback) {
                        var id = $(element).val();
                        if (id == "") return;
                        if (__districtList.length > 0) {
                            var __items = [];
                            $.each(__districtList, function(i, obj){
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

                        $.each(__districtList, function () {
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
                label : resource.common.ward,
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
            id : 'ward-grid',
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
                    item.district_ID = convertDistrictList(item.district_ID);
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
                    __result.district_ID = convertDistrictList(__result.district_ID);
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
                    __result.district_ID = convertDistrictList(__result.district_ID);
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

        $('#ward-btn-add').on('click', function(){
            me.grid.newRecord();
            var cm = me.grid.getColumnModel();
            var __cell = null;
            __cell = cm.getColumnByName("province_ID").getCellAdd(1);
            __cell.setDisabled(false);
            __cell.setValue("");
            __cell = cm.getColumnByName("district_ID").getCellAdd(1);
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

    iNet.extend(iNet.ui.ita.WardListWidget, iNet.ui.app.widget);
    var wgProvince = new iNet.ui.ita.WardListWidget();
    wgProvince.show();


});