/**
 * Created by HS on 21/09/2016.
 */
// #PACKAGE: view-info-detail
// #MODULE: ViewInfoDetailWidget

$(function() {


    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.ViewInfoDetailWidget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration

        this.id = __config.id || 'view-info-div';
        //this.idTab = __config.idTab || 'view-info-div';
        this.idInterface = 'view-info-detail';
        var me = this;

        var $itemDetail = $.getCmp(me.id);
        var $interface = $.getCmp(me.idInterface);
        if (iNet.isEmpty($itemDetail.html().replace(/ /gi, "").replace(/\n/gi, ""))){
            $itemDetail.html('').append($interface.html());
        }


        var $div = {
            div_content_detail:$('#'+me.id + ' #content-detail'),
            div_Person: $('#'+me.id + ' #content-person'),
            div_listcareer: $('#'+me.id + ' #content-listcareer'),
            div_listcontributor: $('#'+me.id + ' #content-listcontributor'),
            div_capital: $('#'+me.id + ' #content-capital'),
            div_endbusiness: $('#'+me.id + ' #content-endBusiness'),
            div_pausebusiness: $('#'+me.id + ' #content-pauseBusiness'),
            div_dateSubmit: $('#'+me.id + ' #div-dateSubmit'),
            div_changeInfo: $('#'+me.id + ' #div-changeInfo'),
            name_dateSubmit: $('#'+me.id + ' #dateSubmit-name'),
            name_changeInfo: $('#'+me.id + ' #changeInfo-name')
        };

        me.HomeBusiness = __config.HomeBusiness || {};
        me.idHomeBusiness = me.HomeBusiness.uuid||'';
        me.statusType = __config.statusType || '';

        var loadInfoList = function()
        {
            if (CommonService.isSuccess(me.HomeBusiness)) {
                /*console.log('id view info detail',me.idHomeBusiness);
                console.log('statusType view info detail',me.statusType);
                console.log('HomeBusiness view info detail',me.HomeBusiness)*/;
                var dateSumit = me.HomeBusiness.dateSubmit || "";
                if(dateSumit!="" && dateSumit>0)
                {
                    $div.div_dateSubmit.removeClass('hide');
                    $div.name_dateSubmit.html('').append(dateSumit.longToDate());
                }

                if(me.statusType=="CAP_MOI"){
                    var Person = me.HomeBusiness.objPersonRepresent || {};
                    //iNet.extend(__config.divIDPerson, iNet.Component);
                    var $div_id_person = $.getCmp(__config.divIDPerson || 'personrepresent-widget-content');
                    $div.div_Person.html('').append($div_id_person.html());
                    //$div_id_person.remove();
                    var jsPerson = new iNet.ui.ita.PersonRepresentWidget({
                        id : me.id ,
                        PersonRepresent: Person
                    });
                    //jsPerson.id = me.id;
                    jsPerson.setReadonly();
                    //jsPerson.show();
                    $('#'+me.id + ' #personrepresent-widget').removeClass('hide');


                    var $div_id_capital = $.getCmp(__config.divIDCapital || 'capital-form-widget-content');
                    $div.div_capital.html('').append($div_id_capital.html());
                    // $div_id_capital.remove();
                    var jsCapital = new iNet.ui.ita.CapitalFormWidget({
                        id : me.id,
                        HomeBusiness: me.HomeBusiness
                    });
                    jsCapital.setReadonly();
                    //jsCapital.show();
                    $('#'+me.id + ' #capital-form-widget').removeClass('hide');

                    var $div_id_listcareer = $.getCmp(__config.divIDlistCareer || 'listcareer-widget-content');
                    $div.div_listcareer.html('').append($div_id_listcareer.html());
                    //$div_id_listcareer.remove();
                    var jslistcareer = new iNet.ui.ita.ListCareerListWidget({
                        id : me.id,
                        idHomeBusiness: me.idHomeBusiness,
                        statusType: me.statusType
                    });
                    jslistcareer.setHideButtonAdd();
                    //jslistcareer.show();
                    $('#'+me.id + ' #listcareer-widget').removeClass('hide');

                    var $div_id_listcontributor = $.getCmp(__config.divIDlistContributor || 'listcontributor-widget-content');
                    $div.div_listcontributor.html('').append($div_id_listcontributor.html());
                    //$div_id_listcontributor.remove();
                    var jslistcontributor = new iNet.ui.ita.ListContributorListWidget({
                        id : me.id,
                        idHomeBusiness: me.idHomeBusiness,
                        statusType: me.statusType
                    });
                    jslistcontributor.setHideButtonAdd();
                    //jslistcontributor.show();
                    $('#'+me.id + ' #listcontributor-widget').removeClass('hide');
                }
                else if(me.statusType=="CAP_DOI"){
                    var changeInfo = me.HomeBusiness.infoChange || [];
                    if(changeInfo.length > 0)
                    {
                        $div.div_changeInfo.removeClass('hide');
                        var str = "";
                        for ( var i=0, len=changeInfo.length; i < len; i++ ){
                            var strInfo = changeInfo[i];
                            console.log("_info>>>>",strInfo);
                            str += '<label class="label label-sm label-success arrowed-in">"'+ita.resources.common[strInfo]+'"</label>'

                            if(strInfo == 'change_tendangkykinhdoanh')
                            {
                                me.ChangeName = new iNet.ui.ita.ChangeNameBusinessForm({
                                    idChangeBusiness: me.objBusiness.uuid ,
                                    idHomeBusiness:me.idHomeBusiness,
                                    nameBusiness: me.objBusiness.nameBusiness || ''
                                });
                                me.ChangeName.show();
                                me.$form.button_info_save.removeClass('hide');
                            }
                            else if(strInfo == 'change_nguoidaidien')
                            {
                                var Person = me.HomeBusiness.objPersonRepresent || {};
                                //iNet.extend(__config.divIDPerson, iNet.Component);
                                var $div_id_person = $.getCmp(__config.divIDPerson || 'personrepresent-widget-content');
                                $div.div_Person.html('').append($div_id_person.html());
                                //$div_id_person.remove();
                                var jsPerson = new iNet.ui.ita.PersonRepresentWidget({
                                    id : me.id ,
                                    PersonRepresent: Person
                                });
                                //jsPerson.id = me.id;
                                jsPerson.setReadonly();
                                //jsPerson.show();
                                $('#'+me.id + ' #personrepresent-widget').removeClass('hide');
                            }
                            else if(strInfo == 'change_danhsachnguoigopvon')
                            {
                                var $div_id_listcontributor = $.getCmp(__config.divIDlistContributor || 'listcontributor-widget-content');
                                $div.div_listcontributor.html('').append($div_id_listcontributor.html());
                                //$div_id_listcontributor.remove();
                                var jslistcontributor = new iNet.ui.ita.ListContributorListWidget({
                                    id : me.id,
                                    idHomeBusiness: me.idHomeBusiness,
                                    statusType: me.statusType
                                });
                                jslistcontributor.setHideButtonAdd();
                                //jslistcontributor.show();
                                $('#'+me.id + ' #listcontributor-widget').removeClass('hide');
                            }
                            else if(strInfo == 'change_danhsachnganhnghe')
                            {
                                var $div_id_listcareer = $.getCmp(__config.divIDlistCareer || 'listcareer-widget-content');
                                $div.div_listcareer.html('').append($div_id_listcareer.html());
                                //$div_id_listcareer.remove();
                                var jslistcareer = new iNet.ui.ita.ListCareerListWidget({
                                    id : me.id,
                                    idHomeBusiness: me.idHomeBusiness,
                                    statusType: me.statusType
                                });
                                jslistcareer.setHideButtonAdd();
                                //jslistcareer.show();
                                $('#'+me.id + ' #listcareer-widget').removeClass('hide');
                            }
                            else if(strInfo == 'change_vondieule')
                            {
                                var $div_id_capital = $.getCmp(__config.divIDCapital || 'capital-form-widget-content');
                                $div.div_capital.html('').append($div_id_capital.html());
                                // $div_id_capital.remove();
                                var jsCapital = new iNet.ui.ita.CapitalFormWidget({
                                    id : me.id,
                                    HomeBusiness: me.HomeBusiness
                                });
                                jsCapital.setReadonly();
                                //jsCapital.show();
                                $('#'+me.id + ' #capital-form-widget').removeClass('hide');
                            }
                            else if(strInfo == 'change_thongtindangkykinhdoanh')
                            {
                                me.wgTask = new iNet.ui.ita.TaskProcessWidget({
                                    statusType: me.statusType,
                                    idHomeBusiness:idChange,
                                    HomeBusiness:me.objBusiness});
                                me.wgTask.show();

                                me.$form.button_info_save.removeClass('hide');
                            }
                        }
                        $div.name_changeInfo.html('').append(str);
                    }
                }
                else if(me.statusType=="TAM_NGUNG"){
                    var $div_pausebusiness = $.getCmp(__config.divIDPauseBusiness || 'pausebusiness-widget-content');
                    $div.div_pausebusiness.html('').append($div_pausebusiness.html());
                    // $div_id_capital.remove();
                    var jsPause = new iNet.ui.ita.PauseBusinessFormWidget({
                        id : me.id,
                        PauseBusiness: me.HomeBusiness
                    });
                    jsPause.setReadonly();
                    //jsPause.show();
                    $('#'+me.id + ' #pausebusiness-widget').removeClass('hide');

                    $div.div_content_detail.addClass('hide');
                }
                else if(me.statusType=="CHAM_DUT"){
                    var $div_endbusiness = $.getCmp(__config.divIDEndBusiness || 'endbusiness-widget-content');
                    $div.div_endbusiness.html('').append($div_endbusiness.html());
                    // $div_id_capital.remove();
                    var jsEnd = new iNet.ui.ita.EndBusinessFormWidget({
                        id : me.id,
                        EndBusiness: me.HomeBusiness
                    });
                    jsEnd.setReadonly();
                    //jsEnd.show();
                    $('#'+me.id + ' #endbusiness-widget').removeClass('hide');
                    $div.div_content_detail.addClass('hide');
                }
            }
        };
        loadInfoList();




        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };
        me.$form = {
            input_areaBusiness: $('#' + me.id + ' [data-id="homebusiness-areaBusiness"]'),
            input_address: $('#' + me.id + ' [data-id="homebusiness-address"]'),
            input_province: $('#' + me.id + ' [data-id="homebusiness-province"]'),
            input_district: $('#' + me.id + ' [data-id="homebusiness-district"]'),

            input_ward: $('#' + me.id + ' [data-id="homebusiness-ward"]'),
            input_phone: $('#' + me.id + ' [data-id="homebusiness-phone"]'),
            input_fax: $('#' + me.id + ' [data-id="homebusiness-fax"]'),
            input_email: $('#' + me.id + ' [data-id="homebusiness-email"]'),
            input_website: $('#' + me.id + ' [data-id="homebusiness-website"]'),
            idInterface:$('#view-info-detail')
        };

        var url = {
            update_capitalHomeBusiness: iNet.getUrl('ita/capital/update')
        };

        var loadInfoDetail = function(){
            me.setInfo(me.HomeBusiness);

            me.setReadonly();
        };
        loadInfoDetail();
        iNet.ui.ita.ViewInfoDetailWidget.superclass.constructor.call(this);

    };

    iNet.extend(iNet.ui.ita.ViewInfoDetailWidget, iNet.Component,{
        setReadonly: function(){

            this.$form.input_areaBusiness.prop('readonly', true);
            this.$form.input_address.prop('readonly', true);
            this.$form.input_province.prop('readonly', true);
            this.$form.input_district.prop('readonly', true);
            this.$form.input_ward.prop('readonly', true);
            this.$form.input_phone.prop('readonly', true);
            this.$form.input_fax.prop('readonly', true);
            this.$form.input_email.prop('readonly', true);
            this.$form.input_website.prop('readonly', true);
        },
        setInfo : function (data) {

            var __data = data || {};

            var objareaBusiness = __data.objAreaBusiness || {};
            if(CommonService.isSuccess(objareaBusiness))
            {
                this.$form.input_areaBusiness.val(objareaBusiness.area);
            }

            this.$form.input_address.val(__data.address);
            var objprovince = __data.objProvince || {};
            if(CommonService.isSuccess(objprovince))
            {
                this.$form.input_province.val(objprovince.name);
            }
            var objdistrict = __data.objDistrict || {};
            if(CommonService.isSuccess(objdistrict))
            {
                this.$form.input_district.val(objdistrict.name);
            }
            var objward = __data.objWard || {};
            if(CommonService.isSuccess(objward))
            {
                this.$form.input_ward.val(objward.name);
            }


            this.$form.input_phone.val(__data.phone);
            this.$form.input_fax.val(__data.fax);
            this.$form.input_email.val(__data.email);
            this.$form.input_website.val(__data.website);

            return __data;
        }
    });


});
