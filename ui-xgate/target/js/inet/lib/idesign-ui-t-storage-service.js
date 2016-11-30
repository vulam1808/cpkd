// #PACKAGE: idesign-ui-t-storage-service
// #MODULE: TStorage
$(function () {
    iNet.ns("iNet.ui.builder", "iNet.ui.builder.TStorage");

    iNet.ui.builder.TStorage = function () {
        this.id = 'storage-div';
        var self = this;

        var resource = {
            storage: iNet.resources.builder.storage,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            load_category: iNet.getUrl('cloud/designform/application'),
            load_storage: iNet.getUrl('cloud/designform/list'), //application, keyword, pageSize, pageNumber
            load_image: iNet.getUrl('cloud/designbinary/view'), //binary = templateID
            importPage: iNet.getUrl('cloud/designform/import') //application
        };


        var $button = {
            search: $('#storage-search-btn'),
            pageLeft: $('#storage-paging-left'),
            pageInfo: $('#storage-paging-info'),
            pageRight: $('#storage-paging-right'),
            pageRefresh: $('#storage-paging-refresh')
        };
        $button.pageInfo.text("0/0");

        var $form = {
            category: $('#storage-category-select'),
            keyword: $('#storage-keyword-txt'),
            list: $('#storage-list')
        };

        var __itemHtml = '';
        __itemHtml+='<div data-uuid="{0}" class="theme " title="{3}">';
        __itemHtml+='    <div class="theme-screenshot">';
        __itemHtml+='        <img src="{1}" alt="{3}">';
        __itemHtml+='    </div>';
        __itemHtml+='    <div class="theme-author">{2}</div>';
        __itemHtml+='    <h3 class="theme-name" title="{3}">{3}</h3>';
        __itemHtml+='    <div class="theme-actions" title="{3}">';
        __itemHtml+='        <button class="btn btn-success btn-sm install" data-uuid="{0}" data-action="import" title="{3}">';
        __itemHtml+='           <i class="stat-icon fa fa-download"></i> ' + resource.storage["import"];
        __itemHtml+='        </button>';
        __itemHtml+='    </div>';
        __itemHtml+='</div>';


        $.postJSON(url.load_category, {}, function (result) {
            var __result = result || "";
            if ((__result.type || "") != "ERROR"){
                var __items = [];
                $.each(__result || [], function (i, item) {
                    __items.push({id: item, code: item, name: item});
                });
                $form.category = FormService.createSelect('storage-category-select', __items, 'id', 1, true, false);
                $form.category.on('change', function(){
                    loadStorage();
                });
                loadStorage();
            }
        }, {
            msg: iNet.resources.ajaxLoading.processing,
            mask: self.getMask()
        });

        var getImagePath = function(marketPath, item){
            var __image = ((item || {}).images || [])[0];
            return String.format("{0}/cms/asset/photoview.cpx?folder={1}&code={2}", marketPath, __image.folder, __image.code);
        };
        var loadStorage = function(pageNumber){
            $button.pageInfo.attr('pageNumber', pageNumber || 0);

            var __params = {
                pageSize: 10,
                pageNumber: pageNumber || 0,
                category: $form.category.getValue() || "",
                keyword: $form.keyword.val()
            };
            $.postJSON(url.load_storage, __params, function (result) {
                $form.list.html('');
                var __result = result || {};
                if ((__result.type || "") != "ERROR") {
                    var __pageTotal = (__result.total || 0) % 10;
                    if (__pageTotal > 0 && __pageTotal < 5) {
                        __pageTotal = parseFloat((__result.total/10).toFixed(0)) + 1;
                    } else {
                        __pageTotal = __pageTotal.toFixed(0);
                    }

                    var __items = __result.items || [];
                    var __marketPath = __result.marketplacePath || "";

                    $button.pageInfo.attr('pageTotal', __pageTotal);
                    $button.pageInfo.text(("[ " + __items.length + " ] -- " + ((pageNumber || 0) + 1) + "/" + __pageTotal));

                    $.each(__items, function (i, item) {
                        $form.list.append(String.format(__itemHtml, item.uuid, getImagePath(__marketPath, item), "iNet Solutions", item.brief));
                    });
                } else {
                    $button.pageInfo.text("0/0");
                }

                $form.list.find('[data-action="import"]').on('click', function(){
                    var __page = $(this).attr('data-uuid');
                    console.log(__page);
                    $.postJSON(url.importPage, {application: __page}, function (result) {
                        var __result = result || {};
                        if ((__result.type || "") != "ERROR"){
                            self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                        } else {
                            self.notifyError(resource.constant.submit_title, resource.constant.submit_error);
                        }
                    }, {
                        msg: iNet.resources.ajaxLoading.processing,
                        mask: self.getMask()
                    });
                });

            }, {
                msg: iNet.resources.ajaxLoading.processing,
                mask: self.getMask()
            });
        };
        var gotoPage = function(pageNumber){
            var __pageIndex = $button.pageInfo.attr('pageNumber') || 0;
            var __pageTotal = $button.pageInfo.attr('pageTotal') || 0;
            if (pageNumber == -2) { //index - 1
                __pageIndex--;
            }
            if (pageNumber == -1) { //index + 1
                __pageIndex++;
            }

            if (__pageIndex <=0){
                __pageIndex = 0;
            }

            if (__pageIndex >= __pageTotal){
                __pageIndex = __pageTotal - 1;
            }

            loadStorage(__pageIndex);
        };

        $form.keyword.on('keyup', function(e){
            if (e.which == 13){
                $button.search.trigger('click');
            }
        });
        $button.search.on('click', function(){
            loadStorage();
        });
        $button.pageLeft.on('click', function(){
            gotoPage(-2);
        });
        $button.pageRight.on('click', function(){
            gotoPage(-1);
        });
        $button.pageRefresh.on('click', function(){
            gotoPage();
        });

        iNet.ui.builder.TStorage.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.builder.TStorage, iNet.ui.app.widget);
    new iNet.ui.builder.TStorage().show();
});
