import { Mongo } from 'meteor/mongo';

export const Bookmarks = new Mongo.Collection('bookmarks');

Bookmarks.allow({
  insert(userId, bm) {
    return userId && bm.owner === userId;
  },
  update(userId, bm, fields, modifier) {
    return userId && bm.owner === userId;
  },
  remove(userId, bm) {
    return userId && bm.owner === userId;
  }
});