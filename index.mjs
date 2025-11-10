import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "y5s2h87f6ur56vae.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "zxdwdrca0utxt2wl",
    password: "grgynmlth5usrpac",
    database: "y2dykn5vgsio00j6",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', async (req, res) => {
    let sql = `SELECT authorId, firstName, lastName
               FROM authors
               ORDER BY lastName`;
    const [rows] = await pool.query(sql);
    let sql2 = `SELECT DISTINCT category FROM quotes ORDER BY category`;
    const [cols] = await pool.query(sql2);
   res.render('home.ejs', {rows, cols})
});

app.get('/searchByAuthor', async (req, res) => {
    let authorId = req.query.authorId;
    let sql = `SELECT authorId, firstName, lastName, quote, likes
                FROM authors
                NATURAL JOIN quotes
                WHERE authorId LIKE ?`;
    let sqlParams = [`%${authorId}%`];
    const [rows] = await pool.query(sql, sqlParams);
    // write SQL to retreive quotes based on authorId
   res.render('results.ejs', {rows})
});

app.get('/searchByKeyword', async (req, res) => {
    let keyword = req.query.keyword;
    let sql = `SELECT authorId, firstName, lastName, quote, likes
               FROM authors
               NATURAL JOIN quotes
               WHERE quote LIKE ?`;
    let sqlParams = [`%${keyword}%`];
    const [rows] = await pool.query(sql, sqlParams);
   res.render('results.ejs', {rows})
});

app.get('/searchByCategory', async (req, res) => {
    let category = req.query.category;
    let sql = `SELECT authorId, firstName, lastName, quote, likes
                FROM authors
                NATURAL JOIN quotes
                WHERE category LIKE ?`;
    let sqlParams = [`%${category}%`];
    const [rows] = await pool.query(sql, sqlParams);
    res.render('results.ejs', {rows})
});

app.get('/seaarchBetweenLikes', async (req, res) => {
    let min = req.query.min;
    let max = req.query.max;
    let sql = `SELECT authorId, firstName, lastName, quote, likes
                FROM authors
                NATURAL JOIN quotes 
                WHERE likes BETWEEN ? AND ?`;
    let sqlParams = [min, max];
    const [rows] = await pool.query(sql, sqlParams);
    res.render('results.ejs', {rows})
});

//local API to get all info for a specific author
app.get('/api/authors/:authorId', async (req, res) => {
   let authorId = req.params.authorId;
   let sql = `SELECT *
              FROM authors
              WHERE authorId = ?`;
   const [rows] = await pool.query(sql, [authorId]);
   res.send(rows)
});

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})