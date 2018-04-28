angular.module('myApp').controller('roleManageController', ['$http', '$stateParams', '$state', '$rootScope', '$scope','ROLELIST_API','ADDROLE_API','DELROLE_API','GETPERMNODE_API',
	function ($http, $stateParams, $state, $rootScope, $scope, ROLELIST_API,ADDROLE_API,DELROLE_API,GETPERMNODE_API) {
        $scope.editButton = false;
        $scope.match = {
            name:false,
            description:false
        }
        $scope.isValid = true;
        $scope.selected = [1];
        $scope.ROrepertory =  {
            'pageSizes': [{
                'name': 20,
                'number': 20
            }],
            'Ajax': {
                'url': ROLELIST_API,
                'params':{}
            },
            'getData':function(initPagin){},
            'asyn': true,
        };
        // 获取角色
        $scope.roleList = function(){
            $http({
                url: ROLELIST_API,
                method: "GET"
            }).success(function (data) {
                $scope.roleList = data.data;
            }).error(function (data) {
                console.log("获取失败");
            });
        }();
        // 获取权限
        $scope.getPerm = function(){
            $http({
                url: GETPERMNODE_API,
                method: "GET"
            }).success(function (data) {
                $scope.permList = data;
            }).error(function (data) {
                console.log("获取失败");
            });
        }();
        // 删除角色
        $scope.delRole = function(id){
            layer.open({
                title: '删除',
                type: 1,
                content: $('.roleDelLayer'),
                area: '460px',
                btn: ['确定', '取消'],
                yes: function(index, layero){
                    $http({
                        url: DELROLE_API,
                        method: "GET",
                        params:{id:id}
                    }).success(function (data) {
                        if(data.code ==0){
                            layer.msg(data.msg);
                        }else{
                            layer.close(index);
                            location.reload();
                            layer.msg(data.msg);
                        }
                    }).error(function (data) {
                        layer.msg("删除失败");
                    });
                },cancel: function(index){
                }
            });
        }
        //编辑角色
        $scope.editRole = function(flag,index){
            $scope.role = {name:'',description:''};
            if(!flag){
                $scope.editButton=false;
                $scope.role.id=0;
                for(var i=0;i<$scope.permList.length;i++){
                    for(var j=0;j<$scope.permList[i].child.length;j++){
                        $scope.permList[i].child[j].check = false;
                    }
                }
            }else{
                $scope.editButton = true;
                $scope.setPerm($rootScope.roleList[index].perm);
                $scope.role.id = $rootScope.roleList[index].id;
                $scope.role.name = $rootScope.roleList[index].name;
                $scope.role.description = $rootScope.roleList[index].description;
            }
            layer.open({
                title: $scope.editButton ?'编辑角色':'添加角色',
                type: 1,
                content: $('.roleEditLayer'),
                area: '620px',
                btn: ['确定', '取消'],
                yes: function(index, layero){
                    $scope.check();
                    if($scope.isValid){
                        $scope.getPerms();
                        $scope.role.perm = $scope.selected.join(',');
                        $http({
                            url: ADDROLE_API,
                            method: "GET",
                            params:$scope.role
                        }).success(function (data) {
                            if(data.code ==0){
                                layer.msg(data.msg);
                            }else{
                                $scope.editButton = false;
                                location.reload();
                                layer.close(index);
                            }
                        }).error(function (data) {
                            console.log("添加失败");
                        });
                    }
                },cancel: function(index){
                    $scope.match = {
                        name:false,
                        description:false
                    }
                }
            });
        }
        $scope.check = function(){
            var regex = /^\s*$/g;
            $scope.match.name=regex.test($scope.role.name);
            $scope.match.description=regex.test($scope.role.description);
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
        $scope.checkInput = function(outIndex,index){
            $scope.permList[outIndex].child[index].check = !$scope.permList[outIndex].child[index].check;
        }
        $scope.setPerm = function(perm){
            for(var i=0;i<$scope.permList.length;i++){
                for(var j=0;j<$scope.permList[i].child.length;j++){
                    $scope.permList[i].child[j].check = false;
                }
            }
            for(var i=0;i<$scope.permList.length;i++){
                for(var j=0;j<$scope.permList[i].child.length;j++){
                    for(var k=0;k<perm.length;k++){
                        if(perm[k]==$scope.permList[i].child[j].id){
                            $scope.permList[i].child[j].check = true;
                            break;
                        }else{
                            $scope.permList[i].child[j].check = false;
                        }
                    }
                }
            }
        }
        $scope.getPerms = function(){
            $scope.selected =[];
            for(var i=0;i<$scope.permList.length;i++){
                for(var j=0;j<$scope.permList[i].child.length;j++){
                    if($scope.permList[i].child[j].check&&$scope.selected.indexOf($scope.permList[i].child[j].id==-1)){
                        $scope.selected.push($scope.permList[i].child[j].id);
                    }
                }
            }
        }
}]);