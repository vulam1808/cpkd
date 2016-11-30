// #PACKAGE: xgate-ui-procedure-detail-service
// #MODULE: XGateProcedureDetailService
$(function () {
  iNet.ns('iNet.ui.admin');
  iNet.ui.admin.ProcedureDetailWidget = function (config) {
    var __config = config || {};
    iNet.apply(this, __config);// apply configuration
    this.id = this.id || 'procedure-detail-widget';

    iNet.ui.admin.ProcedureDetailWidget.superclass.constructor.call(this) ;
    var me= this;
    this.$toolbar = {
      CREATE: $('#procedure-btn-create'),
      SAVE: $('#procedure-btn-save'),
      BACK: $('#procedure-btn-back')
    };
    this.resource = {
      procedure: iNet.resources.xgate.admin.procedure,
      errors: iNet.resources.errors,
      constant: iNet.resources.constant,
      validate: iNet.resources.validate
    };

    var confirmFileDeleteDialog= null;

    this.$filesContainer= $('#procedure-files-container');
    this.$infoContainer = $('#procedure-info-container');
    this.$form = $('#procedure-frm-detail');
    this.$file = $('#procedure-files');
    this.$fileLabel = $('#procedure-files-label');
    this.$fileRemove = $('#procedure-files-remove');
    this.$btnCollapse = $('#procedure-info-collapse');

    this.$input = {
      industry: $('#procedure-select-industry'),
      level: $('#procedure-select-level'),
      subject: $('#procedure-txt-subject'),
      code: $('#procedure-txt-code'),
      content: $('#procedure-txt-content'),
      hours: $('#procedure-txt-hours'),
      isPostOffice: $('#procedure-chk-isPostOffice'),
      maxTimeWait: $('#procedure-txt-maxTimeWait'),
      serviceLevel3: $('#procedure-chk-servicel3'),
      serviceLevel4: $('#procedure-chk-servicel4')
    };

    this.industrySelect = new iNet.ui.form.select.Select({
      id: this.$input.industry.prop('id'),
      formatResult: function (item) {
        var __item = item || {};
        var __children = __item.children || [];
        var $option = $(__item.element);
        var __pattern = $option.data('pattern') || '__:__';
        if (__children.length > 0) {
          return String.format('<span class="badge badge-warning"><i class="icon-book"></i></span> {0}', __item.text)
        }
        return String.format('<span class="label label-info">{0}</span> {1}', __pattern, __item.text);
      },
      formatSelection: function (item) {
        var __item = item || {};
        var $option = $(__item.element);
        var __pattern = $option.data('pattern') || '__:__';
        return String.format('<span class="label label-info" style="height: auto !important;">{0}</span> {1}', __pattern, __item.text);
      }

    });
    this.industrySelect.on('change', function(){
      var __industry= me.industrySelect.getData();
      var $option = $(__industry.element);
      me.$input.code.val($option.data('pattern'));
    });

    this.levelSelect = new iNet.ui.form.select.Select({
      id: this.$input.level.prop('id'),
      formatResult: function (item) {
        var __item = item || {};
        return String.format('<span><i class="icon-building"></i> {0}</span>', __item.text);
      },
      formatSelection: function (item) {
        var __item = item || {};
        return String.format('<span><i class="icon-building"></i> {0}</span>', __item.text);
      }
    });

    this.$redactorContent = this.$input.content.redactor({
      autoresize: false,
      mobile:true,
      lang: 'vi',
      source: true
    });

    var createFileDeleteDialog = function() {
      if (!confirmFileDeleteDialog) {
        confirmFileDeleteDialog = new iNet.ui.dialog.ModalDialog({
          id : 'procedure-modal-confirm-file-delete',
          title : iNet.resources.constant.del_title,
          content : iNet.resources.constant.del_content,
          buttons : [{
            text : iNet.resources.message.button.ok,
            cls: 'btn-danger',
            icon : 'icon-ok icon-white',
            fn : function() {
              var __data = this.getData();
              var __dialog = this;
              var $li =__data.element;
              var __uuid = $li.attr('data-id');
              if(!iNet.isEmpty(__uuid)) {
                $.postJSON(iNet.getUrl('onegate/material/delete'), {procedure: __data.procedure, contentID: __uuid}, function(result){
                  __dialog.hide();
                  if (result == "SUCCESS"){
                    $li.remove();
                    me.resize();
                  }
                })
              }
            }
          }, {
            text : iNet.resources.message.button.cancel,
            icon : 'icon-remove',
            fn : function() {
              this.hide();
            }
          }]
        });
      }
      confirmFileDeleteDialog.show();
      return confirmFileDeleteDialog;
    };

    this.$filesContainer.on('click', 'a[data-file-action]', function() {
      var $el = $(this);
      var __action = $el.attr('data-file-action');
      var $li = $($el.parent());
      var __ownerData = me.ownerData;
      switch (__action) {
        case 'delete':
          var __dialog = createFileDeleteDialog();
          $.each(__ownerData.attachments || [], function(i, file) {
            if (file.contentID == $li.attr('data-id')){
              __dialog.setContent(String.format(iNet.resources.constant.del_content, file.filename));
            }
          });
          __dialog.setData({element: $li , procedure: __ownerData.uuid});
          __dialog.show();
          break;
        case 'download':
          $.download(iNet.getUrl('glbgate/prodmaterial/download'), {
            procedure: __ownerData.uuid,
            contentID: $li.attr('data-id')
          });
          break;
        case 'used':
          var __dialog = me.createConfirmExportUsed();
          __dialog.setData({procedure: __ownerData.uuid, contentID: $li.attr('data-id'), exportUsed:true,fn: function(result) {
            if (result == "SUCCESS"){
              $li.find('[data-file-action="used"]').remove();
              $li.find('[data-span="footer"]').remove();
              $li.append('<a data-file-action="notused" href="javascript:;"> '+me.resource.procedure.exportNoUsed+'</a><span data-span="footer"> ]</span>');
            }
          }});
          __dialog.setContent(me.resource.procedure.exportUsedContent);
          __dialog.show();
          break;
        case 'notused':
          var __dialog = me.createConfirmExportUsed();
          __dialog.setData({procedure: __ownerData.uuid, contentID: $li.attr('data-id'), exportUsed:false,fn: function(result) {
            if (result == "SUCCESS"){
              $li.find('[data-file-action="notused"]').remove();
              $li.find('[data-span="footer"]').remove();
              $li.append('<a data-file-action="used" href="javascript:;"> '+me.resource.procedure.exportUsed+'</a><span data-span="footer"> ]</span>');
            }
          }});
          __dialog.setContent(me.resource.procedure.exportNoUsedContent);
          __dialog.show();
          break;
      }
    });

    var readURL = function (input) {
      var files = input.files || [];
      me.setFiles(files);
    };


    if (__config.bootstrap == 'v2'){
      this.$fileLabel.click(function () {
        me.$file.trigger('click');
      }.createDelegate(this));
    }

    this.$file.change(function () {
      readURL(this);
    });

    this.$fileRemove.click(function () {
      me.clearFile();
    });//.createDelegate(this));


    this.validate = new iNet.ui.form.Validate({
      id: this.id,
      rules: [
        {
          id: this.$input.subject.prop('id'),
          validate: function (v) {
            if (iNet.isEmpty(v))
              return 'Tên thủ tục không được để rỗng';
          }
        },
        {
          id: this.$input.code.prop('id'),
          validate: function (v, $control) {
            if (iNet.isEmpty(v))
              return 'Mã thủ tục không được để rỗng';
          }
        },
        {
          id: 'procedure-select-industry-container',
          validate: function () {
            if(me.industrySelect) {
              var __item = me.industrySelect.getData() || {};
              if (iNet.isEmpty(__item.id)) {
                return 'Lĩnh vực không được để rỗng';
              }
            }
          }
        }
      ]
    });

    this.$toolbar.BACK.on('click', function () {
      this.hide();
      this.fireEvent('back', this);
    }.createDelegate(this));

    this.$toolbar.CREATE.on('click', function () {
      this.resetData();
    }.createDelegate(this));

    this.$toolbar.SAVE.on('click', function () {
      if (this.check()) {
        var me = this;
        var __data = this.getData();
        var loading;
        if (iNet.isEmpty(__data.procedure)) { //create\
          this.$form.ajaxSubmit({
            url: iNet.getUrl('glbgate/prodmaterial/create'),
            data: __data,
            beforeSubmit: function (arr, $form, options) {
             loading = new iNet.ui.form.LoadingItem({
               maskBody: me.$form,
               msg: iNet.resources.ajaxLoading.saving
             });
            },
            success: function (result) {
              if(loading){
                loading.destroy();
              }
              var __result = result || {};
              me.setData(__result);
              me.fireEvent('saved', true, __result);
            }
          });
        } else {
          this.$form.ajaxSubmit({
            url: iNet.getUrl('onegate/material/update'),
            data: __data,
            beforeSubmit: function (arr, $form, options) {
              loading = new iNet.ui.form.LoadingItem({
                maskBody: me.$form,
                msg: iNet.resources.ajaxLoading.saving
              });
            },
            success: function (result) {
              if(loading){
                loading.destroy();
              }
              var __result = result || {};
              //me.setData(__result);
              if (CommonService.isSuccess(__result)) {
                me.notifySuccess(me.resource.constant.save_title, me.resource.constant.save_success);
                me.loadById(__data.procedure, 'profile');
              } else {
                me.notifyError(me.resource.constant.save_title, me.getNotifyContent(me.resource.constant.save_error, __result.errors || []));
              }
            }
          });
        }
      }
    }.createDelegate(this));

    this.$btnCollapse.on('click', function(){
      var $icon= $(this).find('i');
      if(me.$infoContainer.is(':hidden')) {
        $icon.attr('class', 'icon-chevron-up');
        me.$infoContainer.show();
      } else {
        me.$infoContainer.hide();
        $icon.attr('class', 'icon-chevron-down');
      }
      me.resize();
    });

    $(window).on('resize', function(){
      me.resize();
    });

  };

  iNet.extend(iNet.ui.admin.ProcedureDetailWidget, iNet.ui.app.widget, {
    resize: function(){
      this.$input.content.prev().height($(window).height() - 195);
    },
    check: function(){
      return this.validate.check();
    },
    setIndustry: function(industry){
      this.industrySelect.setData(industry);
      var $option = $(industry.element);
      this.$input.code.val($option.data('pattern'));
    },
    resetData: function(){
      this.ownerData={};
      this.$input.serviceLevel3.prop('checked', false);
      this.$input.serviceLevel4.prop('checked', false);
      this.$input.isPostOffice.prop('checked', false);
      this.$redactorContent.setCode('');
      var __industry = this.industrySelect.getData();
      var $option = $(__industry.element);
      this.$input.code.val($option.data('pattern'));
      if(this.hasPattern()){
        this.industrySelect.disable();
        this.levelSelect.disable();
      } else {
        this.industrySelect.enable();
        this.levelSelect.enable();
      }
      this.$input.subject.val('').focus();
      this.$input.hours.val('0');
        this.$input.maxTimeWait.val('0');
      this.fillFiles([]);
      this.clearFile();
    },
    setData: function(data) {
      var __data= data || {serviceL3: false, serviceL4: false, attachments: []};
      this.ownerData = iNet.apply(this.ownerData || {},__data);
      __data = this.ownerData;

      this.$input.subject.val(__data.subject);
      this.$input.code.val(__data.code);
      var $optionIndustry = this.$input.industry.find(String.format('option[value="{0}"]', __data.industry));
      this.industrySelect.setData({id: __data.code, text: __data.industry, element: $optionIndustry});
      var $optionLevel = this.$input.level.find(String.format('option[value="{0}"]', __data.level));
      this.levelSelect.setData({id: __data.level, text: $optionLevel.text(), element: $optionLevel});
      if(this.hasPattern()){
        this.industrySelect.disable();
        this.levelSelect.disable();
        this.$input.subject.prop('disabled', true);
      } else {
        this.levelSelect.enable();
        this.industrySelect.enable();
        this.$input.subject.prop('disabled', false);
      }
      this.$input.serviceLevel3.prop('checked', __data.serviceL3);
      this.$input.serviceLevel4.prop('checked', __data.serviceL4);
      this.$input.isPostOffice.prop('checked', __data.postOffice);

      if(!iNet.isEmpty(this.profile)){
        this.$input.subject.prop('disabled', true);
        this.$input.code.prop('disabled', true);
        this.$input.industry.prop('disabled', true);
        this.$input.level.prop('disabled', true);


        /*this.$input.serviceLevel3.prop('checked', __data.serviceL3);
        this.$input.serviceLevel4.prop('checked', __data.serviceL4);*/
      }

      this.$input.hours.val(__data.hours || 0);
      this.$input.maxTimeWait.val(__data.maxTimeWait || 0);
      this.$redactorContent.setCode(__data.html || '');

      this.clearFile();
      this.fillFiles(__data.attachments || []);
      this.check();
    },
    getData: function(){
      var __industry = this.industrySelect.getData();
      var __level = this.levelSelect.getData();
      var __data = {
        code: this.$input.code.val(),
        level: __level.id,
        industry: __industry.id,
        //serviceL3: this.$input.serviceLevel3.prop('checked'),
        serviceL4: this.$input.serviceLevel4.prop('checked'),
        postOffice: this.$input.isPostOffice.prop('checked')? "true": "false",
        html: this.$redactorContent.getCode()
      };
      var __ownerData = this.ownerData || {};
      if(!iNet.isEmpty(__ownerData.uuid)) {
        __data.procedure= __ownerData.uuid;
      }
      if(!iNet.isEmpty(this.profile)){
        __data.profileID= this.profile;
        __data.materialUUID= __ownerData.uuid;
      }
      return __data;
    },
    loadById: function(uuid, profile) {
      var me= this;
      var params = {};
      params.procedure = uuid;

      if (!iNet.isEmpty(profile)){
        me.profile = profile;
        //params.profile = profile;
      }

        $.getJSON(iNet.getUrl('onegate/prodload'), params, function (result) {
            var __result = result || {};
            if (CommonService.isSuccess(__result)) {
                me.setData(__result);
            } else {
                me.notifyError(me.resource.constant.warning_title, me.getNotifyContent(me.resource.constant.warning_error, __result.errors || []));
                me.$toolbar.BACK.trigger('click');
            }
        }, {
            mask: this.getMask(),
            msg: iNet.resources.ajaxLoading.loading
        });
    },
    clearFile: function () {
      var me = this;
      this.$fileLabel.removeClass('selected').data('title', me.resource.procedure.clickHere);
      this.$fileLabel.find('span[data-title]').attr('data-title', '...');
      this.$file.val('');
    },
    setFiles: function (files) {
      var me = this;
      var __files = files || [];
      if (__files.length < 1) {
        return;
      }
      var __fileNames = [];
      for (var i = 0; i < __files.length; i++) {
        var __file = __files[i] || {};
        __fileNames.push(__file.name);
      }
      this.$fileLabel.addClass('selected').attr('data-title', me.resource.procedure.clickHere);
      if (__files.length == 1) {
        this.$fileLabel.find('span[data-title]').attr('data-title', __fileNames[0]);
      } else {
        this.$fileLabel.find('span[data-title]').attr('data-title', String.format('{0} '+ me.resource.procedure.file+': {1} ', __fileNames.length, __fileNames.join(', ')));
      }
    },
    fillFiles: function(files){
      var me = this;
      this.$filesContainer.empty();
      var __files = files || [];
      var __html= '';
      for (var i = 0; i < __files.length; i++) {
        var __file = __files[i] || {};
        var __action = '<span data-span="header">[ </span>';
        __action += '<a data-file-action="delete" class="remove" href="javascript:;"><i class="icon-trash red"></i></a>';

        __action += '<span data-span="middle"> | </span>';
        if (!!__file.exportUsed) {
          __action += '<a data-file-action="notused" href="javascript:;"> '+me.resource.procedure.exportNoUsed+'</a>';
        } else {
          __action += '<a data-file-action="used" href="javascript:;"> '+me.resource.procedure.exportUsed+'</a>';
        }

        __action += '<span data-span="footer"> ]</span>';

        if (iNet.isEmpty(__file.pathDownload)){
          __file.pathDownload = "javascript:;";
        }

        __html += String.format('<li data-id="{0}"><a href="{4}"><i class="{1}"></i>{2}</a> {3}</li>', __file.contentID, iNet.FileFormat.getFileIcon(__file.filename), __file.filename, __action, __file.pathDownload);
      }
      this.$filesContainer.append(__html);
      if (__files.length > 0 && this.$filesContainer.is(':hidden')) {
        this.$filesContainer.show();
      }
      this.resize();
    },
    createConfirmExportUsed: function () {
      if (!this.confirmExportUsed) {
        this.confirmExportUsed = new iNet.ui.dialog.ModalDialog({
          id: 'modal-procedure-confirm-export-used',
          title: 'Biểu mẫu kết xuất ?',
          buttons: [
            {
              text: 'Đồng ý',
              cls: 'btn-primary',
              icon: 'icon-ok icon-white',
              fn: function () {
                var __dialog = this;
                var __data = __dialog.getData();
                var __procedure = __data.procedure;
                var __contentID = __data.contentID;
                var __exportUsed = __data.exportUsed;
                var __fn = __data.fn || iNet.emptyFn;
                if (!iNet.isEmpty(__contentID)) {
                  $.postJSON(iNet.getUrl('onegate/material/exportUsed'), {
                    procedure: __procedure,
                    contentID:__contentID,
                    exportUsed: __exportUsed
                  }, function (result) {
                    var __result = result || {};
                    if (__result.uuid != 'FAIL') {
                      __fn(__result);
                      __dialog.hide();

                    }
                  }, {mask: this.getMask(), msg: '&nbsp;'});
                }
              }
            },
            {
              text: 'Đóng',
              icon: 'icon-remove',
              fn: function () {
                this.hide();
              }
            }
          ]
        });

      }
      return this.confirmExportUsed;
    }
  });
});