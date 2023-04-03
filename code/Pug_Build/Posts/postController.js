require('dotenv').config();
const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
})
const Post = require('./post')

const postTableOperations = {

    create: async (post) => {
        const newPost = {
            caption: post.caption,
            created: new Date().toUTCString(),
            uid: post.uid,
        };

        await pool.execute("INSERT INTO posts (caption, uid, created) VALUES (?, ?, ?)", [newPost.caption, newPost.uid, newPost.created]);
    },
    findAll: async () => await pool.query("SELECT * FROM posts"),
    findByID: async (pid) => await pool.query("SELECT * FROM posts WHERE pid = ?", [pid]),
    update: async (post) => await pool.query("UPDATE posts SET caption = ?, updated = ?, edited = ? WHERE pid = ?", [post.caption, new Date().toDateString(), 1, post.pid]),
    delete: async (pid) => {
        await pool.query("DELETE FROM comments WHERE EXISTS (SELECT * FROM comments WHERE pid = ?)", [pid]) 
        await pool.query("DELETE FROM posts WHERE pid = ?", [pid])
    },
    
}

/*
exports.showPosts = async function(req, res, next){
    const allPosts = await findAllPosts();
    console.log(allPosts);
    res.render('home_logged_in',{title: 'Posts', posts: allPosts})
}

exports.createPostPost = async function(req, res, next){
    console.log(req);
    console.log(res);
    const newPost = new Post('', req.body.caption, Date(), "email");
    await createPost(newPost);
    res.redirect(`/home/profile`)
}


async function createPost (posts) {
    conn = await pool.getConnection();
    const statement = await conn.prepare("INSERT INTO posts (caption, date, email) VALUES (?, ?, ?)");
    const createdPost = await statement.execute([posts.caption, posts.date, posts.email]);
    //console.log(createdPost);
   // console.log(`Post with ID ${createdPost.lastInsertRowid} has been created`);
}
*/

module.exports = postTableOperations;