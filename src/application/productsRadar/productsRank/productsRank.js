angular.module('myApp')
    .controller('productsRankController',['$scope','$http','$timeout','$state','$rootScope','shareDataService',function($scope,$http,$timeout,$state,$rootScope,shareDataService){
		//所有产品标识
		$scope.flagImgData = [
		        {id:0,cateId:9724,type:"棉服"},
		        {id:1,cateId:9730,type:"夹克"},
		        {id:2,cateId:3982,type:"羽绒服"},
		        {id:3,cateId:9737,type:"西裤"},
		        {id:4,cateId:1349,type:"T恤"},
		        {id:5,cateId:9731,type:"西服"},
		        {id:6,cateId:9728,type:"风衣"},
		        {id:7,cateId:9736,type:"休闲裤"},
		        {id:8,cateId:9735,type:"牛仔裤"},
		        {id:9,cateId:1348,type:"衬衫"},
		        {id:10,cateId:9733,type:"POLO衫"}
		];
		//初始化加载第一个类型
		getProductsData({cateId:$scope.flagImgData[0].cateId});

		$scope.activeId = 0;
		//点击某一类产品
		$scope.chooseProduct = function(id,cateId){
			var changeLi = setInterval(exchangeLi, 100);
			$scope.activeId = id;
			var params={};
			params.cateId = cateId;
			getProductsData(params);
		};
		//跳转详情
		$scope.toDetail = function(Id){
			shareDataService.shareData = $scope.productsRank_data;
		    $state.go('productPicture',{id:Id});
		};
		//刷新本页产品数据
		function getProductsData(_params){
			$http({
			 	method:'GET',
			 	url:'../api/product/list/top',
			 	params:_params
			}).success(function(data){
				if(data.code!=1){
					alert("获取数据出错！");
					return;
				}
				$scope.productsRank_data = data.data;
			}).error(function(data){
				console.log("error");
			});
		};
		//按比例自适应调整图片大小
		$(window).resize(function() {
		    var curWidth = $(".the_ul li").width();
		    // 282/220
			$(".the_ul li").css('height',39+curWidth*1);
			$(".the_ul li .img_show").css('height',curWidth*1-6);
		});
		//按比例改变Li的大小
		var exchangeLi = function(){
			var curWidth = $(".the_ul li").width();
			if(curWidth){
				$(".the_ul li").css('height',39+curWidth*1);
				$(".the_ul li .img_show").css('height',curWidth*1-6);
				clearInterval(changeLi);
			}
		};
		var changeLi = setInterval(exchangeLi, 100);
   }]);