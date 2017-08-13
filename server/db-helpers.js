const models = require('../db/models/index');
const passport = require('./auth/local');
const authHelpers = require('./auth/auth-helpers');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');
const fileType = require('file-type');
const fs = require('fs');
const handlebars = require('express-handlebars')
const hbs = require('nodemailer-express-handlebars');
const inlineBase64 = require('nodemailer-plugin-inline-base64');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: process.env.NODEMAIL_USER,
    pass: process.env.NODEMAIL_PASS
  }
});

let email = {
  logMail: (reciept, cb) => {
    let envelope = reciept.envelope
    let targets = envelope.to;
    let recievers = targets.map((target) => {
      return {
        uid: authHelpers.generateUID(),
        from: envelope.from,
        to: target,
        subject: envelope.subject
      }
    });
    models.Email.bulkCreate(recievers).then(() => {
      console.log('Logged Successfully!');
      cb();
    })
  },
  send: (config, callback) => {
    //reference the plugin
    //attach the plugin to the nodemailer transporter
    transporter.use('compile', hbs({
      viewEngine: handlebars.create({
        partialsDir: path.join(__dirname, 'views/partials')
      }),
      viewPath: path.join(__dirname, 'views/layouts')
    }));
    //send mail with options
    //If images are going to be included in email
    if (config.context.images !== undefined) {
      let imgs, attachments = [];
      imgs = config.context.images.map((filename) => {
        let cid = `${authHelpers.generateUID()}.${Date.now()}@antmejia.com`;
        let fpath = path.join(__dirname, 'fs/email/assets/' + filename);
        let attch = {
          filename: filename,
          path: fpath,
          cid: cid,
          contentDisposition: 'inline'
        };
        attachments.push(attch);
        return "cid:" + cid;
      });
      if (config.attachments === undefined) {
        config.attachments = attachments;
      } else {
        config.attachments = config.attachments.concat(attachments);
      }

      console.log('ATTACHMENT!!!', config.attachments);
      config.context.images = imgs;
    }
    transporter.use('compile', inlineBase64());
    console.log(config);
    transporter.sendMail(config, (error, info) => {
      if (error) {
        return console.log(error);
      }
      info.envelope.subject = config.subject;
      console.log(info);
      email.logMail(info, callback)
    });
  }
};

let notification = {
  create: (obj, cb) => {
    models.Notification.create({
      uid: authHelpers.generateUID(),
      type: obj.type,
      message: obj.message,
      link: obj.link,
      senderUid: 'JT1tvSAUnDt4KcwgsElb5qgReYi6kE',
      recieverUid: 'JT1tvSAUnDt4KcwgsElb5qgReYi6kE'
    }).then(() => {
      console.log('booya!');
    })
  },
  getMessages: (id) => {
    models.Notification.findAll({
      where: {
        recieverUid: id
      }
    }).then((data) => {
      console.log(data);
    })
  }
}

let guestbook = {
  newMessage: (obj, uid, cb) => {
    notification.create();
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
      notification.getMessages('JT1tvSAUnDt4KcwgsElb5qgReYi6kE');
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
      userUid: obj.owner
    }).then((data) => {
      if (cb && typeof cb === "function") {
        cb(data)
      }
    })
  }
}

module.exports = {
  email,
  notification,
  guestbook,
  image
};
