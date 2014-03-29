'use strict';

kanbanApp.controller('KanbanController',
    function KanbanController($scope, boardData, containersData, $http) {
        var boardId = 1;
        
        console.log("KanbanController!");
        
        // Load the board from the Service, which calls the API. 
        $scope.boardQ = boardData.getBoard(boardId);
        $scope.boardQ.then(function(board) {
            $scope.board = board;
        });
        
        $scope.containerQ = containersData.getContainers(boardId);
        $scope.containerQ.then(function(containers) {
            console.log("Containers: " + containers);
            $scope.containers = containers; 
        });
        
        $scope.updateContainerTitle = function(id, data, board_id, wip) {
            return $http.put('/api/container/' + id, {title: data, board_id: board_id, wip: wip});
        };
        $scope.insertContainer = function(id, data, board_id, wip) {
            return $http.post('/api/container/' + id, {title: data, board_id: board_id, wip: wip});
        };
        $scope.deleteContainer = function(id) {
            return $http.delete('/api/container/' + id);  
        };
        
        /*$scope.containers = 
            [{
                "container_id": -1,
                "board_id": -1,
                "title": "Not Started",
                "wip": -1
            },
            {
                "container_id": -2,
                "board_id": -1,
                "title": "In Progress",
                "wip": 3
            },
            {
                "container_id": -3,
                "board_id": -1,
                "title": "Done",
                "wip": -1
            }
            ];*/
    }
);
