require('dotenv').config();
const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
})
const Post = require('./Post')

const postDatabase = {
    findAll: () => {
        const statement = pool.query("SELECT * FROM posts");
        const rows = statement;
        let posts = [];
        rows.forEach((row) => {
            const post = new Post(row.pid, row.caption, row.date, row.email);
            posts.push(post);
        });
        return posts;
    },
    create: (posts) => {
        const statement = pool.prepare("INSERT INTO posts (caption, date, email) VALUES (?, ?, ?)");
        const createdPost = statement.execute(posts.caption, posts.date, posts.email);
        console.log(`Post with ID ${createdPost.lastInsertRowid} has been created`);
    },
};

module.exports = postDatabase;