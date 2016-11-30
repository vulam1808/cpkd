/**
 * 
 * Depends: jquery.showLoading.js
 * @param {Object} config - the given configuration
 */
iNet.ui.common.AjaxLoading = function(config) {
  config = config || {};
  iNet.apply(this, config);//apply configuration
  this.title = this.title || iNet.resources.message.load_msg;
  this.masks = [];
  this.removeAll = function() {
    for (var i = 0; i < this.masks.length; i++) {
      $(this.masks[i]).unbind('ajaxStart').unbind('ajaxStop');
    }
    this.masks = [];
  };
  this.addMasks = function(selectors, options) {
    var $mask = $(selectors);
    var __options = options || {};
    var __top = (__options.isBody) ? 30 : $('body').scrollTop() - 30;
    var that = this;
    if ($mask.length > 0) {
      $($mask).ajaxStart(function() {
        $(this).showLoading({
          msg: __options.title || that.title,
          marginTop: __top
        });
      });
      $($mask).ajaxStop(function() {
        for (var i = 0; i < $(this).length; i++) {
          $($(this)[i]).hideLoading();
          that.removeMask($(this)[i]);
        }
      });
      this.masks.push(selectors);
    }
  };
  this.removeMask = function(selector, options) {
    this.masks = [];
    var $mask = $(selector);
    $($mask).unbind('ajaxStart').unbind('ajaxStop');
  };
  this.setTitle = function(selector, title) {
   this.addMask(selector,{title: title});
  };
};
iNet.ui.common.AjaxLoading.prototype = {
  getMask: function() {
    return this.masks;
  },
  addMask: function(selectors, options) {
    this.addMasks(selectors || '', options || {});
  },
  removeMask: function(selector, options) {
    this.removeMask(selector);
  },
  setTitle: function(selector, title) {
    this.setTitle(selector, title);
  }
};
