/*global exports*/
(function () {
    "use strict";
    /*
     * GET kanban board.
     */

    exports.board = function (req, res) {
        res.render('board', { title: 'Express' });
    };

    // This needs to be tested. And how do we get url parameters?
    exports.getBoard = function(req, res) {
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');

        var boardId = req.params.id;
        var obj = {};
        var stmt = db.prepare("SELECT id, user_id, name, swimlanes from boards where id = ?");
        stmt.get(boardId, function(err, row) {
                console.log("Got row: " + row);
                if (err) throw err;
                if (row) obj = row;
                db.close();
                res.send(obj);
            });
        /*stmt.finalize(function(err) {
            console.log("Finalize");
            if (err) throw err;
        });*/
        //var r = db.get("SELECT id, user_id, name, swimlanes from boards where id = ?", boardId, function(err, row) {
        //    console.log(row);
            //console.log("Got " + rows.length + " board records.");
            //rows.forEach(function(row) {
            //    obj.id = row.id;
            //    obj.user_id = row.user_id;
            //    obj.name = row.name;
            //    obj.swimlanes = row.swimlanes;
        //        console.log("Current object name: " + obj.name);
            //});
        //});
        //console.log(obj);
        //console.log("Current object name: " + obj.name);
        //db.close();
        //res.send(obj);
    };

    function GetDBRecord()
    {


        db.close();


    }
}());
