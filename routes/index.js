/*global exports*/
(function () {
    "use strict";

    /*
     * GET home page.
     */
    exports.index = function (req, res) {
        res.render('index', { title: 'Express',
                            userObj: {  name: 'Kevin',
                                        email: 'kbrinley@gmail.com',
                                        age: 30,
                                        title: 'Scrum Master'}
                          });
    };

    exports.partials = function(req, res){
      var filename = req.params.name;
      if(!filename) return;
      res.render("partials/" + filename);
    };
    
    exports.tests = function (req, res) {
        res.render('tests', { title: 'QUnit Tests' });
    };

}());
