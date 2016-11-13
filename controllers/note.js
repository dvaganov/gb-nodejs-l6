'use strict'

const Note = require('../models/note.js');

let NoteController = {
    listAll: (req, res) => {
        Note.findAll((notes) => {
            res.locals.notes = notes;
            res.render('index');
        })
    },

    add: (req, res) => {
        let note = new Note({
            title: req.body.title,
            content: req.body.content,
            userID: req.session.user.id
        });

        note.save(() => {
            res.redirect('/');
        });
    },

    new: (req, res) => {
        res.render('form-add');
    },

    delete: (req, res) => {
        Note.findOne(req.params.id, (note) => {
            note.delete(() => {
                res.redirect('/');
            });
        });
    },

    edit: (req, res) => {
        Note.findOne(req.params.id, (note) => {
            res.locals.note = note;
            res.render('form-edit');
        });
    },

    update: (req, res) => {
        Note.findOne(req.params.id, (note) => {
            note.title = req.body.title;
            note.content = req.body.content;
            note.userID = req.session.user.id;

            note.update(() => {
                res.redirect('/');
            });
        });
    }
}

module.exports = NoteController;
