// #PACKAGE: personrepresent-widget
// #MODULE: PersonRepresentWidget

$(function() {
  var resource = {
    common: ita.resources.common,
    validate: ita.resources.validate
  };
  var $input = {
    $nameRepresent: $('#personrepresent-txt-nameRepresent'),
    $birthday: $('#personrepresent-txt-birthday'),
    $gender: $('#personrepresent-txt-gender'),
    $race: $('#personrepresent-txt-race'),
    $regilion: $('#personrepresent-txt-regilion'),
    $idnumber: $('#personrepresent-txt-idnumber'),
    $issueDate: $('#personrepresent-txt-issueDate'),
    $issuePlace: $('#personrepresent-txt-issuePlace')
  };

  var url = {
    view: iNet.getUrl('ita/personrepresent/load'),
    save: iNet.getUrl('ita/personrepresent/save'),
    update: iNet.getUrl('ita/personrepresent/update'),
    del: iNet.getUrl('ita/personrepresent/delete')
  };

  iNet.ns("iNet.ui", "iNet.ui.ita");
  iNet.ui.ita.PersonRepresentWidget = function (config) {
    var __config = config || {};
    iNet.apply(this, __config);// apply configuration
    this.id = this.id || 'personrepresent-widget';

    iNet.ui.ita.PersonRepresentWidget.superclass.constructor.call(this);


    var me = this;

    $('#personrepresent-location-btn-save').on('click', function(){
      var __data = me.getData() || {};
      console.log('saved>>', __data);

      $.postJSON(url.save, __data, function (result) {
        var __result = result || {};
        if (CommonService.isSuccess(__result)) {

          me.notifySuccess(resource.validate.save_title, resource.validate.save_success);
        } else {

          me.notifyError(resource.validate.save_title, me.getNotifyContent(resource.validate.save_error, __result.errors || []));
        }
      });
    }.createDelegate(this));

    //load
    $('#personrepresent-location-btn-load').on('click', function(){
      var __data = {personID : "57dfb34209206f1644d024b4"} || {};
      console.log('load>>', __data);

      $.postJSON(url.view, __data, function (result) {
        var __result = result || {};
        console.log('load12121>>', __result);
        if (CommonService.isSuccess(__result)) {

            me.loadData(__result);

        }
      });
    }.createDelegate(this));

  };

  iNet.extend(iNet.ui.ita.PersonRepresentWidget, iNet.ui.app.widget,{
    getData: function () {
      var __ownerData = this.ownerData || {};
      var __data = {};
      __data.nameRepresent = $input.$nameRepresent.val();
      __data.birthday = $input.$birthday.val();
      __data.gender = $input.$gender.val();
      __data.race = $input.$race.val();
      __data.regilion = $input.$regilion.val();
      __data.idnumber = $input.$idnumber.val();
      __data.issueDate = $input.$issueDate.val();
      __data.issuePlace = $input.$issuePlace.val();

      if(!iNet.isEmpty(__ownerData.uuid)){
       __data.uuid = __ownerData.uuid;
       }
      return __data;
    },
    loadData: function (data) {
      var __data = data || {};
     /* this.ownerData = __data;*/
      $input.$nameRepresent.val(__data.nameRepresent);
      $input.$birthday.val(__data.birthday);
      $input.$gender.val( __data.gender);
      $input.$race.val(__data.race);
      $input.$regilion.val(__data.regilion);
      $input.$idnumber.val(__data.idnumber);
      $input.$issueDate.val( __data.issueDate);
      $input.$issuePlace.val(__data.issuePlace);

     /* if(!iNet.isEmpty(__ownerData.uuid)){
       __data.uuid = __ownerData.uuid;
       }*/
      return __data;
    }
  });

  var wgProvince = new iNet.ui.ita.PersonRepresentWidget();
  wgProvince.show();

});