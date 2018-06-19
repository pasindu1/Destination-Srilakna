var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs  = require('express-handlebars');
var passport =require('passport');
var flash = require('connect-flash');
var expressValidator =require('express-validator');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);
var bcrypt = require('bcrypt');
var moment = require('moment');

// var flash = require('express-flash');




var index = require('./routes/index');
var users = require('./routes/users');
var vehicle = require('./routes/vehicle');
var tourist = require('./routes/tourist');
var vendor = require('./routes/vendor');
var app = express();


// view engine setup
app.engine('hbs', hbs({extname:'hbs',defaultLayout: 'layout',layoutsDir:__dirname+'/views/layouts/',helpers: require('./config/handlebars-helpers')}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//file upload settings



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

//flash
// app.use('flash');
// app.use(function(req,res,next){
//   res.locals.messages = require('express-messages')(req,res);
//   next();
// });

//storage sessions in database
var options = {
  host:"localhost",
  user:"root",
  password:"",
  database:"desSrilanka"
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret:'max',
  saveUninitialized:false,
  store:sessionStore,
  resave:false

}));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//passport initialise
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/vehicle', vehicle);
app.use('/tourist',tourist);
app.use('/vendor',vendor);

passport.use(new LocalStrategy(
  function(username, password, done) {
      console.log(username);
      console.log(password);
      const db = require('./config/connection');
      db.query("SELECT id,password FROM users WHERE email= ?",[username],function(err,results,fields){
        if(err) {done(err)};
        if(results.length === 0){
          return done(null, false);
        }
        // var active = results[0]["active"];
        // if(!active){
        //   return done(null,false);
        // }
        const hash = results[0].password;

        bcrypt.hash('password', 10, function(err, hash){
          if (err) { throw (err); }
          // console.log(hash);
          bcrypt.compare('password', hash, function(err, response) {
            if(response === true){
              return done(null,{user_id :results[0].id,role_id:results[0].role_id});
            }else{
              return done(null,false);
            }

          });
        });


      })

    }
  ));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// app.use(flash());
// //error handler
// app.use(function (req, res, next) {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   res.locals.user = req.user || null;
//   next();
// });

module.exports = app;
