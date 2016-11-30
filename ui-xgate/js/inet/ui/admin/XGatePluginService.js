// #PACKAGE: xgate-ui-plugin-service
// #MODULE: XGatePluginService
$(function () {
    iNet.ns("iNet.ui.admin", "iNet.ui.admin.Plugin");

    iNet.ui.admin.Plugin = function () {
        this.id = 'plugin-div';
        var self = this;
        var deleteIds = null;
        var deleteName = null;

        var resource = {
            plugin: iNet.resources.xgate.admin.plugin,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            BACK: $('#plugin-back-btn'),
            IMPORT: $('#plugin-import-btn'),
            UPDATE: $('#plugin-update-btn')
        };
        $toolbar.BACK.hide();


        var url = {
            view: iNet.getUrl('onegate/plugin/list'),
            importPlugin: iNet.getUrl('onegate/plugin/import'),
            del: iNet.getUrl('onegate/plugin/delete') //plugin
        };

        var $form ={
            submit: $('#plugin-import-form'),
            file: $('#plugin-import-form-file')
        };

        $form.file.on('change', function (result) {
            if (this.files.length < 1) {
                this.files = [];
                return;
            }

            $form.submit.ajaxSubmit({
                url: url.importPlugin,
                beforeSubmit: function () {
                },
                uploadProgress: function (event, position, total, percentComplete) {
                },
                success: function () {
                },
                complete: function (xhr) {
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

        var confirmDialog = this.confirmDialog(
            iNet.resources.message.dialog_confirm_title, self.getNotifyContent(resource.constant.del_content, deleteName), function () {
                if (!iNet.isEmpty(deleteIds)) {
                    confirmDialog.hide();
                    var params = {
                        plugin: deleteIds
                    };
                    $.postJSON(url.del, params, function (result) {
                        var __result = result || {};
                        if (CommonService.isSuccess(__result)) {
                            var __arrays = deleteIds.split(",");
                            for (var i = 0; i < __arrays.length; i++) {
                                grid.remove(__arrays[i]);
                            }
                            deleteIds = null;
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
                    property: 'name',
                    label: resource.plugin.name,
                    sortable: true,
                    disabled: true
                },
                {
                    property: 'brief',
                    label: resource.plugin.brief,
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
                            text: iNet.resources.message.button.del,
                            icon: 'icon-trash',
                            labelCls: 'label label-important',
                            fn: function (record) {
                                deleteIds = record.uuid.toString();
                                deleteName = record.name;
                                confirmDialog.setContent(String.format(resource.constant.del_content, deleteName));
                                confirmDialog.show();
                            }
                        }
                    ]
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'plugin-grid',
            url: url.view,
            firstLoad: true,
            dataSource: dataSource,
            convertData: function (data) {
                var __data = data || {};
                grid.setTotal(__data.total);
                return __data.items;
            },
            stretchHeight: false,
            editable: false,
            idProperty: 'uuid'
        });

        grid.on('click', function(record){
            $toolbar.UPDATE.show();
        });

        grid.on('loaded', function(record, editable) {
            $toolbar.UPDATE.hide();
        });

        $toolbar.BACK.on('click', function(){

        });

        $toolbar.IMPORT.on('click', function(){
            $form.submit.find('[name="update"]').remove();
            $form.file.trigger('click');
        });

        $toolbar.UPDATE.on('click', function(){
            $form.submit.find('[name="update"]').remove();
            $form.submit.append('<div class="hide"><input name="update" value="true" /></div>');
            $form.file.trigger('click');
        });

        iNet.ui.admin.Plugin.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.admin.Plugin, iNet.ui.app.widget);

    new iNet.ui.admin.Plugin().show();
});
