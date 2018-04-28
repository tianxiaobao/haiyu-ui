angular.module('myApp')
    .controller('associativeAnalysisController',['$scope','$http','GETCATES_API','ASSOCIATE_ANALYSIS_API','GETYEARS_API',function($scope,$http,GETCATES_API,ASSOCIATE_ANALYSIS_API,GETYEARS_API){
    	 //获取品类
        $scope.getCates = function(){
            $http({
                url: GETCATES_API,
                method: "GET"
            }).success(function (data) {
                $scope.cateList = data.cate;
                $scope.selectedCate = data.cate[0];
                getData();
            }).error(function (data) {
                console.log("获取数据失败");
            });
        }();
        // 获取年份
        $scope.getYears = function(){
            $http({
                url: GETYEARS_API,
                method: "GET"
            }).success(function (data) {
                $scope.yearList = data.years;
                $scope.selectedYear = data.years[0];
                getData();
            }).error(function (data) {
                console.log("获取数据失败");
            });
        }();
        // 变换品类
        $scope.changeCate = function(index){
        	$scope.selectedCate = $scope.cateList[index];
	        $(".select-box").removeClass("open");
	        getData();
        }
        // 变化年份
        $scope.changeYear = function(index){
        	$scope.selectedYear = $scope.yearList[index];
        	$(".select-box").removeClass("open");
        	getData();
        }
        // 下拉菜单
        $scope.toggleDrop = function(e){
			var _parent=$(e.currentTarget).parent();
			if(_parent.hasClass("open")){
				_parent.removeClass("open");
			}
			else{
				$(".select-box").removeClass("open");
				_parent.addClass("open");
			}
			$(document).one('click',function(){
                $(".select-box").removeClass("open");
            });
			e.stopPropagation();
        }
        //获取数据
        function getData(){
        	if($scope.selectedCate!=undefined&&$scope.selectedYear!=undefined){
				var _params = {};
				_params.cate = $scope.selectedCate.id;
				_params.year = $scope.selectedYear.id;
        	} else{
        		return;
        	}
        	$http({
	            url: ASSOCIATE_ANALYSIS_API,
	            method: "GET",
	            params:_params
	        }).success(function (data) {
	        	if(data.code !=1){
	        		console.log("发生错误！");
	        		return;
	        	}
	            var theData = {};
	            theData.id = 'relationship_analysis';
	            theData.data = data;
	            bubble_chart(theData);
	        }).error(function (data) {
	            console.log("获取数据失败");
	        });
        };
    	//气泡图
    	function bubble_chart(o){
    		var data = o.data;
    		var myChart = echarts.init(document.getElementById(o.id));
		    myChart.hideLoading();
		    var itemStyle = {
		        normal: {
		            opacity: 0.8,
		            shadowBlur: 10,
		            shadowOffsetX: 0,
		            shadowOffsetY: 0,
		            shadowColor: 'rgba(0, 0, 0, 0.5)'
		        }
		    };
		    var sizeFunction = function (x) {
		    	//var y = Math.log(x*1000000)/Math.log(2.2)+0.1;
		        var y = Math.sqrt(Math.sqrt(x*100));
		        return y;
		    };
		    // Schema:
		    var schema = [
		        {name: 'Income', index: 0, text: '访问量', unit: ''},
		        {name: 'LifeExpectancy', index: 1, text: '销售额', unit: ''},
		        {name: 'Population', index: 2, text: '用户数', unit: '人'},
		        {name: 'Country', index: 3, text: '省份', unit: ''}
		    ];
		    option = {
		        baseOption: {
		        	color: ['#00c4c2','#066b69','#fac54c','#89670c','#15aaff','#00549c','#e18002','#793000','#a8c476','#5c7137','#ffb496','#d65645','#abbbbe','#5c676a','#ac99d8','#6B4786'],
		            timeline: {
		                axisType: 'category',
		                orient: 'vertical',
		                autoPlay: true,
		                inverse: true,
		                playInterval: 2000,
		                left: null,
		                right: 0,
		                top: 20,
		                bottom: 20,
		                width: 80,
		                height: null,
		                label: {
		                    normal: {
		                        textStyle: {
		                            color: '#999'
		                        }
		                    },
		                    emphasis: {
		                        textStyle: {
		                            color: '#fff'
		                        }
		                    }
		                },
		                symbol: 'none',
		                lineStyle: {
		                    color: '#555'
		                },
		                checkpointStyle: {
		                    color: '#bbb',
		                    borderColor: '#777',
		                    borderWidth: 2
		                },
		                controlStyle: {
		                    showNextBtn: false,
		                    showPrevBtn: false,
		                    normal: {
		                        color: '#666',
		                        borderColor: '#666'
		                    },
		                    emphasis: {
		                        color: '#aaa',
		                        borderColor: '#aaa'
		                    }
		                },
		                data: []
		            },
		            title: [{
		                'text': data.timeline[0],
		                textAlign: 'center',
		                left: '85%',
		                top: '2%',
		                textStyle: {
		                    fontSize: 20,
		                }
		            }],
		            tooltip: {
		                padding: 5,
		                backgroundColor: '#222',
		                borderColor: '#777',
		                borderWidth: 1,
		                formatter: function (obj) {
		                    var value = obj.value;
		                    return schema[3].text + '：' + value[3] + '<br>'
		                            + schema[1].text + '：' + value[1] + schema[1].unit + '<br>'
		                            + schema[0].text + '：' + value[0] + schema[0].unit + '<br>'
		                            + schema[2].text + '：' + value[2] + '<br>';
		                }
		            },
		            grid: {
		                left: '12%',
		                right: '110'
		            },
		            xAxis: {
		                type: 'log',
		                name: '访问量',
		                nameGap: 25,
		                nameLocation: 'middle',
		                nameTextStyle: {
		                    fontSize: 14
		                },
		                splitLine: {
		                    show: false
		                },
		                axisLabel: {
		                    formatter: '{value} 次'
		                }
		            },
		            yAxis: {
		                type: 'value',
		                name: '销售额',
		                nameTextStyle: {
		                    fontSize: 14
		                },
		                splitLine: {
		                    show: false
		                },
		                axisLabel: {
		                    formatter: '{value} '
		                }
		            },
		            visualMap: [
		                {
		                    show: false,
		                    dimension: 3,
		                    categories: data.counties,
		                    calculable: true,
		                    precision: 0.1,
		                    textGap: 30,
		                    inRange: {
		                        color: (function () {
		                            var colors = ['#bcd3bb', '#e88f70', '#edc1a5', '#9dc5c8', '#e1e8c8', '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a'];
		                            return colors.concat(colors);
		                        })()
		                    }
		                }
		            ],
		            series: [
		                {
		                    type: 'scatter',
		                    itemStyle: itemStyle,
		                    data: data.series[0],
		                    symbolSize: function(val) {
		                        return sizeFunction(val[2]);
		                    }
		                }
		            ],
		            animationDurationUpdate: 1000,
		            animationEasingUpdate: 'quinticInOut'
		        },
		        options: []
		    };
		    for (var n = 0; n < data.timeline.length; n++) {
		        option.baseOption.timeline.data.push(data.timeline[n]);
		        option.options.push({
		            title: {
		                show: true,
		                'text': data.timeline[n] + ''
		            },
		            series: {
		                name: data.timeline[n],
		                type: 'scatter',
		                itemStyle: itemStyle,
		                data: data.series[n],
		                symbolSize: function(val) {
		                    return sizeFunction(val[2]);
		                }
		            }
		        });
		    }
		    myChart.setOption(option);
        };
    }]);