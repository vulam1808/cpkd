// #PACKAGE: iworkflow-ui-wf-actor-list-service
// #MODULE: WFActorListService
$(function () {
    iNet.ns("iNet.ui.workflow", "iNet.ui.workflow.WFActorList");

    iNet.ui.workflow.WFActorList = function () {
        this.id = 'actor-list-div';
        console.log(">>>> C,E,D,V >>>> ", roleCreate, roleEdit, roleDelete, roleView);
        var __zone = iNet.zone;
        var __context = iNet.context;

        var self = this;
        var deleteIds = null;
        var deleteName = null;
        var resource = {
            actor: iNet.resources.workflow.actor,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            CREATE: $('#actor-list-create-btn'),
            DELETE: $('#actor-list-delete-btn')
        };
        $toolbar.DELETE.hide();
        if (roleCreate) { $toolbar.CREATE.show(); } else { $toolbar.CREATE.hide(); }

        var url = {
            view: iNet.getUrl('cloud/workflow/alias/list'), //zone
            create: iNet.getUrl('cloud/workflow/alias/create'),
            update: iNet.getUrl('cloud/workflow/alias/update'),
            del: iNet.getUrl('cloud/workflow/alias/delete')
        };

        var confirmDialog = this.confirmDialog(
            iNet.resources.message.dialog_confirm_title, self.getNotifyContent(resource.constant.del_content, deleteName), function () {
                if (!iNet.isEmpty(deleteIds)) {
                    confirmDialog.hide();
                    var params = {
                        zone: __zone,
                        context: __context,
                        actor: deleteName
                    };
                    $.postJSON(url.del, params, function (result) {
                        var __result = result || {};
                        if (CommonService.isSuccess(__result)) {
                            var __arrays = deleteIds.split(",");
                            for (var i = 0; i < __arrays.length; i++) {
                                grid.remove(__arrays[i]);
                            }
                            deleteIds = null;
                            $toolbar.DELETE.hide();
                            self.notifySuccess(resource.constant.del_title, resource.constant.del_success);
                        } else {
                            self.notifyError(resource.constant.del_title, self.getNotifyContent(resource.constant.del_error, __result.errors || []));
                        }
                    }, {
                        mask: self.getMask(),
                        msg: iNet.resources.ajaxLoading.deleting
                    });
                }
            });


        var dataSource = new DataSource({
            columns: [
                {
                    property : 'name',
                    label : resource.actor.name,
                    disabled : true,
                    sortable : true,
                    type: 'text',
                    validate: function (v) {
                        if ($.trim(v) == '')
                            return String.format(resource.validate.is_not_blank, resource.actor.name);
                    },
                    width : 150
                },
                {
                    property : 'position',
                    label : resource.actor.position,
                    disabled : true,
                    sortable : true,
                    type: 'text',
                    width : 150
                },
                {
                    property : 'brief',
                    label : resource.actor.brief,
                    disabled : true,
                    sortable : true,
                    type: 'text',
                    width : 150
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
                                deleteIds = record.uuid.toString();
                                deleteName = record.name;
                                confirmDialog.setContent(String.format(resource.constant.del_content, deleteName));
                                confirmDialog.show();
                            },
                            visibled: function (data) {
                                /*var __data = data || {};
                                if (roleDelete) {
                                    return true;
                                }*/
                                return false;
                            }
                        }
                    ]
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'actor-list-grid',
            url: url.view,
            params: {},
            convertData: function (data) {
                var __data = data || {};
                grid.setTotal(__data.total);
                var items = __data.items || [];
                $.each(items, function(i, item){
                    item.name = item.code;
                    item.position = (item.attribute || {}).position;
                    item.brief = (item.attribute || {}).brief;
                });
                return items;
            },
            dataSource: dataSource,
            stretchHeight: false,
            editable: roleEdit,
            firstLoad: roleView,
            hideHeader: !roleView,
            hideSearch: !roleView,
            idProperty: 'uuid'
        });
        if (!roleView) { grid.loadData([]); }

        grid.on('save', function (data) {
            var __data = data || {};
            __data.code = __data.name;
            $.postJSON(url.create, __data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    __result.name = __result.code;
                    __result.position = (__result.attribute || {}).position;
                    __result.brief = (__result.attribute || {}).brief;
                    grid.insert(__result);
                    newRecord();
                    self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                } else {
                    self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                }
            });
        });

        grid.on('update', function (newData, oldData) {
            var __data = iNet.apply(oldData, newData) || {};
            $.postJSON(url.update, __data, function (result) {
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

        grid.on('selectionchange', function (sm, data) {
            var records = sm.getSelection();
            var count = records.length;
            var ids = [];
            var names = [];
            for (var i = 0; i < count; i++) {
                var __record = records[i];
                ids.push(__record.uuid);
                names.push(__record.name);
            }
            if (ids.length > 0 && roleDelete) { $toolbar.DELETE.show(); } else { $toolbar.DELETE.hide(); }
            deleteIds = ids.join(iNet.splitChar);
            deleteName = names.join(iNet.splitChar);
        });

        // ************************************** EVENT

        var newRecord = function(){
            grid.newRecord();
            var cm = grid.getColumnModel();
            var __cell = cm.getColumnByName("name").getCellAdd(1);
            __cell.setDisabled(false);
            __cell.setValue("");
            var __cell = cm.getColumnByName("position").getCellAdd(1);
            __cell.setDisabled(false);
            __cell.setValue("");
            var __cell = cm.getColumnByName("brief").getCellAdd(1);
            __cell.setDisabled(false);
            __cell.setValue("");
        };

        var onCreate = function () {
            $toolbar.DELETE.hide();
            newRecord();
        };

        var onDelete = function () {
            confirmDialog.setContent(iNet.resources.message.dialog_confirm_selected_content);
            confirmDialog.show();
        };

        $toolbar.CREATE.on("click", onCreate);
        $toolbar.DELETE.on("click", onDelete);

        iNet.ui.workflow.WFActorList.superclass.constructor.call(this);
    }

    iNet.extend(iNet.ui.workflow.WFActorList, iNet.ui.app.widget);

    var widget = new iNet.ui.workflow.WFActorList();
    widget.show();
});
