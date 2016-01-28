/*global exports*/
(function () {
    "use strict";
    
    var Q = require('../node_modules/q/q');
//
// Table definition:
// "CREATE TABLE IF NOT EXISTS containers (container_id INTEGER, board_id INTEGER, title TEXT, wip INTEGER)"

    var DEFAULT_TITLE = "";
    var DEFAULT_ID = -1;
    var DEFAULT_WIP = 0;
    
    var Container = function() {
        this.container_id = -1;
        this.board_id = -1;
        this.title = "";
        this.wip = 0;
        
        return this;
    };
    
    var GetContainer = function(id) {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        var deferred = Q.defer();
        
        var obj = new Container();
        
        db.get("SELECT container_id, board_id, title, wip from containers where container_id = ?", id, function(err, row) { 
            var rv;
            if (err) deferred.reject(err);
            if (row) 
            {
                obj.container_id = row.container_id;
                obj.board_id = row.board_id;
                obj.title = row.title;
                obj.wip = row.wip;
            }
            db.close();
            console.log(obj);
            deferred.resolve(obj);
        });
        
        return deferred.promise;
    };
    
    Container.prototype.Insert = function() {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        console.log('Insert:');
        
        if (self.container_id === -1 || self.container_id === '-1')
        {
            console.log("-1 id");
            Container.GetNextId()
                .then(function(newId) {
                    console.log('Then function');
                    db.run("INSERT INTO containers VALUES ($id, $board_id, $title, $wip)", {
                        $id: newId,
                        $board_id: self.board_id,
                        $title: self.title,
                        $wip: self.wip
                    });
                    db.run("UPDATE boards SET swimlanes = swimlanes + 1 WHERE id = $board_id", {
                        $board_id: self.board_id
                    });
                    db.close();
                });
        }
        else {
            console.log("else clause");
            db.run("INSERT INTO containers VALUES ($id, $board_id, $title, $wip)", {
                $id: self.container_id,
                $board_id: self.board_id,
                $title: self.title,
                $wip: self.wip
            });
            db.run("UPDATE boards SET swimlanes = swimlanes + 1 WHERE id = $board_id", {
                $board_id: self.board_id
            });
            db.close();
        }
    };
    // Update everything.
    Container.prototype.Update = function() {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        db.run("UPDATE containers SET board_id = $board_id, title = $title, wip = $wip WHERE container_id = $id", {
            $board_id: self.board_id,
            $title: self.title,
            $wip: self.wip,
            $id: self.container_id
        });
        db.close();
    };
    Container.prototype.Delete = function() {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        db.run("DELETE FROM containers WHERE container_id = $id", {
            $id: self.container_id
        });
        console.log("DELETE: board_id = " + self.board_id);
        db.run("UPDATE boards SET swimlanes = swimlanes - 1 WHERE id = $board_id", {
            $board_id: self.board_id
        });
        db.close();
    };
    Container.GetNextId = function() {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        console.log('GetNextId');
        
        var deferred = Q.defer();
        
        db.get("SELECT MAX(container_id) as new_id from containers", function(err, row) { 
            console.log('deferred : ' + err);
            var rv;
            if (err) deferred.reject(err);
            if (row) rv = row.new_id + 1;
            db.close();
            deferred.resolve(rv);
        });
        
        return deferred.promise;
    }
    Container.Get = function(id) {
        var self = this;
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');
        
        var deferred = Q.defer();
        
        db.get("SELECT container_id, board_id, title, wip from containers", function(err, row) { 
            var rv;
            if (err) deferred.reject(err);
            if (row) rv = row;
            db.close();
            console.log(rv);
            deferred.resolve(rv);
        });
        
        return deferred.promise;
    }
    
    exports.Container = Container;
    exports.GetContainer = GetContainer;
})();