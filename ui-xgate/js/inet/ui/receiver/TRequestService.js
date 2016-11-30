// #PACKAGE: itask-ui-t-request-service
// #MODULE: TRequestService
$(function () {
    iNet.ns("iNet.ui.task", "iNet.ui.task.TRequest", "iNet.ui.task.TMUserProfile");

    iNet.ui.task.TMUserProfile = function () {
        this.id = 'task-modal-user-profile';
        var $dialog =  $('#task-modal-user-profile');
        var self = this;

        var resource = {
            task: iNet.resources.receiver.task,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
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
        var notifyError = function (titleNotify, contentNotify) {
            showNotify('error', titleNotify, contentNotify);
        };
        var notifySuccess = function (titleNotify, contentNotify) {
            showNotify('success', titleNotify, contentNotify);
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

        var url = {
            user_profile_search: iNet.getUrl('onegate/userprofile/search') //birthday, identity
        };

        var $form = {
            identity: $('#task-modal-user-profile-identity'),
            birthday: $('#task-modal-user-profile-birthday')
        };

        var $button = {
            submit: $('#task-modal-user-profile-submit-btn'),
            close: $('#task-modal-user-profile-close-btn')
        };

        $form.identity.on('keyup', function(e){
            var __keyValue = e.keyCode ? e.keyCode : e.which;
            if (__keyValue == 13 && !iNet.isEmpty($form.identity.val()) && !iNet.isEmpty($form.birthday.val())){
                onSubmit();
            }
        });
        $form.birthday.on('keyup', function(e){
            var __keyValue = e.keyCode ? e.keyCode : e.which;
            if (__keyValue == 13 && !iNet.isEmpty($form.identity.val()) && !iNet.isEmpty($form.birthday.val())){
                onSubmit();
            }

            if (!iNet.isEmpty($form.birthday.val())){
                if (!FormService.validateDate($form.birthday.val(), true)){
                    $form.birthday.val("");
                }
            }
        });
        $form.birthday.on('change', function(event){
            if (!iNet.isEmpty($form.birthday.val())){
                if (!FormService.validateDate($form.birthday.val())){
                    $form.birthday.val("");
                }
            }
        });

        this.setProfile = function (profileType) {
            $dialog.find('[data-profile="'+profileType+'"]').show();
            if (profileType == 'citizen'){
                $dialog.find('[data-profile="organ"]').hide();
            } else {
                $dialog.find('[data-profile="citizen"]').hide();
            }
        };
        this.setData = function (data) {
            var __data = data || {};
            $form.birthday.val(__data.birthday || "");
            $form.identity.val(__data.identity || "");
        };
        this.show = function () {
            $dialog.modal('show');
        };
        this.hide = function () {
            $dialog.modal('hide');
        };

        var onSubmit = function(){
            var __params = {
                birthday: $form.birthday.val(),
                identity: $form.identity.val()
            };

            if (iNet.isEmpty(__params.birthday) || iNet.isEmpty(__params.identity)) {
                notifyError(resource.constant.warning_title, resource.constant.warning_required);
                return;
            }

            $.postJSON(url.user_profile_search, __params, function (result) {
                var __result = result || {};
                console.log("user_profile result >>", __result);

                if (CommonService.isSuccess(__result)){
                    self.fireEvent('finish', __result);
                    onClose();
                } else {
                    notifyError(resource.constant.warning_title, String.format(resource.validate.is_not_found, resource.task.profileInfo));
                }
            },{
                mask: self.id,
                msg: iNet.resources.ajaxLoading.loading
            });
        }.createDelegate(this);

        var onClose = function(){
            self.hide();
        };

        $button.submit.on('click', onSubmit);
        $button.close.on('click', onClose);
    };

    iNet.extend(iNet.ui.task.TMUserProfile, iNet.Component);

    iNet.ui.task.TRequest = function () {
        this.id = 'task-request-div';
        var self = this;
        var selfData = {
            htmlHidden: '<div class="hide"><input type="text" name="{0}" value="{1}"></div>',
            htmlAttachment: function(){
                var __html = "";
                __html += '<li file-id="{0}" file-name="{1}" title="{1}">';
                __html += '<div class="file-box">';
                __html += '<div class="file">';
                __html += '<span class="corner"></span>';
                __html += '<div class="icon" style="display: none;"><i class="{2}"></i></div>';
                __html += '<div class="file-name">';
                __html += '<div class="file-text"><i class="{2}"></i> {3}</div>';
                __html += '<div class="file-size" file-size="{5}"><small>{4}</small></div>';
                __html += '<div class="file-action" style="padding: 5px;display: flex;">';
                /*__html += '<a data-action="viewfile" title="' + resource.global.fileView + '" data-id="{6}" style="width: 50%;border: 1px solid #DDD;border-radius: 15px;float: left;text-align: center;margin-right: 2px;padding-top: 3px;padding-bottom: 3px;">';
                __html += '<i class="ace-icon icon-eye-open"></i>';*/
                __html += '<a href="' + url.downloadFile + '?binary={0}" title="' + resource.global.fileDownload + '" data-id="{6}" style="width: 100%;border: 1px solid #DDD;border-radius: 15px;float: right;text-align: center;margin-left: 2px;padding-top: 3px;padding-bottom: 3px;">';
                __html += '<i class="ace-icon icon-download-alt"></i>';
                __html += '</a>';
                __html += '</div>';
                __html += '</div>';
                __html += '</a>';
                __html += '</div>';
                __html += '</div>';
                __html += '</li>';
                return __html;
            },
            info: {},
            item: {},
            isRefresh: false,
            receiptNo: '',
            profileType: 'citizen'
        };
        var wgmUserProfile = null;
        var printDialog = null;

        var resource = {
            task: iNet.resources.receiver.task,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            new_request: iNet.getUrl('firmtask/process/request'), //form
            task_tree: iNet.getUrl('onegate/additional/tasktree'),

            create_request: iNet.getUrl('onegate/process/request'), //additionalID
            appointment_request: iNet.getUrl('onegate/ticket/appointment'), //additionalID or procedureID
            submit_request: iNet.getUrl('onegate/process/submit'), //form submit

            user_profile_load: iNet.getUrl('onegate/userprofile/load'), //profileID
            user_profile_search: iNet.getUrl('onegate/userprofile/search'), //birthday, identity
            user_profile_filter: iNet.getUrl('onegate/userprofile/filter'), //birthday, identity

            downloadFile: iNet.getUrl('onegate/binary/download'),

            load_user: iNet.getUrl('system/account/role'),

            receiverPlace: iNet.getUrl('onegate/deptrecord/receiverplace'),
            receiverno: iNet.getUrl('onegate/deptrecord/receiverno'),
            receiverBookList: iNet.getUrl('onegate/recordbook/list'),
            receiverBookCount: iNet.getUrl('onegate/recordbook/count')
        };

        var $mask = {
            ajaxTask: $('#ajax-mask'),
            requestTask: $('#task-request')
        };

        var $form = {
            requestTaskDiv: $('#task-request'),
            requestTaskContent: $('#task-request-content'),
            requestTaskForm: $('#task-request-item-form'),
            requestTaskFormContent: $('#task-request-form-content'),
            requestTaskFormContentHidden: $('#task-request-form-content-hidden'),

            requestTaskFormAttachment: $('#task-request-form-attachment-info'),
            requestTaskFormAttachmentNumber: $('#task-request-form-attach-brief-number'),
            requestTaskFormAttachmentList: $('#task-request-form-attach-brief-list'),

            requestTaskDataInfo: $('#task-request-data-info'),
            requestTaskDataContent: $('#task-request-data-content'),

            requestTaskProcedureInfo: $('#task-request-procedure-info'),
            requestTaskProcedureContent: $('#task-request-procedure-content'),
            requestTaskProcedure: $('#task-request-procedure'),

            requestTaskReceiptNoLoad: $('[data-action="load-receipt-no"]'),
            requestTaskReceiptInfo: $('#task-request-receipt-info'),
            requestTaskReceiptMoreInfo: $('#task-request-receipt-more-info'),
            requestTaskReceiptShowInfo: $('#task-request-receipt-show-info'),
            requestTaskReceiptHideInfo: $('#task-request-receipt-hide-info'),
            requestTaskReceiptContent: $('#task-request-receipt-content'),
            requestTaskReceiptNo: $('#task-request-receiptNo'),
            requestTaskAppointment: $('#task-request-appointment'),
            requestTaskAppointmentHour: $('#task-request-appointment-hour'),
            requestTaskExclusive: $('#task-request-exclusive'),
            requestTaskMembers: $('#task-request-members'),
            requestTaskHour: $('#task-request-hour'),
            requestTaskSubject: $('#task-request-subject'),
            requestTaskNumberOfRecord: $('#task-request-numberOfRecord'),
            requestTaskIsPostOfficeSelect: $('#task-request-ispostoffice-select'),
            requestTaskIsPostOffice: $('#task-request-ispostoffice'),
            requestTaskReceverPlaceSelect: $('#task-request-receiverPlace-select'),

            requestTaskRecordBookLoad: $('[data-action="load-receipt-recordBook"]'),
            requestTaskRecordBookList: $('#task-request-recordBook-list'),
            requestTaskRecordBook: $('#task-request-recordBook'),

            requestTaskRecordOrder: $('#task-request-recordOrder'),

            requestTaskUPClickSearch: $('[data-action="click-search-user-profile"]'),
            requestTaskUPKeyupSearch: $('[data-action="keyup-search-user-profile"]'),
            requestTaskUPInfo: $('#task-request-user-profile-info'),
            requestTaskUPCitizen: $('#task-request-user-profile-citizen'),
            requestTaskUPOrgan: $('#task-request-user-profile-organ'),
            requestTaskUPRandomInfo: $('#task-request-user-profile-random-info'),
            requestTaskUPMoreInfo01: $('#task-request-user-profile-more-info-01'),
            requestTaskUPMoreInfo02: $('#task-request-user-profile-more-info-02'),
            requestTaskUPShowInfo: $('#task-request-user-profile-show-info'),
            requestTaskUPHideInfo: $('#task-request-user-profile-hide-info'),

            requestTaskUPContent: $('#task-request-user-profile-content'),
            requestTaskUPFullName: $('#task-request-user-profile-fullname'),
            requestTaskUPBirthday: $('#task-request-user-profile-birthday'),
            requestTaskUPIdentity: $('#task-request-user-profile-identity'),
            requestTaskUPIdDateOfIssue: $('#task-request-user-profile-idDateOfIssue'),
            requestTaskUPIdPlaceOfIssuse: $('#task-request-user-profile-idPlaceOfIssuse'),
            requestTaskUPRegion: $('#task-request-user-profile-region'),
            requestTaskUPNationality: $('#task-request-user-profile-nationality'),
            requestTaskUPOtherNumber: $('#task-request-user-profile-otherNumber'),
            requestTaskUPOtherDateOfIssue: $('#task-request-user-profile-otherDateOfIssue'),
            requestTaskUPOtherPlaceOfIssuse: $('#task-request-user-profile-otherPlaceOfIssuse'),
            requestTaskUPAddress1: $('#task-request-user-profile-address1'),
            requestTaskUPAddress2: $('#task-request-user-profile-address2'),
            requestTaskUPSmobile: $('#task-request-user-profile-smobile'),
            requestTaskUPMale: $('#task-request-user-profile-sex-male'),
            requestTaskUPFemale: $('#task-request-user-profile-sex-female'),
            requestTaskUPEmail: $('#task-request-user-profile-email'),

            requestTaskUPSearchContent: $('#task-request-user-profile-search-content'),
            requestTaskUPTable: $('#task-request-user-profile-list'),
            requestTaskUPRowTemplate: $('#task-request-user-profile-row-template')
        };
        $form.requestTaskUPCitizen.prop("checked", true);

        var $button = {
            REQUEST_SUBMIT: $('#task-request-submit-btn'),
            REQUEST_SAVE: $('#task-request-save-btn'),
            REQUEST_BACK: $('#task-request-back-btn')
        };

        var __registerOffice = [
            {id: "false", code: "false", name: resource.task.receiverInOrgan},
            {id: "true", code: "true", name: resource.task.receiverInPostOffice}
        ];
        $form.requestTaskIsPostOfficeSelect = FormService.createSelect('task-request-ispostoffice-select', __registerOffice, 'id', 1, false, false);
        $form.requestTaskIsPostOfficeSelect.setValue('false');

        var __receiverPlace = [
            {id: "UNIT", code: "UNIT", name: resource.task.receiverPlaceUNIT},
            {id: "CENTER", code: "CENTER", name: resource.task.receiverPlaceCENTER}/*,
            {id: "POSTOFFICE", code: "POSTOFFICE", name: resource.task.receiverPlacePOSTOFFICE}*/
        ];
        $form.requestTaskReceverPlaceSelect = FormService.createSelect('task-request-receiverPlace-select', __receiverPlace, 'id', 1, false, false);
        $form.requestTaskReceverPlaceSelect.setValue('UNIT');
        $form.requestTaskReceverPlaceSelect.on('change', function(){
            FormService.appendHiddenField($form.requestTaskFormContentHidden, 'receiverPlace', $form.requestTaskReceverPlaceSelect.getValue());
        });
        var loadReceiverPlace = function(){
            $.postJSON(url.receiverPlace, {}, function (result) {
                if (!iNet.isEmpty(result)){
                    $form.requestTaskReceverPlaceSelect.setValue(result);
                    FormService.appendHiddenField($form.requestTaskFormContentHidden, 'receiverPlace', result);
                }
            });
        };
        loadReceiverPlace();

        var showPrintDialog = function(content, taskID){
            if (printDialog == null){
                printDialog = new iNet.ui.dialog.ModalDialog({
                    id: iNet.generateId(),
                    title: resource.task.printTitle || "",
                    content: "",
                    buttons: [
                        {
                            text: iNet.resources.message.button.ok,
                            cls: 'btn-primary',
                            icon: 'icon-ok icon-white',
                            fn: function(){
                                window.open(iNet.getUrl(CommonService.pageRequest.formNo03) + '?task=' + this.taskID, '_blank');
                                this.hide();
                            }
                        },
                        {
                            text: iNet.resources.message.button.cancel,
                            cls: 'btn-default',
                            icon: 'icon-remove',
                            fn: function () {
                                this.hide();
                            }
                        }
                    ]
                });
            }

            printDialog.setContent(String.format(resource.task.printReceiptNo || "{0}", content));
            printDialog.taskID = taskID;
            printDialog.show();
        };
        var setHeight = function () {
            try {
                iNet.getLayout().$iframe.height($(iNet.getLayout().window).height() - 90);
            } catch (e) {
            }

            $form.requestTaskContent.height($(window).height() - 45);
        };

        //REQUEST TASK ===========================================
        var displayContent = function($content, status){
            status = status || '';
            if ($content.hasClass('hide')){
                if (status != 'hide') { $content.removeClass('hide'); }
            } else {
                if (status != 'show') { $content.addClass('hide'); }
            }
        };

        var loadProcedure = function(value){
            $form.requestTaskProcedure = FormService.createSelect('task-request-procedure', [], 'id', 1, false, false);
            $form.requestTaskProcedure.setValue(value || "");
            setSubject();
            $.postJSON(url.task_tree, {}, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    var __listProcedure = [];
                    var __isReadOnly = false;
                    $.each(__result.elements || [], function(i, obj){
                        if (obj.assigned || false){
                            __listProcedure.push({id: obj.uimap.procedureID, code: obj.uimap.procedureID, name: obj.uimap.procedureName, data: obj});

                            if ((value || "") == obj.uimap.procedureID){
                                __isReadOnly = true;
                            }
                        }
                    });
                    $form.requestTaskProcedure = FormService.createSelect('task-request-procedure', __listProcedure, 'id', 1, false, false);
                    $form.requestTaskProcedure.setValue(value || "");
                    if (!iNet.isEmpty(value || "")){
                        loadRequestByProcedure();
                        loadReceiptByProcedure();
                    }

                    if (__isReadOnly) {
                        $form.requestTaskProcedure.disable();
                    } else {
                        $form.requestTaskProcedure.enable();
                    }

                    $form.requestTaskProcedure.on('change', function(){
                        loadRequestByProcedure();
                        loadReceiptByProcedure();
                    });
                }
            });
        };
        var loadExclusive = function(){
            $form.requestTaskExclusive = FormService.createSelect('task-request-exclusive', [], 'id', 1, true, true);
            $.postJSON(url.load_user, {}, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    var __listUser = [];
                    $.each(__result.items || [], function(i, obj){
                        __listUser.push({id: obj.username, code: obj.username, name: obj.fullname})
                    });
                    $form.requestTaskExclusive.setValue('');
                    $form.requestTaskExclusive = FormService.createSelect('task-request-exclusive', __listUser, 'id', 1, true, true);
                }
            });
        };

        var loadReceiptByProcedure = function(){
            var __procedureSelected = $form.requestTaskProcedure.getData() || {};
            var __additional = (selfData.item.pkgdata || {}).uuid || "";

            setSubject();
            $form.requestTaskReceiptNoLoad.trigger('click');

            if (iNet.isEmpty(__additional)){
                $.postJSON(url.appointment_request, {"procedureID": __procedureSelected.id}, function (result) {
                    var __result = result;
                    if (CommonService.isSuccess(__result)){
                        $form.requestTaskAppointment.val((__result.appointment || 0).longToDate());
                        $form.requestTaskAppointmentHour.val(new Date((__result.appointment || 0)).format('H:m'));
                        $form.requestTaskHour.val(__result.hour || 0);
                        displayContent($form.requestTaskReceiptContent, 'show');
                    } else {
                        self.notifyError(resource.constant.warning_title, self.getNotifyContent(resource.constant.warning_error, __result.errors || []));
                    }
                });
            } else {
                $.postJSON(url.appointment_request, {"additionalID": __additional}, function (result) {
                    var __result = result;
                    console.log("appointment_request result >>", __result);

                    if (CommonService.isSuccess(__result)) {
                        $form.requestTaskAppointment.val((__result.appointment || 0).longToDate());
                        $form.requestTaskAppointmentHour.val(new Date((__result.appointment || 0)).format('H:m'));
                        $form.requestTaskHour.val(__result.hour || 0);
                    } else {
                        self.notifyError(resource.constant.warning_title, self.getNotifyContent(resource.constant.warning_error, __result.errors || []));
                    }
                });
            }
        };
        var loadRequestByProcedure = function(){
            var __procedureSelected = $form.requestTaskProcedure.getData() || {};
            var __form = ((__procedureSelected.data || {}).uimap || {}).taskUI || "";

            if (iNet.isEmpty(__form)){
                return;
            }

            var __params = {form: __form, zone: iNet.zone, context: iNet.context};
            var __additional = (selfData.item.pkgdata || {}).uuid || "";

            if(iNet.isEmpty(__additional)){
                $.postJSON(url.new_request, __params, function (result) {
                    var __result = result || {};
                    console.log("loadRequestByProcedure result >>", __result);
                    if (CommonService.isSuccess(__result)){
                        var __contentHtml = __result.content;

                        $form.requestTaskFormAttachment.addClass('hide');
                        $form.requestTaskFormContent.html('');

                        FormService.appendHiddenField($form.requestTaskFormContentHidden, "zone", iNet.zone);
                        FormService.appendHiddenField($form.requestTaskFormContentHidden, "context", iNet.context);
                        FormService.appendHiddenField($form.requestTaskFormContentHidden, "form", __result.formID);
                        FormService.appendHiddenField($form.requestTaskFormContentHidden, "procedureID", __procedureSelected.id);

                        setTaskMembers(__result.nodeInfo || []);
                        setItemTaskData($form.requestTaskFormContent, __contentHtml);
                        displayContent($form.requestTaskDataContent, 'show');
                    } else {
                        self.notifyError(resource.constant.warning_title, self.getNotifyContent(resource.constant.warning_error, __result.errors || []));
                    }
                },{
                    mask: $mask.requestTask,
                    msg: iNet.resources.ajaxLoading.loading
                });
            } else {
                __params.additionalID = __additional;

                $.postJSON(url.create_request, __params, function (result) {
                    var __result = result || {};
                    console.log("create_request result >>", __result);
                    if (CommonService.isSuccess(__result)){
                        var __contentHtml = __result.content;

                        $form.requestTaskFormAttachment.addClass('hide');
                        FormService.appendHiddenField($form.requestTaskFormContentHidden, "zone", iNet.zone);
                        FormService.appendHiddenField($form.requestTaskFormContentHidden, "context", iNet.context);
                        FormService.appendHiddenField($form.requestTaskFormContentHidden, "form", __result.formID);

                        setTaskMembers(__result.nodeInfo || []);
                        setItemTaskData($form.requestTaskFormContent, __contentHtml);

                        var __htmlAttachment = "";
                        var __numAttachment = 0;
                        if ((__result.attachments || []).length > 0) {
                            $.each(__result.attachments || [], function (a, attachment) {
                                var $itemId = (attachment.contentID || attachment.gridfsUUID) || "";
                                var $itemFileName = (attachment.file || attachment.filename) || "";

                                $form.requestTaskFormContent.find('[data-control="File"]').each(function (i, item) {
                                    var __itemUI = $(item).find('[property-value="' + attachment.fieldname + '"]');
                                    if (__itemUI.length > 0) {
                                        $(item).find('[data-container]').html('<a href="' + url.downloadFile + '?binary=' + $itemId + '"><i class="' + iNet.FileFormat.getFileIcon($itemFileName) + '"></i> ' + $itemFileName + ' - ' + iNet.FileFormat.getSize(attachment.size || 0) + '</a>');
                                        $(item).find('[name="' + attachment.fieldname + '"]').attr('value', $itemId);
                                    }
                                });

                                console.log(">> attachment >>", attachment.fieldname, $form.requestTaskFormContent.find('[data-control="File"][name="' + attachment.fieldname + '"]').length == 0);
                                if ($form.requestTaskFormContent.find('[data-control="File"][name="' + attachment.fieldname + '"]').length == 0){

                                    __numAttachment++;
                                    __htmlAttachment += String.format(selfData.htmlAttachment(), $itemId, attachment.fieldname, iNet.FileFormat.getFileIcon(attachment.mimetype), $itemFileName, iNet.FileFormat.getSize(attachment.size || 0), (attachment.size || 0).toString(), $itemId);
                                }
                            });

                            console.log(">> __htmlAttachment >>", __htmlAttachment);
                            if (!iNet.isEmpty(__htmlAttachment)){
                                $form.requestTaskFormAttachment.removeClass('hide');
                                $form.requestTaskFormAttachmentNumber.text(__numAttachment);
                                $form.requestTaskFormAttachmentList.html(__htmlAttachment);
                            }
                        }
                    } else {
                        self.notifyError(resource.constant.warning_title, self.getNotifyContent(resource.constant.warning_error, __result.errors || []));
                    }
                });
            }
        };
        var setSubject = function(){
            var __procedureSelected = $form.requestTaskProcedure.getData() || {};
            var __fullName = $form.requestTaskUPFullName.val() || "";

            var __subject = __procedureSelected.name || "";
            if (!iNet.isEmpty(__fullName)){
                __subject += ' - ' + __fullName;
            }
            $form.requestTaskSubject.val(__subject);
        };

        var clearRequest = function(){
            $form.requestTaskDiv.show();
            displayContent($form.requestTaskProcedureContent, 'show');
            displayContent($form.requestTaskUPContent, 'show');
            displayContent($form.requestTaskReceiptContent, 'hide');
            displayContent($form.requestTaskDataContent, 'hide');

            FormService.createDate($form.requestTaskUPIdDateOfIssue);
            FormService.createDate($form.requestTaskUPOtherDateOfIssue);
            FormService.createDate($form.requestTaskAppointment);

            $form.requestTaskAppointmentHour.timepicker({
                minuteStep: 1,
                showSeconds: false,
                showMeridian: false
            });

            $form.requestTaskFormContent.html('');
            $form.requestTaskFormContentHidden.html('');
            $form.requestTaskSubject.val("");
            $form.requestTaskReceiptNo.val("");
            $form.requestTaskNumberOfRecord.val(1);
            $form.requestTaskRecordBook.val('');
            $form.requestTaskRecordOrder.val(1);
            $form.requestTaskAppointment.val(new Date().format('d/m/Y'));
            $form.requestTaskAppointmentHour.val(new Date().format('H:m'));
            $form.requestTaskHour.val(new Date().getTime());
            $form.requestTaskIsPostOfficeSelect.setValue('false');
            countRecordBook('');
        };
        var createRequest = function () {
            var __additional = (selfData.item.pkgdata || {}).uuid || "";
            var __procedureID = ((selfData.item.pkgdata || {}).requestData || {}).procedureID || "";
            var __profileID = ((selfData.item.pkgdata || {}).requestData || {}).profileID || "";
            var __isPostOffice = ((selfData.item.pkgdata || {}).requestData || {}).isPostOffice || "false";

            clearRequest();

            $form.requestTaskIsPostOfficeSelect.setValue(__isPostOffice);

            loadExclusive();
            loadProcedure(__procedureID);

            if (iNet.isEmpty(__profileID)){
                setUserProfile({});
                $form.requestTaskUPIdentity.removeAttr("disabled");
                $form.requestTaskUPBirthday.removeAttr("disabled");
            } else {
                $.postJSON(url.user_profile_load, {"profileID": __profileID}, function (result) {
                    var __result = result;
                    setUserProfile(__result);
                    $form.requestTaskUPIdentity.attr("disabled", "disabled");
                    $form.requestTaskUPBirthday.attr("disabled", "disabled");
                });
            }

            if (!iNet.isEmpty(__additional)){
                displayContent($form.requestTaskProcedureContent, 'show');
                displayContent($form.requestTaskUPContent, 'show');
                displayContent($form.requestTaskReceiptContent, 'show');
                displayContent($form.requestTaskDataContent, 'show');

                FormService.appendHiddenField($form.requestTaskFormContentHidden, "additionalID", __additional);
            }

            setHeight();
        };
        var validateRequest = function(type){
            if (iNet.isEmpty($form.requestTaskReceiptNo.val()) ||
                iNet.isEmpty($form.requestTaskAppointment.val()) ||
                iNet.isEmpty($form.requestTaskSubject.val())){
                var __errors = '\n';
                if (iNet.isEmpty($form.requestTaskReceiptNo.val())) {
                    __errors += resource.task.receiptNo + '\n';
                }

                if (iNet.isEmpty($form.requestTaskSubject.val())) {
                    __errors += resource.task.subject + '\n';
                }

                if (iNet.isEmpty($form.requestTaskAppointment.val())) {
                    __errors += resource.task.appointmentDate + '\n';
                }

                self.notifyError(resource.constant.warning_title, String.format(resource.constant.warning_error, __errors));
                return false;
            }

            var __appointment = $form.requestTaskAppointment.val().dateToLong();
            var __dateAppointment = new Date(__appointment);
            var __appointmentHour = $form.requestTaskAppointmentHour.val();
            if (__appointmentHour.split(':').length == 2){
                if (iNet.isNumber(Number(__appointmentHour.split(':')[0]))){
                    __dateAppointment.setHours(Number(__appointmentHour.split(':')[0]));
                }
                if (iNet.isNumber(Number(__appointmentHour.split(':')[1]))){
                    __dateAppointment.setMinutes(Number(__appointmentHour.split(':')[1]));
                }
            }

            console.log(">> __dateAppointment >>", __dateAppointment.getTime(), __dateAppointment.format('d/m/Y H:m'));

            FormService.appendHiddenField($form.requestTaskFormContentHidden, 'receiptNo', $form.requestTaskReceiptNo.val());
            FormService.appendHiddenField($form.requestTaskFormContentHidden, 'appointment', __dateAppointment.getTime());
            FormService.appendHiddenField($form.requestTaskFormContentHidden, 'hour', $form.requestTaskHour.val());
            FormService.appendHiddenField($form.requestTaskFormContentHidden, 'exclusive', $form.requestTaskExclusive.getValue().toString());
            FormService.appendHiddenField($form.requestTaskFormContentHidden, 'subject', $form.requestTaskSubject.val());
            FormService.appendHiddenField($form.requestTaskFormContentHidden, 'numberOfRecord', $form.requestTaskNumberOfRecord.val());
            FormService.appendHiddenField($form.requestTaskFormContentHidden, 'recordBook', $form.requestTaskRecordBook.val());
            FormService.appendHiddenField($form.requestTaskFormContentHidden, 'recordOrder', $form.requestTaskRecordOrder.val());
            FormService.appendHiddenField($form.requestTaskFormContentHidden, 'isPostOffice', $form.requestTaskIsPostOfficeSelect.getValue());

            //nodeName: "Đăng ký khai sinh"
            //member: iNet.JSON.encode(__argMember)
            var __argMember = [];
            //__argMember.push({username: "itsupport@inetcloud.vn", role: '', direction: "", nodeName: "Đăng ký khai sinh"});
            $form.requestTaskMembers.find('[type="checkbox"]').each(function(i, item){
                if ($(item).prop("checked")){
                    __argMember.push({username: $(item).attr('data-member'), role: '', direction: "", nodeName: $(item).attr("data-nodeName")});
                }
            });
            console.log("members >>", iNet.JSON.encode(__argMember));
            FormService.appendHiddenField($form.requestTaskFormContentHidden, 'member', iNet.JSON.encode(__argMember).replace(/"/gi, "'"));


            return true;
        };
        var submitRequest = function(type){
            //getItemTaskDataScript();
            var __messageValidate = !iNet.isFunction(((iNet || {}).requestData || {}).messageValidate) ? "" : ((iNet || {}).requestData || {}).messageValidate();
            console.log(">> submitRequest validate >>", {messageValidate: __messageValidate} );

            if (iNet.isEmpty(__messageValidate)) {
                $mask.ajaxTask.show();
                $form.requestTaskForm.ajaxSubmit({
                    url: url.submit_request,
                    beforeSubmit: function () {
                    },
                    uploadProgress: function (event, position, total, percentComplete) {
                    },
                    success: function () {
                    },
                    complete: function (xhr) {
                        $mask.ajaxTask.hide();
                        var __responseJSON = xhr.responseJSON || {};
                        var __responseText = xhr.responseText || {};
                        console.log(">> submitRequest result >>", __responseJSON, iNet.isEmpty(__responseJSON.uuid));

                        if (iNet.isEmpty(__responseJSON.uuid)) {
                            selfData.isRefresh = "";
                            self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __responseJSON.errors || []));
                        } else {
                            showPrintDialog(__responseJSON.subject, __responseJSON.uuid);
                            self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                            selfData.isRefresh = true;
                            $button.REQUEST_BACK.trigger('click');
                        }
                    }
                });
            } else {
                self.notifyError(resource.constant.warning_title, __messageValidate);
                $mask.ajaxTask.hide();
            }
        };
        var sendRequest = function(saveAsDraft){
            var __fnCallBack = function(){
                if (validateRequest()){
                    FormService.appendHiddenField($form.requestTaskFormContentHidden, 'saveAsDraft', saveAsDraft);
                    submitRequest();
                }
            };
            searchUserProfile(__fnCallBack);
        };

        var showProfile = function(profile){
            $form.requestTaskUPContent.find('[data-profile="'+profile+'"]').show();
            $form.requestTaskUPSearchContent.find('[data-profile="'+profile+'"]').show();
        };
        var hideProfile = function(profile){
            $form.requestTaskUPContent.find('[data-profile="'+profile+'"]').hide();
            $form.requestTaskUPSearchContent.find('[data-profile="'+profile+'"]').hide();
        };
        var setUserProfile = function(data){
            var __dataUserProfile = data || {};
            $form.requestTaskUPAddress1.val(__dataUserProfile.address1 || "");
            $form.requestTaskUPAddress2.val(__dataUserProfile.address2 || "");
            $form.requestTaskUPBirthday.val(__dataUserProfile.birthday || "");
            $form.requestTaskUPEmail.val(__dataUserProfile.email || "");
            $form.requestTaskUPFullName.val(__dataUserProfile.fullname || "");
            $form.requestTaskUPIdDateOfIssue.val(__dataUserProfile.idDateOfIssue || "");
            $form.requestTaskUPIdentity.val(__dataUserProfile.identity || "");
            $form.requestTaskUPIdPlaceOfIssuse.val(__dataUserProfile.idPlaceOfIssuse || "");
            $form.requestTaskUPNationality.val(__dataUserProfile.nationality || resource.task.userprofileNationality);
            $form.requestTaskUPOtherDateOfIssue.val(__dataUserProfile.otherDateOfIssue || "");
            $form.requestTaskUPOtherNumber.val(__dataUserProfile.otherNumber || "");
            $form.requestTaskUPOtherPlaceOfIssuse.val(__dataUserProfile.otherPlaceOfIssuse || "");
            $form.requestTaskUPRegion.val(__dataUserProfile.region || ((selfData.profileType == "citizen") ? resource.task.userprofileRegion : ""));
            $form.requestTaskUPSmobile.val(__dataUserProfile.mobile || "");
            $form.requestTaskUPFemale.prop("checked", (__dataUserProfile.sex == "Nu" || __dataUserProfile.sex == "TNHH" || (__dataUserProfile.sex || "") == ""));
            if (!$form.requestTaskUPFemale.prop("checked")) {
                $form.requestTaskUPMale.prop("checked", true);
            }
            if (__dataUserProfile.company == "DN") {
                $form.requestTaskUPOrgan.prop("checked", true);
                showProfile("organ");
                hideProfile("citizen");
            } else {
                $form.requestTaskUPCitizen.prop("checked", true);
                showProfile("citizen");
                hideProfile("organ");
            }

            setSubject();
        };
        var searchUserProfile = function(callback){
            var __params = {
                address1: $form.requestTaskUPAddress1.val(),
                address2: $form.requestTaskUPAddress2.val(),
                birthday: $form.requestTaskUPBirthday.val(),
                email: $form.requestTaskUPEmail.val(),
                fullname: $form.requestTaskUPFullName.val(),
                idDateOfIssue: $form.requestTaskUPIdDateOfIssue.val(),
                identity: $form.requestTaskUPIdentity.val(),
                idPlaceOfIssuse: $form.requestTaskUPIdPlaceOfIssuse.val(),
                nationality: $form.requestTaskUPNationality.val(),
                otherDateOfIssue: $form.requestTaskUPOtherDateOfIssue.val(),
                otherNumber: $form.requestTaskUPOtherNumber.val(),
                otherPlaceOfIssuse: $form.requestTaskUPOtherPlaceOfIssuse.val(),
                region: $form.requestTaskUPRegion.val(),
                mobile: $form.requestTaskUPSmobile.val()
            };

            if ($form.requestTaskUPCitizen.prop("checked")){
                __params.sex = "Nam";
                __params.company = "CN";
                if ($form.requestTaskUPFemale.prop("checked")){
                    __params.sex = "Nu";
                }
            } else {
                __params.sex = "CP";
                __params.company = "DN";
                if ($form.requestTaskUPFemale.prop("checked")){
                    __params.sex = "TNHH";
                }
            }

            if (
                iNet.isEmpty(__params.fullname) ||
                iNet.isEmpty(__params.birthday) ||
                iNet.isEmpty(__params.identity) ||
                /*iNet.isEmpty(__params.idDateOfIssue) ||
                iNet.isEmpty(__params.idPlaceOfIssuse) ||
                iNet.isEmpty(__params.nationality) ||
                iNet.isEmpty(__params.region) ||*/
                iNet.isEmpty(__params.address1) /*||
                iNet.isEmpty(__params.address2) ||
                iNet.isEmpty(__params.mobile) ||
                iNet.isEmpty(__params.email)*/
            ) {
                $mask.ajaxTask.hide();
                self.notifyError(resource.constant.warning_title, String.format(resource.constant.warning_error, resource.task.userprofileInfo));
                return;
            }

            $.postJSON(url.user_profile_search, __params, function (result) {
                var __result = result || {};
                console.log("user_profile result >>", __result, iNet.isFunction(callback));

                if (CommonService.isSuccess(__result)){
                    var __profileID = __result.uuid || "";
                    FormService.appendHiddenField($form.requestTaskFormContentHidden, 'profileID', __profileID);

                    if (iNet.isFunction(callback)){
                        callback();
                    }
                } else {
                    $mask.ajaxTask.hide();
                    self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                }
            });
        };
        var filterUserProfile = function(keysearch){
            if (iNet.isEmpty($form.requestTaskUPIdentity.attr("disabled"))){
                /*wgmUserProfile.setData(__data);
                 wgmUserProfile.show();*/

                $form.requestTaskUPContent.hide();
                $form.requestTaskUPSearchContent.show();

                var __keysearch = keysearch || "";
                var __data = {};
                __data.identity = $form.requestTaskUPIdentity.val();
                __data.birthday = $form.requestTaskUPBirthday.val();
                __data.fullname = $form.requestTaskUPFullName.val();
                if (!iNet.isEmpty(__keysearch)){
                    if (__keysearch == "fullname"){
                        delete __data.birthday;
                        delete __data.identity;
                    }

                    if (__keysearch == "birthday"){
                        delete __data.fullname;
                        delete __data.identity;
                    }

                    if (__keysearch == "identity"){
                        delete __data.birthday;
                        delete __data.fullname;
                    }
                }

                if ($form.requestTaskUPOrgan.prop("checked")){
                    __data.company = 'DN';
                } else {
                    __data.company = 'CN';
                }

                $.postJSON(url.user_profile_filter, __data, function (result) {
                    var __result = result || {};
                    var __profiles = __result.items || [];

                    $form.requestTaskUPTable.find('tbody').html('');

                    $.each(__profiles, function(i, item){
                        for(var key in item){
                            $form.requestTaskUPRowTemplate.find('[data-type="'+key+'"]').text(item[key]);
                        }
                        $form.requestTaskUPTable.find('tbody').append('<tr>'+$form.requestTaskUPRowTemplate.html()+'</tr>');
                    });

                    $form.requestTaskUPTable.find('[data-action]').unbind();

                    $form.requestTaskUPTable.find('[data-action="close"]').on('click', function(){
                        $form.requestTaskUPContent.show();
                        $form.requestTaskUPSearchContent.hide();
                    });

                    $form.requestTaskUPTable.find('[data-action="select"]').on('click', function(){
                        $form.requestTaskUPContent.show();
                        $form.requestTaskUPSearchContent.hide();
                        var __profileID = $(this).parent().find('[data-type="uuid"]').text();
                        $(__profiles).each(function(i, profile){
                            if (profile.uuid == __profileID){
                                setUserProfile(profile);
                            }
                        });
                    });

                    if (__profiles.length == 1){
                        $form.requestTaskUPTable.find('[data-action="select"]:first').trigger('click');
                    }
                });
            }
        };
        var countRecordBook = function(recordBook){
            $.postJSON(url.receiverBookCount, {"recordBook": recordBook}, function (result) {
                var __result = result || {};
                console.log("receiverBookCount result >>", __result);
                if (CommonService.isSuccess(__result)){
                    $form.requestTaskRecordOrder.val(__result.recordOrder || 1);
                }
            });
        };

        $form.requestTaskRecordBook.on('change', function(){
            countRecordBook($form.requestTaskRecordBook.val());
        });
        $form.requestTaskUPFullName.on('change', function(){
            setSubject();
        });
        $form.requestTaskProcedureInfo.on('click', function(){
            displayContent($form.requestTaskProcedureContent);
        });
        $form.requestTaskDataInfo.on('click', function(){
            displayContent($form.requestTaskDataContent);
        });

        $form.requestTaskUPInfo.on('click', function(){
            displayContent($form.requestTaskUPContent);
        });
        $form.requestTaskUPRandomInfo.on('click', function(){
            if (iNet.isEmpty($form.requestTaskUPIdentity.attr("disabled"))){
                $form.requestTaskUPFullName.val(resource.task.userprofileRandomFullname);
                $form.requestTaskUPIdentity.val('unk'+ iNet.generateId().substring(0, 6));
                $form.requestTaskUPBirthday.val(resource.task.userprofileRandomBirthday);
                $form.requestTaskUPAddress1.val(resource.task.userprofileRandomAddress1);
                setSubject();
            }
        });
        $form.requestTaskUPShowInfo.on('click', function(){
            $form.requestTaskUPMoreInfo01.show();
            $form.requestTaskUPMoreInfo02.show();
            $form.requestTaskUPShowInfo.hide();
            $form.requestTaskUPHideInfo.show();
        });
        $form.requestTaskUPHideInfo.on('click', function(){
            $form.requestTaskUPMoreInfo01.hide();
            $form.requestTaskUPMoreInfo02.hide();
            $form.requestTaskUPShowInfo.show();
            $form.requestTaskUPHideInfo.hide();
        });
        $form.requestTaskUPClickSearch.on('click', function(){
            var __keysearch = $(this).attr('data-searchId') || "";
            filterUserProfile(__keysearch);
        });
        $form.requestTaskUPKeyupSearch.on('keyup', function(e){
            if (e.which == 13){
                var __keysearch = $(this).attr('data-searchId') || "";
                filterUserProfile(__keysearch);
            }
        });
        $form.requestTaskUPCitizen.on('click', function(){
            selfData.profileType = "citizen";
            if ($form.requestTaskUPRegion.val() == ""){
                $form.requestTaskUPRegion.val(resource.task.userprofileRegion);
            }
            showProfile('citizen');
            hideProfile('organ');
        });
        $form.requestTaskUPOrgan.on('click', function(){
            selfData.profileType = "organ";
            if ($form.requestTaskUPRegion.val() == resource.task.userprofileRegion){
                $form.requestTaskUPRegion.val("");
            }
            showProfile('organ');
            hideProfile('citizen');
        });

        $form.requestTaskReceiptInfo.on('click', function(){
            displayContent($form.requestTaskReceiptContent);
        });
        $form.requestTaskReceiptShowInfo.on('click', function(){
            $form.requestTaskReceiptMoreInfo.show();
            $form.requestTaskReceiptShowInfo.hide();
            $form.requestTaskReceiptHideInfo.show();
        });
        $form.requestTaskReceiptHideInfo.on('click', function(){
            $form.requestTaskReceiptMoreInfo.hide();
            $form.requestTaskReceiptShowInfo.show();
            $form.requestTaskReceiptHideInfo.hide();
        });
        $form.requestTaskReceiptNoLoad.on('click', function(){
            $.postJSON(url.receiverno, {}, function (result) {
                var __result = result || new Date().format('YmdHis');
                $form.requestTaskReceiptNo.val(__result);
            });
        });

        $form.requestTaskRecordBookLoad.on('click', function(){
            if($form.requestTaskRecordBookLoad.parent().hasClass('open')){
                $form.requestTaskRecordBookLoad.parent().removeClass('open');
            } else {
                $form.requestTaskRecordBookList.width($($(this).parent()).width());
                $form.requestTaskRecordBookList.html('');
                $.postJSON(url.receiverBookList, {}, function (result) {
                    var __result = result || {};
                    $.each(__result.elements, function(i, item){
                        if(!iNet.isEmpty(item)){
                            $form.requestTaskRecordBookList.append(String.format('<tr style="cursor: pointer; height: 30px;"><td style="padding: 5px;">{0}</td></tr>', item));
                        }
                    });
                    $form.requestTaskRecordBookLoad.parent().addClass('open');
                    $form.requestTaskRecordBookList.find('tr').on('click', function(){
                        var __recordBook = $(this).find('td:first').text();
                        $form.requestTaskRecordBook.val(__recordBook);
                        countRecordBook(__recordBook);
                        $form.requestTaskRecordBookLoad.parent().removeClass('open');
                    });
                });
            }
        });

        $form.requestTaskUPBirthday.on('change', function(event){
            if (!iNet.isEmpty($form.requestTaskUPBirthday.val())){
                if (!FormService.validateDate($form.requestTaskUPBirthday.val())){
                    $form.requestTaskUPBirthday.val("");
                }
            }
        });
        $form.requestTaskUPBirthday.on('keyup', function(event){
            if (!iNet.isEmpty($form.requestTaskUPBirthday.val())){
                if (!FormService.validateDate($form.requestTaskUPBirthday.val(), true)){
                    $form.requestTaskUPBirthday.val("");
                }
            }
        });

        $button.REQUEST_SUBMIT.on('click', function(){
            $mask.ajaxTask.show();
            sendRequest(false);
        });
        $button.REQUEST_SAVE.on('click', function(){
            $mask.ajaxTask.show();
            sendRequest(true)
        });
        $button.REQUEST_BACK.on('click', function(){
            self.fireEvent('finish', selfData.isRefresh);
        }.createDelegate(this));
        //ITEM TASK ==========================================
        var setTaskMembers = function(nodes){
            $form.requestTaskMembers.html('');
            var __htmlMembers = '';
            var __nodes = nodes || [];
            $.each(__nodes, function(i, node){
                var __node = node || {};
                __htmlMembers+='<ul style="list-style: none;margin-left: 0;">';
                __htmlMembers+='<li><span class="label label-xlg label-info"><i class="icon-chevron-sign-right"></i> '+__node.nodeName+'</span></li>';
                $.each(__node.members || [], function(j, member){
                    var __member = member || {};
                    __htmlMembers+='<ul style="list-style: none;margin-left: 0;">';
                    __htmlMembers+='<li>';
                    __htmlMembers+='    <div class="checkbox">';
                    __htmlMembers+='        <label>';
                    __htmlMembers+='            <input type="checkbox" data-nodeName="'+__node.nodeName+'" data-member="'+__member.usercode+'" value="" class="ace" style="display: none;">';
                    __htmlMembers+='            <span class="lbl"> '+__member.username+'</span>';
                    __htmlMembers+='        </label>';
                    __htmlMembers+='    </div>';
                    __htmlMembers+='</li>';
                    __htmlMembers+='</ul>';
                });
                __htmlMembers+='</ul>';
            });
            $form.requestTaskMembers.html(__htmlMembers);
        };
        var setItemTaskData = function($formContent, contentHtml){
            //Set task content html data
            $formContent.html(contentHtml);
            for(var i = 1; i<=12; i++) {
                $formContent.find('.col-md-'+i).removeClass('col-md-'+i);
                $formContent.find('.col-xs-'+i).removeClass('col-xs-'+i);
                $formContent.find('.col-sm-'+i).removeClass('col-sm-'+i);
            }
            $formContent.find('.row').removeClass('row');
            PublicService.PageScript($formContent);
        };

        this.setData = function(data){
            var __data = data || {};
            selfData.item = __data.item || {};
            selfData.info = __data.info || {};
            selfData.isRefresh = "";

            createRequest();

            $('html').css('overflow', 'hidden');
        };

        //OTHER ==============================================
        $(iNet.getLayout()).on('resize', function () {
            setHeight();
        });

        iNet.ui.task.TRequest.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.task.TRequest, iNet.ui.app.widget);
});
