// #PACKAGE: iworkflow-ui-wf-graph-process-map-service
// #MODULE: WFGraphProcessMapService
$(function () {
    iNet.ns("iNet.ui.workflow", "iNet.ui.workflow.WFGraphProcessMap");

    iNet.ui.workflow.WFGraphProcessMap = function () {
        this.id = 'graph-process-map-div';
        console.log(">>>> C,E,D,V >>>> ", roleCreate, roleEdit, roleDelete, roleView);
        var __zone = iNet.zone;
        var __context = iNet.context;
        var processMap = [];
        var infoData = {};
        var self = this;
        var parentPage = null;

        var resource = {
            processmap: iNet.resources.workflow.processmap,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            BACK: $('#graph-process-map-back-btn'),
            SAVE: $('#graph-process-map-save-btn')
        };
        $toolbar.SAVE.hide();

        var url = {
            view: iNet.getUrl('cloud/workflow/process/list'), //zone
            create: iNet.getUrl('firmtask/process/assign'), //userAllowed //old service --> cloud/workflow/process/assign

            load_actor: iNet.getUrl('cloud/workflow/alias/list')
        };

        var $form = {
            uuid: $('#graph-process-map-uuid-txt'),
            name: $('#graph-process-map-name-txt'),
            brief: $('#graph-process-map-brief-txt')
        };

        var getDatasource = function(){
            return new DataSource({
                columns: [
                    {
                        property: 'map',
                        label: resource.processmap.map,
                        sortable: true,
                        type: 'checkbox',
                        width : 30
                    },
                    /*{
                        property: 'actor',
                        label: resource.processmap.actor,
                        sortable: true,
                        disabled : true,
                        type: 'text',
                        width : 150
                    },*/
                    {
                        property : 'name',
                        label : resource.processmap.name,
                        sortable : true,
                        disabled : true,
                        type: 'text',
                        width : 150
                    }
                ],
                delay: 250
            });
        };
        var dataSource = getDatasource();

        var grid = new iNet.ui.grid.Grid({
            id: 'graph-process-map-grid',
            url: url.load_actor,
            params: {zone: __zone, context: __context, pageSize: 10, pageNumber: 0},
            convertData: function (data) {
                var __data = data || {};
                //grid.setTotal(__data.total);
                var items = __data.items || [];
                $.each(items, function(i, row){
                    row.map = (processMap.indexOf(row.actor) >= 0);
                });
                return items;
            },
            dataSource: dataSource,
            stretchHeight: false,
            editable: roleEdit,
            firstLoad: false,
            idProperty: 'uuid'
        });

        grid.on('save', function (data) {
        });

        grid.on('update', function (newData, oldData) {
        });

        grid.on('blur', function (action, control) {
        });

        grid.on('selectionchange', function (sm, data) {
        });

        grid.on('change', function (oldata, newdata, colIndex, rowIndex) {
            var __data = iNet.apply(oldata, newdata);
            grid.update(__data);
            grid.commit();

            if (__data.map){
                processMap.push(__data.actor);
            } else {
                if (processMap.indexOf(__data.actor) >= 0) {
                    processMap.splice(processMap.indexOf(__data.actor), 1);
                }
            }

            onSave();
        });

        this.loadData = function (data, refresh) {
            if (iNet.isEmpty(refresh)){
                refresh = true;
            }

            var __data = data || {};
            infoData = __data;
            $form.uuid.val(__data.uuid || "");
            $form.name.val(__data.name || "");
            $form.brief.val(__data.brief || "");
            setMode();

            $.postJSON(url.view, {zone: __zone, context: __context}, function (result) {
                var __result = result || {};
                processMap = [];
                $.each(__result.items || [], function(i, item){
                    if (item.graphProcessUUID == __data.uuid){
                        processMap = item.actors || [];
                        return true; //break each
                    }
                });
                if (refresh){
                    grid.load();
                }
            });
        };
        this.setPageBack = function(page){
            parentPage = page;
        };
        var setMode = function() {
            FormService.disable($form.name);
            FormService.disable($form.brief);
        };

        // ************************************** EVENT
        var onSave = function () {
            var __data = {
                zone: __zone,
                context: __context,
                actor: processMap.join(iNet.splitChar),
                graph: $form.uuid.val(),
                service: ""
            };

            if(!iNet.isEmpty(infoData.uuid)) { __data.uuid = infoData.uuid; }

            var __url = (iNet.isEmpty(__data.uuid)) ? url.create : url.create;
            $.postJSON(__url, __data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    //self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                    //self.loadData(__result);
                } else {
                    self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                }
            }, {
                msg: iNet.resources.ajaxLoading.processing,
                mask: self.getMask()
            });
        };

        var onBack = function(){
            self.hide();
            parentPage.show();
        };

        $toolbar.BACK.on("click", onBack);
        $toolbar.SAVE.on("click", onSave);

        iNet.ui.workflow.WFGraphProcessMap.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.workflow.WFGraphProcessMap, iNet.ui.app.widget);
});
