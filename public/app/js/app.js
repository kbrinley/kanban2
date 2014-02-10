'use strict';

var kanbanApp = angular.module('kanbanApp', ['ngResource', 'ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        // Full route is /angular#/ - giving an app/templates/ for url points to a Angular templated html file.
        $routeProvider.when('/',
        {
            //template: 'Hello World!',
            templateUrl: 'app/templates/angular.html',
            controller: 'AngularTestController'
        });
        // NodeJS has a route for ng, which will render a jade template.
        $routeProvider.when('/ng',
        {
            templateUrl: 'ng',
            controller: 'NgTestController'
        });
    });
//    .factory('cache', function($cacheFactory) {
//        return $cacheFactory('cache', {capacity:3});
//    });
