/*global exports*/
(function () {
    "use strict";
    
    var Q = require('../node_modules/q/q');
    //
    // Table definition:
    // CREATE TABLE IF NOT EXISTS tasks (task_id INTEGER, board_id INTEGER, container_id INTEGER, parent_id INTEGER, title TEXT, type INTEGER, 
    //                                   description TEXT, created DATETIME, creator INTEGER, updated DATETIME, owner_id INTEGER, completed DATETIME)
    
    
    var DEFAULT_TITLE = "";
    var DEFAULT_ID = -1;
    var DEFAULT_WIP = 0;
    
    var Task = function() {
        this.task_id = -1;
        this.board_id = -1;
        this.container_id = -1;
        this.parent_id = -1;
        this.title = "";
        this.type = 1;
        this.description = "";
        this.created = new Date();
        this.creator = -1;
        this.updated = new Date();
        this.owner_id = -1;
        this.completed = new Date(0);
        
        return this;
    };
    
    var GetTask = function(id) {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        var deferred = Q.defer();
        
        var obj = new Task();
        
        db.get("SELECT task_id, board_id, container_id, parent_id, title, type, description, created, creator, updated, owner_id, completed from tasks where task_id = ?", 
               id, function(err, row) { 
            var rv;
            if (err) deferred.reject(err);
            if (row) 
            {
                obj.task_id = row.task_id;
                obj.board_id = row.board_id;
                obj.container_id = row.container_id;
                obj.parent_id = row.parent_id;
                obj.title = row.title;
                obj.type = row.type;
                obj.description = row.description;
                obj.created = row.created;
                obj.creator = row.creator;
                obj.updated = row.updated;
                obj.owner_id = row.owner_id;
                obj.completed = row.completed;
            }
            db.close();
            console.log(obj);
            deferred.resolve(obj);
        });
        
        return deferred.promise;
    };
    
    var GetTasksByContainerId = function(containerId) {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        var deferred = Q.defer();
        
        db.all("SELECT task_id, board_id, container_id, parent_id, title, type, description, created, creator, updated, owner_id, completed from tasks where container_id = ?", containerId, function(err, rows) { 
            var rv;
            if (err) deferred.reject(err);
            var arr = new Array();
            if (rows && rows.length > 0) {
                rows.forEach(function (row) {
                    var obj = new Task();
                    if (row) 
                    {
                        obj.task_id = row.task_id;
                        obj.board_id = row.board_id;
                        obj.container_id = row.container_id;
                        obj.parent_id = row.parent_id;
                        obj.title = row.title;
                        obj.type = row.type;
                        obj.description = row.description;
                        obj.created = row.created;
                        obj.creator = row.creator;
                        obj.updated = row.updated;
                        obj.owner_id = row.owner_id;
                        obj.completed = row.completed;
                    }
                    arr.push(obj);
                });
            }
            db.close();
            console.log("GetTasksByContainerId: container_id: " + containerId + " :Got " + arr.length);
            deferred.resolve(arr);
        });
        
        return deferred.promise;
    };
    
    Task.prototype.Insert = function() {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        var deferred = Q.defer();
        
        console.log('Insert Task:');
        
        if (self.task_id === -1 || self.task_id === '-1')
        {
            console.log("-1 id");
            Task.GetNextId()
                .then(function(newId) {
                    self.task_id = newId;
                    console.log('Then function');
                    db.run("INSERT INTO tasks VALUES ($task_id, $board_id, $container_id, $parent_id, $title, $type, $description, $created, $creator, $updated, $owner_id, $completed)", {
                        $task_id: newId,
                        $board_id: self.board_id,
                        $container_id: self.container_id,
                        $parent_id: self.parent_id,
                        $title: self.title,
                        $type: self.type,
                        $description: self.description,
                        $created: self.created,
                        $creator: self.creator,
                        $updated: self.updated,
                        $owner_id: self.owner_id
                    });
                    db.close();
                    deferred.resolve(self);
                });
        }
        else {
            console.log("else clause");
            db.run("INSERT INTO tasks VALUES ($task_id, $board_id, $container_id, $parent_id, $title, $type, $description, $created, $creator, $updated, $owner_id, $completed)", {
                        $task_id: self.task_id,
                        $board_id: self.board_id,
                        $container_id: self.container_id,
                        $parent_id: self.parent_id,
                        $title: self.title,
                        $type: self.type,
                        $description: self.description,
                        $created: self.created,
                        $creator: self.creator,
                        $updated: self.updated,
                        $owner_id: self.owner_id
                    });
            db.close();
            deferred.resolve(self);
        }
        
        return deferred.promise;
    };
    Task.GetNextId = function() {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        console.log('Task:GetNextId');
        
        var deferred = Q.defer();
        
        db.get("SELECT MAX(task_id) as new_id from tasks", function(err, row) { 
            console.log('deferred : ' + err);
            var rv;
            if (err) deferred.reject(err);
            if (row) rv = row.new_id + 1;
            db.close();
            deferred.resolve(rv);
        });
        
        return deferred.promise;
    };
    Task.prototype.Update = function() {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        console.log("Tasks:Update Record: " + self.task_id);
        
        db.run("UPDATE tasks SET board_id = $board_id, container_id = $container_id, parent_id = $parent_id, title = $title, type = $type, description = $description " +
               "WHERE task_id = $task_id", {
                    $board_id: self.board_id,
                    $container_id: self.container_id,
                    $parent_id: self.parent_id,
                    $title: self.title,
                    $type: self.type,
                    $description: self.description,
                    $task_id: self.task_id
        });
        db.close();
    };
    Task.prototype.Delete = function() {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        db.run("DELETE FROM tasks WHERE task_id = $id", {
            $id: self.task_id
        });
        console.log("DELETE: task_id = " + self.task_id);
        db.close();
    };
    
    exports.Task = Task;
    exports.GetTask = GetTask;
    exports.GetTasksByContainerId = GetTasksByContainerId;
})();