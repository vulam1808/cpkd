/*
 * ****************************************************************
 *    Copyright 2015 by Phong Tran (phongtt@inetcloud.vn)
 *
 *    Licensed under the iNet Solutions Corp.,;
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.inetcloud.vn/licenses
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *  ****************************************************************
 */

// #PACKAGE: xgate-ui-firm-view-service
// #MODULE: XGateFirmViewService
$(function () {
    iNet.ns("iNet.ui.admin", "iNet.ui.admin.FirmView");

    iNet.ui.admin.FirmView = function () {
        this.id = 'firm-view-div';
        var self = this;
        var selfData = {};
        var parentPage = null;
        var isRefesh = false;

        var resource = {
            firm: iNet.resources.xgate.admin.firm,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            BACK: $('#firm-view-btn-back'),
            CREATE: $('#firm-view-btn-create'),
            SAVE: $('#firm-view-btn-save'),
            DEL: $('#firm-view-btn-delete')
        };

        var url = {
            view: iNet.getUrl('firmtask/subfirm/list'),
            del: iNet.getUrl('firmtask/subfirm/delete'),
            create: iNet.getUrl('firmtask/subfirm/create'),
            update: iNet.getUrl('firmtask/subfirm/update'),
            load_user: iNet.getUrl('system/account/role')
        };

        var $form = {
            organiId: $('#firm-view-organId'),
            name: $('#firm-view-name'),
            brief: $('#firm-view-brief'),
            profileID: $('#firm-view-profile'),
            email: $('#firm-view-email'),
            phone: $('#firm-view-phone'),
            website: $('#firm-view-website'),
            fax: $('#firm-view-fax'),
            address1: $('#firm-view-address1'),
            member: $('#firm-view-member')
        };

        var confirmDialog = this.confirmDialog(
            resource.constant.del_title, self.getNotifyContent(resource.constant.del_content, ''), function () {
                if (!iNet.isEmpty(confirmDialog.deleteId)) {
                    confirmDialog.hide();
                    var params = {
                        organId: confirmDialog.deleteId
                    };
                    $.postJSON(url.del, params, function (result) {
                        var __result = result || {};
                        if (CommonService.isSuccess(__result)) {
                            confirmDialog.deleteId = "";
                            isRefesh = true;
                            $toolbar.BACK.trigger('click');
                            self.notifySuccess(resource.constant.del_title, resource.constant.del_success);
                        } else {
                            self.notifyError(resource.constant.del_title, self.getNotifyContent(resource.constant.del_error, __result.errors || []));
                        }
                    }, {
                        mask: self.getMask(),
                        msg: iNet.resources.ajaxLoading.deleting
                    });
                }
            });

        var createSelect = function (id, datasource, idValue, formatView, allowClear, multiple, ajax, query) {
            var __datasource = datasource || [];
            var __idValue = idValue || "id";
            var __formatView = formatView || 1; //View= 1: name; 2: code name
            var __allowClear = iNet.isEmpty(allowClear) ? true : allowClear;
            var __multiple = iNet.isEmpty(multiple) ? false : multiple;
            var __ajax = iNet.isEmpty(ajax) ? {} : ajax;
            var __query = iNet.isFunction(query) ? query : "";

            var __config = {};
            __config.id = id;
            __config.allowClear = __allowClear;
            __config.multiple = __multiple;
            __config.data = {
                results: __datasource,
                text: function (item) {
                    return iNet.isEmpty(item.name) ? "" : item.name;
                }
            };
            __config.idValue = function (data) {
                return data[__idValue];//(__idValue == "code") ? data.code : data.id;
            };
            __config.initSelection = function (element, callback) {
                var __key = __idValue;
                var __value = element.val().split(',') || [];
                var __dataArray = [];
                var __dataValue = "";
                var __multiSelect = __multiple;

                if (!iNet.isEmpty(__value)) {
                    for (var i = 0; i < __value.length; i++) {
                        for (var j = 0; j < __datasource.length; j++) {
                            if ((__key == "id") ? __datasource[j][__key].toString() == __value[i].toString() : __datasource[j][__key].toString() == __value[i].toString()) {
                                __datasource[j].name = iNet.isEmpty(__datasource[j].name) ? "" : __datasource[j].name;
                                __datasource[j].code = iNet.isEmpty(__datasource[j].code) ? "" : __datasource[j].code;

                                if (__multiSelect) {
                                    __dataArray.push(__datasource[j]);
                                } else {
                                    __dataValue = __datasource[j];
                                }
                                break;
                            }
                        }
                    }
                }

                if (__multiSelect) {
                    callback(__dataArray);
                } else {
                    callback(__dataValue);
                }

            };
            __config.formatResult = function (data) {
                var __dataCode = iNet.isEmpty(data.code) ? "" : data.code;
                var __dataName = iNet.isEmpty(data.name) ? "" : data.name;

                var markup1 = __dataName;
                var markup2 = String.format('<span style="color: #c09853; text-align: right; padding-right: 5px"><strong>{0}<strong></strong></strong></span> {1}', __dataCode, __dataName);
                var markup = (__formatView == 1) ? markup1 : markup2;
                return markup;
            };
            __config.formatSelection = function (data) {
                var __dataCode = iNet.isEmpty(data.code) ? "" : data.code;
                var __dataName = iNet.isEmpty(data.name) ? "" : data.name;

                var markup1 = __dataName;
                var markup2 = String.format('<label class="label label-info marg-b-0">{0}</label> {1}', __dataCode, __dataName);
                var markup = (__formatView == 1) ? markup1 : markup2;
                return markup;
            };
            if (!iNet.isEmpty(ajax)) __config.ajax = __ajax;
            if (!iNet.isEmpty(__query)) __config.query = query;

            return new iNet.ui.form.select.Select(__config);
        };
        $form.member = createSelect('firm-view-member', [], 'id', 1, true, true);
        var loadMember = function(data){
            $.postJSON(url.load_user, {}, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    var __listUser = [];
                    $.each(__result.items || [], function(i, obj){
                        __listUser.push({id: obj.username, code: obj.username, name: obj.fullname})
                    });
                    $form.member = createSelect('firm-view-member', __listUser, 'id', 1, true, true);
                    $form.member.setValue(data || []);
                }
            });
        };


        this.setData = function (data) {
            selfData = data || {};

            $form.organiId.val(selfData.organiId || "");
            $form.name.val(selfData.name || "");
            $form.brief.val(selfData.brief || "");
            $form.profileID.val(selfData.profileID || iNet.generateUUID());
            $form.email.val(selfData.email || "");
            $form.phone.val(selfData.phone || "");
            $form.fax.val(selfData.fax || "");
            $form.website.val(selfData.website || "");
            $form.address1.val(selfData.address1 || "");

            var __members = [];
            selfData.members = selfData.members || [];
            for(var key in selfData.members){
                if (!iNet.isEmpty((selfData.members[key] || {}).name || '')){
                    __members.push((selfData.members[key] || {}).name || '');
                }
            }
            loadMember(__members)

            $form.profileID.attr('readonly', true);

            if (iNet.isEmpty(selfData.organiId || "")) {
                $form.organiId.attr('readonly', false);
                $toolbar.DEL.hide();
            } else {
                $form.organiId.attr('readonly', true);
                $toolbar.DEL.show();
            }
        };
        this.setPageBack = function (page) {
            parentPage = page;
        };
        $toolbar.CREATE.on('click', function () {
            self.setData({});
        });
        $toolbar.SAVE.on('click', function () {
            var __url = "";
            if (iNet.isEmpty(selfData.organiId || "")) {
                __url = url.create;
            } else {
                __url = url.update;
            }

            var __params = {};
            __params.organiId = $form.organiId.val();
            __params.address1 = $form.address1.val();
            __params.brief = $form.brief.val();
            __params.email = $form.email.val();
            __params.fax = $form.fax.val();
            __params.name = $form.name.val();
            __params.phone = $form.phone.val();
            __params.profileID = $form.profileID.val() || iNet.generateUUID();
            __params.website = $form.website.val();
            __params.organId = __params.organiId;
            __params.member = iNet.JSON.encode($form.member.getData());


            if (iNet.isEmpty(__params.organId) || iNet.isEmpty(__params.name) || iNet.isEmpty(__params.profileID)) {
                self.notifyError(resource.constant.warning_title, resource.constant.warning_required);
                return;
            }

            $.postJSON(__url, __params, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    self.setData(__result || {});
                    isRefesh = true;
                    self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                } else {
                    self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                }
            }, {
                mask: self.getMask(),
                msg: iNet.resources.ajaxLoading.processing
            });
        });
        $toolbar.DEL.on('click', function () {
            confirmDialog.deleteId  = selfData.organiId;
            confirmDialog.setContent(String.format(resource.constant.del_content, selfData.name));
            confirmDialog.show();
        });
        $toolbar.BACK.on('click', function () {
            if (parentPage != null) {
                self.hide();
                parentPage.show();
                if (isRefesh) {
                    this.fireEvent("finish");
                }
            } else {
                clearData();
            }
        }.createDelegate(this));

        iNet.ui.admin.FirmView.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.admin.FirmView, iNet.ui.app.widget);
});
