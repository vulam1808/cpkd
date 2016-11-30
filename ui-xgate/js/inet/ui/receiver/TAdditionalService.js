// #PACKAGE: itask-ui-t-additional-service
// #MODULE: TAdditionalService
$(function () {
    iNet.ns("iNet.ui.task", "iNet.ui.task.TAdditional");
    iNet.ui.task.TAdditional = function () {
        this.id = 'additional-div';
        var self = this;
        var selfData = {};
        var wgRequest = null;

        //get form velocity
        var ctx = {
            targetID: targetID
        };

        var resource = {
            additional: iNet.resources.receiver.additional,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };


        var url = {
            additional_reqquery: iNet.getUrl('onegate/externaldata/reqquery'), //
            additional_requpload: iNet.getUrl('onegate/externaldata/requpload'), //package
            additional_reqremove: iNet.getUrl('onegate/externaldata/reqremove') //package
        };


        //LEFT MENU ==============================================
        var $taskMenu = iNet.getLayout().taskMenu;
        $taskMenu.on('menuchange', function(){
        });
        $taskMenu.on('create', function(){
            createRequest();
        });

        //REQUEST TASK ===========================================
        var createRequest = function () {
            if (wgRequest == null){
                wgRequest = new iNet.ui.task.TRequest();
            }

            wgRequest.on('finish', function(data){
                self.show();
                wgRequest.hide();
                if (!iNet.isEmpty(data)){
                    $taskMenu.refresh('additional');
                }
            });
            wgRequest.setData({});
            wgRequest.show();
            self.hide();
        };

        //LIST VIEW ===========================================
        var basicSearch = function() {
            this.id = "additional-list-basic-search";
            this.intComponent = function(){
                var $bs = this;
                var $expandBtn = $('#additional-list-basic-search-expand-btn');
                var $searchBtn = $('#additional-list-basic-search-search-btn');
                this.$keyword = $('#additional-list-basic-search-txt-keyword');

                $searchBtn.on('click', function(){
                    listView.advanceSearch.hide();
                    var __params = listView.getParams() || {};
                    __params.keyword = $bs.$keyword.val();
                    listView.setParams(__params);
                    listView.load();
                });

                $expandBtn.on('click', function(){
                    listView.advanceSearch.show();
                });
            };
        };
        var advanceSearch = function() {
            this.id = "additional-list-advance-search";
            this.intComponent = function(){
                var $as = this;
                var $searchBtn = $('#additional-list-advance-search-search-btn');
                var $closeBtn = $('#additional-list-advance-search-close-btn');
                this.$receipt = $('#additional-list-advance-search-receipt-txt');
                this.$serial = $('#additional-list-advance-search-serial-txt');
                this.$warnHour = $('#additional-list-advance-search-warnHour-txt');

                $searchBtn.on('click', function(){
                    listView.advanceSearch.hide();
                    var __params = listView.getParams() || {};
                    //__params.receipt = $as.$receipt.val();
                    __params.serial = $as.$serial.val();
                    //__params.warnHour = $as.$warnHour.val();
                    __params.keyword = listView.basicSearch.$keyword.val();
                    listView.setParams(__params);
                    listView.load();
                });
                $closeBtn.on('click', function(){
                    listView.advanceSearch.hide();
                });
            };
        };
        var pullLeft = function() {
            this.id = "additional-list-pull-left";
            this.intComponent = function(){
            };
        };
        var listView = new iNet.ui.listview({
            id: "additional-list",
            uiItemId: "additional-list-item-ui",
            url: url.additional_reqquery,
            basicSearch: basicSearch,
            advanceSearch: advanceSearch,
            pullLeft: pullLeft,
            params: {
                pageSize: 20,
                pageNumber: 0,
                targetID: ctx.targetID
            },
            convertData: function(data){
                var __data = data || {};
                listView.setTotal(__data.total);
                $.each(__data.items || [], function(i, item){
                    listView.addItem(item);
                });
            }
        });
        listView.on('indexchange', function(data){
            additionalView.reset();
            if (!iNet.isEmpty(data.uuid)){
                var __result = data || {};

                additionalView.setData(__result);

                var __subjectData = {subject: data.subject || '', showAttachmentIcon: false, showCommentIcon: false, showDetailsIcon: false};
                var __senderData = {name: data.requestName, date: ' (' + $.timeago(data.created) + ')', showDetailsIcon: false};
                additionalView.setHeader({subject: __subjectData, sender: __senderData, object: __result});


                var __htmlContent = '';
                var __htmlAtt = '';
                __htmlAtt+='<div class="row-fluid">';
                __htmlAtt+='    <label class="span4">{1}</label>';
                __htmlAtt+='    <div class="ace-file-input span5" data-container data-name="{0}">';
                __htmlAtt+='         <label data-name="{0}" data-title="Click here" class="ace-file-container file-label">';
                __htmlAtt+='             <span data-title="..." data-name="{0}" class="ace-file-name file-name"><i class="icon-upload-alt ace-icon"></i></span>';
                __htmlAtt+='         </label>';
                __htmlAtt+='         <a data-remove data-name="{0}" class="remove" href="#"><i class=" ace-icon fa fa-times"></i></a>';
                __htmlAtt+='    </div>';
                __htmlAtt+='    <div class="span3" style="margin-left: 5px;margin-top: 3px;">';
                __htmlAtt+='        <label>';
                __htmlAtt+='            <input data-hardcopy data-name="{0}" type="checkbox" name="{0}_hardcopy" value="false" class="ace" style="display: none;" id="{0}_hardcopy">';
                __htmlAtt+='            <span class="lbl"> '+resource.additional.hardcopy+'</span>';
                __htmlAtt+='        </label>';
                __htmlAtt+='    </div>';
                __htmlAtt+='    <input data-note data-name="{0}" type="text" name="{0}_note" value="{1}" style="display: none;">';
                __htmlAtt+='    <input type="file" name="{0}" style="display:none;" data-file data-name="{0}"/>';
                __htmlAtt+='</div>';

                for (var key in __result.files) {
                    __htmlContent+= String.format(__htmlAtt, key, (iNet.isEmpty(__result.files[key]) ? key : __result.files[key]));
                }

                var __htmlScript = '';
                __htmlScript+='<script type="application/javascript">\n';
                __htmlScript+='$("[data-file][data-name]").on("change", function(){\n';
                __htmlScript+='if (this.files.length < 1) {\n';
                __htmlScript+='this.files = [];\n';
                __htmlScript+='return;\n';
                __htmlScript+='}\n';
                __htmlScript+='var __nameFile = this.files[0].name;\n';
                __htmlScript+='$(this).parent().find("span[data-title]").attr("data-title", __nameFile);\n';
                __htmlScript+='$(this).parent().find(".ace-file-container").addClass("selected");\n';
                __htmlScript+='});\n';

                __htmlScript+='$("[data-remove][data-name]").on("click", function(){\n';
                __htmlScript+='var __dataName = $(this).attr("data-name");\n';
                __htmlScript+='$(\'span[data-title][data-name="\'+__dataName+\'"]\').attr("data-title", "...");\n';
                __htmlScript+='$(\'[data-file][data-name="\'+__dataName+\'"]\').val("");\n';
                __htmlScript+='$(\'.ace-file-container[data-name="\'+__dataName+\'"]\').removeClass("selected");\n';
                __htmlScript+='});\n';

                __htmlScript+='$("[data-hardcopy][data-name]").on("change", function(){\n';
                __htmlScript+='$(this).attr("value", $(this).prop("checked"));\n';
                __htmlScript+='});\n';


                __htmlScript+='$("[data-container][data-name] label").on("click", function(){\n';
                __htmlScript+='var __dataName = $(this).attr("data-name");\n';
                __htmlScript+='$(\'[data-file][data-name="\'+__dataName+\'"]\').trigger("click");\n';
                __htmlScript+='});\n';
                __htmlScript+='</script>';

                __htmlContent+=__htmlScript;

                additionalView.setSubmitContent(__htmlContent);

                var __commentData = [];
                var __attBriefData = [];
                additionalView.setFooter({comments: __commentData, attBriefs: __attBriefData});
            }
        });
        listView.on('typechange', function(type){
            if (type == "max") {
                additionalView.setType('min');
            } else {
                additionalView.setType('full');
            }
        });

        //ITEM VIEW ==========================================
        var submitRequest = function(url){
            var __url = url || "";
            if (!iNet.isEmpty(__url)) {
                additionalView.submit(__url);
            }
        };

        var additionalToolBar = function() {
            this.id = "additional-toolbar";
            this.intComponent = function(){
                var $printBtn = $('#additional-view-print-btn');
                var $sendBtn = $('#additional-view-send-btn');
                var $removeBtn = $('#additional-view-remove-btn');

                $sendBtn.on('click', function(){
                    var __listData = listView.getData() || {};
                    additionalView.resetBodyHidden();
                    additionalView.addBodyHidden('requestID', __listData.uuid);
                    submitRequest(url.additional_requpload);
                });

                $removeBtn.on('click', function(){
                    self.confirmDialog(resource.constant.del_title, "", function(){
                        self.dialog.hide();
                        if (!iNet.isEmpty(self.dialog.params)) {
                            $.postJSON(url.additional_reqremove, self.dialog.params, function (result) {
                                var __result = result || {};
                                if (CommonService.isSuccess(__result)) {
                                    $taskMenu.refresh('additional');
                                    listView.refresh();
                                } else {
                                    self.notifyError(resource.constant.del_title, self.getNotifyContent(resource.constant.del_error, __result.errors || []));
                                }
                            });
                        }
                    });

                    var __listData = listView.getData() || {};
                    self.dialog.setContent(self.getNotifyContent(resource.constant.del_content, ""));
                    self.dialog.params = {"package": __listData.targetID};
                    self.dialog.show();
                });

                $printBtn.on('click', function(){
                    var __listData = listView.getData() || {};
                    window.open(iNet.getUrl(CommonService.pageRequest.formNo01) + '?targetID='+(__listData.targetID || ""), '_blank');
                });
            };
        };
        var additionalView = new iNet.ui.itemview({
            id: "additional-view",
            resource: resource,
            url: url,
            toolbar: additionalToolBar,
            ajaxMaskId: 'ajax-mask',
            headerDetails: {
                subject: "additional-subject-details",
                sender: "additional-sender-details"
            }
        });
        additionalView.on('submitted', function(data){
            var __data = data || {};
            if (__data.type == "error"){
                self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __data.errors || []));
            } else {
                self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                refresh();
            }
        });
        additionalView.on('headerchange', function(data){
            console.log(">>headerchange>>", data);
        });
        additionalView.on('menuclick', function(){
            listView.setType('menu');
        });

        //OTHER ==============================================
        var refresh = function(){
            $taskMenu.refresh('additional');
            listView.refresh();
        };

        var init = function(){
            listView.setType('max');
        };

        init();

        iNet.ui.task.TAdditional.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.task.TAdditional, iNet.ui.app.widget);

    new iNet.ui.task.TAdditional().show();
});
