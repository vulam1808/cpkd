// #PACKAGE: employees-main
// #MODULE: EmployeesMain
/**
 * Created by ntvy on 4/22/15.
 */
$(function() {
  var employeeList =  new  iNet.ui.helloworld.EmployeesListWidget();
  var officeWidget,officeDialog;

  var createOfficeWidget = function(){
    if(!officeWidget) {
      officeWidget=new iNet.ui.helloworld.OfficeLocationWidget();
      officeWidget.on('back',function(){
        officeWidget.hide();
        employeeList.show();
      });
    }
    return officeWidget;
  };

  var createOfficeDialog = function(){
    if(!officeDialog) {
      officeDialog= new iNet.ui.hellloworld.NewOfficeDialog();
    }
    return officeDialog;
  };

  employeeList.on('addoffice', function(){
    var widget = createOfficeWidget();
    employeeList.hide();
    widget.show();
  });
  employeeList.on('adddialog', function(){
    var dialog = createOfficeDialog();
    dialog.show();
  });

});