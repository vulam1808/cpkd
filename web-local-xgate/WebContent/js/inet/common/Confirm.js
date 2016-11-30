/**
 *  @author Trang Nguyen <trangnt@inetcloud.vn>
 *  @name Confirm
 *  @desc: show dialog confirm
 */
iNet.ui.common.Confirm = function(config){

  var __config = config || {};
  this.prefix = (this.prefix) ? (this.prefix + '-') : 'ibook-confirm-';
  this.id = this.id || 'ibook-modal-confirm-dialog';
  
  this.btnOk = this.prefix + 'btn-confirm-ok';
  this.textTilte = this.prefix + 'text-confirm-title';
  this.textContent = this.prefix + 'text-confirm-content';
  
  var __resources = {
    title: this.title || 'Tilte',
    content: this.content || 'Content',
    ok: this.ok || 'OK',
    cancel: this.cancel || 'Cancel'
  };
  // APPLY
  iNet.apply(this, __config);
  iNet.apply(this, __resources);
  
  // query id
  this.$id = $(String.format("#{0}", this.id));
  
  var __html = '<div class="modal-header">' +
  '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
  String.format('<h3 id ={0}>{1}</h3>', this.textTilte,this.title) +
  '</div>' +
  
  '<div class="modal-body">' +
  String.format('<p id ={0}>{1}</p>', this.textContent,this.content) +
  '</div>' +
  
  '<div class="modal-footer">' +
  String.format('<button id="{0}" class="btn btn-primary"><span class="icon-ok icon-white"></span> {1}</button>', this.btnOk, this.ok) +
  String.format('<button class="btn" data-dismiss="modal" aria-hidden="true"><span class="icon-remove icon-black"></span> {0}</button>', this.cancel) +
  '</div>';
  
  
  // init DOM
  this.$id.addClass('modal hide fade');
  this.$id.html(__html);
  
  
  // QUERY 
  var $textTilte = $(String.format("#{0}", this.textTilte));
  var $textContent = $(String.format("#{0}", this.textContent));
  
  // VARIABLE 
  this.fn = iNet.emptyFn;
  
  // SET TITLE
  this.setTitle = function(title){
    $textTilte.text(title);
  };
  
  // SET CONTENT
  this.setContent = function(content){
    $textContent.html(content);
  };
  
  // SHOW 
  this.show = function(){
    this.$id.modal('show');
    $(String.format('#{0}', this.btnOk)).focus();
  };
  
  // HIDE
  this.hide = function(){
    this.$id.modal('hide');
  };
  
  // SHOW, SETTITLE, SETCONTENT
  this.showConfirm = function(title, content){
    $textTilte.text(title);
    $textContent.html(content);
    this.$id.modal('show');
    $(String.format('#{0}', this.btnOk)).focus();
  };
  
};
iNet.apply(iNet.ui.common.Confirm.prototype, {
  show: function(){
    this.show();
  },
  hide: function(){
    this.hide();
  },
  setTitle: function(title){
    this.setTitle(title);
  },
  setContent: function(content){
    this.setContent(content);
  },
  showConfirm: function(title, content){
    this.showConfirm(title, content);
  },
  setFn: function(fn){
    if (iNet.isFunction(fn)) {
      $(String.format('#{0}', this.btnOk)).click(fn);
    }
  }
});
// APPLY RESOURCES
iNet.apply(iNet.ui.common.Confirm.prototype, iNet.resources.plugins.confirm);