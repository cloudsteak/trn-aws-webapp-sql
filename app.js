const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

require("dotenv").config();

// Using environment variables
const server = process.env.DB_SERVER;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME;
const port = parseInt(process.env.DB_PORT);

// Initialize express app
const app = express();

// MySQL Connection
const pool = mysql.createPool({
    host: server,
    user: user,
    password: password,
    database: database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // For serving static files (CSS, JS, etc.)
app.set('view engine', 'ejs');

// HomePage: List posts
app.get('/', (req, res) => {
    const usersQuery = 'SELECT * FROM users';
    const postsQuery = 'SELECT posts.id, posts.title, posts.content, users.name FROM posts JOIN users ON posts.userId = users.id ORDER BY posts.id DESC';

    pool.query(usersQuery, (error, users) => {
        if (error) {
            return res.status(500).send('Hiba történt a szerzők beolvasásakor');
        }

        pool.query(postsQuery, (error, posts) => {
            if (error) {
                return res.status(500).send('Hiba történt a cikkek beolvasásakor');
            }
            res.render('index', { users, posts });
        });
    });
});

// New Post
app.post('/add-post', (req, res) => {
    const { userId, title, content } = req.body;
    const query = 'INSERT INTO posts (userId, title, content) VALUES (?, ?, ?)';

    pool.query(query, [userId, title, content], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Hiba történt a cikk hozzáadásakor');
        }
        res.redirect('/');
    });
});

// New user: GET
app.get('/add-user', (req, res) => {
    res.render('add-user');
});

// New User: POST
app.post('/add-user', (req, res) => {
    const { name } = req.body;
    const query = 'INSERT INTO users (name) VALUES (?)';

    pool.query(query, [name], (error, results) => {
        if (error) {
            return res.status(500).send('Hiba történt a szerző hozzáadásakor');
        }
        res.redirect('/');
    });
});

module.exports = app;
