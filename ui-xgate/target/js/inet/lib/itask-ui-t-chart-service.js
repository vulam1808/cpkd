// #PACKAGE: itask-ui-t-chart-service
// #MODULE: TChart
$(function () {
    iNet.ns("iNet.ui.task", "iNet.ui.task.TChart");
    iNet.ui.task.TChart = function () {
        this.id = 'chart-home-div';
        var self = this;

        //LEFT MENU ==============================================
        var $taskMenu = iNet.getLayout().taskMenu;
        $taskMenu.on('menuchange', function(){
        });
        $taskMenu.on('create', function(){
            createRequest();
        });

        //REQUEST TASK ===========================================
        var wgRequest = null;
        var createRequest = function () {
            if (wgRequest == null){
                wgRequest = new iNet.ui.task.TRequest();
            }

            wgRequest.on('finish', function(data){
                self.show();
                wgRequest.hide();
                if (!iNet.isEmpty(data)){
                    $taskMenu.refresh('chart');
                    setTimeout(function(){loadChart();}, 2000);
                }
            });
            wgRequest.setData({});
            wgRequest.show();
            self.hide();
        };

        var __htmlInfo = '';
        __htmlInfo+='<tr>';
        __htmlInfo+='   <td class="nowrap" data-hash="{2}">';
        __htmlInfo+='       <span data-action class="chart-number processing">{0}</span>';
        __htmlInfo+='       <span>&nbsp; {1}</span>';
        __htmlInfo+='   </td>';
        __htmlInfo+='   <td class="nowrap"></td>';
        __htmlInfo+='</tr>';

        var resource = {
            chart: iNet.resources.receiver.chart,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var changeLocation = function(hash){
            if (!iNet.isEmpty(hash)){
                iNet.getLayout().location.href = iNet.getUrl('xgate/page/index') + hash;
            }
        };

        var createChart = function(config){
            var __config = config || {};

            var __data = __config.data || {};

            var __colors = ['#32C8DE','#F00', '#FF892A'];
            var __series = {
                pie: {
                    show: true,
                    innerRadius: 0.4,
                    label: {
                        show: true,
                        radius: 2.3 / 4,
                        formatter: function (label, series) {
                            return '<div><span  style="font-size:10pt;color:white;">' + series.data[0][1] + '</span></div>';
                        }
                    }
                }
            };
            var __grid= {hoverable: false,clickable: true};
            var __legend = {
                show: false
            };
            var __options = {
                series: __series,
                colors: __colors,
                grid: __grid,
                legend: __legend
            };

            var __03Data = __data.process || [];
            var $elChart = $.getCmp(__config.idChart);
            $elChart.unbind();
            $.plot($elChart, __03Data, __options);
            if(__data.total > 0){
                $elChart.append(String.format('<span class="pie-chart-title"><b>{0}</b><br/> {1}</span>', __data.total, __data.title));
            }
            $elChart.bind('plotclick',function(e,pos,obj){
                changeLocation(obj.series.hash);
            });

            var $elInfo = $.getCmp(__config.idInfo);
            $.each(__03Data, function(i, process){
                $elInfo.append(String.format(__htmlInfo, process.data, process.label, process.hash));
            });

            $('[data-hash]').on('click', function(e){
                var __hash = $(e.currentTarget).attr('data-hash') || "";
                changeLocation(__hash);
            });
        };

        var loadChart = function() {
            $('#chart-home-01-chart').html('');
            $('#chart-home-01-info').html('');
            $('#chart-home-02-chart').html('');
            $('#chart-home-02-info').html('');
            $('#chart-home-03-chart').html('');
            $('#chart-home-03-info').html('');

            var __countData = 0;
            var __titleData = "";

            var __01Data = [];
            var __01Total = 0;
            __titleData = "procedureNoWorkflow";
            __countData = $taskMenu.count("expway"+__titleData);
            __01Data.push({
                label: resource.chart[__titleData],
                data: __countData,
                hash: "#receiver-expway-" + __titleData
            });
            __01Total += __countData;

            __titleData = "procedureWorkflow";
            __countData = $taskMenu.count("expway"+__titleData);
            __01Data.push({
                label: resource.chart[__titleData],
                data: __countData,
                hash: "#receiver-expway-" + __titleData
            });
            __01Total += __countData;

            createChart({
                idChart: 'chart-home-01-chart',
                idInfo: 'chart-home-01-info',
                data: {
                    process: __01Data,
                    total: __01Total,
                    title: resource.chart.briefcase
                }
            });

            var __02Data = [];
            var __02Total = 0;
            __titleData = "procedureNoWorkflow";
            __countData = $taskMenu.count("organ"+__titleData);
            __02Data.push({
                label: resource.chart[__titleData],
                data: __countData,
                hash: "#receiver-organization-" + __titleData
            });
            __02Total += __countData;

            __titleData = "procedureWorkflow";
            __countData = $taskMenu.count("organ"+__titleData);
            __02Data.push({
                label: resource.chart[__titleData],
                data: __countData,
                hash: "#receiver-organization-" + __titleData
            });
            __02Total += __countData;

            createChart({
                idChart: 'chart-home-02-chart',
                idInfo: 'chart-home-02-info',
                data: {
                    process: __02Data,
                    total: __02Total,
                    title: resource.chart.briefcase
                }
            });

            var __03Data = [];
            var __03Total = 0;
            __titleData = "queue";
            __countData = $taskMenu.count(__titleData);
            __03Data.push({
                label: resource.chart[__titleData],
                data: __countData,
                hash: "#receiver-" + __titleData
            });
            __03Total += __countData;

            __titleData = "inprocess";
            __countData = $taskMenu.count(__titleData);
            __03Data.push({
                label: resource.chart[__titleData],
                data: __countData,
                hash: "#receiver-" + __titleData
            });
            __03Total += __countData;

            __titleData = "completed";
            __countData = $taskMenu.count(__titleData);
            __03Data.push({
                label: resource.chart[__titleData],
                data: __countData,
                hash: "#receiver-" + __titleData
            });
            __03Total += __countData;

            __titleData = "rejected";
            __countData = $taskMenu.count(__titleData);
            __03Data.push({
                label: resource.chart[__titleData],
                data: __countData,
                hash: "#receiver-" + __titleData
            });
            __03Total += __countData;

            __titleData = "published";
            __countData = $taskMenu.count(__titleData);
            __03Data.push({
                label: resource.chart[__titleData],
                data: __countData,
                hash: "#receiver-" + __titleData
            });
            __03Total += __countData;

            createChart({
                idChart: 'chart-home-03-chart',
                idInfo: 'chart-home-03-info',
                data: {
                    process: __03Data,
                    total: __03Total,
                    title: resource.chart.briefcase
                }
            });
        };

        $(window).on('load', function(){
            setTimeout(function(){loadChart();}, 2000);
        });
        iNet.ui.task.TChart.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.task.TChart, iNet.ui.app.widget);

    new iNet.ui.task.TChart().show();
});
