const models = require('../db/models/index');
const passport = require('./auth/local');
const authHelpers = require('./auth/auth-helpers');
const jwt = require('jsonwebtoken');
const fs = require('fs');

let guestbook = {
  newMessage: (obj, uid, cb) => {
    if ((!!obj) && (obj.constructor === Object)) {
      if (obj.file) {
        let imageUid = authHelpers.generateUID();
        console.log(imageUid);
        var fileName = __dirname + '/fs/uploads/' + imageUid + '-' + uid + '.' + obj.file.ext;
        fs.writeFile(fileName, obj.file.buffer, function(err, data) {
          if (err) {
            return console.log(err);
          }
          obj.file.files['0'].owner = uid;
          image.logImage(imageUid, fileName, obj.file.files['0'], (data) => {
            models.Guestbook.create({
              uid: authHelpers.generateUID(),
              message: obj.message,
              userUid: uid,
              imageUid: data.dataValues.uid
            }).then((data) => {
              if (cb !== undefined) {
                cb(data);
              }
            });
          });
        });
      } else {
        models.Guestbook.create({
          uid: authHelpers.generateUID(),
          message: obj.message,
          userUid: uid,
        }).then((data) => {
          console.log('REPEAT!!!!!');
          if (cb !== undefined) {
            cb(data);
          }
        });
      }
    }
  },
  getMessages: (req, res, next) => {
    if (next === undefined) {
      models.Guestbook.findAll({
        include: [
          { model: models.Users, required: true, attributes: ['firstname', 'lastname', 'email'] },
          { model: models.Images, attributes: ['uid', 'path'] }
        ],
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

let image = {
  logImage: (uid, path, obj, cb) => {
    models.Images.create({
      uid: uid,
      path: path,
      type: obj.type,
      size: obj.size,
      userUid: obj.owner
    }).then((data) => {
      if (cb && typeof cb === "function") {
        cb(data)
      }
    })
  }
}

module.exports = {
  guestbook,
  image
};
