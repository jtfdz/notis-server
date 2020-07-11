var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var logger = require('morgan');
var session = require('express-session');
var expressValidator = require('express-validator');

var mainRouter = require('./routes/main');
let usuario = require('./models/usuario');

var app = express();



app.use(logger('dev')); //  formato_ Concise output colored by response status for development use.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secrettexthere',
  saveUninitialized: true,
  resave: true,
  cookie: {
    secure: false,
    maxAge: 3600000
  }
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(require('./models/strategy'))

passport.serializeUser(function(user, done){
    done(null, {id_usuario: user.id_usuario})
})

passport.deserializeUser(function(serializedUser,done){
    usuario.getUserById(serializedUser.id_usuario).then((user) => {
        done(null, user);
    })
})

app.use('/', mainRouter);


module.exports = app;

