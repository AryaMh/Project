var express = require('express');
var dbhandler = require('./db/dbhandler.js');
var crawler = require('./db/crawler');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
require('./config/passport')(passport); //pass passport for configuration

dbhandler.initial();
crawler.initial();
crawler.getCPS();
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(process.cwd()+"/public"));
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());

require('./app/routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/routes/professorRoutes')(app, passport);
require('./app/routes/studentRoutes')(app, passport);

app.listen(3000);
console.log("Listening on port *: 3000");