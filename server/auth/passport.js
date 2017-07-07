const passport = require('passport');
const models = require('../../db/models/index');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.uid);
  });

  passport.deserializeUser((uid, done) => {
    models.Users.findById(uid).then((user) => {
      done(null, user);
    }).catch((err) => {
      done(err, null);
    });
  });
};
