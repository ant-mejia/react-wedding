'use strict'

const Sequelize = require('sequelize');
const db = require('../index.js');

const Email = db.define('email', {
  uid: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  from: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: false
    }
  },
  to: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: false
    }
  },
  subject: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: false
    }
  },
  attachments: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  recievedAt: {
    type: Sequelize.STRING
  },
  viewedAt: {
    type: Sequelize.STRING
  }
});

module.exports = Email;
