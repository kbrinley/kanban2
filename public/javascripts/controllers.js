// ng-app must be set to this.
var indexPage = angular.module('indexPage', []);

indexPage.controller('IndexPageCtrl', function($scope) {
    $scope.userObject = {name: 'Kevin',
                        email: 'kbrinley@gmail.com',
                        age: 30,
                        title: 'Scrum Master'};
                      });
