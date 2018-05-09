var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
//var cors = require('cors');

var app = express();
const port = process.env.PORT || 3000;

var dbConfig = require('./config/db.config.js');

mongoose.connect(dbConfig.urlLocal);

mongoose.connection.on('error', (err) => {
  console.log(err);
  process.exit();
});

mongoose.connection.on('open', () => {
  console.log('DB is LIVE');
});

require('./config/passport.js')(passport);

//flash
app.use(flash());

//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//view
app.set('view engine', 'ejs');
app.set(express.static(path.join(__dirname, 'views')));

//session & cookie
app.use(session({
  secret: 'MY_SECRET',
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
  credentials: true
}));
app.use(cookieParser());


//passport config
app.use(passport.initialize());
app.use(passport.session());

//routes
require('./routes/routes.js')(app, passport);

app.listen(port, () => {
  console.log('We are live on ' + port);
});
