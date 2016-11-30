// #PACKAGE: xgate-ui-working-time-service
// #MODULE: XGateWorkingTimeService
$(function () {
    iNet.ns("iNet.ui.admin", "iNet.ui.admin.WorkingTime");

    iNet.ui.admin.WorkingTime = function () {
        this.id = 'working-time-div';
        var self = this;
        var deleteIds = null;
        var deleteName = null;
        var centerPlaceChanged = false;
        var resource = {
            workingtime: iNet.resources.xgate.admin.workingtime,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var $toolbar = {
            SAVE: $('#working-time-save-btn')
        };

        var $button = {
            AddSchedule: $('#addSchedule')
        };

        var url = {
            load: iNet.getUrl('onegate/deptadditional/load'),
            update: iNet.getUrl('onegate/deptadditional/update'), //worktimes, schedule, scheduledow

            load_user: iNet.getUrl('system/account/role'),
            gRecever_load: iNet.getUrl('onegate/receivergroup/load'), //group
            gRecever_create: iNet.getUrl('onegate/receivergroup/create') //group, user
        };

        var $form = {
            tableSchedule: $('#working-time-schedule-tbl'),
            tableContainer: $('#working-time-container'),
            tableState: $('#working-time-saturdayState'),
            maxAppt: $('#working-time-txt-maxAppt'),
            warnBeforeLate: $('#working-time-txt-warnBeforeLate'),
            waitHourOfReceiver: $('#working-time-txt-waitHourOfReceiver'),
            waitHourOfCitizenReturn: $('#working-time-txt-waitHourOfCitizenReturn'),
            receiptPattern: $('#working-time-txt-receiptPattern'),
            edgeTimeAccept: $('#working-time-txt-edgeTimeAccept'),
            resetFlag: $('#working-time-txt-resetFlag'),
            centerPlace: $('#working-time-select-centerPlace')
        };

        $form.centerPlace = FormService.createSelect('working-time-select-centerPlace', [], 'id', 2, true, true);
        $.postJSON(url.load_user, {}, function(result){
            var __result = result || {};
            if (CommonService.isSuccess(__result)) {
                var __listUser = [];
                $.each(__result.items || [], function(i, obj){
                    __listUser.push({id: obj.username, code: obj.username, name: obj.fullname})
                });
                $form.centerPlace = FormService.createSelect('working-time-select-centerPlace', __listUser, 'id', 2, true, true);
                $form.centerPlace.on('change', function(){
                    centerPlaceChanged = true;
                });
                $.postJSON(url.gRecever_load, {"group": "CENTER"}, function(data){
                    var __data = data || {};
                    if (CommonService.isSuccess(__data)) {
                        $form.centerPlace.setValue([(__data.users || []).toString()]);
                    }
                })
            }
        });

        $form.tableContainer.find('input.time-picker').each(function(i, timepicker){
            $(timepicker).timepicker({
                minuteStep: 1,
                showSeconds: false,
                showMeridian: false
            });
        });

        var convertTime = function(time){
            var __times = time || "";
            var __hours = 0, __minutes = 0;

            if (!iNet.isEmpty(__times)){
                __hours = Math.floor(__times/60);
                __minutes = __times%60;

                if (__hours < 10) {__hours = "0" + __hours;}
                if (__minutes < 10) {__minutes = "0" + __minutes;}

                __times = __hours + ":" + __minutes;
            } else {
                __times = "00:00";
            }

            return __times;
        };
        var addSchedule = function(dataSchedule){
            var __dataSchedule = dataSchedule || {};

            var __html = '<tr data-action="row"><td>';
            __html+='<select style="width: 100%;" id="'+iNet.generateId()+'" class="multiselect" multiple="multiple">';
            __html+='<option value="2">'+resource.workingtime["mon"]+'</option>';
            __html+='<option value="3">'+resource.workingtime["tue"]+'</option>';
            __html+='<option value="4">'+resource.workingtime["wed"]+'</option>';
            __html+='<option value="5">'+resource.workingtime["thu"]+'</option>';
            __html+='<option value="6">'+resource.workingtime["fri"]+'</option>';
            __html+='<option value="7">'+resource.workingtime["sat"]+'</option>';
            __html+='<option value="8">'+resource.workingtime["sun"]+'</option>';
            __html+='</select>';
            __html+='</td>';
            __html+='<td>';
            __html+='<div class="input-icon input-icon-right date bootstrap-timepicker" style="width: 100px;">';
            __html+='<input type="text" value="08:00" class="span12 time-picker">';
            __html+='<i class="add-on icon-time"></i>';
            __html+='</div></td>';
            __html+='<td>';
            __html+='<div class="input-icon input-icon-right date bootstrap-timepicker" style="width: 100px;">';
            __html+='<input type="text" value="11:30" class="span12 time-picker">';
            __html+='<i class="add-on icon-time"></i>';
            __html+='</div></td>';
            __html+='<td>';
            __html+='<div class="input-icon input-icon-right date bootstrap-timepicker" style="width: 100px;">';
            __html+='<input type="text" value="13:30" class="span12 time-picker">';
            __html+='<i class="add-on icon-time"></i>';
            __html+='</div></td>';
            __html+='<td>';
            __html+='<div class="input-icon input-icon-right date bootstrap-timepicker" style="width: 100px;">';
            __html+='<input type="text" value="17:30" class="span12 time-picker">';
            __html+='<i class="add-on icon-time"></i>';
            __html+='</div></td>';
            __html+='<td><span data-action="delete" style="cursor: pointer" title="Delete" class="label label-important"><i class="icon-trash icon-white"></i></span></td>';
            __html+='</tr>';
            var $row = $(__html);

            $form.tableSchedule.find('tbody:first').append($row);

            $row.find('input.time-picker').each(function(i, timepicker){
                $(timepicker).timepicker({
                    minuteStep: 1,
                    showSeconds: false,
                    showMeridian: false
                });

                if ((__dataSchedule.schedule || []).length == 4){
                    $(timepicker).val(convertTime(__dataSchedule.schedule[i]));
                }
            });

            $row.find('[multiple="multiple"]').each(function(i, select){
                select = new iNet.ui.form.select.Select({
                    placeholder: resource.workingtime.selectPlaceholder,
                    allowClear: true,
                    id: $(select).prop('id'),
                    formatResult: function (item) {
                        var __item = item || {};
                        return __item.text;
                        //return String.format('<span class="label label-info">{0}</span> {1}', '', __item.text);
                    },
                    formatSelection: function (item) {
                        var __item = item || {};
                        return __item.text;
                        //return String.format('<span class="label label-info" style="height: auto !important;">{0}</span> {1}', '', __item.text);
                    }
                });

                select.setValue(__dataSchedule.dayofweek || '');
            });

            $row.find('[data-action="delete"]').each(function(i, btn){
                $(btn).on('click', function(){
                    $(this).parent().parent().remove();
                });
            });

        };

        $button.AddSchedule.on('click', function(){
            addSchedule();
        });

        $toolbar.SAVE.on('click', function(){
            var __scheduledow = "";
            var __schedule = "";
            var __worktimes = "";

            var rows = $form.tableSchedule.find('tbody:first [data-action="row"]') || [];
            rows.each(function(i, row){
                var select = $(row).find('[multiple="multiple"]').prop('id');
                __scheduledow += ($('#'+ select).val() || "").toString() + ((rows.length == (i+1)) ? "": "/");

                var times = $(row).find('.time-picker') || [];
                times.each(function(j, time){
                    __schedule += $(time).val() + ((times.length == (j+1)) ? "": ",");
                });
                __schedule += ((rows.length == (i+1)) ? "": "/");
            });

            var worktimes = $form.tableContainer.find('.time-picker') || []
            worktimes.each(function(k, worktime){
                __worktimes += $(worktime).val() + ((worktimes.length == (k+1)) ? "": ",");
            });

            var __saturdayState = $form.tableState.find('[name="saturdayState"]:checked').val();


            var __params = {
                maxAppt: $form.maxAppt.val(),
                receiptPattern: $form.receiptPattern.val(),
                waitHourOfCitizenReturn: $form.waitHourOfCitizenReturn.val(),
                waitHourOfReceiver: $form.waitHourOfReceiver.val(),
                warnBeforeLate: $form.warnBeforeLate.val(),
                edgeTimeAccept: $form.edgeTimeAccept.val(),
                resetFlag: $form.resetFlag.val(),
                schedule: __schedule,
                scheduledow: __scheduledow,
                saturdayState: __saturdayState,
                worktimes: __worktimes
            };

            $.postJSON(url.update, __params, function(result){
                var __result = result || {};
                if (CommonService.isSuccess(__result)) {
                    self.notifySuccess(resource.constant.save_title, resource.constant.save_success);
                } else {
                    self.notifyError(resource.constant.save_title, self.getNotifyContent(resource.constant.save_error, __result.errors || []));
                }
            });

            if (centerPlaceChanged){
                centerPlaceChanged = false;
                var __params = {
                    "group": "CENTER",
                    "users": ($form.centerPlace != null) ? $form.centerPlace.getValue().toString() : ""
                };

                if (!iNet.isEmpty(__params.users)){
                    $.postJSON(url.gRecever_create, __params, function(result){
                        var __result = result || {};
                        console.log(">>gRecever_create>>", __result);
                    });
                }
            }
        });

        $.postJSON(url.load, {}, function(result){
            var __result = result || {};
            if (CommonService.isSuccess(__result)) {
                var __appointments = __result.appointments || [];
                var __worktimes = __result.worktime || [];
                var __saturdayState = __result.saturdayState || 0;

                $.each(__appointments, function(i, appointment){
                    addSchedule(appointment);
                });

                if (__worktimes.length == 4){
                    $form.tableContainer.find('.time-picker').each(function(i, time){
                        $(time).val(convertTime(__worktimes[i]));
                    });
                } else {
                    $form.tableContainer.find('.time-picker').each(function(i, time){
                        $(time).val("00:00");
                    });
                }

                $form.maxAppt.val(__result.maxAppt || 0);
                $form.receiptPattern.val(__result.receiptPattern || "");
                $form.waitHourOfCitizenReturn.val(__result.waitHourOfCitizenReturn || 0);
                $form.waitHourOfReceiver.val(__result.waitHourOfReceiver || 0);
                $form.warnBeforeLate.val(__result.warnBeforeLate || 0);
                $form.edgeTimeAccept.val(__result.edgeTimeAccept || 0);
                $form.resetFlag.val((iNet.isEmpty(__result.resetFlag) ? 2 : __result.resetFlag));

                $form.tableState.find('[name="saturdayState"][value="'+__saturdayState+'"]').prop("checked", true);
            }
        });

        iNet.ui.admin.WorkingTime.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.admin.WorkingTime, iNet.ui.app.widget);

    new iNet.ui.admin.WorkingTime().show();
});
