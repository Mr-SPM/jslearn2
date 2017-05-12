myApp.provider('logService', function () {
    var counter = true;
    var debug = true;
    return {
        messageCounterEnabled: function (setting) {
            if (angular.isDefined(setting)) {
                counter = setting;
                return this;
            } else {
                return counter;
            }
        },
        debugEnabled: function (setting) {
            if (angular.isDefined(setting)) {
                debug = setting;
                return this;
            } else {
                return debug;
            }
        },
        $get: function () {
            return {
                messageCount: 0,
                log: function (msg) {
                    if (debug) {
                        console.log('Log' + messageCount++ + msg);
                    }
                }
            }
        }
    }
})
angular.module('exampleApp', ['myApp']).config(function (logServiceProvider) {
    logServiceProvider.debugEnabled(true).messageCounterEnabled(false);
}).controller(
    'exampleController', function ($scope, logService) {
        logService.log('providerSetting');
    })

angular.module('myApp', ['ngSanitize']).controller('myController', function ($scope) {
    $scope.htmlData = '<p>This is <b onmouseover=alert("Attack!")>dangeraous</b> data </p>';
})
var interpolateFn = $interpolate('The total is {{amount | currrency}}(including tax)')

var content = "<ul><li ng-repeat='city in citys'>{{city}}</li></ul>";
var listElment = angular.element(content);
var compileFn = $compile(listElment);
compileFn(scope);
element.append(listElment);
config: {
    transformRequest: function(data, headers) {
        var rootElem = angular.element('<xml>');
        for (var i = 0; i < data.length; i++) {
            var prodElem = angular.element('<product>');
            prodElem.attr('name', data[i].name);
            rootElem.append(prodElem);
        }
        rootElem.children().wrap('<product>');
        return rootElem.html();
    }
}
$httpProvider.interceptors.push(function () {
    return {
        request: function (config) {
            config.url = 'productData.json';
            return config;
        },
        response: function (response) {
            console.log('Data Count: ' + repsonse.data.length);
            return response;
        }
    }
})
