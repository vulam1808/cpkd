// #PACKAGE: iworkflow-ui-wf-graph-process-list-service
// #MODULE: WFGraphProcessListService
$(function () {
    iNet.ns("iNet.ui.workflow", "iNet.ui.workflow.WFGraphProcessList", "iNet.ui.workflow.WFGraphProcessCopy");

    iNet.ui.workflow.WFGraphProcessCopy = function () {
        this.id = 'graph-process-list-modal-copy';
        var $dialog =  $('#graph-process-list-modal-copy');
        var self = this;

        var $form = {
            name: $('#graph-process-list-modal-copy-name')
        };

        var $button = {
            submit: $('#graph-process-list-modal-copy-submit-btn'),
            close: $('#graph-process-list-modal-copy-close-btn')
        };

        this.show = function () {
            $form.name.val('');
            $dialog.modal('show');
        };
        this.hide = function () {
            $dialog.modal('hide');
        };

        var onSubmit = function(){
            self.fireEvent('finish', $form.name.val());
            self.hide();
        }.createDelegate(this);

        var onClose = function(){
            self.hide();
        };

        $button.submit.on('click', onSubmit);
        $button.close.on('click', onClose);
    };

    iNet.extend(iNet.ui.workflow.WFGraphProcessCopy, iNet.Component);
    
    iNet.ui.workflow.WFGraphProcessList = function () {
        this.id = 'graph-process-list-div';
        var __zone = iNet.zone;
        var __context = iNet.context;
        var self = this;
        var wgGraphProcessCopy = null;
        var deleteIds = null;
        var deleteName = null;
        var resource = {
            graphprocess: iNet.resources.workflow.graphprocess,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            CREATE: $('#graph-process-list-create-btn'),
            DELETE: $('#graph-process-list-delete-btn'),
            COPY: $('#graph-process-list-copy-btn')
        };
        $toolbar.DELETE.hide();
        $toolbar.COPY.hide();
        if (roleCreate) { $toolbar.CREATE.show(); } else { $toolbar.CREATE.hide(); }

        var url = {
            view: iNet.getUrl('cloud/workflow/defproc/list'), //zone, version
            create: iNet.getUrl('cloud/workflow/defproc/create'),
            update: iNet.getUrl('cloud/workflow/defproc/update'),
            del: iNet.getUrl('cloud/workflow/defproc/delete'),
            published: iNet.getUrl('cloud/workflow/defproc/published'),
            detach: iNet.getUrl('firmtask/uiform/detach'), // old service --> cloud/workflow/process/detach
            assign: iNet.getUrl('firmtask/process/assign'), //userAllowed //old service --> cloud/workflow/process/assign
            copy: iNet.getUrl('cloud/workflow/defproc/copy'), //process,name
            metaupdate: iNet.getUrl('cloud/workflow/defproc/metaupdate')
        };

        var confirmDialog = this.confirmDialog(
            iNet.resources.message.dialog_confirm_title, self.getNotifyContent(resource.constant.del_content, deleteName), function () {
                if (!iNet.isEmpty(deleteIds)) {
                    confirmDialog.hide();
                    var params = {
                        zone: __zone,
                        context: __context,
                        process: deleteIds
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

        var __processType = [
            {value: 'AUTOMATIC', text: resource.graphprocess['ProcessType.AUTOMATIC']},
            {value: 'MANUAL', text: resource.graphprocess['ProcessType.MANUAL']},
            {value: 'SEMI_AUTOMATIC', text: resource.graphprocess['ProcessType.SEMI_AUTOMATIC']}
        ];
        var __versionState = [
            {value: 'DESIGN', text: resource.graphprocess['VersionState.DESIGN']},
            /*{value: 'TESTING', text: resource.graphprocess['VersionState.TESTING']},*/
            {value: 'PRODUCTION', text: resource.graphprocess['VersionState.PRODUCTION']}/*,
            {value: 'ARCHIVED', text: resource.graphprocess['VersionState.ARCHIVED']}*/
        ];

        var dataSource = new DataSource({
            columns: [
                {
                    property : 'name',
                    label : resource.graphprocess.name,
                    sortable : true,
                    disabled: true,
                    type : 'text',
                    validate: function (v) {
                        if ($.trim(v) == '')
                            return String.format(resource.validate.is_not_blank, resource.graphprocess.name);
                    }
                },
                {
                    property: 'brief',
                    label: resource.graphprocess.brief,
                    sortable: true,
                    type: 'text'
                },
                /*{
                    property : 'type',
                    label : resource.graphprocess.type,
                    type : 'select',
                    disabled: true,
                    editData : __processType,
                    width : 100,
                    validate: function (v) {
                        if ($.trim(v) == '')
                            return String.format(resource.validate.is_not_blank, resource.graphprocess.type);
                    }
                },*/
                {
                    property : 'version',
                    label : resource.graphprocess.version,
                    type : 'select',
                    editData : __versionState,
                    disabled: true,
                    width : 150,
                    validate: function (v) {
                        if ($.trim(v) == '')
                            return String.format(resource.validate.is_not_blank, resource.graphprocess.version);
                    }
                },
                {
                    label: '',
                    type: 'action',
                    width: 140,
                    align: 'center',
                    buttons: [
                        /*{
                            text: resource.graphprocess.assign,
                            icon: 'icon-group',
                            labelCls: 'label label-info',
                            fn: function (record) {
                                onAssign(record);
                            },
                            visibled: function (data) {
                                var __data = data || {};
                                return __data.version == "PRODUCTION";
                            }
                        },*/
                        /*{
                            text: resource.graphprocess.detach,
                            icon: 'icon-unlink',
                            labelCls: 'label label-important',
                            fn: function (record) {
                                onDetach(record);
                            },
                            visibled: function (data) {
                                var __data = data || {};
                                return __data.version == "PRODUCTION";
                            }
                        },*/
                        {
                            text: iNet.resources.message.button.edit,
                            icon: 'icon-edit',
                            labelCls: 'label label-warning',
                            fn: function (record) {
                                self.hide();
                                var __modal = createModalDesign();
                                __modal.loadData(record);
                                __modal.setPageBack(self);
                                __modal.show();
                            }
                        },
                        {
                            text: resource.graphprocess['VersionState.DESIGN'],
                            icon: 'icon-globe',
                            labelCls: 'label label-default',
                            fn: function (record) {
                                onDesign(record);
                            },
                            visibled: function (data) {
                                var __data = data || {};
                                return __data.version == "PRODUCTION";
                            }
                        },
                        {
                            text: resource.graphprocess['VersionState.PRODUCTION'],
                            icon: 'icon-globe',
                            labelCls: 'label label-info',
                            fn: function (record) {
                                onProduction(record);
                            },
                            visibled: function (data) {
                                var __data = data || {};
                                return __data.version == "DESIGN";
                            }
                        },
                        {
                            text: resource.graphprocess.map,
                            icon: 'icon-cogs',
                            labelCls: 'label label-success',
                            fn: function (record) {
                                self.hide();
                                var __modal = createModalMap();
                                __modal.loadData(record);
                                __modal.setPageBack(self);
                                __modal.show();
                            },
                            visibled: function (data) {
                                var __data = data || {};
                                return __data.version == "PRODUCTION";
                            }
                        },
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
                                var __data = data || {};
                                return __data.version == "DESIGN";
                            }
                        }
                    ]
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'graph-process-list-grid',
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

        grid.on('beforeedit', function(record, index) {
            var cm = grid.getColumnModel();
            var __cell = cm.getColumnByName("version").getCellEditor(index, record.uuid);
            __cell.setDisabled(record.version == "DESIGN");
        });

        grid.on('click', function(record, editable) {
            self.graphData = record;
            $toolbar.COPY.show();
        });

        grid.on('loaded', function (data) {
            self.graphData = {};
            $toolbar.COPY.hide();
        });

        grid.on('save', function (data) {
            var __data = data || {};
            if (!iNet.isEmpty(__data.brief)){
                __data.brief = __data.name;
            }
            __data.zone = __zone;
            __data.context = __context;
            __data.type = "AUTOMATIC";
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
            __data.zone = __zone;
            __data.context = __context;
            __data.type = "AUTOMATIC";
            $.postJSON(url.metaupdate, __data, function (result) {
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
            //if (ids.length > 0 && roleDelete) { $toolbar.DELETE.show(); } else { $toolbar.DELETE.hide(); }
            deleteIds = ids.join(iNet.splitChar);
            deleteName = names.join(iNet.splitChar);
        });

        // ************************************** EVENT
        var modalDesign = null;
        var createModalDesign = function(){
            if (modalDesign == null){
                modalDesign = new iNet.ui.workflow.WFGraphProcess();
                modalDesign.on("finish", function () {
                    if (!(roleView || roleCreate)) return;
                    grid.load();
                });
            }
            return modalDesign;
        };

        var modalMap = null;
        var createModalMap = function(){
            if (modalMap == null){
                modalMap = new iNet.ui.workflow.WFGraphProcessMap();
                modalMap.on("finish", function () {

                });
            }
            return modalMap;
        };

        var newRecord = function(){
            grid.newRecord({version: "DESIGN"});
            var cm = grid.getColumnModel();
            var __cellName = cm.getColumnByName("name").getCellAdd(1);
            __cellName.setDisabled(false);
            __cellName.setValue("");
            var __cellBrief = cm.getColumnByName("brief").getCellAdd(1);
            __cellBrief.setDisabled(false);
            __cellBrief.setValue("");
            var __cellVersion = cm.getColumnByName("version").getCellAdd(1);
            __cellVersion.setDisabled(true);
            __cellVersion.setValue("DESIGN");
            /*var __cell = cm.getColumnByName("type").getCellAdd(1);
            __cell.setDisabled(false);
            __cell.setValue("");*/
        };

        var onAssign = function(data){
            var __data = data || {};
            var __params = {graph: __data.uuid, zone: __data.zone, context: __context, userAllowed: true, actor: "nothing"};
            $.postJSON(url.assign, __params, function (result) {
                if (iNet.isEmpty(result.type)){
                    self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                } else {
                    self.notifyError(resource.constant.submit_title, resource.constant.submit_error);
                }
            }, {
                msg: iNet.resources.ajaxLoading.updating,
                mask: self.getMask()
            });
        };

        var onDetach = function(data){
            var __data = data || {};
            var __params = {graph: __data.uuid, zone: __data.zone, context: __context};
            $.postJSON(url.detach, __params, function (result) {
                if (iNet.isEmpty(result.type)){
                    self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                } else {
                    self.notifyError(resource.constant.submit_title, resource.constant.submit_error);
                }
            }, {
                msg: iNet.resources.ajaxLoading.updating,
                mask: self.getMask()
            });
        };

        var onProduction = function(data){
            var __data = data || {};
            var __params = {graph: __data.uuid, zone: __data.zone};
            $.postJSON(url.published, __params, function (result) {
                if (CommonService.isSuccess(result)){
                    self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                    grid.load();
                } else {
                    self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, result.errors || []));
                }
            }, {
                msg: iNet.resources.ajaxLoading.updating,
                mask: self.getMask()
            });
        };

        var onDesign = function(data){
            var __params = data || {};
            __params.zone = __zone;
            __params.context = __context;
            __params.type = "AUTOMATIC";
            __params.version = "DESIGN";
            $.postJSON(url.metaupdate, __params, function (result) {
                if (CommonService.isSuccess(result)){
                    self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                    grid.load();
                } else {
                    self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, result.errors || []));
                }
            }, {
                msg: iNet.resources.ajaxLoading.updating,
                mask: self.getMask()
            });
        };

        var onCreate = function () {
            $toolbar.DELETE.hide();
            newRecord();
        };

        var onDelete = function () {
            confirmDialog.setContent(iNet.resources.message.dialog_confirm_selected_content);
            confirmDialog.show();
        };

        var onCopy = function () {
            if (wgGraphProcessCopy == null){
                wgGraphProcessCopy = new iNet.ui.workflow.WFGraphProcessCopy();
            }

            wgGraphProcessCopy.on('finish', function(nameCopy){
                if (!iNet.isEmpty(nameCopy)){
                    var __data = self.graphData || {};
                    var __params = {process: __data.uuid, zone: __data.zone, name: nameCopy};
                    $.postJSON(url.copy, __params, function (result) {
                        if (CommonService.isSuccess(result)){
                            self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                            grid.load();
                        } else {
                            self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, result.errors || []));
                        }
                    }, {
                        msg: iNet.resources.ajaxLoading.processing,
                        mask: self.getMask()
                    });
                }
            });

            wgGraphProcessCopy.show();
        };

        $toolbar.CREATE.on("click", onCreate);
        $toolbar.DELETE.on("click", onDelete);
        $toolbar.COPY.on("click", onCopy);

        iNet.ui.workflow.WFGraphProcessList.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.workflow.WFGraphProcessList, iNet.ui.app.widget);

    var widget = new iNet.ui.workflow.WFGraphProcessList();
    widget.show();
});
