const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const init = require('./passport');
const models = require('../../db/models/index');
const authHelpers = require('./auth-helpers');

const options = {
  usernameField: 'email',
  passwordField: 'password',
  session: false
};

init();

passport.use(new LocalStrategy(options, (email, password, done) => {
  // check to see if the email exists
  models.Users.findOne({
    where: {
      email: email
    }
  }).then((user) => {
    if (!user || !authHelpers.comparePass(password, user.dataValues.password)) {
      return done(null, false, 'Incorrect email/password');
    } else {
      return done(null, user.dataValues);
    }
  }).catch((err) => {
    return done(err);
  });
}));

module.exports = passport;
