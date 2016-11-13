'use strict'

const mysql = require('mysql');

let instance = null;

// Singleton class
class DataBase {
    constructor() {
        this._pool = mysql.createPool(DataBase.config);

        if (!instance) {
            instance = this;
        }

        return instance;
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

    static init(config) {
        DataBase.config = config;
    }
}

module.exports = DataBase;
