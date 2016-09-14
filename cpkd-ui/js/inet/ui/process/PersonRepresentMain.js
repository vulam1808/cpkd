// #PACKAGE: personrepresent-main
// #MODULE: PersonRepresentMain
/**
 * Created by ntvy on 4/22/15.
 */
$(function() {
  var employeeList =  new  iNet.ui.ita.PersonRepresentListWidget();
  var officeDialog;
  employeeList.on('adddialog1', function(){

    officeDialog= new iNet.ui.ita.UtilsDialog({id:'personrepresent-modal-create'});
    //officeDialog.id =;

    officeDialog.show();
  });

});