'use strict'

const Sequelize = require('sequelize');
const db = require('../index.js');

const Guestbook = db.define('guestbook', {
  uid: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false
  },
  recievedAt: {
    type: Sequelize.DATE
  },
  viewedAt: {
    type: Sequelize.DATE
  }

});

module.exports = Guestbook;
