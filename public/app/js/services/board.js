'use strict';

kanbanApp.factory('boardData', function ($resource, $q, $timeout) {
	var resource = $resource('/api/board/:id', {id:'@id'}, {"getAll": {method: "GET", isArray:true, params: {something: "foo"}}});
	return {
		getBoard: function(boardId) {
			var deferred = $q.defer();
			$timeout(function() {
				resource.get({id:boardId}, 
					function (board) {
						deferred.resolve(board);
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