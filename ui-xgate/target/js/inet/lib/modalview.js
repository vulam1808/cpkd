// #PACKAGE: modalview
// #MODULE: ModalViewService
$(function () {
    iNet.ns("iNet.ui.modalview");

    iNet.ui.modalview = function () {
        this.id = iNet.generateId();
        var $dialog =  $('[data-id="modal-view-control"]');
        var self = this;

        var resource = {
            global: iNet.resources.global,
            constant: iNet.resources.constant,
            errors : iNet.resources.errors
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
            title: $('[data-id="modal-view-control-tile"]'),
            body: $('[data-id="modal-view-control-body"]'),
            info: $('[data-id="modal-view-control-body-info"]'),
            note: $('[data-id="modal-view-control-body-note"]'),
            description: $('[data-id="modal-view-control-additional-description"]'),
            additional: $('[data-id="modal-view-control-additional"]'),
            attachments: $('[data-id="modal-view-control-attachment-list"]')
        };

        var $button = {
            submit: $('[data-id="modal-view-control-submit-btn"]'),
            close: $('[data-id="modal-view-control-close-btn"]'),
            addAtt: $('[data-id="modal-view-control-attachment-add"]')
        };

        $form.note.on('change', function(){
            $form.description.attr('value', $form.note.val());
        });
        
        this.setUrl = function(url){
            self.url = url || "";
        };
        this.setTitle = function(title){
            $form.title.text(title || "");
        };
        this.setDescription = function(infomation){
            $form.info.text(infomation || "");
        };
        this.setAreaName = function(name){
            $form.description.attr('name', name);
        };
        this.setParams = function(params){
            self.params = params || {};
        };
        this.setAdditional = function(url, hiddenField){
            self.additional = true;
            self.additionalUrl = url;
            
            for(var key in (hiddenField || {})){
                FormService.appendHiddenField($form.additional, key, hiddenField[key]);
            }

            $form.attachments.html('');
            $form.additional.show();

            $button.addAtt.unbind('click');
            $button.addAtt.on('click', function(){
                var __htmlFormAttachment = '';
                __htmlFormAttachment+='<div class="row-fluid">';
                __htmlFormAttachment+='    <label class="span2">'+resource.global.file+'</label>';
                __htmlFormAttachment+='    <div class="ace-file-input span10" data-container data-name="{0}">';
                __htmlFormAttachment+='         <label data-title="Click here" class="ace-file-container file-label">';
                __htmlFormAttachment+='             <span data-title="..." class="ace-file-name file-name"><i class="icon-upload-alt ace-icon"></i></span>';
                __htmlFormAttachment+='         </label>';
                __htmlFormAttachment+='         <a data-remove data-name="{0}" class="remove" href="#"><i class=" ace-icon fa fa-times"></i></a>';
                __htmlFormAttachment+='    </div>';
                __htmlFormAttachment+='    <input type="file" name="{0}" style="display:none;" data-file data-name="{0}"/>';
                __htmlFormAttachment+='</div>';

                var __dataName = iNet.generateId();
                $('[data-id="modal-view-control-attachment-list"]').append(String.format(__htmlFormAttachment, __dataName));

                 $('[data-id="modal-view-control-attachment-list"] [data-file][data-name="'+__dataName+'"]').on('change', function(){
                     console.log(">>data-file>> click");
                     if (this.files.length < 1) {
                         this.files = [];
                         return;
                     }
                     var __dataName = $(this).attr('data-name');
                     var __nameFile = this.files[0].name;
                     $(this).parent().find('span[data-title]').attr('data-title', __nameFile);
                     $(this).parent().find('.ace-file-container').addClass('selected');
                 });

                 $('[data-id="modal-view-control-attachment-list"] [data-remove][data-name="'+__dataName+'"]').on('click', function(){
                 $(this).parent().parent().remove();
                 });

                 $('[data-id="modal-view-control-attachment-list"] [data-container][data-name="'+__dataName+'"]').on('click', function(){
                 console.log(">>data-container>> click", $(this).attr('data-name'));
                 var __dataName = $(this).attr('data-name');

                 $('[data-id="modal-view-control-attachment-list"] [data-file][data-name="'+__dataName+'"]').trigger('click');
                 });

                 $('[data-id="modal-view-control-attachment-list"] [data-file][data-name="'+__dataName+'"]').trigger('click');
            });
        };
        this.setTop = function(percent){
            $dialog.css("top", percent + '%');
        };
        this.show = function () {
            $form.note.val('');
            $dialog.modal('show');
        };
        this.hide = function () {
            $dialog.modal('hide');
        };

        var onSubmit = function(){
            $button.submit.attr('disabled','disabled');
            if (iNet.isEmpty(self.params)){
                self.params = {};
            }

            self.params.note = $form.note.val();
            if (iNet.isEmpty($form.note.val())){
                showNotify(typeNotifyError, resource.constant.warning_title, resource.constant.warning_required);
                return;
            }
            
            var __fnCallback = function(){
                $button.submit.removeAttr('disabled');
                if (!iNet.isEmpty(self.url)){
                    $.postJSON(self.url, self.params, function (result) {
                        var __result = result || {};
                        if (CommonService.isSuccess(__result)){
                            showNotify(typeNotifySuccess, resource.constant.submit_title, resource.constant.submit_success);
                            self.fireEvent('success');
                        } else {
                            showNotify(typeNotifyError, resource.constant.submit_title, getNotifyContent(resource.constant.submit_error, __result.errors || []));
                        }
                    });
                } else {
                    showNotify(typeNotifySuccess, resource.constant.submit_title, resource.constant.submit_success);
                    self.fireEvent('success');
                }
            };

            if (self.additional && !iNet.isEmpty(self.additionalUrl)){
                var __isExists = false;
                $form.attachments.find('[type="file"]').each(function(i, file){
                    if (!iNet.isEmpty($(file).val())){
                        __isExists = true;
                        return true;
                    }
                });

                //if (__isExists){
                    $form.additional.ajaxSubmit({
                        url: self.additionalUrl,
                        beforeSubmit: function () {
                        },
                        uploadProgress: function (event, position, total, percentComplete) {
                        },
                        success: function () {
                        },
                        complete: function (xhr) {
                            var __responseJSON = xhr.responseJSON || {};
                            var __responseText = xhr.responseText || {};

                            if (CommonService.isSuccess(__responseJSON)) {
                                __fnCallback();
                            } else {
                                self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __responseJSON.errors || []));
                            }
                        }
                    });
                //}
            } else {
                __fnCallback();
            }
        }.createDelegate(this);
        var onClose = function(){
            self.hide();
        };

        $button.submit.on('click', onSubmit);
        $button.close.on('click', onClose);
    };

    iNet.extend(iNet.ui.modalview, iNet.Component);
});
