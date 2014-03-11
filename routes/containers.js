/*global exports*/
(function () {
    "use strict";
   // Containers: (container_id INTEGER, board_id INTEGER, title TEXT, wip INTEGER)
    
    
    /**  GET: /api/containers/:id  **/
    exports.getContainers = function(req, res) {
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');

        var boardId = req.params.id;
        var obj = {};
        db.all("SELECT container_id, board_id, title, wip from containers where board_id = ?", boardId, function(err, rows) {
            console.log("Got row: " + rows);    
            if (err) throw err;
            var obj = new Array();
            rows.forEach(function (row) {
                console.log(row.container_id + ": " + row.title);
                obj.push(row);
            });
            db.close();
            res.send(obj);
        });
    };
    
    /**  GET: /api/container/:id  **/
    exports.getContainer = function(req, res) {
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');

        var containerId = req.params.id;
        var obj = {};
        db.get("SELECT container_id, board_id, title, wip from containers where container_id = ?", containerId, function(err, row) {
            console.log("Got row: " + row);
            if (err) throw err;
            if (row) obj = row;
            db.close();
            res.send(obj);
        });
    };
    
     /**  POST: /api/container/:id  **/
    exports.insertContainer = function(req, res) {
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');

        var boardId = req.params.id;
    };
    
    /**  PUT: /api/container/:id  **/
    exports.updateContainer = function(req, res) {
        
    };
    
    /**  DELETE: /api/container/:id  **/
    exports.deleteContainer = function(req, res) {
        
    };
}());