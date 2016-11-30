/**
 *  @author Trang Nguyen <trangnt@inetcloud.vn>
 *  @name Confirm
 *  @desc: show dialog confirm
 */
iNet.ui.common.Select2Service = function(config){
  var __config = config || {};
  this.prefix = (this.prefix) ? (this.prefix + '-') : 'ibook-select2-';
  this.id = this.id || 'cb-ibook-select2';
  
  var __resources = {
    choose: this.choose || 'Select a State',
    no_matches_found: this.no_matches_found || 'No matches found',
    searching:this.searching || 'Searching...'
  };
  
  // APPLY
  iNet.apply(this, __config);
  iNet.apply(this, __resources);
  
  // query id
  this.$id = $(String.format("#{0}", this.id));
  
  // html
  var __html = '<option value="global-product-type-code.cpx">Danh mục loại thuộc tính hàng hóa</option>' +
  '<option value="global-business-label.cpx">Danh mục nhãn nghiệp vụ</option>' +
  '<option value="dictionary-global-tax.cpx">Danh mục mức thuế Global</option>' +
  '<option value="dictionary-global-storage-property.cpx">Danh mục thuộc tính kho Global</option>' +
  '<option value="dictionary-cost.cpx">Danh mục chi phí</option>' +
  '<option value="dictionary-global-currency.cpx">Danh mục tiền tệ Global</option>';
  
  
  // init DOM
  this.$id.addClass('populate placeholder');
  this.$id.attr('placeholder');
  this.$id.html(__html);
  
  // VARIABLE DEFAULT
  this.urlParent = 'ibook/page/admin/';
  this.placeholder = this.choose;
  
  
  //init select2
  this.select = function(){
    
    var getPlaceHolder = function(){
      return this.placeholder;
    }
    .createDelegate(this);
    
    this.$id.select2({
      placeholder: this.placeholder,
      allowClear: true,
      formatNoMatches: function(){
        return this.no_matches_found;
      }.createDelegate(this),
      formatSearching: function(){
        return this.searching;
      }.createDelegate(this)
    });
    
    var openWindown = function(value){
      var __url = String.format('{0}', this.urlParent + value); 
      window.open(iNet.getUrl(String.format('{0}', __url)), '_self');
    }
  .createDelegate(this);
    
    // on change
    this.$id.change(function(){
      var __value = $(this).val();
      
      openWindown(__value);
      this.$id.select2('val', __value);
    });
  };
  // action
  this.select();
  
};
iNet.apply(iNet.ui.common.Select2Service.prototype, {

  setUrlParent: function(url){
    this.urlParent = url;
  },
  select: function(){
    this.select();
  },
  setPlaceholder: function(text){
    this.placeholder = text;
  }
	
});

// APPLY RESOURCES
iNet.apply(iNet.ui.common.Select2Service.prototype, iNet.resources.plugins.select2Service);