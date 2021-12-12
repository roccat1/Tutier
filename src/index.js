//recieve local files
const app = require('./config/server');
require('./app/routes/post.js')(app);
require('./app/routes/tuiter.js')(app);
require('./app/routes/login.js')(app);
require('./app/routes/profile.js')(app);

//start server
app.listen(app.get('port'), () => {
    console.log('server on port: ' + app.get('port'));
});
