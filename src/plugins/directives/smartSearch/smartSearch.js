angular.module('myApp')
	.directive('smartSearch', ['$http','$rootScope',function ($http,$rootScope) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: 'plugins/directives/smartSearch/smartSearch.html?_18',
	        scope: {
	        	smartSearch: '=id'
	        },
	        link: function (scope, ele, attrs) {
	        	if (scope.smartSearch.Ajax != undefined) {
	        		scope.smartSearch.from = 0;
		        	scope.smartSearch.to = scope.smartSearch.pageSizes[0].number;
					scope.smartSearch.pageSize = scope.smartSearch.pageSizes[0];
					scope.smartSearch.searchKey = '';
		        	if (scope.smartSearch.asyn) {
		        		if (scope.smartSearch.Ajax.params === undefined) {
		        			scope.smartSearch.Ajax.params = {};
		        		}
		        		scope.smartSearch.Ajax.params.search_key = scope.smartSearch.searchKey;
		        		scope.smartSearch.Ajax.params.start = scope.smartSearch.from;
		        		scope.smartSearch.Ajax.params.length = scope.smartSearch.pageSizes[0].number;
		        	};
		        	scope.smartSearch.getData = getData;
		        	scope.smartSearch.initPagination= initPagination;
		        	getData(true);
		        }
		        else {
		        	console.log("Ajax.url is not defined!");
		        }
		        function getData(initPagin) {
		        	$http({
						url: scope.smartSearch.Ajax.url,
						method: 'POST',
						params: scope.smartSearch.Ajax.params
					}).success(function (data) {
						var str = [{
							name:'夹克男装用户群',
							des:'所有夹克男装的京东用户',
							scale:'2,000',
							time:'2016-08-02'
						},{
							name:'公务休闲男装用户群',
							des:'所有购买夹休闲男装的京东用户',
							scale:'2,000',
							time:'2016-11-02'
						}];
						scope.smartSearch.value = {};
						scope.smartSearch.count = 20;
						$.extend(scope.smartSearch.value, str);
		            	if (initPagin) {
		            		initPagination();
		            	}
			        });
		        }
		        function initPagination() {
		        	scope.smartSearch.pages = [1];
		        	scope.smartSearch.currentPage = 1;
		        	scope.smartSearch.from = 0;
	        		scope.smartSearch.startLimit = scope.smartSearch.from;
		        	scope.smartSearch.to = Math.min(scope.smartSearch.currentPage * scope.smartSearch.pageSize.number,scope.smartSearch.count);
		        	scope.smartSearch.totalPage = Math.ceil(scope.smartSearch.count / scope.smartSearch.pageSize.number);
		        	if (scope.smartSearch.totalPage > 4) {
		        		scope.smartSearch.pages = [1,2,3,'...',scope.smartSearch.totalPage];
		        	}
		        	else {
		        		for (var i = 0; i < scope.smartSearch.totalPage; i++){
		        			scope.smartSearch.pages[i] = i + 1;
		        		}
		        	}
		        }
		        function getRealTimeData(initPagin) {
		        	if (scope.smartSearch.asyn) {
		        		scope.smartSearch.from = (scope.smartSearch.currentPage - 1) * scope.smartSearch.pageSize.number;
			        	scope.smartSearch.to = Math.min(scope.smartSearch.currentPage * scope.smartSearch.pageSize.number,scope.smartSearch.count);
			        	scope.smartSearch.startLimit = 0;
			        	scope.smartSearch.Ajax.params.search_key = scope.smartSearch.searchKey;
		        		scope.smartSearch.Ajax.params.start = scope.smartSearch.from;
		        		scope.smartSearch.Ajax.params.length = scope.smartSearch.pageSize.number;
		        		getData(initPagin);
		        	}
		        }
		        scope.flip = function(page) {
		        	if (page > 0 && page <= scope.smartSearch.totalPage) {
		        		scope.smartSearch.currentPage = page;
			        	scope.smartSearch.from = (page - 1) * scope.smartSearch.pageSize.number;
			        	scope.smartSearch.startLimit = scope.smartSearch.from;
			        	scope.smartSearch.to = Math.min(page * scope.smartSearch.pageSize.number,scope.smartSearch.count);
			        	if (scope.smartSearch.totalPage > 4) {
			        		scope.smartSearch.pages[0] = Math.min(Math.max(page - 1, 1), scope.smartSearch.totalPage - 3);
			        		scope.smartSearch.pages[1] = Math.min(Math.max(page, 2), scope.smartSearch.totalPage - 2);
			        		scope.smartSearch.pages[2] = Math.min(Math.max(page + 1, 3), scope.smartSearch.totalPage - 1);
			        	}
			        	getRealTimeData(false);
		        	}
		        }
		        scope.changePageSize = function() {
		        	initPagination();
		        	getRealTimeData(false);
		        }
		        scope.changeSearch = function() {
		        	getRealTimeData(true);
				}

	        }
	    }
	}]);
