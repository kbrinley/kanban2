/*global exports*/
(function () {
    "use strict";

    /*
     * GET angular test page
     */
    exports.angular = function (req, res) {
        res.render('angular', { title: 'Angular Test' });
    };
    exports.ng = function (req, res) {
        res.render('ng', { title: 'Angular/Node Test' });
    };
}());
