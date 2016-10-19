/**
 * Created by HS on 21/09/2016.
 */
// #PACKAGE: task-process
// #MODULE: TaskProcessWidget

$(function() {


    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.TaskProcessWidget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration

        this.id = __config.id || 'task-proccess-widget';
        //this.idTab = __config.idTab || 'view-info-div';
        this.idInterface = 'view-info-detail';

        var me = this;
        me.HomeBusiness = __config.HomeBusiness || {};
        me.idHomeBusiness = me.HomeBusiness.uuid||'';
        me.statusType = __config.statusType || '';



        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };
        me.$formTask = {
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
            update_taskBusiness: iNet.getUrl('ita/business/updateobject'),

            load_province: iNet.getUrl('ita/province/load'),
            load_district: iNet.getUrl('ita/district/load'),
            load_ward: iNet.getUrl('ita/ward/load'),
            load_areaBusiness: iNet.getUrl('ita/areabusiness/load')
        };
//Function load combobox ==========================================
        //Load info change



        var __listProvince = [];
        var loadProvince = function(){
            me.$formTask.input_province = FormService.createSelect('homebusiness-province-task', [], 'id', 1, false, false);
            //me.$formTask.input_province.setValue("");
            if(CommonService.isSuccess(__listProvince))
            {
                me.$formTask.input_province = FormService.createSelect('homebusiness-province-task', __listProvince, 'id', 1, false, false);
                console.log('__listProvince_old>>',__listProvince);
            }
            else
            {
                $.postJSON(url.load_province, {}, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        $.each(__result.items || [], function(i, obj){
                            __listProvince.push({id: obj.uuid, code: obj.code, name: obj.name});
                        });
                        me.$formTask.input_province = FormService.createSelect('homebusiness-province-task', __listProvince, 'id', 1, false, false);
                        if(CommonService.isSuccess(me.HomeBusiness))
                        {
                            me.$formTask.input_province.setValue(me.HomeBusiness.province_ID || '');
                        }

                        console.log('__listProvince>>',__listProvince);
                    }
                });
            }
            me.$formTask.input_province.on('change', function(){
                loadDistrict(me.$formTask.input_province.getValue());
            });

        };
        var __listDistrict = [];
        var loadDistrict = function(idProvince){
            me.$formTask.input_district = FormService.createSelect('homebusiness-district-task', [], 'id', 1, false, false);
            //me.$formTask.input_district.setValue(value || "");

            if(CommonService.isSuccess(__listDistrict))
            {
                var __listDistrictQuery = [];
                $.each(__listDistrict || [], function(i, obj){
                    if(obj.province_ID == idProvince) {
                        __listDistrictQuery.push({id: obj.id,province_ID: obj.province_ID, code: obj.code, name: obj.name});
                    }
                });
                me.$formTask.input_district= FormService.createSelect('homebusiness-district-task', __listDistrictQuery, 'id', 1, false, false);
                console.log('__listDistrictQuery>>',__listDistrictQuery);
            }
            else
            {
                $.postJSON(url.load_district, {}, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        $.each(__result.items || [], function(i, obj){
                            __listDistrict.push({id: obj.uuid,province_ID: obj.province_ID, code: obj.code, name: obj.name});
                        });
                        me.$formTask.input_district = FormService.createSelect('homebusiness-district-task', __listDistrict, 'id', 1, false, false);
                        if(CommonService.isSuccess(me.HomeBusiness))
                        {
                            me.$formTask.input_district.setValue(me.HomeBusiness.district_ID || '');
                        }


                        console.log('__listDistrict>>',__listDistrict);
                    }
                });
            }
            me.$formTask.input_district.on('change', function(){
                loadWard(me.$formTask.input_district.getValue());
            });
        };
        var __listWard = [];
        var loadWard = function(idDistrict){
            me.$formTask.input_ward = FormService.createSelect('homebusiness-ward-task', [], 'id', 1, false, false);
            //me.$formCapMoi.input_ward.setValue(value || "");

            if(CommonService.isSuccess(__listWard))
            {
                var __listWardQuery = [];
                $.each(__listWard || [], function(i, obj){
                    if(obj.district_ID == idDistrict) {
                        __listWardQuery.push({id: obj.id,district_ID: obj.district_ID,  name: obj.name});
                    }
                });
                me.$formTask.input_ward= FormService.createSelect('homebusiness-ward-task', __listWardQuery, 'id', 1, false, false);
                console.log('__listWardQuery_change>>',__listWardQuery);
            }
            else
            {
                $.postJSON(url.load_ward, {}, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        $.each(__result.items || [], function(i, obj){
                            __listWard.push({id: obj.uuid,district_ID: obj.district_ID, code: obj.code, name: obj.name});
                        });
                        console.log('__listWard>>',__listWard);
                        if(CommonService.isSuccess(me.HomeBusiness))
                        {
                            me.$formTask.input_ward.setValue(me.HomeBusiness.ward_ID || '');
                        }
                        me.$formTask.input_ward = FormService.createSelect('homebusiness-ward-task', __listWard, 'id', 1, false, false);
                    }
                });
            }

        };

        var __listAreaBusiness = [];
        var loadAreaBusiness = function(){
            me.$formTask.input_areaBusiness = FormService.createSelect('homebusiness-areaBusiness-task', [], 'id', 1, false, false);
            //me.$formTask.input_areaBusiness.setValue(value || "");

            if(CommonService.isSuccess(__listAreaBusiness))
            {
                me.$formTask.input_areaBusiness= FormService.createSelect('homebusiness-areaBusiness-task', __listAreaBusiness, 'id', 1, false, false);
            }
            else
            {
                $.postJSON(url.load_areaBusiness, {}, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        $.each(__result.items || [], function(i, obj){
                            __listAreaBusiness.push({id: obj.uuid, code: obj.code, name: obj.area});
                        });
                        me.$formTask.input_areaBusiness = FormService.createSelect('homebusiness-areaBusiness-task',__listAreaBusiness, 'id', 1, false, false);
                        if(CommonService.isSuccess(me.HomeBusiness))
                        {
                            me.$formTask.input_areaBusiness.setValue(me.HomeBusiness.areaBusiness_ID || '');
                        }

                        console.log('__listAreaBusiness>>',__listAreaBusiness);
                    }
                });
            }

        };


        me.updateTask = function() {
            var __data = me.getData() || {};
            console.log('updatePerson>>', __data);
            $.postJSON(url.update_taskBusiness, __data, function (result) {
               // var __result = me.loadData(result) || {};
                console.log('update>>', result);
                if (CommonService.isSuccess(result)) {
                    me.notifySuccess(resource.validate.save_title, resource.validate.update_success);
                } else {
                    me.notifyError(resource.validate.save_title, me.getNotifyContent(resource.validate.update_error, __result.errors || []));
                }
            });
        };
        var loadInfoDetail = function(){
            me.setInfo(me.HomeBusiness || {});

            //me.setReadonly();
        };

        loadProvince();
        loadDistrict();
        loadWard();
        loadAreaBusiness();
        loadInfoDetail();
        iNet.ui.ita.TaskProcessWidget.superclass.constructor.call(this);

    };

    iNet.extend(iNet.ui.ita.TaskProcessWidget, iNet.ui.app.widget,{
        setReadonly: function(){

            this.$formTask.input_areaBusiness.prop('readonly', true);
            this.$formTask.input_address.prop('readonly', true);
            this.$formTask.input_province.prop('readonly', true);
            this.$formTask.input_district.prop('readonly', true);
            this.$formTask.input_ward.prop('readonly', true);
            this.$formTask.input_phone.prop('readonly', true);
            this.$formTask.input_fax.prop('readonly', true);
            this.$formTask.input_email.prop('readonly', true);
            this.$formTask.input_website.prop('readonly', true);
        },

        setInfo : function (data) {

            var __data = data || {};

            /*this.$formTask.input_areaBusiness.setValue(__data.areaBusiness_ID);
            this.$formTask.input_province.setValue(__data.province_ID);
            this.$formTask.input_district.setValue(__data.district_ID);
            this.$formTask.input_ward.setValue(__data.ward_ID);*/
            //$('#homebusiness-province-task').setValue(__data.areaBusiness_ID);

            /*$('#homebusiness-province-task').setValue(__data.province_ID);
            $('#homebusiness-district-task').setValue(__data.district_ID);
            $('#homebusiness-ward-task').setValue(__data.ward_ID);*/





            this.$formTask.input_address.val(__data.address);
            this.$formTask.input_phone.val(__data.phone);
            this.$formTask.input_fax.val(__data.fax);
            this.$formTask.input_email.val(__data.email);
            this.$formTask.input_website.val(__data.website);

            return __data;
        },
        getData: function () {
            //var __ownerData = this.ownerData || {};
            var __data = {};
            //Data pram
            __data.idHomeBusiness = this.idHomeBusiness;
            __data.statusType = this.statusType;
            __data.address = this.$formTask.input_address.val();
            __data.province_ID = this.$formTask.input_province.getValue();
            __data.district_ID = this.$formTask.input_district.getValue();
            __data.ward_ID = this.$formTask.input_ward.getValue();
            __data.phone = this.$formTask.input_phone.val();
            __data.fax = this.$formTask.input_fax.val();
            __data.email = this.$formTask.input_email.val();
            __data.website = this.$formTask.input_website.val();
            __data.areaBusiness_ID = this.$formTask.input_areaBusiness.getValue();




            return __data;
        }
    });


});
