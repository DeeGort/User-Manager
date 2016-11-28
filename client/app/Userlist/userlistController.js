(function() {
    'use strict';

    angular
        .module('userManager')
        .controller('userlistController', userlistController);

    userlistController.$inject = ['$scope', '$http' ,'auth'];

    function userlistController($scope, $http, auth) {
        $scope.userlist = [];
        $scope.add = function() {
            $http.post('api/users', $scope.user, {
                headers: {'x-access-token': auth.getToken() }
            })
            .success(function(response) {
                $scope.refresh();
            })
        }
        $scope.refresh = function() {
            $http.get('api/users', {
                headers: {'x-access-token': auth.getToken() }
            })
            .success(function(data) {
                $scope.userlist = data;
            });
        }
        $scope.remove = function(id) {
            console.log(id);
            $http.delete('api/users/' + id, {
                headers: {'x-access-token': auth.getToken() }
            })
            .success(function(data) {
                console.log('hello');
                $scope.refresh();
            })
            .error (function(date) {
                console.log(date);
            });
        }

        $scope.refresh();
    }

})();