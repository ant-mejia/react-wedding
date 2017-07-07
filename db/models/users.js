'use strict'

const Sequelize = require('sequelize');
const db = require('../index.js');

const Users = db.define('users', {
  uid: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  firstname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  invites: Sequelize.ARRAY(Sequelize.STRING),
  party: Sequelize.STRING

});

module.exports = Users;
