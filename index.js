//adding express to my app
var express = require('express')
var app = express()
//connecting to mysql
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2024Mysql',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});


// Home page
app.get('/', (req, res) => {
    // title with my G number and links to pages 
    res.send(`
        <h1>G00419319@atu.ie</h1>
        <br>
        <a href='/students'>Students</a><br>
        <a href='/grades'>Grades</a><br>
        <a href='/lecturers'>Lecturers</a>
    `);
});

//get app to listen on port 3004
app.listen(3004, () => {
    console.log("Application listening on port 3004")
})


