// #PACKAGE: iworkflow-ui-wf-actor-map-service
// #MODULE: WFActorMapService
$(function () {
    iNet.ns("iNet.ui.workflow", "iNet.ui.workflow.WFActorMap");

    iNet.ui.workflow.WFActorMap = function () {
        this.id = 'actor-map-div';
        console.log(">>>> C,E,D,V >>>> ", roleCreate, roleEdit, roleDelete, roleView);
        var __zone = iNet.zone;
        var __context = iNet.context;

        var actorMap = [];
        var infoData = {};
        var self = this;
        var parentPage = null;
        var isRefresh = false;

        var resource = {
            actormap: iNet.resources.workflow.actormap,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            BACK: $('#actor-map-back-btn'),
            CREATE: $('#actor-map-create-btn'),
            SAVE: $('#actor-map-save-btn'),
            DELETE: $('#actor-map-delete-btn')
        };
        $toolbar.DELETE.hide();
        $toolbar.CREATE.hide();
        $toolbar.SAVE.hide();

        var $form = {
            actor: $('#actor-map-actor-txt'),
            name: $('#actor-map-name-txt'),
            list: $('#actor-map-list'),
            user: $('#actor-map-user')
        };

        var url = {
            view: iNet.getUrl('firmtask/actormap/list'), //zone, context
            create: iNet.getUrl('firmtask/actormap/create'),//actor,name,zone,context,username
            update: iNet.getUrl('firmtask/actormap/update'),
            del: iNet.getUrl('firmtask/actormap/delete'),
            load_user: iNet.getUrl('system/account/role')
        };

        this.loadData = function(data, refresh){
            if (iNet.isEmpty(refresh)){
                refresh = true;
            }

            var __data = data || {};
            infoData = __data;
            $form.actor.val(__data.actor || "");
            $form.name.val(__data.name || "");
            actorMap = __data.members || [];
            if (refresh){
                grid.load();
            }
            setMode(__data);
        };
        this.setPageBack = function(page){
            parentPage = page;
        };
        var setMode = function(data){
            if (iNet.isEmpty(data.uuid)){
                FormService.enable($form.actor);
                FormService.enable($form.name);
            } else {
                FormService.disable($form.actor);
                FormService.disable($form.name);
            }
        };

        var getDatasource = function(){
            return new DataSource({
                columns: [
                    {
                        property : 'map',
                        label : resource.actormap.map,
                        sortable : true,
                        type: 'checkbox',
                        width : 30
                    },
                    {
                        property: 'username',
                        label: resource.actormap.username,
                        sortable: true,
                        disabled : true,
                        type: 'text',
                        width : 150
                    },
                    {
                        property: 'fullname',
                        label: resource.actormap.fullname,
                        sortable: true,
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
            id: 'actor-map-grid',
            url: url.load_user,
            params: {},
            convertData: function (data) {
                var __data = data || {};
                //grid.setTotal(__data.total);
                var items = __data.items || [];
                $.each(items, function (i, item) {
                    item.map = (actorMap.indexOf(item.username) >= 0);
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

            console.log(">> grid change >>", __data.map, __data.username, actorMap);
            if (__data.map){
                actorMap.push(__data.username);
            } else {
                if (actorMap.indexOf(__data.username) >= 0) {
                    actorMap.splice(actorMap.indexOf(__data.username), 1);
                }
            }

            onSave();
        });

        // ************************************** EVENT
        var onCreate = function () {
            self.loadData({});
        };

        var onSave = function () {
            var __data = {
                zone: __zone,
                context: __context,
                member: actorMap.join(iNet.splitChar),
                actor: $form.actor.val(),
                name: $form.name.val()
            };
            if(!iNet.isEmpty(infoData.uuid)) { __data.uuid = infoData.uuid; }

            if (iNet.isEmpty(__data.actor)){
                self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.validate.is_not_blank, resource.actormap.actor));
                return;
            }

            var __url = (iNet.isEmpty(__data.uuid)) ? url.create : url.create;
            $.postJSON(__url, __data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    isRefresh = true;
                    //self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                    //self.loadData(__result, false);
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
            if (isRefresh) {
                this.fireEvent("finish");
            }
        }.createDelegate(this);

        $toolbar.BACK.on("click", onBack);
        $toolbar.CREATE.on("click", onCreate);
        //$toolbar.SAVE.on("click", onSave);

        iNet.ui.workflow.WFActorMap.superclass.constructor.call(this);
    }

    iNet.extend(iNet.ui.workflow.WFActorMap, iNet.ui.app.widget);
});
