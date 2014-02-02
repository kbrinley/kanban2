
/*
 * GET kanban board.
 */

exports.board = function(req, res){
  res.render('board', { title: 'Express' });
};
