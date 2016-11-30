// #PACKAGE: scanner
// #MODULE: ScannerService
$(function () {
    iNet.ns("iNet.ui.scanner");

    iNet.ui.scanner = function () {
        this.id = 'scanner-view-div';
        var self = this;
        var parentPage = null;

        var resource = {
        };

        var url = {
            download: iNet.getUrl('docx/download'),
            scan: iNet.getUrl('scanner/upload')
        };

        var $form = {
            images: $('#scanner-images')
        };

        var $button = {
            back: $('#scanner-back-btn'),
            scan: $('#scanner-scan-btn'),
            upload: $('#scanner-upload-btn'),
            download: $('#scanner-download-btn')
        };
        $button.back.hide();

        this.setPageBack = function(page){
            parentPage = page;
            $button.back.show();
        };
        this.scan = function(){
            self.show();
            window.scan();
            $button.upload.hide();
            $button.download.hide();
        };

        var fnScanIndex = function(images, i, docID){
            console.log("__fnScan >>", i, docID);
            var __data = {};
            __data.scanner_mimetype1 = images[i].mimetype;
            __data.scanner_base1 = images[i].data;
            if (!iNet.isEmpty(docID)) {
                __data.docID = docID;
            }

            $.postJSON(url.scan, __data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    var __docID = __result.uuid || "";

                    console.log(">> scaner index >>", i, (images.length - 1), __result);
                    if (i >= (images.length - 1)) {
                        $button.download.attr('docID', __docID);
                        $button.download.show();
                        $button.back.trigger('click');
                    } else {
                        fnScanIndex(images, (i + 1), __docID);
                    }
                    //self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                } else {
                    $button.download.attr('docID', __docID);
                    $button.download.show();
                    $button.back.trigger('click');
                    //self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                }
            }, {
                mask: self.getMask(),
                msg: iNet.resources.ajaxLoading.processing
            });
        };

        $form.images.on('change', function(){
            if ($form.images.html() != ''){
                $button.upload.show();
            }
        });
        $button.scan.on('click', function(){
            window.scan();
            $button.upload.hide();
            $button.download.hide();
        });
        $button.upload.on('click', function(){
            if (window.imagesScanned.length > 0 ){
                fnScanIndex(window.imagesScanned, 0);
            } else {
                $button.back.trigger('click');
            }
        }.createDelegate(this));
        $button.download.on('click', function(){
            var __docID = $button.download.attr('docID') || "";
            if (!iNet.isEmpty(__docID)){
                $.postJSON(url.download, {docID: __docID}, function (result) {
                    var __result = result || {};
                    if (CommonService.isSuccess(__result)) {
                    }
                }, {
                    mask: self.getMask(),
                    msg: iNet.resources.ajaxLoading.processing
                });
            }
            self.fireEvent('back');
        }.createDelegate(this));
        $button.back.on('click', function(){
            self.fireEvent('back');
            if (parentPage != null){
                parentPage.show();
                self.hide();
            }
        }.createDelegate(this));

        iNet.ui.scanner.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.scanner, iNet.ui.app.widget);
});
