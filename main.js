'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');

// Setup DataBase
require('./core/database.js').init(require('./config.js'));
const passport = require('./passport.js');

const PORT = 8888;
let app = express();

// Setup Application
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// Routes
let auth = require('./auth.js');
let notes = require('./notes.js');

// Setup middlewares
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Enable session
app.use(session({
    name: 'session',
    keys: ['secret']
}));

// Enable passport
app.use(passport.initialize());
app.use(passport.session());

// Restore user
app.use((req, res, next) => {
    let authKey = req.cookies.authKey;

    if (!req.user && authKey) {
        auth.restoreUser(authKey, req.session, next);
    } else {
        next();
    }
});
app.use((req, res, next) => {
    req.user = req.user || req.session.user || {id: 0};
    res.locals.user = req.user;
    return next();
});

// Setup routes
app.get('/', (req, res, next) => {
    res.redirect('/notes');
});
app.use('/auth', auth);
app.use('/notes', notes);

// Run server
app.listen(PORT, () => {
    console.log('Start server at http://localhost:' + PORT);
});
