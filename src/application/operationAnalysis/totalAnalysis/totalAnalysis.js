angular.module('myApp').controller('totalAnalysisController', ['$http','$scope',
    'SALES_MONTH_API','INCOME_MONTH_API','BRAND_PROP_API','CROWD_PROP_API','SIZE_PROP_API','PRICE_PROP_API',
    'MATERIAL_PROP_API','COLOR_PROP_API','STYLE_PROP_API','TYPE_PROP_API',
	function ($http, $scope,SALES_MONTH_API,INCOME_MONTH_API,BRAND_PROP_API,CROWD_PROP_API,
        SIZE_PROP_API,PRICE_PROP_API,MATERIAL_PROP_API,COLOR_PROP_API,STYLE_PROP_API,TYPE_PROP_API) {
        // 图表ID
        $scope.tableList = [
            {
                tabId:'monthSales',
                api: SALES_MONTH_API
            },
            {
                tabId:'monthIncome',
                api: INCOME_MONTH_API
            },
            {
                tabId:'brandProp',
                api: BRAND_PROP_API
            },
            {
                tabId:'crowdProp',
                api: CROWD_PROP_API
            },
            {
                tabId:'sizeProp',
                api: SIZE_PROP_API
            },
            {
                tabId:'priceProp',
                api: PRICE_PROP_API
            },
            {
                tabId:'materialProp',
                api: MATERIAL_PROP_API
            },
            {
                tabId:'colorProp',
                api: COLOR_PROP_API
            },
            {
                tabId:'styleProp',
                api: STYLE_PROP_API
            },
            {
                tabId:'typeProp',
                api: TYPE_PROP_API
            },
        ];
        // 图表y轴显示名称
        var sName = [
            '销售总量',
            '销售收入',
            '占比',
        ];
        $scope.tabLength = $scope.tableList.length;
        //配置月份
        function monthOption(xData,yData,sName){
            var flag=sName=='销售总量'?true:false;
            return option = {
                tooltip : {
                    trigger: 'axis'
                },
                grid: {
                    left: '3%',
                    right: '8%',
                    bottom: '3%',
                    top:'40px',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        name:'月',
                        boundaryGap : false,
                        data : xData
                    }
                ],
                yAxis : [
                    {
                        name:flag?'百万':'亿',
                        type : 'value',
                        // axisLabel:{
                        //     formatter:function (value, index) {
                        //         return flag?value/1000000:value/100000000;
                        //     }
                        // }
                    }
                ],
                series : [
                    {
                        name:sName,
                        type:'line',
                        areaStyle: {normal: {color:'#00c4c2'}},
                        lineStyle: {normal: {color:'#00c4c2'}},
                        data:yData
                    }
                ]
            };
        }
        function pieOption(xData,yData,sName){
            return option = {
                color: ['#00c4c2','#066b69','#fac54c','#89670c','#15aaff','#00549c','#e18002','#793000','#a8c476','#5c7137','#ffb496','#d65645','#abbbbe','#5c676a','#ac99d8','#6B4786'],
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c}%"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: xData
                },
                series : [
                    {
                        name: sName,
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        label:{normal:{show:false}},labelLine:{normal:{show:false},emphasis:{show:false}},
                        data:yData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        }
        //纵向配置
        function verOption(xData,yData,sName){
            return option = {
                color: ['#00c4c2'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '3%',
                    top:'30px',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : xData,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name:'%',
                    }
                ],
                series : [
                    {
                        name:sName,
                        type:'bar',
                        barWidth: '20',
                        itemStyle: {
                            normal: {
                                color:'#00c4c2'
                            }
                        },
                        data:yData
                    }
                ]
            };
        }
        //获取数据
        $scope.getData = function(tab) {
            var param1 = {cate:$scope.selectedCate.id,year:$scope.selectedYear.id,q:$scope.selectedSeason.id}
            $http({
                url: tab.api,
                method: "GET",
                params:param1
            }).success(function (data) {
                setData(tab.tabId,data);
                if($scope.tabNum < $scope.tabLength-1){
                    $scope.tabNum = $scope.tabNum+1;
                    $scope.getData($scope.tableList[$scope.tabNum]);
                }
            }).error(function (data) {
                console.log("获取数据失败");
            });
        };
        // 分配数据
        function setData(id,data){
            // 根据不同图表调用不同配置
            var myChart = echarts.init(document.getElementById(id));
            switch (id) {
                case 'monthSales':
                    monthOption(data.x,data.y,sName[0]);
                    break;
                case 'monthIncome':
                    monthOption(data.x,data.y,sName[1]);
                    break;
                case 'brandProp':
                    verOption(data.x,data.y,sName[2]);
                    break;
                case 'crowdProp':
                    verOption(data.x,data.y,sName[2]);
                    break;
                case 'sizeProp':
                    pieOption(data.x,data.y,sName[2]);
                    break;
                case 'priceProp':
                    pieOption(data.x,data.y,sName[2]);
                    break;
                case 'materialProp':
                    pieOption(data.x,data.y,sName[2]);
                    break;
                case 'colorProp':
                    pieOption(data.x,data.y,sName[2]);
                    break;
                case 'styleProp':
                    pieOption(data.x,data.y,sName[2]);
                    break;
                case 'typeProp':
                    pieOption(data.x,data.y,sName[2]);
                    break;
            }
            myChart.setOption(option);
        }

}]);