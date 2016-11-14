'use strict'

const express = require('express');

const passport = require('./passport.js');
const Note = require('./models/note.js');

let notes = express();

notes.route('/')
    .all((req, res) => {
        Note.findAll((notes) => {
            res.locals.notes = notes;
            res.render('index');
        })
    });

notes.route('/add')
    .all(passport.mustBeAuth)
    .post((req, res) => {
        let note = new Note({
            title: req.body.title,
            content: req.body.content,
            userID: req.session.user.id
        });

        note.save(() => {
            res.redirect('/');
        });
    })
    .all((req, res) => {
        res.render('notes/form-add');
    });

notes.route('/edit/:id')
    .all(passport.mustBeAuth)
    .all((req, res, next) => {
        Note.findOne(req.params.id, (note) => {
            res.locals.note = note;
            return next();
        });
    })
    .post((req, res, next) => {
        let note = res.locals.note;

        if (!note) {
            res.status(400);
            res.locals.err = 'Note is not fond.';
            return next();
        } else if (note.userID !== req.user.id) {
            res.status(403);
            res.locals.err = 'You are not the author.'
            return next();
        } else {
            note.title = req.body.title;
            note.content = req.body.content;
            note.update(() => {
                res.redirect('/');
            });
        }
    })
    .all((req, res) => {
        res.render('notes/form-edit');
    });

notes.all('/delete/:id',
    passport.mustBeAuth,
    (req, res) => {
        Note.findOne(req.params.id, (note) => {
            if (!note) {
                res.status(400).redirect('/');
            } else if (note.userID !== req.session.user) {
                res.status(403).redirect('/');
            } else {
                note.delete(() => {
                    res.redirect('/');
                });
            }
        });
});

module.exports = notes;
