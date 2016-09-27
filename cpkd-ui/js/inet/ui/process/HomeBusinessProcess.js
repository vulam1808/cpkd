// #PACKAGE: homebusiness-process
// #MODULE: HomeBusinessProcess
$(function () {
    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.HomeBusinessProcess = function (config) {
        this.id = 'business-process-div';
        var __config = config || {};
        var me = this;
        var parentPage = null;

        //get form velocity
        this.$form = {
            button_info_edit: $('#btn-infoprocess-load'), //get data from widget
            button_info_save: $('#btn-infoprocess-save')//get data from widget
        };

        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };

        var url = {
            load_processHomeBusiness: iNet.getUrl('ita/homebusiness/loadprocess') //task, direction, note
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
            var __taskInfo = '57ea5636fe53c91790f85ffd';//$taskFrame.getTaskDataIndex();

            var __taskUuid = ((__taskInfo || {}).history || {}).taskID || '';
            var __graphUuid = ((__taskInfo || {}).history || {}).graphID || "";
            var __requestStatus = ((__taskInfo || {}).request || {}).status || '';
            var _param = {taskID: __taskInfo};

            $.postJSON(url.load_processHomeBusiness, _param, function (result) {
                var __result = result || {};
                console.log('load process home business>>', __result);
                if (CommonService.isSuccess(__result)) {
                    this.idHomeBusiness = __result.idHomeBusiness || '';
                    this.statusType = __result.statusType || '';

                    //Load nguoi dai dien
                    var __objPersonRepresent = __result.PersonRepresent || {};
                    me.wgPerson = new iNet.ui.ita.PersonRepresentWidget({statusType: this.statusType ,idHomeBusiness:this.idHomeBusiness,PersonRepresent:__objPersonRepresent});
                    me.wgPerson.show();

                    //Load von dieu le
                    var __objHomeBusiness = __result.HomeBusiness || {};
                    me.wgCapital = new iNet.ui.ita.CapitalFormWidget({statusType: this.statusType,idHomeBusiness:this.idHomeBusiness,HomeBusiness:__objHomeBusiness});
                    me.wgCapital.show();


                    me.wgBtnProcess =  new  iNet.ui.ita.ButtonProcess();
                    me.wgBtnProcess.show();

                    me.wgabc = new iNet.ui.ita.ListContributorListWidget({statusType: this.statusType, idHomeBusiness:this.idHomeBusiness});
                    me.wgabc.show();



                    //me.loadData(__result);
                }
            });



        };
        taskView();
        //PROCESS VIEW ===================================================
        this.$form.button_info_edit.on('click',function(){
            me.wgPerson.removeDisabled();
            me.wgCapital.removeDisabled();
        });
        this.$form.button_info_save.on('click',function(){
            me.wgPerson.updatePerson();
            me.wgCapital.updateCapitalHomeBusiness();
        });
        iNet.ui.ita.HomeBusinessProcess.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.ita.HomeBusinessProcess, iNet.ui.app.widget);


});
