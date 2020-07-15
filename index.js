var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var logger = require('morgan');
var mainRouter = require('./routes/main');
let usuario = require('./models/usuario');
var cors = require('cors');
var app = express();

app.use(cors({
  methodS: "GET,PUT,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
  origin: 'http://localhost:8100' //CAMBIAR AL LINK DE HEROKU ETCÉTERA
  }));

app.use(logger('dev')); //  formato_ Concise output colored by response status for development use.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'fajoq0i943wki09tgd',
  saveUninitialized: true,
  resave: true,
  cookie: {
    secure: false,
    maxAge: 993600000
  }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(require('./models/strategy'));

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

