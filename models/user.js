'use strict'

const bcrypt = require('bcrypt');
const Query = require('../core/query.js');

// Private fields
let query = new Query('Users');
let saltRounds = 10;

class User {
    static findByID(id, cb) {
        let params = {
            condition: {id: id}
        };

        query.read(params, (result) => {
            if (result.length === 1)
                cb(new User(result[0]));
            else
                cb(null);
        });
    }

    static findByName(name, cb) {
        let params = {
            condition: {name: name}
        };

        query.read(params, (result) => {
            if (result.length === 1)
                cb(new User(result[0]));
            else
                cb(null);
        });
    }

    static findByAuthKey(authKey, cb) {
        let params = {
            condition: {authKey: authKey}
        };

        query.read(params, (result) => {
            if (result.length === 1)
                cb(new User(result[0]));
            else
                cb(null);
        });
    }

    constructor(fields) {
        this.id = 0;
        this.name = '';
        this.firstName = '';

        if (fields) {
            for (let key in fields) {
                this[key] = fields[key];
            }
        }

        return this;
    }

    setPassword(password, cb) {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err)
                throw err;

            this.hash = hash;
            cb(this);
        });

        return this;
    }

    checkPassword(password, cb) {
        bcrypt.compare(password, this.hash, (err, result) => {
            if (err)
                throw err;

            cb(result);
        });

        return this;
    }

    delete(cb) {
    }

    update(cb) {
    }

    save(cb) {
        bcrypt.hash(this.name + new Date().getTime(), 1, (err, hash) => {
            if (err)
                throw err;

            let data = {
                name: this.name,
                firstName: this.firstName,
                hash: this.hash,
                authKey: hash
            };

            query.create(data, cb);
        });

        return this;
    }
}

module.exports = User;
