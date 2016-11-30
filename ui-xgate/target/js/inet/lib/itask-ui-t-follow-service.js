// #PACKAGE: itask-ui-t-follow-service
// #MODULE: TFollowService
$(function () {
    iNet.ns("iNet.ui.task", "iNet.ui.task.TFollow");

    iNet.ui.task.TFollow = function () {
        this.id = 'follow-div';
        var self = this;

        var resource = {
            record: iNet.resources.receiver.record,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            commentCreate: iNet.getUrl('firmtask/comment/create'), //taskRequest, note
            urgent: iNet.getUrl('onegate/record/urgent'), //additionalID
            deptrecord: iNet.getUrl('onegate/deptrecord/search'),
            pcstrecord: iNet.getUrl('onegate/pcstrecord/search'),
            mngtrecord: iNet.getUrl('onegate/mngtrecord/search'),
            deptcount: iNet.getUrl('onegate/deptrecord/count'),
            pcstcount: iNet.getUrl('onegate/pcstrecord/count'),
            mngtcount: iNet.getUrl('onegate/mngtrecord/count'),

            recordSearch: '',
            recordCount: '',

            avatar: iNet.getUrl('system/userprofile/photo') //usercode=phongtt@inetcloud.vn&thumbnail=32
        };

        var $action = {
            backPage: $('[data-type="row-pagging"] [data-action="backPage"]'),
            nextPage: $('[data-type="row-pagging"] [data-action="nextPage"]'),
            menuChange: $('[data-action="menuChange"]'),
            search: $('[data-action="search"]')
        };

        var $form = {
            table: $('#chart-record-table'),
            tableKeyword: $('#chart-record-table-keyword'),
            rowPagging: $('#chart-record-table [data-type="row-pagging"]'),
            pageNumber: $('#chart-record-table [data-page-number]'),
            pageTotal: $('#chart-record-table [data-page-total]'),
            rowTemp: $('#chart-record-table [data-type="row-template"]'),
            tableData: $('#chart-record-table tbody[data-type="data"]'),
            totalProcess: $('[total-process][data-type="number"]'),
            totalOverdue: $('[total-overdue][data-type="number"]'),
            totalUrgent: $('[total-urgent][data-type="number"]')
        };


        if (!iNet.isEmpty(iNet.roles)){
            var __roles = iNet.roles || {};

            if (__roles.management) {
                url.recordSearch = url.mngtrecord;
                url.recordCount = url.mngtcount;
            } else if (__roles.processor) {
                url.recordSearch = url.pcstrecord;
                url.recordCount = url.pcstcount;
            } else if (__roles.receiver) {
                url.recordSearch = url.deptrecord;
                url.recordCount = url.deptcount;
            }
        }

        $action.menuChange.on('click', function(){
            var __hash = $(this).attr('href') || "";
            if (!iNet.isEmpty(__hash)){
                iNet.getLayout().location.href = iNet.getUrl('xgate/page/index') + __hash;
            }
        });
        $action.backPage.on('click', function(){
            var __pageNumber = CommonService.getNumber($form.pageNumber.attr("pageNumber"), 0);
            var __pageTotal = CommonService.getNumber($form.pageTotal.attr("pageTotal"), 0);

            __pageNumber--;
            if (__pageNumber < 0){
                __pageNumber = 0;
            }

            __loadRecord(__pageNumber);
        });
        $action.nextPage.on('click', function(){
            var __pageNumber = CommonService.getNumber($form.pageNumber.attr("pageNumber"), 0);
            var __pageTotal = CommonService.getNumber($form.pageTotal.attr("pageTotal"), 0);

            __pageNumber++;
            if (__pageNumber >= __pageTotal){
                __pageNumber = __pageTotal - 1;
            }

            __loadRecord(__pageNumber);
        });
        $action.search.on('click', function(){
            var __type = $(this).attr('data-type') || "";
            var __classDisabled = $(this).attr('class-disabled') || "";
            var __classEnabled = $(this).attr('class-enabled') || "";

            if (__type == "inprocess" ||
                __type == "overdue" ||
                __type == "urgent") {

                if ($(this).hasClass(__classDisabled)) {
                    $action.search.each(function(i, item){
                        var _classDisabled = $(item).attr('class-disabled') || "";
                        var _classEnabled = $(item).attr('class-enabled') || "";
                        $(item).removeClass(_classEnabled).addClass(_classDisabled);
                    });
                    __countTotal();
                    $(this).removeClass(__classDisabled).addClass(__classEnabled);
                } else {
                    $(this).removeClass(__classEnabled).addClass(__classDisabled);
                }
            }

            __loadRecord(0);
        });
        $form.tableKeyword.on('keyup', function(e){
            if (e.which == 13){
                __loadRecord(0);
            }
        });

        var initEvent = function() {
            $form.tableData.find('[data-action]').unbind('click');

            $form.tableData.find('[data-action="dropdown"]').each(function(i, item){
                $(item).on('click', function () {
                    $('[data-action="dropdown"] li.dropdown').removeClass('open');

                    var $me = $(this);
                    $me.find('li.dropdown').addClass('open');
                    setTimeout(function(){
                        $me.find('li.dropdown').removeClass('open');
                    }, 3000);
                });
            });

            $form.tableData.find('[data-action="print"]').each(function(i, item){
                $(item).on('click', function(){
                    var __requestID = $(this).attr("requestID") || "";
                    var __formNo = $(this).attr("formNo") || "";
                    if (!iNet.isEmpty(__requestID) && !iNet.isEmpty(__formNo)){
                        window.open(iNet.getUrl(CommonService.pageRequest[__formNo]) + '?task=' + __requestID, '_blank');
                        $(this).parent().parent().removeClass('open');
                    }
                });
            });

            $form.tableData.find('[data-action="view"]').each(function(i, item){
                $(item).on('click', function(){
                    var __serialNo = $(this).attr("serialNo") || "";
                    var __recordStatus = $(this).attr("recordStatus") || "";
                    var __pageUrl = 'chart';
                    if (!iNet.isEmpty(__serialNo) && !iNet.isEmpty(__recordStatus)){
                        var __url = iNet.getUrl(CommonService.pageRequest.xgate);
                        /*__url+= '?serialNo=' + __serialNo;
                        __url+= '&pageUrl=' + __pageUrl;*/
                        __recordStatus = __recordStatus.toLowerCase();
                        __url+= CommonService.pageRequest.hashtag[__recordStatus];
                        iNet.getLayout().window.location.href = __url;
                        iNet.getLayout().parentParams={keyword: __serialNo, pageUrl: __pageUrl};
                        //window.open(__url);
                    }
                });
            });

            $form.tableData.find('[data-action="comment"]').each(function(i, item){
                $(item).on('click', function(){
                    var __uuid = $(this).attr("uuid") || "";
                    if (!iNet.isEmpty(__uuid)){
                        $('[data-action="dropdown"] li.dropdown').removeClass('open');
                        cellDisplay(__uuid, [1, 7]);
                    }
                });
            });
            $form.tableData.find('[data-action="comment-submit"]').each(function(i, item){
                $(item).on('click', function(){
                    var $textarea = $(this).parent().parent().find('textarea');
                    var __uuid = $(this).attr("uuid") || "";
                    var __requestID = $(this).attr("requestID") || "";
                    var __note = $textarea.val();
                    if (!iNet.isEmpty(__requestID) && !iNet.isEmpty(__note)){
                        $.postJSON(url.commentCreate, {task: __requestID, note: __note}, function (result) {
                            var __result = result || {};
                            if (CommonService.isSuccess(__result)){
                                $textarea.val("");
                                cellDisplay(__uuid, [1,2,3,4,5,6]);
                                self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                            }
                        },{
                            mask: self.getMask(),
                            msg: iNet.resources.ajaxLoading.processing
                        });
                    }
                });
            });
            $form.tableData.find('[data-action="comment-cancel"]').each(function(i, item){
                $(item).on('click', function(){
                    var __uuid = $(this).attr("uuid") || "";
                    if (!iNet.isEmpty(__uuid)){
                        cellDisplay(__uuid, [1,2,3,4,5,6]);
                    }
                });
            });

            $form.tableData.find('[data-action="urgent"]').each(function(i, item){
                $(item).on('click', function(){
                    var __additionalID = $(this).attr("additionalID") || "";
                    var __uuid = $(this).attr("uuid") || "";
                    if (!iNet.isEmpty(__additionalID)){
                        $.postJSON(url.urgent, {additionalID: __additionalID}, function (result) {
                            var __result = result || {};
                            if (CommonService.isSuccess(__result)){
                                __isUrgent(__uuid, __result.urgent);
                                self.notifySuccess(resource.constant.submit_title, resource.constant.submit_success);
                            }
                        },{
                            mask: self.getMask(),
                            msg: iNet.resources.ajaxLoading.processing
                        });
                    }
                });
            });
        };

        var __countTotal = function(){
            $form.totalProcess.text(0);
            $form.totalOverdue.text(0);
            $form.totalUrgent.text(0);

            $.postJSON(url.recordCount, {}, function (result) {
                if (CommonService.isSuccess(result)){
                    var __result = result || {};
                    $form.totalProcess.text(__result.onegateProcess || "0");
                    $form.totalOverdue.text(__result.onegateOverdue || "0");
                    $form.totalUrgent.text(__result.onegateUrgent || "0");
                }
            });
        };
        __countTotal();

        var __isUrgent = function(uuid, isUrgent){
            var $urgentCell = $form.tableData.find('tr[uuid="'+uuid+'"] [data-display="urgent"]');
            if (isUrgent){
                $urgentCell.css('display', '');
            } else {
                $urgentCell.css('display', 'none');
            }
        };
        var __loadRecord = function(pageNumber){
            $form.tableData.html('');
            $form.pageNumber.attr("pageNumber", pageNumber || 0);
            $form.pageNumber.text(0);
            $form.pageTotal.attr("pageTotal", 0);
            $form.pageTotal.text(0);

            var __keyword = $form.tableKeyword.val();
            var __params = {
                context: iNet.context,
                zone: iNet.zone,
                pageNumber: pageNumber,
                pageSize: 10,
                keyword: __keyword
            };

            var type = "";
            $action.search.each(function(i, item){
                var _classEnabled = $(item).attr('class-enabled') || "";
                if (!iNet.isEmpty(_classEnabled)){
                    if ($(item).hasClass(_classEnabled)){
                        type = $(item).attr('data-type') || "";
                        return false;
                    }
                }
            });

            if (type == "urgent" ||
                type == "overdue") {
                __params.type = type;
            }

            if (type == "inprocess"){
                __params.status = "INPROCESS";
            }

            if(iNet.isEmpty(url.recordSearch)){
                self.notifyError(resource.constant.warning_title, "SERVICE_NOT_FOUND");
                return;
            }

            $.postJSON(url.recordSearch, __params, function (result) {
                $form.pageNumber.text(0);
                $form.pageNumber.attr("pageNumber", 0);
                $form.pageTotal.text(0);
                $form.pageTotal.attr("pageTotal", 0);

                if (CommonService.isSuccess(result)){
                    var __result = result || {};
                    var __totalRecord = __result.total || 0;
                    var __totalPage = CommonService.getTotalPage(__totalRecord, 10);
                    var __pageNumber = (pageNumber || 0) + 1;

                    if (__totalRecord > 0){
                        $form.pageNumber.text(__pageNumber);
                        $form.pageNumber.attr("pageNumber", (pageNumber || 0));
                        $form.pageTotal.text(__totalPage);
                        $form.pageTotal.attr("pageTotal", __totalPage);
                    }

                    $.each(__result.items, function(i, item){
                        item.recordStatus = item.status;

                        var __clsStatus = "bg-success"; //bg-danger, bg-grey, bg-blue
                        if (item.status == "INPROCESS"){
                            __clsStatus = "bg-blue";
                        } else if (item.status == "REJECTED" || item.status == "COMPLETED"){
                            __clsStatus = "bg-danger";
                        } else if (item.status == "PUBLISHED"){
                            __clsStatus = "bg-grey";
                        } else if (item.status == "FOLLOW"){
                        } else if (item.status == "REFUSE"){
                        }

                        $form.rowTemp.find('[data-color="status-color"]').removeClass('bg-success bg-danger bg-grey bg-blue');
                        $form.rowTemp.find('[data-color="status-color"]').addClass(__clsStatus);

                        var __clsPercent = "text-success";
                        var __clsPercentFull = "text-success text-info text-violet text-error";
                        //text-success text-info text-warning text-error
                        var __clsAppointment = "text-success";
                        var __clsAppointmentFull = "text-success text-info text-violet text-error";
                        //text-success text-info text-warning text-error
                        var __clsAppointmentBorder = "border-success";
                        var __clsAppointmentBorderFull = "border-success border-info border-violet border-danger";
                        //border-success border-info border-warning border-danger
                        var __percent = CommonService.getPercentCurrentDate(item.created, item.appointment, item.completed);
                        if (CommonService.getNumber(__percent, 0) <= 25){
                            __clsPercent = "text-success";
                            __clsAppointment = "text-success";
                            __clsAppointmentBorder = "border-success";
                        } else if (CommonService.getNumber(__percent, 0) <= 50){
                            __clsPercent = "text-info";
                            __clsAppointment = "text-info";
                            __clsAppointmentBorder = "border-info";
                        } else if (CommonService.getNumber(__percent, 0) <= 75){
                            __clsPercent = "text-violet";
                            __clsAppointment = "text-violet";
                            __clsAppointmentBorder = "border-violet";
                        } else if (CommonService.getNumber(__percent, 0) <= 100){
                            __clsPercent = "text-error";
                            __clsAppointment = "text-error";
                            __clsAppointmentBorder = "border-danger";
                        }


                        $form.rowTemp.find('[data-color="percent-color"]').removeClass(__clsPercentFull);
                        $form.rowTemp.find('[data-color="percent-color"]').addClass(__clsPercent);
                        item.percent = CommonService.getPercentCurrentDate(item.created, item.appointment, item.completed);

                        item.avatar = url.avatar + '?thumbnail=48&usercode='+ item.creator;
                        $form.rowTemp.find('[data-col="avatar"]').attr('src', item.avatar);

                        item.status = resource.record["status"+item.status] || "";
                        item.created = (item.created>0)? new Date(item.created).format('H:i d/m/Y') : "";
                        $form.rowTemp.find('[data-color="appointment-color"]').removeClass(__clsAppointmentFull);
                        $form.rowTemp.find('[data-color="appointment-color"]').addClass(__clsAppointment);
                        $form.rowTemp.find('[data-color="appointment-border-color"]').removeClass(__clsAppointmentBorderFull);
                        $form.rowTemp.find('[data-color="appointment-border-color"]').addClass(__clsAppointmentBorder);
                        item.appointment = (item.appointment>0)? new Date(item.appointment).format('H:i d/m/Y') : "";
                        item.completed = (item.completed>0)? new Date(item.completed).format('H:i d/m/Y') : "";

                        for(var key in item){
                            $form.rowTemp.find('[data-col="'+key+'"]').text(item[key]);
                        }

                        if (item.urgent){
                            $form.rowTemp.find('[data-display="urgent"]').css('display','');
                        } else {
                            $form.rowTemp.find('[data-display="urgent"]').css('display','none');
                        }

                        $form.rowTemp.find('[uuid]').attr('uuid', item.uuid);
                        $form.rowTemp.find('[recordStatus]').attr('recordStatus', item.recordStatus);
                        $form.rowTemp.find('[requestID]').attr('requestID', item.requestID);
                        $form.rowTemp.find('[serialNo]').attr('serialNo', item.serialNo);
                        $form.rowTemp.find('[additionalID]').attr('additionalID', item.additionalID);
                        $form.tableData.append('<tr uuid="'+item.uuid+'">' + $form.rowTemp.html() + '</tr>');
                    });

                    initEvent();
                }
            });
        };
        __loadRecord(0);

        var cellDisplay = function (rowId, listCell) {
            if (iNet.isEmpty(listCell) || iNet.isEmpty(rowId))
                return;

            $form.tableData.find('tr[uuid="' + rowId + '"] td[data-cell]').each(function (i, cell) {
                var __cellIndex = $(cell).attr("data-cell") || "";
                if (!iNet.isEmpty(__cellIndex) && __cellIndex.isNumeric()){
                    if (listCell.indexOf(parseInt(__cellIndex)) < 0)
                        $(cell).css('display', 'none');
                    else
                        $(cell).css('display', '');
                }
            });
        };

        iNet.ui.task.TFollow.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.task.TFollow, iNet.ui.app.widget);

    new iNet.ui.task.TFollow().show();
});
