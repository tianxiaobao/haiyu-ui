angular.module('myApp').controller('menuController',['$http', '$cookies','$state','$scope','$rootScope','$timeout','GETMENU_API','USER_CURRENT_API',
	function($http, $cookies,$state, $scope, $rootScope,$timeout,GETMENU_API,USER_CURRENT_API){
		if(sessionStorage.getItem("currentId")==null){
			sessionStorage.setItem("currentId", "0");
			sessionStorage.setItem("currentOutId", "0");
		}else{
			$scope.currentId = sessionStorage.getItem("currentId");
			$scope.currentOutId = sessionStorage.getItem("currentOutId");
		}
		$scope.toggle = function($event){
			$($event.currentTarget).parent().find("ul").toggle(300);
			$($event.currentTarget).find('span').toggleClass('arrow-down');
		}
		$scope.activeThis = function(id,outId){
			sessionStorage.setItem("currentId", id);
			sessionStorage.setItem("currentOutId", outId);
			$scope.currentId = id;
			$scope.currentOutId = outId;
			$('html, body').animate({scrollTop:0}, 'slow');
		}
		// 当前用户信息
		$http({
		    url: USER_CURRENT_API,
		    method: "GET"
		}).success(function (data) {
			if(data.username == undefined){
				window.location.href='/account/logout';
			}
		    $rootScope.currentUserName = data.username;
		}).error(function (data) {
		    console.log("获取用户失败");
		});
		// 获取菜单
		$http({
		    url: GETMENU_API,
		    method: "GET"
		}).success(function (data) {
		    $scope.menuList = data.data;
		}).error(function (data) {
		    console.log("获取菜单失败");
		});
	}
]);