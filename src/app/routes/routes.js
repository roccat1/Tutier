const passport = require("passport");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;

const app = require("../../config/server");
const dbConnection = require('../../config/dbConnections');

var user;

//config
passport.use(new PassportLocal(function(username, password, done){
    //done(err,user,options)
    if(username === "admin@admin.admin" && password === "admin"){
        user = {
            username,
            password
        }
        return done(null,{id:0, name:"admin"});
    }
    done(null, false);
}));
passport.serializeUser(function(user,done){
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    done(null, {id: 0, name: "admin"});
});



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
