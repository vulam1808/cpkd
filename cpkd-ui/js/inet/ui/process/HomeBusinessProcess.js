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
            button_info_save: $('#btn-infoprocess-save'),//get data from widget
            tab_info : $('#tab-info'),
            tab_process: $('#tab-process')
        };

        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };

        var url = {
            load_processHomeBusiness: iNet.getUrl('ita/homebusiness/loadprocess') //task, direction, note
        };




        //info view
        var wgBFInformation = null;
        var taskView = function(){
            var __taskInfo = '57f2665b703f902f0c8944f8';//$taskFrame.getTaskDataIndex();

            var __taskUuid = ((__taskInfo || {}).history || {}).taskID || '';
            var __graphUuid = ((__taskInfo || {}).history || {}).graphID || "";
            var __requestStatus = ((__taskInfo || {}).request || {}).status || '';
            var _param = {taskID: __taskInfo};
            me.wgBtnProcess =  new  iNet.ui.ita.ButtonProcess();
            me.wgBtnProcess.show();
            $.postJSON(url.load_processHomeBusiness, _param, function (result) {
                var __result = result || {};

                console.log('load process home business>>', __result);
                if (CommonService.isSuccess(__result)) {
                    me.idHomeBusiness = __result.idHomeBusiness || '';
                    me.statusType = __result.statusType || '';
                    var objBusiness = __result.objBusiness || {};
                    if(me.statusType == "CAP_MOI" || me.statusType == "CAP_DOI")
                    {
                        FormService.displayContent(me.$form.tab_process,'show');

                        //Load nguoi dai dien
                        var __objPersonRepresent = __result.objBusiness.objPersonRepresent || {};
                        me.wgPerson = new iNet.ui.ita.PersonRepresentWidget({
                            statusType: me.statusType ,
                            idHomeBusiness:me.idHomeBusiness,
                            idPersonRepresent:__result.objBusiness.personRepresent_ID,
                            PersonRepresent:__objPersonRepresent});
                        me.wgPerson.show();

                        //Load von dieu le
                        var __objHomeBusiness = objBusiness || {};
                        me.wgCapital = new iNet.ui.ita.CapitalFormWidget({
                            statusType: me.statusType,
                            idHomeBusiness:me.idHomeBusiness,
                            HomeBusiness:__objHomeBusiness});
                        me.wgCapital.show();

                        me.wglistcareer = new iNet.ui.ita.ListCareerListWidget({
                            idHomeBusiness: me.idHomeBusiness,
                            statusType: me.statusType
                        });
                        me.wglistcareer.show();

                        me.wgabc = new iNet.ui.ita.ListContributorListWidget({
                            statusType: me.statusType,
                            idHomeBusiness:me.idHomeBusiness
                        });
                        me.wgabc.show();
                    }






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
