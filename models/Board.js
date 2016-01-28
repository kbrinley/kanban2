/*global exports*/
(function () {
    "use strict";
    
    var Q = require('../node_modules/q/q');
    //
    // Table definition:
    // CREATE TABLE IF NOT EXISTS boards (id INTEGER, user_id INTEGER, name TEXT, swimlanes INTEGER)
    var DEFAULT_BOARD_NAME = "My Task Board";
    
    var Board = function() {
        this.id = -1;
        this.user_id = -1;
        this.name = "";
        this.swimlanes = -1;
        
        return this;
    };
    
    var GetBoard = function(id) {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        var deferred = Q.defer();
        
        var obj = new Board();
        
        db.get("SELECT id, user_id, name, swimlanes from boards where id = ?", id, function(err, row) { 
            if (err) deferred.reject(err);
            if (row) 
            {
                obj.id = row.id;
                obj.user_id = row.user_id;
                obj.name = row.name;
                obj.swimlanes = row.swimlanes;
            }
            db.close();
            console.log(obj);
            deferred.resolve(obj);
        });
        
        return deferred.promise;
    };
    
    Board.prototype.Insert = function() {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        console.log('Insert:');
        
        if (self.id === -1 || self.id === '-1')
        {
            console.log("-1 id");
            Board.GetNextId()
                .then(function(newId) {
                    console.log('Then function');
                    db.run("INSERT INTO boards VALUES ($id, $user_id, $name, $swimlanes)", {
                        $id: newId,
                        $user_id: self.user_id,
                        $name: self.name,
                        $swimlanes: self.swimlanes
                    });
                    db.close();
                });
        }
        else {
            console.log("else clause");
            db.run("INSERT INTO boards VALUES ($id, $user_id, $name, $swimlanes)", {
                $id: self.id,
                $board_id: self.user_id,
                $title: self.name,
                $wip: self.swimlanes
            });
            db.close();
        }
    };
    Board.GetNextId = function() {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        console.log('GetNextId');
        
        var deferred = Q.defer();
        
        db.get("SELECT MAX(id) as new_id from boards", function(err, row) { 
            console.log('deferred : ' + err);
            var rv;
            if (err) deferred.reject(err);
            if (row) rv = row.new_id + 1;
            db.close();
            deferred.resolve(rv);
        });
        
        return deferred.promise;
    }
    // Update name (swimlanes are tracked automatically, and don't allow user_id to be updated).
    Board.prototype.Update = function() {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        db.run("UPDATE boards SET name = $name WHERE id = $id", {
            $name: self.name,
            $id: self.container_id
        });
        db.close();
    };
    Board.prototype.Delete = function() {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        db.run("DELETE FROM boards WHERE id = $id", {
            $id: self.id
        });
        db.close();
    };
    // I think the better function is GetBoard, which is a 'static' method.
    var GetAllBoards = function(id) {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        var deferred = Q.defer();
        
        db.get("SELECT id, user_id, name, swimlanes from boards", function(err, row) { 
            var rv;
            if (err) deferred.reject(err);
            if (row) rv = row;
            db.close();
            console.log(rv);
            deferred.resolve(rv);
        });
        
        return deferred.promise;
    }
    
    exports.Board = Board;
    exports.GetBoard = GetBoard;
    exports.GetAllBoards = GetAllBoards;
})();