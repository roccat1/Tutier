const passport = require("passport");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;

const app = require("../../config/server");
const dbConnection = require('../../config/dbConnections');
const connection = dbConnection();

var user, dbUsername;

passport.use(new PassportLocal(function(username, password, done){
    //done(err,user,options)
    connection.query('SELECT * FROM users', (err, result) => {
        var i=0;
        dbUsername = result[i];
        while (dbUsername != undefined) {
            if (username == result[i].email && password == result[i].password) {
                console.log("you are")
                user = {
                    email: result[i].email,
                    username: result[i].username,
                    password: result[i].password
                }
                return done(null,{id: i});
            }
            i++;
            dbUsername = result[i];
    }
    return done(null, false);
    });
}));

passport.serializeUser(function(user,done){
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    done(null, {id: 0, name: "admin"});
});

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.redirect('/home');
    });

    app.get('/home', (req, res) => {
        connection.query('SELECT * FROM tuiter', (err, result) => {
            res.render('index', {
                title: 'tuiter 4 real',
                dbTuiter: result
            });
        });
    });

    //post view
    app.get('/post', (req, res) => {
        res.render('post', {
            title: "post",
        });
    });
    //post post
    app.post('/post', (req, res) => {
        const {UserName, UserId, TuitDate, TuitType, Content, Likes, Rts, Comments} = req.body;
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

    //login view
    app.get("/login",(req, res)=>{
        res.render("login", {
            title: "login"
        });
    });
    //login post
    app.post("/login", passport.authenticate('local',{
        successRedirect: "/profile",
        failureRedirect: "/login"
    }));

    app.get("/register",(req, res)=>{
        res.redirect('/login');
    });
    app.post('/register', (req, res) => {
        var {at, username, password} = req.body;
        at = "@"+at;
        connection.query('INSERT INTO users SET?', {
            username: at,
            email: username,
            password
        }, (err, result) => {
            res.redirect('/profile');
            console.log("failed on posting");
        });
    });

    app.get('/logout', function(req, res, next) {
        if (req.session) {
            req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/login');
            }
            });
        }
    });

    app.get("/profile", (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect("/login");
    }, (req, res) => {
        console.log();
        res.render('profile', {
            title: "profile",
            user
        });
    });
}
