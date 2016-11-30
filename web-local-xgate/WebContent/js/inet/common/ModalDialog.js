/**
 *
 * Depends: iNet.js
 *
 * @param {Object} config - the given configuration
 */
iNet.ui.common.ModalDialog = function(config) {
  config = config || {};
  this.prefix = (config.prefix) ? config.prefix : config.id;
  this.id = 'modal-dialog';
  iNet.apply(this, config);//apply configuration
  this.prefix = (this.prefix) ? (this.prefix + '-') : '';
  this.dialogId = String.format('#{0}', this.id);
  this.buttons = this.buttons ? this.buttons : [];
  this.title = this.title || '';
  this.content = this.content || '';
  var that = this;
  var generateButtons = function() {
    var __html = '';
    if (iNet.isArray(that.buttons)) {
      for (var i = 0; i < that.buttons.length; i++) {
        var __button = that.buttons[i];
        __button.id = (__button.id) ? __button.id : that.prefix + iNet.generateId();
        __html += String.format('<button id="{0}" class="btn {1}"><span class="{2}"></span> {3}</button>', __button.id, __button.cls, __button.icon, __button.text);
        //$('#' + __button.id).unbind('click').live('click', __button.fn);
        $(that.dialogId).off('click', '#' + __button.id).on('click', '#' + __button.id, __button.fn);
      }
    }
    return __html;
  };
  var initComponent = function() {
    var __html = '<div class="modal-header">' +
    '<a class="close" data-dismiss="modal">&times;</a>' +
    String.format('<h4>{0}</h4>', that.title) +
    '</div>' +
    String.format('<div class="modal-body">{0}</div>', that.content) +
    '<div class="modal-footer">' +
    generateButtons() +
    '</div>';
    $(that.dialogId).html(__html);
  };
  initComponent();
  this.show = function() {
    if ($(this.dialogId).length < 1) {
      return;
    }
    $(this.dialogId).modal('show');
    var __butons = this.getButtons();
    if (__butons.length > 0) {
      $(__butons[0]).focus();
    }
    return this;
  };
  this.hide = function() {
    $(this.dialogId).modal('hide');
    return this;
  };
  
};
iNet.ui.common.ModalDialog.prototype = {
  getContent: function() {
    return this.content;
  },
  setContent: function(content) {
    this.content = content;
    $(this.dialogId).find('.modal-body').html(this.content);
  },
  setTitle: function(title) {
    this.title = title;
    $(this.dialogId).find('.modal-header h4').text(this.title);
  },
  getMask: function() {
    return $(this.dialogId);
  },
  getButtons: function() {
    return $(this.dialogId).find('.modal-footer button');
  }
};
