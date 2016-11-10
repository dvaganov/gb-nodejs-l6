'use strict'

const mysql = require('mysql');

class Db {
    constructor(config) {
        this._pool = mysql.createPool(config);
        this._connections = 0;
    }

    getConnection(callback) {
        this._pool.getConnection((err, connection) => {
            if (err)
                throw err;

            // Add busy connection
            this._connections++;
            callback(connection);
        });
        return this;
    }

    releaseConnection(connection) {
        connection.release();
        this._connections--;

        // If all connections are free during 1000 ms - end pool
        setTimeout(() => {
            if (this._connections === 0) {
                this._pool.end();
            }
        }, 1000);
    }

    query(query, data, callback) {
        this.getConnection((connection) => {
            connection.query(query, data, (err, result) => {
                if (err)
                    throw err;
                if (callback)
                    callback(result);
            });
            this.releaseConnection(connection);
        });
        return this;
    }
}

module.exports = Db;
