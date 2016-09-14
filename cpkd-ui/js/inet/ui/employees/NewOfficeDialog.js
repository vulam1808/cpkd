// #PACKAGE:helloworld-new-office-modal-dialog
// #MODULE: NewOfficeDialog
$(function () {
  iNet.ns("iNet.ui.helloworld");
  iNet.ui.helloworld.NewOfficeDialog = function (config) {
    var __config = config || {};
    iNet.apply(this, __config);// apply configuration
    this.id = this.id || 'office-modal-create';
    iNet.ui.helloworld.NewOfficeDialog.superclass.constructor.call(this);
    this.$element = $.getCmp(this.id);
  };
  iNet.extend(iNet.ui.helloworld.NewOfficeDialog, iNet.Component, {
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
