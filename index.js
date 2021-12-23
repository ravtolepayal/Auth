//server.js
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const routes = require('./routes.js');
const config = require('./config')


// At the top of your server.js
process.env.PWD = process.cwd()

// Then
app.use(express.static(process.env.PWD + '/img'));
//css
app.use(express.static(__dirname + '/'));

app.set('view engine', 'ejs');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));


const port = process.env.PORT || 8000;
app.listen(port, () => console.log('App listening on port ' + port));


/*PASSPORT SETUP*/
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});



/*  Google AUTH  */
 

const GOOGLE_CLIENT_ID = '48441328375-cric918ut299rqf3qehckm8rana2rbpp.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    userProfile=profile;
    return done(null, userProfile);
}
));

app.get('/', function (req, res) {
  res.render('pages/auth.ejs');
});

app.get('/auth/google', 
passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/callback', 
passport.authenticate('google', { failureRedirect: '/error' }),
function(req, res) {
  // Successful authentication, redirect success.
  res.redirect('/success');
});

/*facebook auth*/

passport.use(new FacebookStrategy({
  clientID: config.facebookAuth.clientID,
  clientSecret: config.facebookAuth.clientSecret,
  callbackURL: config.facebookAuth.callbackURL
}, function (accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));

app.use('/', routes);


