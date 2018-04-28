angular.module('myApp')
  .directive('productShow',['$http',function($http){
  	 return {
	 	restrict: 'E',
        transclude: true,
        templateUrl: 'plugins/directives/productShow/productShow.html?_7812',
        scope: {
        	productShow: '=id'
        },
	    link: function (scope, ele, attrs) {
	        var getData = function(initPagin) {
	        	$http({
					url: scope.productShow.Ajax.url,
					method: 'POST',
					params: scope.productShow.Ajax.params
				}).success(function (data) {
					if(data.count == 0){
						scope.hasResult = false;
					}else{
						scope.hasResult = true;
					}
					$.extend(scope.productShow, data);
	            	if (initPagin) {
	            		initPagination();
	            	}
		        });
	        }
	        var initPagination = function() {
	        	scope.productShow.pages = [1];
	        	scope.productShow.currentPage = 1;
	        	scope.productShow.from = 0;
        		scope.productShow.startLimit = scope.productShow.from;
	        	scope.productShow.to = Math.min(scope.productShow.currentPage * scope.productShow.pageSize.number,scope.productShow.count);
	        	scope.productShow.totalPage = Math.ceil(scope.productShow.count / scope.productShow.pageSize.number);
	        	if(scope.productShow.pageSize.number==''){
	        		scope.productShow.totalPage = 1;
	        	}
	        	if (scope.productShow.totalPage > 4) {
	        		scope.productShow.pages = [1,2,3,'...',scope.productShow.totalPage];
	        	}
	        	else {
	        		for (var i = 0; i < scope.productShow.totalPage; i++){
	        			scope.productShow.pages[i] = i + 1;
	        		}
	        	}
	        }
	        var getRealTimeData = function(initPagin) {
	        	if (scope.productShow.asyn) {
	        		scope.productShow.from = (scope.productShow.currentPage - 1) * scope.productShow.pageSize.number;
		        	scope.productShow.to = Math.min(scope.productShow.currentPage * scope.productShow.pageSize.number,scope.productShow.count);
		        	scope.productShow.startLimit = 0;
	        		scope.productShow.Ajax.params.start = scope.productShow.from;
	        		scope.productShow.Ajax.params.length = scope.productShow.pageSize.number;
	        		getData(initPagin);
	        	}
	        }
	        var sortBy = function(propertyName) {
				scope.productShow.reverse = (scope.productShow.orderBy === propertyName) ? !scope.productShow.reverse : false;
	          	scope.productShow.orderBy = propertyName;
				if (scope.productShow.asyn) {
					scope.productShow.Ajax.params.order_by = propertyName;
					scope.productShow.Ajax.params.order_rule = scope.productShow.reverse? 'desc':'asc';
					getRealTimeData(true);
				}
	        }
	        scope.flip = function(page) {
	        	if (page > 0 && page <= scope.productShow.totalPage) {
	        		scope.productShow.currentPage = page;
		        	scope.productShow.from = (page - 1) * scope.productShow.pageSize.number;
		        	scope.productShow.startLimit = scope.productShow.from;
		        	scope.productShow.to = Math.min(page * scope.productShow.pageSize.number,scope.productShow.count);
		        	if (scope.productShow.totalPage > 4) {
		        		scope.productShow.pages[0] = Math.min(Math.max(page - 1, 1), scope.productShow.totalPage - 3);
		        		scope.productShow.pages[1] = Math.min(Math.max(page, 2), scope.productShow.totalPage - 2);
		        		scope.productShow.pages[2] = Math.min(Math.max(page + 1, 3), scope.productShow.totalPage - 1);
		        		if(scope.productShow.totalPage-page<=2&&scope.productShow.pages[3]=="..."){
		        			scope.productShow.pages.splice(3, 1);
		        		}
		        		if(scope.productShow.totalPage-page>2&&scope.productShow.pages[3]!="..."){
		        			scope.productShow.pages.splice(3, 0,'...');
		        		}
		        	}
		        	getRealTimeData(false);
	        	}
	        }
	        scope.changePageSize = function() {
	        	initPagination();
	        	getRealTimeData(false);
	        }
	        // bootstrap
	        if (scope.productShow.Ajax != undefined) {
        		scope.productShow.from = 0;
	        	scope.productShow.to = scope.productShow.pageSizes[0].number;
				scope.productShow.pageSize = scope.productShow.pageSizes[0];
	        	scope.productShow.filterSelectKey = {};
	        	if(scope.productShow.filterSelect) {
	        		scope.productShow.filterSelect.forEach(function(item){
	        			scope.productShow.filterSelectKey[item.key] = item.options[0].key;
	        		});
	        	}
	        	if (scope.productShow.asyn) {
	        		if (scope.productShow.Ajax.params === undefined) {
	        			scope.productShow.Ajax.params = {};
	        		}
	        		scope.productShow.Ajax.params.start = scope.productShow.from;
	        		scope.productShow.Ajax.params.length = scope.productShow.pageSizes[0].number;
	        		//scope.productShow.Ajax.params.query = scope.productShow.filterSelectKey;
	        	};
	        	scope.productShow.getData = getData;
	        	scope.productShow.initPagination= initPagination;
	        	scope.productShow.sortBy = sortBy;
	        	getData(true);
	        }else {
	        	console.log("Ajax.url is not defined!");
	        }
        }
  	 }

  }]);