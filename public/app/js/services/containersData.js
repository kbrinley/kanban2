'use strict';

// To add a new service/api
// Add services js file
// Reference file in layout.jade
// Create routes js file
// Reference file in app.js
// Now, data class can be referenced in an Angular Controller
kanbanApp.factory('containersData', function ($resource, $q, $timeout) {
	var resource = $resource('/api/containers/:id', {id:'@id'}, {"getAll": {method: "GET", isArray:true, params: {something: "foo"}}});
	return {
		getContainers: function(boardId) {
			var deferred = $q.defer();
			$timeout(function() {
				resource.getAll({id:boardId}, 
					function (containers) {
						deferred.resolve(containers);
					},
					function (response) {
						deferred.reject(response);
					});
			}, 3000);
			return deferred.promise;
		},
		save: function(board) {
			var deferred = $q.defer();
			board.id = 999;
			resource.save(board,
				function(response) { deferred.resolve(response); },
				function(response) {deferred.reject(response); }
			);
			return deferred.promise;
		}/*,
		getAllEvents: function() {
			var deferred = $q.defer();
			var counter = 0;
			var max = 2;
			var items = [];

			resource.get({id:1},
				function(event) {
					items[0] = event;
					counter++;
					if (counter >= max)
						deferred.resolve(items);
				},
				function (response) {
					deferred.reject(response);
				});
			resource.get({id:2},
				function(event) {
					items[1] = event;
					counter++;
					if (counter >= max)
						deferred.resolve(items);
				},
				function (response) {
					deferred.reject(response);
				});

			return deferred.promise;
			//return resource.query();
		}*/
	};
});