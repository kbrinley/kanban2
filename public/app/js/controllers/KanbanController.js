'use strict';

kanbanApp.controller('KanbanController',
    function KanbanController($scope, $location, boardData, containersData, tasksData, $http) {
        var boardId = 1;
        
        console.log("KanbanController!");
        
        $scope.modalShown = false;
        $scope.configureBoardFocus = false;
        
        $scope.addTaskShown = false;
        $scope.addTaskFocus = false;
        $scope.editTask = false;
        
        $scope.task = {};
        
        // Load the board from the Service, which calls the API. 
        $scope.boardQ = boardData.getBoard(boardId);
        $scope.boardQ.then(function(board) {
            $scope.board = board;
        });
        
        $scope.containerQ = containersData.getContainers(boardId);
        $scope.containerQ.then(function(containers) {
            console.log("Containers: " + containers);
            $scope.containers = containers;
            $scope.containers.forEach(function(row, index) {
                var t = tasksData.getTasks(row.container_id);
                t.then(function(tasks) {
                    $scope.containers[index].tasks = tasks;
                });
            });
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
        
        $scope.addTask = function() {
            $scope.addTaskFocus = true;
            $scope.addTaskShown = !$scope.addTaskShown;
            $scope.editTask = false;
        };
        $scope.addNewTask = function(task, addTask) {
            if (addTask.$valid) {
                console.log(task.title);
                $scope.addTaskShown = false;
                $scope.editTask = false;
                var cont_id = -1;
                if ($scope.containers && $scope.containers.length > 0) cont_id = $scope.containers[0].container_id;
                $http.post('/api/task/-1', {board_id: $scope.board.board_id, container_id: cont_id, title: task.title, type: task.type, description: task.description})
                    .then(function(theTask) {
                        console.log("Adding the Task to the container: " + theTask.data.title);
                        if ($scope.containers && $scope.containers.length > 0) {
                            $scope.containers[0].tasks.push(theTask.data);
                        }
                });
            }
        };
        
        $scope.editTask = function(task) {
            $scope.task = task;
            $scope.editTask = true;
            $scope.addTaskFocus = true;
            $scope.addTaskShown = !$scope.addTaskShown;
        };
        $scope.editTheTask = function(theTask, theForm) {
            if (theForm.$valid) {
                console.log("Saving the Task: " + theTask.title);
                $scope.addTaskShown = false;
                $scope.addTaskFocus = false;
                $scope.editTask = false;
                $http.put('/api/task/' + theTask.task_id, {board_id: $scope.board.board_id, container_id: theTask.container_id, title: theTask.title, 
                                                                    type: theTask.type, description: theTask.description});
                $scope.task = {};
            }
        };
        
        $scope.deleteTask = function(theTask) {
            console.log("Delete the Task: " + theTask.task_id);
            $scope.addTaskShown = false;
            $scope.editTask = false;
            return $http.delete('/api/task/' + theTask.task_id);
        };  
        
        $scope.configureBoard = function() {
            console.log("modalShown toggled!");
            $scope.configureBoardFocus = true;
            $scope.modalShown = !$scope.modalShown;
        };
        
        $scope.saveBoardConfig = function(board, boardForm) {
            if (boardForm.$valid) {
                console.log(board.name);
                $scope.modalShown = false;
                return $http.put('/api/board/' + board.id, {name: board.name});
            }
        };
        
        $scope.onDragComplete = function(data, other) {
            alert("Drag Complete!");  
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
