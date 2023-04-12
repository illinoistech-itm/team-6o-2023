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
    createWithImage:async (post) => {
        const newPost = {
            caption: post.caption,
            created: new Date().toUTCString(),
            uid: post.uid,
            image: post.image,
        };

        await pool.execute("INSERT INTO posts (caption, uid, created, image) VALUES (?, ?, ?, ?)", [newPost.caption, newPost.uid, newPost.created, newPost.image]);

    },
    findAll: async () => await pool.query("SELECT * FROM posts"),
    findByID: async (pid) => await pool.query("SELECT * FROM posts WHERE pid = ?", [pid]),
    findByUID: async (uid) => await pool.query("SELECT * FROM posts WHERE uid = ?", [uid]),
    update: async (post) => await pool.query("UPDATE posts SET caption = ?, updated = ?, edited = ? WHERE pid = ?", [post.caption, new Date().toDateString(), 1, post.pid]),
    delete: async (pid) => {
        await pool.query("DELETE FROM comments WHERE EXISTS (SELECT * FROM comments WHERE pid = ?)", [pid]) 
        await pool.query("DELETE FROM posts WHERE pid = ?", [pid])
    },
    
}

module.exports = postTableOperations;