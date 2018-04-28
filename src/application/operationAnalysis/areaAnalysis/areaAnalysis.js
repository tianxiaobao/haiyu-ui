angular.module('myApp').controller('areaAnalysisController', ['$http', '$stateParams', '$state', '$rootScope', '$scope','AREASALE_API','AREA_TOP_PROVINCE_API','AREA_BRAND_PROP_API',
    'AREA_CROWD_PROP_API','AREA_SIZE_PROP_API','AREA_PRICE_PROP_API','AREA_MATERIAL_PROP_API','AREA_COLOR_PROP_API','AREA_STYLE_PROP_API','AREA_TYPE_PROP_API',
	function ($http, $stateParams, $state, $rootScope, $scope,AREASALE_API,AREA_TOP_PROVINCE_API,AREA_BRAND_PROP_API,AREA_CROWD_PROP_API,
        AREA_SIZE_PROP_API,AREA_PRICE_PROP_API,AREA_MATERIAL_PROP_API,AREA_COLOR_PROP_API,AREA_STYLE_PROP_API,AREA_TYPE_PROP_API) {
        $scope.province_id = 0;
        // 图表ID
        $scope.tableList = [
            {
                tabId:'mapArea',
                api: AREASALE_API
            },
            {
                tabId:'topPro',
                api: AREA_TOP_PROVINCE_API
            },
            {
                tabId:'brandProp',
                api: AREA_BRAND_PROP_API
            },
            {
                tabId:'crowdProp',
                api: AREA_CROWD_PROP_API
            },
            {
                tabId:'sizeProp',
                api: AREA_SIZE_PROP_API
            },
            {
                tabId:'priceProp',
                api: AREA_PRICE_PROP_API
            },
            {
                tabId:'materialProp',
                api: AREA_MATERIAL_PROP_API
            },
            {
                tabId:'colorProp',
                api: AREA_COLOR_PROP_API
            },
            {
                tabId:'styleProp',
                api: AREA_STYLE_PROP_API
            },
            {
                tabId:'typeProp',
                api: AREA_TYPE_PROP_API
            },
        ];
        $scope.tabLength = $scope.tableList.length;
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
        $scope.changeProvince = function(id){
            $scope.tabNum = 0;
            $scope.province_id = id;
            $scope.getData($scope.tableList[0]);
        }
        //获取数据
        $scope.getData = function(tab) {
            var param1;
            if (tab.tabId == 'mapArea' || tab.tabId == 'topPro') {
                param1 = {cate:$scope.selectedCate.id,year:$scope.selectedYear.id,q:$scope.selectedSeason.id}
            }else{
                param1 = {cate:$scope.selectedCate.id,year:$scope.selectedYear.id,q:$scope.selectedSeason.id,province_id:$scope.province_id}
            }
            $http({
                url: tab.api,
                method: "GET",
                params:param1
            }).success(function (data) {
                if(tab.tabId=="topPro"){
                    $scope.topProvince = data.data;
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