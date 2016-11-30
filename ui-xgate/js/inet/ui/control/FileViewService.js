// #PACKAGE: fileview
// #MODULE: FileViewService
$(function () {
    iNet.ns("iNet.ui.fileview");

    iNet.ui.fileview = function () {
        this.id = 'file-view-div';
        var self = this;
        var viewer = null;
        var parentPage = null;

        var url = {
            download: iNet.getUrl('firmtask/binary/download'),
            verify: iNet.getUrl('firmtask/binary/verification')
        };

        var $button = {
            back: $('#file-view-back-btn')
        };


        var setHeight = function(){
            if (viewer != null) {
                viewer.setHeight($(window).height() - 54);
            }
        };
        this.viewFile = function(docID, ext){
            if (viewer == null){
                viewer = new iNet.ui.form.ODFViewer({
                    id: 'file-view-iframe-content'
                });
                viewer.setVerifyUrl(url.verify);
                viewer.setDownloadUrl(url.download);
            }

            viewer.setExt(ext);
            viewer.setDocId(docID);
            viewer.load();
            self.show();
            setHeight();
        };
        this.setPageBack = function(page){
            parentPage = page;
        };

        $button.back.on('click', function(){
            if (parentPage != null){
                parentPage.show();
                self.hide();
            }
        });
        $(window).on('resize', function () {
            setHeight();
        });

        iNet.ui.fileview.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.fileview, iNet.ui.app.widget);
});
