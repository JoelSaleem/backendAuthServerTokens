// In this app, 2 ways to login
/*
  1. Username and password (local-strategy)
  2. They have previously been authed and therefore we can just
     use a previously issued token (jwt-strategy)
*/

const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
// JWT verifies the token we give the user
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Local strategy verifies an email / password
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {

  // verify email and password, call done with email and password if correct
  // call done with false if incorrect
  // note: this is asynchronous, so we need to supply a callback
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // compare password given (plain text) to the
    // stored password (user.password — salted and hashed)
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);

    })

  })

});

// Setup options for jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create jwt Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // payload = decoded jwt token

  // See if user id in payload exists in our db — if yes, call done with user
  // otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false) };

    if (user) {
      return done(null, user);
    } else {
      // no user found, don't authenticate
      return done(null, false);
    }
  });
})

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
