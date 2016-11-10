let mysql = require('mysql');
let config = require('./config.js');

let pool = mysql.createPool(config);
pool.getConnection((err, connection) => {
    if (err)
        throw err;
});

function inserRow(connection, table, data) {
    let sql = `INSERT INTO ${connection.escapeId(table)} SET ?`;
    connection.query(sql, data, (err) => {
        throw err;
    });
}
