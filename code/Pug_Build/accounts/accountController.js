require('dotenv').config();
const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
})

const accountTableOperations = {

    findByID: async (uid) => await pool.query("SELECT * FROM accounts WHERE uid = ?", [uid]),
    /*
    create: async (post) => {
        const newPost = {
           caption: post.caption,
            created: new Date().toUTCString(),
            uid: post.uid,
        };
        
        await pool.execute("INSERT INTO posts (caption, uid, created) VALUES (?, ?, ?)", [newPost.caption, newPost.uid, newPost.created]);
    },
    findAll: async () => await pool.query("SELECT * FROM posts"),

    update: async (post) => await pool.query("UPDATE posts SET caption = ?, updated = ?, edited = ? WHERE pid = ?", [post.caption, new Date().toDateString(), 1, post.pid]),
    delete: async (pid) => {
        await pool.query("DELETE FROM comments WHERE EXISTS (SELECT * FROM comments WHERE pid = ?)", [pid]) 
        await pool.query("DELETE FROM posts WHERE pid = ?", [pid])
    },
    */
}

module.exports = accountTableOperations;