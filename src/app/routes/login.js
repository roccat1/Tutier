const passport = require("passport");
const app = require("../../config/server");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;

//app.use(express.urlencoded({ extended: true }));

//si falla posa a server de config
passport.use(new PassportLocal(function(username, password, done){
    //done(err,user,options)
    if(username === "admin@admin.admin" && password === "admin"){
        return done(null,{id:0, name:"admin"});
    }
    done(null, false);
}));

//serialize name,... => id
//deserialize id=>name,...

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    done(null, {id: 0, name: "admin"});
});

module.exports = (app) => {
    app.get("/login",(req, res)=>{
        res.render("login", {
            title: "login"
        });
    });

    app.post("/login", passport.authenticate('local',{
        successRedirect: "/profile",
        failureRedirect: "/login"
    }));
}