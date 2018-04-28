angular.module('myApp').controller('mainController', ['$http','$state','$scope','INDEX_SALE_API','INDEX_VIEW_API','INDEX_AREA_API',
    'INDEX_HOTBRAND_API','INDEX_HOTGOODS_API',
	function ($http, $state,$scope, INDEX_SALE_API, INDEX_VIEW_API,INDEX_AREA_API,INDEX_HOTBRAND_API,INDEX_HOTGOODS_API) {
        // 图表ID
        var tableList = [
            {
                tabId:'index_sale',
                api: INDEX_SALE_API
            },
            {
                tabId:'index_view',
                api: INDEX_VIEW_API
            },
            {
                tabId:'index_area',
                api: INDEX_AREA_API
            },
            {
                tabId:'hotPro',
                api: INDEX_HOTGOODS_API
            },
            {
                tabId:'hotBrand',
                api: INDEX_HOTBRAND_API
            }
        ];
        var tabLength = tableList.length;
        var tabNum = 0;
        //配置echart option
        function lineOption(xData,yData,legend){
            return option = {
                color: ['#00c4c2','#066b69'],
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:legend,
                },
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '3%',
                    top:'30px',
                    containLabel: true
                },
                xAxis: {
                    name:'月',
                    type: 'category',
                    boundaryGap: false,
                    data: xData
                },
                yAxis: [{
                    name:'百万',
                    type: 'value',
                    // axisLabel:{
                    //     formatter:function (value, index) {
                    //         return value/1000000;
                    //     }
                    // }
                },{
                    name:'亿',
                    type: 'value',
                    // axisLabel:{
                    //     formatter:function (value, index) {
                    //         return value/100000000;
                    //     }
                    // }
                }],
                series: yData
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
        //获取数据
        $scope.getData = function(tab) {
            $http({
                url: tab.api,
                method: "GET"
            }).success(function (data) {
                if(tab.tabId=="hotPro"){
                    $scope.hotProList = data.data;
                }else if(tab.tabId=="hotBrand"){
                    $scope.hotBrandList = data.data;
                }else{
                    setData(tab.tabId,data);
                }
                if(tabNum < tabLength-1){
                    tabNum = tabNum+1;
                    $scope.getData(tableList[tabNum]);
                }
            }).error(function (data) {
                console.log("获取数据失败");
            });
        };
        $scope.getData(tableList[tabNum]);
        // 分配数据
        function setData(id,data){
            // 根据不同图表调用不同配置
            var myChart = echarts.init(document.getElementById(id));
            switch (id) {
                case 'index_sale':
                    lineOption(data.types,data.values,['销售数量','销售额']);
                    break;
                case 'index_view':
                    lineOption(data.types,data.values,['访问页面数','用户数']);
                    break;
                case 'index_area':
                    areaOption(data.data);
                    break;
            }
            myChart.setOption(option);
        }
        //跳转详情
        $scope.toDetail = function(Id){
           $state.go('productPicture',{id:Id});
        };
        //跳转详情
        $scope.search = function(key){
           $state.go('productRepertory',{key:key});
        };

}]);