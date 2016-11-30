// #PACKAGE: xgate-ui-receiver-list-service
// #MODULE: ReceiverList
$(function () {
    iNet.ns("iNet.ui.admin", "iNet.ui.admin.ReceiverList");

    iNet.ui.admin.ReceiverList = function () {
        this.id = 'receiver-list-div';

        var self = this;

        var resource = {
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            SAVE: $('#receiver-list-btn-save')
        };

        var $form = {
            group: $('#group-name'),
            user: $('#group-user')
        };

        var url = {
            create: iNet.getUrl('glbgate/receivergroup/create')
        };

        $toolbar.SAVE.on('click', function(){
            var __params = {
                group: $form.group.val(),
                user: $form.user.val()
            };
            $.postJSON(url.create, __params, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    $form.group.val('');
                    $form.user.val('');
                    self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                } else {
                    self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                }
            }, {
                msg: iNet.resources.ajaxLoading.processing,
                mask: self.getMask()
            });
        });

        iNet.ui.admin.ReceiverList.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.admin.ReceiverList, iNet.ui.app.widget);

    var widget = new iNet.ui.admin.ReceiverList();
    widget.show();
});
