const cred = require('../data/credentials.json')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(cred.web.client_id);
require('dotenv').config();
const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
})


// This code block is from official google documentation at https://developers.google.com/identity/sign-in/web/backend-auth
// It verifies that the login token received is legit
exports.verify = async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: cred.web.client_id,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    
    //console.log(ticket)
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    
  }

exports.signup = async function signUp(responsePayload) {  
    const checkUser = await pool.query("SELECT * FROM accounts WHERE email = ?",[responsePayload.email]);
    console.log(checkUser);
    let result = String(checkUser);
    console.log(result);
    if (result == "") {

        await pool.query("INSERT INTO accounts (first_name, email, last_name, token) VALUES (?,?,?,?)", [responsePayload.given_name, responsePayload.email, responsePayload.family_name, responsePayload.jti]);

    }
    else {
        await pool.execute("UPDATE accounts SET token = ? WHERE email = ?", [responsePayload.jti, responsePayload.email])
    }
    const checkID = await pool.query("SELECT * FROM accounts WHERE email = ?", [responsePayload.email])
    return await checkID[0].uid
}
  
exports.checkLogin = async function checkLogin(requestSession) {
    
    try{
        await pool.query("SELECT * FROM accounts WHERE email = ? AND uid = ?", [requestSession.userEmail, requestSession.userID])
        let foundUser = true;
        return foundUser;
    }

    catch (error) {
        let foundUser = false;
        return foundUser;
    }
}