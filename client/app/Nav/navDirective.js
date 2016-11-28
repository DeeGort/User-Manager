(function() {
    'use strict';

    angular
        .module('userManager')
        .directive('navbar', navbar);
    
    function navbar() {
        return {
            restrict: 'E',
            templateUrl: 'app/Nav/navbar.html',
            controller: 'navController'
        };
    }
})()