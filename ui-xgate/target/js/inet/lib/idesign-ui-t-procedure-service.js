// #PACKAGE: idesign-ui-t-procedure-service
// #MODULE: TProcedureService
$(function () {
    iNet.ns("iNet.ui.builder", "iNet.ui.builder.Procedure");

    iNet.ui.builder.Procedure = function () {
        this.id = 'procedure-div';
        var self = this;
        var parentPage = null;
        var procedureData = null;
        var pageData = null;
        var formlist = [];

        var resource = {
            page: iNet.resources.builder.page,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            BACK: $('#procedure-back-btn'),
            SUBMIT: $('#procedure-submit-btn')
        };
        $toolbar.SUBMIT.hide();

        var url = {
            view: iNet.getUrl('onegate/prodlist'),

            attach: iNet.getUrl('onegate/formattach'),
            detach: iNet.getUrl('onegate/formdetach')
        };

        var dataSource = new DataSource({
            columns: [
                {
                    property: 'subject',
                    label: resource.page.procedureSubject,
                    sortable: true,
                    disabled: true
                },
                {
                    property: 'formUI',
                    label: resource.page.procedureFormUI,
                    sortable: true,
                    disabled: true,
                    type: "checkbox",
                    width: 100
                },
                {
                    label: '',
                    type: 'action',
                    width: 32,
                    align: 'center',
                    buttons: [
                        {
                            text: resource.page.detach,
                            icon: 'icon-unlink',
                            labelCls: 'label label-important',
                            fn: function (record) {
                                procedureData = record || {};
                                onDetach();
                            },
                            visibled: function(record){
                                return record.formUI || false;
                            }
                        }
                    ]
                }
            ]
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'procedure-grid',
            url: url.view,
            convertData: function (data) {
                var __data = data || {};
                var items = __data.items || [];
                return items;
            },
            dataSource: dataSource,
            stretchHeight: false,
            remotePaging: false,
            editable: true,
            firstLoad: true,
            idProperty: 'uuid'
        });

        grid.on('loaded', function(record, editable) {
            procedureData = record || {};
            $toolbar.SUBMIT.hide();
        });

        grid.on('click', function(record, editable) {
            procedureData = record || {};
            $toolbar.SUBMIT.show();
        });

        this.setPageBack = function(page){
            parentPage = page;
        };
        this.setData = function(data){
            pageData = data;
            procedureData = {};
        };

        var onAttach = function(){
            if (!iNet.isEmpty(procedureData.uuid)){
                $.postJSON(url.attach,  {page: pageData.uuid, procedure: procedureData.uuid}, function (result) {
                    console.log(">> result attach >>", result);
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                        grid.load();
                    } else {
                        self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                    }
                }, {
                    msg: iNet.resources.ajaxLoading.updating,
                    mask: self.getMask()
                });
            } else {
                self.notifyError(resource.constant.warning_title, self.getNotifyContent(resource.constant.warning_error, String.format(resource.validate.is_not_found, resource.page.procedureSubject)));
            }
        };

        var onDetach = function(){
            if (!iNet.isEmpty(procedureData.uuid)){
                $.postJSON(url.detach, { procedure: procedureData.uuid}, function (result) {
                    console.log(">> result detach >>", result);
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                        grid.load();
                    } else {
                        self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                    }
                }, {
                    msg: iNet.resources.ajaxLoading.updating,
                    mask: self.getMask()
                });
            } else {
                self.notifyError(resource.constant.warning_title, self.getNotifyContent(resource.constant.warning_error, String.format(resource.validate.is_not_found, resource.page.procedureSubject)));
            }
        };

        var onBack = function () {
            if (parentPage != null){
                self.hide();
                parentPage.show();
            }
        }.createDelegate(this);

        $toolbar.BACK.on("click", onBack);
        $toolbar.SUBMIT.on("click", onAttach);

        iNet.ui.builder.Procedure.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.builder.Procedure, iNet.ui.app.widget);
});
