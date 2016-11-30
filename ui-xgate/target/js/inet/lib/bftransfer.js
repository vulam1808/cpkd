// #PACKAGE: bftransfer
// #MODULE: BfTransferService
$(function () {
    iNet.ns("iNet.ui.xgate", "iNet.ui.xgate.BfTransfer");
    iNet.ui.xgate.BfTransfer = function (config) {
        this.id = 'briefcase-transfer-div';
        var __config = config || {};
        var self = this;
        var parentPage = null;
        
        //get form velocity
        var ctx = {
            context: iNet.context, //get data from widget
            zone: iNet.zone //get data from widget
        };

        var resource = {
            task: iNet.resources.task.task,
            BfTransfer: iNet.resources.xgate.BfTransfer,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            firms: iNet.getUrl('onegate/expwayfirms'),
            expway: iNet.getUrl('onegate/process/expway')
        };

        //LIST VIEW ===========================================
        var $taskFrame = iNet.getLayout().window.taskFrame;
        $taskFrame.on('typechange', function(type){
            if (type == 'min'){
                transferView.setMenuButton(true);
            } else {
                transferView.setMenuButton(false);
            }
        });

        //TRANSFER VIEW ===================================================
        var transferLoad = function() {
            transferView.reset();
            transferView.dataContent.$grid.load();
            transferView.setDataContent("view");
        };
        var transferToolBar = function() {
            this.id = "briefcase-transfer-toolbar";
            this.intComponent = function(){
                this.$backBtn = $('#briefcase-transfer-back-btn');
                this.$sendBtn = $('#briefcase-transfer-send-btn');

                this.$backBtn.on('click', function(){
                    self.fireEvent('back');
                    if (parentPage != null){
                        parentPage.show();
                        self.hide();
                    }
                }.createDelegate(this));

                this.$sendBtn.on('click', function(){
                    var __taskInfo = $taskFrame.getTaskDataIndex();
                    var __taskId = ((__taskInfo || {}).history || {}).taskID || "";
                    var __graphId = ((__taskInfo || {}).history || {}).graphID || "";
                    var __receiverID = $(this).attr("receiver") || '';

                    if (!iNet.isEmpty(__receiverID)){
                        var __remove = transferView.dataContent.$remove.prop('checked');
                        var __note = transferView.dataContent.$note.val();
                        var __params = {
                            task: __taskId,
                            graph: __graphId,
                            receiver: __receiverID, 
                            remove: __remove,
                            note: __note
                        };
                        $.postJSON(url.expway, __params, function (result) {
                            var __result = result;
                            console.log("transfer result >>", __result);
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
            };
        };
        var transferDataContent = function() {
            this.id = "briefcase-transfer-data-content";
            this.intComponent = function() {
                var dataSource = new DataSource({
                    columns: [
                        {
                            align: 'center',
                            type: 'selection',
                            width: 30
                        },
                        {
                            property: 'organName',
                            label: resource.task.organName,
                            sortable: true,
                            disabled: true
                        },
                        {
                            property: 'organAdd',
                            label: resource.task.organAdd,
                            sortable: true,
                            disabled: true
                        },
                        {
                            property: 'email',
                            label: resource.task.email,
                            sortable: true,
                            disabled: true
                        },
                        {
                            property: 'telephone',
                            label: resource.task.telephone,
                            sortable: true,
                            disabled: true
                        },
                        {
                            property: 'fax',
                            label: resource.task.fax,
                            sortable: true,
                            disabled: true
                        },
                        {
                            property: 'website',
                            label: resource.task.website,
                            sortable: true,
                            disabled: true
                        }
                    ],
                    delay: 250
                });
                this.$remove = $('#briefcase-transfer-agency-remove-chk');
                this.$note = $('#briefcase-transfer-note-txt');
                this.$grid = new iNet.ui.grid.Grid({
                    id: 'briefcase-transfer-agency-grid',
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
                        transferView.toolbar.$sendBtn.attr("receiver", ids.join(iNet.splitChar));
                    } else {
                        transferView.toolbar.$sendBtn.hide();
                        transferView.toolbar.$sendBtn.attr("receiver", "");
                    }
                });

                this.$grid.on('loaded', function (record, editable) {
                    transferView.toolbar.$sendBtn.hide();
                });
            };
        };
        var transferView = new iNet.ui.itemview({
            id: "briefcase-transfer",
            resource: resource,
            url: url,
            toolbar: transferToolBar,
            dataContent: transferDataContent,
            ajaxMaskId: 'ajax-mask',
            headerDetails: {
                subject: "briefcase-transfer-subject-details",
                sender: "briefcase-transfer-sender-details"
            }
        });
        transferView.on('menuclick', function(){
            $taskFrame.setListTaskType('menu');
        });

        //PUBLISH FUNCTION ==========================================
        this.load = function(){
            transferLoad();
        };
        this.setPageBack = function(page, showBackButton){
            parentPage = page;
            if (parentPage != null && showBackButton != false){
                transferView.toolbar.$backBtn.show();
            } else {
                transferView.toolbar.$backBtn.hide();
            }
        };
        this.setType = function(type){
            //type: full, min
            $('#'+ self.id + ' [data-id="item-view-control"].item-view').removeClass('full').addClass(type);
            //self.setMenuButton(type);
        };

        iNet.ui.xgate.BfTransfer.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.xgate.BfTransfer, iNet.ui.app.widget);
});
