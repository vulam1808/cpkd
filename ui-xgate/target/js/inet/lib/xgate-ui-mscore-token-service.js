// #PACKAGE: xgate-ui-mscore-token-service
// #MODULE: MsCoreTokenService
$(function () {
    iNet.ns("iNet.ui.admin", "iNet.ui.admin.Token");

    iNet.ui.admin.Token = function () {
        this.id = 'mscore-token-div';
        var self = this;
        var resource = {
            token: iNet.resources.xgate.admin.token,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            "SYNC": $('#mscore-token-sync-btn')
        };

        var url = {
            "sync": iNet.getUrl('mscore/firmtoken/sync'),
            "list": iNet.getUrl('mscore/firmtoken/list'),
            "update": iNet.getUrl('mscore/firmtoken/update')
        };

        var __fnSync = function(){
            $.postJSON(url.sync, {}, function(result){
                var __result = result || {};
                console.log(">>sync>>", __result);
            });
            grid.load();
        };


        var dataSource = new DataSource({
            columns: [
                {
                    property : 'firmID',
                    label : resource.token.firmID,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'firmName',
                    label : resource.token.firmName,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'name',
                    label : resource.token.name,
                    type: "text",
                    sortable : true
                },
                {
                    property : 'token',
                    label : resource.token.token,
                    type: "text",
                    sortable : true
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'mscore-token-grid',
            url: url.list,
            params: {},
            convertData: function (data) {
                var __data = data || {};
                return __data.items;
            },
            dataSource: dataSource,
            stretchHeight: false,
            editable: true,
            firstLoad: false,
            idProperty: 'uuid'
        });

        grid.on('click', function(record, editable) {
        });

        grid.on('update', function (newData, oldData) {
            var __data = iNet.apply(oldData, newData) || {};
            __data.tokenID = __data.uuid;
            $.postJSON(url.update, __data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    grid.update(__result);
                    grid.commit();
                    self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                } else {
                    self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                }
            }, {
                msg: iNet.resources.ajaxLoading.processing,
                mask: self.getMask()
            });
        });

        grid.on('blur', function (action, control) {
            if (action == 'update') {
                grid.endEdit();
            }
        });

        $toolbar.SYNC.on('click', function(){
            __fnSync();
        });

        __fnSync();
        iNet.ui.admin.Token.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.admin.Token, iNet.ui.app.widget);

    new iNet.ui.admin.Token().show();
});
