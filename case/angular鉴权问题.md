# 如何在启动项目前获取currentUser信息

1. 在项目启动前发送请求，获取currentUser信息。
2. 手动启动angular绑定 angular.bootstrap()

## 示例代码
```js
    angular.element(document).ready(function () {
        $.get('/api/UserApi/GetCurrentUser', function (result) {
            currentUser = result.data;
            var temp = angular.module("BaseApp");
            temp.run(['$rootScope', '$state', '$stateParams', 'currentUserService',
                function ($rootScope, $state, $stateParams, currentUserService) {
                    $rootScope.$state = $state;
                    $rootScope.$stateParams = $stateParams;
                    $rootScope.currentUser = currentUser;
                    currentUserService.setCurrentUser(currentUser);
                }
            ])
            angular.bootstrap(document, ["BaseApp"]);
        });
    });
```