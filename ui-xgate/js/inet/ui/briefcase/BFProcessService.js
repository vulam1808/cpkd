// #PACKAGE: bfprocess
// #MODULE: BfProcessService
$(function () {
    iNet.ns("iNet.ui.xgate", "iNet.ui.xgate.BfProcess");
    iNet.ui.xgate.BfProcess = function (config) {
        this.id = 'briefcase-process-div';
        var __config = config || {};
        var self = this;
        var parentPage = null;
        
        //get form velocity
        var ctx = {
            context: iNet.context, //get data from widget
            zone: iNet.zone //get data from widget
        };

        var html = {
            external: function() {
                var __html = '';
                __html += '<ul style="list-style-type: none; margin-left: 0;">';
                __html += ' <div class="dd" style="max-width: 100%; padding-right: 10px;">';
                __html += '     <ol class="dd-list">';
                __html += '         <li class="dd-item dd2-item" data-id="15">';
                __html += '             <button data-action="collapse" data-css="dd-collapsed" type="button" style="display: block;">collapse</button>';
                __html += '             <button data-action="expand" data-css="dd-collapsed" type="button" style="display: none;">expand</button>';
                __html += '             <div class="dd-handle dd2-handle" style="height: 100%;">';
                __html += '                 <i class="normal-icon ace-icon fa fa-user blue bigger-130"></i>';
                __html += '                 <i class="drag-icon ace-icon fa fa-arrows bigger-125"></i>';
                __html += '             </div>';
                __html += '             <div class="dd2-content">{0}</div>';
                __html += '         </li>{1}';
                __html += '     </ol>';
                __html += ' </div>';
                __html += '</ul>';

                return __html;
            },
            attachment: function(){
                var __html = '';
                __html += '<ol class="dd-list" style="">';
                __html += ' <li class="dd-item dd2-item" data-id="16">';
                __html += '     <div class="dd-handle dd2-handle" style="height: 100%;">';
                __html += '         <i class="normal-icon ace-icon fa fa-file orange bigger-130"></i>';
                __html += '         <i class="drag-icon ace-icon fa fa-arrows bigger-125"></i>';
                __html += '     </div>';
                __html += '     <div class="dd2-content" style="display: flex;">';
                __html += '         <div>{1}</div>';
                __html += '         <div style="margin-left: 8px;" class="pull-right action-buttons">';
                __html += '             <a data-action="deletefile" title="" data-request="{2}" data-file="{1}" data-id="{0}" class="red" href="#">';
                __html += '                 <i class="icon-trash bigger-130"></i>';
                __html += '             </a>';
                __html += '         </div>';
                __html += '         <div style="margin-left: 8px;" class="pull-right action-buttons hide">';
                __html += '             <a data-action="verifyfile" title="" data-request="{2}" data-file="{1}" data-id="{0}"class="orange" href="#">';
                __html += '                 <i class="icon-key bigger-130"></i>';
                __html += '             </a>';
                __html += '         </div>';
                __html += '         <div style="margin-left: 8px;" class="pull-right action-buttons hide">';
                __html += '             <a data-action="viewfile" title="" data-request="{2}" data-file="{1}" data-id="{0}" class="green" href="#">';
                __html += '                 <i class="ace-icon fa fa-eye bigger-130"></i>';
                __html += '             </a>';
                __html += '         </div>';
                __html += '         <div style="margin-left: 8px;" class="pull-right action-buttons hide">';
                __html += '             <a data-action="downfile" title="" data-request="{2}" data-file="{1}" data-id="{0}" class="blue" href="#">';
                __html += '                 <i class="ace-icon fa fa-download bigger-130"></i>';
                __html += '             </a>';
                __html += '         </div>';
                __html += '     </div>';
                __html += ' </li>';
                __html += '</ol>';

                return __html;
            }
        };

        var resource = {
            task: iNet.resources.task.task,
            BfProcess: iNet.resources.xgate.BfProcess,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            executor_task: iNet.getUrl('firmtask/process/executor'), //task, direction, note
            update_task: iNet.getUrl('firmtask/process/additional'), //task, note --> old service iNet.getUrl('firmtask/process/noteupdate')
            reject_task: iNet.getUrl('firmtask/process/reject'), //process
            late_task: iNet.getUrl('firmtask/process/latemark'), //task, reason
            comment_task: iNet.getUrl('firmtask/comment/create'), //taskRequest, note
            photo: iNet.getUrl('system/userprofile/photo'), //usercode

            task_toolbar: iNet.getUrl('cloud/workflow/ruleengine'), //task, graph
            task_toolbar_actor: iNet.getUrl('cloud/workflow/arc2node'), //task, direction

            load_user: iNet.getUrl('system/account/role'),

            external_upload: iNet.getUrl('onegate/externaldata/upload'),
            external_reqload: iNet.getUrl('onegate/externaldata/reqload'),
            external_list : iNet.getUrl('onegate/externaldata/list'),
            external_remove : iNet.getUrl('onegate/externaldata/delete')
        };

        //MENU VIEW ===========================================
        var $taskMenu = iNet.getLayout().window.parent.taskMenu;
        $taskMenu.on('menuchange', function(){
        });
        $taskMenu.on('create', function(){
        });

        //LIST VIEW ===========================================
        var $taskFrame = iNet.getLayout().window.taskFrame;
        $taskFrame.on('typechange', function(type){
            if (type == 'min'){
                processView.setMenuButton(true);
            } else {
                processView.setMenuButton(false);
            }
        });

        //MODAL VIEW ==========================================
        var $taskModal = new iNet.ui.modalview();
        $taskModal.on('success', function(){
            this.hide();
            $taskFrame.refresh();
            $taskMenu.refresh("task");
        });

        //PROCESS VIEW ===================================================
        var clearProcessData = function(){
            $('#briefcase-process-additional-attachment-list').html('');
            $('#briefcase-process-additional-attachment-description').val('');
            processView.toolbar.$taskExecutorBtn.attr('direction', '');
        };
        var processLoad = function(){
            processView.reset();
            var __taskInfo = $taskFrame.getTaskDataIndex();

            var __taskUuid = ((__taskInfo || {}).history || {}).taskID || '';
            var __graphUuid = ((__taskInfo || {}).history || {}).graphID || "";
            var __requestStatus = ((__taskInfo || {}).request || {}).status || '';
            var __requestID = ((__taskInfo || {}).request || {}).uuid || '';

            if(__requestID !=""){
                $.postJSON(url.external_list, {taskRequestID: __requestID}, function (result) {
                    var __result = result || {};
                    processView.dataContent.$additionalView.html('');

                    if (CommonService.isSuccess(__result)){
                        var __htmlExternalData = '';
                        var __argExternalData = __result.externalData || [];
                        $.each(__argExternalData, function(i, externalData){
                            var __externalData = externalData || {};
                            if (__externalData.creatorCode == iNet.usercode){
                                var __attachments = __externalData.attachments || [];

                                var __htmlAttachments = '';
                                $.each(__attachments, function(i, attachment){
                                    var __attachment = attachment || {};
                                    __htmlAttachments += String.format(html.attachment(), __attachment.uuid, __attachment.file, __result.uuid);
                                });

                                var __externalInfo = __externalData.description + ' (' + new Date(__externalData.completed).format('h:i d/m/Y') + ')';
                                __htmlExternalData += String.format(html.external(), __externalInfo, __htmlAttachments);
                            }
                        });

                        processView.dataContent.$additionalView.append(__htmlExternalData);
                        processView.dataContent.$additionalView.on('click','[data-action]',function(){
                            var __action = $(this).attr('data-action');
                            var __attachID = $(this).attr('data-id');
                            var __fileName = $(this).attr('data-file');
                            var __taskRequestID = $(this).attr('data-request');
                            if (__action == "deletefile"){
                                if(__attachID !=""){
                                    self.confirmDialog(resource.constant.del_title, self.getNotifyContent(resource.constant.del_content, __fileName), function() {
                                        $.postJSON(url.external_remove, self.dialog.getOptions(), function (result) {
                                            self.dialog.hide();
                                            if((result || {}).uuid =="SUCCESS"){
                                                processLoad();
                                            }
                                        });
                                    });
                                    self.dialog.setContent(self.getNotifyContent(resource.constant.del_content, __fileName));
                                    self.dialog.setOptions({taskRequestID: __taskRequestID, attachID : __attachID});
                                    self.dialog.show();
                                }
                            }

                            if (__action == "collapse" || __action == "expand"){
                                var $externalData = $(this).parent().parent();

                                if ($externalData.hasClass("dd-collapsed")){
                                    $externalData.removeClass("dd-collapsed");
                                    $externalData.find('[data-action="collapse"]').css("display","block");
                                    $externalData.find('[data-action="expand"]').css("display","none");
                                } else {
                                    $externalData.addClass("dd-collapsed");
                                    $externalData.find('[data-action="collapse"]').css("display","none");
                                    $externalData.find('[data-action="expand"]').css("display","block");
                                }
                            }
                        });
                    }
                });
            }

            if (__requestStatus == "SUBMITTED" || __requestStatus == "UPDATE") {
                clearProcessData();

                var __fnEventTask = function(htmlProcess, htmlButton, htmlPlugin, htmlToolBar){
                    processView.setDataContent("view");
                    var __htmlProcess = htmlProcess || '';
                    var __htmlButton = htmlButton || '';
                    var __htmlPlugin = htmlPlugin || '';
                    var __htmlToolBar = htmlToolBar || '';

                    processView.dataContent.$process.find('[data-action="rule"]').html(__htmlProcess);
                    processView.dataContent.$process.find('[data-action="execute"]').html(__htmlButton);
                    processView.dataContent.$process.find('[data-action="plugin"]').html(__htmlPlugin);
                    processView.dataContent.$process.find('[data-action="function"]').html(__htmlToolBar);

                    processView.dataContent.$process.find('[data-action="note"]').on('change', function(e){
                        processView.toolbar.$taskCompletedBtn.attr('note', $(e.currentTarget).val());
                        processView.toolbar.$taskExecutorBtn.attr('note', $(e.currentTarget).val());
                    });
                    processView.dataContent.$process.find('[data-action="noteLate"]').on('change', function(e){
                        processView.toolbar.$taskCompletedBtn.attr('noteLate', $(e.currentTarget).val());
                        processView.toolbar.$taskExecutorBtn.attr('noteLate', $(e.currentTarget).val());
                    });
                    processView.dataContent.$process.find('[data-action="check"]').on('change', function(e){
                        var __executorDirection = '';
                        processView.dataContent.$process.find('[data-action="check"]').each(function(i, item){
                            $(item).find('[data-action="member"]').attr('checked', $(item).find('[type]').prop('checked'));
                            if ($(item).find('[type]').prop('checked')){
                                var __currentDirection = $(item).attr('direction') || '';
                                __executorDirection +=__currentDirection + ',';
                            }
                        });
                        processView.toolbar.$taskExecutorBtn.attr('direction', __executorDirection);
                    });
                    var __numCheck = processView.dataContent.$process.find('[data-action="check"]').length;
                    if (__numCheck >= 1){
                        processView.dataContent.$process.find('[data-action="check"] input[type]:first').trigger('click');
                    }

                    var __handlerMemberSelect = function(){
                        processView.dataContent.$process.find('[data-action="memberselect"]').on('change', function(e){
                            var __currentTask = $(e.currentTarget).attr('task');
                            var __currentDirection = $(e.currentTarget).attr('direction') || '';

                            var $memberList = processView.dataContent.$process.find('[data-action="memberselect"][task="'+__currentTask+'"][direction="'+__currentDirection+'"]');
                            var $memberInfo = processView.dataContent.$process.find('[data-action="memberinfo"][task="'+__currentTask+'"][direction="'+__currentDirection+'"]');
                            var __memberInfo = '';
                            $memberInfo.text('');
                            $memberList.each(function(i, member){
                                if ($(member).prop('checked')){
                                    __memberInfo += ($(member).attr('data-member-name') || "")+ "; ";
                                }
                            });

                            if (!iNet.isEmpty(__memberInfo)){
                                __memberInfo = " (" + __memberInfo.substring(0, __memberInfo.length-2) + ")";
                                $memberInfo.text(__memberInfo);
                            }
                        });
                    };
                    processView.dataContent.$process.find('[data-action="member"]').on('click', function(e){
                        processView.dataContent.$process.find('[data-action="memberview"]').hide();
                        var __currentTask = $(e.currentTarget).attr('task');
                        var __currentDirection = $(e.currentTarget).attr('direction') || '';

                        $.postJSON(url.task_toolbar_actor, {task: __currentTask, direction: __currentDirection}, function (result) {
                            var __memberListHtml = '';
                            __memberListHtml+= '<tr>';
                            __memberListHtml+= '<td>';
                            __memberListHtml+= '<label class="checkbox">';
                            __memberListHtml+= '<input data-action="memberselect" data-member="{0}" data-member-name="{2}" data-nodeName="{1}" exists="1" task="' + __currentTask + '" direction="'+__currentDirection+'" type="checkbox" class="ace"><span class="lbl"></span>';
                            __memberListHtml+= '</label>';
                            __memberListHtml+= '</td>';
                            __memberListHtml+= '<td>{2}</td>';
                            __memberListHtml+= '</tr>';

                            var __result = result || {};
                            var $memberList = processView.dataContent.$process.find('[data-action="memberlist"][task="'+__currentTask+'"][direction="'+__currentDirection+'"]');
                            var $memberInfo = processView.dataContent.$process.find('[data-action="memberinfo"][task="'+__currentTask+'"][direction="'+__currentDirection+'"]');
                            $memberList.find('[data-member]').attr('exists', '0');
                            $memberInfo.text('');
                            var __memberInfo = '';
                            $.each(__result.members || [], function(i, element){
                                var __element = element || {};
                                if ($memberList.find('[data-member="'+element+'"]').length <= 0){
                                    $memberList.append(String.format(__memberListHtml, __element.usercode, __result.nodeName, __element.username));
                                } else {
                                    $memberList.find('[data-member="'+__element.usercode+'"]').attr('exists', '1');
                                }

                                if ($memberList.find('[data-member="'+__element.usercode+'"]').prop('checked')){
                                    __memberInfo += __element.usercode+ "; ";
                                }
                            });

                            if (!iNet.isEmpty(__memberInfo)){
                                __memberInfo = " (" + __memberInfo.substring(0, __memberInfo.length-2) + ")";
                                $memberInfo.text(__memberInfo);
                            }
                            $memberList.find('[data-member][exists="0"]').each(function(i, member){
                                $(member).parent().parent().parent().remove();
                            });

                            __handlerMemberSelect();
                            processView.dataContent.$process.find('[data-action="memberview"][task="'+__currentTask+'"][direction="'+__currentDirection+'"]').show();
                        });

                    });
                    processView.dataContent.$process.find('[data-action="memberclose"]').on('click', function(e) {
                        var __currentTask = $(e.currentTarget).attr('task');
                        var __currentDirection = $(e.currentTarget).attr('direction') || '';
                        processView.dataContent.$process.find('[data-action="memberview"]').hide();
                    });
                };

                switch (__requestStatus) {
                    case "UPDATE":
                        var __htmlProcess ='';
                        var __htmlButton = '';

                        __htmlProcess+= '<span class="alert alert-danger bold span12">'+resource.task.updateWarning+'</span>';

                        processView.dataContent.$process.find('[data-action="description"]').hide();
                        processView.dataContent.$process.find('[data-action="exclusive"]').hide();

                        __fnEventTask(__htmlProcess, __htmlButton);
                        break;

                    case "SUBMITTED":
                        processView.dataContent.$process.find('[data-action="description"]').show();
                        processView.dataContent.$process.find('[data-action="exclusive"]').show();

                        $.postJSON(url.task_toolbar, {task: __taskUuid, graph: __graphUuid}, function (result) {
                            console.log(">> get_task_toolbar result >>", result);
                            var __result = result || {};
                            var __direction = __result || {};

                            var __htmlPlugin = __result.content || '';
                            var __htmlToolbar = '';
                            var __htmlProcess ='';
                            var __htmlButton = '';
                            var __hasProcess = false;
                            var __processDirection = '';
                            var __lines = __direction.lines || {};
                            var __multiDecision = __direction.multiDecision || false;

                            for (var key in __lines) {
                                __hasProcess = true;
                                if (__lines[key]) {
                                    __processDirection += key + ',';
                                }
                                __htmlProcess += '<div class="row-fluid">';
                                __htmlProcess += '<span class="span12" data-action="check" task="' + __taskUuid + '" direction="'+key+'">';
                                __htmlProcess += '<label '+ ((__multiDecision)? '' : 'class="radio"') +'>';
                                __htmlProcess += '<span title="'+resource.task.memberSelect+'" data-action="member" task="' + __taskUuid + '" direction="'+key+'" style="padding-right: 10px; padding-top: 5px; padding-bottom: 5px;">';
                                __htmlProcess += '<i class="icon-user" style="border: 1px solid #DDD;padding: 5px;border-radius: 15px;"></i>';
                                __htmlProcess += '</span>';
                                __htmlProcess += '<input type="'+((__multiDecision)? 'checkbox' : 'radio')+'" name="'+ ("multiDecision_" + __multiDecision) +'" class="ace" value="" ' + ((__lines[key] <=0) ? '' : 'checked="checked"') + '">';
                                __htmlProcess += '<span class="lbl"> '+key+'</span>';
                                __htmlProcess += '<span class="lbl" data-action="memberinfo" task="' + __taskUuid + '" direction="'+key+'"></span>';
                                __htmlProcess += '</label>';
                                __htmlProcess += '</span>';
                                __htmlProcess += '</div>';
                                __htmlProcess += '<div class="row-fluid">';
                                __htmlProcess += '<span class="span12 hide" data-action="memberview" task="' + __taskUuid + '" direction="'+key+'">';
                                __htmlProcess += '<table class="table table-bordered">';
                                __htmlProcess += '<thead>';
                                __htmlProcess += '<tr>';
                                __htmlProcess += '<th><i style="cursor: pointer;" class="icon-remove-sign" data-action="memberclose" task="' + __taskUuid + '" direction="'+key+'"></i></th>';
                                __htmlProcess += '<th>'+resource.task.memberName+'</th>';
                                //__htmlProcess += '<th>CCC</th>';
                                __htmlProcess += '</tr>';
                                __htmlProcess += '</thead>';
                                __htmlProcess += '<tbody data-action="memberlist" task="' + __taskUuid + '" direction="'+key+'">';
                                __htmlProcess += '</tbody>';
                                __htmlProcess += '</table>';
                                __htmlProcess += '</span>';
                                __htmlProcess += '</div>';
                            }

                            if (!__hasProcess) { //Task End
                                processView.toolbar.$taskCompletedBtn.show();
                                processView.toolbar.$taskExecutorBtn.hide();
                            } else {
                                processView.toolbar.$taskExecutorBtn.show();
                                processView.toolbar.$taskCompletedBtn.hide();
                            }

                            $.each(__result.toolbar || [], function(i, itemTool){
                                __htmlToolbar += '<button onclick="eval('+itemTool["function"]+'())" '+((i==0)?'':'style="margin-left: 5px;"')+' class="btn btn-primary">';
                                __htmlToolbar += '<i class="icon-ok-sign"></i> '+ (itemTool.label || "");
                                __htmlToolbar += '</button>';
                            });

                            __fnEventTask(__htmlProcess, __htmlButton, __htmlPlugin, __htmlToolbar);
                        }, {
                            mask: self.getMask(),
                            msg: iNet.resources.ajaxLoading.loading
                        });
                        break;
                }
            }
        };
        var processToolBar = function() {
            this.id = "briefcase-process-toolbar";
            this.intComponent = function(){
                var __taskInfo = $taskFrame.getTaskDataIndex();

                var $toolBar = this;
                this.$taskToolbar = $('#briefcase-process-task-toolbar');
                this.$additionalToolbar = $('#briefcase-process-additional-toolbar');

                this.$backBtn = $('#briefcase-process-back-btn');
                this.$backBtn.on('click', function(){
                    self.fireEvent('back');
                    if (parentPage != null){
                        parentPage.show();
                        self.hide();
                    }
                }.createDelegate(this));

                this.$additionalUploadBtn = $('#briefcase-process-additional-upload-btn');
                this.$additionalUploadBtn.on('click', function(){
                    var _this_ = this;
                    $(_this_).attr('disabled', 'disabled');
                    var __taskInfo = $taskFrame.getTaskDataIndex();
                    var __taskID = ((__taskInfo || {}).history || {}).taskID || '';
                    var __graphID  = ((__taskInfo || {}).history || {}).graphID || '';
                    var __requestID = ((__taskInfo || {}).request || {}).uuid || '';


                    if(iNet.isEmpty($('#briefcase-process-additional-attachment-description').val())){
                        $(_this_).removeAttr('disabled');
                        self.notifyError(resource.constant.warning_title, resource.task.description);
                        return;
                    }

                    var __isExists = false;
                    $('#briefcase-process-additional-attachment-list').find('[type="file"]').each(function(i, file){
                        if (!iNet.isEmpty($(file).val())){
                            __isExists = true;
                            return false;
                        }
                    });

                    if (__isExists) {
                        $('#' + processView.ajaxMaskId).show();

                        FormService.appendHiddenField(processView.dataContent.$form, 'task', __taskID);
                        FormService.appendHiddenField(processView.dataContent.$form, 'graph', __graphID);

                        processView.dataContent.$form.ajaxSubmit({
                            url: url.external_upload,
                            beforeSubmit: function () {
                            },
                            uploadProgress: function (event, position, total, percentComplete) {
                            },
                            success: function () {
                            },
                            complete: function (xhr) {
                                $(_this_).removeAttr('disabled');
                                $('#' + processView.ajaxMaskId).hide();
                                var __responseJSON = xhr.responseJSON || {};
                                var __responseText = xhr.responseText || {};

                                if (CommonService.isSuccess(__responseJSON.request || {})) {
                                    self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                                    processLoad();
                                } else {
                                    self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __responseJSON.errors || []));
                                }
                            }
                        });
                    } else {
                        $.postJSON(url.comment_task, {task: __requestID, note: $('#briefcase-process-additional-attachment-description').val()}, function (result) {
                            $(_this_).removeAttr('disabled');
                            var __result = result || {};
                            if (CommonService.isSuccess(__result)){
                                self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                                processLoad();
                            } else {
                                self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                            }
                        },{
                            mask: self.getMask(),
                            msg: iNet.resources.ajaxLoading.processing
                        });
                    }
                });

                this.$taskCompletedBtn = $('#briefcase-process-completeTask-btn');
                this.$taskCompletedBtn.on('click', function (e) {
                    var __taskInfo = $taskFrame.getTaskDataIndex();
                    var __currentTask = ((__taskInfo || {}).history || {}).taskID || '';
                    var __expiredTask  = ((__taskInfo || {}).history || {}).expiredTask || 0;
                    var __currentDirection = $(this).attr('direction') || '';
                    var __currentNote = $(this).attr('note') || '';
                    var __currentNoteLate = $(this).attr('noteLate') || '';

                    var __fnExecutor = function(){
                        __currentDirection = __currentDirection.substr(0, __currentDirection.length - 1);
                        var __params = {task: __currentTask, direction: __currentDirection, note: __currentNote, exclusive: processView.dataContent.$exclusive.getValue().toString()};

                        $.postJSON(url.executor_task, __params, function (result) {
                            $taskFrame.refresh();
                            $taskMenu.refresh("task");
                        }, {
                            mask: self.getMask(),
                            msg: iNet.resources.ajaxLoading.loading
                        });
                    };

                    if (new Date().getTime() > __expiredTask && __expiredTask > 0){
                        processView.dataContent.$noteLate.show();
                        if (!iNet.isEmpty(__currentNoteLate)) {
                            $.postJSON(url.late_task, {task: __currentTask, reason: __currentNoteLate}, function (result) {
                                __fnExecutor();
                            }, {
                                mask: self.getMask(),
                                msg: iNet.resources.ajaxLoading.loading
                            });
                        } else {
                            self.notifyError(resource.constant.warning_title, self.getNotifyContent(resource.validate.is_not_blank, resource.task.noteLate));
                        }
                    } else {
                        processView.dataContent.$noteLate.hide();
                        __fnExecutor();
                    }
                });

                this.$taskExecutorBtn = $('#briefcase-process-executorTask-btn');
                this.$taskExecutorBtn.on('click', function (e) {
                    var __taskInfo = $taskFrame.getTaskDataIndex();
                    var __currentTask = ((__taskInfo || {}).history || {}).taskID || '';
                    var __expiredTask  = ((__taskInfo || {}).history || {}).expiredTask || 0;
                    var __currentDirection = $(this).attr('direction') || '';
                    var __currentNote = $(this).attr('note') || '';
                    var __currentExclusive = (processView.dataContent.$exclusive != null) ? (processView.dataContent.$exclusive.getValue().toString() || "") : "";
                    var __currentNoteLate = $(this).attr('noteLate') || '';

                    var __fnExecutor = function(){
                        __currentDirection = __currentDirection.substr(0, __currentDirection.length - 1);
                        var __executorMember = '', __argMember = [];
                        $(__currentDirection.split(",")).each(function(i, direction){
                            processView.dataContent.$process.find('[data-action="memberlist"][task="'+__currentTask+'"][direction="'+direction+'"] [data-action="memberselect"]').each(function(i, item){
                                if ($(item).prop('checked')){
                                    var __member = $(item).attr('data-member') || '';
                                    var __nodeName = $(item).attr('data-nodeName') || '';
                                    __argMember.push({username: __member, role: '', direction: direction, nodeName: __nodeName});
                                    __executorMember +=__member + ',';
                                }
                            });
                        });

                        //member
                        var __params = {
                            task: __currentTask,
                            direction: __currentDirection,
                            note: __currentNote,
                            exclusive: __currentExclusive,
                            member: iNet.JSON.encode(__argMember)
                        };
                        console.log(">> __fnExecutor __params >>", __params);

                        if (!iNet.isEmpty(__currentDirection)){
                            $.postJSON(url.executor_task, __params, function (result) {
                                $taskFrame.refresh();
                                $taskMenu.refresh("task");
                            }, {
                                mask: self.getMask(),
                                msg: iNet.resources.ajaxLoading.loading
                            });
                        }
                    };

                    if (new Date().getTime() > __expiredTask && __expiredTask > 0){
                        processView.dataContent.$noteLate.show();
                        if (!iNet.isEmpty(__currentNoteLate)) {
                            $.postJSON(url.late_task, {task: __currentTask, reason: __currentNoteLate}, function (result) {
                                __fnExecutor();
                            }, {
                                mask: self.getMask(),
                                msg: iNet.resources.ajaxLoading.loading
                            });
                        } else {
                            self.notifyError(resource.constant.warning_title, self.getNotifyContent(resource.validate.is_not_blank, resource.task.noteLate));
                        }
                    } else {
                        processView.dataContent.$noteLate.hide();
                        __fnExecutor();
                    }
                });

                this.$taskUpdateBtn = $('#briefcase-process-updateTask-btn');
                this.$taskUpdateBtn.on('click', function (e) {
                    var __taskInfo = $taskFrame.getTaskDataIndex();
                    var __taskID = ((__taskInfo || {}).history || {}).taskID || "";

                    $taskModal.setTitle($(this).text());
                    $taskModal.setDescription(resource.task.updateDescription);
                    $taskModal.setParams({task: __taskID});
                    $taskModal.setUrl(url.update_task);
                    $taskModal.show();
                });
                this.$taskUpdateBtn.hide();

                this.$taskRejectBtn = $('#briefcase-process-rejectTask-btn');
                this.$taskRejectBtn.on('click', function (e) {
                    var __taskInfo = $taskFrame.getTaskDataIndex();
                    var __processUUID = ((__taskInfo || {}).history || {}).processUUID || "";
                    var __taskID = ((__taskInfo || {}).history || {}).taskID || '';
                    var __graphID  = ((__taskInfo || {}).history || {}).graphID || '';
                    $taskModal.setTitle($(this).text());
                    $taskModal.setDescription(resource.task.rejectDescription);
                    $taskModal.setParams({process: __processUUID});
                    $taskModal.setAdditional(url.external_upload, {task: __taskID, graph: __graphID});
                    $taskModal.setUrl(url.reject_task);
                    $taskModal.show();
                });
                var __reject = (((__taskInfo || {}).history || {}).attributes || {}).reject || "0";
                if (__reject == "1"){
                    this.$taskRejectBtn.show();
                } else {
                    this.$taskRejectBtn.hide();
                }
            };
        };
        var processDataContent = function() {
            this.id = "briefcase-process-data-content";
            this.intComponent = function(){
                var me = this;
                this.$additionalView = $('#briefcase-process-additional-attachment-view');
                this.$additionalAddBtn = $('#briefcase-process-additional-attachment-add');
                this.$tab = $('a[data-toggle="tab"]');

                this.$process = $('#briefcase-process-form-content');
                this.$exclusive = FormService.createSelect('briefcase-process-exclusive', [], 'id', 1, true, true);
                $.postJSON(url.load_user, {}, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        var __listUser = [];
                        $.each(__result.items || [], function(i, obj){
                            __listUser.push({id: obj.username, code: obj.username, name: obj.fullname})
                        });
                        me.$exclusive = FormService.createSelect('briefcase-process-exclusive', __listUser, 'id', 1, true, true);
                    }
                });

                this.$noteLate = $('#briefcase-process-noteLate');
                this.$form = $('#briefcase-process-additional-form');

                this.$tab.on('shown.bs.tab', function (e) {
                    if ($(e.target).attr('href') == "#tab-process-additional"){
                        processView.toolbar.$additionalToolbar.show();
                        processView.toolbar.$taskToolbar.hide();
                    } else {
                        var __isMustSave = false;
                        if(!iNet.isEmpty($('#briefcase-process-additional-attachment-description').val())){
                            __isMustSave = true;
                        }

                        $('#briefcase-process-additional-attachment-list').find('[type="file"]').each(function(i, file){
                            if (!iNet.isEmpty($(file).val())){
                                __isMustSave = true;
                                return false;
                            }
                        });

                        if (__isMustSave){
                            self.notifyError(resource.constant.warning_title, resource.task.additionalwarningsave);
                        }


                        processView.toolbar.$additionalToolbar.hide();
                        processView.toolbar.$taskToolbar.show();

                        var __taskInfo = $taskFrame.getTaskDataIndex();
                        var __expiredTask = ((__taskInfo || {}).history || {}).expiredTask || 0;

                        if (new Date().getTime() > __expiredTask && __expiredTask > 0) {
                            processView.dataContent.$noteLate.show();
                        } else {
                            processView.dataContent.$noteLate.hide();
                        }
                    }
                });

                this.$additionalAddBtn.on('click', function(){
                    var __htmlFormAttachment = '';
                    __htmlFormAttachment+='<div class="row-fluid">';
                    __htmlFormAttachment+='    <label class="span2">'+resource.task.attachment+'</label>';
                    __htmlFormAttachment+='    <div class="ace-file-input span10" data-container data-name="{0}">';
                    __htmlFormAttachment+='         <label data-title="Click here" class="ace-file-container file-label">';
                    __htmlFormAttachment+='             <span data-title="..." class="ace-file-name file-name"><i class="icon-upload-alt ace-icon"></i></span>';
                    __htmlFormAttachment+='         </label>';
                    __htmlFormAttachment+='         <a data-remove data-name="{0}" class="remove" href="#"><i class=" ace-icon fa fa-times"></i></a>';
                    __htmlFormAttachment+='    </div>';
                    __htmlFormAttachment+='    <input type="file" name="{0}" style="display:none;" data-file data-name="{0}"/>';
                    __htmlFormAttachment+='</div>';

                    var __dataName = iNet.generateId();
                    $('#briefcase-process-additional-attachment-list').append(String.format(__htmlFormAttachment, __dataName));

                    $('#briefcase-process-additional-attachment-list [data-file][data-name="'+__dataName+'"]').on('change', function(){
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

                    $('#briefcase-process-additional-attachment-list [data-remove][data-name="'+__dataName+'"]').on('click', function(){
                        $(this).parent().parent().remove();
                    });

                    $('#briefcase-process-additional-attachment-list [data-container][data-name="'+__dataName+'"]').on('click', function(){
                        console.log(">>data-container>> click", $(this).attr('data-name'));
                        var __dataName = $(this).attr('data-name');

                        $('#briefcase-process-additional-attachment-list [data-file][data-name="'+__dataName+'"]').trigger('click');
                    });

                    $('#briefcase-process-additional-attachment-list [data-file][data-name="'+__dataName+'"]').trigger('click');
                });
                
            };
        };
        var processView = new iNet.ui.itemview({
            id: "briefcase-process",
            resource: resource,
            url: url,
            toolbar: processToolBar,
            dataContent: processDataContent,
            ajaxMaskId: 'ajax-mask',
            headerDetails: {
                subject: "briefcase-process-subject-details",
                sender: "briefcase-process-sender-details"
            }
        });
        processView.on('menuclick', function(){
            $taskFrame.setListTaskType('menu');
        });

        //PUBLISH FUNCTION ==========================================
        this.load = function(){
            processLoad();
        };
        this.setPageBack = function(page, showBackButton){
            parentPage = page;
            if (parentPage != null && showBackButton != false){
                processView.toolbar.$backBtn.show();
            } else {
                processView.toolbar.$backBtn.hide();
            }
        };
        this.setType = function(type){
            //type: full, min
            $('#'+ self.id + ' [data-id="item-view-control"].item-view').removeClass('full').addClass(type);
            //self.setMenuButton(type);
        };

        iNet.ui.xgate.BfProcess.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.xgate.BfProcess, iNet.ui.app.widget);
});
