// #PACKAGE: xgate-ui-agency-service
// #MODULE: XGateAgencyService
$(function () {
    iNet.ns("iNet.ui.admin", "iNet.ui.admin.Agency");

    iNet.ui.admin.Agency = function () {
        this.id = 'agency-div';
        var self = this;
        var agency = {};
        var deleteName = null;
        var resource = {
            agency: iNet.resources.xgate.admin.agency,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            "LINK": $('#agency-link-btn'),
            "UNLINK": $('#agency-unlink-btn')
        };

        var url = {
            "available": iNet.getUrl('onegate/expwayavailable'),
            "accepted": iNet.getUrl('onegate/expwayaccepted'),
            "unaccepted": iNet.getUrl('onegate/expwayunaccepted'),
            "firms": iNet.getUrl('onegate/expwayfirms')
        };

        var $form = {
            
        };

        var loadFirms = function(){
            $.postJSON(url.firms, {}, function(result){
                var __result = result || {};
                console.log(">>firms>>", __result);

                var __items = __result.items || [];
                $('#agency-grid').find('[data-check-connected]').each(function(n, item){
                    var __organIdItem = $(item).attr("data-check-connected") || "";
                    var __isConnected = false;
                    if (!iNet.isEmpty(__organIdItem)) {
                        if (__items.length > 0) {
                            for (var i = 0; i <= __items.length - 1; i++) {
                                if (__items[i].organId == __organIdItem) {
                                    __isConnected = true;
                                    break;
                                }
                            }
                        }
                    }

                    if(__isConnected){
                        $(item).removeClass('icon-spinner icon-spin').addClass('icon-link');
                        $(item).css("color","#2700FF");
                    } else {
                        $(item).removeClass('icon-spinner icon-spin').addClass('icon-unlink');
                        $(item).css("color","#D60505");
                    }
                });
            });
        };

        var dataSource = new DataSource({
            columns: [
                {
                    property : 'organName',
                    label : resource.agency.organName,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'organAdd',
                    label : resource.agency.organAdd,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'email',
                    label : resource.agency.email,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'telephone',
                    label : resource.agency.telephone,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'fax',
                    label : resource.agency.fax,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'connected',
                    label : '<i class="icon-exchange icon-large"></i>',
                    sortable : true,
                    disabled : true,
                    width : 30
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'agency-grid',
            url: url.available,
            params: {},
            convertData: function (data) {
                var __data = data || {};
                for(var i = 0; i<(__data.elements || []).length; i++){
                    (__data.elements[i] || {}).connected = '<i data-check-connected="'+(__data.elements[i] || {}).organId+'" class="icon-spinner icon-spin icon-large" style="color: #4387f5;"></i>';
                }
                return __data.elements;
            },
            dataSource: dataSource,
            stretchHeight: false,
            editable: false,
            firstLoad: true,
            idProperty: 'uuid'
        });

        grid.on('click', function(record, editable) {
            agency = record;

            if ($('#agency-grid').find('[data-check-connected="'+record.organId+'"]').hasClass('icon-link')){
                $toolbar.LINK.hide();
                $toolbar.UNLINK.show();
            } else {
                $toolbar.LINK.show();
                $toolbar.UNLINK.hide();
            }
        });

        grid.on('loaded', function(){
            loadFirms();
        });

        $toolbar.LINK.on('click', function(){
            $.postJSON(url.accepted, agency, function(result){
                var __result = result || {};
                console.log(">>accepted>>", __result);
                if (CommonService.isSuccess(__result)){
                    $toolbar.LINK.hide();
                    $toolbar.UNLINK.hide();
                    grid.load();
                    self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                } else {
                    self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                }
            });
        });

        $toolbar.UNLINK.on('click', function(){
            $.postJSON(url.unaccepted, agency, function(result){
                var __result = result || {};
                console.log(">>unaccepted>>", __result);
                if (CommonService.isSuccess(__result)){
                    $toolbar.LINK.hide();
                    $toolbar.UNLINK.hide();
                    grid.load();
                    self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                } else {
                    self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                }
            });
        });

        iNet.ui.admin.Agency.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.admin.Agency, iNet.ui.app.widget);

    new iNet.ui.admin.Agency().show();
});
