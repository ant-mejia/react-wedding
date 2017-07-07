'use strict'

const Sequelize = require('sequelize');
const db = require('../index.js');

const Invitations = db.define('invitations', {
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
    recieverId: {
        type: Sequelize.STRING,
        allowNull: true
    },
    recievedAt: {
        type: Sequelize.DATE
    },
    viewedAt: {
        type: Sequelize.DATE
    }

});

module.exports = Invitations;
