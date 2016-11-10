'use strict'

class Query {
    constructor(db, tableName) {
        this.db = db;
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

    read(columns, condition, callback) {
        let data = [],
            sql = 'SELECT ';

        if (columns) {
            sql += '??';
            data.push(columns);
        } else {
            sql += '*'
        }

        sql += ' FROM ??'
        data.push(this.tableName);

        if (condition) {
            sql += ' WHERE ?';
            data.push(condition);
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
