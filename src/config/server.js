const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');
const passport = require('passport');

const app = express();

let secret = fs.readFileSync(path.join(__dirname, '../secret.txt'), 'utf-8');

//settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../app/views'));

//middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser(secret));
app.use(session({
    secret: secret,
    resave: true,
    saveUninitialized: true,
    signed: true
}));
app.use(passport.initialize());
app.use(passport.session());


module.exports = app;