// #PACKAGE: itask-ui-t-screen-service
// #MODULE: TScreenService
$(function () {
    iNet.ns("iNet.ui.task", "iNet.ui.task.TScreen");

    iNet.ui.task.TScreen = function () {
        this.id = 'task-screen-div';
        iNet.ui.task.TScreen.superclass.constructor.call(this);

        var self = this;
        var parent = null;

        var wgBFInformation = null;
        var taskView = function(){
            if (wgBFInformation == null){
                wgBFInformation = new iNet.ui.xgate.BfInformation();
                wgBFInformation.setType('full');
                wgBFInformation.on('changeview', function(data){
                    var __data = data || {};
                    if (!iNet.isEmpty(__data.type || "")){
                        switch (__data.type){
                            case "process":
                                processView();
                                break;
                            case "additional":
                                additionalView();
                                break;
                            case "transfer":
                                transferView();
                                break;
                            case "workflow":
                                workflowView();
                                break;
                        }
                    }
                });
            }

            parent = wgBFInformation;
            self.hide();
            wgBFInformation.show();
            wgBFInformation.load();
        };

        var wgBFProcess = null;
        var processView = function(){
            if (wgBFProcess == null){
                wgBFProcess = new iNet.ui.xgate.BfProcess();
                wgBFProcess.setType('full');
            }

            parent.hide();
            wgBFProcess.setPageBack(parent);
            wgBFProcess.show();
            wgBFProcess.load();
        };

        var wgBFAdditional = null;
        var additionalView = function(){
            if (wgBFAdditional == null){
                wgBFAdditional = new iNet.ui.xgate.BfAdditional();
                wgBFAdditional.setType('full');
            }

            parent.hide();
            wgBFAdditional.setPageBack(parent);
            wgBFAdditional.show();
            wgBFAdditional.load();
        };

        var wgBFTransfer = null;
        var transferView = function(){
            if (wgBFTransfer == null){
                wgBFTransfer = new iNet.ui.xgate.BfTransfer();
                wgBFTransfer.setType('full');
            }

            parent.hide();
            wgBFTransfer.setPageBack(parent);
            wgBFTransfer.show();
            wgBFTransfer.load();
        };

        var wgBFWorkflow = null;
        var workflowView = function(){
            if (wgBFWorkflow == null){
                wgBFWorkflow = new iNet.ui.xgate.BfWorkflow();
                wgBFWorkflow.setType('full');
            }

            parent.hide();
            wgBFWorkflow.setPageBack(parent);
            wgBFWorkflow.show();
            wgBFWorkflow.load();
        };

        //OTHER ==============================================
        this.changeLayout = function(idDoc){
            console.log(">>changeLayout>>", idDoc);
            //iDeskView("view", idDoc);
        };

        taskView();
    };

    iNet.extend(iNet.ui.task.TScreen, iNet.ui.app.widget);

    taskScreen = new iNet.ui.task.TScreen();
    taskScreen.show();
});
