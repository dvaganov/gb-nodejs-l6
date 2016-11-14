'use strict'

const Query = require('../core/query.js')

let tableName = 'Notes';
let query = new Query(tableName);

class Note {
    constructor(fields) {
        if (fields) {
            for (let key in fields) {
                this[key] = fields[key];
            }
        }
        return this;
    }

    isAuthor(id) {
        return this.userID === id;
    }

    delete(callback) {
        query.delete({id: this.id}, callback);
        return this;
    }

    update(callback) {
        let data = {
            title: this.title,
            content: this.content,
            userID: this.userID
        };

        query.update(data, {id: this.id}, callback);
        return this;
    }

    save(callback) {
        query.create(this, callback);
        return this;
    }

    static findAll(callback) {
        let params = {
            join: {
                table: 'Users',
                columns: ['name', 'name'],
                condition: ['userID', 'Users.id']
            }
        };

        query.read(params, (result) => {
            let notes = [];

            for (let i in result) {
                notes.push(new Note(result[i]));
            }

            callback(notes);
        });
    }

    static findOne(id, callback) {
        let params = {
            join: {
                table: 'Users',
                columns: ['name', 'name'],
                condition: ['userID', 'Users.id']
            },
            condition: [`${tableName}.id`, id]
        };

        query.read(params, (result) => {
            let note = null;

            if (result.length === 1) {
                note = new Note(result[0]);
            }

            callback(note);
        });
    }
}

module.exports = Note;
