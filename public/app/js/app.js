'use strict';

var kanbanApp = angular.module('kanbanApp', ['ngResource', 'ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        // Full route is /angular#/
        $routeProvider.when('/',
        {
            //template: 'Hello World!',
            templateUrl: 'app/templates/angular.html',
            controller: 'AngularTestController'
        });
    });
//    .factory('cache', function($cacheFactory) {
//        return $cacheFactory('cache', {capacity:3});
//    });
