/*global exports*/
(function () {
    "use strict";
   // Containers: (container_id INTEGER, board_id INTEGER, title TEXT, wip INTEGER)
    var c = require('./../models/Container');
    var t = require('./../models/Task');
    
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
                //t.GetTasksByContainerId(row.container_id).then(function(tasks) {
                //    row.tasks = tasks;
                //    console.log("row.tasks: " + row.tasks.length);
                    obj.push(row);
                //});
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
        var container = new c.Container();
        
        container.container_id = req.params.id;
        // Don't set value if it isn't present.
        if (req.body.title)
            container.title = req.body.title;
        if (req.body.board_id)
            container.board_id = req.body.board_id;
        if (req.body.wip)
            container.wip = req.body.wip;
        
        container.Insert();
        
        res.send();
    };
    
    /**  PUT: /api/container/:id  **/
    exports.updateContainer = function(req, res) {

        var newTitle = req.body.title;
        
        var container = new c.Container();
        container.container_id = req.params.id;
        // Don't set value if it isn't present.
        if (req.body.title)
            container.title = req.body.title;
        if (req.body.board_id)
            container.board_id = req.body.board_id;
        if (req.body.wip)
            container.wip = req.body.wip;
        
        container.Update();
        
        res.send();
    };
    
    /**  DELETE: /api/container/:id  **/
    exports.deleteContainer = function(req, res) {
        //var container = new c.Container();
        //container.container_id = req.params.id;
        c.GetContainer(req.params.id).then(function(container) {
            console.log(container.title);

            container.Delete();

            res.send();
        });
    };
}());