/*global exports*/
(function () {
    "use strict";

    /**  GET: /kanban  **/
    exports.board = function (req, res) {
        res.render('board', { title: 'Express' });
    };

    /**  GET: /boards/:id  **/
    exports.getBoard = function(req, res) {
        var sqlite = require('sqlite3');
        var db = new sqlite.Database('kanban');

        var boardId = req.params.id;
        var obj = {};
        db.get("SELECT id, user_id, name, swimlanes from boards where id = ?", boardId, function(err, row) {
            console.log("Got row: " + row);
            if (err) throw err;
            if (row) obj = row;
            db.close();
            res.send(obj);
        });
    };
}());
