const mysql = require('mysql')

const fs = require('fs');
const path = require('path');

let DBPassword = fs.readFileSync(path.join(__dirname, '../DBPassword.txt'), 'utf-8');

module.exports = () => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: DBPassword,
        database: 'tuiter_db'
    });
}