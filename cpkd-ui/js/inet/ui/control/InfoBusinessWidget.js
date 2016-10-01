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
            tab_business_info: $('#tab-business-info'),
            tab_business_change_1: $('#tab-business-change1'),
            tab_business_change_2: $('#tab_business_change2')
        };

        var url = {
            update_capitalHomeBusiness: iNet.getUrl('ita/capital/update')
        };
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'homebusiness-detail-dialog';


        var loadInfo =  function(){

            FormService.displayContent($form.tab1,'show');
            var listView = new iNet.ui.ita.ViewInfoDetailWidget({
                id: "tab-business-info",
                idHomeBusiness: "queue-list-item-ui",
                statusType: url.update_capitalHomeBusiness,
                HomeBusiness: {nameBusiness:'sdasdsa223',address:'232 34343'}
            });
            //listView.setInfo({nameBusiness:'sdasdsa223',address:'232 34343'});

            FormService.displayContent($form.tab2,'show');
            var listView = new iNet.ui.ita.ViewInfoDetailWidget({
                id: "tab-business-change1",
                idHomeBusiness: "queue-list-item-ui",
                statusType: url.update_capitalHomeBusiness,
                HomeBusiness: {nameBusiness:'sdasdsa223',address:'232 342222343'}
            });

        };

        loadInfo();
        var me = this;









        iNet.ui.ita.InfoBusinessWidget.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.ita.InfoBusinessWidget, iNet.ui.app.widget,{
    });


});
