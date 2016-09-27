/**
 * Created by LamLe on 9/15/2016.
 */
// #PACKAGE: homebusiness-form-widget
// #MODULE: HomeBusinessFormWidget
$(function () {

    iNet.ns("iNet.ui","iNet.ui.ita");
    iNet.ui.ita.HomeBusinessForm = function (config) {
        this.resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };

        var url = {
            load_province: iNet.getUrl('ita/province/load'),
            load_district: iNet.getUrl('ita/district/load'),
            load_ward: iNet.getUrl('ita/ward/load'),
            load_areaBusiness: iNet.getUrl('ita/areabusiness/load'),

            load_enum: iNet.getUrl('ita/enums/load'),

            save_homebusiness: iNet.getUrl('ita/homebusiness/save'),
            save_changebusiness: iNet.getUrl('ita/changebusiness/save'),
            save_endbusiness: iNet.getUrl('ita/endbusiness/save'),
            save_pausebusiness: iNet.getUrl('ita/pausebusiness/save'),
            update_statusHomeBusiness: iNet.getUrl('ita/homebusiness/update'),
            check_name_business: iNet.getUrl('ita/homebusiness/checknamebusiness')
            /*  view: iNet.getUrl('ita/province/load'),
             save: iNet.getUrl('ita/province/save'),
             update: iNet.getUrl('ita/province/update'),
             del: iNet.getUrl('ita/province/delete')*/
        };
        this.$form = {
            //input_id_homebusiness:$('#id-homebusiness'),
            input_typeTask: $('#homebusiness-type-task'),
            button_save: $('#homebusiness-save-btn'),
            div_title:$('#homebusiness-title'),
            div_item:$('#homebusiness-item'),
            div_homebusiness_create:$('#homebusiness-item-create'),
            div_endbusiness_create:$('#endbusiness-item-create'),
            div_changebusiness_create:$('#changebusiness-item-create'),
            div_pausebusiness_create:$('#pausebusiness-item-create'),

            button_view_detail:$('#view-detail-task'),
            button_check: $('#btn-check-nameBusiness'),
            div_status_check: $('#status-nameBusiness'),
            input_nameBusiness: $('#homebusiness-nameBusiness')
        };
        this.$formCapMoi = {
            input_address: $('#homebusiness-address'),
            input_province: $('#homebusiness-province'),
            input_district: $('#homebusiness-district'),
            input_ward: $('#homebusiness-ward'),
            input_phone: $('#homebusiness-phone'),
            input_fax: $('#homebusiness-fax'),
            input_email: $('#homebusiness-email'),
            input_website: $('#homebusiness-website'),
            input_areaBusiness: $('#homebusiness-areaBusiness')
        };
        this.$formCapDoi = {
            input_infoChange: $('#changebusiness-infoChange')
        };
        this.$formTamNgung = {
            input_dayofPause: $('#pausebusiness-dayofPause'),
            input_dateStart: $('#pausebusiness-dateStart'),
            input_reason: $('#pausebusiness-reason')
        };
        this.$formChamDut = {
            input_dateEnd: $('#endbusiness-dateEnd'),
            input_reason: $('#endbusiness-reason')
        };
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'homebusiness-div';
        iNet.ui.ita.HomeBusinessForm.superclass.constructor.call(this);
        var me= this;
        me.__id_homebusiness = '';



//Function load combobox ==========================================
        //Load info change
        var listChangeBusiness = function() {
            var __dataListChangeBusiness = [];
            $.postJSON(url.load_enum, {typeEnum: 'CHANGE'}, function (result) {
                var __result = result || [];

                $(__result).each(function(i,item){
                    __dataListChangeBusiness.push({id:item,name:me.resource.common[item]});
                });
                me.$formCapDoi.input_infoChange= FormService.createSelect('changebusiness-infoChange',__dataListChangeBusiness , 'id', 1, false, true);
            });
            console.log('CHANGE >>>',__dataListChangeBusiness);


        }
        var listStatusBusiness = function() {

            var __dataTypeTaskBusiness  = [];
            $.postJSON(url.load_enum, {typeEnum: 'STATUS'}, function (result) {
                var __result = result || [];

                $(__result).each(function(i,item){
                    __dataTypeTaskBusiness.push({id:item,name:me.resource.common[item]});
                });

                me.$form.input_typeTask = FormService.createSelect('homebusiness-type-task', __dataTypeTaskBusiness, 'id', 1, false, false);
                me.$form.input_typeTask.setValue('CAP_MOI');
                me.$form.input_typeTask.on('change', function(){
                    me.__isCheckNameSave =false;
                    var valTypkeTask = me.$form.input_typeTask.getValue();
                    if(valTypkeTask == "CAP_MOI")
                    {
                        FormService.displayContent(me.$form.div_homebusiness_create,'show');
                        FormService.displayContent(me.$form.div_endbusiness_create,'hide');
                        FormService.displayContent(me.$form.div_changebusiness_create,'hide');
                        FormService.displayContent(me.$form.div_pausebusiness_create,'hide');
                    }
                    else if(valTypkeTask == "CAP_DOI")
                    {
                        FormService.displayContent(me.$form.div_homebusiness_create,'hide');
                        FormService.displayContent(me.$form.div_endbusiness_create,'hide');
                        FormService.displayContent(me.$form.div_changebusiness_create,'show');
                        FormService.displayContent(me.$form.div_pausebusiness_create,'hide');
                    }
                    else if(valTypkeTask == "TAM_NGUNG")
                    {
                        FormService.displayContent(me.$form.div_homebusiness_create,'hide');
                        FormService.displayContent(me.$form.div_endbusiness_create,'hide');
                        FormService.displayContent(me.$form.div_changebusiness_create,'hide');
                        FormService.displayContent(me.$form.div_pausebusiness_create,'show');
                    }
                    else if(valTypkeTask == "CHAM_DUT")
                    {
                        FormService.displayContent(me.$form.div_homebusiness_create,'hide');
                        FormService.displayContent(me.$form.div_endbusiness_create,'show');
                        FormService.displayContent(me.$form.div_changebusiness_create,'hide');
                        FormService.displayContent(me.$form.div_pausebusiness_create,'hide');
                    }
                    //loadDistrict(me.$form.input_province.getValue());
                });
            });

        }
      /*  me.__dataTypeTaskBusiness = [
            {id: "CAP_MOI",  name: resource.common.type_task_new},
            {id: "CAP_DOI", name: resource.common.type_task_change},
            {id: "TAM_NGUNG",  name: resource.common.type_task_pause},
            {id: "CHAM_DUT",  name: resource.common.type_task_end}
        ];*/

        me.__listProvince = [];
        var loadProvince = function(){
            me.$formCapMoi.input_province = FormService.createSelect('homebusiness-province', [], 'id', 1, false, false);
            //me.$formCapMoi.input_province.setValue("");
            if(CommonService.isSuccess(me.__listProvince))
            {
                me.$formCapMoi.input_province = FormService.createSelect('homebusiness-province', me.__listProvince, 'id', 1, false, false);
                console.log('__listProvince_old>>',me.__listProvince);
            }
            else
            {
                $.postJSON(url.load_province, {}, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        $.each(__result.items || [], function(i, obj){
                            me.__listProvince.push({id: obj.uuid, code: obj.code, name: obj.name});
                        });
                        me.$formCapMoi.input_province = FormService.createSelect('homebusiness-province', me.__listProvince, 'id', 1, false, false);
                        console.log('__listProvince>>',me.__listProvince);
                    }
                });
            }
            me.$formCapMoi.input_province.on('change', function(){
                loadDistrict(me.$formCapMoi.input_province.getValue());
            });

        };
        me.__listDistrict = [];
        var loadDistrict = function(idProvince){
            me.$formCapMoi.input_district = FormService.createSelect('homebusiness-district', [], 'id', 1, false, false);
            //me.$form.input_district.setValue(value || "");

            if(CommonService.isSuccess(me.__listDistrict))
            {
                var __listProvinceQuery = [];
                $.each(me.__listDistrict || [], function(i, obj){
                    if(obj.province_ID == idProvince) {
                        __listProvinceQuery.push({id: obj.id,province_ID: obj.province_ID, code: obj.code, name: obj.name});
                    }
                });
                me.$formCapMoi.input_district= FormService.createSelect('homebusiness-district', __listProvinceQuery, 'id', 1, false, false);
                console.log('__listProvinceQuery>>',__listProvinceQuery);
            }
            else
            {
                $.postJSON(url.load_district, {}, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        $.each(__result.items || [], function(i, obj){
                            me.__listDistrict.push({id: obj.uuid,province_ID: obj.province_ID, code: obj.code, name: obj.name});
                        });
                        me.$formCapMoi.input_district = FormService.createSelect('homebusiness-district', me.__listDistrict, 'id', 1, false, false);
                        console.log('__listDistrict>>',me.__listDistrict);
                    }
                });
            }
            me.$formCapMoi.input_district.on('change', function(){
                loadWard(me.$formCapMoi.input_district.getValue());
            });
        };
        me.__listWard = [];
        var loadWard = function(idDistrict){
            me.$formCapMoi.input_ward = FormService.createSelect('homebusiness-ward', [], 'id', 1, false, false);
            //me.$formCapMoi.input_ward.setValue(value || "");

            if(CommonService.isSuccess(me.__listWard))
            {
                var __listWardQuery = [];
                $.each(me.__listWard || [], function(i, obj){
                    if(obj.district_ID == idDistrict) {
                        __listWardQuery.push({id: obj.id,district_ID: obj.district_ID, code: obj.code, name: obj.name});
                    }
                });
                me.$formCapMoi.input_ward= FormService.createSelect('homebusiness-ward', __listWardQuery, 'id', 1, false, false);
                console.log('__listWardQuery_change>>',me.__listWardQuery);
            }
            else
            {
                $.postJSON(url.load_ward, {}, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        $.each(__result.items || [], function(i, obj){
                            me.__listWard.push({id: obj.uuid,district_ID: obj.district_ID, code: obj.code, name: obj.name});
                        });
                        console.log('__listWard>>',me.__listWard);
                        me.$formCapMoi.input_ward = FormService.createSelect('homebusiness-ward', me.__listWard, 'id', 1, false, false);
                    }
                });
            }

        };

        me.__listAreaBusiness = [];
        var loadAreaBusiness = function(){
            me.$formCapMoi.input_areaBusiness = FormService.createSelect('homebusiness-areaBusiness', [], 'id', 1, false, false);
            //me.$form.input_areaBusiness.setValue(value || "");

            if(CommonService.isSuccess(me.__listAreaBusiness))
            {
                me.$formCapMoi.input_areaBusiness= FormService.createSelect('homebusiness-areaBusiness', me.__listAreaBusiness, 'id', 1, false, false);
            }
            else
            {
                $.postJSON(url.load_areaBusiness, {}, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        $.each(__result.items || [], function(i, obj){
                            me.__listAreaBusiness.push({id: obj.uuid, code: obj.code, name: obj.area});
                        });
                        me.$formCapMoi.input_areaBusiness = FormService.createSelect('homebusiness-areaBusiness',me.__listAreaBusiness, 'id', 1, false, false);
                        console.log('__listWard>>',me.__listAreaBusiness);
                    }
                });
            }

        };

//Load datetime
        var pauseDateStart = me.$formTamNgung.input_dateStart.datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate',function (ev) {
            pauseDateStart.hide();
        }).data('datepicker');
        me.$formTamNgung.input_dateStart.val(CommonService.getCurrentDate());

        var endDateEnd = me.$formChamDut.input_dateEnd.datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate',function (ev) {
            endDateEnd.hide();
        }).data('datepicker');
        me.$formChamDut.input_dateEnd.val(CommonService.getCurrentDate());

//Event=================================================================================
        me.$form.button_save.on('click', function(){
            if(me.checkSave() == false)
            {
                return;
            }

            var valTypkeTask = me.$form.input_typeTask.getValue();
            if(valTypkeTask == "CAP_MOI")
            {
                var _data = me.getDataCapMoi() || {};
                console.log('Save click - Type: CAP_MOI >>>',_data)
                $.postJSON(url.save_homebusiness, _data, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        me.notifySuccess(me.resource.validate.save_title, resource.validate.save_success);
                    }
                    else
                    {
                        me.notifyError(me.resource.validate.save_title, resource.validate.save_error, __result.errors || []);
                    }
                });
            }
            else if(valTypkeTask == "CAP_DOI")
            {
                var _data = me.getDataCapDoi() || {};
                console.log('Save click - Type: CAP_DOI >>>',_data)
                $.postJSON(url.save_changebusiness, _data, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];

                        me.notifySuccess(me.resource.validate.save_title, resource.validate.save_success);
                    }
                    else
                    {
                        me.notifyError(me.resource.validate.save_title, resource.validate.save_error, __result.errors || []);
                    }
                });
            }
            else if(valTypkeTask == "TAM_NGUNG")
            {
                var _data = me.getDataTamNgung() || {};
                console.log('Save click - Type: TAM_NGUNG >>>',_data)
                $.postJSON(url.save_pausebusiness, _data, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        me.notifySuccess(me.resource.validate.save_title, resource.validate.save_success);
                    }
                    else
                    {
                        me.notifyError(me.resource.validate.save_title, resource.validate.save_error, __result.errors || []);
                    }
                });
            }
            else if(valTypkeTask == "CHAM_DUT")
            {
                var _data = me.getDataChamDut() || {};
                console.log('Save click - Type: CHAM_DUT >>>',_data)
                $.postJSON(url.save_endbusiness, _data, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        me.notifySuccess(me.resource.validate.save_title, resource.validate.save_success);
                    }
                    else
                    {
                        me.notifyError(me.resource.validate.save_title, resource.validate.save_error, __result.errors || []);
                    }
                });
            }
            updateStatusHomeBusiness(valTypkeTask);

        }.createDelegate(this));



        var updateStatusHomeBusiness = function(status){
            var _status = status || '';
            var _data = {statusType: _status, idHomeBusiness:me.__id_homebusiness};
            $.postJSON(url.update_statusHomeBusiness, _data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    console.log('Update Status success'+status+">>>>",_data);
                }
                else
                {
                    console.log('Update Status error'+status+">>>>",_data);
                }
            });
        }
        me.__isCheckNameSave = false;
        var checkNameBusiness = function(){
            var _data = me.getDataCapMoi() || {};
            console.log('check click',_data)
            if(!CommonService.isSuccess(_data.nameBusiness))
            {
                me.notifyError(resource.validate.save_title, resource.validate.save_error_namebusiness);
                me.__isCheckNameSave =false;
                return false;
            }
            $.postJSON(url.check_name_business, _data, function (result) {
                var __result = result.items || [];
                console.log('__result check name',__result)
                var valTypkeTask = me.$form.input_typeTask.getValue();
                if (CommonService.isSuccess(__result)) {
                    //var __listProvince = [];
                    var __item = __result[0];

                    me.__id_homebusiness = __item.uuid;

                    if(valTypkeTask == "CAP_MOI") {
                        var html = '<p><i class="glyphicon glyphicon-remove form-control-feedback"></i> Đã tồn tại tên kinh doanh <button id="view-detail-task" type="button" class="btn btn-link">Xem chi tiết</button></p>';
                        me.$form.div_status_check.empty();
                        me.$form.div_status_check.append(html);
                        me.__isCheckNameSave = false;
                       me.eventbuttoncheckname();
                    }
                    else
                    {
                        var html = '<p><i class="glyphicon glyphicon-ok form-control-feedback"></i>' +
                            '<button id="view-detail-task" type="button"  class="btn btn-link">Xem chi tiết thông tin hộ kinh doanh </button></p>';
                        me.$form.div_status_check.empty();
                        me.$form.div_status_check.append(html);
                        me.__isCheckNameSave = true;
                        me.eventbuttoncheckname();
                    }
                    // me.notifySuccess(resource.validate.save_title, resource.validate.save_success);
                }
                else
                {
                    if(valTypkeTask == "CAP_MOI") {
                        var html = '<p><i class="glyphicon glyphicon-ok form-control-feedback"></i>' +
                            ' Bạn có thể đăng ký kinh doanh với tên này </p>';
                        me.$form.div_status_check.empty();
                        me.$form.div_status_check.append(html);
                        me.__isCheckNameSave = true;
                    }
                    else
                    {
                        var html = '<p><i class="glyphicon glyphicon-remove form-control-feedback"></i>' +
                            ' Không tồn tại tên đăng ký kinh doanh </p>';
                        me.$form.div_status_check.empty();
                        me.$form.div_status_check.append(html);
                        me.__isCheckNameSave = false;
                    }
                    // me.notifySuccess(resource.validate.save_title, resource.validate.save_error, __result.errors || []);
                }
            });
        }
        me.$form.input_nameBusiness.on('change',function(){
            me.__isCheckNameSave = false;
        }.createDelegate(this));
        me.$form.button_check.on('click', function(){
            checkNameBusiness();
        }.createDelegate(this));
      /*  me.$form.button_view_detail('click', function(){
            var _data = me.getData() || {};
            console.log('check click',_data)
            $.postJSON(url.check_name_business, _data, function (result) {
                var __result = result || {};
                console.log('__result check name',__result)

            });
        }.createDelegate(this));*/
        me.$form.div_title.on('click', function(){
            FormService.displayContent(me.$form.div_item);

        }.createDelegate(this));
        $('#abc').on('click', function(){

            officeDialog = new iNet.ui.ita.UtilsDialog({id:'homebusiness-detail-dialog'});
            //officeDialog.id =;

            officeDialog.show();
            var __data = {idhomebusines:'57e653999daa97153488d531'};

            var wgProvince = new iNet.ui.ita.HomeBusinessDetailDialog(__data);
            wgProvince.show();
            //this.fireEvent('adddialog-detail', this);

        }.createDelegate(this));

            $('#abc').on('click', function(){
                officeDialog = new iNet.ui.ita.UtilsDialog({id:'homebusiness-detail-dialog'});

                officeDialog.show();
                //this.fireEvent('adddialog-detail', this);

            }.createDelegate(this));




//Load Function=================================================================================
        loadProvince();
        loadDistrict();
        loadWard();
        loadAreaBusiness();
        listChangeBusiness();
        listStatusBusiness();
    };

    iNet.extend(iNet.ui.ita.HomeBusinessForm, iNet.ui.app.widget,{
        clearData:function(){
            this.__id_homebusiness = '';
        },
         getDataCapMoi: function(){
            var __data = {};
            __data.nameBusiness = this.$form.input_nameBusiness.val();
            __data.address = this.$formCapMoi.input_address.val();
            __data.province_ID = this.$formCapMoi.input_province.getValue();
            __data.district_ID = this.$formCapMoi.input_district.getValue();
            __data.ward_ID = this.$formCapMoi.input_ward.getValue();
            __data.phone = this.$formCapMoi.input_phone.val();
            __data.fax = this.$formCapMoi.input_fax.val();
            __data.email = this.$formCapMoi.input_email.val();
            __data.website = this.$formCapMoi.input_website.val();
            __data.areaBusiness_ID = this.$formCapMoi.input_areaBusiness.getValue();
             __data.dateSubmit = CommonService.getCurrentDate().dateToLong();
             __data.statusType= "CAP_MOI";
            return __data;
        },
        getDataCapDoi: function(){
            var __data = {};
            __data.homeBusiness_ID = this.__id_homebusiness;
            __data.infoChange = this.$formCapDoi.input_infoChange.getValue().toString();
            __data.dateSubmit = CommonService.getCurrentDate().dateToLong();

            return __data;
        },
        getDataTamNgung: function(data){
            var __data = {};
            __data.homeBusiness_ID =  this.__id_homebusiness;
            __data.dayofPause = this.$formTamNgung.input_dayofPause.val();
            __data.dateStart = this.$formTamNgung.input_dateStart.val().dateToLong();
            __data.reason = this.$formTamNgung.input_reason.val();
            __data.dateSubmit = CommonService.getCurrentDate().dateToLong();

            return __data;
        },
        getDataChamDut: function(data){
            var __data = {};
            __data.homeBusiness_ID =  this.__id_homebusiness;
            __data.dateEnd = this.$formChamDut.input_dateEnd.val().dateToLong();
            __data.reason = this.$formChamDut.input_reason.val();
            __data.dateSubmit = CommonService.getCurrentDate().dateToLong();

            return __data;
        },
        checkSave: function(){
            var valTypkeTask = this.$form.input_typeTask.getValue();
            if(this.$form.input_nameBusiness.val() == "")
            {
                this.notifyError(this.resource.validate.save_title, resource.validate.save_error_namebusiness);
                return false;
            }
            if(this.__isCheckNameSave == false)
            {
                this.notifyError(this.resource.validate.save_title, resource.validate.save_error_checkNameSave);
                return false;
            }
            if(valTypkeTask == "CAP_MOI")
            {
                var __data =  this.getDataCapMoi();

                if(__data.address == "")
                {
                    this.notifyError(this.resource.validate.save_title, resource.validate.save_error_address);
                    return false;
                }
                else if(__data.province_ID == "")
                {
                    this.notifyError(this.resource.validate.save_title, resource.validate.save_error_provincebusiness);
                    return false;
                }
                else if(__data.areaBusiness_ID == "")
                {
                    this.notifyError(this.resource.validate.save_title, resource.validate.save_error_areabusiness);
                    return false;
                }
                else if(__data.district_ID == "")
                {
                    this.notifyError(this.resource.validate.save_title, resource.validate.save_error_districtbusiness);
                    return false;
                }
                else if(__data.ward_ID == "")
                {
                    this.notifyError(this.resource.validate.save_title, resource.validate.save_error_wardbusiness);
                    return false;
                }

            }
            else if(valTypkeTask == "CAP_DOI")
            {
                var __data =  this.getDataCapDoi();
                if(__data.homeBusiness_ID == "")
                {
                    this.notifyError(this.resource.validate.save_title, resource.validate.save_error_changeHomeBusiness_ID);
                    return false;
                }
                if(__data.infoChange == "")
                {
                    this.notifyError(this.resource.validate.save_title, resource.validate.save_error_infoChange);
                    return false;
                }

            }
            else if(valTypkeTask == "TAM_NGUNG")
            {
                var __data =  this.getDataTamNgung();
                if(__data.dayofPause == "")
                {
                    this.notifyError(this.resource.validate.save_title, resource.validate.save_error_dayofPause);
                    return false;
                }
                else if(__data.dateStart == "")
                {
                    this.notifyError(this.resource.validate.save_title, resource.validate.save_error_dateStartPause);
                    return false;
                }
                else if(__data.reason == "")
                {
                    this.notifyError(this.resource.validate.save_title, resource.validate.save_error_reason);
                    return false;
                }
            }
            else if(valTypkeTask == "CHAM_DUT")
            {
                var __data =  this.getDataChamDut();
                if(__data.dateEnd == "")
                {
                    this.notifyError(this.resource.validate.save_title, resource.validate.save_error_end_dateEnd);
                    return false;
                }
                else if(__data.reason == "")
                {
                    this.notifyError(this.resource.validate.save_title, resource.validate.save_error_reason);
                    return false;
                }
            }
        }
    });
    var wgProvince = new iNet.ui.ita.HomeBusinessForm();
    wgProvince.show();
});