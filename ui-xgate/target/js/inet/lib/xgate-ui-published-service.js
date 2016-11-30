// #PACKAGE: xgate-ui-published-service
// #MODULE: XGatePublishedService
$(function () {
    iNet.ns("iNet.ui.admin", "iNet.ui.admin.Published");

    iNet.ui.admin.Published = function () {
        this.id = 'published-div';
        var self = this;
        var selfData = {};
        var parentPage = null;
        var __zone = iNet.zone;
        var __context = iNet.context;
        var wgPage = null;
        var wgWorkflow = null;

        var resource = {
            published: iNet.resources.xgate.admin.published,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            BACK: $('#published-back-btn'),
            SUBMIT: $('#published-submit-btn'),
            CREATE_PAGE: $('#published-create-page-btn'),
            CREATE_WORKFLOW: $('#published-create-workflow-btn')
        };

        var url = {
            view_page: iNet.getUrl('design/page/list'),
            view_plugin: iNet.getUrl('onegate/plugin/list'),
            view_application: iNet.getUrl('onegate/deptapplication/list', 'smartcloud'),
            view_workflow: iNet.getUrl('cloud/workflow/defproc/list'),
            view_procedure: iNet.getUrl('onegate/procedure/maplist'), //old service onegate/prodlist

            attach_xgate: iNet.getUrl('onegate/taskuiattach'), //page, procedure, graph, graphInput, application
            attach_expway: iNet.getUrl('onegate/formattach'), //page, procedure
            attach: ""
        };

        var $form = {
            navListItems: $('ul.setup-panel li a'),
            allWells: $('.setup-content'),

            page: $('#published-page-selected'),
            workflow: $('#published-workflow-selected'),
            procedure: $('#published-procedure-selected'),
            plugin: $('#published-plugin-selected'),
            application: $('#published-application-selected')
        };
        $form.allWells.hide();

        $form.navListItems.on('click', function(e) {
            e.preventDefault();
            var $target = $($(this).attr('href'));
            var $button = $($(this).attr('button'));
            var $item = $(this).closest('li');

            $('button[data-handler="tabChange"]').hide();

            if (!$item.hasClass('disabled')) {
                $form.navListItems.closest('li').removeClass('active');
                $item.addClass('active');
                $form.allWells.hide();
                $target.show();
                $button.show();
            }
        });

        var showSubmit = function(){
            if (!iNet.isEmpty(selfData.page) && !iNet.isEmpty(selfData.procedure) && ((selfData.published == "expway") || (!iNet.isEmpty(selfData.workflow) /*&& !iNet.isEmpty(selfData.plugin)*/))){
                $toolbar.SUBMIT.show();
            } else {
                $toolbar.SUBMIT.hide();
            }
        };

        var dsApplication = new DataSource({
            columns: [
                {
                    property: 'application',
                    label: resource.published.applicationName,
                    sortable: true,
                    disabled: true
                },
                {
                    property: 'brief',
                    label: resource.published.applicationBrief,
                    sortable: true,
                    disabled: true
                }
            ]
        });

        var gridApplication = new iNet.ui.grid.Grid({
            id: 'published-application-grid',
            url: url.view_application,
            params: {
                status: "PUBLISHED"
            },
            convertData: function (data) {
                var __data = data || {};
                var items = __data.items || [];
                return items;
            },
            dataSource: dsApplication,
            stretchHeight: false,
            remotePaging: false,
            editable: false,
            firstLoad: true,
            idProperty: 'uuid'
        });

        gridApplication.on('click', function(record, editable) {
            $form.application.text(record.application + ' ['+record.brief+']');
            selfData.application = record.application;
            showSubmit();
        });

        var dsProcedure = new DataSource({
            columns: [
                {
                    property: 'subject',
                    label: resource.published.procedureSubject,
                    sortable: true,
                    disabled: true
                },
                {
                    property: 'industry',
                    label: resource.published.procedureIndustry,
                    sortable: true,
                    disabled: true
                },
                {
                    property: 'formUI',
                    label: resource.published.procedureFormUI,
                    type: "checkbox",
                    sortable: true,
                    disabled: true
                }
            ]
        });

        var gridProcedure = new iNet.ui.grid.Grid({
            id: 'published-procedure-grid',
            url: url.view_procedure,
            params: {},
            convertData: function (data) {
                var __data = data || {};
                var items = __data.elements || [];
                return items;
            },
            dataSource: dsProcedure,
            stretchHeight: false,
            remotePaging: false,
            editable: false,
            firstLoad: true,
            idProperty: 'uuid'
        });

        gridProcedure.on('click', function(record, editable) {
            $form.procedure.text(record.subject);
            selfData.procedure = record.uuid;
            showSubmit();
        });

        var dsWorkflow = new DataSource({
            columns: [
                {
                    property: 'name',
                    label: resource.published.workflowName,
                    sortable: true,
                    disabled: true
                }
            ]
        });

        var gridWorkflow = new iNet.ui.grid.Grid({
            id: 'published-workflow-grid',
            url: url.view_workflow,
            params: {zone: __zone, context: __context, version: "PRODUCTION"},
            convertData: function (data) {
                var __data = data || {};
                var items = __data.items || [];
                return items;
            },
            dataSource: dsWorkflow,
            stretchHeight: false,
            remotePaging: false,
            editable: false,
            firstLoad: true,
            idProperty: 'uuid'
        });

        gridWorkflow.on('click', function(record, editable) {
            $form.workflow.text(record.name);
            selfData.workflow = record.uuid;
            showSubmit();
        });

        var dsPage = new DataSource({
            columns: [
                {
                    property: 'name',
                    label: resource.published.pageName,
                    sortable: true,
                    disabled: true
                }
            ]
        });

        var gridPage = new iNet.ui.grid.Grid({
            id: 'published-page-grid',
            url: url.view_page,
            params: {zone: __zone, context: __context},
            convertData: function (data) {
                var __data = data || {};
                var items = __data.items || [];
                return items;
            },
            dataSource: dsPage,
            stretchHeight: false,
            remotePaging: false,
            editable: false,
            firstLoad: true,
            idProperty: 'uuid'
        });

        gridPage.on('click', function(record, editable) {
            $form.page.text(record.name);
            selfData.page = record.uuid;
            showSubmit();
        });

        this.setPageBack = function(page){
            parentPage = page;
        };
        this.setData = function(data){
            selfData = {};
            var __data = data || {};
            selfData.type = __data.type;

            $toolbar.SUBMIT.hide();

            $form.page.text("");
            $form.page.parent().parent().parent().removeClass('disabled');
            $form.workflow.text("");
            $form.workflow.parent().parent().parent().removeClass('disabled');
            $form.procedure.text("");
            $form.procedure.parent().parent().parent().removeClass('disabled');
            $form.plugin.text("");
            $form.plugin.parent().parent().parent().removeClass('disabled');
            $form.application.text("");
            $form.application.parent().parent().parent().removeClass('disabled');

            switch (selfData.type || ""){
                case "page":
                    $form.page.text(data.name || "");
                    selfData.page = (data.uuid || "");
                    $form.page.parent().parent().parent().addClass('disabled');
                    break;

                case "workflow":
                    $form.workflow.text(data.name || "");
                    selfData.workflow = (data.uuid || "");
                    $form.workflow.parent().parent().parent().addClass('disabled');
                    break;

                case "procedure":
                    $form.procedure.text(data.name || "");
                    selfData.procedure = (data.uuid || "");
                    $form.procedure.parent().parent().parent().addClass('disabled');
                    break;

                case "plugin":
                    $form.plugin.text(data.name || "");
                    selfData.plugin = (data.uuid || "");
                    $form.plugin.parent().parent().parent().addClass('disabled');
                    break;
            }

            selfData.published = __data.published;
            switch (selfData.published || ""){
                case "expway":
                    url.attach = url.attach_expway;
                    $('ul.setup-panel li').each(function(i, li){
                        $(li).removeClass('hide span3 span4 span6').addClass('span6');

                        if(i > 1) {
                            $(li).addClass('hide');
                        }
                    });
                    break;
                case "xgate":
                    url.attach = url.attach_xgate;
                    $('ul.setup-panel li').each(function(i, li){
                        $(li).removeClass('hide span3 span4 span6').addClass('span3');

                        if(i > 3) {
                            $(li).addClass('hide');
                        }
                    });
                    break;
            }

            $('ul.setup-panel li[first] a').trigger('click');
        };

        var onBack = function () {
            if (parentPage != null){
                self.hide();
                parentPage.show();
            }
            self.fireEvent('back');
        }.createDelegate(this);

        var onAttach = function(){
            if (!iNet.isEmpty(selfData.page) && !iNet.isEmpty(selfData.workflow) && /*!iNet.isEmpty(selfData.plugin) &&*/ !iNet.isEmpty(selfData.procedure)){
                var __params = {
                    page: selfData.page,
                    procedure: selfData.procedure,
                    graph: selfData.workflow,
                    application: selfData.application
                    /*,graphInput: selfData.plugin*/
                };
                $.postJSON(url.attach, __params, function (result) {
                    var __result = result || {};
                    console.log(">> attach >>", __params, __result);
                    if (CommonService.isSuccess(__result)) {
                        self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                    } else {
                        self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                    }
                }, {
                    msg: iNet.resources.ajaxLoading.processing,
                    mask: self.getMask()
                });
            }
            else {
            }
        };

        $toolbar.BACK.on("click", onBack);
        $toolbar.SUBMIT.on("click", onAttach);
        $toolbar.CREATE_PAGE.on("click", function () {
            if (!iNet.isEmpty($form.procedure.text())){
                if (wgPage == null){
                    wgPage = new iNet.ui.builder.TPage();
                }
                wgPage.createPage($form.procedure.text());
                wgPage.setPageBack(self);
                wgPage.on('finish', function(data){
                    gridPage.load();
                });
                wgPage.show();
                self.hide();
            }
        });
        $toolbar.CREATE_WORKFLOW.on("click", function () {
            if (!iNet.isEmpty($form.procedure.text())){
                if (wgWorkflow == null){
                    wgWorkflow = new iNet.ui.workflow.WFGraphProcess();
                }
                wgWorkflow.createWorkflow($form.procedure.text());
                wgWorkflow.setPageBack(self);
                wgWorkflow.on('finish', function(data){
                    gridWorkflow.load();
                });
                wgWorkflow.show();
                self.hide();
            }
        });

        iNet.ui.admin.Published.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.admin.Published, iNet.ui.app.widget);
});
