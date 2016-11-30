// #PACKAGE: xgate-ui-firm-service
// #MODULE: XGateFirmService
$(function () {
    iNet.ns("iNet.ui.admin", "iNet.ui.admin.Firm");

    iNet.ui.admin.Firm = function () {
        this.id = 'firm-div';
        var self = this;
        var wgFirmView = null;

        var resource = {
            firm: iNet.resources.xgate.admin.firm,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            CREATE: $('#firm-create-btn'),
            DEL: $('#firm-delete-btn')
        };

        var url = {
            view: iNet.getUrl('firmtask/subfirm/list'),
            del: iNet.getUrl('firmtask/subfirm/delete')
        };

        var $form = {
            
        };

        var confirmDialog = this.confirmDialog(
            resource.constant.del_title, self.getNotifyContent(resource.constant.del_content, ''), function () {
                if (!iNet.isEmpty(confirmDialog.params || {})) {
                    confirmDialog.hide();
                    $.postJSON(url.del, confirmDialog.params, function (result) {
                        var __result = result || {};
                        if (CommonService.isSuccess(__result)) {
                            grid.remove(__result.uuid);
                            confirmDialog.params = {};
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
                    property : 'organiId',
                    label : resource.firm.organId,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'name',
                    label : resource.firm.name,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'email',
                    label : resource.firm.email,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'phone',
                    label : resource.firm.phone,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'fax',
                    label : resource.firm.fax,
                    sortable : true,
                    disabled: true
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
                                showFirm(record);
                            }
                        },
                        {
                            text: iNet.resources.message.button.del,
                            icon: 'icon-trash',
                            labelCls: 'label label-important',
                            fn: function (record) {
                                confirmDialog.params  = {organiId: record.organiId, profileID: record.profileID};
                                confirmDialog.setContent(String.format(resource.constant.del_content, record.name));
                                confirmDialog.show();
                            }
                        }
                    ]
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'firm-grid',
            url: url.view,
            params: {},
            convertData: function (data) {
                var __data = data || {};

                return __data.items;
            },
            dataSource: dataSource,
            stretchHeight: false,
            editable: false,
            firstLoad: true,
            idProperty: 'uuid'
        });

        grid.on('click', function(record, editable) {
        });

        grid.on('loaded', function(){
        });

        var showFirm = function(data){
            if (wgFirmView == null){
                wgFirmView = new iNet.ui.admin.FirmView();
            }

            wgFirmView.on('finish', function(){
                grid.load();
            });
            wgFirmView.setData(data);
            wgFirmView.setPageBack(self);
            wgFirmView.show();
            self.hide();
        };

        $toolbar.CREATE.on('click', function(){
            showFirm({});
        });

        $toolbar.DEL.on('click', function(){

        });

        iNet.ui.admin.Firm.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.admin.Firm, iNet.ui.app.widget);

    new iNet.ui.admin.Firm().show();
});
