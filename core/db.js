'use strict'

const mysql = require('mysql');

class Db {
    constructor(config) {
        this._pool = mysql.createPool(config);
    }

    getConnection(callback) {
        this._pool.getConnection((err, connection) => {
            if (err)
                throw err;

            callback(connection);
        });
        return this;
    }

    query(query, data, callback) {
        this.getConnection((connection) => {
            connection.query(query, data, (err, result) => {
                if (err)
                    throw err;

                if (callback)
                    callback(result);
            });
            connection.release();
        });
        return this;
    }
}

module.exports = Db;
