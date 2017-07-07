'use strict'

const Sequelize = require('sequelize');
const db = require('../index.js');

const UserLogs = db.define('userlogs', {
    uid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    action: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = UserLogs;
