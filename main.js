'use strict'

// Import app modules
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');

const passport = require('./passport.js');

// Setup DataBase
require('./core/database.js').init(require('./config.js'));

// Import controllers
const NoteController = require('./controllers/note.js');
const AuthController = require('./controllers/auth.js');

const PORT = 8888;
let app = express();

// Setup Application
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// Setup parser

// Setup middlewares
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));
app.use(session({
    name: 'session',
    keys: ['secret']
}));
app.use(cookieParser());
app.use(AuthController.restore);
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Setup routes
app.get('/', NoteController.listAll);

// app.route('/notes/add')
//     .all(AuthController.mustBeAuth)
//     .get(NoteController.new)
//     .post(urlEncodedParser, NoteController.add);

// app.route('/notes/edit/:id')
//     .all(AuthController.mustBeAuth)
//     .get(NoteController.edit)
//     .post(urlEncodedParser, NoteController.update);

// app.route('/notes/delete/:id')
//     .all(AuthController.mustBeAuth)
//     .get(NoteController.delete);

// app.route('/users/signup')
//     .get(AuthController.signup)
//     .post(urlEncodedParser, AuthController.add);

// app.route('/users/signin')
//     .get(AuthController.signin)
//     .post(urlEncodedParser, AuthController.verify);

// app.route('/users/signout')
//     .all(AuthController.mustBeAuth)
//     .get(AuthController.signout);

app.route('/auth/github')
    .get(passport.authenticate('github'));

app.route('/auth/github/cb')
    .get(
        passport.authenticate('github', {failureRiderect: '/users/signin'}),
        (req, res) => {
            res.redirect('/');
        }
    );

let auth = require('./auth.js');
app.use('/auth', auth);

// Run server
app.listen(PORT, () => {
    console.log('Start server at http://localhost:' + PORT);
});
