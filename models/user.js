'use strict'

const bcrypt = require('bcrypt');
const Query = require('../core/query.js');

// Private fields
let query = new Query('Users');
let saltRounds = 10;

class User {
    static findByID(id, cb) {
        let params = {
            condition: ['id', id]
        };

        query.read(params, (result) => {
            let user = null;

            if (result.length === 1) {
                user = new User(result[0]);
                user.new = false;
            }

            cb(user);
        });
    }

    static findByEmail(email, cb) {
        let params = {
            condition: ['email', email]
        };

        query.read(params, (result) => {
            let user = null;

            if (result.length === 1) {
                user = new User(result[0]);
                user.new = false;
            }

            cb(user);
        });
    }

    static findByAuthKey(authKey, cb) {
        let params = {
            condition: ['authKey', authKey]
        };

        query.read(params, (result) => {
            let user = null;

            if (result.length === 1) {
                user = new User(result[0]);
                user.new = false;
            }

            cb(user);
        });
    }

    constructor(fields) {
        this.new = true;

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

    save(cb) {
        let data = {
            email: this.email,
            name: this.name,
            githubID: this.githubID || null
        }

        if (this.new) {
            bcrypt.hash(this.email + new Date().getTime(), 1, (err, authKey) => {
                if (err)
                    throw err;

                data.hash = this.hash;
                data.authKey = authKey;

                query.create(data, (result) => {
                    if (result)
                        this.id = result.insertId;
                    cb(result);
                });
            });
        } else {
            query.update(data, {id: this.id}, cb);
        }

        return this;
    }
}

module.exports = User;
