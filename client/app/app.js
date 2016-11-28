(function() {
    'use strict';

    angular
        .module('userManager', ['ngRoute', 'ngStorage'])
        .config(['$routeProvider', route]);

    function route($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'app/Home/home.html',
                controller: 'homeController'
            })
            .when('/login', {
                templateUrl: 'app/Login/login.html',
                controller: 'loginController'
            })
            .when('/users', {
                templateUrl: 'app/Userlist/userlist.html',
                controller: 'userlistController'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }

})();