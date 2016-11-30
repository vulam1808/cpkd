/**
 * Created by LamLe on 9/15/2016.
 */
// #PACKAGE: homebusiness-form-view
// #MODULE: HomeBusinessViewTask
$(function () {

    iNet.ns("iNet.ui","iNet.ui.ita");
    iNet.ui.ita.HomeBusinessViewTask = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'homebusiness-div-view';
        iNet.ui.ita.HomeBusinessViewTask.superclass.constructor.call(this);
        var me= this;

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
            input_typeTask: $('#'+me.id+' #homebusiness-type-task'),
            button_save: $('#'+me.id+' #homebusiness-save-btn'),
            div_title:$('#'+me.id+' #homebusiness-title'),
            div_item:$('#'+me.id+' #homebusiness-item'),
            div_homebusiness_create:$('#'+me.id+' #homebusiness-item-create'),
            div_rehomebusiness_create:$('#'+me.id+' #rehomebusiness-item-create'),
            div_endbusiness_create:$('#'+me.id+' #endbusiness-item-create'),
            div_changebusiness_create:$('#'+me.id+' #changebusiness-item-create'),
            div_pausebusiness_create:$('#'+me.id+' #pausebusiness-item-create'),

            button_view_detail:$('#'+me.id+' #view-detail-task'),
            button_check: $('#'+me.id+' #btn-check-nameBusiness'),
            div_status_check: $('#'+me.id+' #status-nameBusiness'),
            input_nameBusiness: $('#'+me.id+' #homebusiness-nameBusiness')
        };

        this.$formCapMoi = {
            input_address: $('#'+me.id+' #homebusiness-address'),
            input_province: $('#'+me.id+' #homebusiness-province'),
            input_district: $('#'+me.id+' #homebusiness-district'),
            input_ward: $('#'+me.id+' #homebusiness-ward'),
            input_phone: $('#'+me.id+' #homebusiness-phone'),
            input_fax: $('#'+me.id+' #homebusiness-fax'),
            input_email: $('#'+me.id+' #homebusiness-email'),
            input_website: $('#'+me.id+' #homebusiness-website'),
            //dateSubmit:$('homebusiness-dateSubmit'),
            input_areaBusiness: $('#'+me.id+' #homebusiness-areaBusiness')
        };
        this.$formCapLai = {
            input_reason: $('#'+me.id+' #rehomebusiness-reason')
        };
        this.$formCapDoi = {
            input_infoChange: $('#'+me.id+' #changebusiness-infoChange')
        };
        this.$formTamNgung = {
            input_dayofPause: $('#'+me.id+' #pausebusiness-dayofPause'),
            input_dateStart: $('#'+me.id+' #pausebusiness-dateStart'),
            input_reason: $('#'+me.id+' #pausebusiness-reason')
        };
        this.$formChamDut = {
            input_dateEnd: $('#'+me.id+' #endbusiness-dateEnd'),
            input_reason: $('#'+me.id+' #endbusiness-reason')
        };

        me.statusType = __config.statusType;
        me.nameBusiness = __config.nameBusiness;
        me.objBusiness = __config.objBusiness;


        var loaddata = function(){
            $form.input_nameBusiness.val(me.nameBusiness);
            if(me.statusType == "CAP_MOI")
            {
                $form.input_typeTask.val(resource.common.CAP_MOI);
                FormService.displayContent($form.div_homebusiness_create,'show');
                FormService.displayContent($form.div_rehomebusiness_create,'hide');
                FormService.displayContent($form.div_endbusiness_create,'hide');
                FormService.displayContent($form.div_changebusiness_create,'hide');
                FormService.displayContent($form.div_pausebusiness_create,'hide');
                me.setDataCapMoi(me.objBusiness);
            }
            else if(me.statusType == "CAP_DOI")
            {
                $form.input_typeTask.val(resource.common.CAP_DOI);
                FormService.displayContent($form.div_homebusiness_create,'hide');
                FormService.displayContent($form.div_rehomebusiness_create,'hide');
                FormService.displayContent($form.div_endbusiness_create,'hide');
                FormService.displayContent($form.div_changebusiness_create,'show');
                FormService.displayContent($form.div_pausebusiness_create,'hide');
                me.setDataCapDoi(me.objBusiness);
            }
            else if(me.statusType == "TAM_NGUNG")
            {
                $form.input_typeTask.val(resource.common.TAM_NGUNG);
                FormService.displayContent($form.div_homebusiness_create,'hide');
                FormService.displayContent($form.div_rehomebusiness_create,'hide');
                FormService.displayContent($form.div_endbusiness_create,'hide');
                FormService.displayContent($form.div_changebusiness_create,'hide');
                FormService.displayContent($form.div_pausebusiness_create,'show');
                me.setDataTamNgung(me.objBusiness);
            }
            else if(me.statusType == "CHAM_DUT")
            {
                $form.input_typeTask.val(resource.common.CHAM_DUT);

                FormService.displayContent($form.div_homebusiness_create,'hide');
                FormService.displayContent($form.div_rehomebusiness_create,'hide');
                FormService.displayContent($form.div_endbusiness_create,'show');
                FormService.displayContent($form.div_changebusiness_create,'hide');
                FormService.displayContent($form.div_pausebusiness_create,'hide');
                me.setDataChamDut(me.objBusiness);
            }
            else if(me.statusType == "CAP_LAI")
            {
                $form.input_typeTask.val(resource.common.CAP_LAI);

                FormService.displayContent($form.div_homebusiness_create,'hide');
                FormService.displayContent($form.div_rehomebusiness_create,'show');
                FormService.displayContent($form.div_endbusiness_create,'hide');
                FormService.displayContent($form.div_changebusiness_create,'hide');
                FormService.displayContent($form.div_pausebusiness_create,'hide');
                me.setDataCapLai(me.objBusiness);
            }
        };
        loaddata();

    };

    iNet.extend(iNet.ui.ita.HomeBusinessViewTask, iNet.ui.app.widget,{
        clearData:function(){
            this.__id_homebusiness = '';
        },
        setDataCapMoi:function(data){
            var __data = data || {};
            __data.homeBusiness_ID = this.__id_homebusiness;

            this.$formCapMoi.input_address.val( __data.address);
            var nameProvince = __data.objProvince ||{};
            if(CommonService.isSuccess(nameProvince)) {
                this.$formCapMoi.input_province.val(nameProvince.name || '');
            }
            var namedistrict = __data.objDistrict ||{};
            if(CommonService.isSuccess(namedistrict)) {
                this.$formCapMoi.input_district.val(namedistrict.name || '');
            }
            var nameWard = __data.objWard ||{};
            if(CommonService.isSuccess(nameWard)) {
                this.$formCapMoi.input_ward.val(nameWard.name || '');
            }

            this.$formCapMoi.input_phone.val(__data.phone);
            this.$formCapMoi.input_fax.val( __data.fax);
            this.$formCapMoi.input_email.val( __data.email);
            this.$formCapMoi.input_website.val(__data.website);
            var nameArea = __data.objAreaBusiness ||{};
            if(CommonService.isSuccess(nameArea))
            {
                this.$formCapMoi.input_areaBusiness.val(nameArea.area || '');
            }

          //  __data.dateSubmit = CommonService.dateSubmit.val().longToDate();
            return __data;
        },
        setDataCapDoi:function(data){
            var __data = data || {};
            //__data.homeBusiness_ID = this.__id_homebusiness;
            var _info = __data.infoChange || [];
            var str ="";
            for ( var i=0, len=_info.length; i < len; i++ ){
                var strInfo = _info[i];
                console.log("_info>>>>",strInfo);

                str += '<label class="label label-sm label-success arrowed-in">"'+ita.resources.common[strInfo]+'"</label>'

            }
            this.$formCapDoi.input_infoChange.html('').append(str);
            //this.$formCapDoi.input_infoChange.val(__data.infoChange);
            //__data.dateSubmit = CommonService.dateSubmit.val().longToDate();

            return __data;
        },
        setDataCapLai:function(data){
            var __data = data || {};

            this.$formCapLai.input_reason.val(__data.reason);

            return __data;
        },
        setDataTamNgung:function(data){
            var __data = data || {};
            console.log("setDataTamNgung",__data);
            this.$formTamNgung.input_dayofPause.val( __data.dayofPause);
            this.$formTamNgung.input_dateStart.val(__data.dateStart.longToDate());
            this.$formTamNgung.input_reason.val( __data.reason);
          //  __data.dateSubmit = CommonService.dateSubmit.val().longToDate();

            return __data;
        },

        setDataChamDut:function(data){
            var __data = data || {};
            this.$formChamDut.input_dateEnd.val(__data.dateEnd.longToDate());
            this.$formChamDut.input_reason.val(__data.reason);
           // __data.dateSubmit = CommonService.dateSubmit.val().longToDate();

            return __data;
        }

    });
   /* var wgProvince = new iNet.ui.ita.HomeBusinessViewTask();
    wgProvince.show();*/
});