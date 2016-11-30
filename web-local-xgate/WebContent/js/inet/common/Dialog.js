/**
 * @author thoangtd@inetcloud.vn
 * @Date 2013-03-08
 * 
 * Dialog plugin 
 * */

/*************************************************************************
 * define options
 * title
 * body
 *modalOption
 *buttons {
 *   id, cls, icon, text
 * }
 * 
 * 
 */

!function($) {
  var Dialog = function(element, options){
    // class of member
    this.$element = $(element);
    this.options = $.extend(true, {}, $.fn.dialog.defaults, options);
    console.log(this.options);
    
    // generate dialog html
    this.rederData();
    
    this.$header = $(element).find(".modal-header");
    this.$footer = $(element).find(".modal-footer");
    this.$body = $(element).find(".modal-body");
  };
  Dialog.prototype = {
    
    //** Render HTML
    renderHeader : function(title){
      var __title = title || "";
      var __html = '<div class="modal-header">'
          __html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
          __html += String.format('<h3>{0}</h3>', title);
          __html += '</div>';
          return __html; 
    },
    title : function(title){
      this.$header.html(this.renderHeader(title));
    },
    renderFooter : function(button){
      var __button = button || "";
      return String.format('<div class="modal-footer">{0}</div>',  button); 
    },
    renderBody: function(body) {
      var __body = body || "";
      return String.format('<div class="modal-body">{0}</div>', __body);
    },
    renderButton : function(buttons) {
      var that = this;
      var __buttons = buttons || {};
      var __html = '';
      if (iNet.isArray(__buttons)) {
        for (var i = 0; i < __buttons.length; i++) {
          var __button = __buttons[i];
          __button.id = (__button.id) ? __button.id : that.prefix + iNet.generateId();
          var __attr = "";
          if(__button.attr.length > 0) {
            for(var k = 0 ; k < __button.attr.length; k ++) {
              console.log(__button.attr);
              __attr += String.format("{0}:'{1}'", __button.attr[k].name, __button.attr[k].value);
            }
          }
          __html += String.format('<button id="{0}" class="btn {1}" {2}><span class="{3}"></span> {4}</button>', __button.id, __button.cls, __attr, __button.icon, __button.text);
          $(String.format("#{0}", __button.id)).off('click').on('click', __button.fn);
        }
      }
      return __html;
    },
    rederData : function(){
      
      // render DOM Html
      console.log(this);
      var sef = this;
      var __header = sef.renderHeader(sef.options.title) || ""; 
      sef.$element.append(__header);
      var __body = sef.renderBody(this.options.body);
      sef.$element.append(__body);
      var __footer = sef.renderFooter(sef.renderButton(this.options.buttons));
      sef.$element.append(__footer);
      // 
      sef.$element.addClass("modal hide fade");
      console.log(sef.$element);
      //sef.$element.modal('hide');
    },
    show : function(){
      this.$element.modal('show');
    }
  };
  
   // DIALOG PLUGIN DEFINITION

  $.fn.dialog = function (option) {
    return this.each( function () {
      var $this = $(this);
      var data = $this.data('dialog');
      var options = typeof option === 'object' && option;
      if (!data)
        $this.data('dialog', (data = new Dialog(this, options)));
      if (typeof option === 'string')
        data[option]();
    });
  };
  $.fn.dialog.defaults = {};

  $.fn.dialog.Constructor = Dialog;
}(window.jQuery);
