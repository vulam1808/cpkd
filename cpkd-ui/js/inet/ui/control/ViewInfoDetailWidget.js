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
        this.objBusiness = __config.HomeBusiness || {};
        this.idHomeBusiness = __config.idHomeBusiness;
        this.statusType = __config.statusType;
        iNet.ui.ita.ViewInfoDetailWidget.superclass.constructor.call(this);
        var loadInfoList = function()
        {
            if (CommonService.isSuccess(this.objBusiness)) {
                var $div = {
                    div_Person: $('#content-person'),
                    div_listcareer: $('#content-listcareer'),
                    div_listcontributor: $('#content-listcontributor'),
                    div_capital: $('#content-capital')
                };
                var Person = this.objBusiness.objPersonRepresent || {};
                var $div_id_person = $.getCmp(__config.divIDPerson || 'personrepresent-widget');
                if (CommonService.isSuccess(Person)) {
                    var jsPerson = new iNet.ui.ita.PersonRepresentWidget({PersonRepresent: Person});
                    jsPerson.setReadonly();
                    jsPerson.show();
                    $div.div_Person.html('').append($div_id_person.html());
                }
                var Capital = this.objBusiness || {};
                var $div_id_capital = $.getCmp(__config.divIDCapital || 'capital-form-widget');
                if (CommonService.isSuccess(Capital)) {
                    var jsCapital = new iNet.ui.ita.PersonRepresentWidget({HomeBusiness: Capital});
                    jsCapital.setReadonly();
                    jsCapital.show();
                    $div.div_capital.html('').append($div_id_capital.html());
                }


                var $div_id_listcareer = $.getCmp(__config.divIDlistCareer || 'listcareer-widget');

                var jslistcareer = new iNet.ui.ita.PersonRepresentWidget({
                    idHomeBusiness: this.idHomeBusiness,
                    statusType: this.statusType
                });
                jslistcareer.show();
                $div.div_listcareer.html('').append($div_id_listcareer.html());


                var $div_id_listcontributor = $.getCmp(__config.divIDlistContributor || 'listcontributor-widget');

                var jslistcareer = new iNet.ui.ita.PersonRepresentWidget({
                    idHomeBusiness: this.idHomeBusiness,
                    statusType: this.statusType
                });
                jslistcareer.show();
                $div.div_listcareer.html('').append($div_id_listcontributor.html());
            }
        };
        loadInfoList();
        var me = this;

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
        me.idHomeBusiness = __config.idHomeBusiness;
        me.statusType = __config.statusType;
        me.HomeBusiness = __config.HomeBusiness;
        var loadInfoDetail = function(){
            me.setInfo(me.HomeBusiness);


        };
        loadInfoDetail();


    };

    iNet.extend(iNet.ui.ita.ViewInfoDetailWidget, iNet.Component,{
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
