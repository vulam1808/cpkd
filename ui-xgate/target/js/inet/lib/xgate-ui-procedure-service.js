// #PACKAGE: xgate-ui-procedure-service
// #MODULE: XGateProcedureService
$(function () {
    iNet.ns("iNet.ui.admin", "iNet.ui.admin.Procedure", "iNet.ui.admin.ProcedureModal");

    iNet.ui.admin.ProcedureModal = function () {
        this.id = 'procedure-modal';
        var $dialog =  $('#procedure-modal');
        var self = this;
        var selfData = {};

        var resource = {
            constant: iNet.resources.constant,
            errors : iNet.resources.errors
        };

        var url = {
            create: iNet.getUrl('onegate/firmprocedure/create'),
            update: iNet.getUrl('onegate/firmprocedure/update')
        };

        var typeNotifySuccess = "success";
        var typeNotifyError = "error";
        var notify = null;
        var showNotify = function (typeNotify, titleNotify, contentNotify) {
            if (!notify) {
                notify = new iNet.ui.form.Notify({
                    id: iNet.generateId()
                });
            }

            notify.setType(typeNotify);
            notify.setTitle(titleNotify);
            notify.setContent(contentNotify);
            notify.show();
        };

        var getNotifyContent = function (mainNotify, messageNotify){
            if (!iNet.isEmpty(messageNotify)){
                if (iNet.isArray(messageNotify)){
                    var __errors = messageNotify;
                    var __message = [];
                    try {
                        __errors.forEach(function (error) {
                            if (!iNet.isEmpty(error.message || "")) {
                                __message.push('<br/>' + iNet.resources.errors[error.message || ""]);
                            } else {
                                __message.push('<br/>' + error);
                            }
                        });
                        return String.format(mainNotify, __message);
                    } catch (err) {
                        console.log(">> notifyContent >>", messageNotify);
                        return "";
                    }

                } else {
                    var __message =   messageNotify || "";
                    return String.format(mainNotify, __message);
                }
            }

            return "";
        };

        var $form = {
            title: $('#procedure-modal-tile'),
            body: $('#procedure-modal-body'),
            subject: $('#procedure-modal-subject')
        };

        var $button = {
            submit: $('#procedure-modal-submit-btn'),
            close: $('#procedure-modal-close-btn')
        };

        this.setData = function(data){
            var __data = data || {};
            selfData.procedure = __data;
            $form.subject.val(__data.subject || "");
        };
        this.show = function () {
            $dialog.modal('show');
        };
        this.hide = function () {
            $dialog.modal('hide');
        };

        var onSubmit = function(){
            var __subject = $form.subject.val();
            if (!iNet.isEmpty(__subject)) {
                var __url = url.create;
                var __params = {procedureName: __subject};

                if (!iNet.isEmpty(selfData.procedure.uuid)){
                    __url = url.update;
                    __params.procedure = selfData.procedure.uuid;
                }

                $.postJSON(__url, __params, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)){
                        showNotify(typeNotifySuccess, resource.constant.submit_title, resource.constant.submit_success);
                        self.fireEvent('success');
                        onClose();
                    } else {
                        showNotify(typeNotifyError, resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                    }
                });
            }
        }.createDelegate(this);
        var onClose = function(){
            self.hide();
        };

        $button.submit.on('click', onSubmit);
        $button.close.on('click', onClose);
    };

    iNet.extend(iNet.ui.admin.ProcedureModal, iNet.Component);

    iNet.ui.admin.Procedure = function () {
        this.id = 'procedure-div';
        var self = this;
        var selfData = {
            total: 0,
            procedure: {}
        };
        var wgProcedureDetail = null;
        var wgProcedureDictAdditional = null;
        var wgProcedureAttribute = null;
        var wgProcedureModal = null;
        var wgPublished = null;

        var resource = {
            procedure: iNet.resources.xgate.admin.procedure,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            ADD: $('#procedure-add-btn'),
            PUBLISH_XGATE: $('#procedure-published-xgate-btn'),
            PUBLISH_EXPWAY: $('#procedure-published-expway-btn')
        };
        $toolbar.PUBLISH_XGATE.hide();
        $toolbar.PUBLISH_EXPWAY.hide();

        var url = {
            remove: iNet.getUrl('onegate/firmprocedure/remove'), //procedure

            prodlist: iNet.getUrl('onegate/procedure/maplist'), //old service onegate/prodlist
            prodload: iNet.getUrl('onegate/prodload'),
            formdetach: iNet.getUrl('onegate/formdetach')
        };

        var $form = {
        };

        var confirmDialog = this.confirmDialog(
            resource.constant.del_title, self.getNotifyContent(resource.constant.del_content, ""), function () {
                var __uuid = (confirmDialog.data || {}).uuid || "";
                var __code = (confirmDialog.data || {}).code || "";
                if (!iNet.isEmpty(__uuid)) {
                    confirmDialog.hide();
                    var __url = url.formdetach;
                    var __params = { procedure: __uuid };
                    if (iNet.isEmpty(__code)) {
                        __url = url.remove;
                    }
                    $.postJSON(__url, __params, function (result) {
                        var __result = result || {};
                        if (CommonService.isSuccess(__result)) {
                            grid.remove((confirmDialog.data || {}).uuid || "");
                            self.notifySuccess(resource.constant.del_title, resource.constant.del_success);
                            confirmDialog.data = {};
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
                    property: 'subject',
                    label: resource.procedure.subject,
                    sortable: true,
                    disabled: true,
                    width: 350
                },
                {
                    property: 'industry',
                    label: resource.procedure.industry,
                    sortable: true,
                    disabled: true
                },
                {
                    property: 'formUI',
                    label: resource.procedure.formUI,
                    type: "checkbox",
                    sortable: true,
                    disabled: true,
                    width: 130
                },
                {
                    property: 'brief',
                    label: resource.procedure.workflow,
                    sortable: true,
                    disabled: true,
                    width: 200
                },
                {
                    property: 'name',
                    label: resource.procedure.page,
                    sortable: true,
                    disabled: true,
                    width: 200
                },
                {
                    label: '',
                    type: 'action',
                    width: 32,
                    align: 'center',
                    buttons: [
                        {
                            text: iNet.resources.message.button.del,
                            icon: 'icon-trash icon-white',
                            labelCls: 'label label-important',
                            fn: function (record) {
                                confirmDialog.setContent(String.format(resource.constant.del_content, record.subject));
                                confirmDialog.data = record;
                                confirmDialog.show();
                            }
                        },
                        {
                            text: iNet.resources.message.button.edit,
                            icon: 'icon-pencil',
                            fn: function (record) {
                                if ((record.code || "") == ""){
                                    showProcedureXgate(record);
                                } else {
                                    showProcedureExpway(record);
                                }
                            }
                        },
                        {
                            text: resource.procedure.attach,
                            icon: 'icon-paper-clip',
                            labelCls: 'label label-info',
                            fn: function (record) {
                                if (wgProcedureDictAdditional == null) {
                                    wgProcedureDictAdditional = new iNet.ui.admin.ProcedureDictAdditional();
                                    wgProcedureDictAdditional.on('back', function(){
                                        wgProcedureDictAdditional.hide();
                                        self.show();
                                    });
                                }

                                wgProcedureDictAdditional.loadById(record);
                                wgProcedureDictAdditional.show();
                                self.hide();
                            }
                        },
                        {
                            text: resource.procedure.pagedesign,
                            icon: 'icon-cogs',
                            labelCls: 'label label-warning',
                            fn: function (record) {
                                if (wgProcedureAttribute == null) {
                                    wgProcedureAttribute = new iNet.ui.admin.ProcedureAttribute();
                                    wgProcedureAttribute.on('back', function(){
                                        wgProcedureAttribute.hide();
                                        self.show();
                                    });
                                }

                                wgProcedureAttribute.setProcedure(record.uuid);
                                wgProcedureAttribute.show();
                                self.hide();
                            }
                        }
                    ]
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'procedure-grid',
            url: url.prodlist,
            firstLoad: true,
            dataSource: dataSource,
            convertData: function (data) {
                var __data = data || {};
                //grid.setTotal(__data.total);
                syncProcedure((__data.elements || []).length);

                return __data.elements;
            },
            stretchHeight: false,
            editable: false,
            idProperty: 'uuid'
        });

        grid.on('click', function(record){
            selfData.procedure = record || {};

            $toolbar.PUBLISH_XGATE.show();

            if (selfData.procedure.formUI){
                $toolbar.PUBLISH_EXPWAY.show();
            } else {
                $toolbar.PUBLISH_EXPWAY.hide();
            }
        });

        grid.on('loaded', function(record, editable) {
            $toolbar.PUBLISH_EXPWAY.hide();
            $toolbar.PUBLISH_XGATE.hide();
        });

        var syncProcedure = function(total){
            if (selfData.total != (total || 0)) {
                selfData.total = (total || 0);
                CommonService.syncProcedure();
            }
        };

        var showPublished = function(published){
            if (wgPublished == null){
                wgPublished = new iNet.ui.admin.Published();
            }

            wgPublished.on('back', function(){
                wgPublished.hide();
                self.show();
            });
            selfData.procedure = selfData.procedure || {};
            wgPublished.setData({published: published, type: "procedure", uuid: selfData.procedure.uuid || "", name: selfData.procedure.subject});
            wgPublished.show();
            self.hide();
        };

        var showProcedureXgate = function(data){
            if (wgProcedureModal == null) {
                wgProcedureModal = new iNet.ui.admin.ProcedureModal();
                wgProcedureModal.on('success', function(){
                    wgProcedureModal.hide();
                    self.show();
                    grid.load();
                });
            }

            wgProcedureModal.setData(data);
            wgProcedureModal.show();
        };

        var showProcedureExpway = function(data){
            var __data = data || {};
            if (wgProcedureDetail == null) {
                wgProcedureDetail = new iNet.ui.admin.ProcedureDetailWidget({bootstrap: 'v2'});
                wgProcedureDetail.on('back', function(){
                    wgProcedureDetail.hide();
                    self.show();
                });
            }

            wgProcedureDetail.loadById(__data.uuid, 'XGate');
            wgProcedureDetail.show();
            self.hide();
        };

        $toolbar.ADD.on('click', function(){
            showProcedureXgate();
        });

        $toolbar.PUBLISH_EXPWAY.on('click', function(){
            showPublished("expway");
        });
        $toolbar.PUBLISH_XGATE.on('click', function(){
            showPublished("xgate");
        });

        iNet.ui.admin.Procedure.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.admin.Procedure, iNet.ui.app.widget);

    new iNet.ui.admin.Procedure().show();
});
