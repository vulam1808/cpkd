// #PACKAGE: xgate-ui-procedure-attribute-service
// #MODULE: XGateProcedureAttributeService
$(function () {
    iNet.ns("iNet.ui.admin", "iNet.ui.admin.ProcedureAttribute");

    iNet.ui.admin.ProcedureAttribute = function () {
        this.id = 'procedure-attribute-widget';
        var self = this;
        var resource = {
            procedure: iNet.resources.xgate.admin.procedure,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            "view": iNet.getUrl('onegate/prodattr'),
            "update": iNet.getUrl('onegate/prodattr/update')
        };

        var $toolbar = {
            BACK: $('#procedure-attribute-btn-back')
        };

        var dataSource = new DataSource({
            columns: [
                {
                    property : 'code',
                    label : resource.procedure.attrCode,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'name',
                    label : resource.procedure.attrName,
                    sortable : true,
                    type: 'text'
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'procedure-attribute-grid',
            url: url.view,
            params: {
                procedure: ""
            },
            /*convertData: function (data) {
            },*/
            dataSource: dataSource,
            stretchHeight: false,
            editable: true,
            firstLoad: false,
            idProperty: 'id'
        });

        grid.on('click', function(record, editable) {
        });

        grid.on('loaded', function(){
        });

        grid.on('blur', function (action, control) {
            if (action == 'update') {
                grid.endEdit();
            } else {
                control.save();
            }
        });

        grid.on('update', function(data, odata) {
            var __data = grid.getParams() || {};
            __data.attribute = data.code;
            __data.name = data.name;
            $.postJSON(url.update, __data, function(result) {
                var __result = result || {};
                if(!iNet.isEmpty(__result.uuid)) {
                    grid.update(__result);
                    grid.commit();
                }
            },{
                mask: self.getMask(),
                msg: iNet.resources.ajaxLoading.processing
            });
        });

        this.setProcedure = function(procedure){
            grid.setParams({procedure: procedure || ""});
            grid.load();
        };

        $toolbar.BACK.on('click', function(){
            self.fireEvent('back');
        }.createDelegate(this));

        iNet.ui.admin.ProcedureAttribute.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.admin.ProcedureAttribute, iNet.ui.app.widget);
});
