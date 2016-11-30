// #PACKAGE: bfchart
// #MODULE: BfChartService
$(function () {
    iNet.ns("iNet.ui.xgate", "iNet.ui.xgate.BfChart");
    iNet.ui.xgate.BfChart = function () {
        this.id = 'chart-home-div';
        var self = this;

        var resource = {
            record: iNet.resources.receiver.record,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            recordCount: iNet.getUrl('onegate/deptrecord/count'),
            recordSearch: iNet.getUrl('onegate/deptrecord/search'),
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
            tableData: $('#chart-record-table tbody[data-type="data"]')
        };

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
        };

        var recordCount = function(month, year){
            $('[data-type="month"]').text(month || "");
            $('[data-type="year"]').text(year || "");

            $.postJSON(url.recordCount, {}, function (result) {
                if (CommonService.isSuccess(result)){
                    var __result = result || {};

                    var __summaryReceiver = __result.onegateProcess || 0;
                    var __summaryProcess = (__result.onegateCompleted || 0) + (__result.onegateRejected || 0);
                    var __summaryOverdue = __result.onegateOverdue || 0;
                    var __summaryPercent = (__summaryProcess == 0) ? 100 : (100 - (__summaryOverdue*100/__summaryProcess));
                    if (__summaryPercent == 100 || __summaryPercent == 0)
                        __summaryPercent = __summaryPercent.toFixed(0);
                    else {
                        __summaryPercent = __summaryPercent.toFixed(1);
                    }

                    $('[data-type="summary-receiver"]').text(__summaryReceiver);
                    $('[data-type="summary-process"]').text(__summaryProcess);
                    $('[data-type="summary-percent"]').text(__summaryPercent);

                    $('[data-type="expway-has-workflow"]').text(__result.expwayIn || 0);
                    $('[data-type="expway-no-workflow"]').text(__result.expwayOut || 0);
                    $('[data-type="expway-overdue"]').text(__result.expwayOverdue || 0);
                    $('[data-type="expway-total"]').text(__result.expwayTotal || 0);
                    $('[data-type="expway-percent"]').text(__result.expwayPercent || 0);

                    $('[data-type="organ-has-workflow"]').text(__result.organIn || 0);
                    $('[data-type="organ-no-workflow"]').text(__result.organOut || 0);
                    $('[data-type="organ-overdue"]').text(__result.organOverdue || 0);
                    $('[data-type="organ-total"]').text(__result.organTotal || 0);
                    $('[data-type="organ-percent"]').text(__result.organPercent || 0);

                    $('[data-type="onegate-queue"]').text(__result.onegateQueue || 0);
                    $('[data-type="onegate-additional"]').text(__result.onegateAdditional || 0);
                    $('[data-type="onegate-inprocess"]').text(__result.onegateProcess || 0);
                    $('[data-type="onegate-completed"]').text(__result.onegateCompleted || 0);
                    $('[data-type="onegate-rejected"]').text(__result.onegateRejected || 0);
                    $('[data-type="onegate-refuse"]').text(__result.onegateRefuse || 0);
                    $('[data-type="onegate-published"]').text(__result.onegatePublished || 0);
                    $('[data-type="onegate-overdue"]').text(__result.onegateOverdue || 0);
                    $('[data-type="onegate-total"]').text(__result.onegateTotal || 0);
                    $('[data-type="onegate-percent"]').text(__result.onegatePercent || 0);
                }
            });
        };
        var __month = new Date().format('m');
        var __year = new Date().format('Y');
        recordCount(__month, __year);

        iNet.ui.xgate.BfChart.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.xgate.BfChart, iNet.ui.app.widget);

    new iNet.ui.xgate.BfChart().show();
});
