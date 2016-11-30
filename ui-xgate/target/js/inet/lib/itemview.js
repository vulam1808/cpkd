// #PACKAGE: itemview
// #MODULE: ItemViewService
$(function () {
    iNet.ns("iNet.ui.itemview");

    iNet.ui.itemview = function (config) {
        var _config = config || {};
        this.id = _config.id || 'item-view-div';
        this.idInterface = 'item-view-interface';
        var self = this;
        iNet.ui.itemview.superclass.constructor.call(this);

        if (iNet.isEmpty($.getCmp(this.id).prop('id'))){
            throw new Error("Identity not found: Can't create control, please config id right when initialization!...");
            return;
        }
        
        var template = {
            hidden: function () {
                var __html = '';
                __html += '<div class="hide"><input type="text" name="{0}" value="{1}"></div>'
                return __html;
            },
            comment: function () {
                var __html = '';
                __html += '<div class="border">';
                __html += '<a href="javascript:;">';
                __html += '<img class="avatar" src="{0}?usercode={2}&thumbnail=48">';
                __html += '</a>';
                __html += '<div class="content-box">';
                __html += '<div class="comment-header">';
                __html += '<div>';
                __html += '<strong><a href="javascript:;" class="author" title="{2}">{1}</a></strong>';
                __html += '<span>{3}</span>';
                __html += '<a href="" class="timestamp">';
                __html += '<time datetime="{4}" is="relative-time" title="{4}">{4}</time>';
                __html += '</a>';
                __html += '</div>';
                __html += '</div>';
                __html += '<div class="comment-content">';
                __html += '<span>{5}</span>';
                __html += '</div>';
                __html += '</div>';
                __html += '</div>';
                return __html;
            },
            attachment: function (type) {
                var __html = '';

                if ((type || 0) == 1){
                    __html += '<li file-id="{0}" file-name="{1}" title="{1}">';
                    __html += '<div class="file-box">';
                    __html += '<div class="file">';
                    __html += '<span class="corner"></span>';
                    __html += '<div class="icon" style="display: none;"><i class="{2}"></i></div>';
                    __html += '<div class="file-name">';
                    __html += '<div class="file-text"><i class="{2}"></i> {3}</div>';
                    __html += '<div class="file-size" file-size="{5}"><small>{4}</small></div>';
                    __html += '<div class="file-action" style="padding: 5px;display: flex;">';
                    __html += '<a data-action="viewfile" title="' + self.resource.global.fileView + '" data-id="{6}" style="width: 50%;border: 1px solid #DDD;border-radius: 15px;float: left;text-align: center;margin-right: 2px;padding-top: 3px;padding-bottom: 3px;">';
                    __html += '<i class="ace-icon icon-eye-open"></i>';
                    __html += '<a data-action="downfile" title="' + self.resource.global.fileDownload + '" data-id="{6}" style="width: 50%;border: 1px solid #DDD;border-radius: 15px;float: right;text-align: center;margin-left: 2px;padding-top: 3px;padding-bottom: 3px;">';
                    __html += '<i class="ace-icon icon-download-alt"></i>';
                    __html += '</a>';
                    __html += '</div>';
                    __html += '</div>';
                    __html += '</a>';
                    __html += '</div>';
                    __html += '</div>';
                    __html += '</li>';
                }

                if ((type || 0) == 2){
                    __html += '<span data-info style="color: #0000ff;">';
                    __html += '<i class="{0}"></i> {1} - {2}';
                    __html += '<a data-action="downfile" title="' + self.resource.global.fileDownload + '" data-id="{3}" style="padding: 5px;margin-left:5px;border: 1px solid #DDD;border-radius: 15px;"><i class="icon-download-alt"></i></a>';
                    __html += '<a data-action="viewfile" title="' + self.resource.global.fileView + '" data-id="{3}" style="padding: 5px;margin-left:5px;border: 1px solid #DDD;border-radius: 15px;"><i class="icon-eye-open"></i></a>';
                    __html += '</span>';
                }

                if ((type || 0) == 3){
                    __html += '<a data-info style="padding: 5px;padding-right:10px;margin-left:5px;border: 1px solid #DDD;border-radius: 15px;" href="javascript:" onclick="{0}"> <i class="icon-trash"></i></a>';
                }

                return __html;
            },
            external: function(type){
                var __html = '';

                var __type = type || 0;
                
                if (__type == 1) {
                    __html += '<div class="dd" style="max-width: 100%; padding-right: 10px;">';
                    __html += '<ol class="dd-list">';
                    __html += '<li class="dd-item dd2-item" data-id="15">';
                    __html += '<button onclick="externalClick(this);" data-action="collapse" data-css="dd-collapsed" type="button" style="display: block;">collapse</button>';
                    __html += '<button onclick="externalClick(this);" data-action="expand" data-css="dd-collapsed" type="button" style="display: none;">expand</button>';
                    __html += '<div class="dd-handle dd2-handle" style="height: 100%;">';
                    __html += '<i class="normal-icon ace-icon fa fa-user blue bigger-130"></i>';
                    __html += '<i class="drag-icon ace-icon fa fa-arrows bigger-125"></i>';
                    __html += '</div>';
                    __html += '<div class="dd2-content">{0}</div>';
                    __html += '</li>';
                    __html += '<ol class="dd-list" style="">';
                    __html += '{1}';
                    __html += '</ol>';
                    __html += '</ol>';
                    __html += '</div>';
                }
                
                if(__type == 2) {
                    __html += '<li class="dd-item dd2-item" data-id="16">';
                    __html += '<div class="dd-handle dd2-handle" style="height: 100%;">';
                    __html += '<i class="normal-icon ace-icon fa {1} orange bigger-130"></i>';
                    __html += '<i class="drag-icon ace-icon fa fa-arrows bigger-125"></i>';
                    __html += '</div>';
                    __html += '<div class="dd2-content" style="display: flex;">';
                    __html += '<div>{0}</div>';
                    __html += '<div class="pull-right action-buttons" onclick="{3}">';
                    __html += '<a class="blue" href="#">';
                    __html += '<i class="ace-icon fa {2} bigger-130"></i>';
                    __html += '</a>';
                    __html += '</div>';
                    __html += '</div>';
                    __html += '</li>';
                }

                if(__type == 3) {
                    __html += '<li class="dd-item dd2-item" data-id="16">';
                    __html += '<div class="dd-handle dd2-handle" style="height: 100%;">';
                    __html += '<i class="normal-icon ace-icon fa fa-file orange bigger-130"></i>';
                    __html += '<i class="drag-icon ace-icon fa fa-arrows bigger-125"></i>';
                    __html += '</div>';
                    __html += '<div class="dd2-content" style="display: flex;">';
                    __html += '<div>{0}</div>';
                    __html += '<div style="margin-left: 8px;" class="pull-right action-buttons {2}">';
                    __html += '<a data-action="verifyfile" title="' + self.resource.global.fileVerify + '" data-id="{1}" class="orange" href="#">';
                    __html += '<i class="icon-key bigger-130"></i>';
                    __html += '</a>';
                    __html += '</div>';
                    __html += '<div style="margin-left: 8px;" class="pull-right action-buttons {2}">';
                    __html += '<a data-action="signfile" title="' + self.resource.global.fileSign + '" data-id="{1}" class="red" href="#">';
                    __html += '<i class="icon-edit bigger-130"></i>';
                    __html += '</a>';
                    __html += '</div>';
                    __html += '<div style="margin-left: 8px;" class="pull-right action-buttons">';
                    __html += '<a data-action="viewfile" title="' + self.resource.global.fileView + '" data-id="{1}" class="green" href="#">';
                    __html += '<i class="ace-icon fa fa-eye bigger-130"></i>';
                    __html += '</a>';
                    __html += '</div>';
                    __html += '<div style="margin-left: 8px;" class="pull-right action-buttons">';
                    __html += '<a data-action="downfile" title="' + self.resource.global.fileDownload + '" data-id="{1}" class="blue" href="#">';
                    __html += '<i class="ace-icon fa fa-download bigger-130"></i>';
                    __html += '</a>';
                    __html += '</div>';
                    __html += '</div>';
                    __html += '</li>';
                }
                
                return __html;
            }
        };

        var url = {
            downloadFile: iNet.getUrl('onegate/binary/download'),
            avatarUser: iNet.getUrl('system/userprofile/photo')
        };

        //APPLY ITEM VIEW INTERFACE ========================================
        var $itemView = $.getCmp(this.id);
        var $interface = $.getCmp(this.idInterface);
        if (iNet.isEmpty($itemView.html().replace(/ /gi, "").replace(/\n/gi, ""))){
            $itemView.html('').append($interface.html());
        }
        //$interface.remove();
        this.resource = _config.resource || {};
        this.url = iNet.apply(url, _config.url || {});

        var $button = {
            PREV: $('#'+ this.id + ' [data-id="item-view-previous"]'),
            NEXT: $('#'+ this.id + ' [data-id="item-view-next"]'),
            MENU: $('#'+ this.id + ' [data-id="item-view-menu"]')
        };

        var $el = {
            control: $('#'+ this.id + ' [data-id="item-view-control"]'),

            content: $('#'+ this.id + ' [data-id="item-view-content"]'),
            contentNoItem: $('#'+ this.id + ' [data-id="item-view-no-item"]'),
            contentDataItem: $('#'+ this.id + ' [data-id="item-view-data-item"]'),

            //HEADER
            header: $('#'+ this.id + ' [data-id="item-view-header-info"]'),

            toolbar: $('#'+ this.id + ' [data-id="item-view-header-toolbar"]'),

            subjectAttachmentIcon: $('#'+ this.id + ' [data-id="item-view-subject-attachment-icon"]'),
            subjectCommentIcon: $('#'+ this.id + ' [data-id="item-view-subject-comment-icon"]'),
            subjectDetailsIcon: $('#'+ this.id + ' [data-id="item-view-subject-details-icon"]'),
            subjectTitle: $('#'+ this.id + ' [data-id="item-view-subject-title"]'),
            subjectDetails: $('#'+ this.id + ' [data-id="item-view-subject-details"]'),

            senderDetailsIcon: $('#'+ this.id + ' [data-id="item-view-sender-details-icon"]'),
            senderName: $('#'+ this.id + ' [data-id="item-view-sender-name"]'),
            senderDate: $('#'+ this.id + ' [data-id="item-view-sender-date"]'),
            senderDetails: $('#'+ this.id + ' [data-id="item-view-sender-details"]'),

            //BODY
            body: $('#'+ this.id + ' [data-id="item-view-body-info"]'),

            data: $('#'+ this.id + ' [data-id="item-view-data"]'),
            dataContent: $('#'+ this.id + ' [data-id="item-view-data-content"]'),
            dataContentHidden: $('#'+ this.id + ' [data-id="item-view-data-content-hidden"]'),

            form: $('#'+ this.id + ' [data-id="item-view-form"]'),
            formContent: $('#'+ this.id + ' [data-id="item-view-form-content"]'),
            formContentHidden: $('#'+ this.id + ' [data-id="item-view-form-content-hidden"]'),

            submit: $('#'+ this.id + ' [data-id="item-view-submit"]'),
            submitContent: $('#'+ this.id + ' [data-id="item-view-submit-content"]'),
            submitContentHidden: $('#'+ this.id + ' [data-id="item-view-submit-content-hidden"]'),

            //FOOTER
            attachment: $('#'+ this.id + ' [data-id="item-view-attachment-info"]'),

            attachBrief: $('#'+ this.id + ' [data-id="item-view-attach-brief-view"]'),
            attachBriefNumber: $('#'+ this.id + ' [data-id="item-view-attach-brief-number"]'),
            attachBriefDownloadAll: $('#'+ this.id + ' [data-id="item-view-attach-brief-download-all"]'),
            attachBriefViewAll: $('#'+ this.id + ' [data-id="item-view-attach-brief-view-image"]'),
            attachBriefList: $('#'+ this.id + ' [data-id="item-view-attach-brief-list"]'),

            attachAdditional: $('#'+ this.id + ' [data-id="item-view-attach-additional-view"]'),
            attachAdditionalNumber: $('#'+ this.id + ' [data-id="item-view-attach-additional-number"]'),
            attachAdditionalDownloadAll: $('#'+ this.id + ' [data-id="item-view-attach-additional-download-all"]'),
            attachAdditionalViewAll: $('#'+ this.id + ' [data-id="item-view-attach-additional-view-image"]'),
            attachAdditionalList: $('#'+ this.id + ' [data-id="item-view-attach-additional-list"]'),

            attachIDesk: $('#'+ this.id + ' [data-id="item-view-attach-idesk-view"]'),
            attachIDeskNumber: $('#'+ this.id + ' [data-id="item-view-attach-idesk-number"]'),
            attachIDeskDownloadAll: $('#'+ this.id + ' [data-id="item-view-attach-idesk-download-all"]'),
            attachIDeskViewAll: $('#'+ this.id + ' [data-id="item-view-attach-idesk-view-image"]'),
            attachIDeskList: $('#'+ this.id + ' [data-id="item-view-attach-idesk-list"]'),

            attachAgency: $('#'+ this.id + ' [data-id="item-view-attach-agency-view"]'),
            attachAgencyNumber: $('#'+ this.id + ' [data-id="item-view-attach-agency-number"]'),
            attachAgencyDownloadAll: $('#'+ this.id + ' [data-id="item-view-attach-agency-download-all"]'),
            attachAgencyViewAll: $('#'+ this.id + ' [data-id="item-view-attach-agency-view-image"]'),
            attachAgencyList: $('#'+ this.id + ' [data-id="item-view-attach-agency-list"]'),

            comment: $('#'+ this.id + ' [data-id="item-view-comment-info"]'),
            commentNumber: $('#'+ this.id + ' [data-id="item-view-comment-number"]'),
            commentViewAll: $('#'+ this.id + ' [data-id="item-view-comment-view-all"]'),
            commentViewImage: $('#'+ this.id + ' [data-id="item-view-comment-view-image"]'),
            commentList: $('#'+ this.id + ' [data-id="item-view-comment-list"]')
        };

        var _headerDetails = _config.headerDetails || {};
        var _subjectDetailsId = _headerDetails.subject || "";
        if (!iNet.isEmpty(_subjectDetailsId) && iNet.isEmpty($el.subjectDetails.html().replace(/ /gi, "").replace(/\n/gi, ""))){
            $el.subjectDetails.html('').append($.getCmp(_subjectDetailsId).html());
            $.getCmp(_subjectDetailsId).remove();
        }
        var _senderDetailsId = _headerDetails.sender || "";
        if (!iNet.isEmpty(_senderDetailsId) && iNet.isEmpty($el.senderDetails.html().replace(/ /gi, "").replace(/\n/gi, ""))){
            $el.senderDetails.html('').append($.getCmp(_senderDetailsId).html());
            $.getCmp(_senderDetailsId).remove();
        }
        if (iNet.isFunction(_config.toolbar)){
            iNet.extend(_config.toolbar, iNet.Component);
            self.toolbar = new _config.toolbar();
            if (iNet.isEmpty($el.toolbar.html().replace(/ /gi, "").replace(/\n/gi, ""))){
                $el.toolbar.html('').append($.getCmp(self.toolbar.id).html());
                $.getCmp(self.toolbar.id).remove();
            }
            self.toolbar.intComponent(this);
        }
        if (iNet.isFunction(_config.dataContent)){
            iNet.extend(_config.dataContent, iNet.Component);
            self.dataContent = new _config.dataContent();
            if (iNet.isEmpty($el.dataContent.html().replace(/ /gi, "").replace(/\n/gi, ""))){
                $el.dataContent.html('').append($.getCmp(self.dataContent.id).html());
                $.getCmp(self.dataContent.id).remove();
            }
            self.dataContent.intComponent(this);
        }
        if (iNet.isFunction(_config.formContent)){
            iNet.extend(_config.formContent, iNet.Component);
            self.formContent = new _config.formContent();
            if (iNet.isEmpty($el.formContent.html().replace(/ /gi, "").replace(/\n/gi, ""))){
                $el.formContent.html('').append($.getCmp(self.formContent.id).html());
                $.getCmp(self.formContent.id).remove();
            }
            self.formContent.intComponent(this);
        }

        //PRIVATE PUBLIC ==============================================
        var resizeHeightContent = function(height){
            try {
                iNet.getLayout().$iframe.height($(iNet.getLayout().window).height() - 90);
            } catch (e) {
            }

            $el.content.height($(window).height() - 45);
        };
        var setMask = function(display){
            if ($('#'+ (_config.ajaxMaskId || "")).length > 0){
                if (display == 'show'){
                    $('#'+ (_config.ajaxMaskId || "")).show();
                } else {
                    $('#'+ (_config.ajaxMaskId || "")).hide();
                }
            }
        };
        var setBodyContent = function(content){
            if (iNet.isEmpty(content)) {
                $el.toolbar.addClass('hide');
                $el.body.addClass('hide');
                $el.contentNoItem.removeClass('hide');
                $el.contentDataItem.addClass('hide');
            } else {
                $el.toolbar.removeClass('hide');
                $el.body.removeClass('hide');
                $el.contentNoItem.addClass("hide");
                $el.contentDataItem.removeClass('hide');
            }

            self.resizeHeight();
        };

        //FUNCTION PUBLIC ==============================================
        this.isDisplay = function(){
            return $('#'+self.id).hasClass('hide');
        };
        this.hide = function(){
            $('#'+self.id).addClass('hide');
        };
        this.show = function(){
            $('#'+self.id).removeClass('hide');
        };
        this.reset = function(){
            self.setHeader();
            setBodyContent('');
            self.setFormContent();
            self.setDataContent();
            self.resetBodyHidden();
            self.setFooter();
            self.setData();
            self.resizeHeight();
        };
        this.resizeHeight = function (height) {
            resizeHeightContent();
        };
        this.setMenuButton = function(TrueFalse){
            if (TrueFalse == "full" || TrueFalse == true){
                $button.MENU.show();
            } else {
                $button.MENU.hide();
            }
        };
        this.setType = function(type){
            //type: full, min
            $el.control.removeClass('full').addClass(type);
            self.setMenuButton(type);
        };
        this.getData = function(){
            return self.selfData || {};
        };
        this.setData = function(data){
            self.selfData = data || {};
        };
        this.setHeader = function(data){
            var __data = data || {};

            var __objSubject = __data.subject || {};

            $el.subjectTitle.text(__objSubject.subject || "");
            (__objSubject.showAttachmentIcon || false) ? $el.subjectAttachmentIcon.removeClass('hide') : $el.subjectAttachmentIcon.addClass('hide');
            (__objSubject.showCommentIcon || false) ? $el.subjectCommentIcon.removeClass('hide') : $el.subjectCommentIcon.addClass('hide');
            (__objSubject.showDetailsIcon || false) ? $el.subjectDetailsIcon.removeClass('hide') : $el.subjectDetailsIcon.addClass('hide');

            var __objSender = __data.sender || {};

            $el.senderName.text(__objSender.name || "");
            $el.senderDate.text(__objSender.date || "");
            (__objSender.showDetailsIcon || false) ? $el.senderDetailsIcon.removeClass('hide') : $el.senderDetailsIcon.addClass('hide');

            $el.header.addClass('hide');

            if (!iNet.isEmpty(__objSubject.subject) || !iNet.isEmpty(__objSender.name) || !iNet.isEmpty(__objSender.date)){
                $el.header.removeClass('hide');
            }

            self.fireEvent('headerchange', data);
        };
        this.setFormContent = function (content) {
            if (iNet.isEmpty(content)){
                $el.form.addClass('hide');
                $el.formContent.addClass('hide');
            } else {
                $el.form.removeClass('hide');
                $el.formContent.removeClass('hide');
            }
            setBodyContent(content);
        };
        this.setDataContent = function (content) {
            if (iNet.isEmpty(content)){
                $el.data.addClass('hide');
                $el.dataContent.addClass('hide');
            } else {
                $el.data.removeClass('hide');
                $el.dataContent.removeClass('hide');
            }
            setBodyContent(content);
        };
        this.setSubmitContent = function (content) {
            $el.submitContent.html(content || '');

            if (iNet.isEmpty(content)){
                $el.submit.addClass('hide');
                $el.submitContent.addClass('hide');
            } else {
                $el.submit.removeClass('hide');
                $el.submitContent.removeClass('hide');
                for (var i = 1; i <= 12; i++) {
                    $el.submitContent.find('.col-md-' + i).removeClass('col-md-' + i);
                    $el.submitContent.find('.col-xs-' + i).removeClass('col-xs-' + i);
                    $el.submitContent.find('.col-sm-' + i).removeClass('col-sm-' + i);
                }
                $el.submitContent.find('.row').removeClass('row');
                PublicService.PageScript($el.submitContent);
            }
            setBodyContent("view");
        };
        this.addBodyHidden = function (key, value) {
            $el.formContentHidden.find('[name="'+key+'"]').parent().remove();
            $el.formContentHidden.append(String.format(template.hidden(), key, value));
            $el.dataContentHidden.find('[name="'+key+'"]').parent().remove();
            $el.dataContentHidden.append(String.format(template.hidden(), key, value));
            $el.submitContentHidden.find('[name="'+key+'"]').parent().remove();
            $el.submitContentHidden.append(String.format(template.hidden(), key, value));
        };
        this.resetBodyHidden = function () {
            $el.formContentHidden.html('');
            $el.dataContentHidden.html('');
            $el.submitContentHidden.html('');
        };
        this.setFooter = function(data) {
            var __data = data || {};
            var __objComments = __data.comments || [];
            var __htmlComment = '';

            for (var n = __objComments.length - 1; n >= 0; n--) {
                var __note = __objComments[n] || {};

                if (iNet.isEmpty(__note.userName)) {
                    __note.userName = __note.sender || "";
                } //format comment request
                if (iNet.isEmpty(__note.userCode)) {
                    __note.userCode = __note.senderCode || "";
                } //format comment request
                if (iNet.isEmpty(__note.noteTime)) {
                    __note.noteTime = __note.created || 0;
                } //format comment request

                __htmlComment += String.format(template.comment(),
                    self.url.avatarUser,
                    __note.userName,
                    __note.userCode,
                    ' ',
                    '(' + $.timeago(__note.noteTime) + ')',
                    __note.note);
            }

            if (iNet.isEmpty(__htmlComment)) {
                $el.comment.addClass('hide');
            } else {
                $el.comment.removeClass('hide');
            }
            $el.commentViewImage.addClass('hide');
            //$el.commentViewAll.addClass('hide');

            $el.commentList.html(__htmlComment);
            $el.commentList.hide();
            $el.commentNumber.text(__objComments.length || 0);

            var __objDocRecord = __data.docRecord || [];
            var __objAttBriefs = __data.attBriefs || [];
            var __htmlAttBrief = '';
            var __numberAttBrief = 0;
            if (__objAttBriefs.length == 0) {
                $el.submitContent.find('[data-control="File"]').each(function (i, item) {
                    if ($(item).find('[property-value]').length > 0 && $(item).find('[type="file"]').length == 0) {
                        var __hardnote = $(item).find('[rel="hardnote"][property-value]').attr("property-value") || "";
                        var __attrName = $(item).find('[rel="name"][property-value]').attr("property-value") || "";

                        var __isExists = false;
                        $.each(__objDocRecord, function(r, doc){
                            if (doc.fieldname == __attrName){
                                __isExists = doc.hardcopy;
                                $(item).html('<i class="fa fa-file"></i> ' + (__hardnote || (self.resource.constant || {}).hardcopy));
                                return false;
                            }
                        });

                        if (!__isExists){
                            $(item).html('<i class="icon-paper-clip"></i> ' + (self.resource.constant || {}).not_attachment);
                        }
                    }
                });
            } else {
                $.each(__objAttBriefs, function (a, attachment) {
                    var $itemFile = $el.submitContent.find('[data-control="File"]');
                    var $itemAttach = $itemFile.find('[rel="name"][property-value="' + attachment.fieldname + '"]');
                    var $itemInputFile = $itemFile.find('input[type="file"][name="' + attachment.fieldname + '"]');
                    var $itemId = (attachment.contentID || attachment.gridfsUUID) || "";
                    var $itemFileName = (attachment.file || attachment.filename) || "";

                    if ($itemAttach.length > 0) {
                        $itemAttach.parent().parent().parent().find('.data-content').addClass('hide');
                        var __htmlItemAttach = String.format(template.attachment(2), iNet.FileFormat.getFileIcon($itemFileName), $itemFileName, iNet.FileFormat.getSize(attachment.size || 0), $itemId);
                        $itemAttach.parent().parent().parent().append(__htmlItemAttach);
                        $itemAttach.parent().parent().parent().find('a[data-action]').each(function(i, item){
                            $(item).on('click', function(){
                                var __itemData = {};
                                __itemData.action = $(item).attr('data-action') || "";
                                __itemData.uuid = $(item).attr('data-id') || "";
                                self.fireEvent('fileclick', __itemData);
                            });
                        });
                        if ($itemInputFile.length > 0) {
                            $itemAttach.parent().parent().parent().append(String.format(template.attachment(3), "$(this).parent().find('.data-content').show(); $(this).parent().find('[data-info]').hide();"));
                        } else {
                            $itemAttach.parent().remove();
                        }
                    } else {
                        __numberAttBrief++;
                        __htmlAttBrief += String.format(template.attachment(1), $itemId, attachment.fieldname, iNet.FileFormat.getFileIcon(attachment.mimetype), $itemFileName, iNet.FileFormat.getSize(attachment.size || 0), (attachment.size || 0).toString(), $itemId);
                    }

                    if (a == __objAttBriefs.length - 1) {
                        $el.submitContent.find('[data-control="File"]').each(function (i, item) {
                            if ($(item).find('[property-value]').length > 0 && $(item).find('[type="file"]').length == 0) {
                                var __hardnote = $(item).find('[rel="hardnote"][property-value]').attr("property-value") || "";
                                var __attrName = $(item).find('[rel="name"][property-value]').attr("property-value") || "";

                                var __isExists = false;
                                $.each(__objDocRecord, function(r, doc){
                                    if (doc.fieldname == __attrName){
                                        __isExists = doc.hardcopy;
                                        $(item).html('<i class="fa fa-file"></i> ' + (__hardnote || (self.resource.constant || {}).hardcopy));
                                        return false;
                                    }
                                });

                                if (!__isExists){
                                    $(item).html('<i class="icon-paper-clip"></i> ' + (self.resource.constant || {}).not_attachment);
                                }
                            }
                        });
                    }
                });
            }

            $el.submitContent.find('[data-control="File"] input[data-hardcopy]').attr('value', false);
            $el.submitContent.find('[data-control="File"] input[data-hardcopy]').attr('checked', false);
            $.each(__objDocRecord, function(r, doc){
                var $itemFile = $el.submitContent.find('[data-control="File"]');
                var $itemInputFile = $itemFile.find('input[data-hardcopy][name="' + doc.fieldname + '_hardcopy"]');
                /*if (!doc.isExists || iNet.isEmpty(doc.isExists)){

                }*/

                console.log(">> document >>", doc.fieldname, doc.hardcopy);
                $itemInputFile.attr('value', doc.hardcopy);
                $itemInputFile.prop('checked', doc.hardcopy);
            });

            if (iNet.isEmpty(__htmlAttBrief)) {
                $el.attachBrief.addClass('hide');
            } else {
                $el.attachBrief.removeClass('hide');
            }

            $el.attachBriefDownloadAll.addClass('hide');
            $el.attachBriefViewAll.addClass('hide');

            $el.attachBriefList.html(__htmlAttBrief);
            $el.attachBriefNumber.text(__numberAttBrief);
            $el.attachBriefList.find('a[data-action]').each(function(i, item){
                $(item).on('click', function(){
                    var __itemData = {};
                    __itemData.action = $(item).attr('data-action') || "";
                    __itemData.uuid = $(item).attr('data-id') || "";
                    self.fireEvent('fileclick', __itemData);
                });
            });

            var __objAttExternalData = __data.attExternalData || [];
            var __htmlIDesk = "", __htmlAdditional = "", __htmlAgency = "";
            var __numberIDesk = 0, __numberAdditional = 0, __numberAgency = 0;
            $.each(__objAttExternalData, function (e, data) {
                if (!iNet.isEmpty(data.signNumber || "")) {
                    __numberIDesk++;
                    var __htmlIDeskInfo = '';
                    __htmlIDeskInfo = String.format(template.external(1), data.creator + ' (' + (data.completed || 0).longToDate('d/m/Y H:i') + ')', "{0}");
                    var __htmlIDeskItem = '';
                    __htmlIDeskItem = String.format(template.external(2), data.subject, "fa-book", "fa-eye", '');
                    __htmlIDesk += String.format(__htmlIDeskInfo, __htmlIDeskItem);
                }

                if (!iNet.isEmpty(data.description || "")) {
                    __numberAdditional++;
                    var __htmlAdditionalInfo = String.format(template.external(1), data.creator + ' (' + (data.completed || 0).longToDate('d/m/Y H:i') + ') ' + ' - ' + data.description, "{0}");
                    var __htmlAdditionalItem = '';
                    $.each(data.attachments || [], function (d, attachment) {
                        var $itemId = (attachment.contentID || attachment.gridfsUUID) || "";
                        var $itemFileName = (attachment.file || attachment.filename) || "";
                        __htmlAdditionalItem += String.format(template.external(3), $itemFileName, $itemId, ($itemFileName.indexOf('.pdf')>0)?'':'hide');
                    });
                    __htmlAdditional += String.format(__htmlAdditionalInfo, __htmlAdditionalItem);
                }

                if (!iNet.isEmpty(data.actionType || "")) {
                    __numberAgency++;
                    var __htmlAgencyInfo = String.format(template.external(1), data.senderName + ' (' + (data.created || 0).longToDate('d/m/Y H:i') + ') ' + ' - ' + data.organName, "{0}");
                    var __htmlAgencyItem = '';
                    $.each(data.attachments || [], function (d, attachment) {
                        var $itemId = (attachment.contentID || attachment.gridfsUUID) || "";
                        var $itemFileName = (attachment.file || attachment.filename) || "";
                        __htmlAgencyItem += String.format(template.external(3), $itemFileName, $itemId);
                    });
                    __htmlAgency += String.format(__htmlAgencyInfo, __htmlAgencyItem);
                }
            });


            if (iNet.isEmpty(__htmlIDesk)) {
                $el.attachIDesk.addClass('hide');
            } else {
                $el.attachIDesk.removeClass('hide');
            }

            $el.attachIDeskDownloadAll.addClass('hide');
            $el.attachIDeskViewAll.addClass('hide');

            $el.attachIDeskList.html(__htmlIDesk);
            $el.attachIDeskNumber.text(__numberIDesk);


            if (iNet.isEmpty(__htmlAdditional)) {
                $el.attachAdditional.addClass('hide');
            } else {
                $el.attachAdditional.removeClass('hide');
            }

            $el.attachAdditionalDownloadAll.addClass('hide');
            $el.attachAdditionalViewAll.addClass('hide');

            $el.attachAdditionalList.html(__htmlAdditional);
            $el.attachAdditionalNumber.text(__numberAdditional);
            $el.attachAdditionalList.find('a[data-action]').each(function(i, item){
                $(item).on('click', function(){
                    var __itemData = {};
                    __itemData.action = $(item).attr('data-action') || "";
                    __itemData.uuid = $(item).attr('data-id') || "";
                    self.fireEvent('fileclick', __itemData);
                });
            });

            if (iNet.isEmpty(__htmlAgency)) {
                $el.attachAgency.addClass('hide');
            } else {
                $el.attachAgency.removeClass('hide');
            }

            $el.attachAgencyDownloadAll.addClass('hide');
            $el.attachAgencyViewAll.addClass('hide');
            //$el.attachAgencyList.hide();
            $el.attachAgencyList.html(__htmlAgency);
            $el.attachAgencyNumber.text(__numberAgency);
            $el.attachAgencyList.find('a[data-action]').each(function(i, item){
                $(item).on('click', function(){
                    var __itemData = {};
                    __itemData.action = $(item).attr('data-action') || "";
                    __itemData.uuid = $(item).attr('data-id') || "";
                    self.fireEvent('fileclick', __itemData);
                });
            });


            if (iNet.isEmpty(__htmlAttBrief) && iNet.isEmpty(__htmlIDesk) && iNet.isEmpty(__htmlAdditional) && iNet.isEmpty(__htmlAgency)) {
                $el.attachment.addClass('hide');
            } else {
                $el.attachment.removeClass('hide');
            }
        };
        this.submit = function(url){
            var __url = url || "";
            var __typeSubmit = iNet.isEmpty($el.formContent.html()) ? "submit" : "form";
            if (!iNet.isEmpty(__url)) {
                setMask('show');

                var __ajaxConfig = {
                    url: __url,
                    beforeSubmit: function () {
                    },
                    uploadProgress: function (event, position, total, percentComplete) {
                    },
                    success: function () {
                    },
                    complete: function (xhr) {
                        setMask('hide');
                        var __responseJSON = xhr.responseJSON || {};
                        var __responseText = xhr.responseText || {};
                        console.log(">> submitFormContent result >>", __responseJSON);

                        if (iNet.isEmpty(__responseJSON.uuid)) {
                            self.fireEvent('submitted', {"type": "error", "errors": __responseJSON.errors || []});
                        } else {

                            self.fireEvent('submitted', {"type": "success", "data": __responseJSON});
                        }
                    }
                };

                if (__typeSubmit == "submit") {
                    $el.submit.ajaxSubmit(__ajaxConfig);
                } else {
                    $el.form.ajaxSubmit(__ajaxConfig);
                }

            } else {
                self.fireEvent('submitted', {"type": "error", "errors": "URL is empty!."});
            }
        }.createDelegate(this);

        //EVENT CONTROL =====================================
        $el.subjectDetailsIcon.on('click', function() {
            if ($el.subjectDetails.hasClass('hide')) {
                $el.subjectDetailsIcon.removeClass('icon-caret-right').addClass('icon-caret-down');
                $el.subjectDetails.removeClass('hide');
            } else {
                $el.subjectDetailsIcon.removeClass('icon-caret-down').addClass('icon-caret-right');
                $el.subjectDetails.addClass('hide');
            }
        });
        $el.subjectTitle.on('click', function(){
            if (!$el.subjectDetailsIcon.hasClass('hide')){
                $el.subjectDetailsIcon.trigger('click');
            }
        });
        $el.senderDetailsIcon.on('click', function(){
            if ($el.senderDetails.hasClass('hide')) {
                $el.senderDetailsIcon.removeClass('icon-caret-right').addClass('icon-caret-down');
                $el.senderDetails.removeClass('hide');
            } else {
                $el.senderDetailsIcon.removeClass('icon-caret-down').addClass('icon-caret-right');
                $el.senderDetails.addClass('hide');
            }
        });
        $el.senderName.on('click', function(){
            if (!$el.senderDetailsIcon.hasClass('hide')){
                $el.senderDetailsIcon.trigger('click');
            }
        });
        $el.senderDate.on('click', function(){
            if (!$el.senderDetailsIcon.hasClass('hide')){
                $el.senderDetailsIcon.trigger('click');
            }
        });
        $el.commentViewAll.on('click', function(){
            $el.commentList.show();
            self.fireEvent('viewcomment');
        }.createDelegate(this));


        $button.PREV.on('click', function(){

        }.createDelegate(this));
        $button.NEXT.on('click', function(){

        }.createDelegate(this));
        $button.MENU.on('click', function(){
            self.fireEvent('menuclick');
        }.createDelegate(this));


        $(iNet.getLayout()).on('resize', function () {
            self.resizeHeight();
        });

        //INIT ==============================================
        //window.document.on('loaded', function(){
        self.reset();
        //});
    };

    iNet.extend(iNet.ui.itemview, iNet.Component);
});
