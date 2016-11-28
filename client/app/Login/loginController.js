(function() {
    'use strict';

    angular
        .module('userManager')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', 'auth'];

    function loginController($scope, auth) {
        $scope.credential = {};
        $scope.submit = submit;
        $scope.clear = clear;

        function submit() {
            auth.login($scope.credential);
            $scope.clear();
        }

        function clear() {
            $scope.credential = {};
        }
    }

})();