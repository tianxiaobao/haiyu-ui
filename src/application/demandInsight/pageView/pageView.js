angular.module('myApp').controller('pageViewController', ['$http', '$stateParams', '$state', '$rootScope', '$scope','MONTHUV_API','MONTHPV_API',
    'VIEW_AREA_API','VIEW_KEYWORD_API','VIEW_BRAND_API','VIEW_GROUP_API','VIEW_SIZE_API','VIEW_PRICE_API','VIEW_MATERIAL_API','VIEW_COLOR_API','VIEW_STYLE_API','VIEW_PATTERN_API',
	function ($http, $stateParams, $state, $rootScope, $scope,MONTHUV_API,MONTHPV_API,VIEW_AREA_API,VIEW_KEYWORD_API,VIEW_BRAND_API,VIEW_GROUP_API,VIEW_SIZE_API,VIEW_PRICE_API,VIEW_MATERIAL_API,VIEW_COLOR_API,VIEW_STYLE_API,VIEW_PATTERN_API) {
        // 图表ID
        $scope.tableList = [
            {
                tabId:'monthPageView',
                api: MONTHPV_API
            },
            {
                tabId:'monthUserView',
                api: MONTHUV_API
            },
            {
                tabId:'mapArea',
                api: VIEW_AREA_API
            },
            {
                tabId:'keyword',
                api: VIEW_KEYWORD_API
            },
            {
                tabId:'brandProp',
                api: VIEW_BRAND_API
            },
            {
                tabId:'crowdProp',
                api: VIEW_GROUP_API
            },
            {
                tabId:'sizeProp',
                api: VIEW_SIZE_API
            },
            {
                tabId:'priceProp',
                api: VIEW_PRICE_API
            },
            {
                tabId:'materialProp',
                api: VIEW_MATERIAL_API
            },
            {
                tabId:'colorProp',
                api: VIEW_COLOR_API
            },
            {
                tabId:'styleProp',
                api: VIEW_STYLE_API
            },
            {
                tabId:'typeProp',
                api: VIEW_PATTERN_API
            },
        ];
        // 图表y轴显示名称
        var sName = [
            '页面访问量',
            '用户访问量',
        ];
        $scope.tabLength = $scope.tableList.length;
        // 访问量配置
        function monthOption(xData,yData,sName,flag){
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
                        name:flag?'亿':'百万',
                        type : 'value',
                        // axisLabel:{
                        //     formatter:function (value, index) {
                        //         return value/1000000;
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
        //配置地图
        function areaOption(xData){
            var max = 0;
            for(var i=0;i<xData.length;i++){
                max = max>Number(xData[i].value)?max:Number(xData[i].value);
                xData[i].tooltip={formatter:'{a0}<br />{b0}: {c0}%'};
            }
            return option = {
                tooltip: {
                    trigger: 'item',
                },
                visualMap: {
                    min: 0,
                    max: Math.ceil(max),
                    left: 'left',
                    top: 'bottom',
                    text: ['高','低'],
                    calculable: true,
                    show: true,
                    color: ['#00c4c2','#ecffff']
                },
                series: [
                    {
                        name: '占比',
                        type: 'map',
                        mapType: 'china',
                        roam: false,
                        label: {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        data:xData
                    }
                ]
            };
        }
        function pieOption(xData,yData){
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
                        name: '占比',
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
        function verOption(xData,yData){
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
                        name:'占比',
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
            $http({
                url: tab.api,
                method: "GET",
                params:{cate:$scope.selectedCate.id,year:$scope.selectedYear.id,q:$scope.selectedSeason.id}
            }).success(function (data) {
                if(tab.tabId=='keyword'){
                    $scope.keyList = data.data;
                }else{
                    setData(tab.tabId,data);
                }
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
                case 'monthPageView':
                    monthOption(data.x,data.y,sName[0],true);
                    break;
                case 'monthUserView':
                    monthOption(data.x,data.y,sName[1],false);
                    break;
                case 'mapArea':
                    areaOption(data.data);
                    break;
                case 'brandProp':
                    verOption(data.x,data.y);
                    break;
                case 'crowdProp':
                    verOption(data.x,data.y);
                    break;
                case 'sizeProp':
                    pieOption(data.x,data.y);
                    break;
                case 'priceProp':
                    pieOption(data.x,data.y);
                    break;
                case 'materialProp':
                    pieOption(data.x,data.y);
                    break;
                case 'colorProp':
                    pieOption(data.x,data.y);
                    break;
                case 'styleProp':
                    pieOption(data.x,data.y);
                    break;
                case 'typeProp':
                    pieOption(data.x,data.y);
                    break;
            }
            myChart.setOption(option);
        }

}]);