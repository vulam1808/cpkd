// #PACKAGE: bfadditional
// #MODULE: BfAdditionalService
$(function () {
    iNet.ns("iNet.ui.xgate", "iNet.ui.xgate.BfAdditional");
    iNet.ui.xgate.BfAdditional = function (config) {
        this.id = 'briefcase-additional-div';
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
            Bfadditional: iNet.resources.xgate.Bfadditional,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            view: iNet.getUrl('onegate/externaldata/request'), //package
            send: iNet.getUrl('onegate/externaldata/reqsubmit'), //package
            create: iNet.getUrl('onegate/dictadditional/create') //procedureID, fieldName, brief, system
        };

        //LIST VIEW ===========================================
        var $taskFrame = iNet.getLayout().window.taskFrame;
        $taskFrame.on('typechange', function(type){
            if (type == 'min'){
                additionalView.setMenuButton(true);
            } else {
                additionalView.setMenuButton(false);
            }
        });

        //ADDITIONAL VIEW ===================================================
        var additionalLoad = function() {
            additionalView.reset();

            var __taskInfo = $taskFrame.getTaskDataIndex();
            var __additionalID = ((__taskInfo || {}).request || {}).additionalID || "";
            additionalView.dataContent.$grid.setParams({"package": __additionalID});
            additionalView.dataContent.$grid.load();

            additionalView.setDataContent("view");
        };
        var additionalToolBar = function() {
            this.id = "briefcase-additional-toolbar";
            this.intComponent = function(){
                this.$backBtn = $('#briefcase-additional-back-btn');
                this.$sendBtn = $('#briefcase-additional-send-btn');
                this.$addBtn = $('#briefcase-additional-add-btn');

                this.$backBtn.on('click', function(){
                    self.fireEvent('back');
                    if (parentPage != null){
                        parentPage.show();
                        self.hide();
                    }
                }.createDelegate(this));

                this.$sendBtn.on('click', function(){
                    var __taskInfo = $taskFrame.getTaskDataIndex();
                    var __additionalID = ((__taskInfo || {}).request || {}).additionalID || "";
                    var __requestID = ((__taskInfo || {}).request || {}).uuid || "";
                    var __fieldNameList = $(this).attr("fieldName") || '';
                    var __briefList = $(this).attr("brief") || '';
                    var __note = additionalView.dataContent.$note.val() || '';
                    var __expiredTime = additionalView.dataContent.$expiredTime.val().dateToLong();

                    if (!iNet.isEmpty(__additionalID) && !iNet.isEmpty(__fieldNameList)){
                        var __params = {
                            "package": __additionalID,
                            brief: __note,
                            expiredTime: __expiredTime,
                            requestID: __requestID
                        };

                        var __briefArg = __briefList.split(',');
                        $.each(__fieldNameList.split(','), function(i, obj){
                            if(!iNet.isEmpty(obj || '')){
                                __params[obj] = __briefArg[i];
                            }
                        });

                        $.postJSON(url.send, __params, function (result) {
                            var __result = result;
                            console.log("additional_submit result >>", __result);
                            if (CommonService.isSuccess(__result)) {
                                self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                                $taskFrame.refresh();
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
            this.id = "briefcase-additional-data-content";
            this.intComponent = function() {
                this.$note = $('#briefcase-additional-brief-note-txt');
                this.$expiredTime = $('#briefcase-additional-brief-expiredTime');
                FormService.createDate(this.$expiredTime);
                this.$expiredTime.val(new Date().format('d/m/Y'));

                var me = this;
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
                            type : 'text'
                        },
                        {
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
                    id: 'briefcase-additional-grid',
                    url: url.view,
                    params: {
                        "package" : ""
                    },
                    convertData: function (data) {
                        var __data = data || {};
                        $(__data.items || []).each(function(i, item){
                            if (iNet.isEmpty(item.brief)){
                                item.brief = item.fieldName;
                            }
                        });

                        //gridadditional.setTotal(__data.total);
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
                    var briefs = [];
                    for (var i = 0; i < count; i++) {
                        var __record = records[i];
                        if (!iNet.isEmpty(__record.fieldName || '')){
                            ids.push(__record.fieldName);
                            briefs.push(__record.brief);
                        }
                    }
                    if (ids.length > 0) {
                        additionalView.toolbar.$sendBtn.show();
                        additionalView.toolbar.$sendBtn.attr("fieldName", ids.join(iNet.splitChar));
                        additionalView.toolbar.$sendBtn.attr("brief", briefs.join(iNet.splitChar));
                    } else {
                        additionalView.toolbar.$sendBtn.hide();
                        additionalView.toolbar.$sendBtn.attr("fieldName", "");
                        additionalView.toolbar.$sendBtn.attr("brief", "");
                    }
                });

                this.$grid.on('loaded', function(record, editable) {
                    additionalView.toolbar.$sendBtn.hide();
                });

                this.$grid.on('save', function (data) {
                    var __data = data || {};
                    var __taskInfo = $taskFrame.getTaskDataIndex();
                    var __procedureID = ((((__taskInfo || {}).request || {}).requestData) || {}).procedureID || "";

                    if (iNet.isEmpty(__data.brief) || iNet.isEmpty(__procedureID)){
                        return;
                    }
                    __data.fieldName = 'file' + iNet.generateId().substring(0, 6);
                    __data.procedureID = __procedureID;
                    $.postJSON(url.create, __data, function (result) {
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
                    if (iNet.isEmpty(__data.brief)){
                        return;
                    }

                    this.update(__data);
                    this.commit();
                });
            };
        };
        var additionalView = new iNet.ui.itemview({
            id: "briefcase-additional",
            resource: resource,
            url: url,
            toolbar: additionalToolBar,
            dataContent: additionalDataContent,
            ajaxMaskId: 'ajax-mask',
            headerDetails: {
                subject: "briefcase-additional-subject-details",
                sender: "briefcase-additional-sender-details"
            }
        });
        additionalView.on('menuclick', function(){
            $taskFrame.setListTaskType('menu');
        });

        //PUBLISH FUNCTION ==========================================
        this.load = function(){
            additionalLoad();
        };
        this.setPageBack = function(page, showBackButton){
            parentPage = page;
            if (parentPage != null && showBackButton != false){
                additionalView.toolbar.$backBtn.show();
            } else {
                additionalView.toolbar.$backBtn.hide();
            }
        };
        this.setType = function(type){
            //type: full, min
            $('#'+ self.id + ' [data-id="item-view-control"].item-view').removeClass('full').addClass(type);
            //self.setMenuButton(type);
        };

        iNet.ui.xgate.BfAdditional.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.xgate.BfAdditional, iNet.ui.app.widget);
});
