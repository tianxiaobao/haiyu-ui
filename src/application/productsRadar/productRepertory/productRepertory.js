angular.module('myApp')
    .controller('productRepertoryController',['$scope','$timeout','$state','$stateParams','$http','$cookieStore','$cookies','$rootScope','shareDataService',function($scope,$timeout,$state,$stateParams,$http,$cookieStore,$cookies,$rootScope,shareDataService){
		//初始隐藏历史记录
		$scope.displayHistory = {"display":"none"};
		//产品展示配置
   	    $scope.PSrepertory =  {
			'pageSizes': [{
				'name': 30,
				'number': 30
			}],
			'Ajax': {
				'url': '../api/product/list/query',
				'params':{}
			},
			'getData':function(initPagin){},
			'asyn': true,
			'ischoosed_sale':true,
			'ischoosed_mark':false,
			'ischoosed_price':false
		};
		//获得焦点显示历史记录
		$scope.obj = {
			historyInfoData:[]
		};
		$scope.historyShow = function(){
		    //获取cookie
            var getCookie = $cookieStore.get("historyData");
            if(!getCookie){
            	$scope.obj.historyInfoData = [];
            }else{
            	var cookieArr = JSON.parse(getCookie);
            	$scope.obj.historyInfoData = cookieArr.reverse();
            }
			$('.search .search_info .search_history').css("display","block");
		};
		//筛选操作
		$scope.searchInfo = function(){
			$scope.Info = $scope.inputInfo;
		};
		$scope.search = function(){
			//点击某一条信息请求
			// if(!$scope.inputInfo) return;
			$scope.PSrepertory.Ajax.params.searchInfo = $scope.inputInfo;
		    $scope.PSrepertory.getData(true);
		    var changeLi = setInterval(exchangeLi, 100);
           //设置cookie
            var getCookie = $cookieStore.get("historyData");
            if(!getCookie){
            	var cookieArr = new Array();
            } else{
            	var cookieArr = JSON.parse(getCookie);
            	cookieArr.forEach(function(item,i){
            		if(item.value == $scope.inputInfo){
            			cookieArr.splice(i,1);
            		}
            	});
            }
		    var cookieObj = new Object();
		    if($scope.inputInfo!=""){
		    	cookieObj.value = $scope.inputInfo;
		    	cookieArr.push(cookieObj);
		    }
		    $cookieStore.put("historyData",JSON.stringify(cookieArr));
		  //  $scope.inputInfo = '';
		};
		//点击历史记录查找
		$scope.searchHistoryinfo = function(info){
			if(info){
				//点击某一条信息请求
				$scope.PSrepertory.Ajax.params.searchInfo = info.value;
				$scope.inputInfo = info.value;
			    $scope.PSrepertory.getData(true);
			    var changeLi = setInterval(exchangeLi, 100);
			}
			$('.search .search_info .search_history').css("display","none");
		};
		//销量排序
		$scope.PSrepertory.saleSort = function() {
			if($scope.PSrepertory.Ajax.params.saleSort == 1) return;
			$scope.PSrepertory.ischoosed_sale = true;
			$scope.PSrepertory.ischoosed_mark = false;
			$scope.PSrepertory.ischoosed_price = false;
			$scope.PSrepertory.Ajax.params.priceSort = 0;
			$scope.PSrepertory.Ajax.params.saleSort = 1;
			$scope.PSrepertory.Ajax.params.markSort = 0;
			$scope.PSrepertory.getData(true);
			var changeLi = setInterval(exchangeLi, 100);
        }
        //评论排序
	    $scope.PSrepertory.markSort = function() {
	    	if($scope.PSrepertory.Ajax.params.markSort==1) return;
			$scope.PSrepertory.ischoosed_sale = false;
			$scope.PSrepertory.ischoosed_mark = true;
			$scope.PSrepertory.ischoosed_price = false;
			$scope.PSrepertory.Ajax.params.priceSort = 0;
			$scope.PSrepertory.Ajax.params.saleSort = 0;
			$scope.PSrepertory.Ajax.params.markSort = 1;
			$scope.PSrepertory.getData(true);
			var changeLi = setInterval(exchangeLi, 100);
        }
        //价格排序
        //降序排列传1  升序排列2
        var temp = true;
	    $scope.PSrepertory.priceSort = function() {
	    	$scope.PSrepertory.ischoosed_sale = false;
			$scope.PSrepertory.ischoosed_mark = false;
			$scope.PSrepertory.ischoosed_price = true;
	    	//第一次点击降序排列 
	    	if(temp){
	    		if($scope.PSrepertory.Ajax.params.priceSort==1) return;
	    		$scope.PSrepertory.Ajax.params.priceSort = 1;
				$scope.PSrepertory.Ajax.params.saleSort = 0;
				$scope.PSrepertory.Ajax.params.markSort = 0;
				temp = false;
	    	} else{
	    		if($scope.PSrepertory.Ajax.params.priceSort == 2) return;
	    		$scope.PSrepertory.Ajax.params.priceSort = 2;
				$scope.PSrepertory.Ajax.params.saleSort = 0;
				$scope.PSrepertory.Ajax.params.markSort = 0;
				temp = true;
	    	}
			$scope.PSrepertory.getData(true);
			var changeLi = setInterval(exchangeLi, 100);
        };
        $scope.PSrepertory.pageflip = function(){
        	var changeLi = setInterval(exchangeLi, 100);
        };
		//跳转详情
		$scope.toDetail = function(Id){
		   shareDataService.shareData = $scope.PSrepertory.data;
		   $state.go('productPicture',{id:Id});
		};
		//按比例自适应调整图片大小
		$(window).resize(function() {
		    var curWidth = $(".the_ul li").width();
			// $(".the_ul li").css('height',30+curWidth*282/220);
			// $(".the_ul li .img_show").css('height',curWidth*282/220-6);
			$(".the_ul li").css('height',39+curWidth*1);
			$(".the_ul li .img_show").css('height',curWidth*1-6);
		});
		var exchangeLi = function(){
			var curWidth = $(".the_ul li").width();
			if(curWidth){
				// $(".the_ul li").css('height',30+curWidth*282/220);
				// $(".the_ul li .img_show").css('height',curWidth*282/220-6);
				$(".the_ul li").css('height',39+curWidth*1);
				$(".the_ul li .img_show").css('height',curWidth*1-6);
				clearInterval(changeLi);
			}
		};
		var changeLi = setInterval(exchangeLi, 100);
		//点击document收起历史记录信息
		$(document).mouseup(function(e){
			var _con = $('.search .search_info');   // 设置目标区域
				if(!_con.is(e.target) && _con.has(e.target).length === 0){
				$('.search .search_info .search_history').css("display","none");
			}
		});
		if($stateParams.key!=''){
	   		$scope.inputInfo = $stateParams.key;
	   		$scope.search();
	   	}
   }]);