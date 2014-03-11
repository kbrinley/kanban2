'use strict';

kanbanApp.controller('KanbanController',
    function KanbanController($scope, boardData, containersData) {
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
