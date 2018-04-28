angular.module('myApp')
    .controller('productPictureController',['$scope','$http','$timeout','$stateParams','$rootScope','shareDataService',function($scope,$http,$timeout,$stateParams,$rootScope,shareDataService){
	   	if($stateParams.id!=''){
	   		$scope._id = $stateParams.id;
	   	} else{
	   		$scope._id = 10751312346;
	   	};
	   	$scope.hideImg = true;
	    //传输上一页带过来的数据
	    $scope.topData = {
	   		picTopData:[],
	   		picTopShow:''
	   	};
		$scope.topData.picTopData = shareDataService.shareData;
	   	//初始化数据
	   	getData($scope._id);
		//按比例自适应调整导航图宽度
		$(window).resize(function(){
		    var curWidth = $(".first_content .flash_pic").width();
			$(".first_content .flash_pic .pic_exchange").css('width',curWidth-100 +'px');
		});
		//自适应屏幕宽度
		var curWidth = $(".first_content .flash_pic").width();
		$(".first_content .flash_pic .pic_exchange").css('width',curWidth-100 +'px');
		var topWidth = parseInt($(".first_content .pic_exchange").css("width"));
	   	var index = Math.ceil(topWidth/120);
	   	var ulWidth = (index)*120;
	   	$(".first_content .flash_pic ul").css("width",ulWidth+'px');
	   	//判断是否是从上一页进入
	   	if($scope.topData.picTopData!=undefined){
	   		$scope.topData.picTopShow = $scope.topData.picTopData.slice(0,index);
	   	}else{
	   		//从菜单进入默认9274类别下的顶部图片
	   		$http({
			 	method:'GET',
			 	url:'../api/product/list/top',
			 	params:{cateId:9724}
			}).success(function(data){
				if(data.code!=1){
					alert("获取数据出错！");
					return;
				}
				$scope.topData.picTopData = data.data;
				$scope.topData.picTopShow = $scope.topData.picTopData.slice(0,index);
			}).error(function(data){
				console.log("error");
			});
	   	};
	   	/*
	   	 *顶部轮播
	   	 */
	   	var i = 0;
	   	$scope.toleftProduct = function(){
	   		if(i==0){return;}
	   		i = i - 1;
	   		$scope.topData.picTopShow = $scope.topData.picTopData.slice(i,i+index);
	   	};
	   	$scope.toRightProduct = function(){
	   		if($scope.topData.picTopData.length-i<index){return;}
	   		i = i + 1;
	   		$scope.topData.picTopShow = $scope.topData.picTopData.slice(i,i+index);
	   	};
	   	//点击更换top图片
		$scope.chooseTopPic = function(i){
		   	//刷新数据
		   	getData(i);
		};
	   	/*
	     * 单图轮播
	   	 */
		//左轮播
	   	var temp = 0;
		$scope.toLeftPic = function(){
			if(temp==0){return;}
			temp = temp -1;
			$scope.picShowData = $scope.picData.slice(temp,temp+5);
		};
		//右轮播
		$scope.toRightPic = function(){
			if($scope.picData.length-temp<=5){return;}
			temp = temp +1;
			$scope.picShowData = $scope.picData.slice(temp,temp+5)
		};
		//点击更换大图片
		$scope.changePic = function(i){
			$scope.productShowPic = $scope.picShowData[i].src
		};
	   	//获取商品的信息
		function getData(_params){
			$http({
			method:"GET",
			url:"../api/product/detail",
			params:{
				id:_params
			}
			}).success(function(data){
				if(data.code!=1){return};
				$scope.product_title=data.product_detail.product_title;
				var len = Math.ceil(data.product_detail.property.length/2);
				$scope.propertyLeftData = data.product_detail.property.slice(0,len);
				$scope.propertyRightData = data.product_detail.property.slice(len);
				//轮播图片
		   	    $scope.picData = data.product_detail.picData;
		   	    $scope.picShowData = $scope.picData.slice(0,5);
		   	    $scope.productShowPic = $scope.picShowData[0].src;
		   	    //消除遮罩
		   	    $scope.hideImg = false;
				//年度销量
				data.yearSale.id = 'product_year_sale';
				line_chart(data.yearSale);
				//销售区域占比
				data.saleArea.id = 'sale_area_mix';
				category_revenue_share(data.saleArea);
				//产品月度销量
				// data.monthSale.id = 'product_month_sale';
				// line_chart(data.monthSale);
				//产品年度销量 按区域
				data.areaMonthCount.id = 'product_year_sale_area';
				stylolite_chart(data.areaMonthCount);
				//雷达图
				data.radar.id = 'market_index';
				market_index_chart(data.radar);
			}).error(function(data){
				console.log("获取数据失败！");
			});
		};
		//雷达图
	   	function market_index_chart(o){
	   		var myChart = echarts.init(document.getElementById(o.id));
	   		option = {
	   			color: ['#00c4c2','#066b69'],
			    tooltip: {
			        trigger: 'axis'
			    },
			    legend: {
			        orient: 'vertical',
        			right:'15%',
        			top:'20%',
			        data:o.data_x
			    },
			    radar: [
			        {
			            indicator: o.indicator,
			            center: ['50%','55%'],
			            radius: 150
			        }
			    ],
			    series: [
			        {
			            type: 'radar',
			             tooltip: {
			                trigger: 'item'
			            },
			            itemStyle: {normal: {areaStyle: {type: 'default'}}},
			            data: o.data
			        }
			    ]
			};
			myChart.setOption(option);
	   	};
	   	//折线图
		function line_chart(o){
			o.data_content.forEach(function(item,i){
				o.data_content[i].type = 'line';
				o.data_content[i].stack = '总量';
			});
			var myChart = echarts.init(document.getElementById(o.id));
			option = {
				color: ['#00c4c2'],
			    tooltip: {
			        trigger: 'axis',
			        position: function (point, params, dom, rect, size) {
						return [point[0], point[1]];
					}
			    },
			    grid: {
			        left: '3%',
			        right: '8%',
			        bottom: '3%',
			        top:'30px',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'category',
			        name: '月',
			        boundaryGap: false,
			        data: o.data_month
			    },
			    yAxis: {
			        type: 'value'
			    },
			    series: o.data_content
			};
			myChart.setOption(option);
		};
		//堆叠柱状图
		function stylolite_chart(o){
			var myChart = echarts.init(document.getElementById(o.id));
			option = {
				color: ['#00c4c2','#066b69','#fac54c','#89670c','#15aaff','#00549c','#e18002','#793000','#a8c476','#5c7137','#ffb496','#d65645','#abbbbe','#5c676a','#ac99d8','#6B4786'],
				tooltip: {
			        trigger: 'item',
			        formatter: "{a} <br/>{b}: ({c})",
			    },
			    legend: {
			    	top:'8%',
			    	left:'0',
			        data:o.item
			    },
			    grid: {
			        left: '3%',
			        right: '3%',
			        bottom: '3%',
			        top:'5%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            name:'月',
			            data : o.data_x
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : o.data
			};
			myChart.setOption(option);
		};
		//环图
		function category_revenue_share(o){
	    	var myChart = echarts.init(document.getElementById(o.id));
			option = {
				color: ['#00c4c2','#066b69','#fac54c','#89670c','#15aaff','#00549c','#e18002','#793000','#a8c476','#5c7137','#ffb496','#d65645','#abbbbe','#5c676a','#ac99d8','#6B4786'],
			    tooltip: {
			        trigger: 'item',
			        formatter: "{a} <br/>{b}: ({d}%)"
			    },
			    legend: {
			        orient: 'vertical',
			        x: 'left',
			        data:o.category_data
			    },
			    series: [
			        {
			            name:'销售区域占比',
			            type:'pie',
			            radius: ['40%', '70%'],
			            avoidLabelOverlap: true,
			            label: {
			                normal: {
			                    show: false,
	                            position: 'outerside',
			                    textStyle: {
			                        fontSize: '10',
			                    }
			                }
			            },
			            labelLine: {
			                normal: {
			                    show: false
			                }
			            },
			            data:o.product_data
			        }
			    ]
			}
			myChart.setOption(option);
		};
   }]);