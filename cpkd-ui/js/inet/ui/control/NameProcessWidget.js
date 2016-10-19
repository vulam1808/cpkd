/**
 * Created by LamLe on 9/15/2016.
 */
// #PACKAGE: nameProcess-widget
// #MODULE: NameProcessWidget
$(function () {

    iNet.ns("iNet.ui","iNet.ui.ita");
    iNet.ui.ita.ChangeNameBusinessForm = function (config) {
        this.resource = {
            common: ita.resources.common,
            validate: ita.resources.validate
        };

        var url = {

            check_name_business: iNet.getUrl('ita/homebusiness/checknamebusiness'),
            update_name: iNet.getUrl('ita/homebusiness/changenamebusiness'),
            load_infoDetail: iNet.getUrl('ita/homebusiness/loadinfo')

        };
        this.$form = {


            button_view_detail:$('#view-detail-task'),
            button_check: $('#btn-check-nameBusiness'),
            div_status_check_capmoi: $('#status-nameBusiness-capmoi'),
            div_status_check_view: $('#status-nameBusiness-view'),
            div_status_check_info: $('#status-nameBusiness-info'),


            div_status_check: $('#status-nameBusiness'),
            input_nameBusiness: $('#changebusiness-nameBusiness')
        };

        var __config = config || {};

        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'nameProcess-widget';
        this.idHomeBusiness = __config.idHomeBusiness;
        this.idChangeBusiness = __config.idChangeBusiness;
        this.nameBusiness = __config.nameBusiness;
        iNet.ui.ita.ChangeNameBusinessForm.superclass.constructor.call(this);
        var me= this;
        var loadNameBusiness= function(){
            console.log(me.nameBusiness);
            me.setData(me.nameBusiness);
        };
        loadNameBusiness();



//Function load combobox ==========================================
        //Load info change

//Event=================================================================================
        this.saveName =  function(){
            var __data = this.getData();
            $.postJSON(url.update_name, __data, function (result) {
                var __result = result || {};
                console.log("Info Detail",__result);

            });

        };




        me.__isCheckNameSave = false;
        var checkNameBusiness = function(){
            var _data = me.getData() || {};
            console.log('check click',_data)
            if(!CommonService.isSuccess(_data.nameBusiness))
            {
                me.notifyError(me.resource.validate.save_title, me.resource.validate.save_error_namebusiness);
                me.__isCheckNameSave =false;
                return false;
            }
            $.postJSON(url.check_name_business, _data, function (result) {
                var __item = result || {};
                console.log('__result check name',__item)

                me.$form.div_status_check_info.empty();
                if (CommonService.isSuccess(__item)) {

                    FormService.displayContent( me.$form.div_status_check_info,'hide');
                    me.__id_homebusiness = __item.homeBusiness_ID;
                    FormService.displayContent( me.$form.div_status_check_capmoi,'show');

                    console.log('if',__item)
                    // me.notifySuccess(resource.validate.save_title, resource.validate.save_success);
                }
                else
                {

                    FormService.displayContent( me.$form.div_status_check_info,'show');
                    FormService.displayContent( me.$form.div_status_check_capmoi,'hide');

                        var html = '<p><i class="glyphicon glyphicon-ok form-control-feedback"></i>' +
                            ' Bạn có thể đăng ký kinh doanh với tên này </p>';
                        //me.$form.div_status_check.empty();
                    console.log('else',html)
                        me.$form.div_status_check_info.append(html);
                        me.__isCheckNameSave = true;

                    // me.notifySuccess(resource.validate.save_title, resource.validate.save_error, __result.errors || []);
                }
            });
        }

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

        $("#view-detail-task-1").on('click', function(){
            var __data = {homeBusinessID:me.idHomeBusiness};
            $.postJSON(url.load_infoDetail, __data, function (result) {
                var __result = result || {};
                console.log("Info Detail",__result);
                if (CommonService.isSuccess(__result)) {

                    var info = new iNet.ui.ita.InfoBusinessWidget(__result);
                    var officeDialog = new iNet.ui.ita.UtilsDialog({id:'homebusiness-detail-dialog'});
                    //officeDialog.id =;

                    officeDialog.show();
                }
                else
                {
                    me.notifyError(me.resource.validate.save_title, me.resource.validate.save_error, __result.errors || []);
                }
            });



            /*var wgProvince = new iNet.ui.ita.HomeBusinessDetailDialog(__data);
             wgProvince.show();*/
            //this.fireEvent('adddialog-detail', this);

        }.createDelegate(this));





    };

    iNet.extend(iNet.ui.ita.ChangeNameBusinessForm, iNet.ui.app.widget,{
        clearData:function(){
            this.__id_homebusiness = '';
        },
        getData: function(){
            var __data = {};
            __data.nameBusiness = this.$form.input_nameBusiness.val().toUpperCase();
            __data.idHomeBusiness = this.idHomeBusiness;
            __data.idChangeBusiness = this.idChangeBusiness;

            return __data;
        },
        setData: function(data){
            var __data = data || '';
            this.$form.input_nameBusiness.val(data);

            return __data;
        }
    });

});