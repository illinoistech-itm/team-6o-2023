require('dotenv').config();
const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
})
const Post = require('./post')

exports.showPosts = async function(req, res, next){
    const allPosts = await findAllPosts();
    console.log(allPosts);
    res.render('home_logged_in',{title: 'Posts', posts: allPosts})
}

async function findAllPosts(){
    const statement = await pool.query("SELECT * FROM posts");
    //console.log(statement);
    const rows = statement;
    let posts = [];
    rows.forEach((row) => {
        const post = new Post(row.pid, row.caption, row.date, row.email);
        posts.push(post);
    });
    //console.log(posts);
    return posts;
}

async function create (posts) {
    const statement = pool.prepare("INSERT INTO posts (caption, date, email) VALUES (?, ?, ?)");
    const createdPost = statement.execute(posts.caption, posts.date, posts.email);
    console.log(`Post with ID ${createdPost.lastInsertRowid} has been created`);
}

