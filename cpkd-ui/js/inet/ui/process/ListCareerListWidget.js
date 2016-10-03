// #PACKAGE: listcareer-list
// #MODULE: ListCareerListWidget
/**
 * Created by HS on 13/9/2016.
 */
$(function() {
    var resource = {
        common: ita.resources.common,
        validate: ita.resources.validate
    };

    var url = {
        load_cbbcareer: iNet.getUrl('ita/career/load'),
        view: iNet.getUrl('ita/listcareer/load'),
        save: iNet.getUrl('ita/listcareer/save'),
        update: iNet.getUrl('ita/listcareer/update'),
        del: iNet.getUrl('ita/listcareer/delete')
    };
    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.ListCareerListWidget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'listcareer-widget';
        this.idHomeBusiness = __config.idHomeBusiness;
        this.statusType = __config.statusType;
        iNet.ui.ita.ListCareerListWidget.superclass.constructor.call(this);

        var me= this;

        var __careerList = [];
        $.postJSON(url.load_cbbcareer, {}, function (result) {
            var __result = result || {};
            console.log('load__careerList>>', result.items);
            if (CommonService.isSuccess(__result)) {
                __careerList = [];
                $.each(__result.items || [], function (u, item) {
                    __careerList.push({id: item.uuid, code: item.code, name: item.name});
                });
                console.log('load__careerList123>>', __careerList);
                me.grid.load();
            }
        });
        var convertCareerList = function(list){
            var __career = "";
            var idCareer = list || "";
            $.each(__careerList, function(i, obj){
                if (idCareer.indexOf(obj.id.toString()) != -1){
                    if (iNet.isEmpty(obj.name)){
                        obj.name = "empty";
                    }
                    __career = {id: idCareer, code: obj.code, name: obj.name};
                    //__province+='<label class="label label-info" style="margin-right: 5px;">'+obj.name+'</label>';

                    //break;
                }
            });
            return __career;
        };
        var dataSource = new iNet.ui.grid.DataSource({
            columns : [/*{
                type : 'selection',
                align: 'center',
                width : 30
            },*/{
                property : 'career_id',
                label : resource.common.nameCareer,
                sortable : true,
                disabled: false,
                type : 'selectx',
                //editData: __provinceList,
                displayField : 'name',
                valueField: 'id',
                config: {
                    multiple: false,
                    data: [],
                    minimumInputLength: 0,
                    initSelection: function (element, callback) {
                        var id = $(element).val();
                        console.log('load_career_id>>', id);
                        if (id == "") return;
                        var ids = id.split(',');
                        if (__careerList.length > 0) {
                            var __items = [];
                            $.each(__careerList, function(i, obj){
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

                        $.each(__careerList, function () {
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
                 }
                ,{
                    property : 'detail',
                    label : resource.common.detail,
                    sortable : true,
                    type : 'text'

                },{
                label : '',
                type : 'action',
                separate: '&nbsp;',
                align: 'center',
                cls: 'hidden-767',
                buttons : [{
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
            id : 'listcareer-grid',
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
                $.each(__items, function(i, item){
                    item.career_id = convertCareerList(item.career_id);
                    //item.province_ID = convertProvinceList(item.province_ID);
                });
                return __items;
            },
            editable: false
        });

       /* this.grid.on('save', function(data) {
            var __data = data || {};
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
        });*/

        $('#ddd').on('click', function(){
           // me.grid.newRecord();
            listcareerDialog = new iNet.ui.ita.UtilsDialog({id:'listcareer-form-dialog'});
            //officeDialog.id =;

            listcareerDialog.show();
            var __data = {idHomeBusiness:me.idHomeBusiness};

            var wgLCD = new iNet.ui.ita.ListCareerFormDialog(__data);
            wgLCD.show();
        }.createDelegate(this));





    };

    iNet.extend(iNet.ui.ita.ListCareerListWidget, iNet.ui.app.widget);


});