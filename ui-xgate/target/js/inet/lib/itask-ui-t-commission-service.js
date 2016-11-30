// #PACKAGE: itask-ui-t-commission-service
// #MODULE: TCommissionService
$(function () {
    iNet.ns("iNet.ui.task", "iNet.ui.task.TCommission");

    iNet.ui.task.TCommission = function () {
        this.id = 'commission-div';
        var self = this;
        var deleteIds = null;
        var deleteName = null;

        var resource = {
            commission: iNet.resources.task.commission,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            load_user: iNet.getUrl('system/account/role'),

            view: iNet.getUrl('cloud/workflow/commission/list'),
            create: iNet.getUrl('cloud/workflow/commission/create'),
            del: iNet.getUrl('cloud/workflow/commission/delete')
        };

        var $toolbar = {
            CREATE: $('#commission-create-btn')
        };

        var confirmDialog = this.confirmDialog(
            iNet.resources.message.dialog_confirm_title, self.getNotifyContent(resource.constant.del_content, deleteName), function () {
                if (!iNet.isEmpty(deleteIds)) {
                    confirmDialog.hide();
                    var params = {
                        commissionID: deleteIds
                    };
                    $.postJSON(url.del, params, function (result) {
                        var __result = result || {};
                        if (CommonService.isSuccess(__result)) {
                            var __arrays = deleteIds.split(",");
                            for (var i = 0; i < __arrays.length; i++) {
                                grid.remove(__arrays[i]);
                            }
                            deleteIds = null;
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


        var __userList = [];
        $.postJSON(url.load_user, {}, function (result) {
            var __result = result || {};
            if (CommonService.isSuccess(__result)) {
                __userList = [];
                $.each(__result.items || [], function (u, user) {
                    __userList.push({id: user.username, code: user.username, name: user.fullname});
                });

                grid.load();
            }
        });

        var convertUserList = function(list){
            var __authorizedPerson = "";
            $.each(__userList, function(i, obj){
                if (list.indexOf(obj.id.toString()) != -1){
                    if (iNet.isEmpty(obj.name)){
                        obj.name = "empty";
                    }
                    __authorizedPerson+='<label class="label label-info" style="margin-right: 5px;">'+obj.name+'</label>';
                }
            });
            return __authorizedPerson;
        };

        var dataSource = new DataSource({
            columns: [
                {
                    property : 'authorizedPerson',
                    label : resource.commission.authorizedPerson,
                    sortable : true,
                    disabled: true,
                    editData: __userList,
                    type : 'selectx',
                    displayField : 'name',
                    valueField: 'id',
                    config: {
                        multiple: true,
                        data: [],
                        minimumInputLength: 0,
                        initSelection: function (element, callback) {
                            var id = $(element).val();
                            if (id == "") return;
                            var ids = id.split(',');
                            if (__userList.length > 0) {
                                var __items = [];
                                $.each(__userList, function(i, obj){
                                    if (ids.indexOf(obj.id.toString()) != -1){
                                        if (iNet.isEmpty(obj.name)){
                                            obj.name = "empty";
                                        }
                                        __items.push(obj);
                                    }
                                });
                                callback(__items);
                            }
                        },
                        formatResult: function (item) {
                            return item.name;
                        },
                        formatSelection: function (item) {
                            return item.name;
                        },
                        query: function (query) {
                            var data = {results: []};

                            $.each(__userList, function () {
                                if (query.term.length == 0 || this.name.toUpperCase().indexOf(query.term.toUpperCase()) >= 0) {
                                    data.results.push({id: this.id, name: this.name });
                                }
                            });

                            query.callback(data);
                        },
                        escapeMarkup: function (m) {
                            return m;
                        }
                    },
                    validate: function (v) {
                        if ($.trim(v) == '')
                            return String.format(resource.validate.is_not_blank, resource.commission.authorizedPerson);
                    }
                },
                {
                    property: 'formDate',
                    label: resource.commission.formDate,
                    sortable: true,
                    disabled: true,
                    type: "datetime",
                    validate: function (v) {
                        if ($.trim(v) == '')
                            return String.format(resource.validate.is_not_blank, resource.commission.formDate);
                    },
                    width: 150
                },
                {
                    property: 'toDate',
                    label: resource.commission.toDate,
                    sortable: true,
                    disabled: true,
                    type: "datetime",
                    validate: function (v) {
                        if ($.trim(v) == '')
                            return String.format(resource.validate.is_not_blank, resource.commission.toDate);
                    },
                    width: 150
                },
                {
                    property: 'note',
                    label: resource.commission.note,
                    sortable: true,
                    disabled: true,
                    type: "text",
                    width: 250
                },
                {
                    label: '',
                    type: 'action',
                    width: 32,
                    align: 'center',
                    buttons: [
                        {
                            text: iNet.resources.message.button.del,
                            icon: 'icon-trash',
                            labelCls: 'label label-important',
                            fn: function (record) {
                                deleteIds = record.uuid.toString();
                                confirmDialog.setContent(String.format(resource.constant.del_content, ""));
                                confirmDialog.show();
                            }
                        }
                    ]
                }
            ],
            delay: 250
        });



        var grid = new iNet.ui.grid.Grid({
            id: 'commission-grid',
            url: url.view,
            params: {
                zone: iNet.zone,
                context: iNet.context
            },
            convertData: function (data) {
                var __data = data || {};
                grid.setTotal(__data.total);
                var __items = __data.items || [];
                $.each(__items, function(i, item){
                    item.authorizedPerson = convertUserList(item.authorizedPerson);
                });
                return __items;
            },
            dataSource: dataSource,
            stretchHeight: false,
            editable: false,
            firstLoad: false,
            idProperty: 'uuid'
        });

        grid.on('save', function (data) {
            var __data = data || {};
            __data.zone = iNet.zone;
            __data.context = iNet.context;
            __data.formDate = __data.formDate.dateToLong();
            __data.toDate = __data.toDate.dateToLong();
            __data.persons = __data.authorizedPerson.toString();

            delete __data.authorizedPerson;

            $.postJSON(url.create, __data, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    __result.authorizedPerson = convertUserList(__result.authorizedPerson);
                    grid.insert(__result);
                    self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                } else {
                    self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                }
            });
        });

        var onCreate = function () {
            grid.newRecord();
            var cm = grid.getColumnModel();
            var __cell = null;
            __cell = cm.getColumnByName("authorizedPerson").getCellAdd(1);
            __cell.setDisabled(false);
            __cell.setValue("");
            __cell = cm.getColumnByName("formDate").getCellAdd(1);
            __cell.setDisabled(false);
            __cell = cm.getColumnByName("toDate").getCellAdd(1);
            __cell.setDisabled(false);
            __cell = cm.getColumnByName("note").getCellAdd(1);
            __cell.setDisabled(false);
            __cell.setValue("");
        };

        $toolbar.CREATE.on("click", onCreate);

        iNet.ui.task.TCommission.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.task.TCommission, iNet.ui.app.widget);

    new iNet.ui.task.TCommission().show();
});
