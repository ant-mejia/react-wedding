// server/app.js
const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const passportLocal = require('./auth/local');
const authHelpers = require('./auth/auth-helpers');
const dbm = require('./db-helpers');
const db = require('../db/index');
const app = express();
const models = require('../db/models/index');
const passport = require('passport');
require('dotenv').config();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


io.on('connection', function(socket) {
  console.log("Socket established with id: " + socket.id);
  socket.emit('hello', "TEST");

  socket.on('guestbook newMessage', (str) => {
    console.log(str);
    dbm.guestbook.newMessage(str);
    dbm.guestbook.getMessages((obj) => {
      socket.broadcast('guestbook update', obj)
    });
  })
  socket.on('disconnect', function() {
    console.log("Socket disconnected: " + socket.id);
  });

});

var gbs = io.of('/guestbook');

gbs.on('connection', function(socket) {
  this.user = null;
  console.log('someone connected');
  let token = socket.handshake.query.jta;
  jwt.verify(token, process.env.SK, (err, decoded) => {
    if (err) {
      console.log(err, 'err');
    }
    this.user = decoded;
  });

  socket.on('get messages', () => {
    dbm.guestbook.getMessages((data) => {
      socket.emit('update messages', data);
    });
  });

  socket.on('upload image', (file) => {
    let uid = authHelpers.generateUID();
    console.log(file.files['0']);
    var fileName = __dirname + '/fs/uploads/' + uid + '-' + this.user.uid + '.' + file.ext;
    fs.writeFile(fileName, file.buffer, function(err, data) {
      if (err) {
        return console.log(err);
      }
      dbm.image.logImage(uid, fileName, file.files['0'], (data) => {
        console.log(data);
      });
    });
  });

  socket.on('new message', (obj) => {
    dbm.guestbook.newMessage(obj, this.user.uid, (data) => {
      console.log("DATA: ", data.dataValues.uid);

      dbm.guestbook.getMessages((data) => {
        socket.emit('update messages', data);
      });
    });
  });

});
server.listen(5000);

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
//json parser
app.use(bodyParser.json())
// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')))
  // Serve our api
  .use('/api', require('./api'))

app.get('/guestbook', (req, res, next) => {
  if (req.headers.jwt && req.headers.jwt.length > 1) {
    req.body.jwt = req.headers.jwt;
    return next();
  } else {
    res.status(401).json({ 'message': 'Please sign in to continue' })
  }
  dbm.guestbook.newMessage('Message')
}, (req, res, next) => {
  authHelpers.verifyToken(req, res, next)
}, (req, res, next) => {
  dbm.guestbook.getMessages(req, res, next);
}, (req, res, next) => {
  res.json(req.msgs);
});


// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.use(passport.initialize());




app.post('/register', (req, res, next) => {
  authHelpers.verifyEmail(req, res, next);
}, (req, res, next) => {
  authHelpers.createUser(req, res)
    .then((obj) => {
      req.body.uid = obj.dataValues.uid;
      res.status(200)
        .json({
          message: "User registration successful",
          loginToken: {
            email: obj.dataValues.email,
            password: obj.dataValues.password
          }
        });
      authHelpers.userLog(req, res, next, 'created-user');
    })
    .catch((err) => {
      if (err.errors) {
        if (err.errors[0].message === 'email must be unique') {
          res.status(401)
            .json({
              name: "Invalid Email Address",
              message: "The email addres provided is already in use"
            });
        }
      }
    });
});

app.post('/logout', (req, res, next) => {
  if (req.body.jta) {
    jwt.verify(req.body.jta, process.env.SK, {
      ignoreExpiration: true
    }, (err, decoded) => {
      if (!err) {
        req.body.uid = decoded.uid
      }
    });
  } else if (req.body.user) {
    req.body.uid = req.body.user.uid
  }
  authHelpers.userLog(req, res, next, 'signed-out-user')
  res.json({
    message: "Logout Successful"
  });
}, (req, res, next) => {});

app.post('/login', (req, res, next) => {
  if (req.body.email && req.body.password) {
    req.body.user = req.body;
    authHelpers.verifyEmail(req, res, next);
  } else if (req.body.jwt) {
    authHelpers.verifyToken(req, res, next);
  }
}, (req, res, next) => {
  if (req.user) {
    models.Users.findAll({
      where: {
        uid: req.user.uid
      }
    }).then((d) => {
      console.log('YES!@');
    }).catch((a) => {
      console.log('Abd');
    })
    return res.json(req.user);
  }
  return next();
}, passportLocal.authenticate('local'), (req, res, next) => {
  let user = req.user;
  req.body.uid = user.uid;
  authHelpers.userLog(req, res, next, 'signed-in-user');
  res.json({
    user: req.user,
    jwt: authHelpers.generateToken(user, process.env.SK)
  });
});

module.exports = app;
