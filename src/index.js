//recieve local files
const app = require('./config/server');
require('./app/routes/routes.js')(app);

//start server
app.listen(app.get('port'), () => {
    console.log('server on port: ' + app.get('port'));
});
