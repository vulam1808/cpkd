// #PACKAGE: numberbusiness-widget
// #MODULE: NumberBusinessWidget

$(function() {


    iNet.ns("iNet.ui", "iNet.ui.ita");
    iNet.ui.ita.NumberBusinessWidget = function (config) {

        var resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };
        this.$inputNumber = {
            numberBusiness: $('#homebusiness-txt-numberBusiness'),
            button_process: $('#action-processNumber-btn')
        };

        var url = {
            //view: iNet.getUrl('ita/personrepresent/load'),
            // save: iNet.getUrl('ita/personrepresent/save'),
            update_numberBusinessHomeBusiness: iNet.getUrl('ita/business/updatenumberid'),
            update_statusProcess: iNet.getUrl('ita/businessprocess/updatestatus')
        };

        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'numberbusiness-widget';

        iNet.ui.ita.NumberBusinessWidget.superclass.constructor.call(this);


        var me = this;
        me.idHomeBusiness = __config.idHomeBusiness;
        me.taxCode = __config.taxCode;
        me.parent_ID=__config.parent_ID;
        me.statusType=__config.statusType;
        me.statusProcess=__config.statusProcess;
        //me.__id_homebusiness = '';
        var updateNumberBusinessHomeBusiness = function(data){
            var _data = data || '';
            // var _data = {taxCode: _taxcode};
            $.postJSON(url.update_numberBusinessHomeBusiness, _data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    me.$inputNumber.button_process.removeClass("hide");
                    //console.log('Update Taxcode success'+data+">>>>",_data);
                    me.notifySuccess(resource.validate.save_title, resource.validate.update_success);
                }
                else
                {
                    //console.log('Update Taxcode error'+data+">>>>",_data);
                    me.notifyError(resource.validate.save_title, me.getNotifyContent(resource.validate.save_error, __result.errors || []));
                }
            });
        }

        $('#numberbusiness-location-btn-update').on('click', function(){

            var __data = me.getDataNumberBusiness() || {};
            console.log('updatenumberBusiness>>', __data);

            updateNumberBusinessHomeBusiness(__data);
        }.createDelegate(this));
        var loadinfo = function()
        {
            console.log("numberBusiness",me.numberBusiness);
            if(me.numberBusiness != ""){
                me.$inputNumber.numberBusiness.val(me.numberBusiness);
                me.$inputNumber.button_process.removeClass("hide");
            }
        };
        this.$inputNumber.button_process.on('click',function(){
            var __data = {
                idHomeBusiness: me.idHomeBusiness,
                statusProcess:me.statusProcess,
                statusType:me.statusType,
                parent_ID:me.parent_ID
            };
            console.log("button_process data?>>>", __data);
            confirmDialog.params  = __data;
            confirmDialog.show();

        });
        var confirmDialog = me.confirmDialog(
            resource.validate.process_title, me.getNotifyContent(resource.validate.sure_process, ''), function () {
                if (!iNet.isEmpty(confirmDialog.params || {})) {
                    confirmDialog.hide();
                    $.postJSON(url.update_statusProcess, confirmDialog.params, function (result) {
                        var __result = result || {};
                        console.log("__result button process?>>>", __result);
                        buttonBack();
                    }/*, {
                     mask: me.getMask(),
                     msg: iNet.validate.process_success
                     }*/);
                }
            });
        var buttonBack = function(){
            console.log("Show ACT>>>", me.act);
            var __url = iNet.getUrl('cpkd/page/index')+'#menu-process-business';
            iNet.getLayout().window.location.href = __url;
            iNet.getLayout().parentParams={act: me.statusProcess};
        };
        loadinfo();


    };

    iNet.extend(iNet.ui.ita.NumberBusinessWidget, iNet.ui.app.widget,{
        getDataNumberBusiness: function () {

            var __data = {};

            __data.idHomeBusiness = this.idHomeBusiness;
            __data.numberBusiness = this.$inputNumber.numberBusiness.val();

            return __data;
        }
    });

    /*var wgProvince = new iNet.ui.ita.NumberBusinessWidget();
     wgProvince.show();*/

});