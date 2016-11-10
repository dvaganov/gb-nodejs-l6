'use strict'

const express = require('express'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    Db = require('./core/db'),
    Note = require('./note.js');

// Setup DataBase
let db = new Db(config);
Note.init(db);

// Setup Application
const PORT = 8888;
const app = express();
app.set('views', './views');
app.set('view engine', 'pug');

// Setup middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

// Setup routes
app.get('/', (req, res) => {
    res.send('Hello!');
});

app.listen(PORT, () => {
    console.log('Start server at http://localhost:' + PORT);
});
