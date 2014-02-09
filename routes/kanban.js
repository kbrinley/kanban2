/*global exports*/
(function () {
    "use strict";
    /*
     * GET kanban board.
     */

    exports.board = function (req, res) {
        res.render('board', { title: 'Express' });
    };
}());
