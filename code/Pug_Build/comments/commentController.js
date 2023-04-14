require('dotenv').config();
const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
})

const commentTableOperations = {

    create: async (comment) => {
        const newComment = {
            comment: comment.comment,
            date: new Date().toUTCString(),
            uid: comment.uid,
            pid: comment.pid,
        };
        await pool.execute("INSERT INTO comments (comment, uid, date, pid) VALUES (?, ?, ?, ?)", [newComment.comment, newComment.uid, newComment.date, newComment.pid]);
    },
    findAll: async () => await pool.query("SELECT * FROM comments"),
    findByPID: async (pid) => await pool.query("SELECT * FROM comments WHERE pid = ?", [pid]),
    findByUID: async (uid) => await pool.query("SELECT * FROM comments WHERE uid = ?", [uid]),
    findByCID: async (cid) => await pool.query("SELECT * FROM comments WHERE cid = ?", [cid]),
    update: async (comment) => await pool.query("UPDATE comments SET comment = ?, updated = ?, edited = ? WHERE pid = ?", [comment.comment, new Date().toDateString(), 1, comment.pid]),
    delete: async (cid) => {
        await pool.query("DELETE FROM comments WHERE cid = ?", [cid])
    },
    
}

module.exports = commentTableOperations;