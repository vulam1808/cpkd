// #PACKAGE: helloworld-office-location
// #MODULE: OfficeLocationWidget
$(function () {
  iNet.ns('iNet.ui.helloworld');
  iNet.ui.helloworld.OfficeLocationWidget = function (config) {
    var __config = config || {};
    iNet.apply(this, __config);// apply configuration
    this.id = this.id || 'helloworld-office-form-widget';

    iNet.ui.helloworld.OfficeLocationWidget.superclass.constructor.call(this) ;

    this.$input = {
      $name: $('#office-txt-name'),
      $brief: $('#office-txt-brief'),
      $address: $('#office-txt-address'),
      $address2: $('#office-txt-address2'),
      $ward: $('#office-txt-ward'),
      $district: $('#office-txt-district'),
      $city: $('#office-txt-city'),
      $country: $('#office-txt-country'),
      $phone: $('#office-txt-phone'),
      $fax: $('#office-txt-fax'),
      $email: $('#office-txt-email'),
      $website: $('#office-txt-website'),
      $member: $('#office-select-member')
    };

    this.$toolbar = {
      CREATE: $('#office-location-btn-create'),
      SAVE: $('#office-location-btn-save'),
      BACK: $('#office-location-btn-back')
    };

    this.validate = new iNet.ui.form.Validate({
      id: this.id,
      rules: [
        {
          id: this.$input.$name.prop('id'),
          validate: function (v) {
            if (iNet.isEmpty(v))
              return 'Tên đơn vị không được để rỗng';
          }},{
          id: this.$input.$address.prop('id'),
          validate: function (v, $control) {
            if (iNet.isEmpty(v))
              return 'Địa chỉ không được để rỗng';
          }}
      ]
    });

    this.$toolbar.SAVE.on('click', function () {
      if (this.validate.check()) {
        var me = this;
        var __data = this.getData();
        console.log(__data);
      }
    }.createDelegate(this));

    this.$toolbar.BACK.on('click', function () {
      this.hide();
      this.fireEvent('back', this);
    }.createDelegate(this));


    this.$toolbar.CREATE.on('click', function() {
      this.resetData();
    }.createDelegate(this));

  };
  iNet.extend(iNet.ui.helloworld.OfficeLocationWidget, iNet.ui.Widget, {
    getData: function () {
      var __ownerData = this.ownerData || {};
      var __data = {};
      __data.name = this.$input.$name.val();
      __data.brief = this.$input.$brief.val();
      __data.address1 = this.$input.$address.val();
      __data.address2 = this.$input.$address2.val();
      __data.ward = this.$input.$ward.val();
      __data.district = this.$input.$district.val();
      __data.city = this.$input.$city.val();
      __data.country = this.$input.$country.val();
      __data.phone = this.$input.$phone.val();
      __data.fax = this.$input.$fax.val();
      __data.email = this.$input.$email.val();
      __data.website = this.$input.$website.val();
      if(!iNet.isEmpty(__ownerData.uuid)){
        __data.uuid = __ownerData.uuid;
      }
      return __data;
    },
    setData: function (data) {
      var me = this;
      var __data = data || {};
      this.ownerData = __data;
      this.$input.$brief.val(__data.brief);
      this.$input.$address.val(__data.address1);
      this.$input.$address2.val(__data.address2);
      this.$input.$ward.val(__data.ward);
      this.$input.$district.val(__data.district);
      this.$input.$city.val(__data.city);
      this.$input.$country.val(__data.country|| 'Việt Nam');
      this.$input.$phone.val(__data.phone);
      this.$input.$fax.val(__data.fax);
      this.$input.$email.val(__data.email);
      this.$input.$website.val(__data.website);
      this.$input.$name.val(__data.name).focus();
      FormUtils.showButton(this.$toolbar.SAVE, true);
      this.check();
    },
    resetData: function () {
      var me = this;
      this.ownerData = {};
      this.getEl().find('input').val('');
      this.$input.$name.focus();
      FormUtils.showButton(this.$toolbar.SAVE, true);
    },
    check: function(){
      return this.validate.check();
    }
  });
});