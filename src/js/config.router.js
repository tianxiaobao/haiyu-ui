myApp.config(['$stateProvider', '$urlRouterProvider', '$provide', '$compileProvider',function ($stateProvider, $urlRouterProvider, $provide, $compileProvider) {
	// 为了解决angular动态修改a标签的href为'JavaScript: ;'时,a标签的href实际为'unsafe:javascript: ;'
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
	$urlRouterProvider.otherwise("/index");
	// 获取年份
	$provide.value('GETYEARS_API', '../api/Common/getYears');
	// 获取品类
	$provide.value('GETCATES_API', '../api/Common/getCates');
	// 区域分析接口
	$provide.value('AREASALE_API', '../api/area/areaSale');
	$provide.value('AREA_TOP_PROVINCE_API', '../api/area/topProvince');
	$provide.value('AREA_BRAND_PROP_API', '../api/area/brand');
	$provide.value('AREA_CROWD_PROP_API', '../api/area/group');
	$provide.value('AREA_SIZE_PROP_API', '../api/area/size');
	$provide.value('AREA_PRICE_PROP_API', '../api/area/price');
	$provide.value('AREA_MATERIAL_PROP_API', '../api/area/material');
	$provide.value('AREA_COLOR_PROP_API', '../api/area/color');
	$provide.value('AREA_STYLE_PROP_API', '../api/area/style');
	$provide.value('AREA_TYPE_PROP_API', '../api/area/pattern');
	// 总体分析接口
	$provide.value('SALES_MONTH_API', '../api/SalesAnalysis/saleNum');
	$provide.value('INCOME_MONTH_API', '../api/SalesAnalysis/saleIncome');
	$provide.value('BRAND_PROP_API', '../api/SalesAnalysis/brand');
	$provide.value('CROWD_PROP_API', '../api/SalesAnalysis/group');
	$provide.value('SIZE_PROP_API', '../api/SalesAnalysis/size');
	$provide.value('PRICE_PROP_API', '../api/SalesAnalysis/price');
	$provide.value('MATERIAL_PROP_API', '../api/SalesAnalysis/material');
	$provide.value('COLOR_PROP_API', '../api/SalesAnalysis/color');
	$provide.value('STYLE_PROP_API', '../api/SalesAnalysis/style');
	$provide.value('TYPE_PROP_API', '../api/SalesAnalysis/pattern');
	// 访问量分析接口
	$provide.value('MONTHUV_API', '../api/view/monthUV');
	$provide.value('MONTHPV_API', '../api/view/monthPV');
	$provide.value('VIEW_AREA_API', '../api/view/area');
	$provide.value('VIEW_KEYWORD_API', '../api/view/keyword');
	$provide.value('VIEW_BRAND_API', '../api/view/brand');
	$provide.value('VIEW_GROUP_API', '../api/view/group');
	$provide.value('VIEW_SIZE_API', '../api/view/size');
	$provide.value('VIEW_PRICE_API', '../api/view/price');
	$provide.value('VIEW_MATERIAL_API', '../api/view/material');
	$provide.value('VIEW_COLOR_API', '../api/view/color');
	$provide.value('VIEW_STYLE_API', '../api/view/style');
	$provide.value('VIEW_PATTERN_API', '../api/view/pattern');
	//关联分析
	$provide.value('ASSOCIATE_ANALYSIS_API', '../api/associate/analysis');
	// 目标用户群分析
	$provide.value('USERGROUP_ANALYSIS_API','../api/userGroup/analysis');
	// 系统管理
	$provide.value('USERLIST_API','../perm/user/userList');
	$provide.value('ADDUSER_API','../perm/user/addUser');
	$provide.value('DELUSER_API','../perm/user/delUser');
	// 角色管理
	$provide.value('ROLELIST_API','../perm/role/list');
	$provide.value('ADDROLE_API','../perm/role/addRole');
	$provide.value('DELROLE_API','../perm/role/delRole');
	// 权限管理
	$provide.value('PERMISSIONLIST_API','../perm/permission/list');
	$provide.value('ADDPERMISSION_API','../perm/permission/addPerm');
	$provide.value('DELPERMISSION_API','../perm/permission/delPerm');
	// 获取角色权限列表
	$provide.value('GETPID_API','../perm/permission/getNode');
	$provide.value('GETROLE_API','../perm/user/retRole');
	$provide.value('GETPERMNODE_API','../perm/role/getPermNode');
	// 首页接口
	$provide.value('INDEX_SALE_API','../api/index/sale');
	$provide.value('INDEX_VIEW_API','../api/index/view');
	$provide.value('INDEX_AREA_API','../api/index/area');
	$provide.value('INDEX_HOTBRAND_API','../api/index/hotBrand');
	$provide.value('INDEX_HOTGOODS_API','../api/index/hotGoods');

	// 菜单列表
	$provide.value('GETMENU_API','../perm/permission/getMenu');
	// 登录用户信息
	$provide.value('USER_CURRENT_API','../perm/user/current');

	$stateProvider
		.state("index", {
			url: "/index",
			templateUrl: "application/main/main.html",
			controller: "mainController",
			controllerAs: "mainCtrl",
			resolve: {
				deps: ['$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							'application/main/main.css',
							'application/main/main.js?_14',
							'application/operationAnalysis/areaAnalysis/china.js'
						]);
					}
				]
			}
		})
		.state('areaAnalysis', {
			url: "/operation/areaAnalysis",
			templateUrl: "application/operationAnalysis/areaAnalysis/areaAnalysis.html",
			controller: "areaAnalysisController",
			controllerAs: "areaAnalysisCtrl",
			resolve: {
				deps: ['$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							'application/operationAnalysis/areaAnalysis/areaAnalysis.css',
							'application/operationAnalysis/areaAnalysis/areaAnalysis.js?_14',
							'application/operationAnalysis/areaAnalysis/china.js',
							'plugins/directives/smartFilter/smartFilter.js'
						]);
					}
				]
			}
		})
		.state('totalAnalysis', {
			url: "/operation/totalAnalysis",
			templateUrl: "application/operationAnalysis/totalAnalysis/totalAnalysis.html",
			controller: "totalAnalysisController",
			controllerAs: "totalAnalysisCtrl",
			resolve: {
				deps: ['$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							'application/operationAnalysis/totalAnalysis/totalAnalysis.css',
							'application/operationAnalysis/totalAnalysis/totalAnalysis.js',
							'plugins/directives/smartFilter/smartFilter.js'
						]);
					}
				]
			}
		})
		.state('pageView', {
			url: "/demandInsight/pageView",
			templateUrl: "application/demandInsight/pageView/pageView.html",
			controller: "pageViewController",
			controllerAs: "pageViewCtrl",
			resolve: {
				deps: ['$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							'application/demandInsight/pageView/pageView.js',
							'application/demandInsight/pageView/pageView.css',
							'application/operationAnalysis/areaAnalysis/china.js',
							'plugins/directives/smartFilter/smartFilter.js'
						]);
					}
				]
			}
		})
		.state('userGroupAnalysis', {
			url: "/demandInsight/userGroupAnalysis",
			templateUrl: "application/demandInsight/userGroupAnalysis/userGroupAnalysis.html",
			controller: "userGroupAnalysisController",
			controllerAs: "userGroupAnalysisCtrl",
			resolve: {
				deps: ['$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							'application/demandInsight/userGroupAnalysis/userGroupAnalysis.js',
							'application/demandInsight/userGroupAnalysis/userGroupAnalysis.css',
							'plugins/directives/smartFilter/smartFilter.js'
						]);
					}
				]
			}
		})
		.state('associativeAnalysis', {
			url: "/operation/associativeAnalysis",
			templateUrl: "application/operationAnalysis/associativeAnalysis/associativeAnalysis.html?t=" + Math.floor(Date.now() / 1000),
			controller: "associativeAnalysisController",
			controllerAs: "associativeAnalysisCtrl",
			resolve: {
				deps: ['$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							'application/operationAnalysis/associativeAnalysis/associativeAnalysis.js?_8942',
							'application/operationAnalysis/associativeAnalysis/associativeAnalysis.css?_8952'
						]);
					}
				]
			}
		})
		.state('productRepertory', {
			url: "/products/productRepertory/:key",
			templateUrl: "application/productsRadar/productRepertory/productRepertory.html?t=" + Math.floor(Date.now() / 1000),
			controller: "productRepertoryController",
			controllerAs: "productRepertoryCtrl",
			resolve: {
				deps: ['$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load('plugins/directives/productShow/productShow.js').then(
							function(){
								return $ocLazyLoad.load([
								'application/productsRadar/productRepertory/productRepertory.css?_8352',
								'application/productsRadar/productRepertory/productRepertory.js?_8422',
								'application/productsRadar/shareData.js?_8442'
								]);
							}
						);
					}
				]
			}
		})
		.state('productPicture', {
			url: "/products/productPicture/:id",
			templateUrl: "application/productsRadar/productPicture/productPicture.html?t=" + Math.floor(Date.now() / 1000),
			controller: "productPictureController",
			controllerAs: "productPictureCtrl",
			resolve: {
				deps: ['$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							'application/productsRadar/productPicture/productPicture.css?_8332',
							'application/productsRadar/productPicture/productPicture.js?_8442',
							'plugins/directives/productShow/productShow.js',
							'application/productsRadar/shareData.js?_8442'
						]);
					}
				]
			}
		})
		.state('productsRank', {
			url: "/products/productsRank",
			templateUrl: "application/productsRadar/productsRank/productsRank.html?t=" + Math.floor(Date.now() / 1000),
			controller: "productsRankController",
			controllerAs: "productsRankCtrl",
			resolve: {
				deps: ['$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							'application/productsRadar/productsRank/productsRank.css?_8332',
							'application/productsRadar/productsRank/productsRank.js?_8442',
							'application/productsRadar/shareData.js?_8442'
						]);
					}
				]
			}
		})
		.state('userManage', {
			url: "/systemManage/userManage",
			templateUrl: "application/systemManage/userManage/userManage.html",
			controller: "userManageController",
			controllerAs: "userManageCtrl",
			resolve: {
				deps: ['$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load('plugins/directives/sysManage/systemShow.js').then(
							function(){
								return $ocLazyLoad.load([
									'application/systemManage/userManage/userManage.js?_14',
									'application/systemManage/userManage/userManage.css?_14'
								]);
							}
						);
					}
				]
			}
		})
		.state('roleManage', {
			url: "/systemManage/roleManage",
			templateUrl: "application/systemManage/roleManage/roleManage.html",
			controller: "roleManageController",
			controllerAs: "roleManageCtrl",
			resolve: {
				deps: ['$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load('plugins/directives/sysManage/systemShow.js').then(
							function(){
								return $ocLazyLoad.load([
									'application/systemManage/roleManage/roleManage.js?_14',
									'application/systemManage/roleManage/roleManage.css?_14'
								]);
						});
					}
				]
			}
		})
		.state('permissionManage', {
			url: "/systemManage/permissionManage",
			templateUrl: "application/systemManage/permissionManage/permissionManage.html",
			controller: "permissionManageController",
			controllerAs: "permissionManageCtrl",
			resolve: {
				deps: ['$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							'application/systemManage/permissionManage/permissionManage.js?_14',
							'application/systemManage/permissionManage/permissionManage.css?_14'
						]);
					}
				]
			}
		});
}]);