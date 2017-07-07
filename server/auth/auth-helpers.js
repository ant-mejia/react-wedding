const bcrypt = require('bcryptjs');
const models = require('../../db/models/index');
const passport = require('./local');
const jwt = require('jsonwebtoken');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

const generateUID = (length = 30) => {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

const generateToken = (data, secret) => {
  return jwt.sign(data, secret, {
    expiresIn: "14d"
  });
}

function verifyToken(req, res, next) {
  let token = req.body.jwt;
  jwt.verify(token, process.env.SK, (err, decoded) => {
    if (err) {
      console.log(err);
    }
    req.user = decoded;
    return next();
  });
}

function verifyEmail(req, res, next) {
  if (req.body.user.email !== "") {
    let erx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let emailFormat = erx.test(req.body.user.email);
    if (erx.test(req.body.user.email)) {
      return next();
    } else if (!emailFormat && req.body.user.email.length > 0) {
      res.status(401)
        .json({
          name: "Invalid Email Address",
          message: "The email addres provided is invalid"
        });
    } else {
      res.status(401)
        .json({
          name: "Sign In Error",
          message: "A sign-in error occured"
        })
        .done;
    }
  } else {
    res.status(401)
      .json({
        name: "Sign In Error",
        message: "Please provide an email address"
      });
  }
}

function userLog(req, res, next, action) {
  models.UserLogs.create({
    uid: generateUID(),
    action: action,
    userUid: req.body.uid
  });
  return next();
}

//user registration. These are the information the user will provide
function createUser(req, res) {
  let passwordVerify = {
    hasLowerCase: (str) => {
      return (/[a-z]/.test(str));
    },
    hasUpperCase: (str) => {
      return (/[A-Z]/.test(str));
    }
  };
  let user = req.body.user;
  if (user.password.length < 8) {
    return Promise.resolve(res.status(401)
      .json({
        name: 'Bad Password',
        message: "Password must be longer than 8 characters"
      }));
  } else if (user.password.length > 16) {
    return Promise.resolve(res.status(401)
      .json({
        name: 'Bad Password',
        message: "Password must be longer than 8 characters"
      }));
  } else if (!passwordVerify.hasLowerCase(user.password)) {
    return Promise.resolve(res.status(401)
      .json({
        name: 'Bad Password',
        message: "Password must contain at least one lowercase character"
      }));
  } else if (!passwordVerify.hasUpperCase(user.password)) {
    return Promise.resolve(res.status(401)
      .json({
        name: 'Bad Password',
        message: "Password must contain at least one uppercase character"
      }));
  } else {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(user.password, salt);
    return models.Users.create({
      uid: generateUID(),
      email: user.email,
      password: hash,
      firstname: user.firstname,
      lastname: user.lastname,
      party: user.party || null
    });
  }
}

function loginRequired(req, res, next) {
  if (!req.user)
    res.redirect('/login');

  return next();
}

function loginUser(passport, req, res) {}

module.exports = {
  comparePass,
  generateUID,
  generateToken,
  verifyEmail,
  verifyToken,
  userLog,
  loginRequired,
  createUser,
  loginUser
};
