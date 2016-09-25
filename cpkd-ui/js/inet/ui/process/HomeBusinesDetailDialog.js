/**
 * Created by HS on 23/09/2016.
 */
// #PACKAGE:homebusiness-detail-dialog
// #MODULE: HomeBusinessDetailDialog
$(function () {
    iNet.ns("iNet.ui","iNet.ui.ita");
    iNet.ui.ita.HomeBusinessDetailDialog = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'homebusiness-detail-dialog';
        iNet.ui.ita.HomeBusinessDetailDialog.superclass.constructor.call(this);
        //this.$element = $.getCmp(this.id);

    };


});

