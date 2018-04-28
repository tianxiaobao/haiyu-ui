angular.module('myApp')
  .directive('systemShow',['$http','$rootScope',function($http,$rootScope){
  	 return {
	 	restrict: 'E',
        transclude: true,
        templateUrl: 'plugins/directives/sysManage/systemShow.html?_7812',
        scope: {
        	systemShow: '=id'
        },
	    link: function (scope, ele, attrs) {
	        var getData = function(initPagin) {
	        	$http({
					url: scope.systemShow.Ajax.url,
					method: 'GET',
					params: scope.systemShow.Ajax.params
				}).success(function (data) {
					$rootScope.userList = data.data;
					$rootScope.roleList = data.data;
					$.extend(scope.systemShow, data);
	            	if (initPagin) {
	            		initPagination();
	            	}
		        });
	        }
	        var initPagination = function() {
	        	scope.systemShow.pages = [1];
	        	scope.systemShow.currentPage = 1;
	        	scope.systemShow.from = 0;
        		scope.systemShow.startLimit = scope.systemShow.from;
	        	scope.systemShow.to = Math.min(scope.systemShow.currentPage * scope.systemShow.pageSize.number,scope.systemShow.count);
	        	scope.systemShow.totalPage = Math.ceil(scope.systemShow.count / scope.systemShow.pageSize.number);
	        	if(scope.systemShow.pageSize.number==''){
	        		scope.systemShow.totalPage = 1;
	        	}
	        	if (scope.systemShow.totalPage > 4) {
	        		scope.systemShow.pages = [1,2,3,'...',scope.systemShow.totalPage];
	        	}
	        	else {
	        		for (var i = 0; i < scope.systemShow.totalPage; i++){
	        			scope.systemShow.pages[i] = i + 1;
	        		}
	        	}
	        }
	        var getRealTimeData = function(initPagin) {
	        	if (scope.systemShow.asyn) {
	        		scope.systemShow.from = (scope.systemShow.currentPage - 1) * scope.systemShow.pageSize.number;
		        	scope.systemShow.to = Math.min(scope.systemShow.currentPage * scope.systemShow.pageSize.number,scope.systemShow.count);
		        	scope.systemShow.startLimit = 0;
	        		scope.systemShow.Ajax.params.start = scope.systemShow.from;
	        		scope.systemShow.Ajax.params.length = scope.systemShow.pageSize.number;
	        		getData(initPagin);
	        	}
	        }
	        scope.flip = function(page) {
	        	if (page > 0 && page <= scope.systemShow.totalPage) {
	        		scope.systemShow.currentPage = page;
		        	scope.systemShow.from = (page - 1) * scope.systemShow.pageSize.number;
		        	scope.systemShow.startLimit = scope.systemShow.from;
		        	scope.systemShow.to = Math.min(page * scope.systemShow.pageSize.number,scope.systemShow.count);
		        	if (scope.systemShow.totalPage > 4) {
		        		scope.systemShow.pages[0] = Math.min(Math.max(page - 1, 1), scope.systemShow.totalPage - 3);
		        		scope.systemShow.pages[1] = Math.min(Math.max(page, 2), scope.systemShow.totalPage - 2);
		        		scope.systemShow.pages[2] = Math.min(Math.max(page + 1, 3), scope.systemShow.totalPage - 1);
		        	}
		        	getRealTimeData(false);
	        	}
	        }
	        scope.changePageSize = function() {
	        	initPagination();
	        	getRealTimeData(false);
	        }
	        // bootstrap
	        if (scope.systemShow.Ajax != undefined) {
        		scope.systemShow.from = 0;
	        	scope.systemShow.to = scope.systemShow.pageSizes[0].number;
				scope.systemShow.pageSize = scope.systemShow.pageSizes[0];
	        	if (scope.systemShow.asyn) {
	        		if (scope.systemShow.Ajax.params === undefined) {
	        			scope.systemShow.Ajax.params = {};
	        		}
	        		scope.systemShow.Ajax.params.start = scope.systemShow.from;
	        		scope.systemShow.Ajax.params.length = scope.systemShow.pageSizes[0].number;
	        	};
	        	scope.systemShow.getData = getData;
	        	scope.systemShow.initPagination= initPagination;
	        	getData(true);
	        }else {
	        	console.log("Ajax.url is not defined!");
	        }
        }
  	 }

  }]);