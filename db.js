/*global console*/
(function () {
    "use strict";

    var kanbanDB;



    // Database functions
    kanbanDB.createTables = function () {
        console.log('Create Tables in SQLite3 database if needed');
        this.db.run("CREATE TABLE IF NOT EXISTS versions (version TEXT)", insertRows);
    }

    kanbanDB.insertRows = function () {
        // Need to only insert if row doesn't currently exist.

        console.log("Insert Rows for Sprint 0");
        var stmt = this.db.prepare("INSERT INTO versions VALUES (?)");

        stmt.run("Sprint 0");

        stmt.finalize(queryDB);
    }

    kanbanDB.queryDB = function () {
        this.db.all("SELECT rowid as id, version FROM versions", function(err, rows) {
            rows.forEach(function(row) {
                console.log(row.id + ": " + row.version);
            });
        });
    }

    kanbanDB.db = new sqlite.Database('kanban', createTables);

    return kanbanDB;
}());
