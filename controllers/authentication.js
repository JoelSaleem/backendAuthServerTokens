const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  // sub = subject, who is this about
  // iat = issued at time
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // user has already had email and password authenticated
  // give them a token
  res.send({ token: tokenForUser(req.user) });

  // note: (user is assigned to req.user by passport when we call done(null, user))
}

exports.signup = function(req, res, next) {
  // See if a user with a given email exists
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return(res.status(422).send({ error: 'you must provide an email and password' }));
  }

  // If a user with the given email does exist, return an console.error
  User.findOne({ email: email }, function(error, existingUser) {
    if (err) return next(err);

    // If user already exists, send response — unprocessible data
    if (existingUser) {
      return res.status(422).send({ error: 'email already in use' });
    }

  // If new email, create and save a new user record
  const user = new User({ email: email, password: password });

  user.save(function(error) {
    if (error) { return next(error) };

    //respond to request, indicating a new user was created
    res.json({ token: tokenForUser(user) });
  });
});
}
