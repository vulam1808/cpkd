// #PACKAGE: itask-ui-t-record-service
// #MODULE: TRecord
$(function () {
    iNet.ns("iNet.ui.task", "iNet.ui.task.TRecord");
    iNet.ui.task.TRecord = function () {
        this.id = 'record-home-div';
        var self = this;
        var wgBriefcase = null;
        var wgQueue = null;

        iNet.ui.task.TRecord.superclass.constructor.call(this);

        var resource = {
            record: iNet.resources.receiver.record,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            recordsearch: iNet.getUrl('onegate/deptrecord/search'),

            checkAdditional: iNet.getUrl('onegate/externaldata/reqload'),
            checkUpdate: iNet.getUrl('onegate/deptrecord/load') //request firmtask/process/reqload
        };

        var $button = {
            printFormNo03: $('#record-home-print-form-no03-btn'),
            printFormNo04: $('#record-home-print-form-no04-btn')
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
        var createRequest = function () {
            if (wgRequest == null){
                wgRequest = new iNet.ui.task.TRequest();
            }

            wgRequest.on('finish', function(data){
                self.show();
                wgRequest.hide();
                if (!iNet.isEmpty(data)){
                    $taskMenu.refresh('record');
                    grid.load();
                }
            });
            wgRequest.setData({});
            wgRequest.show();
            self.hide();
        };

        var openRequest = function(data){
            var __data = data || {};
            var __pageParams = "";
            var __pageRequest = "";
            var __pageHashtag = "";
            var __pageParams = {};

            switch (__data.statusDrilldown || ""){
                case "CREATED":
                    __pageParams+= "?queueID=" + __data.idDrilldown;
                    __pageRequest = iNet.getUrl(CommonService.pageRequest.created);
                    __pageParams = {queueID: __data.idDrilldown, briefcaseStatus: __data.statusDrilldown};
                    break;
                case "UPDATE":
                case "INPROCESS":
                    __pageParams+= "?recordID=" + __data.idDrilldown;
                    __pageRequest = iNet.getUrl(CommonService.pageRequest.inprocess);
                    __pageParams = {recordID: __data.idDrilldown, briefcaseStatus: __data.statusDrilldown};
                    break;
                case "REJECTED":
                    __pageParams+= "?recordID=" + __data.idDrilldown;
                    __pageRequest = iNet.getUrl(CommonService.pageRequest.rejected);
                    __pageParams = {recordID: __data.idDrilldown, briefcaseStatus: __data.statusDrilldown};
                    break;
                case "PUBLISHED":
                    __pageParams+= "?recordID=" + __data.idDrilldown;
                    __pageRequest = iNet.getUrl(CommonService.pageRequest.published);
                    __pageParams = {recordID: __data.idDrilldown, briefcaseStatus: __data.statusDrilldown};
                    break;
                case "COMPLETED":
                    __pageParams+= "?recordID=" + __data.idDrilldown;
                    __pageRequest = iNet.getUrl(CommonService.pageRequest.completed);
                    __pageParams = {recordID: __data.idDrilldown, briefcaseStatus: __data.statusDrilldown};
                    break;
                case "ADDITIONAL":
                    __pageParams+= "?targetID=" + __data.idDrilldown;
                    __pageRequest = iNet.getUrl(CommonService.pageRequest.additional);
                    break;
                default :
                    __pageHashtag = "";
                    break;
            }

            if (!iNet.isEmpty(__pageParams.briefcaseStatus)){
                if (__pageParams.briefcaseStatus == "CREATED"){
                    if (wgQueue == null){
                        wgQueue = new iNet.ui.task.TQueue(__pageParams);
                        wgQueue.on('back', function(){
                            grid.load();
                            wgQueue.hide();
                            self.show();
                        });
                    } else {
                        wgQueue.setData(__pageParams);
                    }

                    wgQueue.show();
                } else {
                    if (wgBriefcase == null){
                        wgBriefcase = new iNet.ui.task.TBriefcase(__pageParams);
                        wgBriefcase.on('back', function(){
                            grid.load();
                            wgBriefcase.hide();
                            self.show();
                        });
                    } else {
                        wgBriefcase.setData(__pageParams);
                    }

                    wgBriefcase.show();
                }

                self.hide();
            }


            //console.log(">>openRequest>>", {pageRequest: __pageRequest, dataRequest: __data});

            /*if (!iNet.isEmpty(__pageRequest)){
                if (!iNet.isEmpty(__pageParams)){
                    __pageRequest = __pageRequest + __pageParams;
                }

                if (!iNet.isEmpty(__pageHashtag)){
                    __pageRequest = __pageRequest + __pageHashtag;
                }

                iNet.getLayout().$iframe.attr('src', __pageRequest);
            }*/
        };

        var dataSource = new DataSource({
            columns: [
                /*{
                    property: 'procedureName',
                    label : resource.record.procedureName,
                    sortable : true,
                    disabled: true
                },*/
                {
                    property : 'subject',
                    label : resource.record.subject,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'fullName',
                    label : resource.record.fullName,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'serialNo',
                    label : resource.record.serialNo,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'receiptNo',
                    label : resource.record.receiptNo,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'recordBook',
                    label : resource.record.recordBook,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'recordOrder',
                    label : resource.record.recordOrder,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'statusName',
                    label : resource.record.status,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'created',
                    label : resource.record.created,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'appointment',
                    label : resource.record.appointment,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'completed',
                    label : resource.record.completed,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'additional',
                    label : '<i class="icon-plus-sign icon-large" title="'+resource.record.additional+'"></i>',
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'update',
                    label : '<i class="icon-edit-sign icon-large" title="'+resource.record.update+'"></i>',
                    sortable : true,
                    disabled: true
                },
                {
                    label: '',
                    type: 'action',
                    width: 32,
                    align: 'center',
                    buttons: [
                        {
                            text: iNet.resources.message.button.view,
                            icon: 'icon-eye-open',
                            labelCls: 'label label-success',
                            fn: function (record) {
                                openRequest(record);
                            }
                        }
                    ]
                }
            ],
            delay: 250
        });

        var BasicSearch = function () {
            this.id = "record-home-basic-search";
            this.url = url.recordsearch;
        };
        iNet.extend(BasicSearch, iNet.Component,{
            intComponent : function(){
                this.$keyword = $('#record-home-basic-search-txt');
            },
            getId : function() {
                return this.id;
            },
            getUrl: function() {
                return this.url;
            },
            getData: function() {
                return {
                    keyword: this.$keyword.val(),
                    pageNumber: 0,
                    pageSize: 10
                };
            }
        });

        var AdvanceSearch = function () {
            this.id = "record-home-advance-search";
            this.url = url.recordsearch;
        };
        iNet.extend(AdvanceSearch, iNet.Component,{
            intComponent : function(){
                this.$serialNo = $('#record-home-advance-search-serialNo');
                this.$receiptNo = $('#record-home-advance-search-receiptNo');
                this.$status = $('#record-home-advance-search-status');
                this.$type = $('#record-home-advance-search-type');
            },
            getId : function() {
                return this.id;
            },
            getUrl: function() {
                return this.url;
            },
            getData: function() {
                return {
                    serial: this.$serialNo.val(),
                    receipt: this.$receiptNo.val(),
                    status: this.$status.val(),
                    type: this.$type.val(),
                    pageNumber: 0,
                    pageSize: 10
                };
            }
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'record-home-grid',
            url: url.recordsearch,
            basicSearch: BasicSearch,
            advanceSearch: AdvanceSearch,
            convertData: function (data) {
                var __data = data || {};
                grid.setTotal(__data.total);
                $.each(__data.items, function(i, item){
                    item.statusDrilldown = item.status;
                    item.idDrilldown = item.uuid;

                    if (item.status == "CREATED"){
                        item.idDrilldown = item.requestID;
                    }

                    item.statusName = resource.record["status"+item.status] || "";
                    item.created = (item.created>0)? new Date(item.created).format('H:i d/m/Y') : "";
                    item.appointment = (item.appointment>0)?
                        ((
                        (new Date().getTime() > item.appointment && item.completed==0) ||
                        (item.completed > item.appointment)
                        ) ?
                        '<label style="color: #ff0511;font-weight: bolder;">'+new Date(item.appointment).format('H:i d/m/Y')+'</label>' :
                        '<label style="color:#0000C0;font-weight: bolder;">'+new Date(item.appointment).format('H:i d/m/Y')+'</label>') : "";

                    item.completed = (item.completed>0)? new Date(item.completed).format('H:i d/m/Y') : "";

                    item.additional = '<i data-check-additional="'+item.additionalID+'" data-idDrilldown="'+item.additionalID+'" class="icon-spinner icon-spin icon-large" style="color: #4387f5;"></i>';
                    item.update = '<i data-check-update="'+item.requestID+'" data-idDrilldown="'+item.idDrilldown+'" class="icon-spinner icon-spin icon-large" style="color: #4387f5;"></i>';
                });
                return __data.items;
            },
            remotePaging: true,
            dataSource: dataSource,
            stretchHeight: false,
            editable: false,
            firstLoad: true,
            idProperty: 'uuid'
        });
        grid.on('click', function(record, editable) {
             self.recordData = record || {};
            $button.printFormNo03.show();
            $button.printFormNo04.show();
        });
        grid.on('loaded', function(record, editable) {
            $button.printFormNo03.hide();
            $button.printFormNo04.hide();

            $('#record-home-grid').find('i.icon-spinner.icon-spin.icon-large').each(function(i, item){
                var __additionalId = $(item).attr('data-check-additional') || "";
                var __idDrilldown = $(item).attr('data-idDrilldown') || "";
                if (!iNet.isEmpty(__additionalId)){
                    $.postJSON(url.checkAdditional, {"packageID": __additionalId}, function (result) {
                        if(!iNet.isEmpty((result || {}).uuid || "")){
                            $(item).removeClass('icon-spinner icon-spin').addClass('icon-tags');
                            $(item).attr('title', resource.record.additional);
                            $(item).css("color","#2700FF");
                            $(item).on('click', function(e){
                                openRequest({statusDrilldown: "ADDITIONAL", idDrilldown: __idDrilldown});
                            });
                        } else {
                            $(item).removeClass('icon-spinner icon-spin');//.addClass('icon-tags icon-spin');
                            $(item).css("color","#D60505");
                        }
                    });
                }

                var __requestId = $(item).attr('data-check-update') || "";
                if (!iNet.isEmpty(__requestId)){
                    $.postJSON(url.checkUpdate, {"request": __requestId}, function (result) {
                        var __isUpdate = ((((result || {}).request || {}).status || "") == "UPDATE");
                        if(__isUpdate){
                            $(item).removeClass('icon-spinner icon-spin').addClass('icon-pencil');
                            $(item).attr('title', resource.record.update);
                            $(item).css("color","#2700FF");
                            $(item).on('click', function(e){
                                openRequest({statusDrilldown: "UPDATE", idDrilldown: __idDrilldown});
                            });
                        } else {
                            $(item).removeClass('icon-spinner icon-spin');//.addClass('icon-tags icon-spin');
                            $(item).css("color","#D60505");
                        }
                    });
                }
            });
        });

        $button.printFormNo03.on('click', function(){
            var __requestID = (self.recordData || {}).requestID || "";
            if (!iNet.isEmpty(__requestID)){
                window.open(iNet.getUrl(CommonService.pageRequest.formNo03) + '?task=' + __requestID, '_blank');
            }
        });
        $button.printFormNo04.on('click', function(){
            var __requestID = (self.recordData || {}).requestID || "";
            if (!iNet.isEmpty(__requestID)){
                window.open(iNet.getUrl(CommonService.pageRequest.formNo04) + '?task=' + __requestID, '_blank');
            }
        });
    };

    iNet.extend(iNet.ui.task.TRecord, iNet.ui.app.widget);

    new iNet.ui.task.TRecord().show();
});
