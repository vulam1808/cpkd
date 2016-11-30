// #PACKAGE: idesign-ui-t-published-service
// #MODULE: TPublishedService
$(function () {
    iNet.ns("iNet.ui.builder", "iNet.ui.builder.Published");

    iNet.ui.builder.Published = function () {
        this.id = 'published-div';
        var self = this;
        var parentPage = null;
        var pageData = {};

        var url = {
            publish: iNet.getUrl('design/cloudform/publish'),
            category: iNet.getUrl('cloud/designform/application')
        };

        var resource = {
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            SUBMIT: $('#published-submit-btn'),
            BACK: $('#published-back-btn'),
            SEARCH: $('#published-search-btn')
        };

        var $body = {
            page: $('#published-page-txt'),
            application: $('#published-application-txt'),
            category: $('#published-category-txt'),
            listCate: $('#published-category-list'),
            file: $('#published-file'),
            image: $('#published-image'),

            fileContainer: $('#published-file-container'),
            form: $('#published-form')
        };

        this.setData = function (data) {
            pageData = data;
            $body.page.val(pageData.uuid);
            $body.application.val(pageData.name);
            $body.category.val('');
            $body.image.attr('src', "#");
            $body.fileContainer.find('span[data-title]').attr('data-title', '');
        };

        this.setPageBack = function (page) {
            parentPage = page;
            if (parentPage == null) {
                $toolbar.BACK.hide();
            } else {
                $toolbar.BACK.show();
            }
        };

        $body.fileContainer.on('click', function () {
            $body.file.trigger('click');
        });
        $body.file.on('change', function (result) {
            $body.image.attr('src', "#");
            $body.fileContainer.find('span[data-title]').attr('data-title', '...');
            $body.file.val('');

            if (this.files.length < 1) {
                this.files = [];
                return;
            }

            var reader = new FileReader();
            reader.onload = function (e) {
                $body.image.attr('src', e.target.result);
            };
            reader.readAsDataURL(this.files[0]);

            var __nameFile = this.files[0].name;
            $body.fileContainer.find('span[data-title]').attr('data-title', __nameFile);
        });

        var onSubmit = function () {
            if (iNet.isEmpty($body.application.val()) || iNet.isEmpty($body.category.val()) || iNet.isEmpty($body.file.val())) {
                self.notifyError(resource.constant.warning_title, resource.validate.required);
                return;
            }


            $body.form.ajaxSubmit({
                url: url.publish,
                beforeSubmit: function () {
                },
                uploadProgress: function (event, position, total, percentComplete) {
                },
                success: function () {
                },
                complete: function (xhr) {
                    var __responseJSON = xhr.responseJSON || {};
                    var __responseText = xhr.responseText || {};
                    if (__responseJSON == "SUCCESS") {
                        self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                        onBack();
                    } else {
                        self.notifyError(resource.constant.submit_title, resource.constant.submit_error);
                    }
                }
            });
        }.createDelegate(this);

        var onBack = function () {
            if (parentPage != null) {
                self.hide();
                parentPage.show();
                this.fireEvent("finish");
            }
        }.createDelegate(this);


        var onSearch = function (keyword) {
            $.postJSON(url.category, {}, function (result) {
                var __result = result || "";
                if ((__result.type || "") != "ERROR") {
                    $body.listCate.html('');
                    var __items = __result || [];
                    $.each(__items, function (i, item) {
                        var __keyword = (keyword || "").toLowerCase();
                        var __item = (item || "").toLowerCase();
                        if (__item.indexOf(__keyword)>=0){
                            var __style = 'padding: 5px;';
                            __style+=((i == (__items.length - 1)) ? '' : 'border-bottom: 1px solid #DDD;');
                            $body.listCate.append('<li data-action="category" class="actionLi" style="'+__style+'">'+item+'</li>');
                        }
                    });

                    $toolbar.SEARCH.parent().addClass('open');
                    $('li[data-action="category"]').click(function(){
                        $body.category.val($(this).text());
                    });
                }
            });
        };



        $toolbar.SUBMIT.on("click", onSubmit);
        $toolbar.BACK.on("click", onBack);
        $toolbar.SEARCH.on("click", function(){
            onSearch($body.category.val());
        });

        iNet.ui.builder.Published.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.builder.Published, iNet.ui.app.widget);
});
