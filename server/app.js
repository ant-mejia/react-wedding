// server/app.js
const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const passportLocal = require('./auth/local');
const db = require('../db/index');
const app = express();
const models = require('../db/models/index');
const passport = require('passport');
require('dotenv').config();
const authHelpers = require('./auth/auth-helpers');
const dbm = require('./db-helpers');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const slogger = require('slogged')
const moment = require('moment');
var rfs = require('rotating-file-stream');
// Setup logger
var logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
let stream = rfs('file.log', { size: '10M', interval: '1d', path: logDirectory });

morgan.token('type', function(req, res) { return req.user ? req.user.email : 'anonymous' });
morgan.token('moment', function(req, res) { return moment().format("MM/DD/YYYY h:mm:ss a Z") });
app.use(morgan(':remote-addr - :type :referrer :moment ":method :url HTTP/:http-version" :status :response-time ms', {
  stream: stream
}));
io.use(slogger());

io.on('connection', function(socket) {
  socket.emit('hello', "TEST");

  socket.on('disconnect', function() {
    console.log("Socket disconnected: " + socket.id);
  });

});

var gbs = io.of('/guestbook');
gbs.use(slogger({ minimal: true }));
gbs.on('connection', function(socket) {
  this.user = null;
  let token = socket.handshake.query.jta;
  jwt.verify(token, process.env.SK, (err, decoded) => {
    if (err) {
      console.log(err, 'err');
    } else {
      this.user = decoded;
      // console.log(Object.keys(socket.client.request));
      console.log("Socket established with user: " + this.user.email);
    }
    // dbm.logSocket(params, )
  });

  socket.on('get messages', () => {
    dbm.guestbook.getMessages((data) => {
      console.log('got messages!');
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
    dbm.email.send({
      from: 'noreply@antmejia.com',
      to: 'to@antmejia.com',
      subject: 'Thanks for signing up!',
      template: 'notification',
      context: {
        title: 'Thanks for signing up!',
        button: "View Profile",
        // images: ['icons/wedding-rings.png'],
        body: ["Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."]
      }
    }, () => {
      console.log('Message successfully logged');
    });
    dbm.guestbook.newMessage(obj, this.user.uid, (data) => {
      console.log("DATA: ", data.dataValues.uid);
      dbm.guestbook.getMessages((data) => {
        gbs.emit('update messages', data);
      });
    });
  });

});
server.listen(5000);


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
      dbm.email.send({
        from: 'from@antmejia.com',
        to: 'to@antmejia.com',
        subject: 'Test',
        template: 'register',
        context: {
          name: 'Name'
        }
      });
      res.status(200).json({
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
