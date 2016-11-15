
'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');

const config = require('./config.js');

// Setup DataBase
const db = require('./core/database.js');
db.init(config.db);

// Import passport
const passport = require('./passport.js');

// Create and setup application
let app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

// Import routes (! db must be setup first)
let auth = require('./routes/auth.js');
let notes = require('./routes/notes.js');

// Include parsers
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Enable session
app.use(session({
    name: 'session',
    keys: ['secret']
}));

// Enable passport (! session must be load first)
app.use(passport.initialize());
app.use(passport.session());

// Restore user by 'save me' option
app.use((req, res, next) => {
    let authKey = req.cookies.authKey;

    if (!req.user && authKey) {
        auth.restoreUser(authKey, req.session, next);
    } else {
        next();
    }
});

// Put user to templates
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
app.listen(config.server.port, config.server.hostname, () => {
    console.log(`Start server at http://${config.server.hostname}:${config.server.port}`);
});
