/**
 * Created by HS on 23/09/2016.
 */
// #PACKAGE:listcareer-form-dialog
// #MODULE: ListCareerFormDialog
$(function () {
    var resource = {
        common: ita.resources.common,
        validate: ita.resources.validate
    };
    var url = {
        load_cbbcareer: iNet.getUrl('ita/career/load'),
        load_listcareer:iNet.getUrl('ita/listcareer/load'),
        save: iNet.getUrl('ita/listcareer/save'),
        update: iNet.getUrl('ita/listcareer/update'),
        del: iNet.getUrl('ita/listcareer/delete')
    }
    var $input = {
        input_career_id: $('#career_id'),
        input_detail: $('#detail')

    };

    iNet.ns("iNet.ui","iNet.ui.ita");
    iNet.ui.ita.ListCareerFormDialog = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'listcareer-form-dialog';
        iNet.ui.ita.ListCareerFormDialog.superclass.constructor.call(this);
        //this.$element = $.getCmp(this.id);
        var me= this;
       // me.idhomebusines = '57e653999daa97153488d531';

        //load data to dropdown career
       me.__listCareer = [];
        var loadCBBCareer = function(){
            $input.input_career_id = FormService.createSelect('career_id', {}, 'id', 1, false, false);
            if(CommonService.isSuccess(me.__listCareer))
            {
                $input.input_career_id = FormService.createSelect('career_id', me.__listCareer, 'id', 1, false, false);
                console.log('__listCareer_old>>',me.__listCareer);
            }
            else {
                $.postJSON(url.load_cbbcareer, {}, function (result) {
                    //  var __result = me.getData() || {};
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                        //var __listProvince = [];
                        $.each(__result.items || [], function (i, obj) {
                            me.__listCareer.push({id: obj.uuid, name:obj.code +' - '+ obj.name,detail:obj.detail});
                        });
                        $input.input_career_id = FormService.createSelect('career_id', me.__listCareer, 'id', 1, false, false);

                        console.log('__listCareer>>', me.__listCareer);

                    }
                });

            }

        };
        $('#career_id').on('change',function(data){
            var  __data = data || {};
            console.log('eventchange',$input.input_career_id.getValue());
            $input.input_detail.val(__data.added.detail);
        });


        //load id theo homebusiness
        var loadformdialoglistcareer = function(){
            var __data = {idh:config.idhomebusines1};
            console.log('load>>', __data);
            /*$.postJSON(url.load_listcareer,__data, function () {
                var __result = me.getData() || {};
                console.log('show>>', __result);
            });*/
        }
        loadCBBCareer();
        loadformdialoglistcareer();
        //click button save on form dialog
        $('#listcareer-modal-btn-save').on('click', function(){
            var __data = me.getData() || {};
            console.log('saved>>', __data);

            $.postJSON(url.save, __data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {

                    me.notifySuccess(resource.validate.save_title, resource.validate.save_success);
                    me.ListCareerFormDialog().hide();
                } else {

                    me.notifyError(resource.validate.save_title, me.getNotifyContent(resource.validate.save_error, __result.errors || []));

                }
            });
        }.createDelegate(this));

    };

    iNet.extend(iNet.ui.ita.ListCareerFormDialog, iNet.ui.app.widget,{
        getData: function(){
            var __data = {};

           __data.career_id = $input.input_career_id.getValue();

            __data.detail = $input.input_detail.val();

            return __data;
        }

    });

});

