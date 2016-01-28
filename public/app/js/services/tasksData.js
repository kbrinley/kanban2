'use strict';

// To add a new service/api
// Add services js file
// Reference file in layout.jade
// Create routes js file
// Reference file in app.js
// Now, data class can be referenced in an Angular Controller
kanbanApp.factory('tasksData', function ($resource, $q, $timeout) {
	var resource = $resource('/api/task/container/:id', {id:'@id'}, {"getAll": {method: "GET", isArray:true}});
	return {
		getTasks: function(containerId) {
			var deferred = $q.defer();
			$timeout(function() {
                console.log("containerId: " + containerId);
				resource.getAll({id:containerId}, 
					function (tasks) {
						deferred.resolve(tasks);
					},
					function (response) {
						deferred.reject(response);
					});
			}, 3000);
			return deferred.promise;
	   }
    };
});