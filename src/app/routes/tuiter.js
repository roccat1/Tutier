const dbConnection = require('../../config/dbConnections');

module.exports = (app) => {
    const connection = dbConnection();

    app.get('/home', (req, res) => {
        connection.query('SELECT * FROM tuiter', (err, result) => {
            res.render('index', {
                title: 'tuiter 4 real',
                dbTuiter: result
            });
        });
    });
}
