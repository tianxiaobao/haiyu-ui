angular.module('myApp').controller('permissionManageController', ['$http', '$stateParams', '$state', '$rootScope', '$scope','PERMISSIONLIST_API','ADDPERMISSION_API','DELPERMISSION_API','GETPID_API',
	function ($http, $stateParams, $state, $rootScope, $scope, PERMISSIONLIST_API,ADDPERMISSION_API,DELPERMISSION_API,GETPID_API) {
        $scope.match = {
            title:false,
            url:false,
            permCode:false,
            description:false
        }
        $scope.editButton = false;
        $scope.isValid = true;
        // 添加权限
        $scope.submit = function(isValid){
            if (!isValid) {
                return;
            }
            $scope.perm.pid = $scope.selectPid.id;
            $http({
                url: ADDPERMISSION_API,
                method: "POST",
                data:$scope.perm
            }).success(function (data) {
                $scope.showLayer = false;
                $scope.editButton = false;
                $scope.permList = data.data;
            }).error(function (data) {
                console.log("添加失败");
            });
        }
        // 获取权限
        $scope.permList = function(){
            $http({
                url: PERMISSIONLIST_API,
                method: "GET"
            }).success(function (data) {
                $scope.permList = data.data;
            }).error(function (data) {
                console.log("获取失败");
            });
        }();
        // 获取PID
        $scope.getPid = function(){
            $http({
                url: GETPID_API,
                method: "GET"
            }).success(function (data) {
                $scope.pidList = data;
                $scope.selectPid = $scope.pidList[0];
            }).error(function (data) {
                console.log("获取失败");
            });
        }();
        // 删除权限
        $scope.delPerm = function(id){
            layer.open({
                title: '删除',
                type: 1,
                content: $('.permDelLayer'),
                area: '460px',
                btn: ['确定', '取消'],
                yes: function(index, layero){
                    $http({
                        url: DELPERMISSION_API,
                        method: "GET",
                        params:{id:id}
                    }).success(function (data) {
                        if(data.code ==0){
                            layer.msg(data.msg);
                        }else{
                            layer.close(index);
                            $scope.permList = data.data;
                            layer.msg(data.msg);
                        }
                    }).error(function (data) {
                        layer.msg("删除失败");
                    });
                },cancel: function(index){
                }
            });
        }
        // 编辑权限
        $scope.editPerm = function(flag,index){
            $scope.perm = {title:'',permCode:'',url:'',description:''};
            if(!flag){
                $scope.editButton = false;
                $scope.perm.id = 0;
                $scope.perm.type = 0;
                $scope.selectPid = $scope.pidList[0];
            }else{
                $scope.editButton = true;
                for(var i=0;i<$scope.pidList.length;i++){
                    if($scope.pidList[i].id==$scope.permList[index].pid)
                    {
                        $scope.selectPid = $scope.pidList[i];
                        break;
                    }
                }
                $scope.perm.id = $scope.permList[index].id;
                $scope.perm.title = $scope.permList[index].title;
                $scope.perm.type = $scope.permList[index].type;
                $scope.perm.pid = $scope.permList[index].pid;
                $scope.perm.url = $scope.permList[index].url;
                $scope.perm.permCode = $scope.permList[index].permCode;
                $scope.perm.description = $scope.permList[index].description;
            }
            layer.open({
                title: $scope.editButton ?'编辑权限':'添加权限',
                type: 1,
                content: $('.permEditLayer'),
                area: '620px',
                btn: ['确定', '取消'],
                yes: function(index, layero){
                    $scope.check();
                    if($scope.isValid){
                        $scope.perm.pid = $scope.selectPid.id;
                        $http({
                            url: ADDPERMISSION_API,
                            method: "POST",
                            data:$scope.perm
                        }).success(function (data) {
                            if(data.code ==0){
                                layer.msg(data.msg);
                            }else{
                                $scope.editButton = false;
                                $scope.permList = data.data;
                                layer.close(index);
                            }
                        }).error(function (data) {
                            console.log("添加失败");
                        });
                    }
                },cancel: function(index){
                    $scope.match = {
                        title:false,
                        url:false,
                        permCode:false,
                        description:false
                    }
                }
            });
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
        $scope.setFather = function(index){
            $scope.selectPid = $scope.pidList[index];
            $(".select-box").removeClass("open");
        }
        $scope.setType = function(id){
            $scope.perm.type = id;
            $(".select-box").removeClass("open");
        }
        $scope.check = function(){
            var regex = /^\s*$/g;
            $scope.match.title=regex.test($scope.perm.title);
            $scope.match.url=regex.test($scope.perm.url);
            $scope.match.permCode=regex.test($scope.perm.permCode);
            $scope.match.description=regex.test($scope.perm.description);
            for(var key in $scope.match){
                if($scope.match[key]){
                    $scope.isValid = false;
                    break;
                }else{
                    $scope.isValid = true;
                }
            }
            $scope.$digest();
        }
}]);