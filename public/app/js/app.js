'use strict';

var kanbanApp = angular.module('kanbanApp', ['ngResource', 'ngRoute', 'xeditable', 'ngDraggable'])
    .config(function($routeProvider, $locationProvider) {
        // Full route is /angular#/ - giving an app/templates/ for url points to a Angular templated html file.
        /*$routeProvider.when('/',
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
        });*/
        $routeProvider.when('/addtask',
        {
            templateUrl: 'addtask',
            controller: 'TaskController'
        });
        $routeProvider.when('/', 
        {
            templateUrl: 'kanban',
            controller: 'KanbanController'
        });
        //$locationProvider.html5Mode(true);
        
    })
    .run(function(editableOptions) {
        editableOptions.theme = 'bs3';  
    });


//    .factory('cache', function($cacheFactory) {
//        return $cacheFactory('cache', {capacity:3});
//    });
