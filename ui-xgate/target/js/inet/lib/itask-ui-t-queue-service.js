// #PACKAGE: itask-ui-t-queue-service
// #MODULE: TQueueService
$(function () {
    iNet.ns("iNet.ui.task", "iNet.ui.task.TQueue");
    iNet.ui.task.TQueue = function (config) {
        this.id = 'queue-div';
        var self = this;
        var selfData = {}; selfData.itemsSelected = [];
        var wgRequest = null;
        var wgUserProfile = null;
        var __config = config || {};
        var ctx = {
            isBack: false,
            queueID: (typeof queueID == 'undefined') ? '' : queueID,
            keyword: (typeof keyword == 'undefined') ? '' : keyword,
            pageParent: (typeof pageParent == 'undefined') ? '' : pageParent,
            pageUrl: (typeof pageUrl == 'undefined') ? '' : pageUrl
        };

        if(!iNet.isEmpty((iNet.getLayout() || {}).parentParams || {})){
            iNet.apply(__config, (iNet.getLayout() || {}).parentParams || {});
            iNet.getLayout().parentParams = {};
        }

        if (!iNet.isEmpty(__config)) {
            ctx.queueID = __config.queueID;
            ctx.keyword = __config.keyword;
            ctx.pageParent = __config.pageParent;
            ctx.pageUrl = __config.pageUrl;
        }

        if (!iNet.isEmpty(ctx.pageParent)
            || !iNet.isEmpty(ctx.pageUrl)
            || !iNet.isEmpty(ctx.queueID)
        )
            ctx.isBack = true;

        console.log("ctx", ctx);

        var resource = {
            queue: iNet.resources.receiver.queue,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            search_request: iNet.getUrl('firmtask/process/queue'), //type=normal&status=INPROCESS, warnHour, keyword, serial, receipt
            view_request: iNet.getUrl('onegate/deptrecord/load'), //request firmtask/process/reqload
            view_record: iNet.getUrl('onegate/deptrecord/view'), //request

            update_request: iNet.getUrl('onegate/deptrecord/update'), //form os(firmtask/process/requpdate)
            submit_request: iNet.getUrl('onegate/process/submit'), //form submit
            delete_queue: iNet.getUrl('firmtask/reject/queue'),

            signverify: iNet.getUrl('onegate/externaldata/signverify'), //fileId
            downloadFile: iNet.getUrl('onegate/binary/download')
        };

        //LEFT MENU ==============================================
        var $taskMenu = iNet.getLayout().taskMenu;
        $taskMenu.on('menuchange', function(){
        });
        $taskMenu.on('create', function(){
            createRequest();
        });
        //USERPROFILE ============================================
        var createUserProfile = function(){
            if (wgUserProfile == null){
                wgUserProfile = new iNet.ui.UserProfile();
                wgUserProfile.on('back', function(data){
                    wgUserProfile.hide();
                    if (!iNet.isEmpty(data)){
                        refresh();
                    }
                    self.show();
                });
            }

            return wgUserProfile;
        };

        //REQUEST TASK ===========================================
        var createRequest = function () {
            if (wgRequest == null){
                wgRequest = new iNet.ui.task.TRequest();
            }

            wgRequest.on('finish', function(data){
                self.show();
                wgRequest.hide();
                if (!iNet.isEmpty(data)){
                    refresh();
                }
            });
            wgRequest.setData({});
            wgRequest.show();
            self.hide();
        };

        //LIST VIEW ===========================================
        var basicSearch = function() {
            this.id = "queue-list-basic-search";
            this.intComponent = function(){
                var $bs = this;
                var $expandBtn = $('#queue-list-basic-search-expand-btn');
                var $searchBtn = $('#queue-list-basic-search-search-btn');
                this.$keyword = $('#queue-list-basic-search-txt-keyword');
                this.$keyword.val(ctx.keyword || "");

                this.$keyword.on('keyup', function(e){
                    if (e.which == 13){
                        var __params = listView.getParams() || {};
                        __params.keyword = $bs.$keyword.val();
                        listView.setParams(__params);
                        listView.load();
                    }
                });

                $searchBtn.on('click', function(){
                    //listView.advanceSearch.hide();
                    var __params = listView.getParams() || {};
                    __params.keyword = $bs.$keyword.val();
                    listView.setParams(__params);
                    listView.load();
                });

                $expandBtn.on('click', function(){
                    //listView.advanceSearch.show();
                });
            };
        };
        var advanceSearch = function() {
            this.id = "queue-list-advance-search";
            this.intComponent = function(){
                var $as = this;
                var $searchBtn = $('#queue-list-advance-search-search-btn');
                var $closeBtn = $('#queue-list-advance-search-close-btn');
                this.$receipt = $('#queue-list-advance-search-receipt-txt');
                this.$serial = $('#queue-list-advance-search-serial-txt');
                this.$warnHour = $('#queue-list-advance-search-warnHour-txt');

                $searchBtn.on('click', function(){
                    listView.advanceSearch.hide();
                    var __params = listView.getParams() || {};
                    __params.receipt = $as.$receipt.val();
                    __params.serial = $as.$serial.val();
                    __params.warnHour = $as.$warnHour.val();
                    __params.keyword = listView.basicSearch.$keyword.val();
                    listView.setParams(__params);
                    listView.load();
                });
                $closeBtn.on('click', function(){
                    listView.advanceSearch.hide();
                });
            };
        };
        var pullLeft = function() {
            this.id = "queue-list-pull-left";
            this.intComponent = function(){
            };
        };
        var toolbar = function() {
            this.id = "queue-list-toolbar";
            this.intComponent = function(){
                this.$addBtn = $('#queue-list-add-btn');
                this.$addBtn.removeClass('hide');
                this.$addBtn.on('click', function(){
                    createRequest();
                }.createDelegate(this));

                this.$sendBtn = $('#queue-list-send-btn');
                this.$sendBtn.on('click', function(){
                    submitSeleted(listView.getSelected() || []);
                });
            };
        };
        var listView = new iNet.ui.listview({
            id: "queue-list",
            uiItemId: "queue-list-item-ui",
            url: url.search_request,
            basicSearch: basicSearch,
            //advanceSearch: advanceSearch,
            toolbar: toolbar,
            pullLeft: pullLeft,
            params: {
                pageSize: 20,
                pageNumber: 0,
                "status": "QUEUE",
                queueID: ctx.queueID,
                keyword: ctx.keyword
            },
            convertData: function(data){
                var __data = data || {};
                listView.setTotal(__data.total);
                $.each(__data.items || [], function(i, item){
                    listView.addItem(item);
                });
            }
        });
        listView.on('itemselected', function(datas){
            selfData.itemsSelected = datas || [];
            if ((datas || []).length > 0){
                listView.toolbar.$sendBtn.show();
            } else {
                listView.toolbar.$sendBtn.hide();
            }
        });
        listView.on('indexchange', function(data){
            itemView.reset();
            if (!iNet.isEmpty(data.uuid)){
                $.postJSON(url.view_request, {"request": data.uuid}, function (result) {
                    var __result = result || {};
                    console.log("view_request result >>", __result);

                    itemView.setData(__result);

                    var __subjectData = {subject: data.subject || '', showAttachmentIcon: false, showCommentIcon: false, showDetailsIcon: false};
                    var __senderData = {name: data.requestorName, date: ' (' + $.timeago(data.requestTime) + ')', showDetailsIcon: false};
                    itemView.setHeader({subject: __subjectData, sender: __senderData, object: __result});
                    itemView.setSubmitContent(__result.content);

                    var __commentData = (__result.request || {}).comments || [];
                    var __attBriefData = (__result.request || {}).attachments || [];

                    $.postJSON(url.view_record, {"request": data.uuid}, function (result) {
                        var __result = result || {};
                        var __docRecord = (__result.record || {}).documents || [];

                        itemView.setFooter({
                            comments: __commentData,
                            attBriefs: __attBriefData,
                            docRecord: __docRecord
                        });
                    },{
                        mask: self.getMask(),
                        msg: iNet.resources.ajaxLoading.loading
                    });
                },{
                    mask: self.getMask(),
                    msg: iNet.resources.ajaxLoading.loading
                });
            }
        });
        listView.on('typechange', function(type){
            if (type == "max") {
                itemView.setType('min');
            } else {
                itemView.setType('full');
            }
        });


        //FILE VIEW ===================================================
        var fileView = new iNet.ui.fileview();
        fileView.setPageBack(self);

        //MODAL VIEW ==========================================
        var $taskModal = new iNet.ui.modalview();
        $taskModal.on('success', function(){
            this.hide();
            refresh();
        });

        //ITEM VIEW ==========================================
        var submitSeleted = function(){
            var __iSummited = 0;
            $(selfData.itemsSelected).each(function(i, item){
                var __itemData = item.value || {};
                if (!item.submited){
                    item.submited = true;
                    itemView.setSubmitContent('');
                    itemView.resetBodyHidden();
                    itemView.addBodyHidden('request', __itemData.uuid);
                    itemView.addBodyHidden('subject', __itemData.subject);
                    itemView.addBodyHidden('form', __itemData.formID);
                    itemView.submit(url.submit_request);
                    return false;
                } else
                    __iSummited++;
            });
        };
        var submitRequest = function(url){
            var __messageValidate = !iNet.isFunction(((iNet || {}).requestData || {}).messageValidate) ? "" : ((iNet || {}).requestData || {}).messageValidate();
            console.log(">> submitRequest validate >>", {messageValidate: __messageValidate} );

            var __url = url || "";
            if (iNet.isEmpty(__messageValidate) && !iNet.isEmpty(__url)) {
                itemView.submit(__url);
            } else {
                self.notifyError(resource.constant.warning_title, __messageValidate);
            }
        };

        var itemToolBar = function() {
            this.id = "queue-toolbar";
            this.intComponent = function(){
                var $saveBtn = $('#queue-view-save-btn');
                var $sendBtn = $('#queue-view-send-btn');
                var $deleteBtn = $('#queue-view-delete-btn');

                this.$backBtn = $('#queue-view-back-btn');
                var $printFormNo03Btn = $('#queue-view-print-formNo03-btn');
                var $printFormNo04Btn = $('#queue-view-print-formNo04-btn');

                $deleteBtn.on('click', function(){
                    var __listData = listView.getData() || {};
                    $taskModal.setTitle($(this).text());
                    $taskModal.setDescription(__listData.subject);
                    $taskModal.setParams({queueID: __listData.uuid});
                    $taskModal.setUrl(url.delete_queue);
                    $taskModal.setTop(50);
                    $taskModal.show();
                });

                $saveBtn.on('click', function(){
                    $('#'+ itemView.id).find('[type="file"]').each(function(i, obj){
                        var __nameFile = $(obj).attr('name') || "";
                        var $ctrlFile = $(obj).parent().parent();
                        if (!($ctrlFile.find('.data-content[data-content]:first').css('display') == "none")){
                            if (iNet.isEmpty($(obj).val())){
                                $ctrlFile.append('<div data-action="fileRemove" class="hide"><input type="text" name="'+__nameFile+'_removed" value="removed"></div>');
                            }
                        } else {
                            $ctrlFile.find('[data-action="fileRemove"]').remove();
                        }
                    });

                    var __listData = listView.getData() || {};
                    itemView.resetBodyHidden();
                    itemView.addBodyHidden('request', __listData.uuid);
                    itemView.addBodyHidden('subject', __listData.subject);
                    submitRequest(url.update_request);
                });

                $sendBtn.on('click', function(){
                    $('#'+ itemView.id).find('[type="file"]').each(function(i, obj){
                        var __nameFile = $(obj).attr('name') || "";
                        var $ctrlFile = $(obj).parent().parent();
                        if (!($ctrlFile.find('.data-content[data-content]:first').css('display') == "none")){
                            if (iNet.isEmpty($(obj).val())){
                                $ctrlFile.append('<div data-action="fileRemove" class="hide"><input type="text" name="'+__nameFile+'_removed" value="removed"></div>');
                            }
                        } else {
                            $ctrlFile.find('[data-action="fileRemove"]').remove();
                        }
                    });

                    var __listData = listView.getData() || {};
                    itemView.resetBodyHidden();
                    itemView.addBodyHidden('request', __listData.uuid);
                    itemView.addBodyHidden('subject', __listData.subject);
                    itemView.addBodyHidden('form', __listData.formID);
                    submitRequest(url.submit_request);
                });

                $printFormNo03Btn.on('click', function(){
                    var __requestID = (listView.getData() || {}).uuid || "";
                    if (!iNet.isEmpty(__requestID)){
                        window.open(iNet.getUrl(CommonService.pageRequest.formNo03) + '?task=' + __requestID, '_blank');
                    }
                });
                $printFormNo04Btn.on('click', function(){
                    var __requestID = (listView.getData() || {}).uuid || "";
                    if (!iNet.isEmpty(__requestID)){
                        window.open(iNet.getUrl(CommonService.pageRequest.formNo04) + '?task=' + __requestID, '_blank');
                    }
                });

                this.$backBtn.on('click', function(){
                    if (!iNet.isEmpty(ctx.pageUrl)){
                        var __url = iNet.getUrl(CommonService.pageRequest.xgate) + CommonService.pageRequest.hashtag[ctx.pageUrl];
                        iNet.getLayout().window.location.href = __url
                    } else if (!iNet.isEmpty(ctx.pageParent)){
                        self.hide();
                        ctx.pageParent.show();
                    }
                    self.fireEvent('back');
                }.createDelegate(this));

                var $userProfileBtn = $('#queue-view-userprofile-btn');
                $userProfileBtn.on('click', function(){
                    var __profileID = (((listView.getData() || {}).requestData || {}).userProfile || {}).uuid || "";
                    console.log("__profileID", __profileID);
                    if (!iNet.isEmpty(__profileID)){
                        wgUserProfile = createUserProfile();
                        wgUserProfile.setProfile(__profileID);
                        wgUserProfile.show();
                        self.hide();
                    }
                });
            };
        };
        var itemView = new iNet.ui.itemview({
            id: "queue-view",
            resource: resource,
            url: url,
            toolbar: itemToolBar,
            ajaxMaskId: 'ajax-mask',
            headerDetails: {
                subject: "queue-subject-details",
                sender: "queue-sender-details"
            }
        });
        itemView.on('submitted', function(data){
            var __data = data || {};

            var __iSummited = 0;
            $(selfData.itemsSelected).each(function(i, item){
                if (!item.submited){
                    submitSeleted();
                    return false;
                } else
                    __iSummited++;
            });

            if (__iSummited>0){
                if (selfData.itemsSelected.length == __iSummited){
                    selfData.itemsSelected = [];
                    refresh();
                }
            } else {
                if (__data.type == "error"){
                    self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __data.errors || []));
                } else {
                    self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                    if (ctx.isBack){
                        itemView.$backBtn.trigger('click');
                    } else {
                        refresh();
                    }
                }
            }
        });
        itemView.on('headerchange', function(data){
            console.log(">>headerchange>>", data);
        });
        itemView.on('menuclick', function(){
            listView.setType('menu');
        });
        itemView.on('fileclick', function(data){
            var __data = data || {};
            if (!iNet.isEmpty(__data.uuid)) {
                if (__data.action == "viewfile") {
                    fileView.viewFile(__data.uuid);
                    self.hide();
                }

                if (__data.action == "downfile") {
                    window.open(url.downloadFile + '?binary=' + __data.uuid, '_blank');
                    /*$.postJSON(url.downloadFile, {binary: __data.uuid}, function(result){
                        console.log(">>downloadFile>>", result);
                    });*/
                }
            }
        });

        //PUBLISH EVENT ======================================
        this.setData = function(data){
            var __data = data || {};

            var __params = listView.getParams() || {};
            __params.queueID = __data.queueID || "";
            listView.setParams(__params);
            listView.refresh();

            ctx.isBack = true;
            itemView.toolbar.$backBtn.show();
        };

        //OTHER ==============================================
        var refresh = function(){
            $taskMenu.refresh('queue');
            listView.refresh();
            listView.toolbar.$sendBtn.hide();
        };

        if (ctx.isBack){
            itemView.toolbar.$backBtn.show();
        }

        iNet.ui.task.TQueue.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.task.TQueue, iNet.ui.app.widget);

    //new iNet.ui.task.TQueue().show();
});
