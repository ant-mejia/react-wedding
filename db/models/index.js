'use strict';

const Product = require('./product')
const Review = require('./review');
const Users = require('./users');
const UserLogs = require('./userlogs');
const Invitations = require('./invitations');
const Guestbook = require('./guestbook');
const Images = require('./images');

Product.hasMany(Review);
Review.belongsTo(Product);
Users.hasMany(Invitations);
UserLogs.belongsTo(Users);
Guestbook.belongsTo(Users);
Guestbook.belongsTo(Images);
Images.belongsTo(Users);

module.exports = {
  Users,
  UserLogs,
  Guestbook,
  Images,
  Invitations,
  Product,
  Review
};
