/*global require, console*/
(function () {
    "use strict";

    // Database functions
    function createTables() {
        console.log('Create Tables in SQLite3 database if needed');
        db.run("CREATE TABLE IF NOT EXISTS versions (version TEXT)", insertRows);
    }

    function insertRows() {
     // Need to only insert if row doesn't currently exist.

        console.log("Insert Rows for Sprint 0");
        var stmt = db.prepare("INSERT INTO versions VALUES (?)");

        stmt.run("Sprint 0");

        stmt.finalize(queryDB);
    }

    function queryDB() {
        db.all("SELECT rowid as id, version FROM versions", function(err, rows) {
        rows.forEach(function(row) {
            console.log(row.id + ": " + row.version);
        });
     });
    }



    /**
     * Module dependencies.
     */

    var express = require('express'),
        routes = require('./routes'),
        user = require('./routes/user'),
        kanban = require('./routes/kanban'),
        angular = require('./routes/angular'),
        http = require('http'),
        path = require('path'),
        sqlite = require('sqlite3'),
        db = new sqlite.Database('kanban', createTables);

    var app = express();

    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    // development only
    if ('development' == app.get('env')) {
      app.use(express.errorHandler());
    }

    //app.get('/', routes.index);
    app.get('/angular', angular.angular);
    app.get('/ng', angular.ng);
    app.get('/partials/:name', routes.partials);
    app.get('/users', user.list);
    app.get('/kanban', kanban.board);

    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
}());
