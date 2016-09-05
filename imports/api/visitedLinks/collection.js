import { Mongo } from 'meteor/mongo';

export const VisitedLinks = new Mongo.Collection('visitedlinks');

VisitedLinks.allow({
  insert(userId, link) {
    return userId && link.owner === userId;
  },
  update(userId, link, fields, modifier) {
    return userId && link.owner === userId;
  },
  remove(userId, link) {
    return userId && link.owner === userId;
  }
});