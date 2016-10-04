/**
 * Created by HS on 21/09/2016.
 */
// #PACKAGE: info-business
// #MODULE: InfoBusinessWidget

$(function() {


    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.InfoBusinessWidget = function (config) {
        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };
        var $form = {
            tab1: $('#tab1'),
            tab2: $('#tab2'),
            tab3: $('#tab3'),
            tab4: $('#tab4'),
            tab5: $('#tab5'),
            tab6: $('#tab6'),
            tab_business_info: $('#tab-business-info'),
            tab_business_change_1: $('#tab-business-change1'),
            tab_business_change_2: $('#tab_business_change2'),
            span_name:$('#social-group-modal-lbl-name')
        };

        var url = {
            update_capitalHomeBusiness: iNet.getUrl('ita/capital/update')
        };
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'homebusiness-detail-dialog';


        var loadInfo =  function(){
            if (CommonService.isSuccess(__config)) {
                console.log("infoBusinessWidget - Load Config",__config)
                $form.span_name.html('').append(__config.NameBusiness);
                var homeBusiness = __config.HomeBusiness || {};
                if(CommonService.isSuccess(homeBusiness))
                {
                    FormService.displayContent($form.tab1,'show');
                    var listView = new iNet.ui.ita.ViewInfoDetailWidget({
                        id: "tab-business-info",
                        statusType: "CAP_MOI",
                        HomeBusiness: homeBusiness
                    });
                }
                var changeBusiness1 = __config.ChangeBusiness1 || {};
                if(CommonService.isSuccess(changeBusiness1))
                {
                    FormService.displayContent($form.tab2,'show');
                    var listView = new iNet.ui.ita.ViewInfoDetailWidget({
                        id: "tab-business-change1",
                        statusType: "CAP_DOI",
                        HomeBusiness: changeBusiness1
                    });
                }
                var changeBusiness2 = __config.ChangeBusiness2 || {};
                if(CommonService.isSuccess(changeBusiness2))
                {
                    FormService.displayContent($form.tab3,'show');
                    var listView = new iNet.ui.ita.ViewInfoDetailWidget({
                        id: "tab-business-change2",
                        statusType: "CAP_DOI",
                        HomeBusiness: changeBusiness2
                    });
                }
                var changeBusiness3 = __config.ChangeBusiness3 || {};
                if(CommonService.isSuccess(changeBusiness3))
                {
                    FormService.displayContent($form.tab4,'show');
                    var listView = new iNet.ui.ita.ViewInfoDetailWidget({
                        id: "tab-business-change3",
                        statusType: "CAP_DOI",
                        HomeBusiness: changeBusiness3
                    });
                }
                var pauseBusiness = __config.pauseBusiness || {};
                if(CommonService.isSuccess(pauseBusiness))
                {
                    FormService.displayContent($form.tab5,'show');
                    var listView = new iNet.ui.ita.ViewInfoDetailWidget({
                        id: "tab-business-pause",
                        statusType: "TAM_NGUNG",
                        HomeBusiness: pauseBusiness

                    });
                }
                var endBusiness = __config.pauseBusiness || {};
                if(CommonService.isSuccess(endBusiness))
                {
                    FormService.displayContent($form.tab6,'show');
                    var listView = new iNet.ui.ita.ViewInfoDetailWidget({
                        id: "tab-business-end",
                        statusType: "CHAM_DUT",
                        HomeBusiness: endBusiness
                    });
                }
            }
        };

        loadInfo();
        var me = this;
        iNet.ui.ita.InfoBusinessWidget.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.ita.InfoBusinessWidget, iNet.ui.app.widget,{
    });


});
