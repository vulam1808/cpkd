// #PACKAGE: homebusiness-process
// #MODULE: HomeBusinessProcess
$(function () {
    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.HomeBusinessProcess = function (config) {
        this.id = 'business-process-div';
        var __config = config || {};
        this.taskID = iNet.getLayout().parentParams.taskID || "";
        this.act = iNet.getLayout().parentParams.act || "";
        var me = this;
        /*me.taskID = iNet.taskID;
         me.act = iNet.act;*/
        var parentPage = null;

        //get form velocity
        me.$form = {
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
        var parent = null;
        var wgBFInformation = null;
        var $taskFrame = iNet.getLayout().window.taskFrame;
        var taskViewInfo = function(){
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
           // self.hide();
            wgBFInformation.show();
            wgBFInformation.load();
        };
        var taskView = function(){

            var __requestID = me.taskID;
            console.log("me.act>>>>", __requestID);
            var _param = {taskID: __requestID};
            //taskViewInfo();
            $.postJSON(url.load_processHomeBusiness, _param, function (result) {
                var __result = result || {};

                console.log('load process home business>>', __result);

                if (CommonService.isSuccess(__result)) {
                    me.idHomeBusiness = __result.idHomeBusiness || '';
                    me.statusType = __result.statusType || '';
                    me.objBusiness = __result.objBusiness || {};

                    me.wgBtnProcess =  new  iNet.ui.ita.ButtonProcess({
                        act:me.act,
                        idHomeBusiness: me.idHomeBusiness,
                        parent_ID: me.objBusiness.uuid,
                        statusType: me.statusType,
                        taskID: me.taskID
                    });
                    me.wgBtnProcess.show();

                   /* var wgBFProcess = new iNet.ui.xgate.BfProcess();
                    wgBFProcess.setType('full');
                    //parent.hide();
                    wgBFProcess.setPageBack(parent);
                    wgBFProcess.show();
                    wgBFProcess.load();
                    // me.wgBtnProcess.disabledButtonProcess();*/

                    me.wgViewTask =  new  iNet.ui.ita.HomeBusinessViewTask({
                        statusType : me.statusType,
                        nameBusiness : __result.nameBusiness,
                        objBusiness : me.objBusiness
                    });
                    me.wgViewTask.show();
                    if(me.statusType == "CAP_MOI")
                    {
                        FormService.displayContent(me.$form.tab_process,'show');

                        //Load nguoi dai dien
                        var __objPersonRepresent = me.objBusiness.objPersonRepresent || {};
                        me.wgPerson = new iNet.ui.ita.PersonRepresentWidget({
                            statusType: me.statusType ,
                            idHomeBusiness:me.idHomeBusiness,
                            idPersonRepresent:me.objBusiness.personRepresent_ID,
                            PersonRepresent:__objPersonRepresent});
                        me.wgPerson.show();

                        //Load von dieu le
                        // var __objHomeBusiness = me.objBusiness || {};
                        me.wgCapital = new iNet.ui.ita.CapitalFormWidget({
                            statusType: me.statusType,
                            idHomeBusiness:me.idHomeBusiness,
                            HomeBusiness:me.objBusiness});
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
                        //Hien nut xu ly
                        if(!CommonService.isSuccess(me.objBusiness.lstObjCareer || [])
                            || !CommonService.isSuccess(me.objBusiness.lstObjContributor || [])
                            || !CommonService.isSuccess(__objPersonRepresent)
                            || !CommonService.isSuccess(me.objBusiness.assetCapital || '')
                            || !CommonService.isSuccess(me.objBusiness.cashCapital || '')
                            || !CommonService.isSuccess(me.objBusiness.businessCapital || ''))
                        {
                            //me.wgBtnProcess.disabledButtonProcess();
                        }
                    }
                    else if(me.statusType == "CAP_DOI")
                    {
                        var idChange = me.objBusiness.uuid || {};
                        FormService.displayContent(me.$form.tab_process,'show');
                        me.wgBtnProcess.enableButtonProcess();
                        me.$form.button_info_save.addClass('hide');
                        var _info = me.objBusiness.infoChange || [];
                        for ( var i=0, len=_info.length; i < len; i++ ){
                            var str = _info[i];
                            if(str == 'change_tendangkykinhdoanh')
                            {
                                me.ChangeName = new iNet.ui.ita.ChangeNameBusinessForm({
                                    idChangeBusiness: me.objBusiness.uuid ,
                                    idHomeBusiness:me.idHomeBusiness,
                                    nameBusiness: me.objBusiness.nameBusiness || ''
                                });
                                me.ChangeName.show();
                                me.$form.button_info_save.removeClass('hide');
                            }
                            else if(str == 'change_nguoidaidien')
                            {
                                var __objPersonRepresent = me.objBusiness.objPersonRepresent || {};
                                me.wgPerson = new iNet.ui.ita.PersonRepresentWidget({
                                    statusType: me.statusType ,
                                    idHomeBusiness: idChange,
                                    idPersonRepresent:me.objBusiness.personRepresent_ID,
                                    PersonRepresent:__objPersonRepresent});
                                me.wgPerson.show();
                                me.$form.button_info_save.removeClass('hide');
                            }
                            else if(str == 'change_danhsachnguoigopvon')
                            {
                                me.wgabc = new iNet.ui.ita.ListContributorListWidget({
                                    statusType: me.statusType,
                                    idHomeBusiness:idChange
                                });
                                me.wgabc.show();
                            }
                            else if(str == 'change_danhsachnganhnghe')
                            {
                                me.wglistcareer = new iNet.ui.ita.ListCareerListWidget({
                                    idHomeBusiness: idChange,
                                    statusType: me.statusType
                                });
                                me.wglistcareer.show();
                            }
                            else if(str == 'change_vondieule')
                            {
                                me.wgCapital = new iNet.ui.ita.CapitalFormWidget({
                                    statusType: me.statusType,
                                    idHomeBusiness:idChange,
                                    HomeBusiness:me.objBusiness});
                                me.wgCapital.show();
                                me.$form.button_info_save.removeClass('hide');
                            }
                            else if(str == 'change_thongtindangkykinhdoanh')
                            {
                                me.wgTask = new iNet.ui.ita.TaskProcessWidget({
                                    statusType: me.statusType,
                                    idHomeBusiness:idChange,
                                    HomeBusiness:me.objBusiness});
                                me.wgTask.show();

                                me.$form.button_info_save.removeClass('hide');
                            }
                        }

                    }
                    else
                    {
                        me.wgBtnProcess.enableButtonProcess();
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
            if(me.statusType == "CAP_MOI") {
                me.wgPerson.updatePerson();
                me.wgCapital.updateCapitalHomeBusiness();
            }
            else if(me.statusType == "CAP_DOI") {

                var _info = me.objBusiness.infoChange || [];
                for ( var i=0, len=_info.length; i < len; i++ ) {
                    var str = _info[i];
                    if(str == 'change_tendangkykinhdoanh') {
                        me.ChangeName.saveName();
                    }
                    else if(str == 'change_nguoidaidien')
                    {
                        me.wgPerson.updatePerson();
                    }
                    else if(str == 'change_vondieule')
                    {
                        me.wgCapital.updateCapitalHomeBusiness();
                    }
                    else if(str == 'change_thongtindangkykinhdoanh') {
                        me.wgTask.updateTask();
                    }
                }


            }
        });
        iNet.ui.ita.HomeBusinessProcess.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.ita.HomeBusinessProcess, iNet.ui.app.widget);


});
