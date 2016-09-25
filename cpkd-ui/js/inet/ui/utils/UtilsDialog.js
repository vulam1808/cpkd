// #PACKAGE:cpkd-dialog
// #MODULE: UtilsDialog
$(function () {
  iNet.ns("iNet.ui", "iNet.ui.ita");
  iNet.ui.ita.UtilsDialog = function (config) {
    var __config = config || {};
    iNet.apply(this, __config);// apply configuration
    this.id = this.id || __config['id'];
    console.log('__config.id>>', __config.id);
    iNet.ui.ita.UtilsDialog.superclass.constructor.call(this);
    this.$element = $.getCmp(this.id);
  };
  iNet.extend(iNet.ui.ita.UtilsDialog, iNet.Component, {
    getEl: function () {
      return this.$element;
    },
    show: function () {
      this.getEl().modal('show');
    },
    hide: function () {
      this.getEl().modal('hide');
    }
  });
});
