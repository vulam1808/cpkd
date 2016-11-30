// #PACKAGE: iworkflow-ui-wf-graph-process-service
// #MODULE: WFGraphProcessService
$(function () {
    iNet.ns("iNet.ui.workflow");

    iNet.ui.workflow.WFGraphProcess = function () {
        this.id = 'graph-process-div';
        console.log(">>>> C,E,D,V >>>> ", roleCreate, roleEdit, roleDelete, roleView);
        var __zone = iNet.zone;
        var __context = iNet.context;
        var self = this;
        var wgMap = null;
        var parentPage = null;
        var deleteIds = null;
        var deleteName = null;
        var selfData = {};
        var resource = {
            graphprocess: iNet.resources.workflow.graphprocess,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            BACK: $('#graph-process-back-btn'),
            PUBLISHED: $('#graph-process-published-btn'),
            ASSIGN: $('#graph-process-assign-btn'),
            MAP: $('#graph-process-map-btn')
        };

        var url = {
            view: iNet.getUrl('cloud/workflow/defproc/list'), //zone, version
            create: iNet.getUrl('cloud/workflow/defproc/create'),
            checkexists: iNet.getUrl('cloud/workflow/defproc/checkexists'),
            update: iNet.getUrl('cloud/workflow/defproc/update'),
            del: iNet.getUrl('cloud/workflow/defproc/delete'),
            published: iNet.getUrl('cloud/workflow/defproc/published'),
            assign: iNet.getUrl('firmtask/process/assign')
        };

        var confirmDialog = this.confirmDialog(
            iNet.resources.message.dialog_confirm_title, self.getNotifyContent(resource.constant.del_content, deleteName), function () {
                if (!iNet.isEmpty(deleteIds)) {
                    confirmDialog.hide();
                    var params = {
                        zone: __zone,
                        process: deleteIds
                    };
                    $.postJSON(url.del, params, function (result) {
                        var __result = result || {};
                        if (CommonService.isSuccess(__result)) {
                            var __arrays = deleteIds.split(",");
                            for (var i = 0; i < __arrays.length; i++) {
                                grid.remove(__arrays[i]);
                            }
                            deleteIds = null;
                            $toolbar.DELETE.hide();
                            self.notifySuccess(resource.constant.del_title, resource.constant.del_success);
                        } else {
                            self.notifyError(resource.constant.del_title, self.getNotifyContent(resource.constant.del_error, __result.errors || []));
                        }
                    }, {
                        mask: self.getMask(),
                        msg: iNet.resources.ajaxLoading.deleting
                    });
                }
            });

        var wfDesign = new iNet.ui.workflow.Workflow({id: "workflow-design-virtual", context: __context});

        //PUBLIC FUNCTION
        this.loadData = function(data){
            var __data = data || {};
            selfData = __data;
            wfDesign.loadGraph(__data);
            wfDesign.show();

            $toolbar.PUBLISHED.hide();
            $toolbar.ASSIGN.hide();
            $toolbar.MAP.hide();

            if (__data.version == "DESIGN"){
                $toolbar.PUBLISHED.show();
            }

            if (__data.version == "PRODUCTION"){
                $toolbar.ASSIGN.hide();//$toolbar.ASSIGN.show();
                $toolbar.MAP.show();
            }
        };
        this.createWorkflow = function(name){
            if (iNet.isEmpty(name)){
                onBack();
                return;
            }
            var __data = {};
            __data.zone = __zone;
            __data.context = __context;
            __data.context = __context;
            __data.type = "AUTOMATIC";
            __data.version = "DESIGN";
            __data.name = name;
            __data.brief = name;

            $.postJSON(url.checkexists, __data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    if (!iNet.isEmpty(__result.uuid)){
                        self.loadData(__result);
                    } else {
                        $.postJSON(url.create, __data, function (result) {
                            var __result = result || {};
                            if (CommonService.isSuccess(__result)) {
                                self.loadData(__result);
                                //self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                            } else {
                                onBack();
                                self.notifyError(resource.constant.summit_title, self.getNotifyContent(resource.constant.summit_error, __result.errors || []));
                            }
                        });
                    }
                } else {
                    onBack();
                    self.notifyError(resource.constant.summit_title, self.getNotifyContent(resource.constant.summit_error, __result.errors || []));
                }
            });




        };
        this.setPageBack = function(page){
            parentPage = page;
        };

        var onDelete = function () {
            confirmDialog.setContent(iNet.resources.message.dialog_confirm_selected_content);
            confirmDialog.show();
        };

        var onBack = function(){
            wfDesign.hide();
            self.hide();
            parentPage.show();

            this.fireEvent("finish");
        }.createDelegate(this);

        $toolbar.BACK.on("click", onBack);
        $toolbar.PUBLISHED.on('click', function(){
            var __data = selfData || {};
            if (!iNet.isEmpty(__data.uuid)){
                var __params = {graph: __data.uuid, zone: __data.zone};
                $.postJSON(url.published, __params, function (result) {
                    if (CommonService.isSuccess(result)){
                        self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                        $toolbar.PUBLISHED.hide();
                        $toolbar.ASSIGN.hide();//$toolbar.ASSIGN.show();
                        $toolbar.MAP.show();
                    } else {
                        self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, result.errors || []));
                    }
                }, {
                    msg: iNet.resources.ajaxLoading.loading,
                    mask: self.getMask()
                });
            }
        });
        $toolbar.ASSIGN.on('click', function(){
            var __data = selfData || {};
            if (!iNet.isEmpty(__data.uuid)){
                var __params = {graph: __data.uuid, zone: __data.zone, context: __context, userAllowed: true, actor: "nothing"};
                $.postJSON(url.assign, __params, function (result) {
                    if (CommonService.isSuccess(result)){
                        self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                    } else {
                        self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, result.errors || []));
                    }
                }, {
                    msg: iNet.resources.ajaxLoading.loading,
                    mask: self.getMask()
                });
            }
        });
        $toolbar.MAP.on('click', function(){
            var __data = selfData || {};
            if (!iNet.isEmpty(__data.uuid)){
                if (wgMap == null){
                    wgMap = new iNet.ui.workflow.WFGraphProcessMap();
                }
                wgMap.on("finish", function () {

                });
                wgMap.loadData(__data);
                wgMap.setPageBack(self);
                wgMap.show();
                self.hide();
            }
        });

        iNet.ui.workflow.WFGraphProcess.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.workflow.WFGraphProcess, iNet.ui.app.widget);
});
