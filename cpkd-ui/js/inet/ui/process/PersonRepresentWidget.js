// #PACKAGE: personrepresent-widget
// #MODULE: PersonRepresentWidget

$(function() {


  iNet.ns("iNet.ui", "iNet.ui.ita");
  iNet.ui.ita.PersonRepresentWidget = function (config) {
      var resource = {
          common: ita.resources.common,
          validate: ita.resources.validate
      };
      this.$input = {
          nameRepresent: $('#personrepresent-txt-nameRepresent'),
          birthday: $('#personrepresent-txt-birthday'),
          gender: $('#personrepresent-txt-gender'),
          race: $('#personrepresent-txt-race'),
          regilion: $('#personrepresent-txt-regilion'),
          idnumber: $('#personrepresent-txt-idnumber'),
          issueDate: $('#personrepresent-txt-issueDate'),
          issuePlace: $('#personrepresent-txt-issuePlace')
      };

      var url = {
          view: iNet.getUrl('ita/personrepresent/load'),
          update: iNet.getUrl('ita/personrepresent/update')

      };
    var __config = config || {};
    iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'personrepresent-widget';
        this.idHomeBusiness = __config.idHomeBusiness;
        this.statusType = __config.statusType;
        this.PersonRepresent = __config.PersonRepresent;
        this.idPersonRepresent= __config.PersonRepresent.uuid;
    iNet.ui.ita.PersonRepresentWidget.superclass.constructor.call(this);


    var me = this;
    var loadGender = function(){
        var __result = [{id:'NU',name:resource.common.gender_nu},
        {id:'NAM',name:resource.common.gender_nam}];

          me.$input.gender = FormService.createSelect('personrepresent-txt-gender', __result, 'id', 1, false, false);
        me.$input.gender.setValue('NAM');

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
  };

  iNet.extend(iNet.ui.ita.PersonRepresentWidget, iNet.ui.app.widget,{
      setDisabled: function(){
          this.$input.nameRepresent.attr('disabled', 'disabled');
          this.$input.birthday.attr('disabled', 'disabled');
          this.$input.gender.attr('disabled', 'disabled');
          this.$input.race.attr('disabled', 'disabled');
          this.$input.regilion.attr('disabled', 'disabled');
          this.$input.idnumber.attr('disabled', 'disabled');
          this.$input.issueDate.attr('disabled', 'disabled');
          this.$input.issuePlace.attr('disabled', 'disabled');


      },
      removeDisabled: function(){
          this.$input.nameRepresent.removeAttr("disabled");
          this.$input.birthday.removeAttr("disabled");
          this.$input.gender.removeAttr("disabled");
          this.$input.race.removeAttr("disabled");
          this.$input.regilion.removeAttr("disabled");
          this.$input.idnumber.removeAttr("disabled");
          this.$input.issueDate.removeAttr("disabled");
          this.$input.issuePlace.removeAttr("disabled");
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

             /* if(!iNet.isEmpty(__ownerData.uuid)){
               __data.uuid = __ownerData.uuid;
               }*/
              return __data;
        }
  });



});