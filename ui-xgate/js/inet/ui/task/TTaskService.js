// #PACKAGE: itask-ui-t-task-service
// #MODULE: TTaskService
$(function () {
    iNet.ns("iNet.ui.task", "iNet.ui.task.TTask");

    iNet.ui.task.TTask = function () {
        this.id = 'task-div';
        var self = this;
        this.taskData = {
            list: [],
            index: {}
        };

        var resource = {
            task: iNet.resources.task.task,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $taskMenu = iNet.getLayout().taskMenu;
        $taskMenu.on('menuchange', function () {
            console.log(">>>$taskMenu menuchange >>");
        });
        $taskMenu.on('create', function () {
            console.log(">>>$taskMenu create >>");
        });

        var url = {
            task_open: iNet.getUrl('firmtask/process/openlist'),//iNet.getUrl('firmtask/process/graphtask'),
            urgent_update: iNet.getUrl('onegate/record/urgent'),
            externaldata_update: iNet.getUrl('onegate/externaldata/update')
        };

        var $form = {
            iframeTask: $('#task-iframe')
        };

        $form.iframeTask.on('load', function () {
            if ((self.appLayout || "") == "iDesk") {
                console.log(">> iframeTask loaded >>");
                var $body = $form.iframeTask.get(0).contentWindow.document.body;
                var __htmlToolbar = '';
                __htmlToolbar += '<span style="padding-right: 5px;">';
                __htmlToolbar += '<button class="btn btn-warning hide" style="padding-right: 10px" data-action="iDeskTaskList">';
                __htmlToolbar += '<i class="icon-list"></i>';
                __htmlToolbar += '</button>';
                __htmlToolbar += '</span>';
                __htmlToolbar += '<button type="button" data-action="iDeskBack" class="btn btn-default">';
                __htmlToolbar += '<i class="icon-arrow-left"></i>';
                __htmlToolbar += '</button>';

                if (iNet.isEmpty(self.typeLayout || "")) {
                    __htmlToolbar += '<button type="button" data-action="iDeskAdd" class="btn btn-default" style="margin-left: 5px;">';
                    __htmlToolbar += '<i class="icon-plus"></i>';
                    __htmlToolbar += '</button>';

                    __htmlToolbar = String.format('<div style="min-height: 30px; padding: 5px; background-color: rgb(245, 245, 245); border-bottom: 1px solid rgb(229, 229, 229);">{0}</div>', __htmlToolbar);
                    $($body).prepend(__htmlToolbar);
                    self.searchWidget = $form.iframeTask.get(0).contentWindow.searchWidget;

                    $($body).find('[data-action="iDeskTaskList"]').on('click', function(){
                        console.log(">> iDeskTaskList >>");
                        self.setListTaskType('menu');
                    });
                    $($body).find('[data-action="iDeskBack"]').on('click', function(){
                        console.log(">> iDeskBack >>", self.href);
                        self.changeLayout(self.href);
                    });

                    $($body).find('[data-action="iDeskAdd"]').on('click', function(){
                        console.log(">> iDeskAdd >>", self.searchWidget.getData());
                        var __iDeskData = self.searchWidget.getData() || [];
                        var __params = {
                            task: self.taskInfo.taskId,
                            graph: self.taskInfo.graphId
                        };

                        $.each(__iDeskData, function(i, data){
                            __params.signNumber = data.id;
                            __params.subject = '[' + ((data.edSearchDto || {}).signNumber || "") + '] ' + ((data.edSearchDto || {}).subject || "");
                            $.postJSON(url.externaldata_update, __params, function (result) {
                                console.log(">>>>>>", result);
                            });

                            if (i == __iDeskData.length -1){
                                self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                                $($body).find('[data-action="iDeskBack"]').trigger('click');
                            }
                        });
                    });
                    self.on('typechange', function(type){
                        if (type == 'menu'){
                            $($body).find('[data-action="iDeskTaskList"]').show();
                        } else {
                            $($body).find('[data-action="iDeskTaskList"]').hide();
                        }
                    });
                } else {
                    $($body).find('#ed-view-widget .viewToolbar').append(__htmlToolbar);

                    $($body).find('[data-action="iDeskTaskList"]').on('click', function(){
                        console.log(">> iDeskTaskList >>");
                        self.setListTaskType('menu');
                    });
                    $($body).find('[data-action="iDeskBack"]').on('click', function(){
                        console.log(">> iDeskBack >>", self.href);
                        self.changeLayout(self.href);
                    });

                    self.on('typechange', function(type){
                        if (type == 'menu'){
                            $($body).find('[data-action="iDeskTaskList"]').show();
                        } else {
                            $($body).find('[data-action="iDeskTaskList"]').hide();
                        }
                    });
                }
            }
        });

        //LIST VIEW ===================================================
        var fnListSearch = function(){
            var __params = listView.getParams() || {};
            //__params['_requestData_procedureName'] = listView.basicSearch.$keyword.val();
            __params.keyword = listView.basicSearch.$keyword.val();

            __params.type = listView.advanceSearch.$type.getValue() || "";
            if ("inprocess" == __params.type){
                __params.type = "";
            }
            __params.warnHour = listView.advanceSearch.$warnHour.val() || -1;

            if (parseFloat(__params.warnHour) <= 0){
                delete __params.warnHour;
            }

            listView.setParams(__params);
            listView.load();
        };
        var basicSearch = function() {
            this.id = "task-list-basic-search";
            this.intComponent = function(){
                var $bs = this;
                var $expandBtn = $('#task-list-basic-search-expand-btn');
                var $searchBtn = $('#task-list-basic-search-search-btn');
                this.$keyword = $('#task-list-basic-search-txt-keyword');
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
            this.id = "task-list-advance-search";
            this.intComponent = function(){
                var $as = this;
                this.$warnHour = $('#task-list-advance-search-txt-warnHour');

                var typeSource = [
                    {id: "inprocess", code: "inprocess", name: resource.task.typeInprocess},
                    {id: "overdue", code: "overdue", name: resource.task.typeOverdue},
                    {id: "urgent", code: "urgent", name: resource.task.typeUrgent}
                ];
                this.$type = FormService.createSelect("task-list-advance-search-txt-type", typeSource, "id", 1, false, false);
                this.$type.setValue("inprocess");
                this.$type.on('change', function(){
                    if ($as.$type.getValue() == "urgent"){
                        $.postJSON(url.urgent_update, {}, function (result) {
                            console.log(">>>>>>", result);
                        });
                    }
                });

                var $searchBtn = $('#task-list-advance-search-search-btn');
                var $closeBtn = $('#task-list-advance-search-close-btn');

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
            this.id = "task-list-pull-left";
            this.intComponent = function(){
            };
        };
        var listView = new iNet.ui.listview({
            id: "task-list",
            uiItemId: "task-list-item-ui",
            url: url.task_open,
            basicSearch: basicSearch,
            advanceSearch: advanceSearch,
            pullLeft: pullLeft,
            params: {
                pageSize: 20,
                pageNumber: 0,
                warnHour: -1
            },
            convertData: function(data){
                var __data = data || {};
                self.taskData.list = __data.elements || [];
                listView.setTotal(self.taskData.list.length);
                $.each(self.taskData.list, function(i, item){
                    if (iNet.isEmpty(item.uuid)) {
                        item.uuid = item.history.uuid;
                    }
                    listView.addItem(item);
                });
            }
        });
        listView.on('indexchange', function(data){
            var __taskInfo = data || {};
            self.taskData.index = __taskInfo;
            var __screenView = (__taskInfo.history || {}).screenID || '';
            var __screenParam = '';//'?taskInfo=' + iNet.Base64.encodeObject(__taskInfo);
            var __screenUrl = iNet.getUrl('xgate/page/task/screen');
            if (!iNet.isEmpty(__screenView)) {
                //__screenParam += '?forward=' + __screenView + '&task=' + __taskInfo.uuid;
                if (FormService.checkPageExists(iNet.getUrl(__screenView))){
                    __screenUrl = iNet.getUrl(__screenView);
                }
            }
            self.changeLayout(__screenUrl);
            self.taskInfo = __taskInfo;
        });
        listView.on('typechange', function(type){
            $form.iframeTask.removeClass('full min');
            self.fireEvent('typechange', type);
            if (type == "max") {
                $form.iframeTask.addClass('min');
            } else {
                $form.iframeTask.addClass('full');
            }
        });

        $form.iframeTask.height($(iNet.getLayout().window).height() - 92);
        $(iNet.getLayout()).on('resize', function () {
            try {
                $form.iframeTask.height($(iNet.getLayout().window).height() - 92);
            } catch (e) {
            }
        });

        //OTHER ==============================================
        this.setListTaskType = function (type) {
            listView.setType('menu');
        };
        this.refresh = function () {
            listView.load();
        };
        this.getTaskDataIndex = function () {
            return this.taskData.index || {};
        };
        this.changeLayout = function (href, app, idDoc) {
            self.appLayout = app || "";
            self.typeLayout = idDoc || "";
            self.href = $form.iframeTask.get(0).contentWindow.location.href;
            if (!iNet.isEmpty(idDoc) && app == "iDesk") {
                href += '?id=' + idDoc;
            }
            $form.iframeTask.get(0).contentWindow.location.replace(href);
        };

        iNet.ui.task.TTask.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.task.TTask, iNet.ui.app.widget);

    taskFrame = new iNet.ui.task.TTask();
    taskFrame.show();
});
