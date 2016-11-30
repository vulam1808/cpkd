// #PACKAGE: iworkflow-ui-wf-actor-map-list-service
// #MODULE: WFActorMapListService
$(function () {
    iNet.ns("iNet.ui.workflow", "iNet.ui.workflow.WFActorMapList");

    iNet.ui.workflow.WFActorMapList = function () {
        this.id = 'actor-map-list-div';
        console.log(">>>> C,E,D,V >>>> ", roleCreate, roleEdit, roleDelete, roleView);
        var __zone = iNet.zone;
        var __context = iNet.context;

        var self = this;
        var deleteData = {};
        var resource = {
            actormap: iNet.resources.workflow.actormap,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            CREATE: $('#actor-map-list-create-btn'),
            DELETE: $('#actor-map-list-delete-btn')
        };
        $toolbar.DELETE.hide();
        if (roleCreate) { $toolbar.CREATE.show(); } else { $toolbar.CREATE.hide(); }

        var url = {
            view: iNet.getUrl('firmtask/actormap/list'), //zone
            create: iNet.getUrl('firmtask/actormap/create'),
            del: iNet.getUrl('firmtask/actormap/delete'),

            load_actor: iNet.getUrl('cloud/workflow/alias/list'), //zone, context
            load_user: iNet.getUrl('system/account/role')
        };

        var __userList = [];
        $.postJSON(url.load_user, {}, function (result) {
            var __result = result || {};
            if (CommonService.isSuccess(__result)) {
                __userList = [];
                $.each(__result.items || [], function (u, user) {
                    __userList.push({id: user.username, code: user.username, name: user.fullname});
                });
                dataSource = getDatasource();
                grid.setDataSource(dataSource);
                grid.load();
            }
        });

        var confirmDialog = this.confirmDialog(
            iNet.resources.message.dialog_confirm_title, self.getNotifyContent(resource.constant.del_content, deleteData.name), function () {
                if (!iNet.isEmpty(deleteData.id)) {
                    confirmDialog.hide();
                    var params = {
                        zone: __zone,
                        context: __context,
                        actor: deleteData.id
                    };
                    $.postJSON(url.del, params, function (result) {
                        var __result = result || {};
                        if (CommonService.isSuccess(__result)) {
                            var __arrays = deleteData.gridId.split(",");
                            for (var i = 0; i < __arrays.length; i++) {
                                grid.remove(__arrays[i]);
                            }
                            deleteData = {};
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

        var getDatasource = function(){
            return new DataSource({
                columns: [
                    /*{
                        property : 'actor',
                        label : resource.actormap.actor,
                        sortable : true,
                        disabled : true,
                        type: 'text',
                        width : 150
                    },*/
                    {
                        property: 'name',
                        label: resource.actormap.name,
                        sortable: true,
                        type: 'text'
                    },
                    {
                        label: '',
                        type: 'action',
                        width: 32,
                        align: 'center',
                        buttons: [
                            {
                                text: resource.actormap.map,
                                icon: 'icon-cogs',
                                labelCls: 'label label-success',
                                fn: function (record) {
                                    self.hide();
                                    modal = createModal();
                                    modal.loadData(record);
                                    modal.setPageBack(self);
                                    modal.show();
                                }
                            },
                            {
                                text: iNet.resources.message.button.del,
                                icon: 'icon-trash',
                                labelCls: 'label label-important',
                                fn: function (record) {
                                    deleteData.id = record.actor.toString();
                                    deleteData.gridId = record.uuid.toString();
                                    deleteData.name = record.name;
                                    confirmDialog.setContent(String.format(resource.constant.del_content, deleteData.name));
                                    confirmDialog.show();
                                }
                            }
                        ]
                    }
                ],
                delay: 250
            });
        };
        var dataSource = getDatasource();

        var grid = new iNet.ui.grid.Grid({
            id: 'actor-map-list-grid',
            url: url.view,
            params: {zone: __zone, context: __context},
            convertData: function (data) {
                var __data = data || {};
                //grid.setTotal(__data.total);
                var items = __data.items || [];
                return items;
            },
            dataSource: dataSource,
            stretchHeight: false,
            editable: true,
            firstLoad: true,
            idProperty: 'uuid'
        });

        grid.on('save', function (data) {
            var __data = data || {};
            if (iNet.isEmpty(__data.name)){
                return;
            }

            __data.zone = __zone;
            __data.context= __context;
            __data.actor = 'actor' + iNet.generateId().substring(0, 6);
            $.postJSON(url.create, __data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    grid.insert(__result);
                    //newRecord();
                    self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                } else {
                    self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                }
            });
        });

        grid.on('update', function (newData, oldData) {
            var __data = iNet.apply(oldData, newData) || {};
            if (iNet.isEmpty(__data.name)){
                return;
            }
            __data.zone = __zone;
            __data.context= __context;
            __data.mapid = __data.uuid;
            __data.member = __data.members.join(iNet.splitChar);

            delete __data.members;

            $.postJSON(url.create, __data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    grid.load();
                    self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                } else {
                    self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                }
            });
        });

        grid.on('blur', function (action, control) {
        });

        grid.on('selectionchange', function (sm, data) {
        });

        // ************************************** EVENT
        var modal = null;
        var createModal = function(){
            if (modal == null){
                modal = new iNet.ui.workflow.WFActorMap();
                modal.on("finish", function () {
                    if (!(roleView || roleCreate)) return;
                    grid.load();
                });
            }
            return modal;
        };

        var newRecord = function(){
            /*self.hide();
            modal = createModal();
            modal.loadData();
            modal.setPageBack(self);
            modal.show();*/
            grid.newRecord();
            var cm = grid.getColumnModel();
            /*var __cell = cm.getColumnByName("actor").getCellAdd(1);
            __cell.setDisabled(false);
            __cell.setValue("");*/
            var __cell = cm.getColumnByName("name").getCellAdd(1);
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

        iNet.ui.workflow.WFActorMapList.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.workflow.WFActorMapList, iNet.ui.app.widget);

    var widget = new iNet.ui.workflow.WFActorMapList();
    widget.show();
});
