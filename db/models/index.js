'use strict';

const Product = require('./product')
const Review = require('./review');
const Users = require('./users');
const UserLogs = require('./userlogs');
const Invitations = require('./invitations');
const Guestbook = require('./guestbook');
const Images = require('./images');
const Email = require('./email');
const Attachment = require('./attachment');
const Notification = require('./notification');
const Profile = require('./profile');

Product.hasMany(Review);
Review.belongsTo(Product);
Users.hasMany(Invitations);
UserLogs.belongsTo(Users);
Guestbook.belongsTo(Users);
Guestbook.belongsTo(Images);
Images.belongsTo(Users);
Attachment.belongsTo(Email);
Notification.belongsTo(Users, { as: 'sender' });
Notification.belongsTo(Users, { as: 'reciever' });
Profile.belongsTo(Users);

module.exports = {
  Users,
  UserLogs,
  Guestbook,
  Images,
  Invitations,
  Notification,
  Profile,
  Email,
  Attachment,
  Product,
  Review
};
