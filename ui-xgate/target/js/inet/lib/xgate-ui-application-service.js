// #PACKAGE: xgate-ui-application-service
// #MODULE: XGateApplicationService
$(function () {
    iNet.ns("iNet.ui.admin", "iNet.ui.admin.Application");

    iNet.ui.admin.Application = function () {
        this.id = 'application-div';
        this.ajaxMaskId = 'ajax-mask';
        var self = this;

        var resource = {
            application: iNet.resources.xgate.admin.application,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            BACK: $('#application-back-btn'),
            IMPORT: $('#application-import-btn'),
            DEPLOY: $('#application-deploy-btn')
        };
        $toolbar.BACK.hide();


        var url = {
            view: iNet.getUrl('cms/application/list', 'smartcloud'),
            create: iNet.getUrl('cms/application/create', 'smartcloud'),
            activate: iNet.getUrl('cms/application/activate', 'smartcloud'),
            deploy: iNet.getUrl('cms/application/deploy', 'smartcloud'),
            verify: iNet.getUrl('cms/application/verify', 'smartcloud'),
            del: iNet.getUrl('cms/application/remove', 'smartcloud')
        };

        var $form ={
            submit: $('#application-import-form'),
            file: $('#application-import-form-file')
        };

        $form.file.on('change', function (result) {
            if (this.files.length < 1) {
                this.files = [];
                return;
            }

            $('#'+ (self.ajaxMaskId || "")).show();
            $form.submit.ajaxSubmit({
                url: url.create,
                beforeSubmit: function () {
                },
                uploadProgress: function (event, position, total, percentComplete) {
                },
                success: function () {
                },
                complete: function (xhr) {
                    $('#'+ (self.ajaxMaskId || "")).hide();
                    $form.file.val('');
                    var __responseJSON = xhr.responseJSON || {};
                    var __responseText = xhr.responseText || {};
                    console.log(">> __responseJSON >>", __responseJSON);
                    if (CommonService.isSuccess(__responseJSON)){
                        self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                        grid.load();
                    } else {
                        self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __responseJSON.errors || []));
                    }
                }
            });
            /*var __nameFile = this.files[0].name;
            var __title = $form.container.find('span[data-title]').attr('data-title', __nameFile);
            isFile = detectFile(this.files[0].name);
            isMaxSize = this.files[0].size <= file_maxsize * 1024;*/
        });

        var dataSource = new DataSource({
            columns: [
                {
                    property: 'application',
                    label: resource.application.name,
                    sortable: true,
                    disabled: true
                },
                {
                    property: 'brief',
                    label: resource.application.brief,
                    sortable: true,
                    disabled: true
                },
                {
                    property: 'changedName',
                    label: resource.application.changed,
                    sortable: true,
                    disabled: true
                },
                {
                    property: 'statusName',
                    label: resource.application.status,
                    sortable: true,
                    disabled: true
                },
                {
                    label: '',
                    type: 'action',
                    width: 32,
                    align: 'center',
                    buttons: [
                        {
                            text: resource.application.changedPUBLISHED,
                            icon: 'icon-legal',
                            labelCls: 'label label-info',
                            fn: function (record) {
                                appChanged(url.activate, {application: record.application, activate:true});
                            },
                            visibled: function(record){
                                return !((record.changed || "") == "PUBLISHED");
                            }
                        },
                        {
                            text: resource.application.changedDESIGN,
                            icon: 'icon-magic',
                            labelCls: 'label label-warning',
                            fn: function (record) {
                                appChanged(url.activate, {application: record.application, activate:false});
                            },
                            visibled: function(record){
                                return !((record.changed || "") == "DESIGN");
                            }
                        },
                        {
                            text: resource.application.changedUNPUBLISHED,
                            icon: 'icon-trash',
                            labelCls: 'label label-important',
                            fn: function (record) {
                                appChanged(url.del, {application: record.application});
                            },
                            visibled: function(record){
                                return !((record.changed || "") == "UNPUBLISHED");
                            }
                        }
                    ]
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'application-grid',
            url: url.view,
            firstLoad: true,
            dataSource: dataSource,
            convertData: function (data) {
                var __data = data || {};
                $.each(__data.items || [], function(i, item){
                    item.changedName = resource.application["changed" + item.changed];
                    item.statusName = resource.application["status" + item.status];
                });
                grid.setTotal(__data.total);
                return __data.items;
            },
            stretchHeight: false,
            editable: false,
            idProperty: 'uuid'
        });
        var appChanged = function(pathUrl, params){
            $.postJSON(pathUrl, params, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    $.postJSON(url.verify, {}, function (result) {
                        var __result = result || {};
                        if (CommonService.isSuccess(__result)) {
                            if (__result == "YES") {
                                self.notifySuccess(resource.constant.warning_title, resource.application.changedINFO);
                            }
                            grid.load();
                        }
                    }, {
                        mask: self.getMask(),
                        msg: iNet.resources.ajaxLoading.processing
                    });
                } else {
                    self.notifyError(resource.constant.warning_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                }
            }, {
                mask: self.getMask(),
                msg: iNet.resources.ajaxLoading.processing
            });
        };

        grid.on('click', function(record){
        });

        grid.on('loaded', function(record, editable) {
        });

        $toolbar.IMPORT.on('click', function(){
            $form.submit.find('[name="update"]').remove();
            $form.file.trigger('click');
        });

        $toolbar.DEPLOY.on('click', function(){
            $.postJSON(url.verify, {}, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    if (__result == "YES") {
                        if (iNet.getLayout().xGate != null){
                            iNet.getLayout().xGate.mask.show();
                        }
                        $.postJSON(url.deploy, {}, function (result) {
                            var __result = result || {};
                            if (CommonService.isSuccess(__result)) {
                                if (__result == "SUCCESS") {
                                    var __fnCheckService = function(i){
                                        if (iNet.getLayout().xGate != null){
                                            var __textLoading = "......!!!";
                                            if (i%2 == 0) { __textLoading = "............!!!"; }
                                            if (i%3 == 0) { __textLoading = "........................!!!"; }
                                            iNet.getLayout().xGate.mask.loading(__textLoading);
                                        }

                                        var __isDeployCompleted = FormService.checkService();
                                        console.log("__isDeployCompleted >>", __isDeployCompleted);
                                        if (__isDeployCompleted){
                                            window.location.href = window.location.href+window.location.hash;
                                        } else {
                                            setTimeout(function(){ __fnCheckService(i+1); }, 3000);
                                        }
                                    };
                                    __fnCheckService(1);
                                } else {
                                    if (iNet.getLayout().xGate != null){
                                        iNet.getLayout().xGate.mask.hide();
                                    }
                                    self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                                }
                            } else {
                                if (iNet.getLayout().xGate != null){
                                    iNet.getLayout().xGate.mask.hide();
                                }
                                self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                            }
                        });
                    } else {
                        self.notifySuccess(resource.constant.warning_title, resource.application.changedNOCHANGE);
                    }
                } else {
                    self.notifyError(resource.constant.warning_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                }
            });
        });

        iNet.ui.admin.Application.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.admin.Application, iNet.ui.app.widget);

    new iNet.ui.admin.Application().show();
});
