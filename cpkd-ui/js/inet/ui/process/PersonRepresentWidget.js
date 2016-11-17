// #PACKAGE: personrepresent-widget
// #MODULE: PersonRepresentWidget

$(function() {


  iNet.ns("iNet.ui", "iNet.ui.ita");
  iNet.ui.ita.PersonRepresentWidget = function (config) {
      var me = this;
      var __config = config || {};
      iNet.apply(this, __config);// apply configuration
      me.id = this.id || 'personrepresent-widget';
      var resource = {
          common: ita.resources.common,
          validate: ita.resources.validate
      };
      me.$input = {
          nameRepresent: $('#'+me.id+' #personrepresent-txt-nameRepresent'),
          birthday: $('#'+me.id+' #personrepresent-txt-birthday'),
          gender: $('#'+me.id+' #personrepresent-txt-gender'),
          race: $('#'+me.id+' #personrepresent-txt-race'),
          regilion: $('#'+me.id+' #personrepresent-txt-regilion'),
          idnumber: $('#'+me.id+' #personrepresent-txt-idnumber'),
          issueDate: $('#'+me.id+' #personrepresent-txt-issueDate'),
          issuePlace: $('#'+me.id+' #personrepresent-txt-issuePlace'),
          addressResidence: $('#'+me.id+' #personrepresent-txt-addressResidence'),
          addressCurrent: $('#'+me.id+' #personrepresent-txt-addressCurrent')
      };
console.log("this.id",me.id);
      var url = {
          view: iNet.getUrl('ita/personrepresent/load'),
          update: iNet.getUrl('ita/personrepresent/update')

      };



      me.idHomeBusiness = __config.idHomeBusiness || '';
      me.statusType = __config.statusType || '';
      me.PersonRepresent = __config.PersonRepresent || {};
      me.idPersonRepresent= me.PersonRepresent.uuid || '';




    var loadGender = function(){
        var __result = [{id:'NU',name:resource.common.gender_nu},
        {id:'NAM',name:resource.common.gender_nam}];
        me.$input.gender = FormService.createSelect(me.id+' #personrepresent-txt-gender', __result, 'id', 1, false, false);
        me.$input.gender.setValue('NAM');
       /* if($('#personrepresent-txt-gender').length<=0) {

        }*/
    };
    loadGender();
//Load datetime

    var birthday = me.$input.birthday.datepicker({
      format: 'dd/mm/yyyy'
    }).on('changeDate',function (ev) {
      birthday.hide();
    }).data('datepicker');
      me.$input.birthday.val(CommonService.getCurrentDate());

    var issueDate = me.$input.issueDate.datepicker({
      format: 'dd/mm/yyyy'
    }).on('changeDate',function (ev) {
      issueDate.hide();
    }).data('datepicker');
      me.$input.issueDate.val(CommonService.getCurrentDate());

    /*$('#personrepresent-location-btn-save').on('click', function(){
        me.updatePerson();
    }.createDelegate(this));*/
//Update with taskID ===================================================================
      me.updatePerson = function() {
          var __data = me.getData() || {};
          console.log('updatePerson>>', __data);
          $.postJSON(url.update, __data, function (result) {
              var __result = me.loadData(result) || {};
              console.log('update>>', __result);
              if (CommonService.isSuccess(__result)) {
                  me.notifySuccess(resource.validate.save_title, resource.validate.update_success);
              } else {
                  me.notifyError(resource.validate.save_title, me.getNotifyContent(resource.validate.update_error, __result.errors || []));
              }
          });
      };
//Load with taskID =====================================================================
    var loadPerson = function(){
            me.loadData(me.PersonRepresent || {}) ;

    };
    loadPerson();
      iNet.ui.ita.PersonRepresentWidget.superclass.constructor.call(this);
  };

  iNet.extend(iNet.ui.ita.PersonRepresentWidget, iNet.ui.app.widget,{
      setReadonly: function(){
          this.$input.nameRepresent.prop('readonly', true);
          this.$input.birthday.prop('readonly', true);
          $('#'+this.id+' #personrepresent-txt-gender').prop('readonly', true);
          this.$input.race.prop('readonly', true);
          this.$input.regilion.prop('readonly', true);
          this.$input.idnumber.prop('readonly', true);
          this.$input.issueDate.prop('readonly', true);
          this.$input.issuePlace.prop('readonly', true);
          this.$input.addressResidence.prop('readonly', true);
          this.$input.addressCurrent.prop('readonly', true);


      },
      removeReadonly: function(){
          this.$input.nameRepresent.prop('readonly', false);
          this.$input.birthday.prop('readonly', false);
          $('#'+this.id+' #personrepresent-txt-gender').prop('readonly', false);
          this.$input.race.prop('readonly', false);
          this.$input.regilion.prop('readonly', false);
          this.$input.idnumber.prop('readonly', false);
          this.$input.issueDate.prop('readonly', false);
          this.$input.issuePlace.prop('readonly', false);
          this.$input.addressCurrent.prop('readonly', false);
          this.$input.addressResidence.prop('readonly', false);
      },
        getData: function () {
              //var __ownerData = this.ownerData || {};
              var __data = {};
                //Data pram
                __data.idHomeBusiness = this.idHomeBusiness;
                __data.statusType = this.statusType;
                __data.idPersonRepresent =this.idPersonRepresent;

              __data.nameRepresent = this.$input.nameRepresent.val();
              __data.birthday = (this.$input.birthday.val()||0).dateToLong();
              __data.gender = this.$input.gender.getValue();
              __data.race = this.$input.race.val();
              __data.regilion = this.$input.regilion.val();
              __data.idnumber = this.$input.idnumber.val();
              __data.issueDate = (this.$input.issueDate.val()||0).dateToLong();
              __data.issuePlace = this.$input.issuePlace.val();
            __data.addressCurrent = this.$input.addressCurrent.val();
            __data.addressResidence = this.$input.addressResidence.val();
              /*if(!iNet.isEmpty(__ownerData.uuid)){
               __data.uuid = __ownerData.uuid;
               }*/
              return __data;
        },
        loadData: function (data) {
              var __data = data || {};
             /* this.ownerData = __data;*/
            this.$input.nameRepresent.val(__data.nameRepresent);
             this.$input.birthday.val((__data.birthday || 0).longToDate());
            this.$input.gender.setValue(__data.gender);
            this.$input.race.val(__data.race);
            this.$input.regilion.val(__data.regilion);
            this.$input.idnumber.val(__data.idnumber);
            this.$input.issueDate.val((__data.issueDate||0).longToDate());
            this.$input.issuePlace.val(__data.issuePlace);
            this.$input.addressCurrent.val(__data.addressCurrent);
            this.$input.addressResidence.val(__data.addressResidence);


             /* if(!iNet.isEmpty(__ownerData.uuid)){
               __data.uuid = __ownerData.uuid;
               }*/
              return __data;
        }
  });



});