const dbConnection = require('../../config/dbConnections');

module.exports = (app) => {
    const connection = dbConnection();

    app.get('/post', (req, res) => {
        res.render('post', {
            title: "post",
        });
    });

    app.post('/post', (req, res) => {
        const {UserName, UserId, TuitDate, TuitType, Content, Likes, Rts, Comments} = req.body;
        console.log(req.body.Comments);
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
/*
        var sql = `INSERT INTO tuiter (UserName, UserId, TuitType, Content, Likes, Rts, Comments) VALUES (${UserName}, ${UserId}, ${TuitType}, ${Content}, ${Likes}, Rts)`;
        connection.query(sql, function (err, result) {
            if (err) throw err;
        console.log("1 record inserted");
        });
        */
        console.log(UserName);
        connection.query('INSERT INTO tuiter SET?', {
            UserName: UserName,
            UserId: UserId,
            TuitType: TuitType,
            Content: Content,
            Likes: parseInt(Likes),
            Rts: parseInt(Rts),
            Comments: parseInt(Comments)
        }, (err, result) => {
            res.redirect('/post');
            console.log("failed on posting");
        });
        
    });
}