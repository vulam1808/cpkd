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
        var wgBFInformation = null;
        var taskView = function(){
            var __taskInfo = me.taskID;//'57f2665b703f902f0c8944f8';//$taskFrame.getTaskDataIndex();
            console.log("me.taskID>>>>", me.taskID);
            console.log("me.act>>>>", me.act);
            var __taskUuid = ((__taskInfo || {}).history || {}).taskID || '';
            var __graphUuid = ((__taskInfo || {}).history || {}).graphID || "";
            var __requestStatus = ((__taskInfo || {}).request || {}).status || '';
            var _param = {taskID: __taskInfo};

            $.postJSON(url.load_processHomeBusiness, _param, function (result) {
                var __result = result || {};

                console.log('load process home business>>', __result);

                if (CommonService.isSuccess(__result)) {
                    me.idHomeBusiness = __result.idHomeBusiness || '';
                    me.statusType = __result.statusType || '';
                    var objBusiness = __result.objBusiness || {};

                    me.wgBtnProcess =  new  iNet.ui.ita.ButtonProcess({
                        act:me.act,
                        idHomeBusiness: me.idHomeBusiness,
                        parent_ID: objBusiness.uuid,
                        statusType: me.statusType
                    });
                    me.wgBtnProcess.show();
                    me.wgBtnProcess.disabledButtonProcess();

                    me.wgViewTask =  new  iNet.ui.ita.HomeBusinessViewTask({
                        statusType : me.statusType,
                        nameBusiness : __result.nameBusiness,
                        objBusiness : objBusiness
                    });
                    me.wgViewTask.show();
                    if(me.statusType == "CAP_MOI")
                    {
                        FormService.displayContent(me.$form.tab_process,'show');

                        //Load nguoi dai dien
                        var __objPersonRepresent = __result.objBusiness.objPersonRepresent || {};
                        me.wgPerson = new iNet.ui.ita.PersonRepresentWidget({
                            statusType: me.statusType ,
                            idHomeBusiness:me.idHomeBusiness,
                            idPersonRepresent:objBusiness.personRepresent_ID,
                            PersonRepresent:__objPersonRepresent});
                        me.wgPerson.show();

                        //Load von dieu le
                       // var __objHomeBusiness = objBusiness || {};
                        me.wgCapital = new iNet.ui.ita.CapitalFormWidget({
                            statusType: me.statusType,
                            idHomeBusiness:me.idHomeBusiness,
                            HomeBusiness:objBusiness});
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
                        if(!CommonService.isSuccess(__result.objBusiness.lstObjCareer || [])
                            || !CommonService.isSuccess(__result.objBusiness.lstObjContributor || [])
                            || !CommonService.isSuccess(__objPersonRepresent)
                            || !CommonService.isSuccess(__result.objBusiness.assetCapital || '')
                            || !CommonService.isSuccess(__result.objBusiness.cashCapital || '')
                            || !CommonService.isSuccess(__result.objBusiness.businessCapital || ''))
                        {
                            //me.wgBtnProcess.disabledButtonProcess();
                        }
                    }
                    else if(me.statusType == "CAP_DOI")
                    {
                        FormService.displayContent(me.$form.tab_process,'show');
                        me.wgBtnProcess.enableButtonProcess();
                        me.$form.button_info_save.addClass('hide');
                        var _info = objBusiness.infoChange || [];
                        for ( var i=0, len=_info.length; i < len; i++ ){
                            var str = _info[i];
                           if(str == 'change_tendangkykinhdoanh')
                           {
                              me.ChangeName = new iNet.ui.ita.ChangeNameBusinessForm({
                                  idChangeBusiness: objBusiness.uuid ,
                                  idHomeBusiness:me.idHomeBusiness
                                 });
                               me.ChangeName.show();
                               me.$form.button_info_save.removeClass('hide');
                           }
                            else if(str == 'change_nguoidaidien')
                           {
                               var __objPersonRepresent = __result.objBusiness.objPersonRepresent || {};
                               me.wgPerson = new iNet.ui.ita.PersonRepresentWidget({
                                   statusType: me.statusType ,
                                   idHomeBusiness:me.idHomeBusiness,
                                   idPersonRepresent:objBusiness.personRepresent_ID,
                                   PersonRepresent:__objPersonRepresent});
                               me.wgPerson.show();
                               me.$form.button_info_save.removeClass('hide');
                           }
                           else if(str == 'change_danhsachnguoigopvon')
                           {
                               me.wgabc = new iNet.ui.ita.ListContributorListWidget({
                                   statusType: me.statusType,
                                   idHomeBusiness:me.idHomeBusiness
                               });
                               me.wgabc.show();
                           }
                           else if(str == 'change_danhsachnganhnghe')
                           {
                               me.wglistcareer = new iNet.ui.ita.ListCareerListWidget({
                                   idHomeBusiness: me.idHomeBusiness,
                                   statusType: me.statusType
                               });
                               me.wglistcareer.show();
                           }
                           else if(str == 'change_vondieule')
                           {
                               me.wgCapital = new iNet.ui.ita.CapitalFormWidget({
                                   statusType: me.statusType,
                                   idHomeBusiness:me.idHomeBusiness,
                                   HomeBusiness:objBusiness});
                               me.wgCapital.show();
                               me.$form.button_info_save.removeClass('hide');
                           }
                           else if(str == 'change_thongtindangkykinhdoanh')
                           {

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
            me.wgPerson.updatePerson();
            me.wgCapital.updateCapitalHomeBusiness();
            me.ChangeName.saveName();
        });
        iNet.ui.ita.HomeBusinessProcess.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.ita.HomeBusinessProcess, iNet.ui.app.widget);


});
