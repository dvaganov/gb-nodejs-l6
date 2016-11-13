'use strict'

const DataBase = require('./database');

class Query {
    constructor(tableName) {
        this.db = new DataBase();
        this.tableName = tableName;
    }

    create(data, callback) {
        let sql = 'INSERT INTO ?? SET ?';
        this.db.query(sql, [this.tableName, data], callback);
        return this;
    }

    update(data, condition, callback) {
        let sql = 'UPDATE ?? SET ? WHERE ?';
        this.db.query(sql, [this.tableName, data, condition], callback);
        return this;
    }

    read(params, callback) {
        let data = [],
            sql = 'SELECT ';

        params = params || {};

        if (params.columns) {
            sql += '??';
            data.push(params.columns);
        } else {
            sql += `${this.tableName}.*`
        }

        if (params.join && params.join.columns) {
            sql += ', ??';
            data.push(params.join.columns);
        }

        sql += ' FROM ??'
        data.push(this.tableName);

        if (params.join) {
            sql += ' JOIN ?? ON ?? = ??';
            data.push(params.join.table);
            data.push.apply(data, params.join.condition);
        }

        if (params.condition) {
            sql += ' WHERE ?? = ?';
            data.push.apply(data, params.condition);
        }

        if (params.limit) {
            sql += ' LIMIT ?';
            data.push(params.limit);
        }

        this.db.query(sql, data, callback);
        return this;
    }

    delete(condition, callback) {
        let sql = 'DELETE FROM ?? WHERE ?';
        this.db.query(sql, [this.tableName, condition], callback);
        return this;
    }
}

module.exports = Query;
