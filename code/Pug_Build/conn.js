require('dotenv').config();
const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
})

let conn;
async function asyncFunction() {
    try {
        
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM accounts");
        const res = await conn.query("INSERT INTO accounts (name, email, password) VALUES ('John', 'cool@email.com', 'Smith')");
        console.log(res); //show insert statement
        console.log(rows); //Show values of table rows for accounts tables
    
} catch (err) {
    throw err;
} finally {
    if (conn) return conn.end();
}
}

asyncFunction();