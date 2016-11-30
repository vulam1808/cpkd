// #PACKAGE: iworkflow-ui-wf-script-service
// #MODULE: WFScriptService
$(function () {
    iNet.ns("iNet.ui.workflow", "iNet.ui.workflow.WFScript");

    iNet.ui.workflow.WFScript = function () {
        this.id = 'script-div';
        console.log(">>>> C,E,D,V >>>> ", roleCreate, roleEdit, roleDelete, roleView);
        var __zone = iNet.zone;
        var isRefesh = false;
        var parentPage = null;
        var infoData = {};
        var allowSaveInfo = false;


        var self = this;
        var deleteIds = null;
        var deleteName = null;
        var resource = {
            script: iNet.resources.workflow.script,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            CREATE: $('#script-create-btn'),
            DELETE: $('#script-delete-btn'),
            SAVE: $('#script-save-btn'),
            BACK: $('#script-back-btn')
        };
        $toolbar.DELETE.hide();
        if (roleCreate) { $toolbar.CREATE.show(); } else { $toolbar.CREATE.hide(); }
        if (roleCreate || roleEdit) { $toolbar.SAVE.show(); } else { $toolbar.SAVE.hide(); }

        var url = {
            view_info: iNet.getUrl('cloud/workflow/script/find'),
            create_info: iNet.getUrl('cloud/workflow/script/create'),
            update_info: iNet.getUrl('cloud/workflow/script/update'),
            del_info: iNet.getUrl('cloud/workflow/script/delete')
        };

        var $form = {
            info: $('#script-info-div'),
            item: $('#script-item-div'),
            name: $('#script-name-txt'),
            zone: $('#script-zone-txt'),
            brief: $('#script-brief-txt'),
            condition: $('#script-condition-txt')
        };

        $form.info.bind('keydown', function(e) {
            allowSaveInfo = true;
        });
        $form.info.bind('focusoutside', function(e) {
        });
        $form.info.bind('click', function(e) {
        });
        $form.info.bind('change', function(e) {
            allowSaveInfo = true;
        });

        $form.item.bind('click', function(e) {
        });

        var confirmDialog = this.confirmDialog(
            iNet.resources.message.dialog_confirm_title, self.getNotifyContent(resource.constant.del_content, deleteName), function () {
                if (!iNet.isEmpty(deleteIds)) {
                    confirmDialog.hide();
                    var params = { id: deleteIds };
                    $.postJSON(url.del_info, params, function (result) {
                        var __result = result || {};
                        if (CommonService.isSuccess(__result)) {
                            isRefesh = true;
                            deleteIds = null;
                            self.notifySuccess(resource.constant.del_title, resource.constant.del_success);
                            onBack();
                        } else {
                            self.notifyError(resource.constant.del_title, self.getNotifyContent(resource.constant.del_error, __result.errors || []));
                        }
                    }, {
                        mask: self.getMask(),
                        msg: iNet.resources.ajaxLoading.deleting
                    });
                }
            });

        // PUBLIC FUNCTION ----------------------------------------
        this.loadData = function(data){
            if (data != null){
                infoData = data || {};
                setData(infoData);
            } else {
                clearData();
            }
        };

        this.setPageBack = function(page){
            parentPage = page;
            if (parentPage == null){
                $toolbar.BACK.hide();
            }
        };

        //INFO ----------------------------------------------------
        var clearData = function (){
            $form.name.val('');
            $form.zone.val('');
            $form.brief.val('');
            $form.condition.val('');

            infoData = {};
            $form.name.focus();
            $toolbar.DELETE.hide();
        };

        var setData = function (data){
            var __data = data || {};

            $form.name.val(__data.name);
            $form.zone.val(__data.zone);
            $form.brief.val(__data.brief);
            $form.condition.val(__data.condition);

            if (roleDelete) { $toolbar.DELETE.show(); }
        };

        var getData = function(){
            var __data = {
                name: $form.name.val(),
                zone: $form.zone.val(),
                brief: $form.brief.val(),
                condition: $form.condition.val()
            };
            
            __data = iNet.apply(infoData,__data) || {};
            return __data;
        };

        var validateData = function (data) {
            var __data = data;


            /*if (iNet.isEmpty(__data.code) || iNet.isEmpty(__data.name) || iNet.isEmpty(__data.state)) {
                self.notifyError(resource.constant.warning_title, resource.constant.warning_required);
                return false;
            }*/

            return true;

        };


        //ITEM ----------------------------------------------------

        //EVENT ---------------------------------------------------
        var onCreate = function () {
            clearData();
            $form.name.focus();
        };

        var onSave = function () {
            var __data = getData();
            __data.zone = __zone;

            console.log("onSave", __data);
            if (validateData(__data)){
                if (__data.uuid == null) {
                    $.postJSON(url.create_info, __data, function (result) {
                        var __result = result || {};
                        console.log("create_info", __result);
                        if (CommonService.isSuccess(__result)) {
                            isRefesh = true;
                            if (roleDelete) { $toolbar.DELETE.show(); }
                            infoData = __result;
                            self.notifySuccess(resource.constant.save_title,resource.constant.save_success);
                        }else{
                            self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                        }
                    });
                } else{
                    $.postJSON(url.update_info, __data, function (result) {
                        var __result = result || {};
                        console.log("update_info", __result);
                        if (CommonService.isSuccess(__result)) {
                            isRefesh = true;
                            infoData = __result;
                            self.notifySuccess(resource.constant.save_title,resource.constant.save_success);
                        }else{
                            self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                        }
                    });
                }
            }
        };

        var onDelete = function () {
            deleteIds = infoData.uuid;
            deleteName = infoData.name;
            confirmDialog.setContent(String.format(resource.constant.del_content, deleteName));
            confirmDialog.show();
        };

        var onBack = function () {
            if (parentPage != null){
                self.hide();
                parentPage.show();
                if (isRefesh) {
                    this.fireEvent("finish");
                }
            } else {
                clearData();
            }
        }.createDelegate(this);

        $toolbar.CREATE.on("click", onCreate);
        $toolbar.DELETE.on("click", onDelete);
        $toolbar.SAVE.on("click", onSave);
        $toolbar.BACK.on("click", onBack);

        iNet.ui.workflow.WFScript.superclass.constructor.call(this);
    }

    iNet.extend(iNet.ui.workflow.WFScript, iNet.ui.app.widget);
});
