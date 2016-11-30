// #PACKAGE: xgate-ui-procedure-dictadditional-service
// #MODULE: XGateProcedureDictAdditionalService
$(function () {
    iNet.ns("iNet.ui.admin", "iNet.ui.admin.ProcedureDictAdditional");

    iNet.ui.admin.ProcedureDictAdditional = function () {
        this.id = 'procedure-dictadditional-div';
        var self = this;
        var parentPage = null;

        var resource = {
            procedure: iNet.resources.xgate.admin.procedure,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            BACK: $('#procedure-dictadditional-back-btn'),
            ADD: $('#procedure-dictadditional-add-btn')
        };

        var url = {
            listAdd: iNet.getUrl('onegate/dictadditional/list'), //procedure
            createAdd: iNet.getUrl('onegate/dictadditional/create'), //procedureID, fieldName, brief, system
            updateAdd: iNet.getUrl('onegate/dictadditional/update'), //additional
            deleteAdd: iNet.getUrl('onegate/dictadditional/delete') //additional
        };

        var  dataSource = new DataSource({
            columns: [
                /*{
                    property: 'fieldName',
                    label: resource.procedure.fieldName,
                    type: 'text',
                    sortable: true,
                    disabled: true
                },*/
                {
                    property: 'brief',
                    label: resource.procedure.brief,
                    type: 'text',
                    sortable: true
                },
                {
                    property: 'system',
                    label: resource.procedure.system,
                    type: 'checkbox',
                    sortable: true,
                    disabled: true,
                    width: 130
                },
                {
                    label: '',
                    type: 'action',
                    width: 32,
                    align: 'center',
                    buttons: [
                        {
                            text: iNet.resources.message.button.del,
                            icon: 'icon-trash',
                            labelCls: 'label label-important',
                            fn: function (record) {
                                $.postJSON(url.deleteAdd, {additional: record.uuid}, function(result){
                                     grid.remove(record.uuid);
                                     grid.load();
                                })
                            },
                            visibled: function(record){
                                return !record.system;
                            }
                        }
                    ]
                }
            ],
            delay: 250
        });

        var  grid = new iNet.ui.grid.Grid({
            id: 'procedure-dictadditional-grid',
            url: url.listAdd,
            firstLoad: false,
            dataSource:  dataSource,
            convertData: function (data) {
                var __data = data || {};
                $(__data.items || []).each(function(i, item){
                    if (iNet.isEmpty(item.brief)){
                        item.brief = item.fieldName;
                    }
                });
                //grid.setTotal(__data.total);
                return __data.items;
            },
            stretchHeight: false,
            editable: true,
            idProperty: 'uuid'
        });

        grid.on('save', function (data) {
            var __data = data || {};
            if (iNet.isEmpty(__data.brief)){
                return;
            }

            __data.fieldName = 'file' + iNet.generateId().substring(0, 6);
            __data.procedureID = ( grid.getParams() || {}).procedure;
            $.postJSON(url.createAdd, __data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                     grid.insert(__result);
                    self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                } else {
                    self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                }
            });
        });

        grid.on('update', function (newData, oldData) {
            var __data = iNet.apply(oldData, newData) || {};
            if (iNet.isEmpty(__data.brief)){
                return;
            }

            __data.procedureID = (grid.getParams() || {}).procedure;
            __data.additional = __data.uuid;
            $.postJSON(url.updateAdd, __data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                     grid.update(__result);
                     grid.commit();
                    self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                } else {
                    self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                }
            }, {
                msg: iNet.resources.ajaxLoading.updating,
                mask: self.getMask()
            });
        });

        grid.on('blur', function (action, control) {
            if (action == 'update') {
                 grid.endEdit();
            } else {
                control.save();
            }
        });

        grid.on('beforeedit', function (record, rowIndex) {
            var __state = iNet.isEmpty(record.uuid);
            var __cm =  grid.getColumnModel();
            /*var __cellFieldName = __cm.getColumnByName("fieldName").getCellEditor(rowIndex, __state);
            __cellFieldName.setDisabled(record.system);*/
        });

        this.loadById = function(data){
            var __data = data || {};
            grid.setParams({procedure: __data.uuid});
            grid.load();
        };
        this.setPageBack = function(page){
            parentPage = page;
        };

        $toolbar.BACK.on('click', function(){
            if (parentPage != null) {
                self.hide();
                parentPage.show();
            }
            self.fireEvent('back');
        }.createDelegate(this));
        $toolbar.ADD.on('click', function(){
            grid.newRecord({system: false});
            var cm =  grid.getColumnModel();
            /*var cell01 = cm.getColumnByName("fieldName").getCellAdd(1);
            cell01.setDisabled(false);
            cell01.setValue("");*/
            var cell02 = cm.getColumnByName("brief").getCellAdd(1);
            cell02.setDisabled(false);
            cell02.setValue("");
            var cell03 = cm.getColumnByName("system").getCellAdd(1);
            cell03.setDisabled(true);
        });

        iNet.ui.admin.ProcedureDictAdditional.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.admin.ProcedureDictAdditional, iNet.ui.app.widget);
});
