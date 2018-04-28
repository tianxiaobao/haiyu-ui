angular.module('myApp').controller('userManageController', ['$http', '$stateParams', '$state', '$rootScope', '$scope','USERLIST_API','ADDUSER_API','DELUSER_API','GETROLE_API',
	function ($http, $stateParams, $state, $rootScope, $scope, USERLIST_API,ADDUSER_API,DELUSER_API,GETROLE_API) {
        $scope.editButton = false;
        $scope.match = {
            username:false,
            password:false,
            email:false,
            phone:false,
            company:false
        }
        $scope.isValid = true;
        $scope.USrepertory =  {
            'pageSizes': [{
                'name': 20,
                'number': 20
            }],
            'Ajax': {
                'url': USERLIST_API,
                'params':{}
            },
            'getData':function(initPagin){},
            'asyn': true,
        };
        // 获取角色
        $scope.getRole = function(){
            $http({
                url: GETROLE_API,
                method: "GET"
            }).success(function (data) {
                $scope.roleList = data;
                $scope.selectRole = $scope.roleList[0];
            }).error(function (data) {
                console.log("获取失败");
            });
        }();
        // 删除用户
        $scope.delUser = function(id){
            layer.open({
                title: '删除',
                type: 1,
                content: $('.userDelLayer'),
                area: '460px',
                btn: ['确定', '取消'],
                yes: function(index, layero){
                    $http({
                        url: DELUSER_API,
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
        // 编辑用户
        $scope.editUser = function(flag,index){
            $scope.user = {username:'',password:'',email:'',phone:'',company:''};
            if(!flag){
                $scope.editButton = false;
                $scope.selectRole = $scope.roleList[0];
            }else{
                $scope.editButton = true;
                for(var i=0;i<$scope.roleList.length;i++){
                    if($scope.roleList[i].id==$rootScope.userList[index].type)
                    {
                        $scope.selectRole = $scope.roleList[i];
                        break;
                    }
                }
                $scope.user.id = $rootScope.userList[index].id;
                $scope.user.username = $rootScope.userList[index].username;
                $scope.user.email = $rootScope.userList[index].email;
                $scope.user.phone = $rootScope.userList[index].phone;
                $scope.user.type = $rootScope.userList[index].type;
                $scope.user.company = $rootScope.userList[index].company;
            }
            layer.open({
                title: $scope.editButton ?'编辑用户':'新建用户',
                type: 1,
                content: $('.userEditLayer'),
                area: '620px',
                btn: ['确定', '取消'],
                yes: function(index, layero){
                    $scope.check();
                    if($scope.isValid){
                        $scope.user.type = $scope.selectRole.id;
                        $http({
                            url: ADDUSER_API,
                            method: "POST",
                            data:$scope.user
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
                        username:false,
                        password:false,
                        email:false,
                        phone:false,
                        company:false
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
        $scope.setRole = function(index){
            $scope.selectRole = $scope.roleList[index];
            $(".select-box").removeClass("open");
        }
        $scope.check = function(){
            var regex = /^\s*$/g;
            var pasreg = /.{6,}/;
            var phonereg = /^1[3|4|5|8][0-9]\d{8}$/;
            var mailreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
            $scope.match.username=regex.test($scope.user.username);
            $scope.match.password= !pasreg.test($scope.user.password);
            $scope.match.company=regex.test($scope.user.company);
            $scope.match.email= !mailreg.test($scope.user.email);
            $scope.match.phone= !phonereg.test($scope.user.phone);
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