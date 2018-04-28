angular.module('myApp').directive('smartFilter', ['$http','$rootScope','GETYEARS_API','GETCATES_API',function ($http,$rootScope,GETYEARS_API,GETCATES_API) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'plugins/directives/smartFilter/smartFilter.html?_18',
        scope: false,
        link: function (scope, ele, attrs) {
        	scope.tabNum = 0;
	        scope.seasonList = [
	            {id:'1',value:"Q1"},
	            {id:'2',value:"Q2"},
	            {id:'3',value:"Q3"},
	            {id:'4',value:"Q4"}
        	];
        	scope.selectedSeason = scope.seasonList[0];
        	// 获取年份
	        scope.getYears = function(){
	            $http({
	                url: GETYEARS_API,
	                method: "GET"
	            }).success(function (data) {
	                scope.yearList = data.years;
	                scope.selectedYear = data.years[0];
	                scope.getData(scope.tableList[0]);
	            }).error(function (data) {
	                console.log("获取数据失败");
	            });
	        };
	        //获取品类
	        scope.getCates = function(){
	            $http({
	                url: GETCATES_API,
	                method: "GET"
	            }).success(function (data) {
	                scope.cateList = data.cate;
	                if(scope.isUserAnaly){
	                	scope.cateList.unshift({name:'休闲男装总体',id:'0'});
	                	scope.cateList.push({name:'用户自定义',id:'-1'})
	                }
	                scope.selectedCate = data.cate[0];
	                scope.getYears();
	            }).error(function (data) {
	                console.log("获取数据失败");
	            });
	        }();
	        // 变换品类
	        scope.changeCate = function(index){
	        	scope.selectedCate = scope.cateList[index];
	        	scope.init();
	        }
	        // 变化年份
	        scope.changeYear = function(index){
	        	scope.selectedYear = scope.yearList[index];
	        	if(scope.selectedYear.id==2016){
	        		scope.seasonList = [
						{id:'4',value:"Q4"}
					];
	        	}else{
	        		scope.seasonList = [
						{id:'1',value:"Q1"},
						{id:'2',value:"Q2"},
						{id:'3',value:"Q3"},
						{id:'4',value:"Q4"}
					];
	        	}
	        	scope.selectedSeason = scope.seasonList[0];
	        	scope.init();
	        }
	        // 变换季度
	        scope.changeSeason = function(index){
	            scope.selectedSeason = scope.seasonList[index];
	          	scope.init();
	        }
	        // 下拉菜单
	        scope.toggleDrop = function(e){
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
	        //每次变化筛选都要初始化
	        scope.init = function(){
	        	scope.tabNum = 0;
	            scope.province_id = 0;
	            $(".select-box").removeClass("open");
	            scope.getData(scope.tableList[0]);
	        }
        }
    }
}]);