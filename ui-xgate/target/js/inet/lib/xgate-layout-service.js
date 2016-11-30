// #PACKAGE: xgate-layout-service
// #MODULE: LayoutService
$(function () {
    iNet.ns("iNet.ui.xgate", "iNet.ui.task");
    if (iNet.isEmpty(iNet.fnGetUrl)){
        iNet.apply(iNet, {
            fnGetUrl: iNet.getUrl,
            getPath: function (relativePath) {
                return this.fnGetUrl(relativePath);
            },
            getUrl: function (relativePath, type) {
                if (relativePath == "system/account/role"){
                    if ((iNet.firmPrefix || "smartcloud") != "smartcloud"){
                        relativePath = "subfirm/account/list";
                    }
                }

                if (!iNet.isEmpty(type)){
                    return iNet.getPath(relativePath);
                } else {
                    return iNet.getPUrl(relativePath);
                }
            }
        });
    }

    taskMenu = new iNet.ui.task.Menu();

    xGate = new iNet.app.Application({
        title: applcationTitle,
        header: new iNet.ui.common.Header({
            title: headerTitle,
            iconCls: headerIcon,
            autoDetect: true
        }),
        menu: taskMenu,
        mask: {
            show: function() { $('#main-mask').show(); },
            hide: function() { $('#main-mask').hide(); },
            title: function(title) { $('#main-mask-title').text(title || "")},
            loading: function(object) { $('#main-mask-loading').text(object || ""); }
        }
    });

    xGate.on('hashchange', function(menuId, params){
        //taskMenu.openFolder(menuId , params[1]);
    });
});
