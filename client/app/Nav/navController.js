(function() {
    'use strict';

    angular
        .module('userManager')
        .controller('navController', navController);

    navController.$inject = ['$scope', '$location', 'auth'];

    function navController($scope, $location, auth) {
        $scope.isActive = function(destination) {
            return destination === $location.path();
        }
        $scope.isLoggedIn = function() {
            return auth.isLoggedIn();
        }
        $scope.logout = function() {
            auth.logout();
        }

    }
})();