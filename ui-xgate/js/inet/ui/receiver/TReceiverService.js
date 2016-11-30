// #PACKAGE: itask-ui-t-receiver-service
// #MODULE: TReceverService
$(function () {
    iNet.ns("iNet.ui.task", "iNet.ui.task.TReceiver");

    iNet.ui.task.TReceiver = function () {
        this.id = 'receiver-div';
        var self = this;
        var wgRequest = null;

        //get form velocity
        var ctx = {
            status: (typeof status == "undefined")? "CREATED" : status, //get data from page
            assign: (typeof assign == "undefined")? true : assign, //get data from page
            replyForOrgID: (typeof replyForOrgID == "undefined")? false : replyForOrgID //get data from page
        };

        var resource = {
            task: iNet.resources.receiver.task,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            task_query: iNet.getUrl('onegate/additional/taskquery'), //procedure, type, orgname, subject
            get_task_view: iNet.getUrl('onegate/additional/view'), //package

            reject_ticket: iNet.getUrl('onegate/ticketreject'), //additionalID
            signverify: iNet.getUrl('onegate/externaldata/signverify'), //fileId
            downloadFile: iNet.getUrl('onegate/binary/download'),

            "firms": iNet.getUrl('onegate/expwayfirms'),
            "transfer": iNet.getUrl('onegate/additional/expway'),

            additional_view: iNet.getUrl('onegate/externaldata/request'), //package
            additional_submit: iNet.getUrl('onegate/externaldata/reqsubmit'), //package
            additional_create: iNet.getUrl('onegate/dictadditional/create'), //

            generator: iNet.getUrl('onegate/excel/generator'),//type=Refuse
            chkstatus: iNet.getUrl('report/file/chkstatus'),//reportID
            download: iNet.getUrl('report/file/download')//reportID
        };

        //LEFT MENU ==============================================
        var $taskMenu = iNet.getLayout().taskMenu;
        $taskMenu.on('menuchange', function(){
        });
        $taskMenu.on('create', function(){
            createRequest();
        });

        //REQUEST TASK ===========================================
        var wgRequest = null;
        var createRequest = function (data) {
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
            wgRequest.setData(data);
            wgRequest.show();
            self.hide();
        };

        //LIST VIEW ===========================================
        var checkStatus = function(reportID){
            $.postJSON(url.chkstatus, {reportID: reportID}, function(result){
                var __resultChkstatus = result || 0;
                if(__resultChkstatus == 2){
                    window.location.href = url.download + "?reportID=" + reportID;
                } else if (__resultChkstatus == 1){
                    setTimeout(function(){
                        checkStatus(reportID);
                    }, 2000);
                }
            },{
                mask: self.getMask(),
                msg: iNet.resources.ajaxLoading.loading
            });
        };
        var setDataView = function(type){
            itemView.hide();
            transferView.hide();
            additionalView.hide();
            refuseView.hide();

            if (type == "item"){
                itemView.show();
                itemLoad();
            }

            if (type == "transfer"){
                transferView.show();
                transferLoad();
            }

            if (type == "additional"){
                additionalView.show();
                additionalLoad();
            }

            if (type == "refuse"){
                refuseView.show();
                refuseLoad();
            }
        };
        var fnListSearch = function(){
            var __params = listView.getParams() || {};

            __params.keyword = listView.basicSearch.$keyword.val();
            __params.warnHour = listView.advanceSearch.$warnHour.val() || 0;

            listView.setParams(__params);
            listView.load();
        };
        var basicSearch = function() {
            this.id = "receiver-list-basic-search";
            this.intComponent = function(){
                var $bs = this;
                var $expandBtn = $('#receiver-list-basic-search-expand-btn');
                var $searchBtn = $('#receiver-list-basic-search-search-btn');
                this.$keyword = $('#receiver-list-basic-search-txt-keyword');

                this.$keyword.on('keyup', function(e){
                    if (e.which == 13){
                        listView.advanceSearch.hide();
                        fnListSearch();
                    }
                });
                $searchBtn.on('click', function(){
                    listView.advanceSearch.hide();
                    fnListSearch();
                });

                $expandBtn.on('click', function(){
                    listView.advanceSearch.show();
                });
            };
        };
        var advanceSearch = function() {
            this.id = "receiver-list-advance-search";
            this.intComponent = function(){
                var $as = this;
                var $searchBtn = $('#receiver-list-advance-search-search-btn');
                var $closeBtn = $('#receiver-list-advance-search-close-btn');
                this.$warnHour = $('#receiver-list-advance-search-warnHour-txt');

                $searchBtn.on('click', function(){
                    listView.advanceSearch.hide();
                    fnListSearch();
                });
                $closeBtn.on('click', function(){
                    listView.advanceSearch.hide();
                });
            };
        };
        var pullLeft = function() {
            this.id = "receiver-list-pull-left";
            this.intComponent = function(){
            };
        };
        var toolbar = function() {
            this.id = "receiver-list-toolbar";
            this.intComponent = function(){
                this.$excelBtn = $('#receiver-list-excel-btn');
                if (ctx.status == "REFUSE"){
                    this.$excelBtn.removeClass('hide');
                }

                this.$excelBtn.on('click', function(){
                    var __params = listView.getParams() || {};
                    __params.type = "Refuse";
                    $.postJSON(url.generator, __params, function(result){
                        var __result = result || {};
                        if (CommonService.isSuccess(__result)){
                            setTimeout(function(){
                                checkStatus(__result.uuid);
                            }, 2000);
                        } else {
                            self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                        }
                    },{
                        mask: self.getMask(),
                        msg: iNet.resources.ajaxLoading.loading
                    });
                }.createDelegate(this));
            };
        };
        var listView = new iNet.ui.listview({
            id: "receiver-list",
            uiItemId: "receiver-list-item-ui",
            url: url.task_query,
            basicSearch: basicSearch,
            advanceSearch: advanceSearch,
            toolbar: toolbar,
            pullLeft: pullLeft,
            params: {
                pageSize: 20,
                pageNumber: 0,
                status: ctx.status,
                assign: ctx.assign,
                replyForOrgID: ctx.replyForOrgID
            },
            convertData: function(data){
                var __data = data || {};
                listView.setTotal(__data.total);
                $.each(__data.items || [], function(i, item){
                    listView.addItem(item);
                });
            }
        });
        listView.on('indexchange', function(data){
            setDataView("item");
        });
        listView.on('typechange', function(type){
            if (type == "max") {
                itemView.setType('min');
                transferView.setType('min');
                additionalView.setType('min');
            } else {
                itemView.setType('full');
                transferView.setType('full');
                additionalView.setType('full');
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
            $taskMenu.refresh('receiver');
        });

        //ITEM VIEW ==========================================
        var itemLoad = function(){
            itemView.reset();
            var data = listView.getData() || {};
            if (!iNet.isEmpty(data.uuid)){
                $.postJSON(url.get_task_view, {"package": data.uuid}, function (result) {
                    var __result = result || {};

                    itemView.setData(__result);
                    console.log("view_request result >>", __result);

                    var __subjectData = {subject: data.subject || '', showAttachmentIcon: false, showCommentIcon: false, showDetailsIcon: false};
                    var __senderData = {name: (data.author || {}).fullName, date: ' (' + $.timeago(data.requestTime) + ')', showDetailsIcon: false};
                    itemView.setHeader({subject: __subjectData, sender: __senderData, object: __result});
                    itemView.setSubmitContent(__result.content);

                    var __commentData = [];
                    var __attBriefData = (__result.pkgdata || {}).attachments || [];
                    itemView.setFooter({comments: __commentData, attBriefs: __attBriefData});
                },{
                    mask: self.getMask(),
                    msg: iNet.resources.ajaxLoading.loading
                });
            }
        };
        var itemToolBar = function() {
            this.id = "receiver-view-toolbar";
            this.intComponent = function(){
                this.$groupBtn = $('#receiver-view-group-btn');
                this.$transferBtn = $('#receiver-view-transfer-btn');
                this.$additionalBtn = $('#receiver-view-additional-btn');
                this.$createBtn = $('#receiver-view-create-btn');
                this.$cancelBtn = $('#receiver-view-cancel-btn');
                this.$infoBtn = $('#receiver-view-info-btn');

                if (ctx.status != "CREATED"){
                    this.$groupBtn.hide();
                    this.$createBtn.hide();
                    this.$cancelBtn.hide();
                    this.$infoBtn.show();
                } else {
                    this.$groupBtn.show();
                    this.$createBtn.show();
                    this.$cancelBtn.show();
                    this.$infoBtn.hide();
                }

                this.$transferBtn.on('click', function(){
                    setDataView('transfer');
                });

                this.$additionalBtn.on('click', function(){
                    setDataView('additional');
                });

                this.$createBtn.on('click', function(){
                    var __data = {};
                    __data.info = listView.getData() || {};
                    __data.item = itemView.getData() || {};
                    createRequest(__data);
                });

                this.$cancelBtn.on('click', function(){
                    var __additional = (itemView.getData().pkgdata || {}).uuid || "";
                    $taskModal.setTop(30);
                    $taskModal.setTitle($(this).attr('title'));
                    $taskModal.setDescription($(this).attr('description'));
                    $taskModal.setAreaName('note');
                    $taskModal.setAdditional(url.reject_ticket, {additionalID: __additional});
                    $taskModal.show();
                });

                this.$infoBtn.on('click', function(){
                    setDataView('refuse');
                });
            };
        };
        var itemView = new iNet.ui.itemview({
            id: "receiver-view",
            resource: resource,
            url: url,
            toolbar: itemToolBar,
            ajaxMaskId: 'ajax-mask',
            headerDetails: {
                subject: "receiver-view-subject-details",
                sender: "receiver-view-sender-details"
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

        //TRANSFER VIEW ===================================================
        var transferLoad = function(){
            transferView.reset();
            transferView.dataContent.$grid.load();
            transferView.setDataContent("view");
        };
        var transferToolBar = function() {
            this.id = "receiver-transfer-toolbar";
            this.intComponent = function(){
                this.$briefcaseBtn = $('#receiver-transfer-briefcase-btn');
                this.$additionalBtn = $('#receiver-transfer-additional-btn');
                this.$sendBtn = $('#receiver-transfer-send-btn');

                this.$briefcaseBtn.on('click', function(){
                    setDataView("item");
                });

                this.$additionalBtn.on('click', function(){
                    setDataView("additional");
                });

                this.$sendBtn.on('click', function(){
                    var __additionID = (itemView.getData().pkgdata || {}).uuid || "" || '';
                    var __receiverID = transferView.dataContent.$dataReceiver || '';

                    if (!iNet.isEmpty(__receiverID) && !iNet.isEmpty(__additionID)){
                        var __remove = transferView.dataContent.$remove.prop('checked');
                        var __note = transferView.dataContent.$note.val();
                        $.postJSON(url.transfer, {"package": __additionID, receiver: __receiverID, remove: __remove, note: __note}, function (result) {
                            var __result = result;
                            console.log("transfer result >>", __result);
                            if (CommonService.isSuccess(__result)) {
                                refresh();
                                self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                            } else {
                                self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                            }
                        },{
                            mask: self.getMask(),
                            msg: iNet.resources.ajaxLoading.loading
                        });
                    }
                });
            };
        };
        var transferDataContent = function() {
            this.id = "receiver-transfer-data-content";
            this.intComponent = function(){
                var me = this;
                this.$dataReceiver = "";
                this.$remove = $('#receiver-transfer-agency-remove-chk');
                this.$note = $('#receiver-transfer-agency-note-txt');
                var dataSource = new DataSource({
                    columns: [
                        {
                            align: 'center',
                            type: 'selection',
                            width: 30
                        },
                        {
                            property: 'organName',
                            label : resource.task.organName,
                            sortable : true,
                            disabled: true
                        },
                        {
                            property : 'organAdd',
                            label : resource.task.organAdd,
                            sortable : true,
                            disabled: true
                        },
                        {
                            property : 'email',
                            label : resource.task.email,
                            sortable : true,
                            disabled: true
                        },
                        {
                            property : 'telephone',
                            label : resource.task.telephone,
                            sortable : true,
                            disabled: true
                        },
                        {
                            property : 'fax',
                            label : resource.task.fax,
                            sortable : true,
                            disabled: true
                        },
                        {
                            property : 'website',
                            label : resource.task.website,
                            sortable : true,
                            disabled: true
                        }
                    ],
                    delay: 250
                });

                this.$grid = new iNet.ui.grid.Grid({
                    id: 'receiver-transfer-agency-grid',
                    url: url.firms,
                    params: {},
                    convertData: function (data) {
                        var __data = data || {};
                        //gridTransfer.setTotal(__data.total);
                        return __data.items;
                    },
                    dataSource: dataSource,
                    stretchHeight: false,
                    editable: false,
                    firstLoad: false,
                    idProperty: 'uuid'
                });

                this.$grid.on('selectionchange', function (sm, data) {
                    var records = sm.getSelection();
                    var count = records.length;
                    var ids = [];
                    for (var i = 0; i < count; i++) {
                        var __record = records[i];
                        ids.push(__record.organId);
                    }
                    if (ids.length > 0) {
                        transferView.toolbar.$sendBtn.show();
                        me.$dataReceiver = ids.join(iNet.splitChar);
                    } else {
                        transferView.toolbar.$sendBtn.hide();
                        me.$dataReceiver = '';
                    }
                });

                this.$grid.on('loaded', function(record, editable) {
                    transferView.toolbar.$sendBtn.hide();
                });
            };
        };
        var transferView = new iNet.ui.itemview({
            id: "receiver-transfer",
            resource: resource,
            url: url,
            toolbar: transferToolBar,
            dataContent: transferDataContent,
            ajaxMaskId: 'ajax-mask',
            headerDetails: {
                subject: "receiver-transfer-subject-details",
                sender: "receiver-transfer-sender-details"
            }
        });
        transferView.on('menuclick', function(){
            listView.setType('menu');
        });

        //ADDITIONAL VIEW ===================================================
        var additionalLoad = function(){
            additionalView.reset();
            var data = listView.getData() || {};
            additionalView.dataContent.$grid.setParams({"package": data.uuid});
            additionalView.dataContent.$grid.load();
            additionalView.setDataContent("view");
        };
        var additionalToolBar = function() {
            this.id = "receiver-additional-toolbar";
            this.intComponent = function(){
                this.$briefcaseBtn = $('#receiver-additional-briefcase-btn');
                this.$transferBtn = $('#receiver-additional-transfer-btn');
                this.$sendBtn = $('#receiver-additional-send-btn');
                this.$addBtn = $('#receiver-additional-add-btn');

                this.$briefcaseBtn.on('click', function(){
                    setDataView("item");
                });

                this.$transferBtn.on('click', function(){
                    setDataView("transfer");
                });

                this.$sendBtn.on('click', function(){
                    var __additionID = (itemView.getData().pkgdata || {}).uuid || "" || '';
                    var __fieldNameList = additionalView.dataContent.$dataFieldName || '';
                    var __briefList = additionalView.dataContent.$dataBrief || '';

                    if (!iNet.isEmpty(__additionID) && !iNet.isEmpty(__fieldNameList)){
                        var __params = {
                            "package": __additionID,
                            brief: additionalView.dataContent.$brief.val()
                        };

                        var __briefArg = __briefList.split(',');
                        $.each(__fieldNameList.split(','), function(i, obj){
                            if(!iNet.isEmpty(obj || '')){
                                __params[obj] = __briefArg[i] || "";
                            }
                        });

                        $.postJSON(url.additional_submit, __params, function (result) {
                            var __result = result;
                            console.log("additional_submit result >>", __result);
                            if (CommonService.isSuccess(__result)) {
                                self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                            } else {
                                self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                            }
                        },{
                            mask: self.getMask(),
                            msg: iNet.resources.ajaxLoading.loading
                        });
                    }
                });
                this.$addBtn.on('click', function(){
                    additionalView.dataContent.$grid.newRecord({brief: ""});
                });
            };
        };
        var additionalDataContent = function() {
            this.id = "receiver-additional-data-content";
            this.intComponent = function(){
                var me = this;
                this.$dataFieldName = "";
                this.$dataBrief = "";

                this.$brief = $('#receiver-additional-brief-info-txt');

                var dataSource = new DataSource({
                    columns: [
                        {
                            align: 'center',
                            type: 'selection',
                            width: 30
                        },
                        /*{
                            property: 'fieldName',
                            label : resource.task.fieldName,
                            sortable : true
                        },*/
                        {
                            property : 'brief',
                            label : resource.task.brief,
                            sortable : true,
                            type: "text"
                        },{
                            label : '',
                            type : 'action',
                            separate: '&nbsp;',
                            align: 'center',
                            buttons : [{
                                text : iNet.resources.message.button.edit,
                                icon : 'icon-pencil',
                                labelCls: 'label label-info',
                                fn : function(record) {
                                    me.$grid.edit(record[me.$grid.getIdProperty()]);
                                }
                            }]
                        }
                    ],
                    delay: 250
                });

                this.$grid = new iNet.ui.grid.Grid({
                    id: 'receiver-additional-grid',
                    url: url.additional_view,
                    params: {},
                    convertData: function (data) {
                        var __data = data || {};
                        if (iNet.isEmpty(__data.brief)){
                            __data.brief = __data.fieldName;
                        }
                        me.procedureID = __data.procedureID;
                        //gridAdditional.setTotal(__data.total);
                        return __data.items;
                    },
                    dataSource: dataSource,
                    stretchHeight: false,
                    editable: false,
                    firstLoad: false,
                    idProperty: 'uuid'
                });

                this.$grid.on('selectionchange', function (sm, data) {
                    var records = sm.getSelection();
                    var count = records.length;
                    var ids = [], briefs = [];
                    for (var i = 0; i < count; i++) {
                        var __record = records[i];
                        if (!iNet.isEmpty(__record.fieldName || '')){
                            ids.push(__record.fieldName);
                            briefs.push(__record.brief);
                        }
                    }
                    if (ids.length > 0) {
                        additionalView.toolbar.$sendBtn.show();
                        me.$dataFieldName = ids.join(iNet.splitChar);
                        me.$dataBrief = briefs.join(iNet.splitChar);
                    } else {
                        additionalView.toolbar.$sendBtn.hide();
                        me.$dataFieldName = '';
                        me.$dataBrief = '';
                    }
                });

                this.$grid.on('loaded', function(record, editable) {
                    additionalView.toolbar.$sendBtn.hide();
                });

                this.$grid.on('save', function (data) {
                    var __data = data || {};

                    var __taskInfo = listView.getData() || {};
                    var __procedureID = ((__taskInfo || {}).requestData || {}).procedureID || "";

                    if (iNet.isEmpty(__data.brief) || iNet.isEmpty(__procedureID)){
                        return;
                    }

                    __data.fieldName = 'file' + iNet.generateId().substring(0, 6);
                    __data.procedureID = __procedureID;
                    $.postJSON(url.additional_create, __data, function (result) {
                        var __result = result || {};
                        if (CommonService.isSuccess(__result)) {
                            me.$grid.insert(__result);
                            self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                        } else {
                            self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                        }
                    });
                });

                this.$grid.on('update', function(data, odata) {
                    var __data = odata || {};
                    __data.brief = data.brief || "";
                    me.$grid.update(__data);
                    me.$grid.commit();
                });
            };
        };
        var additionalView = new iNet.ui.itemview({
            id: "receiver-additional",
            resource: resource,
            url: url,
            toolbar: additionalToolBar,
            dataContent: additionalDataContent,
            ajaxMaskId: 'ajax-mask',
            headerDetails: {
                subject: "receiver-additional-subject-details",
                sender: "receiver-additional-sender-details"
            }
        });
        additionalView.on('menuclick', function(){
            listView.setType('menu');
        });

        //REFUSE VIEW ===================================================
        var refuseLoad = function(){
            refuseView.reset();
            refuseView.setDataContent("view");
            var data = listView.getData() || {};

            refuseView.dataContent.$files.html('');
            refuseView.dataContent.$note.text(data.note || "");

            if ((data.files || []).length > 0){
                var __brief = '';
                $(data.files || []).each(function(i, attachment){
                    var $itemId = (attachment.contentID || attachment.gridfsUUID) || "";
                    var $itemFileName = (attachment.file || attachment.filename) || "";
                    var $itemFileName = (attachment.file || attachment.filename) || "";
                    var __briefIndex = new Date(attachment.created).format("H:i d/m/Y");
                    if (__brief != __briefIndex){
                        refuseView.dataContent.$files.append('<div style="padding: 5px;"><div style="border: 1px solid #DDD;border-radius:10px;padding: 5px;background-color: #B98F43;color: #FFF;">'+__briefIndex+'</div></div>');
                        __brief = __briefIndex;
                    }
                    if (!iNet.isEmpty($itemId)){
                        refuseView.dataContent.$files.append('<div style="padding: 5px;padding-left:30px;"><a style="padding: 5px;" href="'+url.downloadFile+'?role=processor&binary='+$itemId+'">'+(i+1)+'. <i class="'+iNet.FileFormat.getFileIcon($itemFileName)+'"></i> ' + $itemFileName + ' - ' + iNet.FileFormat.getSize(attachment.size || 0) + ' <i class="icon-download"></i></a></div>');
                    }
                });
            }
        };
        var refuseToolBar = function() {
            this.id = "receiver-refuse-toolbar";
            this.intComponent = function(){
                this.$briefcaseBtn = $('#receiver-refuse-briefcase-btn');
                this.$briefcaseBtn.on('click', function(){
                    setDataView("item");
                });
            };
        };
        var refuseDataContent = function() {
            this.id = "receiver-refuse-data-content";
            this.intComponent = function(){
                this.$files = $('#receiver-refuse-file-list');
                this.$note = $('#receiver-refuse-note');
            };
        };
        var refuseView = new iNet.ui.itemview({
            id: "receiver-refuse",
            resource: resource,
            url: url,
            toolbar: refuseToolBar,
            dataContent: refuseDataContent,
            ajaxMaskId: 'ajax-mask',
            headerDetails: {
                subject: "receiver-refuse-subject-details",
                sender: "receiver-refuse-sender-details"
            }
        });

        //OTHER ==============================================
        var refresh = function(){
            $taskMenu.refresh('receiver');
            listView.refresh();
        };

        iNet.ui.task.TReceiver.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.task.TReceiver, iNet.ui.app.widget);

    new iNet.ui.task.TReceiver().show();
});
