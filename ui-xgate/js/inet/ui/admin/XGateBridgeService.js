// #PACKAGE: xgate-ui-bridge-service
// #MODULE: XGateBridgeService
$(function () {
    iNet.ns("iNet.ui.admin", "iNet.ui.admin.Bridge");

    iNet.ui.admin.Bridge = function () {
        this.id = 'bridge-div';
        var self = this;
        var deleteIds = null;
        var deleteName = null;
        var resource = {
            bridge: iNet.resources.xgate.admin.bridge,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            REGISTER: $('#bridge-register-btn'),
            PROFILE: $('#bridge-profile-btn')
        };

        var url = {
            register: iNet.getUrl('camel/bridge/register'),
            profile: iNet.getUrl('camel/endpoint/register'), //service old: onegate/expway/register
            regverify: iNet.getUrl('camel/bridge/regverify'),
            siteprofile : iNet.getUrl('system/siteprofile'),

            subfirm: iNet.getUrl('firmtask/subfirm/list')
        };

        var $form = {
            "info": $('#bridge-info'),
            "details": $('#bridge-details'),
            "firmList": $('#bridge-firm-list'),
            "service": $('#bridge-service-url'),
            "urlRefresh": $('#bridge-service-url-refresh'),

            name: $('#bridge-name'),
            industry: $('#bridge-industry'),
            brief: $('#bridge-brief'),
            email: $('#bridge-email'),
            phone: $('#bridge-phone'),
            website: $('#bridge-website'),
            fax: $('#bridge-fax'),
            address1: $('#bridge-address1'),
            organId: $('#bridge-organId'),
            profileID: $('#bridge-profileID')

        };
        $form.details.hide();
        $form.firmList.hide();

        $.postJSON(url.siteprofile, {}, function(result){
            var __result = result || {};

            if (CommonService.isSuccess(__result)){
                $form.name.val(__result.name || "");
                $form.industry.val(__result.industry || "");
                $form.brief.val(__result.brief || "");
                $form.email.val(__result.email || "");
                $form.phone.val(__result.phone || "");
                $form.website.val(__result.website || "");
                $form.fax.val(__result.fax || "");
                $form.address1.val(__result.address1 || "");
                $form.organId.val(__result.organiId || "");
                $form.profileID.val(__result.profileID || "");

                $form.details.show();

                $form.name.attr('readonly', true);
                $form.industry.attr('readonly', true);
                $form.brief.attr('readonly', true);
                $form.email.attr('readonly', true);
                $form.phone.attr('readonly', true);
                $form.website.attr('readonly', true);
                $form.fax.attr('readonly', true);
                $form.address1.attr('readonly', true);
                $form.organId.attr('readonly', true);
                $form.profileID.attr('readonly', true);
            }
        });

        var dataSource = new DataSource({
            columns: [
                {
                    property : 'organiId',
                    label : resource.bridge.organId,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'name',
                    label : resource.bridge.name,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'email',
                    label : resource.bridge.email,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'phone',
                    label : resource.bridge.phone,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'fax',
                    label : resource.bridge.fax,
                    sortable : true,
                    disabled: true
                },
                {
                    property : 'profileID',
                    label : resource.bridge.profileID,
                    sortable : true,
                    disabled: true
                }
            ],
            delay: 250
        });

        var grid = new iNet.ui.grid.Grid({
            id: 'bridge-firm-grid',
            url: url.subfirm,
            params: {},
            convertData: function (data) {
                var __data = data || {};
                if ((__data.items || []).length > 0) {
                    $form.firmList.show();
                } else {
                    $form.firmList.hide();
                }
                return __data.items;
            },
            dataSource: dataSource,
            stretchHeight: false,
            editable: false,
            firstLoad: true,
            idProperty: 'uuid'
        });

        $form.urlRefresh.on('click', function(){
            $form.service.val((location || {}).origin || "");
        });
        var loadAvailable = function(){
            $.postJSON(url.regverify, {}, function(result){
                var __result = result || {};
                if (CommonService.isSuccess(__result)){
                    $.each((__result.endpoints || []), function(i, item){
                        var url = document.createElement('a');
                        url.href = (item || {}).endpoint;
                        $form.service.val((url || {}).origin || "");
                    });
                    $form.info.removeClass('alert-danger').addClass('alert-info');
                    $form.info.text(resource.bridge.connected);
                    $toolbar.PROFILE.show();
                } else {
                    $form.info.removeClass('alert-info').addClass('alert-danger');
                    $form.info.text(resource.bridge.unconnect);
                    $toolbar.REGISTER.show();
                }
            },{
                mask: self.getMask(),
                msg: iNet.resources.ajaxLoading.loading
            });
        };
        loadAvailable();

        $toolbar.REGISTER.on('click', function(){
            $.postJSON(url.register, {serverUrl:$form.service.val()}, function(result){
                var __result = result || {};
                console.log(">>register>>", __result);
                if (CommonService.isSuccess(__result)){
                    var __infoData = '';
                    $.each(__result.elements || [], function(i, item){
                        __infoData += '<div' + ((item.status == "SUCCESS") ? '' : ' style="color: red;"') + '>' + resource.bridge.organId + ' [' + item.deliveryID + ']: ' + item.status + ' (' + item.reason + ')</div>';
                    });
                    self.notifySuccess(resource.constant.submit_title, String.format("{0}<br>{1}</br>",resource.constant.submit_success, __infoData));
                    grid.load();
                    $toolbar.PROFILE.show();
                } else {
                    self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                }
            },{
                mask: self.getMask(),
                msg: iNet.resources.ajaxLoading.loading
            });
        });
        $toolbar.PROFILE.on('click', function(){
            $.postJSON(url.profile, {serverUrl:$form.service.val()}, function(result){
                var __result = result || {};
                console.log(">>profile>>", __result);
                if (CommonService.isSuccess(__result)){
                    self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                    grid.load();
                } else {
                    self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                }
            },{
                mask: self.getMask(),
                msg: iNet.resources.ajaxLoading.loading
            });
        });

        iNet.ui.admin.Bridge.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.admin.Bridge, iNet.ui.app.widget);

    new iNet.ui.admin.Bridge().show();
});
