/*global require, console*/
(function () {
    "use strict";

    // Database functions
    function createTables() {
        console.log('Create Tables in SQLite3 database if needed');
        db.run("CREATE TABLE IF NOT EXISTS versions (version TEXT)", insertRows);
        queryDB();
        db.run("CREATE TABLE IF NOT EXISTS boards (id INTEGER, user_id INTEGER, name TEXT, swimlanes INTEGER)", insertBoard);
        db.run("CREATE TABLE IF NOT EXISTS containers (container_id INTEGER, board_id INTEGER, title TEXT, wip INTEGER)", insertContainers);
        testHarness();
        console.log('Database Update Complete');
    }

    function insertRows() {
        // Need to only insert if row doesn't currently exist.
        //var sprint0func = 
        db.all("SELECT version from versions where version == 'Sprint 0'", handleVersionsInsert("Sprint 0"));
    }
    
    function handleVersionsInsert(versionName) {
        return function(err, rows) {
            console.log("Checking for " + versionName + " : " + rows);
            if (rows.length === 0) {
                db.run("INSERT INTO versions VALUES($text)", {
                    $text: versionName
                });
            }
        }
    }

    function queryDB() {
        db.all("SELECT rowid as id, version FROM versions", function(err, rows) {
        rows.forEach(function(row) {
            console.log(row.id + ": " + row.version);
        });
     });
    }

    function insertBoard() {
        console.log("Query for existing boards");
        db.all("SELECT id from boards", function(err, rows) {
            console.log("Checking for existing record");
            if (rows.length === 0)
            {
                // Insert record.
                console.log("No existing record found. Creating basic record");
                db.run("INSERT INTO boards VALUES($id, $user_id, $name, $swimlanes)", {
                    $id: 1,
                    $user_id: 1,
                    $name: 'Example',
                    $swimlanes: 3
                });
            }
        });
    }
    
    function insertContainers() {
        console.log("Query for existing containers");
        db.all("SELECT board_id from containers", function(err, rows) {
            console.log("Checking for existing record");
            if (rows.length === 0)
            {
                // Insert record.
                console.log("No existing record found. Creating basic record");
                db.run("INSERT INTO containers VALUES($id, $board_id, $title, $wip)", {
                    $id: 1,
                    $board_id: 1,
                    $title: 'Not Started',
                    $wip: -1
                });
                db.run("INSERT INTO containers VALUES($id, $board_id, $title, $wip)", {
                    $id: 2,
                    $board_id: 1,
                    $title: 'In Progress',
                    $wip: 3
                });
                db.run("INSERT INTO containers VALUES($id, $board_id, $title, $wip)", {
                    $id: 3,
                    $board_id: 1,
                    $title: 'Complete',
                    $wip: -1
                });
            }
        });
    }
    
    function testHarness() {
        // Enable or repurpose for testing
        console.log("Query for existing container id 2");
        //db.all("SELECT container_id, board_id, title, wip from containers WHERE container_id = 2", function(err, rows) {
        db.all("SELECT MAX(container_id) as new_id from containers", function(err, rows) {
            console.log("Checking for record");
            if (rows.length === 1) {
                rows.forEach(function(row) {
                    //console.log(row.container_id + ": " + row.board_id + " : " + row.title + " : " + row.wip);
                    console.log(row.new_id);
                });
            }
        });
    }
    
    /**
     * Module dependencies.
     */

    var express = require('express'),
        routes = require('./routes'),
        user = require('./routes/user'),
        kanban = require('./routes/kanban'),
        container = require('./routes/containers'),
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
    
    /** API calls **/
    // board
    app.get('/api/board/:id', kanban.getBoard);
    app.post('/api/board/:id', kanban.insertBoard);
    app.delete('/api/board/:id', kanban.deleteBoard);
    app.put('/api/board/:id', kanban.updateBoard);
    // containers
    app.get('/api/containers/:id', container.getContainers); // id refers to board_id, not container_id
    // container
    app.get('/api/container/:id', container.getContainer);
    app.post('/api/container/:id', container.insertContainer);
    app.delete('/api/container/:id', container.deleteContainer);
    app.put('/api/container/:id', container.updateContainer);

    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
}());
