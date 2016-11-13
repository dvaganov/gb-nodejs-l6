'use strict'

// Import app modules
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');

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
let urlEncodedParser = bodyParser.urlencoded({extended: false});

// Setup middlewares
app.use(express.static(__dirname + '/public'));
app.use(session({
    name: 'session',
    keys: ['secret']
}));
app.use(AuthController.restore);
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Setup routes
app.get('/', NoteController.listAll);

app.route('/notes/add')
    .all(AuthController.mustBeAuth)
    .get(NoteController.new)
    .post(urlEncodedParser, NoteController.add);

app.route('/notes/edit/:id')
    .all(AuthController.mustBeAuth)
    .get(NoteController.edit)
    .post(urlEncodedParser, NoteController.update);

app.route('/notes/delete/:id')
    .all(AuthController.mustBeAuth)
    .get(NoteController.delete);

app.route('/users/signup')
    .get(AuthController.signup)
    .post(urlEncodedParser, AuthController.add);

app.route('/users/signin')
    .get(AuthController.signin)
    .post(urlEncodedParser, AuthController.verify);

app.route('/users/signout')
    .all(AuthController.mustBeAuth)
    .get(AuthController.signout);

// Run server
app.listen(PORT, () => {
    console.log('Start server at http://localhost:' + PORT);
});
