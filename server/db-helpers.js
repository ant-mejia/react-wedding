const models = require('../db/models/index');
const passport = require('./auth/local');
const authHelpers = require('./auth/auth-helpers');
const jwt = require('jsonwebtoken');

let guestbook = {
  newMessage: (msg, cb) => {
    models.Guestbook.create({
      uid: authHelpers.generateUID(),
      message: msg
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
          ['created_at', 'DESC']
        ]
      }).then((obj) => {
        req(obj)
      });
    } else {
      models.Guestbook.findAll({
        order: [
          ['created_at', 'DESC']
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
