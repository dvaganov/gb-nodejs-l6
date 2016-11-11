'use strict'

const express = require('express'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    Db = require('./core/db'),
    Note = require('./note.js');

// Setup parser
let urlEncodedParser = bodyParser.urlencoded({extended: false});

// Setup DataBase and model
let db = new Db(config);
Note.init(db);

// Setup Application
const PORT = 8888;
const app = express();
app.set('views', './views');
app.set('view engine', 'pug');

// Setup middlewares
app.use(express.static(__dirname + '/public'));

// Setup routes
app.get('/', (req, res) => {
    Note.findAll((notes) => {
        res.locals.notes = notes;
        res.render('index');
    })
});

app.route('/add')
    .get((req, res) => {
        res.render('form-add')
    })
    .post(urlEncodedParser, (req, res) => {
        let note = new Note(req.body);
        note.save(() => {
            res.redirect('/');
        });
    });

app.get('/delete/:id', (req, res) => {
    Note.findOne(req.params.id, (note) => {
        note.delete(() => {
            res.redirect('/');
        });
    });
});

app.route('/edit/:id')
    .get((req, res) => {
        Note.findOne(req.params.id, (note) => {
            res.locals.note = note;
            res.render('form-edit');
        });
    })
    .post(urlEncodedParser, (req, res) => {
        Note.findOne(req.params.id, (note) => {
            note.text = req.body.text;
            note.completed = req.body.completed;
            note.update(() => {
                res.redirect('/');
            });
        });
    });

app.listen(PORT, () => {
    console.log('Start server at http://localhost:' + PORT);
});
