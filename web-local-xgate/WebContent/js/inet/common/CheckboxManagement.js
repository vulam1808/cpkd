/**
 *
 * Depends: iNet.js
 *
 * @param {Object} config - the given configuration
 */
iNet.ui.common.CheckboxManagement = function(config) {
  config = config || {};
  this.prefix = '';
  var resources = {};
  iNet.apply(this, config);//apply configuration
  var $checkAll = this.checkAllSelector || $('#mail-check-all');
  var $rowSelector = this.rowSelector || $('tr.[data-row=mail]');
  var $checkboxSelector = this.checkSelector || $('td[data-ui=checkbox] input[type=checkbox]');
  var $columnCheck = this.columnCheck || $('td[data-ui=checkbox]');
  var $header = this.headerCheck || $('th[data-ui=checkbox]');
  var onChange = this.onChange || iNet.emptyFn;
  var count = $rowSelector.find($checkboxSelector).length;
  this.update = function() {
    $rowSelector = $rowSelector.parent().find('tr.[data-row]');
    count = $rowSelector.find($checkboxSelector).length;
  };
  var fireSelectEvent = function(selector, checked, checkall) {
    var $rows = $(selector);
    if (checked) {
      $rows.addClass('selected');
    }
    else {
      $rows.removeClass('selected');
    }
    if (!checkall) {
      var selectedCount = $rowSelector.find($checkboxSelector).parent().find('input[type=checkbox]:checked').length;
      if (count == selectedCount) {
        $checkAll.attr('checked', 'checked');
      }
      else {
        $checkAll.removeAttr('checked');
      }
    }
    if(checked){
    	onChange([]);
    }else{
    	onChange($rows);
    }
    
  };
  $rowSelector.find($checkboxSelector).unbind('click').click(function() {
    var isChecked = $(this).is(':checked');
    var $row = $($(this).parent().parent().get(0));
    fireSelectEvent($row, isChecked);
  });
  $checkAll.unbind('click').click(function() {
    var isChecked = $(this).is(':checked');
    if (isChecked) {
      $rowSelector.find($checkboxSelector).attr('checked', 'checked');
    }
    else {
      $rowSelector.find($checkboxSelector).removeAttr('checked');
    }
    fireSelectEvent($rowSelector, isChecked, true);
  });
  $columnCheck.unbind('click').click(function(e) {
    var chk = $(this).closest("tr").find("input:checkbox").get(0);
    if (e.target != chk) {
      //chk.checked = !chk.checked;
      if ($(chk).is(':checked')) {
        $(chk).removeAttr('checked');
      }
      else {
        $(chk).attr('checked', 'checked');
      }
      fireSelectEvent($(this).parent(), !!$(chk).is(':checked'));
    }
  });
  $rowSelector.find($checkboxSelector).parent().find('input[type=checkbox]:checked').parent().parent().addClass('selected');
  $checkAll.removeAttr('checked');

  this.getSelected = function() {
    var __ids = [];
    var $selects = $rowSelector.find($checkboxSelector).parent().find('input[type=checkbox]:checked');
    for (var i = 0; i < $selects.length; i++) {
      var $checkbox = $($selects[i]);
      __ids.push($checkbox.val());
    }
    return __ids;
  };
  
  this.getSelection = function() {
    var __ids = [];
    var $selects = $rowSelector.find($checkboxSelector).parent().find('input[type=checkbox]:checked');
    for (var i = 0; i < $selects.length; i++) {
      __ids.push($($selects[i]));
    }
    return __ids;
  };
  this.clearSelected = function() {
    $rowSelector.find($checkboxSelector).removeAttr('checked');
  };
  this.checkAll = function() {
    $checkAll.attr('checked', 'checked');
    $rowSelector.find($checkboxSelector).attr('checked', 'checked');
    $rowSelector.addClass('selected');
  };
};
iNet.ui.common.CheckboxManagement.prototype = {

};
