'use strict';

const Product = require('./product')
const Review = require('./review');
const Users = require('./users');
const UserLogs = require('./userlogs');
const Invitations = require('./invitations');
const Guestbook = require('./guestbook');

Product.hasMany(Review);
Review.belongsTo(Product);
Users.hasMany(Invitations);
UserLogs.belongsTo(Users);
Guestbook.belongsTo(Users);

module.exports = {
  Users,
  UserLogs,
  Guestbook,
  Invitations,
  Product,
  Review
};
