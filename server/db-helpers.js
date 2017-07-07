const models = require('../db/models/index');
const passport = require('./auth/local');
const authHelpers = require('./auth/auth-helpers');
const jwt = require('jsonwebtoken');

let guestbook = {
  newMessage: (msg, uid, cb) => {
    models.Guestbook.create({
      uid: authHelpers.generateUID(),
      message: msg,
      user_uid: uid
    }).then((data) => {
      if (cb !== undefined) {
        cb(data);
      }
    })
  },
  getMessages: (req, res, next) => {
    if (next === undefined) {
      models.Guestbook.findAll({
        order: [
          ['createdAt', 'DESC']
        ]
      }).then((obj) => {
        req(obj)
      });
    } else {
      models.Guestbook.findAll({
        order: [
          ['createdAt', 'DESC']
        ]
      }).then((msgs) => {
        req.msgs = msgs;
        return next();
      });
    }
  }
};

module.exports = {
  guestbook
};
