'use strict'

const Sequelize = require('sequelize');
const db = require('../index.js');

const Attachment = db.define('attachment', {
  uid: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  path: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: false
    }
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: false
    }
  },
  size: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: false
    }
  }
});

module.exports = Attachment;
