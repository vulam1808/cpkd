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
        this.idInterface = 'view-info-detail';

        var me = this;
        me.HomeBusiness = __config.HomeBusiness || {};
        me.idHomeBusiness = me.HomeBusiness.uuid||'';
        me.statusType = __config.statusType || '';
        var loadInfoList = function()
        {
            if (CommonService.isSuccess(me.HomeBusiness)) {
                console.log('id view info detail',me.idHomeBusiness);
                console.log('statusType view info detail',me.statusType);
                console.log('HomeBusiness view info detail',me.HomeBusiness);
                var $div = {
                    div_Person: $('#content-person'),
                    div_listcareer: $('#content-listcareer'),
                    div_listcontributor: $('#content-listcontributor'),
                    div_capital: $('#content-capital')
                };
                var Person = me.HomeBusiness.objPersonRepresent || {};
                var $div_id_person = $.getCmp(__config.divIDPerson || 'personrepresent-widget-content');
                $div.div_Person.html('').append($div_id_person.html());
                $div_id_person.remove();
                    var jsPerson = new iNet.ui.ita.PersonRepresentWidget({
                        PersonRepresent: Person});
                    jsPerson.setReadonly();
                    jsPerson.show();




                var $div_id_capital = $.getCmp(__config.divIDCapital || 'capital-form-widget-content');
                $div.div_capital.html('').append($div_id_capital.html());
                $div_id_capital.remove();
                    var jsCapital = new iNet.ui.ita.CapitalFormWidget({
                        HomeBusiness: me.HomeBusiness});
                    jsCapital.setReadonly();
                    jsCapital.show();




                var $div_id_listcareer = $.getCmp(__config.divIDlistCareer || 'listcareer-widget-content');
                $div.div_listcareer.html('').append($div_id_listcareer.html());
                $div_id_listcareer.remove();
                var jslistcareer = new iNet.ui.ita.ListCareerListWidget({
                    idHomeBusiness: me.idHomeBusiness,
                    statusType: me.statusType
                });
                jslistcareer.setHideButtonAdd();
                jslistcareer.show();



                var $div_id_listcontributor = $.getCmp(__config.divIDlistContributor || 'listcontributor-widget-content');
                $div.div_listcontributor.html('').append($div_id_listcontributor.html());
                $div_id_listcontributor.remove();
                var jslistcontributor = new iNet.ui.ita.ListContributorListWidget({
                    idHomeBusiness: me.idHomeBusiness,
                    statusType: me.statusType
                });
                jslistcontributor.setHideButtonAdd();
                jslistcontributor.show();

            }
        };
        loadInfoList();


        var $itemDetail = $.getCmp(me.id);
        var $interface = $.getCmp(me.idInterface);
        if (iNet.isEmpty($itemDetail.html().replace(/ /gi, "").replace(/\n/gi, ""))){
            $itemDetail.html('').append($interface.html());
        }

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

            var objareaBusiness = __data.objAreaBusiness;
            if(CommonService.isSuccess(objareaBusiness))
            {
                this.$form.input_areaBusiness.val(objareaBusiness.area);
            }

            this.$form.input_address.val(__data.address);
            var objprovince = __data.objProvince;
            if(CommonService.isSuccess(objprovince))
            {
                this.$form.input_province.val(objprovince.name);
            }
            var objdistrict = __data.objDistrict;
            if(CommonService.isSuccess(objdistrict))
            {
                this.$form.input_district.val(objdistrict.name);
            }
            var objward = __data.objWard;
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
