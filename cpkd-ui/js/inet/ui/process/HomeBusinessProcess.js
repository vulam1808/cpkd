// #PACKAGE: homebusiness-process
// #MODULE: HomeBusinessProcess
$(function () {
    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.HomeBusinessProcess = function (config) {
        this.id = 'business-process-div';
        var __config = config || {};
        var self = this;
        var parentPage = null;

        //get form velocity
        var ctx = {
            context: iNet.context, //get data from widget
            zone: iNet.zone //get data from widget
        };

        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };

        var url = {
            load_task: iNet.getUrl('firmtask/process/executor') //task, direction, note
        };

        //MENU VIEW ===========================================
        var $taskMenu = iNet.getLayout().window.parent.taskMenu;


        //LIST VIEW ===========================================
        var $taskFrame = iNet.getLayout().window.taskFrame;


        //MODAL VIEW ==========================================
        //var $taskModal = new iNet.ui.modalview();


        //info view
        var wgBFInformation = null;
        var taskView = function(){
            var __taskInfo = '57e4a5e4dba6901894e3ac71';//$taskFrame.getTaskDataIndex();

            var __taskUuid = ((__taskInfo || {}).history || {}).taskID || '';
            var __graphUuid = ((__taskInfo || {}).history || {}).graphID || "";
            var __requestStatus = ((__taskInfo || {}).request || {}).status || '';
            var _param = {taskID: __taskInfo};
            var wgBtnProcess =  new  iNet.ui.ita.ButtonProcess();
            wgBtnProcess.show();

            var wgPerson= new iNet.ui.ita.PersonRepresentWidget(_param);
            wgPerson.show();

            var wgCapital = new iNet.ui.ita.CapitalFormWidget(_param);
            wgCapital.show();

            var wgabc = new iNet.ui.ita.ListContributorListWidget(_param);
            wgabc.show();


        };
        taskView();
        //PROCESS VIEW ===================================================


        iNet.ui.ita.HomeBusinessProcess.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.ita.HomeBusinessProcess, iNet.ui.app.widget);


});
