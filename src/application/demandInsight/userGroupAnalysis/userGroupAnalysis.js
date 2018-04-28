angular.module('myApp').controller('userGroupAnalysisController', ['$http', '$stateParams', '$state', '$rootScope', '$scope','USERGROUP_ANALYSIS_API',
	function ($http, $stateParams, $state, $rootScope, $scope,USERGROUP_ANALYSIS_API) {
        // 图表ID
        $scope.tableList = [
            'sexDis',
            'ageDis',
            'educationDis',
            'marryDis',
            'professionDis',
            'rfmDis',
            'userValDis',
            'actionType',
            'purchasDis',
            'medalDis',
            'cate1',
            'cate2',
            'cate3',
            'colorDis',
            'brandDis',
        ];
        $scope.isUserAnaly = true;
        $scope.upSuccess = false;
        $scope.tabLength = $scope.tableList.length;
        // 横向配置
        function horOption(xData,yData){
            return option = {
                color: ['#00c4c2','#65aab0'],
                tooltip: {
                    trigger: 'axis',
                        axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '8%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    name:'%',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: xData
                },
                series:yData
            };

        }
        //纵向配置
        function verOption(xData,yData){
            return option = {
                color: ['#00c4c2','#65aab0'],
                tooltip: {
                    trigger: 'axis',
                        axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: {
                    type: 'value',
                    name:'%',
                    boundaryGap: [0, 0.01]
                },
                xAxis: {
                    type: 'category',
                    data: xData
                },
                series:[{
                    name:'总体',
                    type:'bar',
                    barWidth: '20',
                    data:yData[0].data
                },{
                    name:'单独',
                    type:'bar',
                    barWidth: '20',
                    data:yData[1].data
                }],
            };
        }
        // 横向配置
        function horOption1(xData,yData,flag){
            return option = {
                color: ['#00c4c2'],
                tooltip: {
                    trigger: 'axis',
                        axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '8%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    name:flag?'':'%',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: xData
                },
                series:[
                    {
                        name: flag?'销售收入':'占比',
                        type: 'bar',
                        data: yData
                    }
                ]
            };

        }
        //纵向配置
        function verOption1(xData,yData){
            return option = {
                color: ['#00c4c2'],
                tooltip: {
                    trigger: 'axis',
                        axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: {
                    type: 'value',
                    name:'%',
                    boundaryGap: [0, 0.01]
                },
                xAxis: {
                    type: 'category',
                    data: xData
                },
                series:[
                    {
                        name: '占比',
                        type: 'bar',
                        barWidth: '20',
                        data: yData
                    }
                ]
            };
        }
        //获取数据
        $scope.getData = function(tab) {
            var param1 = {cate:$scope.selectedCate.id,year:$scope.selectedYear.id,q:$scope.selectedSeason.id}
            $http({
                url: USERGROUP_ANALYSIS_API,
                method: "GET",
                params:param1
            }).success(function (data) {
                if($scope.selectedCate.id==-1&&data.code==0){
                    layer.open({
                        title: '自定义人群',
                        type: 1,
                        content: $('.uploadLayer'),
                        area: '620px',
                        btn: ['确定', '取消'],
                        yes: function(index, layero){
                            var form = new FormData(document.getElementById("upfile"));
                            $.ajax({
                                url:"/api/file/upload",
                                type:"post",
                                data:form,
                                processData:false,
                                contentType:false,
                                dataType:"json",
                                success:function(data){
                                    layer.close(index);
                                    if(data.success){
                                        $scope.alertSuccess('上传文件成功',true);
                                    }else{
                                        $scope.alertSuccess('上传文件失败',false);
                                    }
                                },
                                error:function(e){
                                    console.log("上传失败");
                                }
                            });
                        },cancel: function(index){
                        }
                    });
                    return;
                }
                $scope.data = data;
                //分配数据
                for(var i=0;i<$scope.tabLength;i++){
                    if($scope.selectedCate.id==0){
                        setManData($scope.tableList[i])
                    }else{
                        setData($scope.tableList[i]);
                    }
                }
            }).error(function (data) {
                console.log("获取数据失败");
            });
        };
        $scope.alertSuccess = function(title,flag){
            $scope.upSuccess = flag;
            $scope.$apply();
            layer.open({
                title: title,
                type: 1,
                content: $('.successLayer'),
                area: '620px',
                btn: ['确定', '取消'],
                yes: function(index, layero){
                    layer.close(index);
                    window.location.reload();
                },cancel: function(index){
                    window.location.reload();
                }
            });
        }
        // 分配数据
        function setData(id){
            // 根据不同图表调用不同配置
            var myChart = echarts.init(document.getElementById(id));
            switch (id) {
                case 'sexDis':
                    horOption($scope.data.sex.types,$scope.data.sex.values);
                    break;
                case 'ageDis':
                    verOption($scope.data.age.types,$scope.data.age.values);
                    break;
                case 'educationDis':
                    horOption($scope.data.edu.types,$scope.data.edu.values);
                    break;
                case 'marryDis':
                    verOption($scope.data.marriage.types,$scope.data.marriage.values);
                    break;
                case 'professionDis':
                    horOption($scope.data.profession.types,$scope.data.profession.values);
                    break;
                case 'rfmDis':
                    verOption($scope.data.rfm.types,$scope.data.rfm.values);
                    break;
                case 'userValDis':
                    horOption($scope.data.customerValue.types,$scope.data.customerValue.values);
                    break;
                case 'actionType':
                    verOption($scope.data.actionType.types,$scope.data.actionType.values);
                    break;
                case 'purchasDis':
                    horOption($scope.data.buy.types,$scope.data.buy.values);
                    break;
                case 'medalDis':
                    verOption($scope.data.beauty.types,$scope.data.beauty.values);
                    break;
                case 'cate1':
                    horOption1($scope.data.cate1.x,$scope.data.cate1.y);
                    break;
                case 'cate2':
                    verOption1($scope.data.cate2.x,$scope.data.cate2.y);
                    break;
                case 'cate3':
                    horOption1($scope.data.cate3.x,$scope.data.cate3.y);
                    break;
                case 'colorDis':
                    verOption1($scope.data.color.x,$scope.data.color.y);
                    break;
                case 'brandDis':
                    horOption1($scope.data.brand.x,$scope.data.brand.y,true);
                    break;
            }
            myChart.setOption(option);
        }
        // 分配数据
        function setManData(id){
            // 根据不同图表调用不同配置
            var myChart = echarts.init(document.getElementById(id));
            switch (id) {
                case 'sexDis':
                    horOption1($scope.data.sex.x,$scope.data.sex.y);
                    break;
                case 'ageDis':
                    verOption1($scope.data.age.x,$scope.data.age.y);
                    break;
                case 'educationDis':
                    horOption1($scope.data.edu.x,$scope.data.edu.y);
                    break;
                case 'marryDis':
                    verOption1($scope.data.marriage.x,$scope.data.marriage.y);
                    break;
                case 'professionDis':
                    horOption1($scope.data.profession.x,$scope.data.profession.y);
                    break;
                case 'rfmDis':
                    verOption1($scope.data.rfm.x,$scope.data.rfm.y);
                    break;
                case 'userValDis':
                    horOption1($scope.data.customerValue.x,$scope.data.customerValue.y);
                    break;
                case 'actionType':
                    verOption1($scope.data.actionType.x,$scope.data.actionType.y);
                    break;
                case 'purchasDis':
                    horOption1($scope.data.buy.x,$scope.data.buy.y);
                    break;
                case 'medalDis':
                    verOption1($scope.data.beauty.x,$scope.data.beauty.y);
                    break;
                case 'cate1':
                    horOption1($scope.data.cate1.x,$scope.data.cate1.y);
                    break;
                case 'cate2':
                    verOption1($scope.data.cate2.x,$scope.data.cate2.y);
                    break;
                case 'cate3':
                    horOption1($scope.data.cate3.x,$scope.data.cate3.y);
                    break;
                case 'colorDis':
                    verOption1($scope.data.color.x,$scope.data.color.y);
                    break;
                case 'brandDis':
                    horOption1($scope.data.brand.x,$scope.data.brand.y,true);
                    break;
            }
            myChart.setOption(option);
        }

}]);