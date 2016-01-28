/*global exports*/
(function () {
    "use strict";
   // Containers: (container_id INTEGER, board_id INTEGER, title TEXT, wip INTEGER)
    var t = require('./../models/Task');
    
    /**  GET: /api/task/:id  **/
    exports.getTaskById = function(req, res) {
        t.GetTask(req.params.id).then(function(task) {
            console.log(task.title);

            res.send(task);
        });
    };
    
    /** GET: /api/task/container/:id **/
    exports.getTasksByContainerId = function(req, res) {
        t.GetTasksByContainerId(req.params.id).then(function(tasks) {
            console.log(tasks.length);

            res.send(tasks);
        });
    };
    
    /** POST: /api/task/:id **/
    exports.insertTask = function(req, res) {
        var task = new t.Task();
        
        task.task_id = req.params.id;
        // Don't set value if it isn't present.
        if (req.body.board_id)
            task.board_id = req.body.board_id;
        if (req.body.container_id)
            task.container_id = req.body.container_id;
        if (req.body.parent_id)
            task.body.parent_id;
        if (req.body.title)
            task.title = req.body.title;
        if (req.body.type)
            task.type = req.body.type;
        if (req.body.description)
            task.description = req.body.description;
        if (req.body.creator)
            task.creator = req.body.creator;
        if (req.body.owner_id)
            task.owner_id = req.body.owner_id;
        
        task.Insert().then(function(theTask) {
           res.send(theTask); 
        });
    };
    
    /** DELETE: /api/task/:id **/
    exports.deleteTask = function(req, res) {
        t.GetTask(req.params.id).then(function(task) {
            console.log(task.title);

            task.Delete();
            
            res.send();
        });
    };
    
    /** PUT /api/task/:id **/
    exports.updateTask = function(req, res) {
        t.GetTask(req.params.id).then(function(task) {
            // Don't set value if it isn't present.
            if (req.body.board_id)
                task.board_id = req.body.board_id;
            if (req.body.container_id)
                task.container_id = req.body.container_id;
            if (req.body.parent_id)
                task.body.parent_id;
            if (req.body.title)
                task.title = req.body.title;
            if (req.body.type)
                task.type = req.body.type;
            if (req.body.description)
                task.description = req.body.description;
            if (req.body.creator)
                task.creator = req.body.creator;
            if (req.body.owner_id)
                task.owner_id = req.body.owner_id;

            console.log("Updating Task: " + task.task_id);
            task.Update();

            res.send();
        });
    };
    
}());