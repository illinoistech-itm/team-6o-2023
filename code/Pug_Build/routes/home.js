
var express = require('express');
var router = express.Router();
const decoder = require ('jwt-decode')
const connector = require ('../conn.js')
require('dotenv').config();
const mariadb = require("mariadb");
const postController = require('../Posts/postController')
const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
})

let idValue;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Hawkstagram'});
});

router.post('/', function(req, res, next) {

  const map = JSON.parse(JSON.stringify(req.body));
  const key = Object.keys(map);
  
  const responsePayload = decoder(key.toString());
  idValue = responsePayload.sub;
  /*console.log("ID: " + responsePayload.sub);
  console.log('Full Name: ' + responsePayload.name);
  console.log('Given Name: ' + responsePayload.given_name);
  console.log('Family Name: ' + responsePayload.family_name);
  console.log("Image URL: " + responsePayload.picture);
  console.log("Email: " + responsePayload.email);
  */
  signUp(responsePayload)
  global.email = responsePayload.email;
  res.redirect('/home/' + responsePayload.sub);
});
router.get('/:id', async function(req, res, next){
  const allPosts = await findAllPosts();
  console.log(allPosts);
  res.render('home_logged_in',{title: 'Posts', posts: allPosts})
})
router.post('/:id', async function(req, res, next){
  console.log(req);
  const newPost = new Post('', req.body.caption, Date(), global.email);
  await createPost(newPost);
  res.redirect(`/home/feed`)
});

async function signUp(responsePayload) {
  try {
      
      conn = await pool.getConnection();
      const test = await conn.query("SELECT * FROM accounts WHERE email = ?",[responsePayload.email]);
      console.log(test);
      let result= String(test);
      console.log(result);
      if (result == "") {

      const loginAUTH = await conn.query("INSERT INTO accounts (first_name, email, last_name) VALUES (?,?,?)", [responsePayload.given_name, responsePayload.email, responsePayload.family_name]);
      console.log(loginAUTH);
      }
  
} catch (err) {
  throw err;
} finally {
  if (conn) return conn.end();
}
}

const Post = require('../Posts/post')


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

async function createPost (posts) {
    conn = await pool.getConnection();
    const statement = await conn.prepare("INSERT INTO posts (caption, date, email) VALUES (?, ?, ?)");
    const createdPost = await statement.execute([posts.caption, posts.date, posts.email]);
    //console.log(createdPost);
   // console.log(`Post with ID ${createdPost.lastInsertRowid} has been created`);
}

module.exports = router;