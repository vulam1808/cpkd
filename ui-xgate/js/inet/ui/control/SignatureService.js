// #PACKAGE: signature
// #MODULE: SignatureService
$(function () {
    iNet.ns("iNet.ui.signature", "iNet.ui.signinfor");

    iNet.ui.signinfor = function () {
        this.id = 'signature-info-div';
        var $dialog =  $('#signature-info-div');
        var self = this;
        var selfData = [];

        var url = {
            signverify: iNet.getUrl('onegate/externaldata/signverify') //fileId
        };

        var $form = {
            signData: $("#signature-info-data-div"),
            subject: $("#signature-info-subject"),
            subjectDetail: $("#signature-info-subject-detail"),
            issuer: $("#signature-info-issuer"),
            issuerDetail: $("#signature-info-issuer-detail"),
            reason: $("#signature-info-reason-data"),
            signTime: $("#signature-info-signTime-data"),
            verified: $("#signature-info-verified-data"),
            signNoData: $("#signature-info-no-data-div"),
            paging: $("#signature-info-paging-div"),
            pagingIndex: $("#signature-info-paging-index"),
            pagingTotal: $("#signature-info-paging-total")
        };

        var $button = {
            close: $('#signature-info-div-close-btn'),
            back: $('#signature-info-paging-back'),
            next: $('#signature-info-paging-next')
        };

        $form.subject.on('click', function(){
            $form.subjectDetail.show();
            $form.subject.find('i').addClass('icon-minus').removeClass('icon-plus');
            $form.issuerDetail.hide();
            $form.issuer.find('i').addClass('icon-plus').removeClass('icon-minus');
        });
        $form.issuer.on('click', function(){
            $form.subjectDetail.hide();
            $form.subject.find('i').addClass('icon-plus').removeClass('icon-minus');
            $form.issuerDetail.show();
            $form.issuer.find('i').addClass('icon-minus').removeClass('icon-plus');
        });
        $button.back.on('click', function(){
            var __index = $form.pagingIndex.text();
            __index = __index - 1;
            __index = __index - 1;
            if (__index <= 0){
                __index = 0;
            }
            showData(__index);
        });
        $button.next.on('click', function(){
            var __index = $form.pagingIndex.text();
            __index = __index + 1;
            if (__index > selfData.length){
                __index = selfData.length;
            }
            showData(__index-1);
        });

        var showData = function(index){
            var __signs = selfData[index].signs || [];

            var __elementSubject = __signs[0].subject || {};
            for(var key in __elementSubject){
                $form.subjectDetail.find('[data-sign-info="'+key+'"]').text(__elementSubject[key] || "");
            }
            var __elementIssuer = __signs[0].issuer || {};
            for(var key in __elementIssuer){
                $form.issuerDetail.find('[data-sign-info="'+key+'"]').text(__elementIssuer[key] || "");
            }
            var __elementReason = selfData[index].reason || "";
            $form.reason.text(__elementReason);
            var __elementSignTime = selfData[index].signTime || 0;
            $form.signTime.text((__elementSignTime > 0) ? new Date(__elementSignTime).format('H:i:s d/m/Y') : "");
            var __elementVerified = selfData[index].verified || "";
            $form.verified.text(__elementVerified);

            if (selfData.length > 1){
                $form.paging.show();
                $form.pagingIndex.text(index + 1);
                $form.pagingTotal.text(selfData.length);
            } else {
                $form.paging.hide();
            }
        };

        this.setData = function (fileId) {
            $.postJSON(url.signverify, {fileId: fileId}, function (result) {
                var __elements = result.elements || [];
                if (__elements.length == 0){
                    $form.paging.hide();
                    $form.signData.hide();
                    $form.signNoData.show();
                } else {
                    $form.signData.show();
                    $form.signNoData.hide();
                    selfData = __elements || [];
                    showData(0);
                }
            });
        };
        this.show = function () {
            $dialog.modal('show');
        };
        this.hide = function () {
            $dialog.modal('hide');
        };

        var onClose = function(){
            self.hide();
        };

        $button.close.on('click', onClose);
    };

    iNet.extend(iNet.ui.signinfor, iNet.Component);

    iNet.ui.signature = function () {
        this.id = 'signature-view-div';
        var self = this;
        var parentPage = null;
        var dataSign = {};
        var signInfo = null;

        var resource = {
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            signfile: iNet.getUrl('onegate/externaldata/signfile'),
            downfile: iNet.getUrl('onegate/binary/download')
        };

        var $button = {
            back: $('#signature-back-btn'),
            submit: $('#signature-submit-btn'),
            lanhdao: $('#signature-mode-lanhdao-btn'),
            tochuc: $('#signature-mode-tochuc-btn')
        };

        this.setPageBack = function(page){
            parentPage = page;
        };
        this.setData = function(data){
            window.signature = self;
            var __data = data || {};
            console.log(">>Signature setData>>", __data);
            dataSign = {};
            dataSign.fileId = __data.uuid;
            dataSign.task = __data.taskId;
            dataSign.graph = __data.graphId;
            /*$.postJSON(url.downfile, {binary: dataSign.uuid}, function(result){
                console.log(">>downfile>>", result);
            });*/
        };
        this.signData = function(){
            dataSign.signdata = $('#signature-data').val();
            dataSign.signnote = $('#signature-note').val();

            $.postJSON(url.signfile, dataSign, function(result){
                var __result = result || {};
                if (__result.type == "ERROR"){
                    self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                } else {
                    self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                    parentPage.show();
                    self.hide();
                }
                //console.log(">>signfile>>", result);
            });
        };
        this.hideSubmit = function(){
            $button.submit.hide();
        };
        this.viewVerify = function(fileId){
            if (signInfo == null) {
                signInfo = new iNet.ui.signinfor();
            }

            signInfo.setData(fileId);
            signInfo.show();
        };

        var __html = '';
        __html+='<object codetype="application/java"\n';
        __html+='classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93"\n';
        __html+='name="signature" height="400px" width="100%">\n';
        __html+='<param name="codebase" value="http://www.inetcloud.vn/public/tool/">\n';
        __html+='<param name="code" value="bcy.vgca.Applet.mainApplet">\n';
        __html+='<param name="archive" value="Binhthuan_applet.jar">\n';
        __html+='<param name="mayscript" value="true">\n';
        __html+='<param name="type" value="application/x-java-applet;version=1.5">\n';
        __html+='<param name="scriptable" value="false">\n';
        __html+='<param name="func_ghi_du_lieu_len_form" value="ghi_du_lieu_len_form">\n';
        __html+='<param name="func_ToChuc_On_Off" value="{0}">\n';
        __html+='<param name="func_LanhDao_On_Off" value="{1}">\n';
        __html+='<comment>\n';
        __html+='<embed type="application/x-java-applet;version=1.5"\n';
        __html+='codebase="http://www.inetcloud.vn/public/tool/"\n';
        __html+='archive="Binhthuan_applet.jar"\n';
        __html+='code="bcy.vgca.Applet.mainform"\n';
        __html+='scriptable="true"\n';
        __html+='pluginspage="http://java.sun.com/products/plugin/index.html#download"\n';
        __html+='func_ghi_du_lieu_len_form="ghi_du_lieu_len_form" func_ToChuc_On_Off="{0}"\n';
        __html+='func_LanhDao_On_Off="{1}" height="400px" width="100%">\n';
        __html+='<noembed>\n';
        __html+='Can not be started because Java Plugin is not installed.\n';
        __html+='</noembed>\n';
        __html+='</comment>\n';
        __html+='</object>\n';

        var fnSign = function(lanhdao, tochuc){
            $('#signature-form').hide();

            $('#signature-form').find('object').remove();
            $('#signature-form').append(String.format(__html, tochuc, lanhdao));


            //$('#signature-form').find('[name="func_LanhDao_On_Off"]').attr('value', lanhdao);
            //$('#signature-form').find('[func_LanhDao_On_Off]').attr('func_LanhDao_On_Off', lanhdao);
            if (lanhdao == 'on') {
                $button.lanhdao.attr('disabled', 'disabled');
            } else {
                $button.lanhdao.removeAttr('disabled');
            }

            //$('#signature-form').find('[name="func_ToChuc_On_Off"]').attr('value', tochuc);
            //$('#signature-form').find('[func_ToChuc_On_Off]').attr('func_ToChuc_On_Off', tochuc);
            if (tochuc == 'on') {
                $button.tochuc.attr('disabled', 'disabled');
            } else {
                $button.tochuc.removeAttr('disabled');
            }

            setTimeout(function(){
                $('#signature-form').show();
            }, 1000);
        };

        $button.lanhdao.on('click', function(){
            fnSign('on', 'off');
        });
        $button.tochuc.on('click', function(){
            fnSign('off', 'on');
        });
        $button.submit.on('click', function(){
            self.signData();
        });
        $button.back.on('click', function(){
            if (parentPage != null){
                parentPage.show();
                self.hide();
            }
        });

        iNet.ui.signature.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.signature, iNet.ui.app.widget);
});
