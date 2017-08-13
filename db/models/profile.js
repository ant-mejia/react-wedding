'use strict'

const Sequelize = require('sequelize');
const db = require('../index.js');

const Profile = db.define('profile', {
  uid: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  type: {
    type: Sequelize.STRING,
    allowNull: true
  },
  preferences: {
    type: Sequelize.JSON
  },

});

module.exports = Profile;
