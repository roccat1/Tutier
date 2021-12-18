const passport = require("passport");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;

const app = require("../../config/server");
const dbConnection = require('../../config/dbConnections');
const connection = dbConnection();

var user, dbUsername;
var a = 3;

passport.use(new PassportLocal(function(username, password, done){
    //done(err,user,options)
    connection.query('SELECT * FROM users', (err, result) => {
        var i=0;
        dbUsername = result[i];
        while (dbUsername != undefined) {
            if (username == result[i].email && password == result[i].password) {
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

    app.get("/register",(req, res)=>{
        res.redirect('/login');
    });

    app.get('/home', (req, res) => {
        console.log(req.ip + " /home");
        connection.query('SELECT * FROM mews', (err, result) => {
            result = result.reverse()
            res.render('index', {
                title: 'mewem',
                dbMewem: result
            });
        });
    });

    app.get("/post", (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect("/login");
    }, (req, res) => {
        console.log(req.ip + " /post");
        res.render('post', {
            title: "post",
            user
        });
    });
    //post post
    app.post('/post', (req, res) => {
        const {Content} = req.body;
        console.log(req.ip + ' post "' + Content + '" with username: "' + user.email + '"');
        date = new Date();
        connection.query('INSERT INTO mews SET?', {
            UserName: user.username,
            UserId: user.username,
            MewType: "Post",
            Content: Content,
            Likes: 0,
            Rts: 0,
            Comments: 0,
            Year: date.getFullYear(),
            Month: date.getMonth(),
            Day: date.getDate(),
            Hour: date.getHours(),
            Minute: date.getMinutes()
        }, (err, result) => {
            res.redirect('/post');
        });
    });

    //login view
    app.get("/login",(req, res)=>{
        console.log(req.ip + ' /login');
        res.render("login", {
            title: "login"
        });
    });
    //login post
    app.post("/login", passport.authenticate('local',{
        successRedirect: "/profile",
        failureRedirect: "/login"
    }));

    app.post('/register', (req, res) => {
        var {at, username, password} = req.body;
        console.log(req.ip + ' registering with email: ' + username + 'and name: ' + at);
        at = "@"+at;
        connection.query('INSERT INTO users SET?', {
            username: at,
            email: username,
            password
        }, (err, result) => {
            res.redirect('/profile');
        });
    });

    app.get('/logout', function(req, res, next) {
        if (req.session) {
            console.log(req.ip + ' logged out');
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
        console.log(req.ip + ' /profile with user: ' + user.username);
        res.render('profile', {
            title: "profile",
            user
        });
    });
}
