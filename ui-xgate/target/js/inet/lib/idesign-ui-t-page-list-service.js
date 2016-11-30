// #PACKAGE: idesign-ui-t-page-list-service
// #MODULE: TPageListService
$(function () {
    iNet.ns("iNet.ui.builder", "iNet.ui.builder.TPageList", "iNet.ui.builder.TPageCopy");

    iNet.ui.builder.TPageCopy = function () {
        this.id = 'page-list-modal-copy';
        var $dialog =  $('#page-list-modal-copy');
        var self = this;

        var $form = {
            name: $('#page-list-modal-copy-name')
        };

        var $button = {
            submit: $('#page-list-modal-copy-submit-btn'),
            close: $('#page-list-modal-copy-close-btn')
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

    iNet.extend(iNet.ui.builder.TPageCopy, iNet.Component);

    iNet.ui.builder.TPageList = function () {
        this.id = 'page-list-div';
        console.log(">>>> C,E,D,V >>>> ", roleCreate, roleEdit, roleDelete, roleView);
        var __zone = iNet.zone;
        var __context = iNet.context;
        var self = this;
        var pageData = {};
        var wgPageCopy = null;
        var deleteIds = null;
        var deleteName = null;
        var resource = {
            page: iNet.resources.builder.page,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            CREATE: $('#page-list-create-btn'),
            DELETE: $('#page-list-delete-btn'),
            COPY: $('#page-list-copy-btn')
        };
        $toolbar.DELETE.hide();
        $toolbar.COPY.hide();
        if (roleCreate) { $toolbar.CREATE.show(); } else { $toolbar.CREATE.hide(); }

        var url = {
            view: iNet.getUrl('design/page/list'), //zone
            create: iNet.getUrl('design/page/create'),
            copy: iNet.getUrl('design/page/copy'),
            update: iNet.getUrl('design/page/update'),
            del: iNet.getUrl('design/page/delete')
        };

        var confirmDialog = this.confirmDialog(
            iNet.resources.message.dialog_confirm_title, self.getNotifyContent(resource.constant.del_content, deleteName), function () {
                if (!iNet.isEmpty(deleteIds)) {
                    confirmDialog.hide();
                    var params = {
                        zone: __zone,
                        context: __context,
                        page: deleteIds
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
                    label : resource.page.name,
                    sortable : true,
                    disabled: true,
                    type: "text",
                    validate: function (v) {
                        if ($.trim(v) == '')
                            return String.format(resource.validate.is_not_blank, resource.page.name);
                    }
                },
                {
                    property: 'creator',
                    label: resource.page.creator,
                    sortable: true,
                    disabled: true,
                    type: "text",
                    width: 200
                },
                {
                    label: '',
                    type: 'action',
                    width: 32,
                    align: 'center',
                    buttons: [
                        {
                            text: iNet.resources.message.button.edit,
                            icon: 'icon-pencil',
                            labelCls: 'label label-success',
                            fn: function (record) {
                                self.hide();
                                var __modal = createModal();
                                __modal.loadData(record);
                                __modal.setPageBack(self);
                                __modal.show();
                            }
                        },
                        {
                            text: iNet.resources.message.button.upload,
                            icon: 'icon-cloud-upload',
                            labelCls: 'label label-info',
                            fn: function (record) {
                                onUpload(record);
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
                                if (roleDelete) {
                                    return true;
                                }
                                return false;
                            }
                        }
                    ]
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'page-list-grid',
            url: url.view,
            params: {zone: __zone, context: __context},
            convertData: function (data) {
                var __data = data || {};
                var __items = __data.items || [];
                return __items;
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
            __data.zone = __zone;
            __data.context = __context;
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
                ids.push(__record.id);
                names.push(__record.name);
            }
            //if (ids.length > 0 && roleDelete) { $toolbar.DELETE.show(); } else { $toolbar.DELETE.hide(); }
            deleteIds = ids.join(iNet.splitChar);
            deleteName = names.join(iNet.splitChar);
        });

        grid.on('loaded', function(record, editable) {
            pageData = {};
            $toolbar.COPY.hide();
        });

        grid.on('click', function(record, editable) {
            pageData = record || {};
            $toolbar.COPY.show();
        });

        // ************************************** EVENT
        var modal = null;
        var createModal = function(){
            if (modal == null){
                modal = new iNet.ui.builder.TPage();
                modal.on("finish", function () {
                    if (!(roleView || roleCreate)) return;
                    grid.load();
                });
            }
            return modal;
        };

        var newRecord = function(){
            grid.newRecord();
            var cm = grid.getColumnModel();
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

        var wgUpload = null;
        var onUpload = function (data) {
            if (wgUpload == null){
                wgUpload = new iNet.ui.builder.Published();
                wgUpload.on('finish', function(result){
                });
            }
            wgUpload.setPageBack(self);
            wgUpload.setData(data);
            wgUpload.show();
            self.hide();
        };

        var onCopy = function () {
            if (wgPageCopy == null){
                wgPageCopy = new iNet.ui.builder.TPageCopy();
            }

            wgPageCopy.on('finish', function(nameCopy){
                if (!iNet.isEmpty(nameCopy)){
                    var __data = pageData || {};
                    var __params = {page: __data.uuid, name: nameCopy};
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

            wgPageCopy.show();
        };

        $toolbar.CREATE.on("click", onCreate);
        $toolbar.DELETE.on("click", onDelete);
        $toolbar.COPY.on("click", onCopy);

        iNet.ui.builder.TPageList.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.builder.TPageList, iNet.ui.app.widget);

    var widget = new iNet.ui.builder.TPageList();
    widget.show();
});
