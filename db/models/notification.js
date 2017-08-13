'use strict'

const Sequelize = require('sequelize');
const db = require('../index.js');

const Notification = db.define('notification', {
  uid: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false
  },
  viewedAt: {
    type: Sequelize.DATE,
    allowNull: true
  }

});

module.exports = Notification;
