/*global exports*/
(function () {
    "use strict";
    
    var b = require('./../models/Board');

    /**  GET: /kanban  **/
    exports.board = function (req, res) {
        res.render('board', { title: 'Express' });
    };
    
    exports.addTask = function (req, res) {
        res.render('addTask', { title: 'Add Task'});  
    };

    /**  GET: /api/board/:id  **/
    exports.getBoard = function(req, res) {
        b.GetBoard(req.params.id).then(function(board) {
            console.log(board.name);

            res.send(board);
        });
    };
    
    /**  POST: /api/board/:id  **/
    exports.insertBoard = function(req, res) {
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');

        var boardId = req.params.id;
    };
    
    /**  PUT: /api/board/:id  **/
    exports.updateBoard = function(req, res) {
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        var boardId = req.params.id;
        var boardName = 'Default';
        if (req.body.name)
            boardName = req.body.name;
        
        db.run("UPDATE boards SET name = $name WHERE id = $id", {
            $name: boardName,
            $id: boardId
        });
        db.close();
        res.send();
    };
    
    /**  DELETE: /api/board/:id  **/
    exports.deleteBoard = function(req, res) {
        
    };
}());
