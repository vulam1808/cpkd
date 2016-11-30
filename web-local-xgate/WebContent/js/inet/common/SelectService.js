/**
 *  @author Trang Nguyen <trangnt@inetcloud.vn>
 *  @name SelectService
 *  @desc: Develop from Select2 (Verson 3.3.1) <http://ivaynberg.github.com/select2/>
 */
iNet.ui.common.SelectService = function(config){
  var __config = config || {};
  this.prefix = (this.prefix) ? (this.prefix + '-') : 'ibook-select2-';
  
  if (!iNet.isEmpty(this.classQuery)) {
    this.id = this.classQuery;
  }
  else {
    this.id = this.id || 'cb-ibook-select2';
  }
  
  var __resources = {
    choose: this.choose || 'Select a State',
    no_matches_found: this.no_matches_found || 'No matches found',
    searching: this.searching || 'Searching...',
    please_enter: this.please_enter || 'Please enter ',
    more_char: this.more_char || ' more characters',
    only_select: this.only_select || 'You can only select ',
    load_more: this.load_more || 'Loading more results...',
    item: this.items || ' items'
  };
  
  // APPLY
  iNet.apply(this, __config);
  iNet.apply(this, __resources);
  
  // query id
  
  if (!iNet.isEmpty(this.classQuery)) {
    this.$id = $(String.format(".{0}", this.classQuery));
  }
  else {
    this.$id = $(String.format("#{0}", this.id));
  }
  
  
  // ************************************ VARIABLE DEFAULT ************************************
  this.placeholder = this.placeholder || __resources.choose;
  
  this.formatNoMatches = this.formatNoMatches ||
  function(){
    return __resources.no_matches_found;
  };
  this.formatInputTooShort = this.formatInputTooShort ||
  function(input, min){
    return __resources.please_enter + (min - input.length) + __resources.more_char;
  };
  this.formatSelectionTooBig = this.formatSelectionTooBig ||
  function(limit){
    return __resources.only_select + limit + __resources.item + (limit == 1 ? "" : "s");
  };
  this.formatLoadMore = this.formatLoadMore ||
  function(pageNumber){
    return __resources.load_more;
  };
  this.formatSearching = this.formatSearching ||
  function(){
    return __resources.searching;
  };
  this.matcher = this.matcher ||
  function(term, text){
    return text.toUpperCase().indexOf(term.toUpperCase()) >= 0;
  };
  this.formatSelection = this.formatSelection ||
  function(data, container){
    return data ? data.text : undefined;
  };
  
  // ************************************ PROPERTIES ******************************************
	
  var tagName = (!iNet.isEmpty(this.$id.get(0))) ? this.$id.get(0).tagName.toLowerCase():"";
  var __configData = {};
  if (tagName == 'select') {
    var __array = [this.getId, this.multiple, this.ajax, this.query, this.createSearchChoice, this.initSelection, this.data, this.tags];
    for (var i = 0; i < __array.length; i++) {
      if (!iNet.isEmpty(__array[i])) {
        throw new Error("Option '" + __array[i] + "' is not allowed for Select2 when attached to a <select> element.");
      }
    }
    
    __configData = {
      width: this.width || "copy",
      placeholder: this.placeholder,
      allowClear: (!iNet.isEmpty(this.allowClear)) ? this.allowClear : true,
      closeOnSelect: (!iNet.isEmpty(this.closeOnSelect)) ? this.closeOnSelect : true,
      openOnEnter: (!iNet.isEmpty(this.openOnEnter)) ? this.openOnEnter : true,
      formatNoMatches: this.formatNoMatches,
      formatInputTooShort: this.formatInputTooShort,
      formatSelectionTooBig: this.formatSelectionTooBig,
      formatLoadMore: this.formatLoadMore,
      formatSearching: this.formatSearching,
      minimumResultsForSearch: this.minimumResultsForSearch || 0,
      minimumInputLength: this.minimumInputLength || 0,
      maximumInputLength: this.maximumInputLength,
      maximumSelectionSize: this.maximumSelectionSize || 0,
      separator: this.separator || ",",
      blurOnChange: (!iNet.isEmpty(this.blurOnChange)) ? this.blurOnChange : false,
      matcher: this.matcher,
      formatSelection: this.formatSelection ||
      function(data, container){
        return data ? data.text : undefined;
      },
      formatResult: this.formatResult,
      sortResults: this.sortResults,
      formatResultCssClass: this.formatResultCssClass ||
      function(data){
        return undefined;
      },
      containerCss: this.containerCss || {},
      dropdownCss: this.dropdownCss || {},
      containerCssClass: this.containerCssClass || "",
      dropdownCssClass: this.dropdownCssClass || "",
      tokenSeparators: this.tokenSeparators || []
    };
  }
  else {
    __configData = {
      width: this.width || "copy",
      placeholder: this.placeholder,
      allowClear: (!iNet.isEmpty(this.allowClear)) ? this.allowClear : true,
      closeOnSelect: (!iNet.isEmpty(this.closeOnSelect)) ? this.closeOnSelect : true,
      openOnEnter: (!iNet.isEmpty(this.openOnEnter)) ? this.openOnEnter : true,
      formatNoMatches: this.formatNoMatches,
      formatInputTooShort: this.formatInputTooShort,
      formatSelectionTooBig: this.formatSelectionTooBig,
      formatLoadMore: this.formatLoadMore,
      formatSearching: this.formatSearching,
      minimumResultsForSearch: this.minimumResultsForSearch || 0,
      minimumInputLength: this.minimumInputLength || 0,
      maximumInputLength: this.maximumInputLength,
      maximumSelectionSize: this.maximumSelectionSize || 0,
      separator: this.separator || ",",
      blurOnChange: (!iNet.isEmpty(this.blurOnChange)) ? this.blurOnChange : false,
      matcher: this.matcher,
      formatSelection: this.formatSelection ||
      function(data, container){
        return data ? data.text : undefined;
      },
      formatResult: this.formatResult,
      sortResults: this.sortResults,
      formatResultCssClass: this.formatResultCssClass ||
      function(data){
        return undefined;
      },
      containerCss: this.containerCss || {},
      dropdownCss: this.dropdownCss || {},
      containerCssClass: this.containerCssClass || "",
      dropdownCssClass: this.dropdownCssClass || "",
      tokenSeparators: this.tokenSeparators || [],
      multiple: (!iNet.isEmpty(this.multiple)) ? this.multiple : false,
      id: this.idValue ||
      function(e){
        return e.id;
      },
      data: this.data,
      query: this.query,
      createSearchChoice: this.createSearchChoice,
      initSelection: this.initSelection,
      tags: this.tags,
      ajax: this.ajax
    };
  }
  
  // select 2
  this.$id.select2(__configData);
  
  // set data
  this.setData = function(data){
    return this.$id.select2({
      data: data
    });
  };
  
  // get data
  this.getData = function(){
    return this.$id.select2('data');
  };
  
  // get value
  this.getValue = function(){
    return this.$id.select2('val');
  };
  
  // set Value
  this.setValue = function(value){
    this.$id.select2('val', value);
  };
  
  // destroy
  this.destroy = function(){
    this.$id.select2("destroy");
  };
  
  // open
  this.open = function(){
    this.$id.select2("open");
  };
  
  // close
  this.close = function(){
    this.$id.select2("close");
  };
  
  // disable select/input
  this.disable = function(){
    this.$id.select2('disable');
  };
  
  // enable select/input
  this.enable = function(){
    this.$id.select2('enable');
  };
  
  // container
  this.container = function(){
    this.$id.select2("container");
  };
  
  // onSortStart
  this.onSortStart = function(){
    this.$id.select2("onSortStart");
  };
  
  // onSortEnd
  this.onSortEnd = function(){
    this.$id.select2("onSortEnd");
  };
  
  //
  // submit ajax
  this.ajax = function(url){
    return {
      url: url,
      dataType: 'jsonp',
      data: function(term, page){
        return {
          q: term, // search term
          page_limit: 10,
          apikey: "ju6z9mjyajq2djue3gbvv26t" // please do not use so this example keeps working
        };
      },
      results: function(data, page){ // parse the results into the format expected by Select2.
        // since we are using custom formatting functions we do not need to alter remote JSON data
        return {
          results: data.movies
        };
      }
    };
  };
  
};
iNet.apply(iNet.ui.common.SelectService.prototype, {
  val: function(){
    this.getValue();
  },
  val: function(value){
    this.setValue(value);
  },
  getValue: function(){
    this.getValue();
  },
  setValue: function(value){
    this.setValue(value);
  },
  getData: function(){
    this.getData();
  },
  setData: function(data){
    this.setData(data);
  },
  destroy: function(){
    this.destroy();
  },
  open: function(){
    this.open();
  },
  close: function(){
    this.close();
  },
  disable: function(){
    this.disable();
  },
  enable: function(){
    this.enable();
  },
  container: function(){
    this.container();
  },
  onSortStart: function(){
    this.onSortStart();
  },
  onSortEnd: function(){
    this.onSortEnd();
  }
});

// APPLY RESOURCES
iNet.apply(iNet.ui.common.SelectService.prototype, iNet.resources.plugins.selectService);
