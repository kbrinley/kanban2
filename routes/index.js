
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express',
                        userObj: {  name: 'Kevin',
                                    email: 'kbrinley@gmail.com',
                                    age: 30,
                                    title: 'Scrum Master'}
                      });
};
