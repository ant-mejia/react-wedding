'use strict'

const Sequelize = require('sequelize');
const db = require('../index.js');

const Images = db.define('images', {
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
  buffer: {
    type: Sequelize.TEXT
  },
  size: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: false
    }
  }
});

module.exports = Images;
