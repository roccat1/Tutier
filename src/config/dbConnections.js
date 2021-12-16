const mysql = require('mysql')

const fs = require('fs');
const path = require('path');

let DBPassword = fs.readFileSync(path.join(__dirname, '../DBPassword.txt'), 'utf-8');

module.exports = () => {
    return mysql.createConnection({
        host: 'btumg0mjsuubeu3sk8e2-mysql.services.clever-cloud.com',
        user: 'urbsqc3vqdmfqarq',
        password: DBPassword,
        database: 'btumg0mjsuubeu3sk8e2'
    });
}