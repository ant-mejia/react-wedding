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
          image.newImage(imageUid, fileName, obj.file.files['0'], obj.file.buffer, (data) => {
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
          { model: models.Images, attributes: ['uid', 'path', 'type'] }
        ],
        order: [
          ['createdAt', 'DESC']
        ]
      }).then((obj) => {
        for (var i = 0; i < obj.length; i++) {
          if (obj[i].dataValues.image !== null && obj[i].dataValues.imageUid !== null) {
            let image = obj[i].dataValues.image;
            let buffer = fs.readFileSync(image.path);
            let buffData = 'data:' + obj[i].dataValues.image.dataValues.type + ';base64,' + buffer.toString('base64');
            obj[i].dataValues.image.dataValues.data = buffData;
          }
        }
        console.log('complete');
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
  newImage: (uid, path, obj, buffer, cb) => {
    models.Images.create({
      uid: uid,
      path: path,
      type: obj.type,
      size: obj.size,
      userUid: obj.owner,
      buffer: buffer
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
