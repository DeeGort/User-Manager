(function() {
    'use strict';

    angular
        .module('userManager')
        .factory('auth', auth);

    auth.$inject = ['$http', '$sessionStorage'];

    function auth($http, $sessionStorage) {
        var service = {
            login: login,
            logout: logout,
            getToken: getToken,
            isLoggedIn: isLoggedIn
        }

        return service;

        function login(credentials) {
            var data = {
                username: credentials.username,
                password: credentials.password
            };

            if (isLoggedIn()) return;

            return $http.post('api/authenticate', data)
                        .success(authenticateSuccess);
            
            function authenticateSuccess (data, status, headers) {
                var bearerToken = headers('Authorization');
                if (angular.isDefined(bearerToken) && bearerToken.slice(0, 7) === 'Bearer ') {
                    var jwt = bearerToken.slice(7, bearerToken.length);
                    $sessionStorage.authenticationToken = jwt;
                    return jwt;
                }
            }
        }

        function logout() {
            delete $sessionStorage.authenticationToken;
        }

        function getToken() {
            return $sessionStorage.authenticationToken;
        }

        function isLoggedIn() {
            return !!$sessionStorage.authenticationToken;
        }
    }
})();