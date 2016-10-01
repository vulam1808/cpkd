/**
 * Created by LamLe on 9/15/2016.
 */
// #PACKAGE: homebusiness-form-view
// #MODULE: HomeBusinessViewTask
$(function () {

    iNet.ns("iNet.ui","iNet.ui.ita");
    iNet.ui.ita.HomeBusinessViewTask = function (config) {
        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };

        var url = {
            load_province: iNet.getUrl('ita/province/load'),
            load_district: iNet.getUrl('ita/district/load'),
            load_ward: iNet.getUrl('ita/ward/load'),
            load_areaBusiness: iNet.getUrl('ita/areabusiness/load'),

            load_enum: iNet.getUrl('ita/enums/load'),

            load_homebusiness: iNet.getUrl('ita/homebusiness/load'),

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
        var $form = {
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
        var $formCapMoi = {
            input_address: $('#homebusiness-address'),
            input_province: $('#homebusiness-province'),
            input_district: $('#homebusiness-district'),
            input_ward: $('#homebusiness-ward'),
            input_phone: $('#homebusiness-phone'),
            input_fax: $('#homebusiness-fax'),
            input_email: $('#homebusiness-email'),
            input_website: $('#homebusiness-website'),
            //dateSubmit:$('homebusiness-dateSubmit'),
            input_areaBusiness: $('#homebusiness-areaBusiness')
        };
        var $formCapDoi = {
            input_infoChange: $('#changebusiness-infoChange')
        };
        var $formTamNgung = {
            input_dayofPause: $('#pausebusiness-dayofPause'),
            input_dateStart: $('#pausebusiness-dateStart'),
            input_reason: $('#pausebusiness-reason')
        };
        var $formChamDut = {
            input_dateEnd: $('#endbusiness-dateEnd'),
            input_reason: $('#endbusiness-reason')
        };
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'homebusiness-div-view';
        iNet.ui.ita.HomeBusinessViewTask.superclass.constructor.call(this);
        var me= this;
        me.__id_homebusiness = '57e653999daa97153488d531';



//Function load combobox ==========================================
        //Load info change
        var listChangeBusiness = function() {
            var __dataListChangeBusiness = [];
            $.postJSON(url.load_enum, {typeEnum: 'CHANGE'}, function (result) {
                var __result = result || [];

                $(__result).each(function(i,item){
                    __dataListChangeBusiness.push({id:item,name:resource.common[item]});
                });
                $formCapDoi.input_infoChange= FormService.createSelect('changebusiness-infoChange',__dataListChangeBusiness , 'id', 1, false, true);
            });
            console.log('CHANGE >>>',__dataListChangeBusiness);


        }
        var listStatusBusiness = function() {

            var __dataTypeTaskBusiness  = [];
            $.postJSON(url.load_enum, {typeEnum: 'STATUS'}, function (result) {
                var __result = result || [];

                $(__result).each(function(i,item){
                    __dataTypeTaskBusiness.push({id:item,name:resource.common[item]});
                });

                $form.input_typeTask = FormService.createSelect('homebusiness-type-task', __dataTypeTaskBusiness, 'id', 1, false, false);
                $form.input_typeTask.setValue('CAP_MOI');
                $form.input_typeTask.on('change', function(){
                    me.__isCheckNameSave =false;
                    var valTypkeTask = $form.input_typeTask.getValue();
                    if(valTypkeTask == "CAP_MOI")
                    {
                        FormService.displayContent($form.div_homebusiness_create,'show');
                        FormService.displayContent($form.div_endbusiness_create,'hide');
                        FormService.displayContent($form.div_changebusiness_create,'hide');
                        FormService.displayContent($form.div_pausebusiness_create,'hide');
                    }
                    else if(valTypkeTask == "CAP_DOI")
                    {
                        FormService.displayContent($form.div_homebusiness_create,'hide');
                        FormService.displayContent($form.div_endbusiness_create,'hide');
                        FormService.displayContent($form.div_changebusiness_create,'show');
                        FormService.displayContent($form.div_pausebusiness_create,'hide');
                    }
                    else if(valTypkeTask == "TAM_NGUNG")
                    {
                        FormService.displayContent($form.div_homebusiness_create,'hide');
                        FormService.displayContent($form.div_endbusiness_create,'hide');
                        FormService.displayContent($form.div_changebusiness_create,'hide');
                        FormService.displayContent($form.div_pausebusiness_create,'show');
                    }
                    else if(valTypkeTask == "CHAM_DUT")
                    {
                        FormService.displayContent($form.div_homebusiness_create,'hide');
                        FormService.displayContent($form.div_endbusiness_create,'show');
                        FormService.displayContent($form.div_changebusiness_create,'hide');
                        FormService.displayContent($form.div_pausebusiness_create,'hide');
                    }
                    //loadDistrict($form.input_province.getValue());
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
            $formCapMoi.input_province = FormService.createSelect('homebusiness-province', [], 'id', 1, false, false);
            //$formCapMoi.input_province.setValue("");
            if(CommonService.isSuccess(me.__listProvince))
            {
                $formCapMoi.input_province = FormService.createSelect('homebusiness-province', me.__listProvince, 'id', 1, false, false);
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
                        $formCapMoi.input_province = FormService.createSelect('homebusiness-province', me.__listProvince, 'id', 1, false, false);
                        console.log('__listProvince>>',me.__listProvince);
                    }
                });
            }
            $formCapMoi.input_province.on('change', function(){
                loadDistrict($formCapMoi.input_province.getValue());
            });

        };
        me.__listDistrict = [];
        var loadDistrict = function(idProvince){
            $formCapMoi.input_district = FormService.createSelect('homebusiness-district', [], 'id', 1, false, false);
            //$form.input_district.setValue(value || "");

            if(CommonService.isSuccess(me.__listDistrict))
            {
                var __listProvinceQuery = [];
                $.each(me.__listDistrict || [], function(i, obj){
                    if(obj.province_ID == idProvince) {
                        __listProvinceQuery.push({id: obj.id,province_ID: obj.province_ID, code: obj.code, name: obj.name});
                    }
                });
                $formCapMoi.input_district= FormService.createSelect('homebusiness-district', __listProvinceQuery, 'id', 1, false, false);
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
                        $formCapMoi.input_district = FormService.createSelect('homebusiness-district', me.__listDistrict, 'id', 1, false, false);
                        console.log('__listDistrict>>',me.__listDistrict);
                    }
                });
            }
            $formCapMoi.input_district.on('change', function(){
                loadWard($formCapMoi.input_district.getValue());
            });
        };
        me.__listWard = [];
        var loadWard = function(idDistrict){
            $formCapMoi.input_ward = FormService.createSelect('homebusiness-ward', [], 'id', 1, false, false);
            //$formCapMoi.input_ward.setValue(value || "");

            if(CommonService.isSuccess(me.__listWard))
            {
                var __listWardQuery = [];
                $.each(me.__listWard || [], function(i, obj){
                    if(obj.district_ID == idDistrict) {
                        __listWardQuery.push({id: obj.id,district_ID: obj.district_ID, code: obj.code, name: obj.name});
                    }
                });
                $formCapMoi.input_ward= FormService.createSelect('homebusiness-ward', __listWardQuery, 'id', 1, false, false);
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
                        $formCapMoi.input_ward = FormService.createSelect('homebusiness-ward', me.__listWard, 'id', 1, false, false);
                    }
                });
            }

        };

        me.__listAreaBusiness = [];
        var loadAreaBusiness = function(){
            $formCapMoi.input_areaBusiness = FormService.createSelect('homebusiness-areaBusiness', [], 'id', 1, false, false);
            //$form.input_areaBusiness.setValue(value || "");

            if(CommonService.isSuccess(me.__listAreaBusiness))
            {
                $formCapMoi.input_areaBusiness= FormService.createSelect('homebusiness-areaBusiness', me.__listAreaBusiness, 'id', 1, false, false);
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
                        $formCapMoi.input_areaBusiness = FormService.createSelect('homebusiness-areaBusiness',me.__listAreaBusiness, 'id', 1, false, false);
                        console.log('__listWard>>',me.__listAreaBusiness);
                    }
                });
            }

        };

//Load datetime
        var pauseDateStart = $formTamNgung.input_dateStart.datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate',function (ev) {
            pauseDateStart.hide();
        }).data('datepicker');
        $formTamNgung.input_dateStart.val(CommonService.getCurrentDate());

        var endDateEnd = $formChamDut.input_dateEnd.datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate',function (ev) {
            endDateEnd.hide();
        }).data('datepicker');
        $formChamDut.input_dateEnd.val(CommonService.getCurrentDate());

//Event=================================================================================
        $form.button_save.on('click', function(){
            if(me.checkSave() == false)
            {
                return;
            }

            var valTypkeTask = $form.input_typeTask.getValue();
            if(valTypkeTask == "CAP_MOI")
            {
               // var _data = me.getDataCapMoi() || {};

                var __data = {_taskID : config.homeBusiness_ID} || {};
                console.log('Show Info- Type: CAP_MOI >>', __data);
                $.postJSON(url.load_homebusiness, __data, function (result) {

                    var __result = me.setDataCapMoi(result) || {};

                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        //me.notifySuccess(resource.validate.save_title, resource.validate.save_success);
                    }
                    else
                    {
                       // me.notifyError(resource.validate.save_title, resource.validate.save_error, __result.errors || []);
                    }
                });
            }
            else if(valTypkeTask == "CAP_DOI")
            {
                /*var _data = me.getDataCapDoi() || {};
                console.log('Save click - Type: CAP_DOI >>>',_data)
                $.postJSON(url.save_changebusiness, _data, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];

                        me.notifySuccess(resource.validate.save_title, resource.validate.save_success);
                    }
                    else
                    {
                        me.notifyError(resource.validate.save_title, resource.validate.save_error, __result.errors || []);
                    }
                });*/
                var __data = {_taskID : config.homeBusiness_ID} || {};
                console.log('Show Info- Type: CAP_DOI >>', __data);
                $.postJSON(url.save_changebusiness, __data, function (result) {

                    var __result = me.setDataCapDoi(result) || {};

                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        //me.notifySuccess(resource.validate.save_title, resource.validate.save_success);
                    }
                    else
                    {
                        // me.notifyError(resource.validate.save_title, resource.validate.save_error, __result.errors || []);
                    }
                });
            }
            else if(valTypkeTask == "TAM_NGUNG")
            {
                /*var _data = me.getDataTamNgung() || {};
                console.log('Save click - Type: TAM_NGUNG >>>',_data)
                $.postJSON(url.save_pausebusiness, _data, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        me.notifySuccess(resource.validate.save_title, resource.validate.save_success);
                    }
                    else
                    {
                        me.notifyError(resource.validate.save_title, resource.validate.save_error, __result.errors || []);
                    }
                });*/
                var __data = {_taskID : config.homeBusiness_ID} || {};
                console.log('Show Info- Type: CAP_DOI >>', __data);
                $.postJSON(url.save_pausebusiness, __data, function (result) {

                    var __result = me.setDataTamNgung(result) || {};

                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        //me.notifySuccess(resource.validate.save_title, resource.validate.save_success);
                    }
                    else
                    {
                        // me.notifyError(resource.validate.save_title, resource.validate.save_error, __result.errors || []);
                    }
                });
            }
            else if(valTypkeTask == "CHAM_DUT")
            {
                /*var _data = me.getDataChamDut() || {};
                console.log('Save click - Type: CHAM_DUT >>>',_data)
                $.postJSON(url.save_endbusiness, _data, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        me.notifySuccess(resource.validate.save_title, resource.validate.save_success);
                    }
                    else
                    {
                        me.notifyError(resource.validate.save_title, resource.validate.save_error, __result.errors || []);
                    }
                });*/
                var __data = {_taskID : config.homeBusiness_ID} || {};
                console.log('Show Info- Type: CAP_DOI >>', __data);
                $.postJSON(url.save_endbusiness, __data, function (result) {

                    var __result = me.setDataChamDut(result) || {};

                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        //me.notifySuccess(resource.validate.save_title, resource.validate.save_success);
                    }
                    else
                    {
                        // me.notifyError(resource.validate.save_title, resource.validate.save_error, __result.errors || []);
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
                var valTypkeTask = $form.input_typeTask.getValue();
                if (CommonService.isSuccess(__result)) {
                    //var __listProvince = [];
                    var __item = __result[0];

                    me.__id_homebusiness = __item.uuid;

                    if(valTypkeTask == "CAP_MOI") {
                        var html = '<p><i class="glyphicon glyphicon-remove form-control-feedback"></i> Đã tồn tại tên kinh doanh <button id="view-detail-task" type="button" class="btn btn-link">Xem chi tiết</button></p>';
                        $form.div_status_check.empty();
                        $form.div_status_check.append(html);
                        me.__isCheckNameSave = false;

                    }
                    else
                    {
                        var html = '<p><i class="glyphicon glyphicon-ok form-control-feedback"></i>' +
                            '<button id="view-detail-task" type="button"  class="btn btn-link">Xem chi tiết thông tin hộ kinh doanh </button></p>';
                        $form.div_status_check.empty();
                        $form.div_status_check.append(html);
                        me.__isCheckNameSave = true;

                    }
                    // me.notifySuccess(resource.validate.save_title, resource.validate.save_success);
                }
                else
                {
                    if(valTypkeTask == "CAP_MOI") {
                        var html = '<p><i class="glyphicon glyphicon-ok form-control-feedback"></i>' +
                            ' Bạn có thể đăng ký kinh doanh với tên này </p>';
                        $form.div_status_check.empty();
                        $form.div_status_check.append(html);
                        me.__isCheckNameSave = true;
                    }
                    else
                    {
                        var html = '<p><i class="glyphicon glyphicon-remove form-control-feedback"></i>' +
                            ' Không tồn tại tên đăng ký kinh doanh </p>';
                        $form.div_status_check.empty();
                        $form.div_status_check.append(html);
                        me.__isCheckNameSave = false;
                    }
                    // me.notifySuccess(resource.validate.save_title, resource.validate.save_error, __result.errors || []);
                }
            });
        }
        $form.input_nameBusiness.on('change',function(){
            me.__isCheckNameSave = false;
        }.createDelegate(this));
        $form.button_check.on('click', function(){
            checkNameBusiness();
        }.createDelegate(this));
      /*  $form.button_view_detail('click', function(){
            var _data = me.getData() || {};
            console.log('check click',_data)
            $.postJSON(url.check_name_business, _data, function (result) {
                var __result = result || {};
                console.log('__result check name',__result)

            });
        }.createDelegate(this));*/
        $form.div_title.on('click', function(){
            FormService.displayContent($form.div_item);

        }.createDelegate(this));




//Load Function=================================================================================
        loadProvince();
        loadDistrict();
        loadWard();
        loadAreaBusiness();
        listChangeBusiness();
        listStatusBusiness();
    };

    iNet.extend(iNet.ui.ita.HomeBusinessViewTask, iNet.ui.app.widget,{
        clearData:function(){
            this.__id_homebusiness = '';
        },
        /* getDataCapMoi: function(){
            var __data = {};
            __data.nameBusiness = $form.input_nameBusiness.val();
            __data.address = $formCapMoi.input_address.val();
            __data.province_ID = $formCapMoi.input_province.getValue();
            __data.district_ID = $formCapMoi.input_district.getValue();
            __data.ward_ID = $formCapMoi.input_ward.getValue();
            __data.phone = $formCapMoi.input_phone.val();
            __data.fax = $formCapMoi.input_fax.val();
            __data.email = $formCapMoi.input_email.val();
            __data.website = $formCapMoi.input_website.val();
            __data.areaBusiness_ID = $formCapMoi.input_areaBusiness.getValue();
             __data.dateSubmit = CommonService.getCurrentDate().dateToLong();
            return __data;
        },*/

        setDataCapMoi:function(data){
            var __data = data || {};
            __data.homeBusiness_ID = this.__id_homebusiness;
            $form.input_nameBusiness.val(__data.nameBusiness);
            $formCapMoi.input_address.val( __data.address);
            $formCapMoi.input_province.setValue(__data.province_ID);
            $formCapMoi.input_district.setValue(__data.district_ID);
            $formCapMoi.input_ward.setValue(__data.ward_ID);
            $formCapMoi.input_phone.val(__data.phone);
            $formCapMoi.input_fax.val( __data.fax);
            $formCapMoi.input_email.val( __data.email);
            $formCapMoi.input_website.val(__data.website);
            $formCapMoi.input_areaBusiness.setValue(__data.areaBusiness_ID);
          //  __data.dateSubmit = CommonService.dateSubmit.val().longToDate();
            return __data;
        },

        /*getDataCapDoi: function(){
            var __data = {};
            __data.homeBusiness_ID = this.__id_homebusiness;
            __data.infoChange = $formCapDoi.input_infoChange.getValue().toString();
            __data.dateSubmit = CommonService.getCurrentDate().dateToLong();

            return __data;
        },*/
        setDataCapDoi:function(data){
            var __data = data || {};
            __data.homeBusiness_ID = this.__id_homebusiness;
            $formCapDoi.input_infoChange.getValue(__data.infoChange).toString();
            //__data.dateSubmit = CommonService.dateSubmit.val().longToDate();

            return __data;
        },

        /*getDataTamNgung: function(data){
            var __data = {};
            __data.homeBusiness_ID =  this.__id_homebusiness;
            __data.dayofPause = $formTamNgung.input_dayofPause.val();
            __data.dateStart = $formTamNgung.input_dateStart.val().dateToLong();
            __data.reason = $formTamNgung.input_reason.val();
            __data.dateSubmit = CommonService.getCurrentDate().dateToLong();

            return __data;
        },*/
        setDataTamNgung:function(data){
            var __data = data || {};
            $formTamNgung.input_dayofPause.val( __data.dayofPause);
            __data.dateStart = $formTamNgung.input_dateStart.val().longToDate();
            $formTamNgung.input_reason.val( __data.reason);
          //  __data.dateSubmit = CommonService.dateSubmit.val().longToDate();

            return __data;
        },
       /* getDataChamDut: function(data){
            var __data = {};
            __data.homeBusiness_ID =  this.__id_homebusiness;
            __data.dateEnd = $formChamDut.input_dateEnd.val().dateToLong();
            __data.reason = $formChamDut.input_reason.val();
            __data.dateSubmit = CommonService.getCurrentDate().dateToLong();

            return __data;
        },*/
        setDataChamDut:function(data){
            var __data = data || {};
            __data.homeBusiness_ID =  this.__id_homebusiness;
            __data.dateEnd = $formChamDut.input_dateEnd.val().longToDate();
            $formChamDut.input_reason.val(__data.reason);
           // __data.dateSubmit = CommonService.dateSubmit.val().longToDate();

            return __data;
        }

    });
    var wgProvince = new iNet.ui.ita.HomeBusinessViewTask();
    wgProvince.show();
});