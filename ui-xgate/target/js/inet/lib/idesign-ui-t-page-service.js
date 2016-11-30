// #PACKAGE: idesign-ui-t-page-service
// #MODULE: TPageService
$(function () {
    iNet.ns("iNet.ui.builder", "iNet.ui.builder.TPage");

    iNet.ui.builder.TPage = function () {
        this.id = 'page-div';
        console.log(">>>> C,E,D,V >>>> ", roleCreate, roleEdit, roleDelete, roleView);
        var isRefesh = false;
        var parentPage = null;
        var ownerData = {};
        var allowSaveInfo = false;
        var wgPublished = null;

        var self = this;
        var deleteIds = null;
        var deleteName = null;
        var resource = {
            page: iNet.resources.builder.page,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            CREATE: $('#page-create-btn'),
            DELETE: $('#page-delete-btn'),
            SAVE: $('#page-save-btn'),
            DESIGN: $('#page-design-btn'),
            PREVIEW: $('#page-preview-btn'),
            BACK: $('#page-back-btn'),
            PUBLISHED_XGATE: $('#page-published-xgate-btn'),
            PUBLISHED_EXPWAY: $('#page-published-expway-btn'),
            INFORMATION: $('#page-information-btn')
        };
        $toolbar.DELETE.hide();
        $toolbar.PUBLISHED_XGATE.hide();
        $toolbar.PUBLISHED_EXPWAY.hide();
        //if (roleCreate) { $toolbar.CREATE.show(); } else { $toolbar.CREATE.hide(); }
        if (roleCreate || roleEdit) { $toolbar.SAVE.show(); } else { $toolbar.SAVE.hide(); }

        var url = {
            view_info: iNet.getUrl('design/page/load'),
            create_info: iNet.getUrl('design/page/create'),
            update_info: iNet.getUrl('design/page/update'),
            del_info: iNet.getUrl('design/page/delete'),
            check_exists: iNet.getUrl('design/page/checkexists')
        };

        var $form = {
            name: $('#page-name-txt'),
            brief: $('#page-brief-txt'),

            bootstrapV2: $('#page-bootstrap-v2-check'),
            bootstrapV3: $('#page-bootstrap-v3-check'),

            tool: $('#page-tool'),
            design: $('#page-design'),
            javascript: {
                WEB: $('#page-javascript-web'),
                MOBILE: $('#page-javascript-mobile')
            },
            information: $('#page-information'),
            webContent: $('#page-web'),
            mobileContent: $('#page-mobile'),

            designBtn: $('#page-container-btn'),
            javascriptBtn: $('#page-javascript-btn'),

            javascriptContent: {
                WEB: $('#page-javascript-web-content'),
                MOBILE: $('#page-javascript-mobile-content')
            },
            javascriptHtml: {
                WEB: '<div style="display: none" page-javascript-web-content>{0}</div>',
                MOBILE: '<div style="display: none" page-javascript-mobile-content>{0}</div>'
            },
            javascriptEditor: {
                WEB: null,
                MOBILE: null
            },

            accordionAttribute: $('#accAttribute'),
            ctrlSelected: null
        };

        $form.javascriptEditor.WEB = CodeMirror.fromTextArea(document.getElementById('page-javascript-web-content'), {
            mode: 'javascript',
            theme: 'eclipse',
            lineNumbers: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            matchBrackets: true,
            indentUnit: 2,
            indentWithTabs: true,
            enterMode: "keep",
            tabMode: "shift",
            tabSize: 2
        });
        $form.javascriptEditor.MOBILE = CodeMirror.fromTextArea(document.getElementById('page-javascript-mobile-content'), {
            mode: 'javascript',
            theme: 'eclipse',
            lineNumbers: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            matchBrackets: true,
            indentUnit: 2,
            indentWithTabs: true,
            enterMode: "keep",
            tabMode: "shift",
            tabSize: 2
        });

        $form.designBtn.on('click', function(){
            $form.design.show();
            $form.design.removeClass('hide');
            $form.javascript.WEB.hide();
            $form.javascript.MOBILE.hide();
            setHeight();
        });
        $form.javascriptBtn.on('click', function(){
            $form.design.hide();
            $form.design.addClass('hide');
            if($('#page-design-mode-btn').prop('checked')){ //web-mode
                $form.javascript.WEB.show();
                $form.javascript.MOBILE.hide();
            } else { //mobile-mode
                $form.javascript.MOBILE.show();
                $form.javascript.WEB.hide();
            }
            setHeight();
        });

        var confirmDialog = this.confirmDialog(
            iNet.resources.message.dialog_confirm_title, self.getNotifyContent(resource.constant.del_content, deleteName), function () {
                if (!iNet.isEmpty(deleteIds)) {
                    confirmDialog.hide();
                    var params = {
                        page: deleteIds
                    };
                    $.postJSON(url.del_info, params, function (result) {
                        var __result = result || {};
                        if (CommonService.isSuccess(__result)) {
                            isRefesh = true;
                            deleteIds = null;
                            self.notifySuccess(resource.constant.del_title, resource.constant.del_success);
                            onBack();
                        } else {
                            self.notifyError(resource.constant.del_title, self.getNotifyContent(resource.constant.del_error, __result.errors || []));
                        }
                    }, {
                        mask: self.getMask(),
                        msg: iNet.resources.ajaxLoading.deleting
                    });
                }
            });

        // PUBLIC FUNCTION ----------------------------------------
        this.loadData = function(data){
            $form.bootstrapV2.prop('checked', true);
            $form.bootstrapV3.prop('checked', true);

            if (data != null){
                ownerData = data;
                setData(ownerData);
            } else {
                clearData();
            }
        };

        this.setPageBack = function(page){
            parentPage = page;
            if (parentPage == null){
                $toolbar.BACK.hide();
            }
        };

        this.createPage = function(pageName){
            $.postJSON(url.check_exists, {name: pageName}, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    if (iNet.isEmpty(__result.uuid)){
                        $.postJSON(url.create_info, {name: pageName}, function (result) {
                            var __result = result || {};
                            if (CommonService.isSuccess(__result)) {
                                self.loadData(__result);
                            } else {
                                self.notifyError(resource.constant.del_title, self.getNotifyContent(resource.constant.del_error, __result.errors || []));
                            }
                        }, {
                            mask: self.getMask(),
                            msg: iNet.resources.ajaxLoading.loading
                        });
                    } else {
                        //TODO:
                        self.loadData(__result);
                    }
                } else {
                    self.notifyError(resource.constant.del_title, self.getNotifyContent(resource.constant.del_error, __result.errors || []));
                }
            }, {
                mask: self.getMask(),
                msg: iNet.resources.ajaxLoading.loading
            });
        };

        //INFO ----------------------------------------------------
        function configurationElm(e, t) {
            $(".demo").delegate(".remove", "click", function (e) {
                e.preventDefault();
                $(this).parent().remove();
                if (!$(".demo .lyrow").length > 0) {
                    clearDemo()
                }
            })
            $(".demo").delegate(".configuration", "click", function (e) {
                e.preventDefault();
                $form.ctrlSelected = $($(this).parent().find(".view").children());
                initProperty();
                //$form.attrName.val($el.find('[name]').prop('name') || '');
                //$(this).toggleClass("active");
                //t.toggleClass($(this).attr("rel"))
            });
            $(".demo").delegate("[data-control]", "dragstop", function(e){
                e.preventDefault();
                console.log(">> dragstop >>", e);
            });
            $(".lyrow .preview input").bind("keyup", function () {
                var e = 0;
                var t = "";
                var n = false;
                var r = $(this).val().split(" ", 12);
                $.each(r, function (r, i) {
                    if (!n) {
                        if (parseInt(i) <= 0)n = true;
                        e = e + parseInt(i);
                        t += '<div class="span' + i + ' column"></div>'
                    }
                });
                if (e == 12 && !n) {
                    $(this).parent().next().children().html(t);
                    $(this).parent().prev().show()
                } else {
                    $(this).parent().prev().hide()
                }
            })
        };

        function clearDemo() {
            $(".demo").empty();
        };

        function handleJsIds(controlId) {
            if (!iNet.isEmpty(controlId)) {
                $form.design.find('[data-control="' + controlId + '"]').each(function () {
                    var $control = $(this);
                    var $design = $control.find('[data-design]');
                    RenderService.DesignData($design);

                    var $content = $control.find('[data-content]');
                    RenderService.DesignContent($content);
                });
            }
        };

        function changeStructure(e, a, r) {
            //$form.webContent.find("." + e).removeClass(e).addClass(t);
            if (iNet.isEmpty(e) && iNet.isEmpty(a) && iNet.isEmpty(r)){
                if ($form.bootstrapV3.prop('checked')){
                    //Change structure span --> bootstrap 3
                    changeStructure('.row-fluid', 'row');
                    for (var i = 1; i <= 12; i++){
                        var __old = '.span' + i;
                        var __new = 'col-md-'+i+' col-xs-'+i+' col-sm-'+i;
                        changeStructure(__old, __new);
                    }

                    //Change structure ace calendar --> bootstrap 3
                    changeStructure('.icon-calendar', 'ace-icon icon-calendar');

                    //Change structure ace file --> bootstrap 3
                    changeStructure('[class="ace-file-input"] label[data-title]', 'ace-file-container file-label');
                    changeStructure('[class="ace-file-input"] span[data-title]', 'ace-file-name file-name');
                    changeStructure('[class="ace-file-input"] span[data-title] i', 'ace-icon');
                }
            } else {
                $form.webContent.find(e).addClass(a).removeClass(r);
                $form.mobileContent.find(e).addClass(a).removeClass(r);
            }
        };

//        function cleanHtml(e) {
//            $(e).parent().append($(e).children().html())
//        }

        var ready = function() {
            $(".demo, .demo .column").sortable({connectWith: ".column", opacity: .35, handle: ".drag"});
            $(".sidebar-nav .lyrow").draggable({connectToSortable: ".demo", helper: "clone", handle: ".drag", drag: function (e, t) {
                t.helper.width(400)
            }, stop: function (e, t) {
                $(".demo .column").sortable({opacity: .35, connectWith: ".column"})
                handleJsIds($(e.target).find("[data-control]:first").attr("data-control"));
            }});
            $(".sidebar-nav .box").draggable({connectToSortable: ".column", helper: "clone", handle: ".drag", drag: function (e, t) {
                t.helper.width(400)
            }, stop: function (e) {
                handleJsIds($(e.target).find("[data-control]:first").attr("data-control"));
            }});

            $(".sidebar-nav .boxes, .sidebar-nav .rows").hide();
            $(".property-nav .csss, .property-nav .javascripts").hide();

            $(".sidebar-nav .nav-header").click(function () {
                $(".sidebar-nav .boxes, .sidebar-nav .rows").hide();
                $(this).next().slideDown()
            });
            $(".property-nav .nav-header").click(function () {
                $(".property-nav .attrs, .property-nav .csss, .property-nav .javascripts").hide();
                $(this).next().slideDown()
            });
            $(".sidebar-nav, .container-dsn").on('click', function(e){
                if (!$(e.target).attr('data-configuration')){
                    hideProperty();
                }
            });

            hideProperty();
            configurationElm();
            setHeight();

            //update version
            $(".demo .lyrow.ui-draggable").each(function(i, ctrl){
                if (!$(ctrl).hasClass('web-control') && !$(ctrl).hasClass('mobile-control')){
                    $(ctrl).addClass('web-control');
                }
            });
        };

        var showProperty = function(){
            $(".property-nav").addClass('show');
            $(".demo").addClass('properties');
        };
        var hideProperty = function(){
            $(".property-nav").removeClass('show');
            $(".demo").removeClass('properties');
        };
        var initProperty = function () {
            var $control = $form.ctrlSelected;
            var $container = $form.accordionAttribute;
            console.log(">> initProperty >>", $control, $control.find('target').length);

            PropertyService.RenderPropertyTarget($control, $container);
            showProperty();
        };

        var setHeight = function(){
            $(".demo").css("min-height", $(window).height() - 76);
            if ($form.javascriptEditor.WEB != null){
                $form.javascriptEditor.WEB.setSize('100%', $form.design.height() - 15);
            }
            if ($form.javascriptEditor.MOBILE != null){
                $form.javascriptEditor.MOBILE.setSize('100%', $form.design.height() - 15);
            }
        };

        var getContent = function() {
            //include javascript
            if ($form.javascriptEditor.WEB != null){
                $form.design.find("[page-javascript-web-content]").remove();
                $form.design.append(String.format($form.javascriptHtml.WEB, $form.javascriptEditor.WEB.getValue()));
            }
            if ($form.javascriptEditor.MOBILE != null){
                $form.design.find("[page-javascript-mobile-content]").remove();
                $form.design.append(String.format($form.javascriptHtml.MOBILE, $form.javascriptEditor.MOBILE.getValue()));
            }

            renderWeb($form.design.html());
            renderMobile($form.design.html());
            changeStructure();
        };

        // Reduce query by jquery: faster 5x than old code
        function renderWeb(html) {
            var __$el = $('<div>').html(html);

            // Remove all mobile control, elements for design
            __$el.find('.mobile-control,[mobile-content],[data-design],[page-javascript-mobile-content]').remove();

            // Find view data
            var $view = __$el.find('.view');
            for(var i = $view.length - 1; i >= 0; i--){
                var dom = $view[i],
                    child = dom.children[0];
                // Remove class 'clearfix'
                child.classList.remove('clearfix');
                dom.parentNode.outerHTML = child.outerHTML;
            }

            __$el.find('[web-content]').removeClass('hide');

            // Remove class not use
            __$el.find('.ui-sortable').removeClass('column ui-sortable');

            $form.webContent.html(__$el.html());
        }
        /*
         * Author: hanhld@inetcloud.vn
         * Reduce size of html string when save for mobile
         * Parse properties to JSON string
         */
        function renderMobile(html) {
            var __$el = $('<div>').html(html),
                propMap = {};
            // Remove all web control, elements for design
            __$el.find('.web-control,[data-design],[page-javascript-web-content],[page-javascript-content]').remove();

            // Parse properties
            __$el.find('[data-properties]').each(function () {
                parseProperties($(this), propMap);
            });

            // Find view data
            var $view = __$el.find('.view');
            for(var i = $view.length - 1; i >= 0; i--){
                var dom = $view[i];
                dom.parentNode.outerHTML = dom.children[0].innerHTML;
            }
            __$el.find('[mobile-content]').each(function () {
                this.outerHTML = this.innerHTML;
            });

            // Remove class not use
            __$el.find('.ui-sortable').removeClass('column ui-sortable');

            // Remove target-id|data-control|id attributes in html
//          __$el[0].innerHTML = __$el[0].innerHTML.replace(/(target-id|data-control|id)=".*?"/g, '');

            // Store properties in DOM
            __$el.append('<script type="text/properties">' + JSON.stringify(propMap) + '</script>');
            $form.mobileContent.html(__$el.html());
        }
        function parseProperties($el, map) {
            var properties = {};
            $el.find('properties').each(function () {
                properties[this.getAttribute('rel')] = this.getAttribute('property-value');
            });
            map[properties.name] = properties;
            $el.remove();
        }


        var setMode = function(){
            if($('#page-design-mode-btn').prop('checked')){ //web-mode
                $('#' + self.id).find('.wg-content').removeClass('mobile-mode').addClass('web-mode');
                $('#page-design-mode-btn').attr("title", resource.page.webMode);
            } else { //mobile-mode
                $('#' + self.id).find('.wg-content').removeClass('web-mode').addClass('mobile-mode');
                $('#page-design-mode-btn').attr("title", resource.page.mobileMode);
            }

            if ($form.design.hasClass('hide')){
                $form.javascriptBtn.trigger('click');
            } else {
                $form.designBtn.trigger('click');
            }
        };

        var clearData = function (){
            ownerData = {};
            setData(ownerData);

            $toolbar.DELETE.hide();
        };

        var setData = function (data){
            $('#page-design-mode-btn').prop('checked', true);
            setMode();

            $form.designBtn.trigger('click');

            var __data = data || {};
            $form.name.val(__data.name || "");

            $form.design.html(__data.design || "");

            var __javascriptContentWeb = $form.design.find('[page-javascript-web-content]').text() || '';
            $form.javascriptContent.WEB.val(__javascriptContentWeb);
            if ($form.javascriptEditor.WEB != null){
                $form.javascriptEditor.WEB.setValue(__javascriptContentWeb);
            }

            var __javascriptContentMobile = $form.design.find('[page-javascript-mobile-content]').text() || '';
            $form.javascriptContent.MOBILE.val(__javascriptContentMobile);
            if ($form.javascriptEditor.MOBILE != null){
                $form.javascriptEditor.MOBILE.setValue(__javascriptContentMobile);
            }

            console.log(">> setData >>", {data: __data, javascript: {web:  __javascriptContentWeb, mobile: __javascriptContentMobile}});

            if (roleDelete) { $toolbar.DELETE.show(); }
            ready();
        };

        var getData = function(){
            getContent();

            var __htmlWebConent = $form.webContent.html();
            __htmlWebConent += PublicService.iNetScript($form.webContent);

//            var __htmlMobileContent = $form.mobileContent.html();
//            __htmlMobileContent += PublicService.iNetScript($form.mobileContent);
            var __htmlMobileContent = PublicService.MobileScript($form.mobileContent);

            var __validateName = true;
            $form.webContent.find('[name]').each(function(i, item){
                if (iNet.isEmpty($(item).attr('name') || "")){
                    __validateName = false;
                    return false;
                }
            });

            if (__validateName){
                var __data = {
                    templateID: '',
                    //name: $form.name.text(),
                    design: $form.design.html(),
                    content: __htmlWebConent,
                    mcontent: __htmlMobileContent
                };

                __data = iNet.apply(ownerData,__data) || {};
                return __data;
            } else {
                return null;
            }
        };

        var validateData = function (data) {
            var __data = data;

            /*if (iNet.isEmpty(__data.code) || iNet.isEmpty(__data.name) || iNet.isEmpty(__data.state)) {
             self.notifyError(resource.constant.warning_title, resource.constant.warning_required);
             return false;
             }*/

            if (iNet.isEmpty(__data)){
                self.notifyError(resource.constant.warning_title, String.format(resource.constant.warning_error, String.format(resource.validate.is_not_blank, resource.page.propertyName)));
                return false;
            }

            return true;

        };

        //EVENT ---------------------------------------------------
        var onCreate = function () {
            clearData();
            $form.name.focus();
        };

        var onSave = function (callback, showMessage) {
            var __fn = iNet.isFunction(callback) ? callback.createDelegate(this) : iNet.emptyFn;
            var __showMessage = iNet.isEmpty(showMessage) ? true : showMessage;
            var __data = getData();
            if (validateData(__data)){
                console.log("onSave", __data);
                if (__data.uuid == null) {
                    $.postJSON(url.create_info, __data, function (result) {
                        var __result = result || {};
                        console.log("create_info", __result);
                        if (CommonService.isSuccess(__result)) {
                            isRefesh = true;
                            if (roleDelete) { $toolbar.DELETE.show(); }
                            ownerData = __result;
                            __fn(ownerData);
                            if (__showMessage) {
                                self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                            }
                        }else{
                            self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                        }
                    });
                } else{
                    $.postJSON(url.update_info, __data, function (result) {
                        var __result = result || {};
                        console.log("update_info", __result);
                        if (CommonService.isSuccess(__result)) {
                            isRefesh = true;
                            ownerData = __result;
                            __fn(ownerData);
                            if (__showMessage) {
                                self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                            }
                        }else{
                            self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                        }
                    });
                }
            }
        };

        var onDelete = function () {
            deleteIds = ownerData.uuid;
            deleteName = ownerData.name;
            confirmDialog.setContent(String.format(resource.constant.del_content, deleteName));
            confirmDialog.show();
        };

        var onDesign = function () {
            $("#page-container").removeClass("devpreview sourcepreview");
            $("#page-container").addClass("edit");
            $toolbar.PREVIEW.show();
            $toolbar.DESIGN.hide();
        };

        var onPreview = function () {
            $("#page-container").removeClass("edit");
            $("#page-container").addClass("devpreview sourcepreview");
            $toolbar.PREVIEW.hide();
            $toolbar.DESIGN.show();
        };


        var showPublished = function(published){
            if (wgPublished == null){
                wgPublished = new iNet.ui.admin.Published();
            }

            wgPublished.on('back', function(){
                wgPublished.hide();
                self.show();
            });
            wgPublished.setData({published: published, type: "page", uuid: ownerData.uuid || "", name: ownerData.name});
            wgPublished.show();
            self.hide();
        };

        var onAttachExpway = function() {
            onSave(showPublished('expway'), false);
        };

        var onAttachXgate = function() {
            onSave(showPublished('xgate'), false);
        };

        var onBack = function () {
            if (parentPage != null){
                self.hide();
                parentPage.show();
                if (isRefesh) {
                    this.fireEvent("finish");
                }
            } else {
                clearData();
            }
        }.createDelegate(this);

        var onInformation = function(){
            if ($form.information.hasClass('hide')){
                $form.information.removeClass('hide');
            } else {
                $form.information.addClass('hide');
            }
        };

        $toolbar.INFORMATION.on("click", onInformation);
        $toolbar.PUBLISHED_XGATE.on("click", onAttachXgate);
        $toolbar.PUBLISHED_EXPWAY.on("click", onAttachExpway);
        $toolbar.DESIGN.on("click", onDesign);
        $toolbar.PREVIEW.on("click", onPreview);
        $toolbar.CREATE.on("click", onCreate);
        $toolbar.DELETE.on("click", onDelete);
        $toolbar.SAVE.on("click", onSave);
        $toolbar.BACK.on("click", onBack);
        $('#page-design-mode-btn').on("change", function(){
            setMode();
        });

        $(window).resize(function () {
            setHeight();
        });

        iNet.ui.builder.TPage.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.builder.TPage, iNet.ui.app.widget);
});
