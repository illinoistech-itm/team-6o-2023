const databaseController = require('./postDatabaseController')
const Post = require('./post')

exports.showPosts = function(req, res, next){
    const allPosts = databaseController.findAll();
    res.render('home_logged_in',{title:'Posts', posts:allPosts})
}

