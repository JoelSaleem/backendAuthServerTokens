const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// Use jwt auth and don't create a cookie session (since we're using tokens)
const requireAuth = passport.authenticate('jwt', { session: false });

// Use local auth
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  // send them through requireAuth first, then if that's successful,
  // run them through callback
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there '});
  })

  app.post('/signin', requireSignin, Authentication.signin)

  app.post('/signup', Authentication.signup);
}
