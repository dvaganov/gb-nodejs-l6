'use strict'

const Query = require('./core/query.js')

class Note {
    constructor(fields) {
        if (fields) {
            for (let key in fields) {
                this[key] = fields[key];
            }
        }
    }

    delete(callback) {
        Note.query.delete({id: this.id}, callback);
        return this;
    }

    update(callback) {
        Note.query.update(this, {id: this.id}, callback);
        return this;
    }

    save(callback) {
        Note.query.create(this, callback);
        return this;
    }

    static init(db) {
        Note.query = new Query(db, 'todos');
    }

    static findAll(callback) {
        Note.query.read(null, null, (result) => {
            let notes = [];

            for (let i in result) {
                notes.push(new Note(result[i]));
            }

            callback(notes);
        });
    }

    static findOne(id, callback) {
        Note.query.read(null, {id: id}, (result) => {
            if (result.length === 1) {
                callback(new Note(result[0]));
            }
        });
    }
}

module.exports = Note;
